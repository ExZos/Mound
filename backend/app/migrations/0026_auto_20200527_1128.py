# Generated by Django 3.0.6 on 2020-05-27 15:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0025_auto_20200526_2227'),
    ]

    operations = [
        migrations.AlterField(
            model_name='vote',
            name='name',
            field=models.CharField(max_length=50, null=True),
        ),
    ]
