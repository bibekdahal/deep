# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-03-06 05:50
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('entries', '0023_merge_20170305_0700'),
    ]

    operations = [
        # migrations.RemoveField(
        #     model_name='entryimage',
        #     name='information',
        # ),
        migrations.AddField(
            model_name='entryinformation',
            name='image',
            field=models.TextField(blank=True, default=''),
        ),
        migrations.DeleteModel(
            name='EntryImage',
        ),
    ]
