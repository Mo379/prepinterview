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


from user import views as userViews
from core.utils import HashIdConverter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


register_converter(HashIdConverter, "hashid")


urlpatterns = [
    path("signup", userViews.signup, name="signup"),
    path("onboarding", userViews.onboarding, name="onboarding"),
    path(
        "account_information_update",
        userViews.account_information_update,
        name="account_information_update",
    ),
    path("activate", userViews.activate, name="activate"),
    path("login", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("re_login", TokenRefreshView.as_view(), name="token_refresh"),
    path("google_login", userViews.google_login, name="google_login"),
    #
    path("password_reset_trigger", userViews.pwdreset_trigger, name="pwdreset_trigger"),
    path("password_reset_return", userViews.pwdreset_return, name="pwdreset_return"),
    path("deleteaccount", userViews.deleteaccount, name="deleteaccount"),
    path(
        "create_customer_checkout_session",
        userViews.create_customer_checkout_session,
        name="create_customer_checkout_session",
    ),
    path(
        "create_customer_portal_session",
        userViews.create_customer_portal_session,
        name="create_customer_portal_session",
    ),
    #
    path("contact", userViews.contact),
]
