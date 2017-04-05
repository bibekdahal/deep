# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-04-05 05:38
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('entries', '0033_auto_20170331_0724'),
    ]

    operations = [
        migrations.AlterField(
            model_name='informationpillar',
            name='appear_in',
            field=models.CharField(blank=True, choices=[('PIN', 'People in need'), ('HAC', 'Humanitarian access'), ('HPR', 'Humanitarian profile'), ('CAS', 'Casualties'), ('KEY', 'Key events')], default=None, max_length=3, null=True),
        ),
    ]
