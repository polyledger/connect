#!/bin/bash

BIN=$(pwd)/venv/bin/activate
source $BIN

if [ $# -eq 0 ] ; then
  echo "Please provide an argument: (server|worker)"
elif [[ "$1" = 'server' ]] ; then
  set -m
  python manage.py runserver 8000 &
elif [[ "$1" = 'worker' ]] ; then
  (
    redis-server --daemonize yes
  )
  celery -E -A polyledger worker --loglevel=info -B
fi
