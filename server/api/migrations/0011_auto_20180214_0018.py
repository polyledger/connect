# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2018-02-14 00:18
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0010_auto_20180130_0400'),
    ]

    operations = [
        migrations.AddField(
            model_name='distribution',
            name='params',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='distribution',
            name='date',
            field=models.DateTimeField(),
        ),
    ]