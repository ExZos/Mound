# Generated by Django 3.0.6 on 2020-05-27 23:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0029_space_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='space',
            name='status',
            field=models.BooleanField(default=False),
        ),
    ]
