/**
 * Date and Time Utilities
 * Helper functions for formatting and manipulating dates and times
 */

/**
 * Format time from a Date object
 * @param {Date|string} date - Date object or ISO string
 * @param {string} format - '12h' or '24h' (default: '12h')
 * @param {boolean} showSeconds - Whether to show seconds (default: true)
 * @returns {string} Formatted time string
 *
 * @example
 * formatTime(new Date(), '12h', true) // "10:30:45 PM"
 * formatTime(new Date(), '24h', false) // "22:30"
 */
export const formatTime = (date, format = '12h', showSeconds = true) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (!(dateObj instanceof Date) || isNaN(dateObj)) {
    return '';
  }

  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  const seconds = dateObj.getSeconds();

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
 * Format date from a Date object
 * @param {Date|string} date - Date object or ISO string
 * @param {string} format - 'full' | 'short' | 'numeric' (default: 'full')
 * @returns {string} Formatted date string
 *
 * @example
 * formatDate(new Date(), 'full') // "Wednesday, October 8, 2025"
 * formatDate(new Date(), 'short') // "Wed, Oct 8"
 * formatDate(new Date(), 'numeric') // "10/08/2025"
 */
export const formatDate = (date, format = 'full') => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (!(dateObj instanceof Date) || isNaN(dateObj)) {
    return '';
  }

  if (format === 'numeric') {
    // Numeric format: "10/08/2025"
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getDate().toString().padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${month}/${day}/${year}`;
  } else if (format === 'short') {
    // Short format: "Wed, Oct 8"
    const options = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    };
    return dateObj.toLocaleDateString(undefined, options);
  } else {
    // Full format: "Wednesday, October 8, 2025"
    const options = {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    };
    return dateObj.toLocaleDateString(undefined, options);
  }
};

/**
 * Get time of day period
 * @param {Date} date - Date object (default: now)
 * @returns {string} 'morning' | 'afternoon' | 'evening' | 'night'
 *
 * @example
 * getTimeOfDay(new Date('2025-10-08T08:00:00')) // "morning"
 * getTimeOfDay(new Date('2025-10-08T14:00:00')) // "afternoon"
 */
export const getTimeOfDay = (date = new Date()) => {
  const hour = date.getHours();

  if (hour >= 6 && hour < 12) {
    return 'morning';
  } else if (hour >= 12 && hour < 18) {
    return 'afternoon';
  } else if (hour >= 18 && hour < 22) {
    return 'evening';
  } else {
    return 'night';
  }
};

/**
 * Get minutes from now until a future date
 * @param {Date|string} futureDate - Future date
 * @returns {number|null} Minutes until date, or null if in past
 *
 * @example
 * getMinutesUntil(new Date(Date.now() + 1800000)) // 30
 * getMinutesUntil(new Date(Date.now() - 1000)) // null
 */
export const getMinutesUntil = (futureDate) => {
  const future = typeof futureDate === 'string' ? new Date(futureDate) : futureDate;

  if (!(future instanceof Date) || isNaN(future)) {
    return null;
  }

  const now = new Date();
  const diffMs = future.getTime() - now.getTime();

  // Return null if date is in the past
  if (diffMs < 0) {
    return null;
  }

  // Convert to minutes and round
  const minutes = Math.round(diffMs / 60000);
  return minutes;
};

/**
 * Check if a date is today
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if date is today
 *
 * @example
 * isToday(new Date()) // true
 * isToday(new Date('2025-10-09')) // false (if today is 10/08)
 */
export const isToday = (date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (!(dateObj instanceof Date) || isNaN(dateObj)) {
    return false;
  }

  const today = new Date();

  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
};

/**
 * Check if a date is in the future
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if date is in future
 *
 * @example
 * isFuture(new Date(Date.now() + 10000)) // true
 * isFuture(new Date(Date.now() - 10000)) // false
 */
export const isFuture = (date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (!(dateObj instanceof Date) || isNaN(dateObj)) {
    return false;
  }

  return dateObj.getTime() > Date.now();
};

/**
 * Format duration in minutes to human-readable string
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration string
 *
 * @example
 * formatDuration(5) // "5 min"
 * formatDuration(60) // "1 hr"
 * formatDuration(90) // "1 hr 30 min"
 * formatDuration(120) // "2 hrs"
 */
export const formatDuration = (minutes) => {
  if (typeof minutes !== 'number' || minutes < 0) {
    return '0 min';
  }

  if (minutes === 0) {
    return '0 min';
  }

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  const hourText = hours === 1 ? '1 hr' : `${hours} hrs`;

  if (remainingMinutes === 0) {
    return hourText;
  }

  return `${hourText} ${remainingMinutes} min`;
};

/**
 * Get time-appropriate greeting
 * @param {Date} date - Date object (default: now)
 * @returns {string} Greeting message
 *
 * @example
 * getGreeting() // "Good morning" (if morning)
 * getGreeting(new Date('2025-10-08T14:00:00')) // "Good afternoon"
 */
export const getGreeting = (date = new Date()) => {
  const period = getTimeOfDay(date);

  const greetings = {
    morning: 'Good morning',
    afternoon: 'Good afternoon',
    evening: 'Good evening',
    night: 'Good evening', // Use "Good evening" for night as well
  };

  return greetings[period];
};

/**
 * Get relative time string (e.g., "in 5 minutes", "2 hours ago")
 * @param {Date|string} date - Date to compare
 * @returns {string} Relative time string
 *
 * @example
 * getRelativeTime(new Date(Date.now() + 300000)) // "in 5 minutes"
 * getRelativeTime(new Date(Date.now() - 3600000)) // "1 hour ago"
 */
export const getRelativeTime = (date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (!(dateObj instanceof Date) || isNaN(dateObj)) {
    return '';
  }

  const now = new Date();
  const diffMs = dateObj.getTime() - now.getTime();
  const diffMinutes = Math.round(diffMs / 60000);
  const isPast = diffMs < 0;
  const absDiffMinutes = Math.abs(diffMinutes);

  // Less than 1 minute
  if (absDiffMinutes < 1) {
    return isPast ? 'just now' : 'now';
  }

  // Minutes
  if (absDiffMinutes < 60) {
    const text = absDiffMinutes === 1 ? '1 minute' : `${absDiffMinutes} minutes`;
    return isPast ? `${text} ago` : `in ${text}`;
  }

  // Hours
  const hours = Math.floor(absDiffMinutes / 60);
  if (hours < 24) {
    const text = hours === 1 ? '1 hour' : `${hours} hours`;
    return isPast ? `${text} ago` : `in ${text}`;
  }

  // Days
  const days = Math.floor(hours / 24);
  const text = days === 1 ? '1 day' : `${days} days`;
  return isPast ? `${text} ago` : `in ${text}`;
};
