# Generated by Django 3.0.6 on 2020-05-27 23:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0028_auto_20200527_1550'),
    ]

    operations = [
        migrations.AddField(
            model_name='space',
            name='status',
            field=models.BooleanField(default=True),
        ),
    ]