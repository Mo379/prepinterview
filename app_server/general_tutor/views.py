from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from sources.models import Source
from general_tutor.models import (
    GeneralTutorSpace,
    GeneralTutorSpaceSubscription,
    GeneralTutorLesson,
)
from general_tutor.serializers import (
    GeneralTutorSpaceSerializer,
    GeneralTutorSpaceSubscriptionSerializer,
    GeneralTutorLessonSerializer,
)
from core.utils import h_decode, h_encode


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def space_settings(request, space_id=None, format=None):
    if request.method == "PUT":
        try:
            general_tutor_space = GeneralTutorSpace.objects.get(
                user=request.user, pk=space_id
            )
        except Exception:
            return Response(
                {"message": "Unknown error has occurred"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer = GeneralTutorSpaceSerializer(
            general_tutor_space, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "data": serializer.data,
                    "message": "Space updated!",
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"message": "Failed to load space details"},
                status=status.HTTP_400_BAD_REQUEST,
            )
    else:
        return Response(
            {"message": "Unknown error has occurred"},
            status=status.HTTP_400_BAD_REQUEST,
        )


@api_view(["POST", "GET"])
@permission_classes([IsAuthenticated])
def space_subscription_list(request, format=None):
    if request.method == "POST":
        try:
            # limit non member activity
            general_tutor_space = GeneralTutorSpace.objects.create(
                user=request.user, name=request.data["name"]
            )
            subscription = GeneralTutorSpaceSubscription.objects.create(
                space=general_tutor_space,
                user=request.user,
                is_owner=True
            )
        except Exception as e:
            raise e
            return Response(
                {"message": "Failed to create subscription."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        else:
            serializer = GeneralTutorSpaceSubscriptionSerializer(subscription)
            return Response(
                {
                    "data": serializer.data,
                    "message": "space successfully created!",
                },
                status=status.HTTP_200_OK,
            )
    elif request.method == "GET":
        try:
            subscriptions = GeneralTutorSpaceSubscription.objects.filter(
                user=request.user
            ).order_by('-created_at')
        except Exception:
            return Response(
                {"message": "Failed to list subscriptions."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        else:
            serializer = GeneralTutorSpaceSubscriptionSerializer(
                subscriptions, many=True
            )
            return Response(
                {
                    "data": serializer.data,
                    "message": "Space subscription list successfully loaded.",
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
def space_subscription_detail(request, space_id, format=None):
    if request.method == "GET":
        space_obj = GeneralTutorSpace.objects.get(pk=space_id)
        subscription_obj = GeneralTutorSpaceSubscription.objects.get(
            user=request.user,
            space=space_obj
        )
        serializer = GeneralTutorSpaceSubscription(
            subscription_obj, many=False)
        return Response(
            {
                "data": serializer.data,
                "message": "Subscription list successfully loaded",
            },
            status=status.HTTP_200_OK,
        )
    elif request.method == "PUT":
        space_obj = GeneralTutorSpace.objects.get(pk=space_id)
        subscription_obj = GeneralTutorSpaceSubscription.objects.get(
            user=request.user,
            space=space_obj
        )
        serializer = GeneralTutorSpaceSubscription(
            subscription_obj,
            data=request.data
        )
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "data": serializer.data,
                    "message": "Subscription detail successfully modified",
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"message": "Failed to load subscription details"},
                status=status.HTTP_400_BAD_REQUEST,
            )
    elif request.method == "DELETE":
        try:
            space_obj = GeneralTutorSpace.objects.get(pk=space_id)
            subscription_obj = GeneralTutorSpaceSubscription.objects.get(
                user=request.user,
                space=space_obj
            )
            subscription_id = subscription_obj.id
            if subscription_obj.is_owner:
                space_obj.delete()
            else:
                subscription_obj.delete()
        except Exception:
            return Response(
                {"message": "Failed to load subscription details"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        else:
            return Response(
                {
                    "data": h_encode(subscription_id),
                    "message": "Subscription detail successfully deleted",
                },
                status=status.HTTP_200_OK,
            )
    else:
        return Response(
            {"message": "Failed to load subscription details"},
            status=status.HTTP_400_BAD_REQUEST,
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def space_open(request, format=None):
    if request.method == "POST":
        try:
            # limit non member activity
            general_tutor_space = GeneralTutorSpace.objects.get(
                user=request.user, pk=h_decode(request.data["space_hid"])
            )
            general_tutor_space.is_open = True
            general_tutor_space.save()

        except Exception:
            return Response(
                {"message": "Failed to create subscription."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        else:
            serializer = GeneralTutorSpaceSerializer(
                general_tutor_space
            )
            return Response(
                {
                    "data": serializer.data,
                    "message": "space successfully opened!",
                },
                status=status.HTTP_200_OK,
            )
    else:
        return Response(
            {"message": "Failed to load subscription details"},
            status=status.HTTP_400_BAD_REQUEST,
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def space_join(request, format=None):
    if request.method == "POST":
        try:
            # limit non member activity
            general_tutor_space = GeneralTutorSpace.objects.get(
                pk=h_decode(request.data["space_hid"])
            )
            GeneralTutorSpaceSubscription.objects.get_or_create(
                space=general_tutor_space,
                user=request.user,
            )
            subscriptions = GeneralTutorSpaceSubscription.objects.filter(
                user=request.user
            ).order_by('-created_at')
            assert general_tutor_space.is_open
        except Exception:
            return Response(
                {"message": "Failed to create subscription."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        else:
            serializer = GeneralTutorSpaceSubscriptionSerializer(
                subscriptions, many=True
            )
            return Response(
                {
                    "data": serializer.data,
                    "message": "space successfully created!",
                },
                status=status.HTTP_200_OK,
            )
    else:
        return Response(
            {"message": "Failed to load subscription details"},
            status=status.HTTP_400_BAD_REQUEST,
        )


@api_view(["POST", "GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def lesson_detail(request, id=None, format=None):
    if request.method == "POST":
        try:
            assert isinstance(request.data["space_hid"], str) is True
            assert isinstance(request.data["reading_title"], str) is True
            assert isinstance(request.data["source_hid"], str) is True
            assert len(request.data["reading_title"]) <= 5000

            space_obj = GeneralTutorSpace.objects.get(
                pk=h_decode(request.data["space_hid"])
            )
            subscription_obj = GeneralTutorSpaceSubscription.objects.get(
                user=request.user, space=space_obj
            )
            source_obj = Source.objects.get(
                pk=h_decode(request.data["source_hid"])
            )
            assert source_obj.source_type in ['PDF', 'WEBDOC', 'WORD']
        except Exception as e:
            raise e
            return Response(
                {"message": "Unknown error has occurred."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        else:
            general_tutor_lesson = GeneralTutorLesson.objects.create(
                user=request.user,
                lessontitle=request.data["reading_title"],
                space_subscription=subscription_obj,
                source=source_obj,
            )
            serializer = GeneralTutorLessonSerializer(general_tutor_lesson)
            return Response(
                {
                    "data": {
                        "general_tutor_lesson": serializer.data,
                    },
                    "message": "General Tutor Lesson successfully created",
                },
                status=status.HTTP_200_OK,
            )
    if request.method == "GET":
        try:
            general_tutor_lesson = GeneralTutorLesson.objects.get(
                user=request.user, pk=id
            )
        except Exception:
            return Response(
                {"message": "Unknown error has occurred"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        else:
            serializer = GeneralTutorLessonSerializer(general_tutor_lesson)
            return Response(
                {
                    "data": {
                        "general_tutor_lesson": serializer.data,
                    },
                    "message": "General Tutor Lesson details successfully loaded",
                },
                status=status.HTTP_200_OK,
            )
    elif request.method == "PUT":
        try:
            general_tutor_lesson = GeneralTutorLesson.objects.get(
                user=request.user, pk=id
            )
        except Exception:
            return Response(
                {"message": "Unknown error has occurred"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer = GeneralTutorLessonSerializer(
            general_tutor_lesson, data=request.data
        )
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "data": serializer.data,
                    "message": "Lesson status updated!",
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"message": "Failed to load General Tutor Lesson details"},
                status=status.HTTP_400_BAD_REQUEST,
            )
    elif request.method == "DELETE":
        try:
            general_tutor_lesson = GeneralTutorLesson.objects.get(
                user=request.user, pk=id
            )
            general_tutor_lesson.delete()
        except Exception:
            return Response(
                {"message": "Unknown error has occurred"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        else:
            return Response(
                {
                    "data": h_encode(id),
                    "message": "General Tutor Lesson successfully deleted",
                },
                status=status.HTTP_200_OK,
            )
    else:
        return Response(
            {"message": "Unknown error has occurred"},
            status=status.HTTP_400_BAD_REQUEST,
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def lesson_list(request, space_id=None, format=None):
    if request.method == "GET":
        from rest_framework.pagination import PageNumberPagination

        class GeneralTutorLessonPagination(PageNumberPagination):
            page_size = 20
            page_query_param = "page"

        paginator = GeneralTutorLessonPagination()

        try:
            space_obj = GeneralTutorSpace.objects.get(pk=space_id)
            space_subscription_obj = GeneralTutorSpaceSubscription.objects.get(
                user=request.user, space=space_obj
            )

            general_tutor_lessons = GeneralTutorLesson.objects.filter(
                space_subscription=space_subscription_obj
            ).order_by("-created_at")
            result_page = paginator.paginate_queryset(
                general_tutor_lessons, request)
        except Exception as e:
            print(e)
            return Response(
                {"message": "Unknown error has occurred."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        else:
            serializer = GeneralTutorLessonSerializer(result_page, many=True)
            completed_lessons = general_tutor_lessons.filter(completed=True)
            page_number = request.GET.get(
                "page") if request.GET.get("page") else -1
            return Response(
                {
                    "data": {
                        "general_tutor_lessons": serializer.data,
                        "lesson_counts": {
                            "total_lessons": len(general_tutor_lessons),
                            "completed_lessons": len(completed_lessons),
                        },
                        "hasMore": True if paginator.get_next_link() else False,
                        "nextPage": (
                            int(page_number) +
                            1 if paginator.get_next_link() else False
                        ),
                    },
                    "message": "General Tutor Lesson list successfully loaded",
                },
                status=status.HTTP_200_OK,
            )
    else:
        return Response(
            {"message": "Unknown error has occurred"},
            status=status.HTTP_400_BAD_REQUEST,
        )


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def lesson_update(request, id=None, format=None):
    if request.method == "PUT":
        try:
            general_tutor_lesson = GeneralTutorLesson.objects.get(pk=id)
            space_subscription_obj = general_tutor_lesson.space_subscription
            general_tutor_lessons = GeneralTutorLesson.objects.filter(
                user=request.user, space_subscription=space_subscription_obj
            )
        except Exception as e:
            raise e
            return Response(
                {"message": "Unknown error has occurred"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer = GeneralTutorLessonSerializer(
            general_tutor_lesson, data=request.data
        )
        if serializer.is_valid():
            serializer.save()
            completed_lessons = general_tutor_lessons.filter(completed=True)
            return Response(
                {
                    "data": {
                        "lesson": serializer.data,
                        "lesson_counts": {
                            "total_lessons": len(general_tutor_lessons),
                            "completed_lessons": len(completed_lessons),
                        },
                    },
                    "message": "Lesson status updated!",
                },
                status=status.HTTP_200_OK,
            )
    else:
        return Response(
            {"message": "Unknown error has occurred"},
            status=status.HTTP_400_BAD_REQUEST,
        )
