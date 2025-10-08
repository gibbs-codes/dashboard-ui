/**
 * DateDisplay Component
 * Displays current date with automatic midnight updates
 */

import React, { useState, useEffect } from 'react';

/**
 * Format date based on format option
 * @param {Date} date - Date object to format
 * @param {string} format - 'full' or 'short'
 * @returns {string} Formatted date string
 */
const formatDate = (date, format = 'full') => {
  if (format === 'short') {
    // Short format: "Wed, Oct 8"
    const options = {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    };
    return date.toLocaleDateString(undefined, options);
  } else {
    // Full format: "Wednesday, October 8, 2025"
    const options = {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    };
    return date.toLocaleDateString(undefined, options);
  }
};

/**
 * Calculate milliseconds until next midnight
 * @returns {number} Milliseconds until midnight
 */
const msUntilMidnight = () => {
  const now = new Date();
  const midnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0, 0, 0, 0
  );
  return midnight.getTime() - now.getTime();
};

/**
 * DateDisplay Component
 * Displays current date with weekday, updates at midnight
 *
 * @param {Object} props
 * @param {string} props.format - Date format: 'full' or 'short' (default: 'full')
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element}
 */
export const DateDisplay = ({
  format = 'full',
  className = ''
}) => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    // Function to update date
    const updateDate = () => {
      setDate(new Date());
    };

    // Calculate time until midnight
    const timeUntilMidnight = msUntilMidnight();

    // Set timeout to update at midnight
    const midnightTimeout = setTimeout(() => {
      updateDate();

      // After midnight update, set up daily interval
      const dailyInterval = setInterval(updateDate, 24 * 60 * 60 * 1000);

      // Cleanup function will clear this interval
      return () => {
        clearInterval(dailyInterval);
      };
    }, timeUntilMidnight);

    // Cleanup timeout on unmount
    return () => {
      clearTimeout(midnightTimeout);
    };
  }, []);

  const formattedDate = formatDate(date, format);

  return (
    <div
      className={`
        text-2xl md:text-3xl lg:text-4xl
        font-medium
        text-gray-400
        transition-opacity duration-300
        ${className}
      `}
      role="text"
      aria-label={`Today's date: ${formattedDate}`}
    >
      {formattedDate}
    </div>
  );
};

/**
 * CompactDateDisplay Component
 * Smaller version for headers/sidebars
 */
export const CompactDateDisplay = ({
  format = 'short',
  className = ''
}) => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const updateDate = () => {
      setDate(new Date());
    };

    const timeUntilMidnight = msUntilMidnight();

    const midnightTimeout = setTimeout(() => {
      updateDate();
      const dailyInterval = setInterval(updateDate, 24 * 60 * 60 * 1000);
      return () => {
        clearInterval(dailyInterval);
      };
    }, timeUntilMidnight);

    return () => {
      clearTimeout(midnightTimeout);
    };
  }, []);

  const formattedDate = formatDate(date, format);

  return (
    <div
      className={`
        text-base md:text-lg
        font-medium
        text-gray-400
        ${className}
      `}
      role="text"
      aria-label={`Today's date: ${formattedDate}`}
    >
      {formattedDate}
    </div>
  );
};

export default DateDisplay;
