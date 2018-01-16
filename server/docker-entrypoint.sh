#!/bin/bash
python3 manage.py makemigrations
python3 manage.py migrate

# Collect static files
mkdir -p /usr/src/staticfiles/
python3 manage.py collectstatic --noinput

# Prepare log files and start outputting logs to stdout
mkdir -p /usr/src/logs/
touch /usr/src/logs/gunicorn.log
touch /usr/src/logs/access.log
tail -n 0 -f /usr/src/logs/*.log &

# Start Gunicorn processes
echo Starting Gunicorn
exec gunicorn polyledger.wsgi \
    --bind 0.0.0.0:8000 \
    --workers 3 \
    --log-level=info \
    --log-file=/usr/src/logs/gunicorn.log \
    --access-logfile=/usr/src/logs/access.log \
    "$@"
