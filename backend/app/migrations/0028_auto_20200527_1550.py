# Generated by Django 3.0.6 on 2020-05-27 19:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0027_auto_20200527_1533'),
    ]

    operations = [
        migrations.AlterField(
            model_name='createpoll',
            name='name',
            field=models.CharField(max_length=50, unique=True),
        ),
        migrations.AlterUniqueTogether(
            name='createvote',
            unique_together={('createPoll', 'name')},
        ),
    ]
