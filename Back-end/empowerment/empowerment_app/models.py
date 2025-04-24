from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission

class CustomUser(AbstractUser):
    # Additional user fields
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)

    groups = models.ManyToManyField(
        Group,
        related_name="customuser_set",  # override default 'user_set'
        blank=True,
        help_text="The groups this user belongs to.",
        verbose_name="groups",
        related_query_name="customuser",
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name="customuser_set",  # override default 'user_set'
        blank=True,
        help_text="Specific permissions for this user.",
        verbose_name="user permissions",
        related_query_name="customuser",
    )

    def __str__(self):
        return self.username
