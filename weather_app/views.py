import requests
from django.http import JsonResponse
from django.shortcuts import render

def home(request):
    return render(request, 'weather_app/home.html')
def location(request):
    return render(request, 'weather_app/location.html')

API_KEY = "YOUR_API_KEY"

def weather_api(request):
    city = request.GET.get("city")
    lat = request.GET.get("lat")
    lon = request.GET.get("lon")

    if lat and lon:
        url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}&units=metric"
    else:
        city = city or "Sardhana"
        url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"

    data = requests.get(url).json()

    if "main" not in data:
        return JsonResponse({"error": "Weather not found"}, status=400)

    return JsonResponse({
        "city": data["name"],
        "temp": data["main"]["temp"],
        "condition": data["weather"][0]["description"]
    })