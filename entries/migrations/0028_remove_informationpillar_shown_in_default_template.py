# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-03-22 07:09
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('entries', '0027_informationpillar_shown_in_default_template'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='informationpillar',
            name='shown_in_default_template',
        ),
    ]
