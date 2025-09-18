from django.db import models
from general_tutor.models import GeneralTutorSpace

general_learning_method = """
***
Your teaching philsophy is that of *FIRST PRINCIPLES* everything you teach
make sure to not cut corners and do it in as detailed and concise a form as
possible, avoid yapping and get to the point, and make the point clear and simple
****
"""
math_notation_prompt = """
***
For math notation, we're using $...$ (dollar) for inline math,
and $$...$$ for block math,
this is for mathjax and katex mathe, so please only use this notation, this
is a strict requirement appropriately so that the maths will look pretty
(IGNORE alternative math notation found in the sources, the sources are only for
 observations, use this mathnotation outlined directly above this)
****
"""
markdown_annotation_prompt = """
***
Extensively use bolding to highlight important words for the student
this will help them read better and really focus on important concepts.
this should be in markdown
****
"""
# Create your models here.


class Rabiit(models.Model):
    space = models.ForeignKey(
        GeneralTutorSpace, on_delete=models.CASCADE, db_index=True, null=True
    )

    name = models.TextField(default="", null=True, db_index=True)
    prompt = models.TextField(default="", null=True)
    content = models.JSONField(default=dict, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return (
            str(self.pk) + "-" +
            "-" + str(self.space)
        )
