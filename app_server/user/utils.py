import boto3

import json
from django.conf import settings
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils import six


# Function to send mail
def sendMailLambda(payload):
    lambda_client = boto3.client(
        "lambda",
        region_name=settings.EMAIL_REGION,
        aws_access_key_id=settings.AWS_ACCESS,
        aws_secret_access_key=settings.AWS_SECRET,
    )
    lambda_client.invoke(
        FunctionName=settings.EMAIL_FUNCTION_NAME,
        Payload=json.dumps(payload),
        InvocationType="Event",
    )


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
