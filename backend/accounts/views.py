from django.shortcuts import get_object_or_404, render
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from django.template.context_processors import request
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework.generics import ListAPIView, RetrieveUpdateDestroyAPIView,RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import AccessToken
from .models import Users

from accounts.serializers import Usersserializer
@api_view(['POST'])
@csrf_exempt
def register(request):
    serializer = Usersserializer(data = request.data)
    if serializer.is_valid():
        user = serializer.save()
        token = AccessToken.for_user(user)
        token['email'] = user.email
        token['isadmin'] =user.is_staff
        return Response({"token":str(token)}, status=201)
    return Response(serializer.errors , status=404)


@api_view(['POST'])
@csrf_exempt
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(request,username=username,password=password)
    if user is None:
        return Response({"message" : "user not found"},status=404)
    token = AccessToken.for_user(user)
    token['email']=user.email
    token['isadmin']= user.is_staff
    return Response({"token":str(token)},status=201)

class Userlistview(ListAPIView):
    queryset = Users.objects.all()
    serializer_class = Usersserializer

class UserDeatailview(RetrieveUpdateDestroyAPIView):
    queryset = Users.objects.all()
    serializer_class=Usersserializer

class Myuser(RetrieveAPIView):
    serializer_class = Usersserializer
    permission_classes = [IsAuthenticated]

   
    def get_object(self):
        return self.request.user

    