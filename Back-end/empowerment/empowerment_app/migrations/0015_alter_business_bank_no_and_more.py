# Generated by Django 5.2.1 on 2025-06-13 05:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('empowerment_app', '0014_remove_applicant_bank_status_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='business',
            name='bank_no',
            field=models.CharField(max_length=20),
        ),
        migrations.AlterField(
            model_name='business',
            name='verification_status',
            field=models.CharField(choices=[('Pending', 'Pending'), ('Verified', 'Verified'), ('Rejected', 'Rejected')], default='Pending', max_length=10),
        ),
    ]
