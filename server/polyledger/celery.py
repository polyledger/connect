"""
Define and configure the Celery instance

Using Celery with Django:
http://docs.celeryproject.org/en/latest/django/first-steps-with-django.html
"""

from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from django.db.models.signals import post_migrate
from django.dispatch import receiver

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'polyledger.settings.local')

app = Celery('polyledger')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django app configs.
app.autodiscover_tasks()


# Fetch historical prices after API app completes migrations
@receiver(post_migrate)
def on_start(sender, **kwargs):
    if sender.name == 'api':
        app.send_task('api.tasks.fill_daily_historical_prices')
