# -*- coding: utf-8 -*-
# Generated by Django 1.9.8 on 2016-08-03 05:38
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('entries', '0004_auto_20160802_1613'),
    ]

    operations = [
        migrations.RenameField(
            model_name='entry',
            old_name='sepecific_needs_groups',
            new_name='specific_needs_groups',
        ),
    ]