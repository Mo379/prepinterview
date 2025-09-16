# Create your models here.
from user.models import User
from django.db import models

# Create your models here.


class GeneralTutorSpace(models.Model):
    #
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, db_index=True, null=True)
    name = models.CharField(max_length=150, default="", null=True)
    is_open = models.BooleanField(default=False, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class GeneralTutorSpaceSubscription(models.Model):
    space = models.ForeignKey(
        GeneralTutorSpace, on_delete=models.CASCADE, db_index=True, null=True
    )
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, db_index=True, null=True)
    is_owner = models.BooleanField(default=False, null=True)
    #
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("space", "user")

    def __str__(self):
        return self.user.username + "-" + str(self.space)


class GeneralTutorLesson(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, db_index=True, null=True)
    space_subscription = models.ForeignKey(
        GeneralTutorSpaceSubscription, on_delete=models.CASCADE, db_index=True, null=True
    )
    source = models.ForeignKey(
        'sources.Source', on_delete=models.CASCADE, db_index=True, null=True
    )
    lessontitle = models.TextField(max_length=500, default="", null=True)
    #
    completed = models.BooleanField(default=False, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(str(self.user.username) + str(self.created_at))
