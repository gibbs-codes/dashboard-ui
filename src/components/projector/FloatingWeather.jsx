/**
 * FloatingWeather Component
 * Compact weather display positioned below right canvas
 */

import React from 'react';
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudDrizzle,
  CloudFog,
  Wind,
  Cloudy,
} from 'lucide-react';

/**
 * Get weather icon component based on condition
 * @param {string} condition - Weather condition string
 * @returns {React.Component} Icon component
 */
const getWeatherIcon = (condition) => {
  if (!condition) return Sun;

  const lowerCondition = condition.toLowerCase();

  if (lowerCondition.includes('rain')) return CloudRain;
  if (lowerCondition.includes('snow')) return CloudSnow;
  if (lowerCondition.includes('drizzle')) return CloudDrizzle;
  if (lowerCondition.includes('fog') || lowerCondition.includes('mist')) return CloudFog;
  if (lowerCondition.includes('wind')) return Wind;
  if (lowerCondition.includes('cloud') || lowerCondition.includes('overcast')) return Cloudy;
  if (lowerCondition.includes('clear') || lowerCondition.includes('sunny')) return Sun;

  return Cloud;
};

/**
 * FloatingWeather Component
 * Displays current weather below the right canvas
 *
 * @param {Object} props
 * @param {Object} props.weatherData - Weather data { temp, condition, icon }
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element}
 */
export const FloatingWeather = ({ weatherData, className = '' }) => {
  if (!weatherData) {
    return null;
  }

  const { temp, condition } = weatherData;
  const IconComponent = getWeatherIcon(condition);

  return (
    <div
      className={`
        fixed
        flex
        items-center
        gap-4
        px-6
        py-3
        bg-black/70
        backdrop-blur-md
        rounded-lg
        ${className}
      `}
      style={{
        right: '41px',
        top: '620px',
        width: '814px',
        textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
      }}
    >
      {/* Weather Icon */}
      <IconComponent className="w-12 h-12 text-white" strokeWidth={2} />

      {/* Temperature */}
      {temp !== undefined && temp !== null && (
        <span className="text-4xl font-bold text-white">
          {Math.round(temp)}°
        </span>
      )}

      {/* Condition */}
      {condition && (
        <span className="text-xl text-white/90 flex-1">
          {condition}
        </span>
      )}
    </div>
  );
};

export default FloatingWeather;
