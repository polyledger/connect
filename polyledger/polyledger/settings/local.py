from .base import *

DEBUG = True

ALLOWED_HOSTS = ['localhost']

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.10/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = os.path.abspath(os.path.join(BASE_DIR, '../..', 'static'))
