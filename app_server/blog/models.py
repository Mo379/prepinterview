from django.db import models

# Create your models here.


class Blog(models.Model):
    slug = models.SlugField(db_index=True, unique=True, blank=True, null=True)
    title = models.TextField(default="", null=True)
    article = models.TextField(default="", null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return str(self.pk) + "-" + str(self.title)
