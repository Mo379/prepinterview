from rest_framework import serializers

from core.utils import h_encode

from general_tutor.models import (
    GeneralTutorSpace,
)


class GeneralTutorSpaceListSerializer(serializers.ModelSerializer):
    hid = serializers.SerializerMethodField()

    class Meta:
        model = GeneralTutorSpace
        fields = [
            "hid",
            "name",
        ]

    def get_hid(self, obj):
        return h_encode(obj.id)
class GeneralTutorSpaceSerializer(serializers.ModelSerializer):
    hid = serializers.SerializerMethodField()

    class Meta:
        model = GeneralTutorSpace
        fields = [
            "hid",
            "name",
            "content",
        ]

    def get_hid(self, obj):
        return h_encode(obj.id)
