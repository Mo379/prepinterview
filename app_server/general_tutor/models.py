# Create your models here.
from user.models import User
from django.db import models

# Create your models here.


class GeneralTutorSpace(models.Model):
    #
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, db_index=True, null=True
    )
    name = models.CharField(max_length=1000, default="", null=True)
    case_information = models.TextField(default="", null=True)
    content = models.JSONField(default=dict, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
