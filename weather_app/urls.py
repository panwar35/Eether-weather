from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('location/', views.location, name='location'),
    path('api/weather/', views.weather_api, name='weather_api')
]