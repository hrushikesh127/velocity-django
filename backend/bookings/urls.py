from django.urls import path
from . import views



urlpatterns = [
    path('',views.Bookinglistcreateview.as_view()),
    path('<uuid:pk>/', views.Bookingsingleview.as_view()),
    path('my-booking/' , views.mybooking ),
    path('<uuid:pk>/status/',views.Bookingstatus.as_view()),
    path('<uuid:pk>/delete/',views.Bookingdelete.as_view()),
    path('notifications/',views.mynotification),
    path('notifications/<uuid:pk>/read/',views.Readnotification.as_view()),
    path('notifications/readall/',views.Readallnotification.as_view()),
    path('notifications/<uuid:pk>/delete/',views.Delnotification.as_view())
]




