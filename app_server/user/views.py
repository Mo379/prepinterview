import requests

import stripe
from datetime import datetime
from django.contrib.auth import authenticate
from django.conf import settings
from user.utils import account_activation_token, password_reset_token
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str

# Create your views here.
from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from core.utils import (
    TagGenerator,
    stripe_get_customer,
    stripe_check_active_subscription,
)
from user.utils import sendMailLambda
from user.serializers import UserSerializer, MyTokenObtainPairSerializer
from user.models import User, StripeCustomerPortal
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests


@api_view(["POST"])
def google_login(request, format=None):
    if request.method == "POST":
        try:
            google_token = request.data["access_token"]
            idinfo = id_token.verify_oauth2_token(
                google_token, google_requests.Request()
            )

            email = idinfo.get("email")
            first_name = idinfo.get("given_name")
            last_name = idinfo.get("family_name")
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    "username": email,
                    "first_name": first_name,
                    "last_name": last_name,
                    "registration": True,
                    "google_login": True,
                },
            )

            assert user, 'user'

            serializer = MyTokenObtainPairSerializer()
            token_data = serializer.get_token(user)

            assert token_data, 'token'

        except Exception as e:
            raise e
            return Response(
                {
                    "silent": 0,
                    "message": "User no valid.",
                    "toast_variant": "destructive",
                    "errors": [
                        {
                            "name": "root",
                            "type": "manual",
                            "alert_type": "destructive",
                            "message": "Something went wrong, please try again.",
                        }
                    ],
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        else:
            return Response(
                {
                    "silent": 0,
                    "message": "Logged in with google!",
                    "toast_variant": "success",
                    "access": str(token_data.access_token),
                    "refresh": str(token_data),
                },
                status=status.HTTP_200_OK,
            )
    else:
        return Response(
            {
                "silent": 0,
                "message": "Request type unknown.",
                "toast_variant": "destructive",
                "errors": [
                    {
                        "name": "root",
                        "type": "manual",
                        "alert_type": "destructive",
                        "message": "This request type is not available!",
                    }
                ],
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


@api_view(["POST"])
def signup(request, format=None):
    if request.method == "POST":
        try:
            captcha_response = request.data["g-recaptcha-response"]
        except Exception:
            return Response(
                {
                    "silent": 0,
                    "message": "ReCaptcha failed, we're fighting the robots!",
                    "toast_variant": "destructive",
                    "errors": [
                        {
                            "name": "root",
                            "type": "manual",
                            "alert_type": "destructive",
                            "message": "ReCaptcha failed, "
                            + "please refresh and try again.",
                        }
                    ],
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        data = {
            "secret": settings.CAPTCHA_SECRET,
            "response": captcha_response,
        }
        response = requests.post(
            "https://www.google.com/recaptcha/api/siteverify", data=data
        )
        result = response.json()
        if result["success"]:
            serializer = UserSerializer(data=request.data)
            #
            if request.data["password"] != request.data["confirmpassword"]:
                return Response(
                    {
                        "silent": 0,
                        "message": "Passwords do not match!",
                        "toast_variant": "destructive",
                        "errors": [
                            {
                                "name": "root",
                                "type": "manual",
                                "alert_type": "destructive",
                                "message": "Password do not match, pleasy try again.",
                            }
                        ],
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
            if serializer.is_valid():
                try:
                    serializer.save()
                    user = User.objects.get(email=request.data["email"])
                    while True:
                        random_username = TagGenerator()
                        if not User.objects.filter(username=random_username).exists():
                            break
                    user.username = random_username
                    user.set_password(request.data["password"])
                    user.save()
                    # Send Activation Email
                    token = account_activation_token.make_token(user)
                    uid = urlsafe_base64_encode(force_bytes(user.pk))
                    sendMailLambda(
                        {
                            "templateName": "accountActivation",
                            "parameters": {
                                "firstName": user.first_name,
                                "activationLink": f"{ settings.FRONT_SITE_URL }"
                                + f"/auth/account_activation/{uid}/{token}",
                            },
                            "toEmails": [user.email],
                            "fromEmail": settings.EMAIL_MAIN,
                        }
                    )
                except Exception:
                    return Response(
                        {
                            "silent": 0,
                            "message": "Internal error.",
                            "toast_variant": "destructive",
                            "errors": [
                                {
                                    "name": "root",
                                    "type": "manual",
                                    "alert_type": "destructive",
                                    "message": "Internal error.",
                                }
                            ],
                        },
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    )
                else:
                    return Response(
                        {
                            "silent": 0,
                            "message": "You're signed up!",
                            "toast_variant": "success",
                        },
                        status=status.HTTP_200_OK,
                    )
            return Response(
                {
                    "silent": 0,
                    "message": "Invalid input, please try again",
                    "toast_variant": "destructive",
                    "errors": [
                        {
                            "name": "root",
                            "type": "manual",
                            "alert_type": "destructive",
                            "message": "Input was not expected.",
                        }
                    ],
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        else:
            return Response(
                {
                    "silent": 0,
                    "message": "ReCaptcha failed, we're fighting the robots!",
                    "toast_variant": "destructive",
                    "errors": [
                        {
                            "name": "root",
                            "type": "manual",
                            "alert_type": "destructive",
                            "message": "ReCaptcha failed, "
                            + "please refresh and try again.",
                        }
                    ],
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
    else:
        return Response(
            {
                "silent": 0,
                "message": "Request type unknown.",
                "toast_variant": "destructive",
                "errors": [
                    {
                        "name": "root",
                        "type": "manual",
                        "alert_type": "destructive",
                        "message": "This request type is not available!",
                    }
                ],
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def authenticator_setup(request, format=None):
    if request.method == "POST":
        if request.user.authenticator is False:
            try:
                user = request.user

                tfa_secret = pyotp.random_base32()

                user.tfa_secret = tfa_secret
                provisioning_uri = pyotp.totp.TOTP(tfa_secret).provisioning_uri(
                    name=user.email, issuer_name="practicepractice.net"
                )

                user.save()
            except Exception:
                return Response(
                    {
                        "silent": 1,
                        "message": "Internal error.",
                        "toast_variant": "destructive",
                        "errors": [
                            {
                                "name": "root",
                                "type": "manual",
                                "alert_type": "destructive",
                                "message": "Something went wrong, please try again.",
                            }
                        ],
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
            else:
                return Response(
                    {
                        "silent": 1,
                        "message": "Scan the QR-code or type the "
                        + "provided string with your authenticator app",
                        "toast_variant": "info",
                        "data": {"uri": provisioning_uri, "tfa_secret": tfa_secret},
                    },
                    status=status.HTTP_200_OK,
                )
        else:
            return Response(
                {
                    "silent": 1,
                    "message": "Authenticator already exists.",
                    "toast_variant": "destructive",
                    "errors": [
                        {
                            "name": "root",
                            "type": "manual",
                            "alert_type": "destructive",
                            "message": "A TFA application has already been setup!",
                        }
                    ],
                },
                status=status.HTTP_200_OK,
            )
    else:
        return Response(
            {
                "silent": 0,
                "message": "Request type unknown.",
                "toast_variant": "destructive",
                "errors": [
                    {
                        "name": "root",
                        "type": "manual",
                        "alert_type": "destructive",
                        "message": "This request type is not available!",
                    }
                ],
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def onboarding(request, format=None):
    if request.method == "POST":
        try:
            if (
                User.objects.filter(username__iexact=request.data["username"]).exists()
                and request.user.username != request.data["username"]
            ):
                return Response(
                    {
                        "silent": 0,
                        "message": "Invalid username.",
                        "toast_variant": "destructive",
                        "errors": [
                            {
                                "name": "root",
                                "type": "manual",
                                "alert_type": "destructive",
                                "message": "Username is taken please "
                                + "select a new one.",
                            }
                        ],
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
            user = request.user
            user.username = request.data["username"]
            user.first_name = request.data["firstname"]
            user.last_name = request.data["lastname"]
            user.accepted_terms = request.data["accepted_terms"]
            user.save()
        except Exception:
            return Response(
                {
                    "silent": 0,
                    "message": "Internal error.",
                    "toast_variant": "destructive",
                    "errors": [
                        {
                            "name": "root",
                            "type": "manual",
                            "alert_type": "destructive",
                            "message": "An unknown error has occurred, "
                            + "try again later.",
                        }
                    ],
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        else:
            return Response(
                {
                    "silent": 0,
                    "message": "Onboarding completed!",
                    "toast_variant": "success",
                },
                status=status.HTTP_200_OK,
            )
    else:
        return Response(
            {
                "silent": 0,
                "message": "Request type unknown.",
                "toast_variant": "destructive",
                "errors": [
                    {
                        "name": "root",
                        "type": "manual",
                        "alert_type": "destructive",
                        "message": "This request type is not available!",
                    }
                ],
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def account_information_update(request, format=None):
    if request.method == "POST":
        try:
            if (
                User.objects.filter(username__iexact=request.data["username"]).exists()
                and request.user.username != request.data["username"]
            ):
                return Response(
                    {
                        "silent": 0,
                        "message": "Invalid username.",
                        "toast_variant": "destructive",
                        "errors": [
                            {
                                "name": "username",
                                "type": "manual",
                                "alert_type": "destructive",
                                "message": "Invalid.",
                            },
                            {
                                "name": "root",
                                "type": "manual",
                                "alert_type": "destructive",
                                "message": "Username is taken please "
                                + "select a new one.",
                            },
                        ],
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
            user = request.user
            user.username = request.data["username"]
            user.first_name = request.data["firstname"]
            user.last_name = request.data["lastname"]
            user.save()
        except Exception:
            return Response(
                {
                    "silent": 0,
                    "message": "Internal error.",
                    "toast_variant": "destructive",
                    "errors": [
                        {
                            "name": "root",
                            "type": "manual",
                            "alert_type": "destructive",
                            "message": "An unknown error has occurred, "
                            + "try again later.",
                        }
                    ],
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        else:
            return Response(
                {
                    "silent": 0,
                    "message": "Updated!",
                    "toast_variant": "success",
                },
                status=status.HTTP_200_OK,
            )
    else:
        return Response(
            {
                "silent": 0,
                "message": "Request type unknown.",
                "toast_variant": "destructive",
                "errors": [
                    {
                        "name": "root",
                        "type": "manual",
                        "alert_type": "destructive",
                        "message": "This request type is not available!",
                    }
                ],
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


@api_view(["POST"])
def activate(request, format=None):
    if request.method == "POST":
        try:
            uid = force_str(urlsafe_base64_decode(request.data["uidb64"]))
            token = request.data["token"]
            user = User.objects.get(pk=uid)
        except Exception:
            return Response(
                {
                    "silent": 0,
                    "message": "User not found.",
                    "toast_variant": "destructive",
                    "errors": [
                        {
                            "name": "root",
                            "type": "manual",
                            "alert_type": "destructive",
                            "message": "The user cannot be found, "
                            + "please try again.",
                        }
                    ],
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        else:
            if (
                user is not None
                and account_activation_token.check_token(user, token)
                and user.registration is False
            ):
                try:
                    user.registration = 1
                    user.save()
                    sendMailLambda(
                        {
                            "templateName": "welcomeAboard",
                            "parameters": {
                                "firstName": user.first_name,
                            },
                            "toEmails": [user.email],
                            "fromEmail": settings.EMAIL_MAIN,
                        }
                    )
                except Exception:
                    return Response(
                        {
                            "silent": 0,
                            "message": "Invalid information.",
                            "toast_variant": "destructive",
                            "errors": [
                                {
                                    "name": "root",
                                    "type": "manual",
                                    "alert_type": "destructive",
                                    "message": "The link has expired. "
                                    + "Attempt to login with your email "
                                    + "and password, a new link will be sent.",
                                }
                            ],
                        },
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    )
                else:
                    return Response(
                        {
                            "silent": 0,
                            "message": "Your accound has been "
                            + "activated, you can now login.",
                            "toast_variant": "success",
                        },
                        status=status.HTTP_200_OK,
                    )
            else:
                return Response(
                    {
                        "silent": 0,
                        "message": "Invalid information.",
                        "toast_variant": "destructive",
                        "errors": [
                            {
                                "name": "root",
                                "type": "manual",
                                "alert_type": "destructive",
                                "message": "The link has expired. "
                                + "Attempt to login with your email "
                                + "and password, a new link will be sent.",
                            }
                        ],
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
    else:
        return Response(
            {
                "silent": 0,
                "message": "Request type unknown.",
                "toast_variant": "destructive",
                "errors": [
                    {
                        "name": "root",
                        "type": "manual",
                        "alert_type": "destructive",
                        "message": "This request type is not available!",
                    }
                ],
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def contact(request, format=None):
    if request.method == "POST":
        try:
            message_subject = request.data["messageSubject"]
            message = request.data["message"]
        except Exception:
            return Response(
                {
                    "silent": 0,
                    "message": "Subject and message required.",
                    "toast_variant": "destructive",
                    "errors": [
                        {
                            "name": "root",
                            "type": "manual",
                            "alert_type": "destructive",
                            "message": "Please provide the required fields.",
                        }
                    ],
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            sendMailLambda(
                {
                    "templateName": "userContactInternal",
                    "parameters": {
                        "firstName": request.user.first_name,
                        "email": request.user.email,
                        "messageSubject": message_subject,
                        "message": message,
                    },
                    "toEmails": [settings.EMAIL_MAIN],
                    "fromEmail": settings.EMAIL_MAIN,
                }
            )
            sendMailLambda(
                {
                    "templateName": "userContactConfirmation",
                    "parameters": {
                        "firstName": request.user.first_name,
                    },
                    "toEmails": [request.user.email],
                    "fromEmail": settings.EMAIL_MAIN,
                }
            )
        except Exception:
            return Response(
                {
                    "silent": 0,
                    "message": "Internal error.",
                    "toast_variant": "destructive",
                    "errors": [
                        {
                            "name": "root",
                            "type": "manual",
                            "alert_type": "destructive",
                            "message": "An unknown error has occurred, "
                            + "pleaes try again later!",
                        }
                    ],
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        else:
            return Response(
                {
                    "silent": 0,
                    "message": "Your message has been revieved. "
                    + "You will get a confirmation email!",
                    "toast_variant": "success",
                },
                status=status.HTTP_200_OK,
            )
    else:
        return Response(
            {
                "silent": 0,
                "message": "Subject and message required.",
                "toast_variant": "destructive",
                "errors": [
                    {
                        "name": "root",
                        "type": "manual",
                        "alert_type": "destructive",
                        "message": "Please provide the required fields.",
                    }
                ],
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def updatepassword(request):
    if request.method == "POST":
        try:
            pass_current = request.data["password_current"]
            pass_new = request.data["password_new"]
            user = authenticate(request, pk=request.user.id, password=pass_current)
        except Exception:
            return Response(
                {
                    "silent": 0,
                    "message": "Unknown error has occurred",
                    "toast_variant": "destructive",
                    "errors": [
                        {
                            "name": "root",
                            "type": "manual",
                            "alert_type": "info",
                            "message": "Something went wrong, please try again later.",
                        }
                    ],
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        else:
            if user:
                request.user.set_password(pass_new)
                request.user.save()
                return Response(
                    {
                        "silent": 0,
                        "message": "Password successfully updated!",
                        "toast_variant": "success",
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {
                        "silent": 0,
                        "message": "Connot confirm user.",
                        "toast_variant": "destructive",
                        "errors": [
                            {
                                "name": "root",
                                "type": "manual",
                                "alert_type": "info",
                                "message": "The information provided "
                                + "is incorrect, please try again.",
                            }
                        ],
                    },
                    status=status.HTTP_404_NOT_FOUND,
                )
    else:
        return Response(
            {
                "silent": 0,
                "message": "Subject and message required.",
                "toast_variant": "destructive",
                "errors": [
                    {
                        "name": "root",
                        "type": "manual",
                        "alert_type": "destructive",
                        "message": "Please provide the required fields.",
                    }
                ],
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


@api_view(["POST"])
def pwdreset_trigger(request, format=None):
    if request.method == "POST":
        try:
            captcha_response = request.data["g-recaptcha-response"]
        except Exception:
            return Response(
                {
                    "silent": 0,
                    "message": "ReCaptcha failed, we're fighting the robots!",
                    "toast_variant": "destructive",
                    "errors": [
                        {
                            "name": "root",
                            "type": "manual",
                            "alert_type": "destructive",
                            "message": "ReCaptcha failed, "
                            + "please refresh and try again.",
                        }
                    ],
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        data = {
            "secret": settings.CAPTCHA_SECRET,
            "response": captcha_response,
        }
        response = requests.post(
            "https://www.google.com/recaptcha/api/siteverify", data=data
        )
        result = response.json()
        if result["success"]:
            try:
                username = request.data["username"]
                user = User.objects.get(
                    Q(username__iexact=username) | Q(email__iexact=username)
                )
            except Exception:
                return Response(
                    {
                        "silent": 0,
                        "message": "User cannot be found.",
                        "toast_variant": "destructive",
                        "errors": [
                            {
                                "name": "root",
                                "type": "manual",
                                "alert_type": "destructive",
                                "message": "Information is incorrect, "
                                + "use not found, please try again.",
                            }
                        ],
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
            #
            try:
                user.password_set = False
                user.save()
                token = password_reset_token.make_token(user)
                uid = urlsafe_base64_encode(force_bytes(user.pk))
                sendMailLambda(
                    {
                        "templateName": "passwordReset",
                        "parameters": {
                            "firstName": user.first_name,
                            "userName": user.username,
                            "resetLink": f"{settings.FRONT_SITE_URL}"
                            + f"/auth/reset_password/{uid}/{token}",
                        },
                        "toEmails": [user.email],
                        "fromEmail": settings.EMAIL_MAIN,
                    }
                )
            except Exception:
                return Response(
                    {
                        "silent": 0,
                        "message": "Internal error.",
                        "toast_variant": "destructive",
                        "errors": [
                            {
                                "name": "root",
                                "type": "manual",
                                "alert_type": "info",
                                "message": "An unknown error has occurred, "
                                + "pleaes try again later!",
                            }
                        ],
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
            else:
                return Response(
                    {
                        "silent": 0,
                        "message": "A password reset email "
                        + "has been sent please follow the instructions.",
                        "toast_variant": "success",
                    },
                    status=status.HTTP_200_OK,
                )
        else:
            return Response(
                {
                    "silent": 0,
                    "message": "Cannot confirm identity please try again.",
                    "toast_variant": "destructive",
                    "errors": [
                        {
                            "name": "root",
                            "type": "manual",
                            "alert_type": "info",
                            "message": "ReCaptca failed, "
                            + "please refresh and try again.",
                        }
                    ],
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
    else:
        return Response(
            {
                "silent": 0,
                "message": "Subject and message required.",
                "toast_variant": "destructive",
                "errors": [
                    {
                        "name": "root",
                        "type": "manual",
                        "alert_type": "destructive",
                        "message": "Please provide the required fields.",
                    }
                ],
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


@api_view(["POST"])
def pwdreset_return(request, format=None):
    if request.method == "POST":
        try:
            uid = urlsafe_base64_decode(request.data["uidb64"])
            new_pass = request.data["password"]
            confirm_pass = request.data["confirmpassword"]
            token = request.data["token"]
            user = User.objects.get(pk=uid)
        except Exception:
            return Response(
                {
                    "silent": 0,
                    "message": "Invalid information please try again.",
                    "toast_variant": "destructive",
                    "errors": [
                        {
                            "name": "root",
                            "type": "manual",
                            "alert_type": "destructive",
                            "message": "Please provide the required fields.",
                        }
                    ],
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        #
        if password_reset_token.check_token(user, token) is False:
            return Response(
                {
                    "silent": 0,
                    "message": "Expired link.",
                    "toast_variant": "destructive",
                    "errors": [
                        {
                            "name": "root",
                            "type": "manual",
                            "alert_type": "destructive",
                            "message": "This link has expired, "
                            + "please restart the process.",
                        }
                    ],
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        if new_pass != confirm_pass:
            return Response(
                {
                    "silent": 0,
                    "message": "Password do not match.",
                    "toast_variant": "destructive",
                    "errors": [
                        {
                            "name": "confirm_password",
                            "type": "manual",
                            "alert_type": "destructive",
                            "message": "Password and confirm Password must match.",
                        }
                    ],
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            assert user.password_set is False
            user.set_password(new_pass)
            user.password_set = True
            user.save()
        except Exception:
            return Response(
                {
                    "silent": 0,
                    "message": "Password reset failed.",
                    "toast_variant": "destructive",
                    "errors": [
                        {
                            "name": "root",
                            "type": "manual",
                            "alert_type": "destructive",
                            "message": "Password reset failed, please try again.",
                        }
                    ],
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        else:
            return Response(
                {
                    "silent": 0,
                    "message": "Password reset completed you "
                    + "can login with your new password.",
                    "toast_variant": "sucesss",
                },
                status=status.HTTP_200_OK,
            )
    else:
        return Response(
            {
                "silent": 0,
                "message": "Subject and message required.",
                "toast_variant": "destructive",
                "errors": [
                    {
                        "name": "root",
                        "type": "manual",
                        "alert_type": "destructive",
                        "message": "Please provide the required fields.",
                    }
                ],
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def deleteaccount(request, format=None):
    if request.method == "POST":
        try:
            password = request.data["password"]
            user = authenticate(
                request, username=request.user.username, password=password
            )
        except Exception:
            return Response(
                {
                    "silent": 0,
                    "message": "Internal error.",
                    "toast_variant": "destructive",
                    "errors": [
                        {
                            "name": "password",
                            "type": "manual",
                            "alert_type": "destructive",
                            "message": "Password required.",
                        }
                    ],
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        if user:
            try:
                user_obj = request.user
                user_obj.is_active = False
                user_obj.save()
                sendMailLambda(
                    {
                        "templateName": "accountDeletion",
                        "parameters": {
                            "firstName": user.first_name,
                        },
                        "toEmails": [user.email],
                        "fromEmail": settings.EMAIL_MAIN,
                    }
                )
            except Exception:
                return Response(
                    {
                        "silent": 0,
                        "message": "Internal error.",
                        "toast_variant": "destructive",
                        "errors": [
                            {
                                "name": "root",
                                "type": "manual",
                                "alert_type": "destructive",
                                "message": "An unknown error has occurred, "
                                + "pleaes try again later!",
                            }
                        ],
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
            else:
                return Response(
                    {
                        "silent": 0,
                        "message": "Deletion process started. "
                        + "We're sorry to see you go!",
                        "toast_variant": "success",
                    },
                    status=status.HTTP_200_OK,
                )
        else:
            return Response(
                {
                    "silent": 0,
                    "message": "User cannot be found/verified.",
                    "toast_variant": "destructive",
                    "errors": [
                        {
                            "name": "password",
                            "type": "manual",
                            "alert_type": "destructive",
                            "message": "Incorrect details, user cannot be "
                            + "found/verified, please try again.",
                        }
                    ],
                },
                status=status.HTTP_404_NOT_FOUND,
            )
    else:
        return Response(
            {
                "silent": 0,
                "message": "Subject and message required.",
                "toast_variant": "destructive",
                "errors": [
                    {
                        "name": "root",
                        "type": "manual",
                        "alert_type": "destructive",
                        "message": "Please provide the required fields.",
                    }
                ],
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_customer_checkout_session(request, format=None):
    if request.method == "POST":
        user = request.user
        item_number = (
            request.data["item_number"] if "item_number" in request.data else 1
        )
        stripe.api_key = settings.STRIPE_SECRET_KEY
        customer = stripe_get_customer(user)
        active_subscription = stripe_check_active_subscription(user)
        if customer and not active_subscription:
            if item_number == 1:
                line_item = {"price": settings.STRIPE_PRO_PRICE, "quantity": 1}
            # Authenticate your user.
            session = stripe.checkout.Session.create(
                customer=user.stripe_customer_id,
                success_url=f"{settings.FRONT_SITE_URL}/checkout_success",
                cancel_url=f"{settings.FRONT_SITE_URL}/auth",
                mode="subscription",
                line_items=[line_item],
                allow_promotion_codes=False,
                ui_mode="hosted",
            )
            return Response(
                {
                    "silent": 0,
                    "message": "Customer checkout session Created.",
                    "toast_variant": "success",
                    "data": {"url": session.url},
                },
                status=status.HTTP_200_OK,
            )
        return Response(
            {
                "silent": 0,
                "message": "Something is wrong.",
                "toast_variant": "destructive",
                "errors": [
                    {
                        "name": "root",
                        "type": "manual",
                        "alert_type": "destructive",
                        "message": "You must be a member "
                        + "WITHOUT an active subscription!",
                    }
                ],
                "data": None,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )
    else:
        return Response(
            {
                "silent": 0,
                "message": "Subject and message required.",
                "toast_variant": "destructive",
                "errors": [
                    {
                        "name": "root",
                        "type": "manual",
                        "alert_type": "destructive",
                        "message": "Please provide the required fields.",
                    }
                ],
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_customer_portal_session(request, format=None):
    if request.method == "POST":
        user = request.user
        stripe.api_key = settings.STRIPE_SECRET_KEY
        customer = stripe_get_customer(user)
        active_subscription = stripe_check_active_subscription(user)
        if customer and active_subscription:
            # Authenticate your user.
            session = stripe.billing_portal.Session.create(
                customer=user.stripe_customer_id,
                return_url=f"{settings.FRONT_SITE_URL}/account",
                configuration=StripeCustomerPortal.objects.filter()[0].name,
            )
            return Response(
                {
                    "silent": 0,
                    "message": "Customer portal session Created.",
                    "toast_variant": "success",
                    "data": {"url": session.url},
                },
                status=status.HTTP_200_OK,
            )
        return Response(
            {
                "silent": 0,
                "message": "You're not a member.",
                "toast_variant": "destructive",
                "errors": [
                    {
                        "name": "root",
                        "type": "manual",
                        "alert_type": "destructive",
                        "message": "You must be a member with an active subscription!",
                    }
                ],
                "data": None,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )
    else:
        return Response(
            {
                "silent": 0,
                "message": "Subject and message required.",
                "toast_variant": "destructive",
                "errors": [
                    {
                        "name": "root",
                        "type": "manual",
                        "alert_type": "destructive",
                        "message": "Please provide the required fields.",
                    }
                ],
            },
            status=status.HTTP_400_BAD_REQUEST,
        )
