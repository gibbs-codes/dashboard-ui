/**
 * Clock Component
 * Displays current time with automatic updates
 */

import React, { useState, useEffect } from 'react';

/**
 * Format time based on format option
 * @param {Date} date - Date object to format
 * @param {string} format - '12h' or '24h'
 * @param {boolean} showSeconds - Whether to show seconds
 * @returns {string} Formatted time string
 */
const formatTime = (date, format = '12h', showSeconds = true) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  if (format === '24h') {
    // 24-hour format: "22:30:45" or "22:30"
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');

    return showSeconds
      ? `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
      : `${formattedHours}:${formattedMinutes}`;
  } else {
    // 12-hour format: "10:30:45 PM" or "10:30 PM"
    const hours12 = hours % 12 || 12;
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours12.toString();
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');

    const time = showSeconds
      ? `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
      : `${formattedHours}:${formattedMinutes}`;

    return `${time} ${period}`;
  }
};

/**
 * Clock Component
 * Displays large, prominent time that updates every second
 *
 * @param {Object} props
 * @param {string} props.format - Time format: '12h' or '24h' (default: '12h')
 * @param {boolean} props.showSeconds - Whether to show seconds (default: true)
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.showDate - Whether to show date below time (default: false)
 * @returns {JSX.Element}
 */
export const Clock = ({
  format = '12h',
  showSeconds = true,
  className = '',
  showDate = false
}) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Update time every second
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Cleanup interval on unmount
    return () => {
      clearInterval(interval);
    };
  }, []);

  // Format current date
  const formatDate = (date) => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString(undefined, options);
  };

  const formattedTime = formatTime(time, format, showSeconds);
  const formattedDate = showDate ? formatDate(time) : null;

  return (
    <div
      className={`flex flex-col items-center ${className}`}
      role="timer"
      aria-live="off" // Don't announce every second
      aria-label={`Current time: ${formattedTime}`}
    >
      {/* Time Display */}
      <div
        className="
          text-6xl md:text-7xl lg:text-8xl
          font-bold
          text-white
          tabular-nums
          tracking-tight
          transition-opacity duration-300
        "
      >
        {formattedTime}
      </div>

      {/* Date Display (optional) */}
      {showDate && (
        <div
          className="
            mt-4
            text-lg md:text-xl lg:text-2xl
            text-gray-400
            font-medium
          "
        >
          {formattedDate}
        </div>
      )}
    </div>
  );
};

/**
 * CompactClock Component
 * Smaller version of Clock for headers/sidebars
 */
export const CompactClock = ({
  format = '12h',
  showSeconds = true,
  className = ''
}) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const formattedTime = formatTime(time, format, showSeconds);

  return (
    <div
      className={`
        text-2xl font-semibold text-white tabular-nums
        ${className}
      `}
      role="timer"
      aria-live="off"
      aria-label={`Current time: ${formattedTime}`}
    >
      {formattedTime}
    </div>
  );
};

export default Clock;
