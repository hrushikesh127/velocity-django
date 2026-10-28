from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.parsers import FormParser, MultiPartParser
from .models import Car
from cars.serializers import Carserializer
# Create your views here.
class Carviewset(ModelViewSet):
    queryset=Car.objects.all()
    serializer_class = Carserializer
    parser_classes=[FormParser,MultiPartParser]
    permission_classes=[IsAuthenticated,IsAdminUser]
