class WeatherApp {
    constructor() {
        this.API_KEY = '5be57cc41337a5e46b221f388d6eabda';
        this.form = document.getElementById('weatherForm');
        this.locationInput = document.getElementById('locationInput');
        this.loadingElement = document.getElementById('loading');
        this.errorElement = document.getElementById('error');
        this.weatherResult = document.getElementById('weatherResult');
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.getWeather();
        });
    }

    showLoading() {
        this.loadingElement.classList.remove('hidden');
        this.errorElement.classList.add('hidden');
        this.weatherResult.classList.add('hidden');
    }

    showError(message) {
        this.loadingElement.classList.add('hidden');
        this.errorElement.classList.remove('hidden');
        this.errorElement.textContent = message;
        this.weatherResult.classList.add('hidden');
    }

    showWeather() {
        this.loadingElement.classList.add('hidden');
        this.errorElement.classList.add('hidden');
        this.weatherResult.classList.remove('hidden');
    }

    setBackground(condition) {
        const backgrounds = {
            Clear: 'linear-gradient(135deg, #ffd700 0%, #ff8c00 100%)',
            Clouds: 'linear-gradient(135deg, #636363 0%, #a2a2a2 100%)',
            Rain: 'linear-gradient(135deg, #005c97 0%, #363795 100%)',
            Thunderstorm: 'linear-gradient(135deg, #200122 0%, #6f0000 100%)',
            Snow: 'linear-gradient(135deg, #e6dada 0%, #274046 100%)',
            Mist: 'linear-gradient(135deg, #606c88 0%, #3f4c6b 100%)',
            Haze: 'linear-gradient(135deg, #606c88 0%, #3f4c6b 100%)',
            default: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
        };

        document.body.style.background = backgrounds[condition] || backgrounds.default;
    }

    getWeatherIcon(condition) {
        const icons = {
            Clear: `
                <svg viewBox="0 0 100 100" class="weather-icon">
                    <circle class="sun" cx="50" cy="50" r="20" fill="yellow">
                        <animate attributeName="opacity" values="0.8;1;0.8" dur="3s" repeatCount="indefinite" />
                    </circle>
                    ${Array.from({ length: 8 }).map((_, i) => {
                        const angle = i * 45;
                        return `
                            <line
                                x1="50" y1="50" x2="50" y2="25"
                                stroke="yellow" stroke-width="3"
                                transform="rotate(${angle} 50 50)">
                                <animate attributeName="y2" values="25;20;25" dur="2s" repeatCount="indefinite" />
                            </line>
                        `;
                    }).join('')}
                </svg>
            `,
            Clouds: `
                <svg viewBox="0 0 100 100" class="weather-icon">
                    <path class="cloud" fill="white" d="M25,60 Q30,50 40,55 Q45,45 55,50 Q65,45 70,55 Q80,50 75,60 Q85,65 75,70 Q65,75 55,70 Q45,75 35,70 Q25,75 25,60">
                        <animate attributeName="d" 
                            values="M25,60 Q30,50 40,55 Q45,45 55,50 Q65,45 70,55 Q80,50 75,60 Q85,65 75,70 Q65,75 55,70 Q45,75 35,70 Q25,75 25,60;
                                   M25,62 Q30,52 40,57 Q45,47 55,52 Q65,47 70,57 Q80,52 75,62 Q85,67 75,72 Q65,77 55,72 Q45,77 35,72 Q25,77 25,62;
                                   M25,60 Q30,50 40,55 Q45,45 55,50 Q65,45 70,55 Q80,50 75,60 Q85,65 75,70 Q65,75 55,70 Q45,75 35,70 Q25,75 25,60"
                            dur="4s" repeatCount="indefinite" />
                    </path>
                </svg>
            `,
            Rain: `
                <svg viewBox="0 0 100 100" class="weather-icon">
                    <path class="cloud" fill="#919191" d="M25,40 Q30,30 40,35 Q45,25 55,30 Q65,25 70,35 Q80,30 75,40 Q85,45 75,50 Q65,55 55,50 Q45,55 35,50 Q25,55 25,40" />
                    ${Array.from({ length: 5 }).map((_, i) => `
                        <line class="rain-drop"
                            x1="${30 + i * 10}" y1="60"
                            x2="${30 + i * 10}" y2="65"
                            stroke="#4F95FF" stroke-width="2"
                            style="animation-delay: ${i * 0.2}s">
                        </line>
                    `).join('')}
                </svg>
            `,
            Thunderstorm: `
                <svg viewBox="0 0 100 100" class="weather-icon">
                    <path class="cloud" fill="#424242" d="M25,40 Q30,30 40,35 Q45,25 55,30 Q65,25 70,35 Q80,30 75,40 Q85,45 75,50 Q65,55 55,50 Q45,55 35,50 Q25,55 25,40" />
                    <path class="lightning" d="M55,50 L45,70 L55,70 L45,90" stroke="#FFD700" stroke-width="3" fill="none" />
                </svg>
            `,
            default: `
                <svg viewBox="0 0 100 100" class="weather-icon">
                    <circle cx="50" cy="50" r="20" fill="white" />
                </svg>
            `
        };

        return icons[condition] || icons.default;
    }

    kelvinToCelsius(kelvin) {
        return Math.round(kelvin - 273.15);
    }

    async getWeather() {
        const location = this.locationInput.value.trim();
        
        if (!location) {
            this.showError('Please enter a city name');
            return;
        }

        this.showLoading();

        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${this.API_KEY}`
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'City not found');
            }

            const data = await response.json();
            this.updateWeatherUI(data);
        } catch (err) {
            this.showError(err.message || 'Failed to fetch weather data. Please try again.');
        }
    }

    updateWeatherUI(data) {
        document.getElementById('cityName').textContent = data.name;
        document.getElementById('temperature').textContent = `${this.kelvinToCelsius(data.main.temp)}°C`;
        document.getElementById('feelsLike').textContent = `Feels like ${this.kelvinToCelsius(data.main.feels_like)}°C`;
        document.getElementById('humidity').textContent = `${data.main.humidity}%`;
        document.getElementById('windSpeed').textContent = `${data.wind.speed} m/s`;
        document.getElementById('weatherDescription').textContent = 
            `${data.weather[0].main} - ${data.weather[0].description}`;
        
        document.getElementById('weatherIcon').innerHTML = 
            this.getWeatherIcon(data.weather[0].main);
        
        this.setBackground(data.weather[0].main);
        this.showWeather();
    }
}

// Initialize the app
const weatherApp = new WeatherApp();