from django.shortcuts import get_object_or_404, render
from rest_framework.generics import ListCreateAPIView, RetrieveAPIView,UpdateAPIView,DestroyAPIView
from rest_framework.decorators import api_view,permission_classes
from django.views.decorators.csrf import csrf_exempt
from django.template.context_processors import request
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
from .serializer import Bookingserializer,Notificationserializer
from bookings.models import Booking,Notification

# Create your views here.

class Bookinglistcreateview(ListCreateAPIView):
    queryset =Booking.objects.all()
    serializer_class= Bookingserializer
    permission_classes=[IsAuthenticated]
    def get_queryset(self):
        return Booking.objects.all().order_by('-created_At')
    def perform_create(self, serializer):
        booking= serializer.save(userid=self.request.user)
        car = booking.carid
        msg=f"""
Hello {booking.userid.username},

A new car booking has been received on the Car Show platform.

NEW BOOKING DETAILS
-------------------
Customer Name: {booking.customername}
Customer Email: {booking.customeremail}
Contact Number: {booking.contactno}

CAR DETAILS
-----------
Car Name: {car.name}
Brand: {car.brand}
Year: {car.year}
Price: ₹{car.price}

BOOKING INFORMATION
-------------------
Booking ID: {booking.id}

Please log in to the admin panel to review and manage this booking.

Thank you,
Car Show Platform
"""
        send_mail(
            subject="Car Booking Details",
            message=msg,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.DEFAULT_FROM_EMAIL],
            fail_silently=False

        )

        

class Bookingsingleview(RetrieveAPIView):
    queryset =Booking.objects.all()
    serializer_class = Bookingserializer
    permission_classes=[IsAuthenticated]

@api_view(['GET'])
@csrf_exempt
@permission_classes([IsAuthenticated])
def mybooking(request):
    id=request.user.id 
    data =get_object_or_404(Booking,id=id)
    serializer = Bookingserializer(data)
    return Response(serializer.data,status=200)

class Bookingstatus(UpdateAPIView):
    queryset =Booking.objects.all()
    serializer_class = Bookingserializer
    permission_classes=[IsAuthenticated]
    def perform_update(self, serializer):
        booking = serializer.save()
        if booking.status in ['approved','declined']:
            Notification_data = {
                'message':f"Your booking for the {booking.carid.name} is {booking.status}."
            }
            notification_serializer = Notificationserializer(data=Notification_data)
            notification_serializer.is_valid()
            notification_serializer.save(
                user = booking.userid,
                requests = booking

            )



class Bookingdelete(DestroyAPIView):
    queryset = Booking.objects.all()
    serializer_class = Bookingserializer
    permission_classes=[IsAuthenticated]



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def mynotification(request):
    notifications= Notification.objects.filter(user=request.user.id)
    serializer = Notificationserializer(notifications,many=True)
    return Response(serializer.data, status=200)

class Readnotification(UpdateAPIView):
    serializer_class =Notificationserializer
    permission_classes=[IsAuthenticated]
    def get_queryset(self):
        return Notification.objects.filter(user = self.request.user )
    def patch(self, request, *args, **kwargs):
        notification = self.get_object()
        notification.is_read = True
        notification.save()

        return Response({"messages":" notification mark as read"},
                                 status=200)

    

class Readallnotification(UpdateAPIView):
    serializer_class = Notificationserializer
    permission_classes=[IsAuthenticated]
    def get_queryset(self):
        return Notification.objects.filter(user = self.request.user)
    def patch(self, request, *args, **kwargs):
        self.get_queryset().update(is_read = True)

        return Response({"messages":"all notification mark as read"},
                         status=200)

class Delnotification(DestroyAPIView):
    serializer_class =Notificationserializer
    permission_classes=IsAuthenticated
    def get_queryset(self):
        return Notification.objects.filter(user= self.request.user)
    