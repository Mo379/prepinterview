import json

from django.db.models import Q, Subquery
from django.db.models import Case, When, Value, IntegerField
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from general_tutor.models import GeneralTutorSpace
from sources.models import Source, SourceActivation, SourceLessonActivation, Chunk
from sources.serializers import (
    SourceListSerializer,
    SourceActivationSerializer,
    SourceStatusSerializer,
    SourceDetailSerializer,
    ChunkSerializer,
)
from sources import utils as source_utils
from sources import pipeline_save_fns
from core.utils import h_decode, h_encode

# Create your views here.


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def upload_ticket(request, format=None):
    if request.method == "POST":
        try:
            upload_files = request.FILES.getlist("Uploadfiles")
            picker_files = request.POST.get("PickerFiles")
            website_url = request.POST.get("WebsiteURL")
            web_doc = request.POST.get("DocumentURL")
            raw_text = request.POST.get("RawText")

            source_type = False
            if upload_files:
                source_type = "upload_files"
            if picker_files:
                source_type = "picker_files"
            if website_url:
                source_type = "website_url"
            if web_doc:
                source_type = "web_doc"
            if raw_text:
                source_type = "raw_text"

            if not source_type:
                raise Exception("Unknown source_type!")
        except Exception as e:
            print(e)
            return Response(
                {"message": "Unknown error has occurred"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        else:
            serializer = False
            if source_type == "upload_files":
                source_obj = source_utils.process_upload_files(
                    user=request.user,
                    is_general_tutor=request.POST.get("is_general_tutor"),
                    object_id=h_decode(request.POST.get("object_hid")),
                    upload_files=upload_files,
                )
                can_be_many = True
            if source_type == "picker_files":
                picker_files = json.loads(picker_files)
                source_obj = source_utils.process_picker_files(
                    user=request.user,
                    is_general_tutor=request.POST.get("is_general_tutor"),
                    object_id=h_decode(request.POST.get("object_hid")),
                    picker_files=picker_files,
                )
                can_be_many = True
            if source_type == "website_url":
                website_url = json.loads(website_url)
                source_obj = source_utils.process_website_url(
                    user=request.user,
                    is_general_tutor=request.POST.get("is_general_tutor"),
                    object_id=h_decode(request.POST.get("object_hid")),
                    name=website_url["name"],
                    url=website_url["content"],
                )
                can_be_many = False
            if source_type == "web_doc":
                webdoc = json.loads(web_doc)
                source_obj = source_utils.process_webdoc(
                    user=request.user,
                    is_general_tutor=request.POST.get("is_general_tutor"),
                    object_id=h_decode(request.POST.get("object_hid")),
                    name=webdoc["name"],
                    url=webdoc["url"],
                )
                can_be_many = False
            if source_type == "raw_text":
                raw_text = json.loads(raw_text)
                source_obj = source_utils.process_raw_text(
                    user=request.user,
                    is_general_tutor=request.POST.get("is_general_tutor"),
                    object_id=h_decode(request.POST.get("object_hid")),
                    name=raw_text["name"],
                    content=raw_text["content"],
                )
                can_be_many = False
            serializer = (
                SourceListSerializer(
                    source_obj, many=can_be_many, context={"request_user": request.user}
                )
                if source_obj
                else False
            )
            if not serializer:
                return Response(
                    {
                        "silent": 0,
                        "message": "Unknown error has occurred,"
                        + "check your source type.",
                        "toast_variant": "destructive",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
            return Response(
                {
                    "data": serializer.data,
                    "message": "New source added",
                },
                status=status.HTTP_200_OK,
            )
    else:
        return Response(
            {"message": "Unknown error has occurred"},
            status=status.HTTP_400_BAD_REQUEST,
        )


@api_view(["POST"])
def pipeline_endpoint(request, format=None):
    if request.method == "POST":
        try:
            json_data = json.loads(request.body)
            source_type = json_data["ai_response"]["source_type"]
            source_id = h_decode(json_data["ai_response"]["source_hid"])
            source_obj = Source.objects.get(id=source_id)

            if "auth_key" not in json_data.keys():
                return Response(
                    {"message": "Unknown error has occurred"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            #
            if json_data["auth_key"] == settings.AUTH_KEY:
                if not request:
                    raise Exception("Unknown source_type!")

            if source_type in ["PDF", "WORD"]:
                saved = pipeline_save_fns.process_pdf(source_obj, json_data)
            elif source_type == "IMG":
                saved = pipeline_save_fns.process_img(source_obj, json_data)
                source_obj.full_content = json_data["ai_response"]["full_content"]
            elif source_type == "TEXT":
                saved = pipeline_save_fns.process_text(source_obj, json_data)
            elif source_type == "WEB":
                saved = pipeline_save_fns.process_web(source_obj, json_data)
                source_obj.full_content = json_data["ai_response"]["full_content"]
            elif source_type == "WEBDOC":
                saved = pipeline_save_fns.process_pdf(source_obj, json_data)
            assert saved, "failed to save input"
            source_obj.pipeline_completed = True
            source_obj.save()
        except Exception as e:
            print(e)
            source_obj.pipeline_completed = False
            source_obj.pipeline_failed = True
            source_obj.save()
            return Response(
                {"message": "Unknown error has occurred"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        else:
            return Response(
                {
                    "message": "New source data saved.",
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
def confirm_file_upload(request, source_id, format=None):
    if request.method == "GET":
        try:
            source_obj = Source.objects.get(user=request.user, pk=source_id)
            file_exists = source_obj.s3_file_exists()
            assert file_exists
        except Exception as e:
            print(e)
            return Response(
                {"message": "Unknown error has occurred"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        else:
            serializer = SourceListSerializer(
                source_obj, context={"request_user": request.user}
            )
            return Response(
                {
                    "data": serializer.data,
                    "message": "source confirmed.",
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
def source_list(request, object_type, object_id, format=None):
    if request.method == "GET":
        try:
            user_admin_access = [request.user]
            if object_type == "general_tutor":
                space_obj = GeneralTutorSpace.objects.get(pk=object_id)
                filter_params = {"space": space_obj}
                author = space_obj.user

            user_admin_access.append(author)

            source_list = (
                Source.objects.filter(**filter_params)
                .annotate(
                    preferred_order=Case(
                        When(user_id=author.id, then=Value(0)),
                        default=Value(1),
                        output_field=IntegerField(),
                    )
                )
                .order_by("-preferred_order", "-created_at")
            )
        except Exception:
            return Response(
                {"message": "Unknown error has occurred"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        else:
            serializer = SourceListSerializer(
                source_list, many=True, context={"request_user": request.user}
            )
            return Response(
                {
                    "data": {"source_list": serializer.data},
                    "message": "sources listed",
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
def source_activation(request, object_type, object_id, lesson_key, format=None):
    if "undefined" in lesson_key:
        lesson_key = ""
    if ".json" in lesson_key:
        lesson_key = lesson_key.split(".json")[0]
    if request.method == "GET":
        try:
            if object_type == "general_tutor":
                space_obj = GeneralTutorSpace.objects.get(pk=object_id)
                author = space_obj.user
                filter_params = {"source__space": space_obj}

            # 1) Which sources are mandatory for the author?
            mandatory_sources_qs = SourceActivation.objects.filter(
                user=author,
                **filter_params,
                is_mandatory=True,
            ).values("source_id")
            # 2) Which activations are “custom” for the current user?
            custom_qs = SourceActivation.objects.filter(
                user=request.user,
                **filter_params,
            ).exclude(source_id__in=Subquery(mandatory_sources_qs))
            # 3) Everything else (“premade”) for the author:
            premade_qs = SourceActivation.objects.filter(
                user=author,
                **filter_params,
            ).exclude(
                Q(source_id__in=Subquery(mandatory_sources_qs))
                | Q(id__in=Subquery(custom_qs.values("id")))
            )
            # Finally pull just the lists of IDs if you really need them:
            mandatory_sources = mandatory_sources_qs.values_list("id", flat=True)
            custom_activations = custom_qs.values_list("id", flat=True)
            premade_activations = premade_qs.values_list("id", flat=True)

            source_activations = (
                mandatory_sources | custom_activations | premade_activations
            )
            source_activations = SourceActivation.objects.filter(
                pk__in=source_activations
            )
        except Exception:
            return Response(
                {"message": "Unknown error has occurred"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        else:
            serializer = SourceActivationSerializer(
                source_activations,
                context={
                    "lesson_key": lesson_key,
                    "request_user": request.user,
                },
                many=True,
            )
            return Response(
                {
                    "data": serializer.data,
                    "message": "sources listed",
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
def source_activation_update(request, source_id, format=None):
    if request.method == "PUT":
        try:
            source_obj = Source.objects.get(pk=source_id)
            author = source_obj.user
            is_author = author == request.user
            is_global = request.data.get("is_global", None)
            is_mandatory = request.data.get("is_mandatory", None)

            if is_author is False:
                author_activation = SourceActivation.objects.filter(
                    user=author, source=source_obj
                )
                if len(author_activation) > 0 and author_activation[0].is_mandatory:
                    raise Exception("Unautherised edit")

            source_activation_obj, _ = SourceActivation.objects.get_or_create(
                user=request.user, source=source_obj
            )
            if is_global is not None:
                source_activation_obj.is_global = bool(is_global)
            if is_mandatory is not None:
                source_activation_obj.is_mandatory = bool(is_mandatory)
            source_activation_obj.save()
        except Exception as e:
            print(e)
            return Response(
                {"message": "Unknown error has occurred"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        else:
            serializer = SourceActivationSerializer(
                source_activation_obj,
                context={
                    "request_user": request.user,
                },
            )
            return Response(
                {
                    "data": serializer.data,
                    "message": "sources listed",
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
def source_lesson_activation_update(request, format=None):
    if request.method == "PUT":
        try:
            source_id = h_decode(request.data["source_hid"])
            lesson_key = request.data["lesson_key"]
            is_active_lesson = request.data.get("is_active", None)
            source_obj = Source.objects.get(pk=source_id)
            author = source_obj.user
            is_author = author == request.user

            if is_author is False:
                author_activation = SourceActivation.objects.filter(
                    user=author, source=source_obj
                )
                if len(author_activation) > 0 and author_activation[0].is_mandatory:
                    raise Exception("Unautherised edit")

            source_activation_obj, _ = SourceActivation.objects.get_or_create(
                user=request.user, source=source_obj
            )
            source_lesson_activation_obj, _ = (
                SourceLessonActivation.objects.get_or_create(
                    source_activation=source_activation_obj,
                    lesson_key=lesson_key,
                )
            )
            if is_active_lesson is not None:
                source_lesson_activation_obj.is_active = bool(is_active_lesson)
            source_lesson_activation_obj.save()
        except Exception as e:
            print(e)
            return Response(
                {"message": "Unknown error has occurred"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        else:
            return Response(
                {
                    "data": {
                        "lesson_key": source_lesson_activation_obj.lesson_key,
                        "is_active": source_lesson_activation_obj.is_active,
                    },
                    "message": "sources listed",
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
def source_status_list(request, object_type, object_id, format=None):
    if request.method == "GET":
        try:
            user_admin_access = [request.user]
            if object_type == "general_tutor":
                space_obj = GeneralTutorSpace.objects.get(pk=object_id)
                filter_params = {"space": space_obj}
                author = space_obj.user

            user_admin_access.append(author)

            source_list = Source.objects.filter(
                user__in=user_admin_access, **filter_params
            ).order_by("-created_at")
        except Exception:
            return Response(
                {"message": "Unknown error has occurred"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        else:
            serializer = SourceStatusSerializer(source_list, many=True)
            return Response(
                {
                    "data": {"source_list": serializer.data},
                    "message": "sources listed",
                },
                status=status.HTTP_200_OK,
            )
    else:
        return Response(
            {"message": "Unknown error has occurred"},
            status=status.HTTP_400_BAD_REQUEST,
        )


@api_view(["GET", "DELETE"])
@permission_classes([IsAuthenticated])
def source_detail(request, source_id, format=None):
    if request.method == "GET":
        try:
            source_obj = Source.objects.get(pk=source_id)
        except Exception as e:
            print(e)
            return Response(
                {
                    "silent": 0,
                    "message": "An error occurred while attempting to delete source.",
                    "toast_variant": "destructive",
                    "errors": [
                        {
                            "name": "root",
                            "type": "manual",
                            "alert_type": "destructive",
                            "message": "Something went wrong, cannot remove source."
                            + "team, please try again.",
                        }
                    ],
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        else:
            serializer = SourceDetailSerializer(source_obj)
            return Response(
                {
                    "silent": 1,
                    "message": "Source loaded!",
                    "toast_variant": "success",
                    "data": serializer.data,
                },
                status=status.HTTP_200_OK,
            )

    elif request.method == "DELETE":
        try:
            source_obj = Source.objects.get(pk=source_id, user=request.user)
            source_obj.delete()
        except Exception as e:
            print(e)
            return Response(
                {
                    "silent": 0,
                    "message": "An error occurred while attempting to delete source.",
                    "toast_variant": "destructive",
                    "errors": [
                        {
                            "name": "root",
                            "type": "manual",
                            "alert_type": "destructive",
                            "message": "Something went wrong, cannot remove source."
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
                    "message": "Source removed!",
                    "toast_variant": "success",
                    "data": {"hid": h_encode(source_id)},
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
def chunk_detail(request, chunk_id, format=None):
    if request.method == "GET":
        try:
            chunk_obj = Chunk.objects.get(pk=chunk_id)
        except Exception:
            return Response(
                {
                    "silent": 0,
                    "message": "An error occurred while attempting to delete source.",
                    "toast_variant": "destructive",
                    "errors": [
                        {
                            "name": "root",
                            "type": "manual",
                            "alert_type": "destructive",
                            "message": "Something went wrong, cannot remove source."
                            + "team, please try again.",
                        }
                    ],
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        else:
            serializer = ChunkSerializer(chunk_obj)
            return Response(
                {
                    "silent": 1,
                    "message": "Chunk loaded!",
                    "toast_variant": "success",
                    "data": serializer.data,
                },
                status=status.HTTP_200_OK,
            )
    else:
        return Response(
            {"message": "Unknown error has occurred"},
            status=status.HTTP_400_BAD_REQUEST,
        )
