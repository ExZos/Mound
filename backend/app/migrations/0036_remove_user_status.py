# Generated by Django 3.0.6 on 2020-06-22 20:15

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0035_user_status'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='status',
        ),
    ]
