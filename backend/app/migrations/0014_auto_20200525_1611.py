# Generated by Django 3.0.6 on 2020-05-25 20:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0013_user_lastactive'),
    ]

    operations = [
        migrations.AlterField(
            model_name='message',
            name='timestamp',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='lastActive',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
