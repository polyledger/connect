#!/bin/bash

BIN=$(dirname $PWD)/venv/bin/activate
source $BIN

if [ $# -eq 0 ] ; then
  echo "Please provide an argument: (server|worker)"
elif [[ "$1" = 'server' ]] ; then
  set -m
  python manage.py runserver 8080 &
  PID=$!
  sleep 3
  if ps -p $PID > /dev/null ; then
    kill -TSTP $PID
    open http://localhost:8080/account/
    fg %1
  fi
elif [[ "$1" = 'worker' ]] ; then
  (
    redis-server --daemonize yes
  )
  celery -E -A polyledger worker --loglevel=info -B
fi
