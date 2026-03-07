/**
 * TVLayout Component
 * Main layout wrapper for TV display with profile-based routing
 */

import { TVBackground } from '../components/tv/TVBackground';
import { ConnectionIndicator } from '../components/shared/ConnectionIndicator';
import TVDefault from '../displays/tv/TVDefault';
import TVMorning from '../displays/tv/TVMorning';
import TVFocus from '../displays/tv/TVFocus';
import TVArt from '../displays/tv/TVArt';
import TVRelax from '../displays/tv/TVRelax';

/**
 * Component mapping
 * Maps profile IDs to display components
 */
const DISPLAY_MAP = {
  default: TVArt,
  morning: TVMorning,
  focus: TVFocus,
  work: TVArt,
  relax: TVRelax,
  gallery: TVRelax,
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
