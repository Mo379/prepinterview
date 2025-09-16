from django.contrib import admin
from user.models import User, StripeCustomerPortal

# Register your models here.
admin.site.register(StripeCustomerPortal)
admin.site.register(User)
