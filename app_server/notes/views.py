import json

from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from general_tutor.models import (
    GeneralTutorLesson,
)
from notes import functions_endpoint
from notes.models import (
    Rabiit,
    general_learning_method,
    math_notation_prompt,
    markdown_annotation_prompt,
)
from notes.serializers import (
    RabiitSerializer,
)
from core.utils import h_decode, h_encode
from sources.models import get_context_chunks, get_query_string_embedding_vector


@api_view(["POST", "GET"])
@permission_classes([IsAuthenticated])
def rabiit_list(request, lesson_type=None, lesson_id=None, format=None):
    if request.method == "POST":
        try:
            is_general_tutor = request.data["is_general_tutor"]
            lesson_id = h_decode(request.data["lesson_hid"])
            highlighted_text = request.data["highlightedText"]
            selected_image_url = request.data.get("selectedImageUrl") or None
            rabiit_prompt = request.data["prompt"]
            if is_general_tutor:
                lesson = GeneralTutorLesson.objects.get(pk=lesson_id)
                lesson_context = f"""
                chapter/area of study name: {lesson.space_subscription.space.name}
                {lesson.lessontitle}
                {lesson.source.full_content}
                """
                filter_params = {"generaltutorlesson": lesson}
                source_filter_params = {"space": lesson.space_subscription.space}
                assert lesson.user == request.user

            embedding_result = get_query_string_embedding_vector(
                f"""
                {highlighted_text}
                {rabiit_prompt}
            """
            )
            search_vector = embedding_result["embeddings"][0]["embedding"]
            citation_context, bibliography = get_context_chunks(
                source_filter_params, search_vector
            )

            rabiit_obj = Rabiit.objects.create(
                **filter_params,
                name=(rabiit_prompt),
                prompt=rabiit_prompt,
                highlighted_text=highlighted_text,
                selected_image_url=selected_image_url,
            )

            #
            short_token = RefreshToken.for_user(request.user)
            function_app_endpoint = {
                "return_url": f"{settings.SITE_URL}/notes/function_app_endpoint",
                "prompt_type_value": "create_rabiit",
                "rabiit_hid": h_encode(rabiit_obj.id),
                "is_general_tutor": is_general_tutor,
            }
            # Optionally add the image
            messages = [
                {
                    "role": "system",
                    "content": f"""Youre a helpful tutor for this student.
                    Your responses are detailed plain paragraph explanations
                    with unnessasary introduction, use minimal headings, jump
                    straight to the point that the student wants to learn.
                    {general_learning_method}
                    Follow the math notation requirements strictly when
                    writing maths.
                    {math_notation_prompt}

                    Follow the highlighting notation:
                    {markdown_annotation_prompt}


                    ***

                    Unless the user prompt specifically requests similar
                    details, avoid repeating this content.
                    ***

                    {citation_context}

                    here is information about the topic/paper/article/book
                    that the studen is learning about, use this as a primary
                    source of information:
                    {lesson_context}

                    **
                    if an image is provided then only explain it
                    within the context
                    **
                    """,
                },
                {
                    "role": "user",
                    "content": f"""
                    {general_learning_method}
                    Follow the math notation requirements strictly when
                    writing maths.
                    {math_notation_prompt}

                    Follow the highlighting notation:
                    {markdown_annotation_prompt}

                    {rabiit_obj.prompt}
                    """,
                },
            ]
            if selected_image_url:
                messages.append(
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": selected_image_url,
                                },
                            }
                        ],
                    }
                )
            request_ticket = {
                "payload": {
                    "messages": messages
                },
                "function_app_endpoint": function_app_endpoint,
                "structured_output_class": "cited_response",
                "bibliography": bibliography,
                "access_token": str(short_token.access_token),
                "lambda_url": settings.MODEL_STRUCTURED_STREAM_URL,
            }
        except Exception as e:
            print(e)
            return Response(
                {"message": "Unknown error has occurred"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        else:
            serializer = RabiitSerializer(rabiit_obj)
            return Response(
                {
                    "data": serializer.data,
                    "request_ticket": request_ticket,
                    "message": "Rabiits listed",
                },
                status=status.HTTP_200_OK,
            )
    elif request.method == "GET":
        try:
            if lesson_type == "general_tutor_lesson":
                lesson = GeneralTutorLesson.objects.get(pk=lesson_id)
                filter_params = {"generaltutorlesson": lesson}
                assert lesson.user == request.user

            rabiit_list = Rabiit.objects.filter(
                **filter_params).order_by("-created_at")
        except Exception as e:
            print(e)
            return Response(
                {"message": "Unknown error has occurred"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        else:
            serializer = RabiitSerializer(rabiit_list, many=True)
            return Response(
                {
                    "data": serializer.data,
                    "message": "rabiits listed",
                },
                status=status.HTTP_200_OK,
            )
    else:
        return Response(
            {"message": "Unknown error has occurred"},
            status=status.HTTP_400_BAD_REQUEST,
        )


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def rabiit_detail(request, rabiit_id, format=None):
    if request.method == "DELETE":
        try:
            rabiit_obj = Rabiit.objects.get(pk=rabiit_id)

            if rabiit_obj.generaltutorlesson:
                assert rabiit_obj.generaltutorlesson.user == request.user
            else:
                assert rabiit_obj.lesson.coursesubscription.user == request.user
            assert rabiit_obj is not False
            rabiit_obj.delete()
        except Exception as e:
            print(e)
            return Response(
                {
                    "silent": 0,
                    "message": "An error occurred while attempting to delete.",
                    "toast_variant": "destructive",
                    "errors": [
                        {
                            "name": "root",
                            "type": "manual",
                            "alert_type": "destructive",
                            "message": "Something went wrong, cannot remove rabiit."
                            + "team, please try again.",
                        }
                    ],
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        else:
            return Response(
                {
                    "silent": 1,
                    "message": "removed!",
                    "toast_variant": "success",
                    "data": {"hid": h_encode(rabiit_id)},
                },
                status=status.HTTP_200_OK,
            )
    else:
        return Response(
            {"message": "Unknown error has occurred"},
            status=status.HTTP_400_BAD_REQUEST,
        )


@csrf_exempt
@api_view(["POST"])
def function_app_endpoint(request):
    if request.method == "POST":
        json_data = json.loads(request.body)
        if "auth_key" not in json_data.keys():
            return Response(
                {"message": "Unknown error has occurred"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        #
        if json_data["auth_key"] == settings.AUTH_KEY:
            if (
                json_data["prompt_type_value"]
                and json_data["prompt_type_value"] == "create_rabiit"
            ):
                return functions_endpoint.create_rabiit(request, json_data)
            else:
                return Response(
                    {"message": "Unknown error has occurred"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        else:
            return Response(
                {"message": "Unknown error has occurred"},
                status=status.HTTP_400_BAD_REQUEST,
            )
    else:
        return Response(
            {"message": "Unknown error has occurred"},
            status=status.HTTP_400_BAD_REQUEST,
        )
