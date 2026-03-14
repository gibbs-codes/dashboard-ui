/**
 * NextEventCanvas Component
 * Displays the next upcoming event prominently for projector center
 */

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';

/**
 * Format time for display (e.g., "2:30 PM")
 */
const formatTime = (date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, '0');
  return `${displayHours}:${displayMinutes} ${ampm}`;
};

/**
 * Get time until event starts
 */
const getTimeUntil = (startDate, now) => {
  const diff = startDate - now;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (minutes < 0) return 'now';
  if (minutes < 60) return `in ${minutes}m`;
  if (remainingMinutes === 0) return `in ${hours}h`;
  return `in ${hours}h ${remainingMinutes}m`;
};

/**
 * Check if event is currently happening
 */
const isCurrentEvent = (start, end, now) => {
  return now >= start && now <= end;
};

/**
 * NextEventCanvas Component
 * Shows the next upcoming or current event
 *
 * @param {Object} props
 * @param {Array} props.events - Array of event objects
 * @param {string} props.className - Additional CSS classes
 */
export const NextEventCanvas = ({
  events = [],
  className = '',
}) => {
  const [now, setNow] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Find the next or current event
  const getNextEvent = () => {
    if (!events || events.length === 0) return null;

    const parsedEvents = events.map(event => ({
      ...event,
      startDate: new Date(event.start),
      endDate: new Date(event.end),
    }));

    // Sort by start time
    parsedEvents.sort((a, b) => a.startDate - b.startDate);

    // Find current event first
    const currentEvent = parsedEvents.find(e =>
      isCurrentEvent(e.startDate, e.endDate, now)
    );
    if (currentEvent) return { event: currentEvent, isCurrent: true };

    // Find next upcoming event
    const nextEvent = parsedEvents.find(e => e.startDate > now);
    if (nextEvent) return { event: nextEvent, isCurrent: false };

    return null;
  };

  const eventData = getNextEvent();

  // No events
  if (!eventData) {
    return (
      <div
        className={`
          h-full bg-black
          flex flex-col items-center justify-center
          ${className}
        `}
      >
        <Calendar className="w-20 h-20 text-gray-700 mb-6" strokeWidth={1} />
        <p className="text-3xl text-gray-600 font-light">No upcoming events</p>
      </div>
    );
  }

  const { event, isCurrent } = eventData;
  const timeUntil = getTimeUntil(event.startDate, now);

  return (
    <div
      className={`
        h-full bg-black text-white
        flex flex-col items-center justify-center
        p-8
        ${className}
      `}
    >
      {/* Status indicator */}
      <div className={`
        px-4 py-2 rounded-full mb-8
        ${isCurrent
          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
          : 'bg-green-500/20 text-green-400 border border-green-500/50'
        }
      `}>
        <span className="text-lg font-medium">
          {isCurrent ? 'Happening Now' : 'Up Next'}
        </span>
      </div>

      {/* Event title */}
      <h1 className="text-5xl font-bold text-center mb-8 leading-tight max-w-full px-4">
        {event.title}
      </h1>

      {/* Time info */}
      <div className="flex items-center gap-3 text-3xl text-gray-300 mb-4">
        <Clock className="w-8 h-8" strokeWidth={1.5} />
        <span>{formatTime(event.startDate)} - {formatTime(event.endDate)}</span>
      </div>

      {/* Time until */}
      {!isCurrent && (
        <div className="text-4xl font-light text-green-400 mb-6">
          {timeUntil}
        </div>
      )}

      {/* Location */}
      {event.location && (
        <div className="flex items-center gap-3 text-xl text-gray-500 mt-4">
          <MapPin className="w-6 h-6" strokeWidth={1.5} />
          <span>{event.location}</span>
        </div>
      )}
    </div>
  );
};

export default NextEventCanvas;
