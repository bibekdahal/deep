# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-03-03 08:53
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion
import leads.models


class Migration(migrations.Migration):

    dependencies = [
        ('leads', '0024_event_admins'),
    ]

    operations = [
        migrations.CreateModel(
            name='LeadImage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.FileField(upload_to='leadimages/', verbose_name=leads.models.Lead)),
                ('lead', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='leads.Lead')),
            ],
        ),
    ]
