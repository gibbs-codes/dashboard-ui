/**
 * FloatingClock Component
 * Large floating clock display positioned at top-center of projector
 */

import React, { useState, useEffect } from 'react';

/**
 * Format time in 12-hour format without seconds
 * @param {Date} date - Date object
 * @returns {string} Formatted time string (e.g., "3:45 PM")
 */
const formatTime = (date) => {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12; // Convert 0 to 12

  const minutesStr = minutes < 10 ? `0${minutes}` : minutes;

  return `${hours}:${minutesStr} ${ampm}`;
};

/**
 * FloatingClock Component
 * Displays current time in large format, floating above all canvases
 *
 * @param {Object} props
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element}
 */
export const FloatingClock = ({ className = '' }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Update time every second
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
        left: '900px',
        top: '1rem',
        transform: 'translateX(-50%)',
        position: 'absolute',
        zIndex: 1000,
      }}
    >
      <time
        className="text-6xl font-bold text-white tracking-wide"
        dateTime={time.toISOString()}
      >
        {formatTime(time)}
      </time>
    </div>
  );
};

export default FloatingClock;
