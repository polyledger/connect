# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2018-05-22 17:03
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_auto_20180522_1645'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bitbutter',
            name='uuid',
            field=models.UUIDField(null=True),
        ),
    ]