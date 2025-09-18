from rest_framework import serializers


from core.utils import h_encode

from notes.models import (
    Rabiit,
)


class RabiitSerializer(serializers.ModelSerializer):
    hid = serializers.SerializerMethodField()

    class Meta:
        model = Rabiit
        fields = [
            "hid",
            "name",
            "prompt",
            "content",
        ]

    def get_hid(self, obj):
        return h_encode(obj.id)
