from rest_framework.response import Response
from rest_framework import status
from notes.models import (
    Rabiit,
)
from core.utils import h_decode


def create_rabiit(request, json_data):
    #
    rabiit_id = h_decode(json_data["rabiit_hid"])
    rabiit_obj = Rabiit.objects.get(pk=rabiit_id)
    try:
        rabiit_obj.content = json_data["ai_response"]
        rabiit_obj.save()
    except Exception:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response(status=status.HTTP_200_OK)
