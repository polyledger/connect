from .base import *

ACTIVATION_URL = 'http://portfolio.polyledger.com/activate/'

DEBUG = False

ALLOWED_HOSTS = ['*']

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.10/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = '/srv/polyledger/static'
STATICFILES_DIRS = [os.path.join(BASE_DIR, 'static')]

# These settings can be enabled with HTTPS
# SECURE_HSTS_SECONDS = True
# SECURE_HSTS_INCLUDE_SUBDOMAINS = True
# SECURE_HSTS_PRELOAD = True
# SECURE_CONTENT_TYPE_NOSNIFF = True
# SECURE_BROWSER_XSS_FILTER = True
# SECURE_SSL_REDIRECT = True
# SESSION_COOKIE_SECURE = True
# CSRF_COOKIE_SECURE = True
# X_FRAME_OPTIONS = 'DENY'
# CSRF_TRUSTED_ORIGINS = ['portfolio.polyledger.com', 'admin.polyledger.com']
