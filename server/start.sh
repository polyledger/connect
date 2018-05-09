#!/bin/bash
# TODO: tweak number of workers with ENV var?

python manage.py migrate &&
python manage.py collectstatic --noinput &&
gunicorn polyledger.wsgi -b 0.0.0.0:8000
