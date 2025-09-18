from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from general_tutor.models import (
    GeneralTutorSpace,
)
from general_tutor.serializers import (
    GeneralTutorSpaceSerializer,
)
from core.utils import h_encode


@api_view(["POST", "GET"])
@permission_classes([IsAuthenticated])
def space_list(request, format=None):
    if request.method == "POST":
        try:
            # limit non member activity
            general_tutor_space = GeneralTutorSpace.objects.create(
                user=request.user, name=request.data["name"]
            )
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
            serializer = GeneralTutorSpaceSerializer(
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
