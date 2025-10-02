from user.models import User
import requests

from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils import six


# Function to send mail
def sendMailLambda(payload):
    try:
        url = settings.EMAIL_WEBHOOK_URL
        admin = User.objects.get(username="Admin")
        short_token = RefreshToken.for_user(admin)
        headers = {
            "Authorization": f"Bearer {str(short_token.access_token)}",
            "Content-Type": "application/json",
        }
        payload = {**payload, 'app_name': settings.APP_NAME}
        response = requests.post(url, json=payload, headers=headers)
        assert response.status_code == 200, "Email Sending Failed"
    except Exception as e:
        raise e
    else:
        return


class TokenGenerator(PasswordResetTokenGenerator):
    def _make_hash_value(self, user, timestamp):
        return (
            six.text_type(user.pk)
            + six.text_type(timestamp)
            + six.text_type(user.is_active)
        )


class PasswordResetToken(PasswordResetTokenGenerator):
    def _make_hash_value(self, user, timestamp):
        return (
            six.text_type(user.pk)
            + six.text_type(timestamp)
            + six.text_type(user.password_set)
        )


account_activation_token = TokenGenerator()
password_reset_token = PasswordResetToken()
