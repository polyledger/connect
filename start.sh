#!/bin/bash

BIN=$(dirname $PWD)/venv/bin/activate
source $BIN

if [ $# -eq 0 ] ; then
  echo "Please provide an argument: (server|worker)"
elif [[ "$1" = 'server' ]] ; then
  python manage.py runserver 8080
elif [[ "$1" = 'worker' ]] ; then
  (
    redis-server --daemonize yes
  )
  celery -E -A custodian.tasks worker --loglevel=info -B
fi
