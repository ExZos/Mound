# Generated by Django 3.0.6 on 2020-05-25 21:49

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0014_auto_20200525_1611'),
    ]

    operations = [
        migrations.CreateModel(
            name='Request',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(max_length=15)),
                ('status', models.NullBooleanField()),
                ('timestamp', models.DateTimeField(auto_now=True)),
                ('space', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.Space')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.User')),
            ],
        ),
    ]
