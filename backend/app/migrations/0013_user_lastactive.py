# Generated by Django 3.0.6 on 2020-05-25 17:37

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0012_auto_20200514_1140'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='lastActive',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
