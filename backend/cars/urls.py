
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from django.db import router

from cars.views import Carviewset
router = DefaultRouter()
router.register('Cars', Carviewset,basename='car')


urlpatterns = router.urls
