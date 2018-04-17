from rest_framework import exceptions
from rest_framework.response import Response
from django.core.exceptions import PermissionDenied
from django.http import Http404
from django.db import connection, transaction


def custom_exception_handler(exc, context):
    """
    Returns the response that should be used for any given exception.
    By default we handle the REST framework `APIException`, and also
    Django's built-in `Http404` and `PermissionDenied` exceptions.
    Any unhandled exceptions may return `None`, which will cause a 500 error
    to be raised.
    """
    if isinstance(exc, Http404):
        exc = exceptions.NotFound()
    elif isinstance(exc, PermissionDenied):
        exc = exceptions.PermissionDenied()

    if isinstance(exc, exceptions.APIException):
        headers = {}
        if getattr(exc, 'auth_header', None):
            headers['WWW-Authenticate'] = exc.auth_header
        if getattr(exc, 'wait', None):
            headers['Retry-After'] = '%d' % exc.wait

        data = {'errors': []}
        error = {}

        if isinstance(exc.detail, dict):
            for field, value in exc.detail.items():
                if field == 'non_field_errors':
                    field = 'error'
                error['status_code'] = exc.status_code
                error['message'] = "{0}: {1}".format(
                    field.capitalize(), " ".join(value))
                data['errors'].append(error)
        else:
            error = {}
            error['message'] = exc.detail
            error['status_code'] = exc.status_code
            data['errors'].append(error)

        atomic_requests = connection.settings_dict.get('ATOMIC_REQUESTS', False)
        if atomic_requests and connection.in_atomic_block:
            transaction.set_rollback(True)
        return Response(data, status=exc.status_code, headers=headers)

    return None
