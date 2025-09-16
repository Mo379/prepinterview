from rest_framework import serializers

from core.utils import h_encode

from general_tutor.models import (
    GeneralTutorSpace,
    GeneralTutorSpaceSubscription,
    GeneralTutorLesson,
)

from sources.serializers import SourceDetailSerializer


class GeneralTutorSpaceSerializer(serializers.ModelSerializer):
    hid = serializers.SerializerMethodField()
    owner_hid = serializers.SerializerMethodField()

    class Meta:
        model = GeneralTutorSpace
        fields = [
            "hid",
            "owner_hid",
            "name",
            "is_open",
        ]

    def get_hid(self, obj):
        return h_encode(obj.id)

    def get_owner_hid(self, obj):
        return h_encode(obj.user.id)


class GeneralTutorSpaceSubscriptionSerializer(serializers.ModelSerializer):
    space = GeneralTutorSpaceSerializer(read_only=True)
    hid = serializers.SerializerMethodField()

    class Meta:
        model = GeneralTutorSpaceSubscription
        fields = [
            "hid",
            "space",
        ]

    def get_hid(self, obj):
        return h_encode(obj.id)


class GeneralTutorLessonSerializer(serializers.ModelSerializer):
    hid = serializers.SerializerMethodField()
    space_hid = serializers.SerializerMethodField(read_only=True)
    space_subscription_hid = serializers.SerializerMethodField(read_only=True)
    source = SourceDetailSerializer(read_only=True)
    lessontitle = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = GeneralTutorLesson
        fields = [
            "hid",
            "space_hid",
            "space_subscription_hid",
            "source",
            "lessontitle",
            "completed",
        ]

    def get_hid(self, obj):
        return h_encode(obj.id)

    def get_space_hid(self, obj):
        return h_encode(obj.space_subscription.space.id)

    def get_space_subscription_hid(self, obj):
        return h_encode(obj.space_subscription.id)

    def get_lessontitle(self, obj):
        if obj.lessontitle:
            return obj.lessontitle
        return obj.query[0:50]
