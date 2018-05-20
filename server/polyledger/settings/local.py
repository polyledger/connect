import os
from .base import *  # noqa: F403

ACTIVATION_URL = 'http://localhost:3000/activate/'

DEBUG = True

ALLOWED_HOSTS = ['*']

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.10/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = '../static/'
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static')  # noqa: F405
]
