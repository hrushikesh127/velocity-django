from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class Users(AbstractUser):
    phone = models.CharField(max_length=50)
    profileimg = models.ImageField(
        upload_to='profiles/',
        null=True,
        blank=True
    )
    location = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    REQUIRED_FIELDS = ['phone','location']
    def __str__(self):
        return self.username
