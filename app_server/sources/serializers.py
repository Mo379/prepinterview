import os
import re
from rest_framework import serializers
from django.conf import settings


from core.utils import h_encode

from sources.models import (
    Source,
    SourceActivation,
    SourceLessonActivation,
    Chunk,
)


def _extract_outline(markdown: str):
    outline = []
    for line in markdown.splitlines():
        match = re.match(r'^(#+)\s+(.*)', line)
        if match:
            level = len(match.group(1))  # number of `#`
            title, idd = match.group(2).strip().split('__id__')
            outline.append((title, idd, level))
    return outline


def _add_heading_ids(markdown: str) -> str:
    """
    Add IDs to all markdown headings.
    Example: "# Title" -> "# Title {#_id_section_0}"
    """
    heading_pattern = re.compile(r'^(#{1,6}\s+.+)$', re.MULTILINE)
    counter = {"i": 0}

    def replacer(match):
        text = match.group(1)
        result = f"{text}__id__outline_section_{counter['i']}"
        counter["i"] += 1
        return result

    return heading_pattern.sub(replacer, markdown)


class SourceListSerializer(serializers.ModelSerializer):
    hid = serializers.SerializerMethodField()
    is_owner = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()
    pipeline_uploaded = serializers.SerializerMethodField()
    processing_status = serializers.SerializerMethodField()

    class Meta:
        model = Source
        fields = [
            "hid",
            "name",
            "url",
            "is_owner",
            "presiged_post",
            "is_question_sheet",
            "pipeline_uploaded",
            "processing_status",
            "source_type",
        ]

    def get_hid(self, obj):
        return h_encode(obj.id)

    def get_is_owner(self, obj):
        request_user = self.context.get("request_user", False)
        if request_user:
            return request_user.id == obj.user.id
        return False

    def get_name(self, obj):
        name = obj.name
        if len(obj.name) > 50:
            name = str(obj.name[:50]) + "..."
        return name

    def get_pipeline_uploaded(self, obj):
        if obj.pipeline_uploaded:
            return obj.pipeline_uploaded
        else:
            return obj.s3_file_exists()

    def get_processing_status(self, obj):
        obj.continue_pipeline()
        return obj.get_pipeline_status()


class SourceStatusSerializer(serializers.ModelSerializer):
    hid = serializers.SerializerMethodField()
    processing_status = serializers.SerializerMethodField()

    class Meta:
        model = Source
        fields = [
            "hid",
            "processing_status",
        ]

    def get_hid(self, obj):
        return h_encode(obj.id)

    def get_processing_status(self, obj):
        obj.continue_pipeline()
        return obj.get_pipeline_status()


class SourceDetailSerializer(serializers.ModelSerializer):
    hid = serializers.SerializerMethodField()
    content = serializers.SerializerMethodField()
    url = serializers.SerializerMethodField()

    class Meta:
        model = Source
        fields = [
            "hid",
            "name",
            "content",
            "concept_outline",
            "url",
            "is_question_sheet",
            "source_type",
        ]

    def get_hid(self, obj):
        return h_encode(obj.id)

    def get_url(self, obj):
        return os.path.join(settings.CDN_URL, obj.s3_key)

    def get_content(self, obj):
        try:
            full_content = _add_heading_ids(obj.full_content)
            outline = _extract_outline(full_content)
        except Exception:
            full_content = ''
            outline = []
        return {
            'full_content': full_content, 'outline': outline
        }


class SourceActivationSerializer(serializers.ModelSerializer):
    source_hid = serializers.SerializerMethodField()
    lesson_activation = serializers.SerializerMethodField()
    is_owner = serializers.SerializerMethodField()

    class Meta:
        model = SourceActivation
        fields = [
            "source_hid",
            "lesson_activation",
            "is_global",
            "is_mandatory",
            "is_owner",
        ]

    def get_source_hid(self, obj):
        return h_encode(obj.source.id)

    def get_lesson_activation(self, obj):
        lesson_key = self.context.get("lesson_key", None)
        if lesson_key:
            lesson_activation_obj, _ = SourceLessonActivation.objects.get_or_create(
                source_activation=obj, lesson_key=lesson_key
            )
            return {
                "lesson_key": lesson_activation_obj.lesson_key,
                "is_active": lesson_activation_obj.is_active,
            }
        return {}

    def get_is_owner(self, obj):
        request_user = self.context.get("request_user", False)
        if request_user == obj.user:
            return True
        return False


class ChunkSerializer(serializers.ModelSerializer):
    hid = serializers.SerializerMethodField()

    class Meta:
        model = Chunk
        fields = [
            "hid",
            "content",
        ]

    def get_hid(self, obj):
        return h_encode(obj.id)
