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
from general_tutor import views as generalTutorViews


from core.utils import HashIdConverter


register_converter(HashIdConverter, "hashid")


urlpatterns = [
    path("lesson_detail", generalTutorViews.lesson_detail),
    path(
        "lesson_detail/<hashid:id>",
        generalTutorViews.lesson_detail,
    ),
    path("space_subscription_list", generalTutorViews.space_subscription_list),
    path("space_subscription_detail", generalTutorViews.space_subscription_detail),
    path(
        "space_subscription_detail/<hashid:space_id>",
        generalTutorViews.space_subscription_detail
    ),
    path("space_open", generalTutorViews.space_open),
    path("space_join", generalTutorViews.space_join),
    path("lesson_list", generalTutorViews.lesson_list),
    path(
        "lesson_list/<hashid:space_id>",
        generalTutorViews.lesson_list,
    ),
    path("lesson_update", generalTutorViews.lesson_update),
    path(
        "lesson_update/<hashid:id>",
        generalTutorViews.lesson_update,
    ),
]
