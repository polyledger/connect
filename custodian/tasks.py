from celery import Celery

app = Celery('tasks', broker='redis://localhost')

@app.task
def get_prices():
    """
    Gets pricing data via API of supported coins and stores them in the db.
    """
    pass
