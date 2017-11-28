"""
Django settings for polyledger project.

For more information on this file, see
https://docs.djangoproject.com/en/1.10/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.10/ref/settings/
"""

import os
from django.contrib import messages
from celery.schedules import crontab

# See https://docs.djangoproject.com/en/1.11/ref/contrib/messages/#message-tags
MESSAGE_TAGS = {
    messages.constants.ERROR: 'danger'
}

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('SECRET_KEY')


# Application definition

INSTALLED_APPS = [
    'account.apps.AccountConfig',
    'api.apps.ApiConfig',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.humanize',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'multiselectfield',
    'rest_framework',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'polyledger.urls'

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated'
    ]
}

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'polyledger.wsgi.application'


# https://docs.djangoproject.com/en/1.11/topics/auth/customizing/#specifying-a-custom-user-model
AUTH_USER_MODEL = 'account.User'


# Password validation
# https://docs.djangoproject.com/en/1.10/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    { 'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator' },
    { 'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator' },
    { 'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator' },
    { 'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator' },
]


# File Storage
# https://docs.djangoproject.com/en/1.11/ref/settings/#std:setting-DEFAULT_FILE_STORAGE
DEFAULT_FILE_STORAGE = 'django.core.files.storage.FileSystemStorage'

# Internationalization
# https://docs.djangoproject.com/en/1.10/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'US/Pacific'

USE_I18N = True

USE_L10N = True

USE_TZ = True

# Set auth redirects and URLs
# https://docs.djangoproject.com/en/1.11/ref/settings/#login-redirect-url
LOGIN_REDIRECT_URL = '/account/'
LOGIN_URL = '/account/login/'
LOGOUT_REDIRECT_URL = '/account/login/'

# Set admins for code error notifications
# https://docs.djangoproject.com/en/1.11/ref/settings/#admins
ADMINS = [('Matthew', 'matthew@polyledger.com')]

# Email configuration
EMAIL_USE_TLS = True
EMAIL_HOST = 'smtp.mailgun.org'
EMAIL_HOST_USER = 'postmaster@polyledger.com'
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD')
EMAIL_USE_LOCALTIME = True
EMAIL_PORT = 587

# Celery application definition
# http://docs.celeryproject.org/en/v4.0.2/userguide/configuration.html
CELERY_BROKER_URL = 'redis://localhost:6379'
CELERY_RESULT_BACKEND = 'redis://localhost:6379'
CELERY_ACCEPT_CONTENT = ['application/json']
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TASK_SERIALIZER = 'json'
CELERY_TIMEZONE = 'US/Pacific'
CELERY_BEAT_SCHEDULE = {
    'fill_daily_historical_prices': {
        'task': 'api.tasks.get_current_prices',
        'schedule': crontab(hour=0, minute=0)
    }
}
