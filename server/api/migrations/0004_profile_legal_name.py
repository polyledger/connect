# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2018-04-18 03:40
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_auto_20180418_0250'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='legal_name',
            field=models.CharField(default='', max_length=255),
            preserve_default=False,
        ),
    ]