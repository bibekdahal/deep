# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-02-17 06:58
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_auto_20161205_0709'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='hid',
            field=models.TextField(blank=True, default=None, null=True),
        ),
    ]
