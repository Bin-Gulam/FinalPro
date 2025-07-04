# Generated by Django 5.2.1 on 2025-06-04 12:17

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('empowerment_app', '0005_alter_applicant_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='applicant',
            name='passport_size',
            field=models.ImageField(blank=True, null=True, upload_to='passport_photos/'),
        ),
        migrations.AlterField(
            model_name='applicant',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
