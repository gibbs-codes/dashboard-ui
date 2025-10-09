/**
 * TVFocus Component
 * Minimal focus mode for TV display - shows only next event
 */

import React, { useState, useEffect } from 'react';
import { Clock } from '../../components/shared/Clock';
import { DateDisplay } from '../../components/shared/DateDisplay';
import { MapPin, Clock as ClockIcon } from 'lucide-react';

/**
 * Get minutes until event
 * @param {string} startTime - ISO datetime string
 * @returns {number} Minutes until event
 */
const getMinutesUntil = (startTime) => {
  const now = new Date();
  const start = new Date(startTime);
  const diff = start - now;
  return Math.floor(diff / 60000);
};

/**
 * Format countdown
 * @param {number} minutes - Minutes until event
 * @returns {string} Formatted countdown
 */
const formatCountdown = (minutes) => {
  if (minutes < 0) return 'Started';
  if (minutes === 0) return 'Starting now';
  if (minutes === 1) return '1 minute';
  if (minutes < 60) return `${minutes} minutes`;

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 1 && mins === 0) return '1 hour';
  if (hours === 1) return `1 hour ${mins} min`;
  if (mins === 0) return `${hours} hours`;
  return `${hours} hours ${mins} min`;
};

/**
 * Get countdown color based on urgency
 * @param {number} minutes - Minutes until event
 * @returns {string} Tailwind color class
 */
const getCountdownColor = (minutes) => {
  if (minutes < 0) return 'text-gray-400';
  if (minutes <= 15) return 'text-red-400';
  if (minutes <= 60) return 'text-yellow-400';
  return 'text-green-400';
};

/**
 * Format event time
 * @param {string} dateStr - ISO datetime string
 * @returns {string} Formatted time
 */
const formatEventTime = (dateStr) => {
  const date = new Date(dateStr);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, '0');
  return `${displayHours}:${displayMinutes} ${ampm}`;
};

/**
 * LargeNextEvent Component
 * Shows next event with large text
 */
const LargeNextEvent = ({ event }) => {
  const [minutesUntil, setMinutesUntil] = useState(
    getMinutesUntil(event.start)
  );

  // Update countdown every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setMinutesUntil(getMinutesUntil(event.start));
    }, 60000); // 1 minute

    return () => clearInterval(interval);
  }, [event.start]);

  const countdown = formatCountdown(minutesUntil);
  const countdownColor = getCountdownColor(minutesUntil);

  return (
    <div className="text-center text-white max-w-4xl">
      {/* Title */}
      <h1 className="text-6xl font-bold mb-8 text-shadow-lg leading-tight">
        {event.title}
      </h1>

      {/* Time */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <ClockIcon className="w-10 h-10 text-blue-400" strokeWidth={1.5} />
        <p className="text-4xl text-white/90 text-shadow">
          {formatEventTime(event.start)}
        </p>
      </div>

      {/* Countdown */}
      <p className={`text-3xl font-bold mb-6 ${countdownColor} text-shadow`}>
        {countdown}
      </p>

      {/* Location */}
      {event.location && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <MapPin className="w-8 h-8 text-purple-400" strokeWidth={1.5} />
          <p className="text-2xl text-white/80 text-shadow">
            {event.location}
          </p>
        </div>
      )}
    </div>
  );
};

/**
 * NoEventsView Component
 * Shows clock and date when no events
 */
const NoEventsView = () => {
  return (
    <div className="text-center text-white">
      <p className="text-3xl text-white/60 mb-12 text-shadow">
        No upcoming events
      </p>
      <Clock
        format="12h"
        showSeconds={true}
        className="text-7xl font-bold mb-6 text-shadow-lg"
      />
      <DateDisplay
        format="full"
        className="text-3xl text-white/90 text-shadow"
      />
    </div>
  );
};

/**
 * SmallClock Component
 * Fixed position clock in bottom-right
 */
const SmallClock = () => {
  return (
    <div className="fixed bottom-4 right-4 text-white text-right">
      <Clock
        format="12h"
        showSeconds={false}
        className="text-2xl font-bold text-shadow"
      />
      <DateDisplay
        format="short"
        className="text-sm text-white/70 text-shadow mt-1"
      />
    </div>
  );
};

/**
 * TVFocus Component
 * Minimal focus mode for TV display
 *
 * @param {Object} props
 * @param {Object} props.data - Dashboard data
 * @returns {JSX.Element}
 */
export const TVFocus = ({ data = {} }) => {
  const { events = [] } = data;

  // Get next event
  const now = new Date();
  const nextEvent = events
    .filter(event => new Date(event.start) > now)
    .sort((a, b) => new Date(a.start) - new Date(b.start))[0];

  return (
    <div className="h-screen w-screen relative">
      {/* Main content (centered) */}
      <div className="h-full flex items-center justify-center px-8">
        {nextEvent ? (
          <LargeNextEvent event={nextEvent} />
        ) : (
          <NoEventsView />
        )}
      </div>

      {/* Small clock (bottom-right) */}
      {nextEvent && <SmallClock />}
    </div>
  );
};

export default TVFocus;
