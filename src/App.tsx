import React, { useState, useEffect } from 'react';
import { Search, Wind, Droplets, Thermometer, MapPin } from 'lucide-react';
import WeatherIcon from './components/WeatherIcon';

interface WeatherData {
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
  };
  weather: Array<{
    main: string;
    description: string;
  }>;
  wind: {
    speed: number;
  };
  name: string;
}

function App() {
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [background, setBackground] = useState('from-blue-400 to-purple-500');

  const API_KEY = '5be57cc41337a5e46b221f388d6eabda';

  const getWeatherBackground = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return 'from-yellow-400 to-orange-500';
      case 'clouds':
        return 'from-gray-400 to-gray-600';
      case 'rain':
        return 'from-blue-600 to-gray-700';
      case 'thunderstorm':
        return 'from-gray-800 to-purple-900';
      case 'snow':
        return 'from-blue-100 to-blue-300';
      case 'mist':
      case 'haze':
        return 'from-gray-300 to-gray-500';
      default:
        return 'from-blue-400 to-purple-500';
    }
  };

  useEffect(() => {
    if (weather) {
      const newBackground = getWeatherBackground(weather.weather[0].main);
      setBackground(newBackground);
    }
  }, [weather]);

  const getWeather = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) {
      setError('Please enter a city name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${API_KEY}`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'City not found');
      }

      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Convert Kelvin to Celsius
  const kelvinToCelsius = (kelvin: number) => {
    return Math.round(kelvin - 273.15);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${background} p-6 transition-all duration-1000`}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-4">Weather Forecast</h1>
          <p className="text-white/80">Enter a location to get the current weather conditions</p>
        </div>

        <form onSubmit={getWeather} className="mb-8">
          <div className="relative max-w-xl mx-auto">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter city name..."
              className="w-full px-6 py-4 rounded-full bg-white/20 backdrop-blur-md text-white placeholder-white/60 outline-none border-2 border-white/30 focus:border-white/50 transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/40 p-3 rounded-full transition-all"
              disabled={loading}
            >
              <Search className="w-5 h-5 text-white" />
            </button>
          </div>
        </form>

        {loading && (
          <div className="text-center text-white">
            <p>Fetching weather data...</p>
          </div>
        )}

        {error && (
          <div className="text-center text-red-200 bg-red-500/20 p-4 rounded-lg">
            {error}
          </div>
        )}

        {weather && (
          <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 text-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <MapPin className="w-6 h-6" />
                  <h2 className="text-2xl font-semibold">{weather.name}</h2>
                </div>
                <div className="flex items-center space-x-4">
                  <WeatherIcon 
                    condition={weather.weather[0].main} 
                    className="w-20 h-20"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <Thermometer className="w-6 h-6" />
                  <div>
                    <p className="text-4xl font-bold">{kelvinToCelsius(weather.main.temp)}°C</p>
                    <p className="text-sm text-white/70">Feels like {kelvinToCelsius(weather.main.feels_like)}°C</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <p className="text-xl">{weather.weather[0].main} - {weather.weather[0].description}</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Droplets className="w-6 h-6" />
                  <div>
                    <p className="text-sm text-white/70">Humidity</p>
                    <p className="text-xl font-semibold">{weather.main.humidity}%</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Wind className="w-6 h-6" />
                  <div>
                    <p className="text-sm text-white/70">Wind Speed</p>
                    <p className="text-xl font-semibold">{weather.wind.speed} m/s</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;