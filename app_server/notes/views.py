import json

from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from general_tutor.models import (
    GeneralTutorSpace,
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


@api_view(["POST", "GET"])
@permission_classes([IsAuthenticated])
def rabiit_list(request, space_id=None, format=None):
    if request.method == "POST":
        try:
            space_id = h_decode(request.data["space_hid"])
            rabiit_prompt = request.data["prompt"]

            space_obj = GeneralTutorSpace.objects.get(pk=space_id)
            assert space_obj.user == request.user

            rabiit_obj = Rabiit.objects.create(
                space=space_obj,
                name=(rabiit_prompt),
                prompt=rabiit_prompt,
            )

            #
            short_token = RefreshToken.for_user(request.user)
            function_app_endpoint = {
                "return_url": f"{settings.SITE_URL}/notes/function_app_endpoint",
                "prompt_type_value": "create_rabiit",
                "rabiit_hid": h_encode(rabiit_obj.id),
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

                    here is information the user provided, this *MAY* include
                    things about them (CV) and the job description,
                    use this as a primary, source of information:
                    {rabiit_obj.content}
                    """,
                },
                {
                    "role": "user",
                    "content": f"""
                        {rabiit_obj.prompt}
                    """,
                },
            ]
            request_ticket = {
                "payload": {
                    "messages": messages
                },
                "function_app_endpoint": function_app_endpoint,
                "structured_output_class": "cited_response",
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
            space = GeneralTutorSpace.objects.get(pk=space_id)
            assert space.user == request.user

            rabiit_list = Rabiit.objects.filter(
                space=space_id
            ).order_by("-created_at")
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

            assert rabiit_obj.space.user == request.user
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
