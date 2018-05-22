#!/usr/bin/env bash

set -o errexit
set -o pipefail
set -o nounset

python manage.py makemigrations --noinput &&
python manage.py migrate

if [ "$PYTHON_ENV" = "development" ]
then
    # Start the Django development server
    python manage.py runserver 0.0.0.0:8000
else
    # WhiteNoise will allow static file serving through the app
    # See http://whitenoise.evans.io/en/stable/django.html
    python manage.py collectstatic --no-input

    # Give write access to Django Admin/API static files
    chown -R polyledger /srv/polyledger/static

    # Start Gunicorn web server
    gunicorn polyledger.wsgi -b 0.0.0.0:8000
fi
