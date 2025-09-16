# Register your models here.
from django.contrib import admin
from notes.models import (
    Rabiit,
)

# modifications # modifications # modifications


class RabiitAdmin(admin.ModelAdmin):
    raw_id_fields = ["generaltutorlesson"]


# Register your models here.
admin.site.register(Rabiit, RabiitAdmin)
