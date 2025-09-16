# Register your models here.
from django.contrib import admin
from sources.models import (
    Source,
    SourceActivation,
    SourceLessonActivation,
    Chunk,
)


class SourceAdmin(admin.ModelAdmin):
    raw_id_fields = ["user", "space"]


class SourceActivationAdmin(admin.ModelAdmin):
    raw_id_fields = ["user", "source"]


class SourceLessonActivationAdmin(admin.ModelAdmin):
    raw_id_fields = ["source_activation"]


class ChunkAdmin(admin.ModelAdmin):
    raw_id_fields = ["source"]


# Register your models here.
admin.site.register(Source, SourceAdmin)
admin.site.register(SourceActivation, SourceActivationAdmin)
admin.site.register(SourceLessonActivation, SourceLessonActivationAdmin)
admin.site.register(Chunk, ChunkAdmin)
