/**
 * TVLayout Component
 * Main layout wrapper for TV display with profile-based routing
 *
 * The profile configuration comes from the API (via props) as the source of truth.
 * This component just maps the config to the appropriate display components.
 */

import React from 'react';
import { getProfile as getLocalProfile } from '../config/profiles';
import { TVBackground } from '../components/tv/TVBackground';
import { ConnectionIndicator } from '../components/shared/ConnectionIndicator';
import TVDefault from '../displays/tv/TVDefault';
import TVMorning from '../displays/tv/TVMorning';
import TVFocus from '../displays/tv/TVFocus';
import TVArt from '../displays/tv/TVArt';
import TVRelax from '../displays/tv/TVRelax';

/**
 * Component mapping
 * Maps display.tv values from profiles to actual components
 */
const DISPLAY_MAP = {
  TVDefault: TVDefault,
  TVMorning: TVMorning,
  TVFocus: TVFocus,
  TVArt: TVArt,
  TVRelax: TVRelax,
};

/**
 * TVLayout Component
 * Main layout wrapper for TV display
 *
 * @param {Object} props
 * @param {string} props.profile - Profile ID
 * @param {Object} props.profileConfig - Profile configuration from API (source of truth)
 * @param {Object} props.data - Dashboard data
 * @param {boolean} props.wsConnected - WebSocket connection status
 * @param {Date|null} props.lastUpdated - Last data update timestamp
 * @returns {JSX.Element}
 */
export const TVLayout = ({
  profile = 'default',
  profileConfig = null,
  data = {},
  wsConnected = false,
  lastUpdated = null,
}) => {
  // Log profile changes for debugging
  React.useEffect(() => {
    console.log(`[TVLayout] Rendering with profile: ${profile}`);
  }, [profile]);

  // Use provided config (from API), fall back to local config
  const config = profileConfig || getLocalProfile(profile);
  const tvDisplayType = config?.displays?.tv || 'TVArt';

  console.log(`[TVLayout] Profile "${profile}" using TV display: ${tvDisplayType}`);

  // Get display component for the TV display type
  const DisplayComponent = DISPLAY_MAP[tvDisplayType] || TVDefault;

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

      {/* Profile indicator (bottom-left) - for debugging */}
      <div
        style={{
          position: 'fixed',
          bottom: '10px',
          left: '10px',
          padding: '4px 8px',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: '#888',
          fontSize: '12px',
          borderRadius: '4px',
          fontFamily: 'monospace',
          zIndex: 9999,
        }}
      >
        Profile: {profile} | TV: {tvDisplayType}
      </div>
    </div>
  );
};

export default TVLayout;
