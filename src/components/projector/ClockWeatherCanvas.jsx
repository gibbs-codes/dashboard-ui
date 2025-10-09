/**
 * ClockWeatherCanvas Component
 * Displays large clock, date, and weather for projector center column
 */

import React from 'react';
import { Clock, DateDisplay } from '../shared/index.js';
import { CloudOff } from 'lucide-react';

/**
 * Get weather icon from lucide-react based on icon code
 * (Simplified version for compact display)
 */
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
} from 'lucide-react';

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
 * CompactWeather Component
 * Simplified weather display for projector
 */
const CompactWeather = ({ weatherData }) => {
  if (!weatherData) {
    return (
      <div className="flex items-center justify-center gap-4 text-gray-600">
        <CloudOff className="w-12 h-12" strokeWidth={1.5} />
        <span className="text-2xl">No weather data</span>
      </div>
    );
  }

  const { temp, condition, icon } = weatherData;
  const WeatherIcon = getWeatherIcon(icon);

  return (
    <div className="flex items-center justify-center gap-6">
      {/* Weather Icon */}
      <WeatherIcon className="w-20 h-20 text-white" strokeWidth={1.5} />

      {/* Temperature and Condition */}
      <div className="flex flex-col items-start">
        <div className="text-6xl font-bold text-white tabular-nums">
          {Math.round(temp)}°
        </div>
        <div className="text-2xl text-gray-300 capitalize mt-2">
          {condition}
        </div>
      </div>
    </div>
  );
};

/**
 * ClockWeatherCanvas Component
 * Center column display with clock, date, and weather
 *
 * @param {Object} props
 * @param {Object} props.weatherData - Weather data object
 * @param {number} props.weatherData.temp - Temperature
 * @param {string} props.weatherData.condition - Weather condition
 * @param {string} props.weatherData.icon - Weather icon code
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element}
 */
export const ClockWeatherCanvas = ({
  weatherData,
  className = ''
}) => {
  return (
    <div
      className={`
        h-full
        bg-black
        text-white
        flex flex-col
        items-center
        justify-center
        p-8
        ${className}
      `}
      role="region"
      aria-label="Clock and weather display"
    >
      {/* Top 60%: Clock and Date */}
      <div className="flex-[0.6] flex flex-col items-center justify-center gap-8">
        {/* Large Clock */}
        <div className="text-center">
          <div className="text-9xl font-bold text-white tabular-nums tracking-tight">
            <Clock
              format="12h"
              showSeconds={false}
              className="inline-block"
            />
          </div>
        </div>

        {/* Date Display */}
        <div className="text-center">
          <DateDisplay
            format="full"
            className="text-3xl text-gray-300 font-medium"
          />
        </div>
      </div>

      {/* Bottom 40%: Weather */}
      <div className="flex-[0.4] flex items-center justify-center border-t border-gray-800 pt-8 w-full">
        <CompactWeather weatherData={weatherData} />
      </div>
    </div>
  );
};

export default ClockWeatherCanvas;
