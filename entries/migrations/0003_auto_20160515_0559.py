# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-05-15 05:59
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('entries', '0002_auto_20160514_1147'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='affectedgroup',
            name='id',
        ),
        migrations.RemoveField(
            model_name='country',
            name='id',
        ),
        migrations.RemoveField(
            model_name='sector',
            name='id',
        ),
        migrations.RemoveField(
            model_name='underlyingfactor',
            name='id',
        ),
        migrations.RemoveField(
            model_name='vulnerablegroup',
            name='id',
        ),
        migrations.AddField(
            model_name='country',
            name='code',
            field=models.CharField(default=None, max_length=5, primary_key=True, serialize=False),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='entry',
            name='map_data',
            field=models.TextField(default=None),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='affectedgroup',
            name='group_name',
            field=models.CharField(max_length=70, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='sector',
            name='name',
            field=models.CharField(max_length=70, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='underlyingfactor',
            name='name',
            field=models.CharField(max_length=70, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='vulnerablegroup',
            name='group_name',
            field=models.CharField(max_length=70, primary_key=True, serialize=False),
        ),
    ]