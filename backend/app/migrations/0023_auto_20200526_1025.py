# Generated by Django 3.0.6 on 2020-05-26 14:25

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0022_auto_20200526_1013'),
    ]

    operations = [
        migrations.AlterField(
            model_name='poll',
            name='user',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='app.User'),
        ),
    ]
