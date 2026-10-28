from django.urls import path
from . import views

from .views import UserDeatailview,Userlistview,Myuser
urlpatterns = [
    path('register/' ,views.register ),
    path('login/' , views.login),
    path('users/' , Userlistview.as_view()),
    path('users/<int:pk>/', UserDeatailview.as_view()),
    path('myuser/', Myuser.as_view()),
    
]
