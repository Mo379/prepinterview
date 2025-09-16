from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models import Q


# Create your models here.
class User(AbstractUser):
    email = models.EmailField(unique=False, null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["email"], name="unique_email", condition=Q(email__isnull=False)
            )
        ]

    is_guest = models.BooleanField(default=False)
    is_affiliate = models.BooleanField(default=False)
    affiliate_stripe_account_id = models.CharField(
        max_length=150, default="", null=True, blank=True
    )
    affiliate_promotion_id = models.CharField(
        max_length=50, default="", null=True, blank=True
    )
    affiliate_promotion_code = models.CharField(
        max_length=50, default="", null=True, blank=True
    )
    affiliate_tally = models.IntegerField(default=0, null=True)
    accepted_terms = models.BooleanField(default=False)
    registration = models.BooleanField(default=False)
    google_login = models.BooleanField(default=False)
    password_set = models.BooleanField(default=True)
    #
    CHOICES_THEME = [
        ("lig", "Light"),
        ("dar", "Dark"),
    ]
    theme = models.CharField(
        max_length=3,
        choices=CHOICES_THEME,
        default="dar",
    )
    last_minute_usage = models.JSONField(default=dict, null=True)

    stripe_customer_id = models.CharField(
        max_length=255, default="", null=True, db_index=True
    )

    def __str__(self):
        return self.username


class StripeCustomerPortal(models.Model):
    name = models.CharField(max_length=255, default="",
                            null=True, db_index=True)

    def __str__(self):
        return str(self.name)
