'use client'
import React, { useState } from 'react';
import { Search } from 'lucide-react';

const WeatherApp = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchCity = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setError('');
    try {
      // Use the WeatherAPI.com API with your key
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${encodeURIComponent(searchTerm)}`
      );
      
      if (!response.ok) {
        throw new Error('City not found or API error');
      }
      
      const data: City = await response.json();
      
      // Check if the city already exists in the list
      if (!cities.some(city => 
        city.location.name.toLowerCase() === data.location.name.toLowerCase()
      )) {
        setCities([data, ...cities]);
      }
      
      setSearchTerm('');
    } catch (err) {
      setError('Error finding the city. Please try again.');
    } finally {
      setLoading(false);
    }
  };

interface Location {
  name: string;
  country: string;
  region?: string;
}

interface Condition {
  text: string;
  icon: string;
  code: number;
}

interface CurrentWeather {
  temp_c: number;
  condition: Condition;
  humidity: number;
  wind_kph: number;
  feelslike_c?: number;
  uv?: number;
}

interface City {
  location: Location;
  current: CurrentWeather;
}
  
  // Función para eliminar una ciudad
  const removeCity = (cityName: any) => {
    setCities(cities.filter(city => city.location.name !== cityName));
  };
  
  
  function getWeatherIcon(condition: string) {
    // Asociamos condiciones climáticas con iconos
    const icons: { [key: string]: string } = {
      'Soleado': '☀️',
      'Parcialmente nublado': '⛅',
      'Nublado': '☁️',
      'Lluvia ligera': '🌦️',
      'Lluvia fuerte': '🌧️',
      'Tormenta': '⛈️',
      'Nieve': '❄️',
      'Niebla': '🌫️'
    };
    return icons[condition] || '🌡️';
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white-200 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-black-800 mb-8">Buscador de Clima Mundial</h1>
        
        {/* Buscador */}
        <form onSubmit={searchCity} className="mb-8">
          <div className="relative flex items-center max-w-md mx-auto">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar ciudad..."
              className="w-full p-3 pl-4 pr-12 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              type="submit"
              className="absolute right-2 p-2 text-blue-500 hover:text-blue-700"
              disabled={loading}
            >
              <Search size={20} />
            </button>
          </div>
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        </form>
        
        {/* Indicador de carga */}
        {loading && (
          <div className="text-center mb-6">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        )}
        
        {/* Tarjetas de ciudades */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cities.map((city, index) => (
  <div 
    key={`${city.location.name}-${index}`}
    className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105"
  >
    <div className="p-5">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-gray-800">{city.location.name}</h2>
          <p className="text-gray-600">{city.location.country}</p>
        </div>
        <button 
          onClick={() => removeCity(city.location.name)}
          className="text-gray-400 hover:text-red-500"
        >
          ✕
        </button>
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center">
          <img 
            src={city.current.condition.icon.startsWith('http') 
              ? city.current.condition.icon 
              : `https:${city.current.condition.icon}`} 
            alt={city.current.condition.text}
            className="w-16 h-16 mr-2"
          />
          <div>
            <p className="text-3xl font-bold">{city.current.temp_c}°C</p>
            <p className="text-gray-600">{city.current.condition.text}</p>
          </div>
        </div>
        <div>
          <p className="text-gray-600">Humidity: {city.current.humidity}%</p>
          <p className="text-gray-600">Wind: {city.current.wind_kph} km/h</p>
        </div>
      </div>
    </div>
  </div>
))}
        </div>
        
        {cities.length === 0 && (
          <div className="text-center p-8 bg-white bg-opacity-50 rounded-lg">
            <p className="text-gray-600">Busca una ciudad para ver su clima actual</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherApp;