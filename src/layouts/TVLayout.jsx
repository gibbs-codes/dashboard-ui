/**
 * TVLayout Component
 * Main layout wrapper for TV display with profile-based routing
 */

import React from 'react';
import { TVBackground } from '../components/tv/TVBackground';
import { ConnectionIndicator } from '../components/shared/ConnectionIndicator';
import TVDefault from '../displays/tv/TVDefault';
import TVMorning from '../displays/tv/TVMorning';
import TVFocus from '../displays/tv/TVFocus';
import TVArt from '../displays/tv/TVArt';
import { Clock } from '../components/shared/Clock';
import { DateDisplay } from '../components/shared/DateDisplay';

/**
 * RelaxDisplay Component
 * Minimal display for relax mode - just gradient with clock
 */
const RelaxDisplay = () => {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center text-white">
      <Clock
        format="12h"
        showSeconds={true}
        className="text-8xl font-bold mb-6 text-shadow-lg"
      />
      <DateDisplay
        format="full"
        className="text-3xl text-white/90 text-shadow"
      />
    </div>
  );
};

/**
 * Component mapping
 * Maps profile IDs to display components
 */
const DISPLAY_MAP = {
  default: TVArt,
  morning: TVMorning,
  focus: TVFocus,
  work: TVDefault,
  relax: RelaxDisplay,
  art: TVArt,
};

/**
 * TVLayout Component
 * Main layout wrapper for TV display
 *
 * @param {Object} props
 * @param {string} props.profile - Profile ID
 * @param {Object} props.data - Dashboard data
 * @param {boolean} props.wsConnected - WebSocket connection status
 * @param {Date|null} props.lastUpdated - Last data update timestamp
 * @returns {JSX.Element}
 */
export const TVLayout = ({
  profile = 'default',
  data = {},
  wsConnected = false,
  lastUpdated = null,
}) => {
  // Get display component for profile
  const DisplayComponent = DISPLAY_MAP[profile] || TVDefault;

  return (
    <div className="h-screen w-screen overflow-hidden text-white relative">
      {/* Time-based gradient background */}
      <TVBackground />

      {/* Display component */}
      <div className="relative z-0">
        <DisplayComponent data={data} />
      </div>

      {/* Connection indicator (bottom-right) */}
      <ConnectionIndicator
        wsConnected={wsConnected}
        lastUpdated={lastUpdated}
      />
    </div>
  );
};

export default TVLayout;
