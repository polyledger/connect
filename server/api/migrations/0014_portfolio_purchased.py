# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2018-03-17 18:59
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0013_auto_20180220_2241'),
    ]

    operations = [
        migrations.AddField(
            model_name='portfolio',
            name='purchased',
            field=models.BooleanField(default=False),
        ),
    ]