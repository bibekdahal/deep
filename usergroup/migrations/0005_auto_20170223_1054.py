# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-02-23 10:54
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('usergroup', '0004_usergroup_admins'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usergroup',
            name='name',
            field=models.CharField(max_length=255, unique=True),
        ),
    ]