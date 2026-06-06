from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('location/', views.location, name='location'),
    path('api/weather/', views.weather_api, name='weather_api'),
    path("api/forecast/", views.forecast_api, name="forecast_api"),
    path("api/daily-forecast/", views.daily_forecast_api, name="daily_forecast_api"),
    path("api/air-quality/", views.air_quality_api, name="air_quality_api"),
]