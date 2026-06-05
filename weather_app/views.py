from django.shortcuts import render

def home(request):
    return render(request, 'weather_app/home.html')
def location(request):
    return render(request, 'weather_app/location.html')