# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-04-24 07:51
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('entries', '0036_exporttoken'),
    ]

    operations = [
        migrations.AddField(
            model_name='exporttoken',
            name='data',
            field=models.TextField(blank=True),
        ),
    ]
