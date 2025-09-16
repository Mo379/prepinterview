import requests
from datetime import timedelta
from django.utils import timezone

from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from user.models import User
from django.db import models
from pgvector.django import VectorField
from pgvector.django import HnswIndex
from core.utils import h_encode, fire_and_forget
from pgvector.django import CosineDistance

# Create your models here.


def get_query_string_embedding_vector(query_string):
    lambda_url = settings.MODEL_EMBEDDING_URL
    payload = {
        "model": "text-embedding-3-large",
        "input": query_string,
        "dimensions": 1024,
    }
    request_body = {
        "payload": payload,
    }
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer "
        + str(RefreshToken.for_user(User.objects.get(username="Admin")).access_token),
    }
    response = requests.post(lambda_url, json=request_body, headers=headers)
    response.raise_for_status()  # raises an error if request fails
    return response.json()


def get_context_chunks(
    source_filter_params,
    query_vector=None,
    similarity_cutoff=0.25,
    top_n=7,
):
    sources = Source.objects.filter(**source_filter_params)

    source_chunks_queryset = Chunk.objects.filter(source__in=sources)
    chunks_id_value_pairs = chunk_vector_search(
        query_vector,
        source_chunks_queryset,
        similarity_cutoff=similarity_cutoff,
        top_n=top_n,
    )
    chunk_context_strings = [
        f"source_hid: {h_encode(id)} -> [[{content}]] end; \n\n"
        for id, content in chunks_id_value_pairs
    ]
    bibliography = ["null_~"] + [
        f"{h_encode(id)}_{index}"
        for index, (id, content) in enumerate(chunks_id_value_pairs)
    ]
    source_context_chunks = " ".join(chunk_context_strings)
    context = f"""
        Use the sources to guide the lesson, dont copy them
        virbatium but use the knowledge to construct an
        appropriate response to the lesson
        [[[[the Following are the souces ^^^^^^^

        {source_context_chunks}

        ^^^^^^ end of sources]]]]]]
        ***
        Make sure to include the correct citations for each piece of infomration
        obtained from the sources

        'source_id:  djhks7389sh -> [[Example source material]] end;'
        the citation will be the string djhks7389sh, if multiple citations are
        used then include all. (copy the citaions source_id exactly as written)
        if no citation is used you must use null all of this is very important***
        """
    return context, bibliography


def chunk_vector_search(
    query_vector,
    target_table,
    similarity_cutoff,
    top_n,
):
    matches = (
        target_table.annotate(distance=CosineDistance("embedding", query_vector))
        .order_by("distance")
        .values_list("id", "content")
    )
    if len(matches) > top_n:
        return matches[0:top_n]
    return matches


class Source(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, db_index=True, null=True)
    space = models.ForeignKey(
        'general_tutor.GeneralTutorSpace',
        on_delete=models.CASCADE,
        db_index=True,
        null=True,
        blank=True,
    )

    name = models.CharField(
        max_length=1000, default="", null=True, db_index=True, blank=True
    )

    url = models.TextField(blank=True, default="")
    s3_key = models.CharField(max_length=1000, default="", blank=True)
    video_id = models.CharField(max_length=25, default="", blank=True)
    presiged_post = models.JSONField(default=dict, null=True, blank=True)
    full_content = models.TextField(blank=True, default="")
    concept_outline = models.JSONField(default=dict, null=True, blank=True)

    SOURCE_TYPES = (
        ("PDF", "PDF"),
        ("WORD", "WORD"),
        ("WEB", "WEB"),
        ("WEBDOC", "WEBDOC"),
        ("TEXT", "TEXT"),
        ("IMG", "IMG"),
    )
    source_type = models.CharField(
        max_length=10,
        choices=SOURCE_TYPES,
        null=True,  # Allows null values
        blank=True,  # Allows the field to be blank in forms and admin
    )

    is_question_sheet = models.BooleanField(default=False, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    pipeline_uploaded = models.BooleanField(default=False, null=True)

    pipeline_start_at = models.DateTimeField(
        auto_now=False, blank=True, null=True, default=None
    )
    pipeline_started = models.BooleanField(default=False, null=True)

    pipeline_completed = models.BooleanField(default=False, null=True)
    pipeline_failed = models.BooleanField(default=False, null=True)

    def __str__(self):
        return str(self.user) + "-" + str(self.name) + "-" + str(self.pk)

    def get_pipeline_status(self):
        if self.pipeline_failed:
            return "pipeline_failed"
        if self.pipeline_completed:
            return "pipeline_completed"
        if self.pipeline_started:
            return "pipeline_started"
        else:
            return "pipeline_pending"

    def continue_pipeline(self):
        now = timezone.now()

        # if this error corrects the user's view when they reload the sources
        # (incase it's been 5 mins, marked as false and then response returns)
        if self.pipeline_completed:
            self.pipeline_failed = False
            self.save()
        if (
            self.pipeline_started
            and self.pipeline_start_at
            and not self.pipeline_completed
        ):
            if now - self.pipeline_start_at >= timedelta(minutes=5):
                self.pipeline_failed = True
                self.save()
            return  # don’t try to restart the pipeline
        if (
            self.pipeline_completed is False
            and self.pipeline_started is False
            and self.pipeline_uploaded is True
        ):
            lambda_url = settings.PIPELINE_PROCESSING_URL
            request_body = {
                "function_app_endpoint": {
                    "type": "run_source_pipeline",
                    "return_url": f"{settings.SITE_URL}/sources" + "/pipeline_endpoint",
                    "source_hid": h_encode(self.id),
                },
                "source_data": {
                    "source_hid": h_encode(self.id),
                    "url": self.url,
                    "cdn_url": settings.CDN_URL,
                    "s3_key": self.s3_key,
                    "source_type": self.source_type,
                    "video_id": self.video_id,
                    "full_content": self.full_content,
                },
            }
            headers = {
                "Content-Type": "application/json",
                "Authorization": "Bearer "
                + str(
                    RefreshToken.for_user(
                        User.objects.get(username="Admin")
                    ).access_token
                ),
            }
            fire_and_forget(lambda_url, request_body, headers)
            self.pipeline_started = True
            self.pipeline_start_at = timezone.now()
            self.save()

    def reset_pipeline(self):
        updated = False

        if self.pipeline_ocr != 2:
            self.pipeline_ocr = 0
            updated = True

        if self.pipeline_ocr_check != 2:
            self.pipeline_ocr_check = 0
            updated = True

        if self.pipeline_embeddings != 2:
            self.pipeline_embeddings = 0
            updated = True

        if updated:
            self.pipeline_completed = False
            self.save()

    def delete(self, *args, **kwargs):
        # Call your custom function before deleting
        self.remove_s3_files()
        # Call the original delete method
        super().delete(*args, **kwargs)

    def remove_s3_files(self):
        if self.s3_key:
            settings.AWS_S3_C.delete_object(
                Bucket=settings.AWS_BUCKET_NAME, Key=self.s3_key
            )

            prefix = f"source_files/{h_encode(self.id)}"
            paginator = settings.AWS_S3_C.get_paginator("list_objects_v2")
            for page in paginator.paginate(
                Bucket=settings.AWS_BUCKET_NAME, Prefix=prefix
            ):
                objs = page.get("Contents", [])
                if objs:
                    keys = [{"Key": o["Key"]} for o in objs]
                    settings.AWS_S3_C.delete_objects(
                        Bucket=settings.AWS_BUCKET_NAME, Delete={"Objects": keys}
                    )

    def s3_file_exists(self):
        if not self.s3_key:
            return False

        try:
            settings.AWS_S3_C.head_object(
                Bucket=settings.AWS_BUCKET_NAME,
                Key=self.s3_key,
            )
            self.pipeline_uploaded = True
            self.save(update_fields=["pipeline_uploaded"])
            return True
        except settings.AWS_S3_C.exceptions.NoSuchKey:
            self.pipeline_uploaded = False
            self.save(update_fields=["pipeline_uploaded"])
            return False
        except Exception:
            # Optional: log error
            return False


class SourceActivation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, db_index=True, null=True)
    source = models.ForeignKey(
        Source, on_delete=models.CASCADE, db_index=True, null=True, blank=True
    )

    lesson_activations = models.ManyToManyField(
        "SourceLessonActivation", related_name="source_lesson_activation"
    )
    is_global = models.BooleanField(default=False, null=True, blank=True)
    is_mandatory = models.BooleanField(default=False, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return str(self.user) + "-" + str(self.pk)


class SourceLessonActivation(models.Model):
    source_activation = models.ForeignKey(
        SourceActivation, on_delete=models.CASCADE, db_index=True, null=True
    )

    lesson_key = models.CharField(max_length=500, default="", null=True, db_index=True)
    is_active = models.BooleanField(default=False, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return str(self.source_activation) + "-" + str(self.lesson_key)


class Chunk(models.Model):
    source = models.ForeignKey(
        Source,
        on_delete=models.CASCADE,
        db_index=True,
        null=True,
        related_name="chunk_source",
    )
    number = models.IntegerField(default=0, null=True, unique=False, db_index=True)

    content = models.TextField(default="", null=True)
    embedding = VectorField(
        dimensions=1024,
        help_text="Vector embeddings of the chunk",
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("source", "number")
        indexes = [
            models.Index(fields=["source", "number"]),
            HnswIndex(
                name="question_embedding_index",
                fields=["embedding"],
                m=16,
                ef_construction=64,
                opclasses=["vector_cosine_ops"],
            ),
        ]

    def __str__(self):
        return str(self.source) + "-" + str(self.number)
