# Generated by Django 3.0.6 on 2020-05-26 02:27

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    atomic = False

    dependencies = [
        ('app', '0019_auto_20200525_2012'),
    ]

    operations = [
        migrations.CreateModel(
            name='Poll',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.NullBooleanField()),
                ('timestamp', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='Vote',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('result', models.BooleanField()),
                ('timestamp', models.DateTimeField(auto_now=True)),
                ('poll', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.Poll')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.User')),
            ],
            options={
                'unique_together': {('poll', 'user')},
            },
        ),
        migrations.AlterUniqueTogether(
            name='spaceresponse',
            unique_together=None,
        ),
        migrations.RemoveField(
            model_name='spaceresponse',
            name='spaceRequest',
        ),
        migrations.RemoveField(
            model_name='spaceresponse',
            name='user',
        ),
        migrations.RenameModel(
            old_name='SpaceRequestType',
            new_name='PollType',
        ),
        migrations.DeleteModel(
            name='SpaceRequest',
        ),
        migrations.DeleteModel(
            name='SpaceResponse',
        ),
        migrations.AddField(
            model_name='poll',
            name='pollType',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.PollType'),
        ),
        migrations.AddField(
            model_name='poll',
            name='space',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.Space'),
        ),
        migrations.AddField(
            model_name='poll',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.User'),
        ),
    ]