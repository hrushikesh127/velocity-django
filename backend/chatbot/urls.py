from django.urls import path
from . import views
urlpatterns = [
    path('askbot/',views.askbot)
]
