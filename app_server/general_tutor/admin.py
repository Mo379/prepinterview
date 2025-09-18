# Register your models here.
from django.contrib import admin
from general_tutor.models import (
    GeneralTutorSpace,
)

# modifications # modifications # modifications


class GeneralTutorSpaceAdmin(admin.ModelAdmin):
    raw_id_fields = ["user"]


# Register your models here.
admin.site.register(GeneralTutorSpace, GeneralTutorSpaceAdmin)
