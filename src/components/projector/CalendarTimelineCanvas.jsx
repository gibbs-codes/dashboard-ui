/**
 * CalendarTimelineCanvas Component
 * Vertical event timeline display for projector (6 AM - 11 PM)
 */

import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

/**
 * Convert time to minutes from midnight
 * @param {Date} date - Date object
 * @returns {number} Minutes from midnight
 */
const getMinutesFromMidnight = (date) => {
  return date.getHours() * 60 + date.getMinutes();
};

/**
 * Calculate position percentage on timeline
 * @param {Date} time - Time to position
 * @param {number} startHour - Timeline start hour (default: 6)
 * @param {number} endHour - Timeline end hour (default: 23)
 * @returns {number} Position as percentage (0-100)
 */
const getTimelinePosition = (time, startHour = 6, endHour = 23) => {
  const minutes = getMinutesFromMidnight(time);
  const startMinutes = startHour * 60;
  const endMinutes = endHour * 60;
  const totalMinutes = endMinutes - startMinutes;

  const position = ((minutes - startMinutes) / totalMinutes) * 100;
  return Math.max(0, Math.min(100, position));
};

/**
 * Get event height based on duration
 * @param {Date} start - Event start time
 * @param {Date} end - Event end time
 * @param {number} startHour - Timeline start hour
 * @param {number} endHour - Timeline end hour
 * @returns {number} Height as percentage
 */
const getEventHeight = (start, end, startHour = 6, endHour = 23) => {
  const startPos = getTimelinePosition(start, startHour, endHour);
  const endPos = getTimelinePosition(end, startHour, endHour);
  return endPos - startPos;
};

/**
 * Check if event is currently happening
 * @param {Date} start - Event start time
 * @param {Date} end - Event end time
 * @param {Date} now - Current time
 * @returns {boolean} True if event is current
 */
const isCurrentEvent = (start, end, now) => {
  return now >= start && now <= end;
};

/**
 * Check if event is in the past
 * @param {Date} end - Event end time
 * @param {Date} now - Current time
 * @returns {boolean} True if event has ended
 */
const isPastEvent = (end, now) => {
  return end < now;
};

/**
 * Format time for display (e.g., "2:30 PM")
 * @param {Date} date - Date object
 * @returns {string} Formatted time
 */
const formatEventTime = (date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, '0');
  return `${displayHours}:${displayMinutes} ${ampm}`;
};

/**
 * Format hour marker (e.g., "6 AM", "12 PM")
 * @param {number} hour - Hour (0-23)
 * @returns {string} Formatted hour
 */
const formatHourMarker = (hour) => {
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour} ${ampm}`;
};

/**
 * Detect overlapping events and assign offset
 * @param {Array} events - Array of event objects with parsed dates
 * @returns {Array} Events with overlap property
 */
const detectOverlaps = (events) => {
  const sortedEvents = [...events].sort((a, b) => a.startDate - b.startDate);
  const columns = [];

  sortedEvents.forEach(event => {
    // Find first available column
    let column = 0;
    while (columns[column]) {
      const lastEventInColumn = columns[column][columns[column].length - 1];
      if (lastEventInColumn.endDate <= event.startDate) {
        // Column is free
        break;
      }
      column++;
    }

    // Place event in column
    if (!columns[column]) columns[column] = [];
    columns[column].push(event);
    event.overlap = column;
    event.totalColumns = 1; // Will update later
  });

  // Update totalColumns for all events
  const maxColumns = columns.length;
  sortedEvents.forEach(event => {
    event.totalColumns = maxColumns;
  });

  return sortedEvents;
};

/**
 * Event Component
 * Displays a single event on the timeline
 */
const TimelineEvent = ({ event, startHour, endHour, now }) => {
  const { title, location, startDate, endDate, overlap = 0, totalColumns = 1 } = event;

  const isCurrent = isCurrentEvent(startDate, endDate, now);
  const isPast = isPastEvent(endDate, now);

  const top = getTimelinePosition(startDate, startHour, endHour);
  const height = getEventHeight(startDate, endDate, startHour, endHour);

  // Calculate left offset for overlapping events
  const width = 100 / totalColumns;
  const left = overlap * width;

  return (
    <div
      className={`
        absolute
        px-3 py-2
        rounded-lg
        border-l-4
        transition-all
        ${isCurrent
          ? 'bg-blue-900/90 border-blue-400 shadow-lg shadow-blue-500/50'
          : isPast
          ? 'bg-gray-800/60 border-gray-600 text-gray-500'
          : 'bg-gray-900/80 border-green-400'
        }
      `}
      style={{
        top: `${top}%`,
        height: `${height}%`,
        left: `${left}%`,
        width: `${width}%`,
        minHeight: '3rem',
      }}
    >
      <div className="text-sm font-bold text-white mb-1 line-clamp-2">
        {title}
      </div>
      <div className={`text-xs ${isPast ? 'text-gray-600' : 'text-gray-400'}`}>
        {formatEventTime(startDate)} - {formatEventTime(endDate)}
      </div>
      {location && (
        <div className={`text-xs mt-1 ${isPast ? 'text-gray-600' : 'text-gray-500'} line-clamp-1`}>
          {location}
        </div>
      )}
    </div>
  );
};

/**
 * Current Time Indicator
 * Red horizontal line at current time
 */
const CurrentTimeIndicator = ({ now, startHour, endHour }) => {
  const position = getTimelinePosition(now, startHour, endHour);

  // Don't show if outside timeline range
  if (position <= 0 || position >= 100) return null;

  return (
    <div
      className="absolute left-0 right-0 z-10 flex items-center"
      style={{ top: `${position}%` }}
    >
      {/* Red circle */}
      <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-lg" />
      {/* Red line */}
      <div className="flex-1 h-0.5 bg-red-500 shadow-lg" />
    </div>
  );
};

/**
 * CalendarTimelineCanvas Component
 * Vertical timeline from 6 AM to 11 PM
 *
 * @param {Object} props
 * @param {Array} props.events - Array of event objects
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element}
 */
export const CalendarTimelineCanvas = ({
  events = [],
  className = '',
}) => {
  const [now, setNow] = useState(new Date());

  const START_HOUR = 6; // 6 AM
  const END_HOUR = 23; // 11 PM

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000); // 1 minute

    return () => clearInterval(interval);
  }, []);

  // Parse event dates and detect overlaps
  const parsedEvents = events.map(event => ({
    ...event,
    startDate: new Date(event.start),
    endDate: new Date(event.end),
  }));

  const eventsWithOverlaps = detectOverlaps(parsedEvents);

  // Generate hour markers
  const hourMarkers = [];
  for (let hour = START_HOUR; hour <= END_HOUR; hour++) {
    hourMarkers.push(hour);
  }

  // Handle no events
  if (!events || events.length === 0) {
    return (
      <div
        className={`
          h-full
          bg-black
          flex items-center justify-center
          ${className}
        `}
      >
        <div className="text-center">
          <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" strokeWidth={1.5} />
          <p className="text-xl text-gray-500">No events today</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        h-full
        bg-black
        text-white
        p-6
        overflow-hidden
        ${className}
      `}
      role="region"
      aria-label="Calendar timeline"
    >
      {/* Timeline container */}
      <div className="h-full flex gap-4">
        {/* Hour markers (left column) */}
        <div className="relative flex-shrink-0 w-20">
          {hourMarkers.map((hour, index) => {
            const position = (index / (hourMarkers.length - 1)) * 100;
            return (
              <div
                key={hour}
                className="absolute right-0 text-right"
                style={{ top: `${position}%`, transform: 'translateY(-50%)' }}
              >
                <span className="text-sm text-gray-400 font-medium">
                  {formatHourMarker(hour)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Timeline track (right column) */}
        <div className="flex-1 relative border-l-2 border-gray-700">
          {/* Hour grid lines */}
          {hourMarkers.map((hour, index) => {
            const position = (index / (hourMarkers.length - 1)) * 100;
            return (
              <div
                key={`grid-${hour}`}
                className="absolute left-0 right-0 border-t border-gray-800"
                style={{ top: `${position}%` }}
              />
            );
          })}

          {/* Current time indicator */}
          <CurrentTimeIndicator now={now} startHour={START_HOUR} endHour={END_HOUR} />

          {/* Events */}
          <div className="absolute inset-0 pl-4">
            {eventsWithOverlaps.map(event => (
              <TimelineEvent
                key={event.id}
                event={event}
                startHour={START_HOUR}
                endHour={END_HOUR}
                now={now}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarTimelineCanvas;
