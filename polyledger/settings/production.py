from .base import *

DEBUG = False

ALLOWED_HOSTS = ['*']

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.10/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = '/home/static'

POSTGRESQL_NAME = = os.environ.get('POSTGRESQL_NAME')
POSTGRESQL_USER = = os.environ.get('POSTGRESQL_USER')
POSTGRESQL_PASSWORD = = os.environ.get('POSTGRESQL_PASSWORD')

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': POSTGRESQL_NAME,
        'USER': POSTGRESQL_USER,
        'PASSWORD': POSTGRESQL_PASSWORD,
        'HOST': 'localhost',
        'PORT': '',
    }
}
