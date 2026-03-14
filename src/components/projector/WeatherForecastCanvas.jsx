/**
 * WeatherForecastCanvas Component
 * Displays today's weather forecast for projector right canvas
 */

import React from 'react';
import {
  Sun,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  Cloudy,
  CloudRain,
  CloudDrizzle,
  CloudLightning,
  CloudSnow,
  CloudFog,
  CloudOff,
  Thermometer,
  Droplets,
  Wind,
} from 'lucide-react';

/**
 * Get weather icon based on icon code
 */
const getWeatherIcon = (iconCode) => {
  if (!iconCode) return Cloud;

  const iconMap = {
    '01d': Sun,
    '01n': Moon,
    '02d': CloudSun,
    '02n': CloudMoon,
    '03d': Cloud,
    '03n': Cloud,
    '04d': Cloudy,
    '04n': Cloudy,
    '09d': CloudRain,
    '09n': CloudRain,
    '10d': CloudDrizzle,
    '10n': CloudDrizzle,
    '11d': CloudLightning,
    '11n': CloudLightning,
    '13d': CloudSnow,
    '13n': CloudSnow,
    '50d': CloudFog,
    '50n': CloudFog,
  };

  return iconMap[iconCode] || Cloud;
};

/**
 * WeatherForecastCanvas Component
 * Shows current weather + high/low + conditions
 *
 * @param {Object} props
 * @param {Object} props.weatherData - Weather data object
 */
export const WeatherForecastCanvas = ({
  weatherData,
  className = '',
}) => {
  if (!weatherData) {
    return (
      <div
        className={`
          h-full bg-black
          flex flex-col items-center justify-center
          ${className}
        `}
      >
        <CloudOff className="w-24 h-24 text-gray-700 mb-6" strokeWidth={1} />
        <p className="text-2xl text-gray-600 font-light">No weather data</p>
      </div>
    );
  }

  const {
    temp,
    condition,
    icon,
    high,
    low,
    humidity,
    windSpeed,
    feelsLike,
  } = weatherData;

  const WeatherIcon = getWeatherIcon(icon);

  return (
    <div
      className={`
        h-full bg-black text-white
        flex flex-col items-center justify-center
        p-6
        ${className}
      `}
    >
      {/* Main weather icon */}
      <WeatherIcon className="w-32 h-32 text-white mb-4" strokeWidth={1} />

      {/* Current temperature */}
      <div className="text-8xl font-bold tabular-nums mb-2">
        {Math.round(temp)}°
      </div>

      {/* Condition */}
      <div className="text-2xl text-gray-300 capitalize mb-8">
        {condition}
      </div>

      {/* High/Low */}
      {(high !== undefined || low !== undefined) && (
        <div className="flex items-center gap-6 text-xl mb-6">
          {high !== undefined && (
            <div className="flex items-center gap-2 text-orange-400">
              <span className="text-gray-500">H:</span>
              <span className="font-semibold">{Math.round(high)}°</span>
            </div>
          )}
          {low !== undefined && (
            <div className="flex items-center gap-2 text-blue-400">
              <span className="text-gray-500">L:</span>
              <span className="font-semibold">{Math.round(low)}°</span>
            </div>
          )}
        </div>
      )}

      {/* Additional details */}
      <div className="flex flex-col gap-4 text-lg text-gray-400 mt-4">
        {/* Feels like */}
        {feelsLike !== undefined && (
          <div className="flex items-center gap-3">
            <Thermometer className="w-6 h-6" strokeWidth={1.5} />
            <span>Feels like {Math.round(feelsLike)}°</span>
          </div>
        )}

        {/* Humidity */}
        {humidity !== undefined && (
          <div className="flex items-center gap-3">
            <Droplets className="w-6 h-6" strokeWidth={1.5} />
            <span>{humidity}% humidity</span>
          </div>
        )}

        {/* Wind */}
        {windSpeed !== undefined && (
          <div className="flex items-center gap-3">
            <Wind className="w-6 h-6" strokeWidth={1.5} />
            <span>{Math.round(windSpeed)} mph</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherForecastCanvas;
