import requests
from django.http import JsonResponse
from django.shortcuts import render

def home(request):
    return render(request, 'weather_app/home.html')
def location(request):
    return render(request, 'weather_app/location.html')

import os

API_KEY = "e952c44ec69ed7e99ee87c8f5f9b74c9"

def pm25_to_aqi(pm25):
    breakpoints = [
        (0.0, 12.0, 0, 50),
        (12.1, 35.4, 51, 100),
        (35.5, 55.4, 101, 150),
        (55.5, 150.4, 151, 200),
        (150.5, 250.4, 201, 300),
        (250.5, 350.4, 301, 400),
        (350.5, 500.4, 401, 500),
    ]

    for c_low, c_high, aqi_low, aqi_high in breakpoints:
        if c_low <= pm25 <= c_high:
            return round(
                ((aqi_high - aqi_low) / (c_high - c_low))
                * (pm25 - c_low)
                + aqi_low
            )

    return 500

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
        "visibility": data["visibility"],
        "pressure": data["main"]["pressure"],
        "feels_like": data["main"]["feels_like"],
        "sunrise": data["sys"]["sunrise"],
        "sunset": data["sys"]["sunset"]
        
    })

def forecast_api(request):
    city = request.GET.get("city", "Delhi")

    url = f"https://api.openweathermap.org/data/2.5/forecast?q={city}&appid={API_KEY}&units=metric"

    response = requests.get(url)
    data = response.json()

    if response.status_code != 200:
        return JsonResponse({
            "error": data.get("message", "Unknown error")
        }, status=response.status_code)

    forecast = []

    for item in data["list"][:15]:  # Get forecast for the next 15 time points (3-hour intervals)
        forecast.append({
            "time": item["dt_txt"][11:16],
            "temp": item["main"]["temp"]
        })

    return JsonResponse({
        "forecast": forecast
    })

def daily_forecast_api(request):
    city = request.GET.get("city", "Delhi")

    url = f"https://api.openweathermap.org/data/2.5/forecast?q={city}&appid={API_KEY}&units=metric"

    data = requests.get(url).json()

    days = {}

    for item in data["list"]:
        date = item["dt_txt"].split()[0]

        if date not in days:
            days[date] = {
                "day": date,
                "temp": item["main"]["temp"],
                "condition": item["weather"][0]["description"]
            }

    return JsonResponse({
        "forecast": list(days.values())[:5]
    })

def air_quality_api(request):
    city = request.GET.get("city", "Delhi")

    weather_url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}"
    weather_data = requests.get(weather_url).json()

    lat = weather_data["coord"]["lat"]
    lon = weather_data["coord"]["lon"]

    aqi_url = (
        f"https://api.openweathermap.org/data/2.5/air_pollution"
        f"?lat={lat}&lon={lon}&appid={API_KEY}"
    )

    aqi_data = requests.get(aqi_url).json()

    item = aqi_data["list"][0]

    pm25 = item["components"]["pm2_5"]
    aqi = pm25_to_aqi(pm25)

    return JsonResponse({
        "aqi": aqi,
        "pm25": pm25,
        "o3": item["components"]["o3"],
        "no2": item["components"]["no2"]
    })