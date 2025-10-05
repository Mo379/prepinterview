from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from blog.models import Blog
from blog.serializers import (
    BlogListSerializer,
    BlogSerializer,
)


@api_view(["GET"])
def blog_list(request, lesson_type=None, lesson_id=None, format=None):
    if request.method == "GET":
        try:
            blogs = Blog.objects.all().order_by('-created_at')[:50]
        except Exception:
            return Response(
                {"message": "Unknown error has occurred"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        else:
            serializer = BlogListSerializer(blogs, many=True)
            return Response(
                {
                    "data": serializer.data,
                    "message": "Blogs listed",
                },
                status=status.HTTP_200_OK,
            )
    else:
        return Response(
            {"message": "Unknown error has occurred"},
            status=status.HTTP_400_BAD_REQUEST,
        )


@api_view(["GET"])
def blog_detail(request, slug, format=None):
    if request.method == "GET":
        try:
            if '.json' in slug:
                slug = slug.replace('.json', '')
            blog = Blog.objects.get(slug__iexact=slug)
        except Exception:
            return Response(
                {
                    "silent": 0,
                    "message": "An error occurred while attempting to fetch.",
                    "toast_variant": "destructive",
                    "errors": [
                        {
                            "name": "root",
                            "type": "manual",
                            "alert_type": "destructive",
                            "message": "Something went wrong, cannot get blog."
                            + "team, please try again.",
                        }
                    ],
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        else:
            serializer = BlogSerializer(blog)
            return Response(
                {
                    "silent": 1,
                    "message": "successfully fetched blog!",
                    "toast_variant": "success",
                    "data": serializer.data,
                },
                status=status.HTTP_200_OK,
            )
    else:
        return Response(
            {"message": "Unknown error has occurred"},
            status=status.HTTP_400_BAD_REQUEST,
        )

