# Custom Django management command
# https://docs.djangoproject.com/en/2.0/howto/custom-management-commands/

import shlex
import subprocess

from django.core.management.base import BaseCommand
from django.utils import autoreload


def restart_celery():
    cmd = 'pkill -f celery'
    subprocess.call(shlex.split(cmd))
    cmd = 'celery -E -A polyledger worker --loglevel=info -B'
    subprocess.call(shlex.split(cmd))


class Command(BaseCommand):

    def handle(self, *args, **options):
        autoreload.main(restart_celery)
