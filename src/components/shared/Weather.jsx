/**
 * Weather Component
 * Displays current weather information with icons and conditions
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
  Wind
} from 'lucide-react';

/**
 * Map OpenWeatherMap icon codes to Lucide React icons
 * @param {string} iconCode - Weather icon code (e.g., '01d', '10n')
 * @returns {React.Component} Lucide React icon component
 */
const getWeatherIcon = (iconCode) => {
  if (!iconCode) return Cloud;

  const iconMap = {
    // Clear sky
    '01d': Sun,
    '01n': Moon,
    // Few clouds
    '02d': CloudSun,
    '02n': CloudMoon,
    // Scattered clouds
    '03d': Cloud,
    '03n': Cloud,
    // Broken clouds
    '04d': Cloudy,
    '04n': Cloudy,
    // Shower rain
    '09d': CloudRain,
    '09n': CloudRain,
    // Rain
    '10d': CloudDrizzle,
    '10n': CloudDrizzle,
    // Thunderstorm
    '11d': CloudLightning,
    '11n': CloudLightning,
    // Snow
    '13d': CloudSnow,
    '13n': CloudSnow,
    // Mist/Fog
    '50d': CloudFog,
    '50n': CloudFog,
  };

  return iconMap[iconCode] || Cloud;
};

/**
 * Get gradient background based on weather condition
 * @param {string} iconCode - Weather icon code
 * @returns {string} Tailwind gradient classes
 */
const getWeatherGradient = (iconCode) => {
  if (!iconCode) return 'from-gray-700 to-gray-800';

  // Day/night detection
  const isDay = iconCode?.endsWith('d');

  // Clear sky
  if (iconCode.startsWith('01')) {
    return isDay
      ? 'from-blue-500 to-cyan-400'
      : 'from-indigo-900 to-purple-900';
  }

  // Few clouds
  if (iconCode.startsWith('02')) {
    return isDay
      ? 'from-blue-400 to-sky-300'
      : 'from-indigo-800 to-blue-900';
  }

  // Clouds
  if (iconCode.startsWith('03') || iconCode.startsWith('04')) {
    return 'from-gray-500 to-gray-600';
  }

  // Rain
  if (iconCode.startsWith('09') || iconCode.startsWith('10')) {
    return 'from-slate-600 to-blue-700';
  }

  // Thunderstorm
  if (iconCode.startsWith('11')) {
    return 'from-slate-700 to-slate-900';
  }

  // Snow
  if (iconCode.startsWith('13')) {
    return 'from-blue-200 to-cyan-100';
  }

  // Mist/Fog
  if (iconCode.startsWith('50')) {
    return 'from-gray-400 to-gray-500';
  }

  return 'from-gray-700 to-gray-800';
};

/**
 * Weather Component
 * Displays current weather with temperature, condition, and icon
 *
 * @param {Object} props
 * @param {Object} props.data - Weather data object
 * @param {number} props.data.temp - Current temperature
 * @param {string} props.data.condition - Weather condition (e.g., "Cloudy")
 * @param {number} props.data.feelsLike - Feels like temperature
 * @param {number} props.data.humidity - Humidity percentage
 * @param {number} props.data.high - High temperature
 * @param {number} props.data.low - Low temperature
 * @param {string} props.data.icon - OpenWeatherMap icon code
 * @param {string} props.data.description - Weather description
 * @param {boolean} props.compact - Compact mode (just temp + icon)
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element}
 */
export const Weather = ({
  data,
  compact = false,
  className = ''
}) => {
  if (!data) {
    return (
      <div className={`text-gray-400 ${className}`}>
        No weather data available
      </div>
    );
  }

  const {
    temp,
    condition,
    feelsLike,
    humidity,
    high,
    low,
    icon,
    description
  } = data;

  const WeatherIcon = getWeatherIcon(icon);
  const gradientClasses = getWeatherGradient(icon);

  // Compact mode: just temp + icon
  if (compact) {
    return (
      <div
        className={`
          flex items-center gap-3
          bg-gradient-to-r ${gradientClasses}
          rounded-lg px-4 py-3
          ${className}
        `}
        role="region"
        aria-label="Current weather"
      >
        <WeatherIcon className="w-10 h-10 text-white" strokeWidth={2} />
        <div className="text-3xl font-bold text-white">
          {Math.round(temp)}°
        </div>
      </div>
    );
  }

  // Full mode: detailed weather card
  return (
    <div
      className={`
        bg-gradient-to-br ${gradientClasses}
        rounded-2xl p-6
        shadow-xl
        text-white
        ${className}
      `}
      role="region"
      aria-label="Current weather information"
    >
      {/* Main weather display */}
      <div className="flex items-center justify-between mb-6">
        {/* Temperature */}
        <div className="flex flex-col">
          <div className="text-6xl md:text-7xl font-bold tabular-nums">
            {Math.round(temp)}°
          </div>
          {feelsLike && (
            <div className="text-sm text-white/80 mt-1">
              Feels like {Math.round(feelsLike)}°
            </div>
          )}
        </div>

        {/* Icon */}
        <div>
          <WeatherIcon className="w-20 h-20 md:w-24 md:h-24" strokeWidth={1.5} />
        </div>
      </div>

      {/* Condition */}
      <div className="mb-4">
        <div className="text-2xl font-semibold capitalize">
          {condition || description}
        </div>
        {description && condition && condition !== description && (
          <div className="text-sm text-white/80 capitalize mt-1">
            {description}
          </div>
        )}
      </div>

      {/* High/Low and additional info */}
      <div className="flex items-center justify-between pt-4 border-t border-white/20">
        {/* High/Low */}
        {(high !== undefined || low !== undefined) && (
          <div className="flex items-center gap-4">
            {high !== undefined && (
              <div className="flex flex-col">
                <span className="text-xs text-white/70">High</span>
                <span className="text-lg font-semibold">{Math.round(high)}°</span>
              </div>
            )}
            {low !== undefined && (
              <div className="flex flex-col">
                <span className="text-xs text-white/70">Low</span>
                <span className="text-lg font-semibold">{Math.round(low)}°</span>
              </div>
            )}
          </div>
        )}

        {/* Humidity */}
        {humidity !== undefined && (
          <div className="flex flex-col items-end">
            <span className="text-xs text-white/70">Humidity</span>
            <span className="text-lg font-semibold">{humidity}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * WeatherCard Component
 * Alternative card-style layout
 */
export const WeatherCard = ({
  data,
  className = ''
}) => {
  if (!data) return null;

  const { temp, condition, icon } = data;
  const WeatherIcon = getWeatherIcon(icon);
  const gradientClasses = getWeatherGradient(icon);

  return (
    <div
      className={`
        bg-gradient-to-br ${gradientClasses}
        rounded-xl p-6
        shadow-lg
        text-white
        flex flex-col items-center justify-center
        min-h-[200px]
        ${className}
      `}
    >
      <WeatherIcon className="w-16 h-16 mb-4" strokeWidth={1.5} />
      <div className="text-5xl font-bold mb-2">
        {Math.round(temp)}°
      </div>
      <div className="text-lg capitalize opacity-90">
        {condition}
      </div>
    </div>
  );
};

export default Weather;
