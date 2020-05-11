# Generated by Django 3.0.6 on 2020-05-09 15:26

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Space',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
            ],
        ),
        migrations.AddField(
            model_name='user',
            name='space',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='app.Space'),
            preserve_default=False,
        ),
    ]
