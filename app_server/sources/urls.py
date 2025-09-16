"""core URL Configuration


The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.urls import path, register_converter
from sources import views as sourceViews


from core.utils import HashIdConverter


register_converter(HashIdConverter, "hashid")


urlpatterns = [
    path("upload_ticket", sourceViews.upload_ticket),
    path("pipeline_endpoint", sourceViews.pipeline_endpoint),
    path("confirm_file_upload", sourceViews.confirm_file_upload),
    path("confirm_file_upload/<hashid:source_id>", sourceViews.confirm_file_upload),
    path("list", sourceViews.source_list),
    path("list/<object_type>/<hashid:object_id>", sourceViews.source_list),
    path("source_activation", sourceViews.source_activation),
    path(
        "source_activation/<object_type>/<hashid:object_id>/<lesson_key>",
        sourceViews.source_activation,
    ),
    path("source_activation_update", sourceViews.source_activation_update),
    path(
        "source_activation_update/<hashid:source_id>",
        sourceViews.source_activation_update,
    ),
    path(
        "source_lesson_activation_update", sourceViews.source_lesson_activation_update
    ),
    path("status_list", sourceViews.source_status_list),
    path(
        "status_list/<object_type>/<hashid:object_id>", sourceViews.source_status_list
    ),
    path("detail", sourceViews.source_detail),
    path("detail/<hashid:source_id>", sourceViews.source_detail),
    path("chunk_detail/<hashid:chunk_id>", sourceViews.chunk_detail),
]
