// Micro-interactions and atmospheric subtle effects
document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) * 15;
    const y = (e.clientY / window.innerHeight) * 15;
    const heroBg = document.getElementById('heroGradient');
    if (heroBg) {
        heroBg.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
    }
});

// Forecast Toggle Logic
const hourlyBtn = document.getElementById('hourlyToggleBtn');
const dailyBtn = document.getElementById('dailyToggleBtn');
const hourlyContainer = document.getElementById('hourlyForecast');
const dailyContainer = document.getElementById('dailyForecast');
const forecastHeading = document.getElementById('forecastHeading');

function switchToDaily() {
    // Update containers
    hourlyContainer.classList.add('hidden');
    dailyContainer.classList.remove('hidden');
    forecastHeading.innerText = '12-Day Forecast';

    // Update buttons
    dailyBtn.classList.add('bg-primary', 'text-on-primary', 'active-pill');
    dailyBtn.classList.remove('text-on-surface-variant');

    hourlyBtn.classList.remove('bg-primary', 'text-on-primary', 'active-pill');
    hourlyBtn.classList.add('text-on-surface-variant');
}

function switchToHourly() {
    // Update containers
    dailyContainer.classList.add('hidden');
    hourlyContainer.classList.remove('hidden');
    forecastHeading.innerText = 'Hourly Forecast';

    // Update buttons
    hourlyBtn.classList.add('bg-primary', 'text-on-primary', 'active-pill');
    hourlyBtn.classList.remove('text-on-surface-variant');

    dailyBtn.classList.remove('bg-primary', 'text-on-primary', 'active-pill');
    dailyBtn.classList.add('text-on-surface-variant');
}

if (dailyBtn) dailyBtn.addEventListener('click', switchToDaily);
if (hourlyBtn) hourlyBtn.addEventListener('click', switchToHourly);

// Add scroll animation for bento cards
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-6');
        }
    });
}, observerOptions);

document.querySelectorAll('.glass').forEach(card => {
    // We only apply entry animations to visible ones initially, 
    // the daily forecast cards will animate when revealed if we trigger them
    if (!card.closest('.hidden')) {
        card.classList.add('transition-all', 'duration-700', 'opacity-0', 'translate-y-6');
        observer.observe(card);
    }
});

const sidebar = document.getElementById('settingsSidebar');
const overlay = document.getElementById('settingsSidebarOverlay');
const closeBtn = document.getElementById('closeSettings');
const saveBtn = document.getElementById('saveSettings');

function openSidebar() {
    if (!sidebar || !overlay) return;

    sidebar.classList.remove('translate-x-full');
    overlay.classList.remove('opacity-0', 'pointer-events-none');
    overlay.classList.add('opacity-100', 'pointer-events-auto');
    document.body.style.overflow = 'hidden';
}

function closeSidebar() {
    if (!sidebar || !overlay) return;

    sidebar.classList.add('translate-x-full');
    overlay.classList.remove('opacity-100', 'pointer-events-auto');
    overlay.classList.add('opacity-0', 'pointer-events-none');
    document.body.style.overflow = '';
}

// close events
if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
if (overlay) overlay.addEventListener('click', closeSidebar);

// save button animation
if (saveBtn) {
    saveBtn.addEventListener('click', () => {
        saveBtn.innerHTML = 'Saving...';

        setTimeout(() => {
            saveBtn.innerText = 'SAVED!';

            setTimeout(() => {
                saveBtn.innerText = 'SAVE CHANGES';
                closeSidebar();
            }, 1000);

        }, 800);
    });
}

// Unit system switcher
const unitBtns = document.querySelectorAll('[data-unit]');
unitBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        unitBtns.forEach(b => {
            b.classList.remove('bg-primary', 'text-on-primary', 'active-pill');
            b.classList.add('text-on-surface-variant');
        });
        btn.classList.add('bg-primary', 'text-on-primary', 'active-pill');
        btn.classList.remove('text-on-surface-variant');
    });
});
document.addEventListener("DOMContentLoaded", function () {

    fetch('/api/weather/?city=Delhi')
        .then(res => res.json())
        .then(data => {
            document.getElementById('city').innerText = data.city;
            document.getElementById('temp').innerText = data.temp + "°C";
            document.getElementById('condition').innerText = data.condition;
            document.querySelectorAll(".humidity").forEach(el => {
                el.innerText = data.humidity + "%";
            });
            document.querySelectorAll(".wind").forEach(el => {
                el.innerText = data.wind + " m/s";
            });
            document.querySelectorAll('.visibility').forEach(el => {
                el.innerText = (data.visibility / 1000).toFixed(1) + " km";
            });

            const sunrise = new Date(data.sunrise * 1000);
            const sunset = new Date(data.sunset * 1000);

            document.getElementById('sunrise').innerText =
                sunrise.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                });

            document.getElementById('sunset').innerText =
                sunset.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                });

            const sunDot = document.getElementById("sunDot");

            if (!sunDot) return;

            // current time in HOURS (0–24)
            const now = new Date();
            const hours = now.getHours() + now.getMinutes() / 60;

            // 🌅 SUN ACTIVE TIME: 6 AM → 12 AM (midnight)
            const SUN_START = 6;
            const SUN_END = 24;

            // 🌙 NIGHT (12 AM → 6 AM)
            if (hours < SUN_START) {

                // NIGHT MODE
                sunDot.style.left = "0%";
                sunDot.style.backgroundColor = "#64B5F6";
                sunDot.style.boxShadow = "0 0 15px rgba(100,181,246,0.8)";
                return;
            }

            // 🌞 NORMALIZE DAY PROGRESS (6 → 24)
            let raw = (hours - SUN_START) / (SUN_END - SUN_START);

            // clamp
            raw = Math.min(Math.max(raw, 0), 1);

            // smooth movement
            const smooth = 0.5 - Math.cos(raw * Math.PI) / 2;

            // position (10% → 90%)
            const progress = 10 + smooth * 80;
            sunDot.style.left = `${progress}%`;


            // 🌞 COLOR SYSTEM
            if (hours >= 6 && hours < 11) {

                // MORNING 🌅
                sunDot.style.backgroundColor = "#e5cd63";
                sunDot.style.boxShadow = "0 0 18px rgba(234, 223, 184, 0.9)";

            } else if (hours >= 11 && hours < 16) {

                // AFTERNOON ☀️
                sunDot.style.backgroundColor = "#eade77";
                sunDot.style.boxShadow = "0 0 25px rgb(206, 192, 62)";

            } else if (hours >= 16 && hours < 20) {

                // EVENING 🌇
                sunDot.style.backgroundColor = "#FF8A65";
                sunDot.style.boxShadow = "0 0 20px rgba(255,138,101,0.9)";

            } else {

                // NIGHT START (20 → 24)
                sunDot.style.backgroundColor = "#90CAF9";
                sunDot.style.boxShadow = "0 0 12px rgba(144,202,249,0.7)";
            }

            document.getElementById('pressure').innerText = data.pressure + " hPa";
            document.getElementById('feels_like').innerText = data.feels_like + "°C";

            
        });

});

fetch('/api/forecast/?city=Delhi')
    .then(res => res.json())
    .then(data => {

        const container = document.getElementById('hourlyForecast');

        container.innerHTML = '';

        data.forecast.forEach(item => {

            container.innerHTML += `
                <div class="glass min-w-[85px] flex flex-col items-center py-md rounded-xl border-t border-l border-white/10">
                    <span class="font-label-caps text-label-caps text-on-surface-variant mb-sm">
                        ${item.time}
                    </span>

                    <span class="material-symbols-outlined text-secondary text-2xl mb-sm">
                        partly_cloudy_day
                    </span>

                    <span class="font-data-mono text-data-mono text-white text-md">
                        ${Math.round(item.temp)}°
                    </span>
                </div>
            `;
        });

    });

    fetch('/api/daily-forecast/?city=Delhi')
    .then(res => res.json())
    .then(data => {

        const container =
            document.getElementById('dailyForecast');

        container.innerHTML = '';

        data.forecast.forEach(day => {

            container.innerHTML += `
                <div class="glass flex flex-col p-md rounded-2xl border-t border-l border-white/10">

                    <span class="font-label-caps text-label-caps text-primary mb-sm">
                        ${day.day}
                    </span>

                    <div class="flex items-center justify-between mb-md">

                        <span class="material-symbols-outlined text-secondary text-3xl">
                            partly_cloudy_day
                        </span>

                        <div class="text-right">
                            <p class="font-data-mono text-white text-lg">
                                ${Math.round(day.temp)}°
                            </p>
                        </div>

                    </div>

                    <p class="font-body-sm text-[11px] text-on-surface-variant">
                        ${day.condition}
                    </p>

                </div>
            `;
        });

    });

    fetch('/api/air-quality/?city=Delhi')
    .then(res => res.json())
    .then(data => {

        function getAQILabel(aqi) {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 150) return "Unhealthy for Sensitive Groups";
    if (aqi <= 200) return "Unhealthy";
    if (aqi <= 300) return "Very Unhealthy";
    return "Hazardous";
}
        function getAQIDescription(aqi) {

    if (aqi <= 50)
        return "Air quality is ideal for most individuals.";

    if (aqi <= 100)
        return "Air quality is acceptable.";

    if (aqi <= 150)
        return "Sensitive groups may experience effects.";

    if (aqi <= 200)
        return "Some people may experience health effects.";

    if (aqi <= 300)
        return "Health alert: everyone may experience effects.";

    return "Health warning of emergency conditions.";
}

        document.getElementById('aqiText').innerText =
            `${data.aqi} - ${getAQILabel(data.aqi)}`;

        document.getElementById('pm25').innerText =
            data.pm25.toFixed(1) + " μg/m³";

        document.getElementById('o3').innerText =
            data.o3.toFixed(1);

        document.getElementById('no2').innerText =
            data.no2.toFixed(1);

        document.getElementById('aqiBar').style.width =
    Math.min((data.aqi / 500) * 100, 100) + "%";

        document.getElementById('aqiDescription').innerText =
    getAQIDescription(data.aqi);

    
    });