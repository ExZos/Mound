# Generated by Django 3.0.6 on 2020-05-13 23:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0009_message_spaceid'),
    ]

    operations = [
        migrations.RenameField(
            model_name='message',
            old_name='spaceID',
            new_name='space',
        ),
        migrations.RenameField(
            model_name='message',
            old_name='userID',
            new_name='user',
        ),
        migrations.RenameField(
            model_name='user',
            old_name='spaceID',
            new_name='space',
        ),
        migrations.AlterField(
            model_name='message',
            name='timestamp',
            field=models.DateTimeField(),
        ),
        migrations.AlterUniqueTogether(
            name='user',
            unique_together={('space', 'name')},
        ),
    ]
