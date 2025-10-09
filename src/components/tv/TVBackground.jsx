/**
 * TVBackground Component
 * Time-based gradient background for TV display
 */

import React, { useState, useEffect } from 'react';
import { getTimeOfDay, getGradientForTime } from '../../config/displays';

/**
 * Calculate transition opacity between time periods
 * @param {Date} date - Current date/time
 * @returns {Object} { current: string, next: string|null, opacity: number }
 */
const getTransitionState = (date) => {
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const totalMinutes = hour * 60 + minutes;

  // Time period boundaries (in minutes from midnight)
  const boundaries = [
    { time: 6 * 60, from: 'night', to: 'morning' },       // 6 AM
    { time: 12 * 60, from: 'morning', to: 'afternoon' },  // 12 PM
    { time: 18 * 60, from: 'afternoon', to: 'evening' },  // 6 PM
    { time: 22 * 60, from: 'evening', to: 'night' },      // 10 PM
  ];

  const TRANSITION_WINDOW = 30; // 30 minutes

  // Check if we're near any boundary
  for (const boundary of boundaries) {
    const diff = totalMinutes - boundary.time;

    // Within 30 minutes before boundary
    if (diff >= -TRANSITION_WINDOW && diff < 0) {
      const opacity = (TRANSITION_WINDOW + diff) / TRANSITION_WINDOW;
      return {
        current: boundary.from,
        next: boundary.to,
        opacity: opacity, // 0 (far) to 1 (close)
      };
    }

    // Within 30 minutes after boundary
    if (diff >= 0 && diff < TRANSITION_WINDOW) {
      const opacity = diff / TRANSITION_WINDOW;
      return {
        current: boundary.from,
        next: boundary.to,
        opacity: opacity, // 0 (just passed) to 1 (30 min later)
      };
    }
  }

  // Special case: night to morning transition (crosses midnight)
  // Check if we're between 11:30 PM and midnight
  if (totalMinutes >= 23 * 60 + 30) {
    const diff = totalMinutes - (23 * 60 + 30);
    const opacity = diff / TRANSITION_WINDOW;
    return {
      current: 'evening',
      next: 'night',
      opacity: opacity,
    };
  }

  // Check if we're between midnight and 6 AM (but not in morning transition)
  if (totalMinutes < 6 * 60 - TRANSITION_WINDOW) {
    return {
      current: 'night',
      next: null,
      opacity: 0,
    };
  }

  // No transition, use current period
  const currentPeriod = getTimeOfDay(date);
  return {
    current: currentPeriod,
    next: null,
    opacity: 0,
  };
};

/**
 * Convert hex color to RGB
 * @param {string} hex - Hex color code (e.g., '#1e3a8a')
 * @returns {Object} { r, g, b }
 */
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : { r: 0, g: 0, b: 0 };
};

/**
 * Interpolate between two colors
 * @param {string} color1 - Start color (hex)
 * @param {string} color2 - End color (hex)
 * @param {number} factor - Blend factor (0-1)
 * @returns {string} Interpolated color (hex)
 */
const interpolateColor = (color1, color2, factor) => {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);

  const r = Math.round(c1.r + (c2.r - c1.r) * factor);
  const g = Math.round(c1.g + (c2.g - c1.g) * factor);
  const b = Math.round(c1.b + (c2.b - c1.b) * factor);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

/**
 * Get gradient colors with transition blending
 * @param {Object} transitionState - Transition state object
 * @returns {Array<string>} [startColor, endColor]
 */
const getBlendedGradient = (transitionState) => {
  const { current, next, opacity } = transitionState;

  const currentGradient = getGradientForTime(new Date());

  // No transition
  if (!next || opacity === 0) {
    return currentGradient;
  }

  // Get next gradient (manually based on period)
  const TIME_OF_DAY = {
    morning: { gradient: ['#1e3a8a', '#f59e0b'] },
    afternoon: { gradient: ['#f59e0b', '#ec4899'] },
    evening: { gradient: ['#ec4899', '#7c3aed'] },
    night: { gradient: ['#1e1b4b', '#000000'] },
  };

  const nextGradient = TIME_OF_DAY[next].gradient;

  // Interpolate between gradients
  const startColor = interpolateColor(currentGradient[0], nextGradient[0], opacity);
  const endColor = interpolateColor(currentGradient[1], nextGradient[1], opacity);

  return [startColor, endColor];
};

/**
 * TVBackground Component
 * Renders time-based gradient background with smooth transitions
 *
 * @param {Object} props
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element}
 */
export const TVBackground = ({ className = '' }) => {
  const [gradientColors, setGradientColors] = useState(() => {
    const transitionState = getTransitionState(new Date());
    return getBlendedGradient(transitionState);
  });

  useEffect(() => {
    // Update gradient colors
    const updateGradient = () => {
      const transitionState = getTransitionState(new Date());
      const colors = getBlendedGradient(transitionState);
      setGradientColors(colors);
    };

    // Update every 5 minutes
    const interval = setInterval(updateGradient, 5 * 60 * 1000);

    // Initial update
    updateGradient();

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`
        fixed
        inset-0
        -z-10
        transition-colors
        duration-1000
        ease-in-out
        ${className}
      `}
      style={{
        background: `linear-gradient(to bottom right, ${gradientColors[0]}, ${gradientColors[1]})`,
      }}
      role="presentation"
      aria-hidden="true"
    />
  );
};

export default TVBackground;
