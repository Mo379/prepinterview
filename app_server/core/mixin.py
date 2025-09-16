from datetime import datetime
from functools import wraps

from rest_framework.response import Response
from rest_framework import status
from core.utils import (
    stripe_check_active_subscription,
)


def AnySubscriptionRequiredDec(f):
    @wraps(f)
    def dispatch(request, *args, **kwargs):
        active_subscriptions = stripe_check_active_subscription(request.user)
        # Call a function to check if the customer has subscriptions
        if active_subscriptions:
            return f(request, *args, **kwargs)
        else:
            return Response(
                {
                    "silent": 0,
                    "message": "Subscription Required!",
                    "toast_variant": "destructive",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

    return dispatch


def usage_meter_mixin(limit=5, time_format="%Y%m%d%H%M"):
    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view(request, *args, **kwargs):
            if request.method != "POST":
                return view_func(request, *args, **kwargs)

            user = request.user
            if not user.is_authenticated:
                return Response(
                    {"message": "Authentication required."},
                    status=status.HTTP_401_UNAUTHORIZED,
                )

            current_time_key = datetime.now().strftime(time_format)
            usage = user.last_minute_usage or {}

            if current_time_key not in usage:
                usage = {current_time_key: 1}
            else:
                if usage[current_time_key] >= limit and user.username != "Admin":
                    return Response(
                        {
                            "message": "Please slow down, you're limited "
                            + f"to {limit} messages per minute."
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                else:
                    if user.username != "Admin":
                        usage[current_time_key] += 1

            user.last_minute_usage = usage
            user.save(update_fields=["last_minute_usage"])
            return view_func(request, *args, **kwargs)

        return _wrapped_view

    return decorator
