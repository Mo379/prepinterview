from user.models import User
from django.db.models import Q
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from core.utils import h_encode
from core.mixin import stripe_check_active_subscription


# Create serialisers here
class UserSerializer(serializers.ModelSerializer):
    hid = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "hid",
            "username",
            "first_name",
            "last_name",
            "email",
        ]
        read_only_fields = ["username", "first_name", "last_name", "hid"]

    def get_hid(self, obj):
        return h_encode(obj.id)

    def validate(self, attrs):
        if "email" not in attrs:
            raise serializers.ValidationError(
                {
                    "silent": 0,
                    "message": "Email field is required.",
                    "toast_variant": "destructive",
                    "errors": [
                        {
                            "name": "email",
                            "type": "manual",
                            "alert_type": "destructive",
                            "message": "Email field is required!",
                        }
                    ],
                }
            )
        return attrs


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["hid"] = h_encode(token["user_id"])
        token["username"] = user.username
        token["firstname"] = user.first_name
        token["lastname"] = user.last_name
        token["email"] = user.email

        subscriptions_data = stripe_check_active_subscription(user)
        token["is_member"] = subscriptions_data

        token["accepted_terms"] = user.accepted_terms
        return token

    def validate(self, attrs):
        try:
            user_obj = User.objects.get(
                Q(username__iexact=attrs["username"])
                | Q(email__iexact=attrs["username"])
            )
        except User.DoesNotExist:
            raise serializers.ValidationError(
                {
                    "silent": 0,
                    "message": "Incorrect details.",
                    "toast_variant": "destructive",
                    "errors": [
                        {
                            "name": "username",
                            "type": "manual",
                            "alert_type": "destructive",
                            "message": "User does not exist.",
                        }
                    ],
                }
            )
        else:
            if user_obj.check_password(attrs["password"]):
                user = user_obj
            else:
                raise serializers.ValidationError(
                    {
                        "silent": 0,
                        "message": "Incorrect details.",
                        "toast_variant": "destructive",
                        "errors": [
                            {
                                "name": "password",
                                "type": "manual",
                                "alert_type": "destructive",
                                "message": "Incorrect password.",
                            }
                        ],
                    }
                )
            if not user.registration and not user.is_superuser:
                raise serializers.ValidationError(
                    {
                        "silent": 0,
                        "message": "User registration is not completed.",
                        "toast_variant": "destructive",
                        "errors": [
                            {
                                "name": "root",
                                "type": "manual",
                                "alert_type": "destructive",
                                "message": "User registraction must be completed."
                                + " Check your mail.",
                            }
                        ],
                    }
                )
        attrs = {
            "username": user.username,
            "password": attrs.get("password", ""),
        }
        data = super().validate(attrs)
        data.update(
            {
                "silent": 0,
                "message": "Authentication Verified, you're logged in!",
                "toast_variant": "success",
            }
        )
        # Check if the user's registration is completed
        return data
