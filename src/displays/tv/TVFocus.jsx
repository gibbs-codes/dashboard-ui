/**
 * TVFocus Component
 * Minimal distraction display: muted FlowField background with centered next event countdown
 */

import { useState, useEffect, useMemo } from 'react';
import { FlowField } from '../../components/generative/FlowField';

/**
 * Detect low power mode - defaults to TRUE for Pi compatibility
 * Use ?lowPower=false on powerful devices for full quality
 */
const isLowPowerMode = () => {
  if (typeof window === 'undefined') return true;
  const params = new URLSearchParams(window.location.search);
  return params.get('lowPower') !== 'false';
};

/**
 * Calculate countdown string from event start time
 * @param {string} eventStart - ISO date string of event start
 * @returns {string} Countdown text (e.g., "in 2h 15m", "in 30 min", "now")
 */
const getCountdown = (eventStart) => {
  if (!eventStart) return null;

  const diff = new Date(eventStart) - new Date();

  if (diff <= 0) return 'now';

  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);

  if (hours > 0) {
    return `in ${hours}h ${minutes}m`;
  }

  return `in ${minutes} min`;
};

/**
 * TVFocus Component
 * Focus mode: muted generative background with next event countdown
 *
 * @param {Object} props
 * @param {Object} props.data - Dashboard data containing nextEvent
 * @returns {JSX.Element}
 */
export const TVFocus = ({ data = {} }) => {
  const { nextEvent = null } = data;
  const [countdown, setCountdown] = useState(getCountdown(nextEvent?.start || nextEvent?.startTime));
  const lowPower = useMemo(() => isLowPowerMode(), []);

  // Update countdown every minute
  useEffect(() => {
    const updateCountdown = () => {
      const eventStart = nextEvent?.start || nextEvent?.startTime;
      setCountdown(getCountdown(eventStart));
    };

    // Initial update
    updateCountdown();

    // Update every minute
    const interval = setInterval(updateCountdown, 60000);

    return () => clearInterval(interval);
  }, [nextEvent]);

  return (
    <div className="h-screen w-screen relative overflow-hidden">
      {/* Muted FlowField background */}
      <div className="absolute inset-0">
        <FlowField
          width={1920}
          height={1080}
          speed={0.4}
          muted={true}
          lowPower={lowPower}
        />
      </div>

      {/* Centered next event display */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {nextEvent ? (
          <div className="text-center">
            {/* Event title */}
            <h1
              className="text-5xl font-light text-white/90 mb-6 max-w-4xl px-8"
              style={{
                textShadow: '0 4px 20px rgba(0,0,0,0.4)',
              }}
            >
              {nextEvent.title || nextEvent.summary}
            </h1>

            {/* Countdown */}
            {countdown && (
              <p
                className="text-8xl font-extralight text-white/80 tabular-nums"
                style={{
                  textShadow: '0 4px 30px rgba(0,0,0,0.5)',
                }}
              >
                {countdown}
              </p>
            )}
          </div>
        ) : (
          // No event - show "focus" text
          <p
            className="text-6xl font-extralight text-white/50 tracking-widest uppercase"
            style={{
              textShadow: '0 4px 20px rgba(0,0,0,0.3)',
            }}
          >
            focus
          </p>
        )}
      </div>
    </div>
  );
};

export default TVFocus;
