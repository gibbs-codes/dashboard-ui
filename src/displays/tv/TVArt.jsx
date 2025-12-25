/**
 * TVArt Component
 * Fullpage art display with time and weather overlay
 */

import React from 'react';
import { ArtCanvas } from '../../components/projector/ArtCanvas';
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

/**
 * Map OpenWeatherMap icon codes to Lucide React icons
 */
const getWeatherIcon = (iconCode) => {
  if (!iconCode) return Cloud;

  const iconMap = {
    '01d': Sun, '01n': Moon,
    '02d': CloudSun, '02n': CloudMoon,
    '03d': Cloud, '03n': Cloud,
    '04d': Cloudy, '04n': Cloudy,
    '09d': CloudRain, '09n': CloudRain,
    '10d': CloudDrizzle, '10n': CloudDrizzle,
    '11d': CloudLightning, '11n': CloudLightning,
    '13d': CloudSnow, '13n': CloudSnow,
    '50d': CloudFog, '50n': CloudFog,
  };

  return iconMap[iconCode] || Cloud;
};

/**
 * Format time in 12-hour format
 */
const formatTime = (date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const hours12 = hours % 12 || 12;
  const period = hours >= 12 ? 'PM' : 'AM';
  const formattedMinutes = minutes.toString().padStart(2, '0');
  return `${hours12}:${formattedMinutes} ${period}`;
};

/**
 * Format date
 */
const formatDate = (date) => {
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
};

/**
 * ClockWeatherDisplay Component
 * Combined display for time, date, and weather
 */
const ClockWeatherDisplay = ({ weather }) => {
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const WeatherIcon = weather ? getWeatherIcon(weather.icon) : null;

  return (
    <div className="flex items-center gap-12">
      {/* Time */}
      <div className="text-white">
        <div className="text-9xl font-extralight tracking-tighter tabular-nums drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
          {formatTime(time)}
        </div>
        <div className="text-2xl font-extralight tracking-widest uppercase text-white/85 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] mt-3">
          {formatDate(time)}
        </div>
      </div>

      {/* Weather */}
      {weather && (
        <div className="flex items-center gap-5 text-white">
          <WeatherIcon className="w-20 h-20 text-white/90" strokeWidth={1} />
          <div>
            <div className="text-7xl font-extralight tabular-nums tracking-tighter">
              {Math.round(weather.temp)}°
            </div>
            <div className="text-base font-extralight tracking-wide text-white/75 mt-1 capitalize">
              {weather.condition}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * TVArt Component
 * Displays fullpage artwork from API with time and weather overlay
 *
 * Expected API data structure:
 * {
 *   artworkTV: {
 *     imageUrl: string,  // Full URL to artwork image
 *     title: string,     // Artwork title
 *     artist: string,    // Artist name
 *     date: string       // Date/period (e.g., "1889" or "19th century")
 *   },
 *   weather: {
 *     temp: number,       // Temperature in Fahrenheit or Celsius
 *     condition: string,  // Weather condition (e.g., "Cloudy", "Clear")
 *     icon: string        // OpenWeatherMap icon code (e.g., "01d", "10n")
 *   }
 * }
 *
 * @param {Object} props
 * @param {Object} props.data - Dashboard data
 * @returns {JSX.Element}
 */
export const TVArt = ({ data = {} }) => {
  const { artworkTV: artwork = null, weather = null } = data;

  return (
    <div className="h-screen w-screen relative">
      {/* Fullpage Art Background */}
      <ArtCanvas
        artwork={artwork}
        className="absolute inset-0"
        cycleInterval={300000} // 5 minutes
      />

      {/* Gradient overlay for better text visibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />

      {/* Time, Date & Weather Display - Bottom Third */}
      <div className="absolute bottom-16 left-16">
        <ClockWeatherDisplay weather={weather} />
      </div>

      {/* Artwork Info - Bottom Right (if available) */}
      {artwork?.title && (
        <div className="absolute bottom-16 right-16 max-w-md text-right">
          <div className="backdrop-blur-md bg-black/25 rounded-xl px-6 py-4 drop-shadow-[0_4px_20px_rgba(0,0,0,0.7)]">
            <h2 className="text-xl font-light text-white mb-1">
              {artwork.title}
            </h2>
            {artwork.artist && (
              <p className="text-sm font-light text-white/85">
                {artwork.artist}
              </p>
            )}
            {artwork.date && (
              <p className="text-xs font-light text-white/60 mt-1">
                {artwork.date}
              </p>
            )}
            {artwork.source && (
              <p className="text-xs font-light text-white/50 mt-2 italic">
                {artwork.source === 'artic' && 'Art Institute of Chicago'}
                {artwork.source === 'met' && 'Metropolitan Museum of Art'}
                {artwork.source === 'cleveland' && 'Cleveland Museum of Art'}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TVArt;
