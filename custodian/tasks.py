from celery import Celery
from celery.schedules import crontab

from lattice.data import HistoricRatesPipeline

app = Celery('tasks', broker='redis://localhost')

# http://docs.celeryproject.org/en/latest/userguide/periodic-tasks.html
@app.on_after_configure.connect
def setup_period_tasks(sender, **kwargs):
    sender.add_periodic_task(5.0, get_daily_prices.s())
    # sender.add_periodic_task(crontab(hour=7, minute=30), get_daily_prices.s())

@app.task(bind=True)
def get_daily_prices(self):
    """
    Gets pricing data via API of supported coins once a day and stores them in
    the db.
    """

    # Fetch missing prior values

    pass

@app.task(bind=True)
def get_real_time_prices(self):
    """
    Constantly gets pricing data via API of supported coins when running and
    stores them in the db.
    """
    pass
