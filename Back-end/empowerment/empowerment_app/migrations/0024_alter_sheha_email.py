# Generated by Django 5.2.1 on 2025-06-20 11:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('empowerment_app', '0023_delete_mockbankloan'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sheha',
            name='email',
            field=models.EmailField(max_length=254),
        ),
    ]
