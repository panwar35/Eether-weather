import requests
from django.http import JsonResponse
from django.shortcuts import render

def home(request):
    return render(request, 'weather_app/home.html')
def location(request):
    return render(request, 'weather_app/location.html')

API_KEY = "e952c44ec69ed7e99ee87c8f5f9b74c9"

from django.http import JsonResponse
import requests

def weather_api(request):
    city = request.GET.get("city")
    lat = request.GET.get("lat")
    lon = request.GET.get("lon")

    if lat and lon:
        url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}&units=metric"
    else:
        city = city or "Sardhana"
        url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"

    response = requests.get(url)
    data = response.json()

    print("OpenWeatherMap Response:", data)

    if response.status_code != 200:
        return JsonResponse({
            "error": data.get("message", "Unknown error"),
            "full_response": data
        }, status=response.status_code)

    return JsonResponse({
        "city": data["name"],
        "temp": data["main"]["temp"],
        "condition": data["weather"][0]["description"],
        "humidity": data["main"]["humidity"],
        "wind": data["wind"]["speed"],
        "visibility": data["visibility"] / 1000,
        "pressure": data["main"]["pressure"],
        "feels_like": data["main"]["feels_like"]
        
    })