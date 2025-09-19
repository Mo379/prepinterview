from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from general_tutor.models import (
    GeneralTutorSpace,
)
from general_tutor.serializers import (
    GeneralTutorSpaceListSerializer,
    GeneralTutorSpaceSerializer,
)
from core.utils import h_encode

from notes.models import (
    general_learning_method,
    math_notation_prompt,
    markdown_annotation_prompt,
)


@api_view(["POST", "GET"])
@permission_classes([IsAuthenticated])
def space_list(request, format=None):
    if request.method == "POST":
        try:
            # limit non member activity
            general_tutor_space = GeneralTutorSpace.objects.create(
                user=request.user, name=request.data["name"],
                case_information=request.data['context']
            )

            #
            short_token = RefreshToken.for_user(request.user)
            function_app_endpoint = {
                "return_url": f"{settings.SITE_URL}/notes/function_app_endpoint",
                "prompt_type_value": "create_questions",
                "space_hid": h_encode(general_tutor_space.id),
            }
            # Optionally add the image
            messages = [
                {
                    "role": "system",
                    "content": f"""Youre a helpful interview coach for this student.
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
                    {general_tutor_space.case_information}
                    """,
                },
                {
                    "role": "user",
                    "content": """
                        Based on the provided information create a list of
                        questions using this inforamtion and expand to include
                        even more possible questions that may appear in a test
                        or job interview.
                    """,
                },
            ]
            request_ticket = {
                "payload": {
                    "messages": messages
                },
                "function_app_endpoint": function_app_endpoint,
                "structured_output_class": "structures_interview_questions",
                "access_token": str(short_token.access_token),
                "lambda_url": settings.MODEL_STRUCTURED_STREAM_URL,
            }
        except Exception:
            return Response(
                {"message": "Failed to create subscription."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        else:
            serializer = GeneralTutorSpaceSerializer(general_tutor_space)
            return Response(
                {
                    "data": serializer.data,
                    "request_ticket": request_ticket,
                    "message": "space successfully created!",
                },
                status=status.HTTP_200_OK,
            )
    elif request.method == "GET":
        try:
            subscriptions = GeneralTutorSpace.objects.filter(
                user=request.user
            ).order_by('-created_at')
        except Exception:
            return Response(
                {"message": "Failed to list subscriptions."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        else:
            serializer = GeneralTutorSpaceListSerializer(
                subscriptions, many=True
            )
            return Response(
                {
                    "data": serializer.data,
                    "message": "Space list successfully loaded.",
                },
                status=status.HTTP_200_OK,
            )
    else:
        return Response(
            {"message": "Failed to load subscription details"},
            status=status.HTTP_400_BAD_REQUEST,
        )


@api_view(["GET", "DELETE"])
@permission_classes([IsAuthenticated])
def space_detail(request, space_id, format=None):
    if request.method == "GET":
        space_obj = GeneralTutorSpace.objects.get(pk=space_id)
        serializer = GeneralTutorSpaceSerializer(
            space_obj, many=False
        )
        return Response(
            {
                "data": serializer.data,
                "message": "Subscription list successfully loaded",
            },
            status=status.HTTP_200_OK,
        )
    elif request.method == "DELETE":
        try:
            space_obj = GeneralTutorSpace.objects.get(pk=space_id)
            space_obj.delete()
        except Exception:
            return Response(
                {"message": "Failed to load subscription details"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        else:
            return Response(
                {
                    "data": h_encode(space_id),
                    "message": "Case successfully deleted",
                },
                status=status.HTTP_200_OK,
            )
    else:
        return Response(
            {"message": "Failed to load subscription details"},
            status=status.HTTP_400_BAD_REQUEST,
        )
