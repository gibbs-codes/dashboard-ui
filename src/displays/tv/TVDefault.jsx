/**
 * TVDefault Component
 * Default 2x2 grid layout for TV display
 */

import React from 'react';
import { Weather } from '../../components/shared/Weather';
import { NextEvent } from '../../components/shared/NextEvent';
import { Clock } from '../../components/shared/Clock';
import { DateDisplay } from '../../components/shared/DateDisplay';
import { Bus, Train } from 'lucide-react';

/**
 * TransitCard Component
 * Shows CTA transit arrivals in card format
 */
const TransitCard = ({ data }) => {
  if (!data) {
    return (
      <div className="flex items-center justify-center h-full text-white/60">
        <p className="text-lg">No transit data</p>
      </div>
    );
  }

  const { buses = [], red = [], brown = [] } = data;

  /**
   * Get urgency color for arrival time
   * @param {number} minutes - Minutes until arrival
   * @returns {string} Tailwind color class
   */
  const getUrgencyColor = (minutes) => {
    if (minutes <= 3) return 'text-red-400';
    if (minutes <= 7) return 'text-yellow-400';
    return 'text-green-400';
  };

  /**
   * Format arrival time
   * @param {number} minutes - Minutes until arrival
   * @returns {string} Formatted time
   */
  const formatArrival = (minutes) => {
    if (minutes <= 1) return 'Due';
    return `${minutes} min`;
  };

  return (
    <div className="h-full flex flex-col gap-4 text-white">
      {/* Bus 77 */}
      {buses.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Bus className="w-5 h-5 text-blue-400" />
            <span className="font-bold text-lg">Bus 77</span>
          </div>
          <div className="space-y-1 ml-7">
            {buses.slice(0, 3).map((arrival, idx) => (
              <div key={idx} className="flex justify-between">
                <span className="text-sm text-white/80">{arrival.direction}</span>
                <span className={`text-sm font-bold ${getUrgencyColor(arrival.minutes)}`}>
                  {formatArrival(arrival.minutes)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Red Line */}
      {red.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Train className="w-5 h-5 text-red-500" />
            <span className="font-bold text-lg">Red Line</span>
          </div>
          <div className="space-y-1 ml-7">
            {red.slice(0, 3).map((arrival, idx) => (
              <div key={idx} className="flex justify-between">
                <span className="text-sm text-white/80">{arrival.direction}</span>
                <span className={`text-sm font-bold ${getUrgencyColor(arrival.minutes)}`}>
                  {formatArrival(arrival.minutes)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Brown Line */}
      {brown.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Train className="w-5 h-5 text-amber-600" />
            <span className="font-bold text-lg">Brown Line</span>
          </div>
          <div className="space-y-1 ml-7">
            {brown.slice(0, 3).map((arrival, idx) => (
              <div key={idx} className="flex justify-between">
                <span className="text-sm text-white/80">{arrival.direction}</span>
                <span className={`text-sm font-bold ${getUrgencyColor(arrival.minutes)}`}>
                  {formatArrival(arrival.minutes)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No data */}
      {buses.length === 0 && red.length === 0 && brown.length === 0 && (
        <div className="flex items-center justify-center h-full text-white/60">
          <p className="text-lg">No arrivals</p>
        </div>
      )}
    </div>
  );
};

/**
 * ClockDateCard Component
 * Large clock and date display
 */
const ClockDateCard = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-white">
      <Clock
        format="12h"
        showSeconds={true}
        className="text-6xl font-bold mb-4 text-shadow-lg"
      />
      <DateDisplay
        format="full"
        className="text-2xl text-white/90 text-shadow"
      />
    </div>
  );
};

/**
 * TVDefault Component
 * Default 2x2 grid layout for TV display
 *
 * @param {Object} props
 * @param {Object} props.data - Dashboard data
 * @returns {JSX.Element}
 */
export const TVDefault = ({ data = {} }) => {
  const { weather, events, transit } = data;

  // Get next event
  const nextEvent = events && events.length > 0
    ? events.find(event => new Date(event.start) > new Date())
    : null;

  return (
    <div className="h-screen w-screen p-8">
      {/* 2x2 Grid */}
      <div className="grid grid-cols-2 grid-rows-2 gap-6 h-full">
        {/* Top Left: Weather */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 shadow-2xl">
          {weather ? (
            <Weather data={weather} className="h-full" />
          ) : (
            <div className="flex items-center justify-center h-full text-white/60">
              <p className="text-lg">No weather data</p>
            </div>
          )}
        </div>

        {/* Top Right: Next Event */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 shadow-2xl">
          {nextEvent ? (
            <div className="h-full flex items-center">
              <NextEvent event={nextEvent} className="w-full" />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-white/60">
              <p className="text-lg">No upcoming events</p>
            </div>
          )}
        </div>

        {/* Bottom Left: Transit */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 shadow-2xl">
          <TransitCard data={transit} />
        </div>

        {/* Bottom Right: Clock + Date */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 shadow-2xl">
          <ClockDateCard />
        </div>
      </div>
    </div>
  );
};

export default TVDefault;
