"""
Define and configure the Celery instance

Using Celery with Django:
http://docs.celeryproject.org/en/latest/django/first-steps-with-django.html
"""

from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from celery.signals import worker_ready

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'polyledger.settings.local')

broker = os.environ['REDIS_URL'] or 'redis://redis'
app = Celery('polyledger')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django app configs.
app.autodiscover_tasks()


@worker_ready.connect
def on_start(sender, **kwargs):
    with sender.app.connection() as conn:
        sender.app.send_task(
            'api.tasks.fill_daily_historical_prices', connection=conn
        )


@app.task(bind=True)
def debug_task(self):
    print('Request: {0!r}'.format(self.request))
