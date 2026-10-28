from django.contrib.auth import get_user_model
from django.test import override_settings
from rest_framework.test import APITestCase

from bookings.models import Booking
from cars.models import Car


@override_settings(EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend")
class BookingCreateTests(APITestCase):
    def test_booking_is_assigned_to_authenticated_user(self):
        user_model = get_user_model()
        user = user_model.objects.create_user(
            username="booking-user",
            password="test-password",
            phone="5550100",
            location="Test",
        )
        other_user = user_model.objects.create_user(
            username="other-user",
            password="test-password",
            phone="5550101",
            location="Test",
        )
        car = Car.objects.create(
            name="Test car",
            brand="Test brand",
            year=2024,
            tag="test",
            price="10000.00",
            power="100 hp",
            accel="5 sec",
            fuel_type="petrol",
            owner_name="Owner",
            owner_contact="5550102",
            description="Test car",
        )
        self.client.force_authenticate(user=user)

        response = self.client.post(
            "/api/bookings/",
            {
                "user_id": other_user.pk,
                "car_id": car.pk,
                "customername": "Customer",
                "customeremail": "customer@example.com",
                "contactno": 5550103,
                "location": "Test",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        booking = Booking.objects.get()
        self.assertEqual(booking.userid, user)
