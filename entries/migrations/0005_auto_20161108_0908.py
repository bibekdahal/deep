# -*- coding: utf-8 -*-
# Generated by Django 1.9.8 on 2016-11-08 09:08
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('entries', '0004_auto_20161107_0622'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='affectedgroup',
            options={'verbose_name_plural': 'Affected Groups'},
        ),
        migrations.AlterModelOptions(
            name='informationpillar',
            options={'verbose_name_plural': 'Information Pillars'},
        ),
        migrations.AlterModelOptions(
            name='specificneedsgroup',
            options={'verbose_name_plural': 'Specific Needs Groups'},
        ),
        migrations.AlterModelOptions(
            name='vulnerablegroup',
            options={'verbose_name_plural': 'Vulnerable Groups'},
        ),
        migrations.AddField(
            model_name='informationpillar',
            name='active_background_color',
            field=models.CharField(default='#ea7120', max_length=20),
        ),
        migrations.AddField(
            model_name='informationpillar',
            name='background_color',
            field=models.CharField(default='#fbe8db', max_length=20),
        ),
    ]
