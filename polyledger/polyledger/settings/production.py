from .base import *

DEBUG = False

ALLOWED_HOSTS = ['*']

# Simplified static file serving.
# https://warehouse.python.org/project/whitenoise/
MIDDLEWARE.append('whitenoise.middleware.WhiteNoiseMiddleware')

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.10/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = '/app/static'

# Simplified static file serving.
# https://warehouse.python.org/project/whitenoise/

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
