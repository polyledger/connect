python manage.py makemigrations &&
python manage.py migrate

if [ "$PYTHON_ENV" = development ]
then
    python manage.py runserver 0.0.0.0:8000
else
    gunicorn polyledger.wsgi -b 0.0.0.0:8000
fi
