# Generated by Django 3.0.6 on 2020-05-26 14:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0020_auto_20200525_2227'),
    ]

    operations = [
        migrations.AddField(
            model_name='poll',
            name='name',
            field=models.CharField(default='', max_length=50),
            preserve_default=False,
        ),
    ]
