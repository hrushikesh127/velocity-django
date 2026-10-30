from django.shortcuts import get_object_or_404, render
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from django.template.context_processors import request
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.utils.http import urlsafe_base64_decode,urlsafe_base64_encode
from django.utils.encoding import  force_bytes ,force_str
from rest_framework.generics import ListAPIView, RetrieveUpdateDestroyAPIView, RetrieveAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.conf import settings
from .models import Users
from .serializers import forgotpasswordserializer,Resetpassworfserializer
from django.conf import settings

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

class Myuser(RetrieveUpdateAPIView):
    serializer_class = Usersserializer
    permission_classes = [IsAuthenticated]

   
    def get_object(self):
        return self.request.user


@csrf_exempt
@api_view(['POST'])
def forgot_password(request):
    serializer = forgotpasswordserializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    email = serializer.validated_data['email']
    user  = Users.objects.filter(email=email).first()
    if user :
        uid =urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        reset_link = (
            f"http://localhost:5173/reset-password/?uid={uid}&token={token}"
        )
        send_mail(
            subject='reset your token',
            message=f"Click this link to reset password {reset_link}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email]
        )
        return Response({'message':"password reset link is sent to this email"},status=201)

@csrf_exempt
@api_view(['POST'])
def reset_passwrord(request):
    serializer = Resetpassworfserializer(data =request.data)
    serializer.is_valid(raise_exception=True)
    newpassword = serializer.validated_data['newpassword']
    uid64 = serializer.validated_data['uid64']
    token = serializer.validated_data['token']
    try:
        uid = force_str(urlsafe_base64_decode(uid64))
        user = Users.objects.get(pk =uid)
    except Users.DoesNotExist:
        return Response({"message":"invalid reset link"},status=404)
    if not default_token_generator.check_token(user,token):
        return Response({"message":"Invalid and expired reset link"})
    newpassword = serializer.validated_data['newpassword']
    user.set_password(newpassword)
    user.save()
    return Response({'message':"Password reset succesfully"},status=200)
    


    