from __future__ import absolute_import, unicode_literals
import os
from celery import Celery

# set the default Django settings module for the 'celery' program.
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "polyledger.settings.local")

app = Celery('polyledger', broker='redis://localhost')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django app configs.
app.autodiscover_tasks()


# http://docs.celeryproject.org/en/latest/userguide/periodic-tasks.html
@app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    # sender.add_periodic_task(crontab(hour=7, minute=30), get_daily_prices.s())
    pass

@app.task(bind=True)
def debug_task(self):
    print('Request: {0!r}'.format(self.request))
