from django.conf import settings

import random
import stripe
import string
import requests
import threading
import re


hashids = settings.HASHIDS


def upload_file_to_s3(file_obj, s3_key):
    try:
        # Upload the file to S3
        settings.AWS_S3_C.upload_fileobj(
            Fileobj=file_obj,
            Bucket=settings.AWS_BUCKET_NAME,
            Key=s3_key,
            ExtraArgs={"ContentType": file_obj.content_type},
        )

    except Exception as e:
        raise e
    else:
        return s3_key


def TagGenerator():
    x = "".join(random.choices(string.ascii_letters + string.digits, k=10)).lower()
    return x


def h_encode(id):
    return hashids.encode(id)


def h_decode(h):
    z = hashids.decode(h)
    if z:
        return z[0]


class HashIdConverter:
    regex = "[a-zA-Z0-9]{8,}"

    def to_python(self, value):
        return h_decode(value)

    def to_url(self, value):
        return h_encode(value)


def stripe_get_customer(user):
    # First check if the user exists before creating though, this
    # This code needs to be finiseh
    def create_customer(user):
        customer = stripe.Customer.create(
            email=user.email,
            name=user.first_name + " " + user.last_name,
            metadata={
                "firstname": user.first_name,
                "lastname": user.last_name,
                "username": user.username,
            },
        )
        return customer

    try:
        stripe.api_key = settings.STRIPE_SECRET_KEY
        customer = stripe.Customer.retrieve(user.stripe_customer_id)
        if "deleted" in customer:
            if customer["deleted"] is True:
                customer = create_customer(user)
    except Exception:
        customer = create_customer(user)
    finally:
        user.stripe_customer_id = customer["id"]
        user.save()
        return customer


def stripe_check_active_subscription(user):
    # First check if the user exists before creating though, this
    # This code needs to be finiseh
    try:
        stripe.api_key = settings.STRIPE_SECRET_KEY
        subscriptions = stripe.Subscription.list(customer=user.stripe_customer_id)
        active_subscription = True if len(subscriptions["data"]) > 0 else False
    except Exception:
        active_subscription = False
    finally:
        if active_subscription:
            price_id = subscriptions["data"][0]["items"]["data"][0]["plan"]["id"]
            # you might need to check the free subscription price,
            # fix this logic when deployed
            if price_id == settings.STRIPE_PRO_PRICE:
                return "pro"
        return False


def request_task(url, json, headers):
    requests.post(url, json=json, headers=headers)


def make_alphanumeric_hyphen(string):
    # Convert to lowercase
    string = string.lower()
    # Replace any non-alphanumeric characters (except hyphens) with a hyphen
    string = re.sub(r"[^a-z0-9]+", "-", string)
    # Remove leading or trailing hyphens, if any
    return string.strip("-")


def fire_and_forget(url, json, headers):
    threading.Thread(target=request_task, args=(url, json, headers)).start()
