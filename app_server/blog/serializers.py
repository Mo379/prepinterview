from rest_framework import serializers


from blog.models import (
    Blog,
)


class BlogListSerializer(serializers.ModelSerializer):

    class Meta:
        model = Blog
        fields = [
            "slug",
            "title",
            "created_at",
        ]


class BlogSerializer(serializers.ModelSerializer):

    class Meta:
        model = Blog
        fields = [
            "slug",
            "title",
            "article",
            "created_at",
        ]
