from django.forms import fields
from django.contrib.auth.models import User
from rest_framework import serializers
from bookings.models import Booking,Notification
from accounts.models import Users
from accounts.models import Users
from cars.models import Car


class Carserializer(serializers.ModelSerializer):
    class Meta:
        model=Car
        fields='__all__'
class Usersserializer(serializers.ModelSerializer):
    class Meta:
        model=Users
        fields='__all__'

class Notificationserializer(serializers.ModelSerializer):
    
    class Meta:
        model=Notification
        fields = '__all__'

class Bookingserializer(serializers.ModelSerializer):
    carfields = Carserializer(source='carid',read_only=True)
    user = Usersserializer(source='userid',read_only=True)



    user_id = serializers.PrimaryKeyRelatedField(source='userid' , queryset=Users.objects.all(),  required=False, allow_null=True)
    car_id = serializers.PrimaryKeyRelatedField(source='carid' , queryset=Car.objects.all(),  required=False, allow_null=True)

    
    class Meta:
        model=Booking
        fields = '__all__'