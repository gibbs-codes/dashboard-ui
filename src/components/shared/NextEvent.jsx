/**
 * NextEvent Component
 * Displays the next upcoming calendar event with color-coded urgency
 */

import React from 'react';
import { Calendar, Clock, MapPin, AlertCircle } from 'lucide-react';

/**
 * Get urgency level based on minutes until event
 * @param {number} minutesUntil - Minutes until event starts
 * @returns {string} Urgency level: 'urgent', 'soon', 'normal'
 */
const getUrgencyLevel = (minutesUntil) => {
  if (minutesUntil < 15) return 'urgent';
  if (minutesUntil < 60) return 'soon';
  return 'normal';
};

/**
 * Get urgency colors based on level
 * @param {string} level - Urgency level
 * @returns {Object} Color classes for background, text, and border
 */
const getUrgencyColors = (level) => {
  const colors = {
    urgent: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/50',
      text: 'text-red-400',
      badge: 'bg-red-500/20 text-red-300',
      icon: 'text-red-500',
    },
    soon: {
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/50',
      text: 'text-yellow-400',
      badge: 'bg-yellow-500/20 text-yellow-300',
      icon: 'text-yellow-500',
    },
    normal: {
      bg: 'bg-green-500/10',
      border: 'border-green-500/50',
      text: 'text-green-400',
      badge: 'bg-green-500/20 text-green-300',
      icon: 'text-green-500',
    },
  };

  return colors[level] || colors.normal;
};

/**
 * Format time from ISO string or Date object
 * @param {string|Date} time - Time to format
 * @returns {string} Formatted time string
 */
const formatTime = (time) => {
  if (!time) return '';

  const date = typeof time === 'string' ? new Date(time) : time;

  return date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Format minutes into human-readable countdown
 * @param {number} minutes - Minutes until event
 * @returns {string} Formatted countdown string
 */
const formatCountdown = (minutes) => {
  if (minutes < 0) return 'happening now';
  if (minutes === 0) return 'starting now';
  if (minutes === 1) return 'in 1 minute';
  if (minutes < 60) return `in ${minutes} minutes`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 1 && remainingMinutes === 0) return 'in 1 hour';
  if (remainingMinutes === 0) return `in ${hours} hours`;
  if (hours === 1) return `in 1 hour ${remainingMinutes} min`;

  return `in ${hours} hours ${remainingMinutes} min`;
};

/**
 * NextEvent Component
 * Displays next upcoming calendar event with urgency indicators
 *
 * @param {Object} props
 * @param {Object} props.event - Event object
 * @param {string} props.event.title - Event title
 * @param {string|Date} props.event.start - Event start time
 * @param {string|Date} props.event.end - Event end time
 * @param {string} props.event.location - Event location (optional)
 * @param {number} props.event.minutesUntil - Minutes until event starts
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element}
 */
export const NextEvent = ({
  event,
  className = ''
}) => {
  // No event case
  if (!event) {
    return (
      <div
        className={`
          bg-gray-800 border-2 border-gray-700
          rounded-2xl p-6
          ${className}
        `}
        role="region"
        aria-label="No upcoming events"
      >
        <div className="flex flex-col items-center justify-center py-8 text-gray-500">
          <Calendar className="w-16 h-16 mb-4" strokeWidth={1.5} />
          <p className="text-lg font-medium">No upcoming events</p>
          <p className="text-sm mt-2 text-gray-600">Your calendar is clear</p>
        </div>
      </div>
    );
  }

  const { title, start, end, location, minutesUntil } = event;

  // Determine urgency and colors
  const urgency = getUrgencyLevel(minutesUntil || 0);
  const colors = getUrgencyColors(urgency);

  // Format times
  const startTime = formatTime(start);
  const endTime = formatTime(end);
  const countdown = formatCountdown(minutesUntil || 0);

  return (
    <div
      className={`
        ${colors.bg}
        border-2 ${colors.border}
        rounded-2xl p-6
        transition-all duration-300
        ${className}
      `}
      role="region"
      aria-label="Next upcoming event"
    >
      {/* Header with urgency badge */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className={`w-6 h-6 ${colors.icon}`} strokeWidth={2} />
          <span className="text-sm font-medium text-gray-400">Next Event</span>
        </div>

        {/* Urgency badge */}
        {urgency === 'urgent' && (
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${colors.badge}`}>
            <AlertCircle className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase">Urgent</span>
          </div>
        )}
      </div>

      {/* Event title */}
      <h3
        className="text-2xl md:text-3xl font-bold text-white mb-3 line-clamp-2"
        title={title}
      >
        {title}
      </h3>

      {/* Event details */}
      <div className="space-y-2">
        {/* Start time */}
        <div className="flex items-center gap-2 text-gray-300">
          <Clock className="w-5 h-5 text-gray-400" strokeWidth={2} />
          <span className="text-lg">
            {startTime}
            {endTime && ` - ${endTime}`}
          </span>
        </div>

        {/* Location */}
        {location && (
          <div className="flex items-center gap-2 text-gray-300">
            <MapPin className="w-5 h-5 text-gray-400" strokeWidth={2} />
            <span className="text-base truncate" title={location}>
              {location}
            </span>
          </div>
        )}
      </div>

      {/* Countdown */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div
          className={`
            text-center text-xl md:text-2xl font-bold ${colors.text}
            transition-colors duration-300
          `}
        >
          {countdown}
        </div>
      </div>
    </div>
  );
};

/**
 * CompactNextEvent Component
 * Smaller version for sidebars or compact layouts
 */
export const CompactNextEvent = ({
  event,
  className = ''
}) => {
  if (!event) {
    return (
      <div className={`flex items-center gap-2 text-gray-500 ${className}`}>
        <Calendar className="w-5 h-5" />
        <span className="text-sm">No upcoming events</span>
      </div>
    );
  }

  const { title, minutesUntil } = event;
  const urgency = getUrgencyLevel(minutesUntil || 0);
  const colors = getUrgencyColors(urgency);
  const countdown = formatCountdown(minutesUntil || 0);

  return (
    <div
      className={`
        ${colors.bg}
        border ${colors.border}
        rounded-lg p-4
        ${className}
      `}
    >
      <div className="flex items-start gap-3">
        <Calendar className={`w-5 h-5 mt-0.5 ${colors.icon} flex-shrink-0`} strokeWidth={2} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate" title={title}>
            {title}
          </p>
          <p className={`text-sm ${colors.text} mt-1`}>
            {countdown}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NextEvent;
