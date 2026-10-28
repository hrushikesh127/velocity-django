from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase


class MyuserViewTests(APITestCase):
    def test_returns_authenticated_user_without_url_lookup(self):
        user = get_user_model().objects.create_user(
            username="current-user",
            password="test-password",
            phone="5550100",
            location="Test",
        )
        self.client.force_authenticate(user=user)

        response = self.client.get("/api/myuser/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["id"], user.id)
        self.assertEqual(response.data["username"], user.username)
