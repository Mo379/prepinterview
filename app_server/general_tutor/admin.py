# Register your models here.
from django.contrib import admin
from general_tutor.models import (
    GeneralTutorSpace,
    GeneralTutorSpaceSubscription,
    GeneralTutorLesson,
)

# modifications # modifications # modifications


class GeneralTutorSpaceAdmin(admin.ModelAdmin):
    raw_id_fields = ["user"]


class GeneralTutorSpaceSubscriptionAdmin(admin.ModelAdmin):
    raw_id_fields = ["space", "user"]


class GeneralTutorLessonAdmin(admin.ModelAdmin):
    raw_id_fields = ["user", "space_subscription"]


# Register your models here.
admin.site.register(GeneralTutorSpace, GeneralTutorSpaceAdmin)
admin.site.register(
    GeneralTutorSpaceSubscription,
    GeneralTutorSpaceSubscriptionAdmin
)
admin.site.register(GeneralTutorLesson, GeneralTutorLessonAdmin)
