from django.test import TestCase, RequestFactory
from django.contrib.auth import get_user_model

from .views import deposit

class TestViews(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.user = get_user_model().objects.create_user(
            first_name='Ari',
            last_name='Hall',
            email = 'ari@polyledger.com',
            password='top_secret'
        )

    def test_deposit(self):
        request = self.factory.get('/custodian/deposit/')
        request.user = self.user
        response = deposit(request)
        self.assertEqual(response.status_code, 200)
