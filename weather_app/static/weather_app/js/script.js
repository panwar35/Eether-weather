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
            document.getElementById('humidity').innerText = data.humidity + "%";
            document.getElementById('wind').innerText = data.wind + " m/s";
            document.getElementById('visibility').innerText = data.visibility + " km";
            document.getElementById('pressure').innerText = data.pressure + " hPa";
            document.getElementById('feels_like').innerText = data.feels_like + "°C";
        });

});