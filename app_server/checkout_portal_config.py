from django.conf import settings
from user.models import StripeCustomerPortal
import stripe

portals = StripeCustomerPortal.objects.filter()
stripe.api_key = settings.STRIPE_SECRET_KEY
features_dict = {
    "customer_update": {"enabled": False},
    "invoice_history": {"enabled": True},
    "payment_method_update": {"enabled": True},
    "subscription_cancel": {
        "enabled": True,
        "mode": "immediately",
        "proration_behavior": "create_prorations",
    },
    "subscription_update": {
        "enabled": True,
        "default_allowed_updates": ["price"],
        "proration_behavior": "create_prorations",
        "products": [
            {
                "product": "prod_Rj3hkyNjWJ7rEX",
                "prices": [settings.STRIPE_PRO_PRICE],
            },
        ],
    },
}
print(len(portals))
if len(portals) == 0:
    portal = stripe.billing_portal.Configuration.create(features=features_dict)
    StripeCustomerPortal.objects.create(name=portal["id"])
elif len(portals) > 0:
    portal = portals[0]
    stripe.billing_portal.Configuration.modify(portal.name, features=features_dict)
