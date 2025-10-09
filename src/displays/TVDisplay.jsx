/**
 * TVDisplay Component
 * Profile-based rendering wrapper for TV display
 */

import React from 'react';
import TVLayout from '../layouts/TVLayout';

/**
 * TVDisplay Component
 * Thin wrapper for TVLayout with loading state handling
 *
 * @param {Object} props
 * @param {string} props.profile - Profile ID
 * @param {Object} props.data - Dashboard data
 * @param {boolean} props.wsConnected - WebSocket connection status
 * @param {Date|null} props.lastUpdated - Last data update timestamp
 * @returns {JSX.Element}
 */
export const TVDisplay = ({
  profile = 'default',
  data = null,
  wsConnected = false,
  lastUpdated = null,
}) => {
  // Loading state: show black screen
  if (!data) {
    return <div className="h-screen w-screen bg-black" />;
  }

  // Render layout with all props
  return (
    <TVLayout
      profile={profile}
      data={data}
      wsConnected={wsConnected}
      lastUpdated={lastUpdated}
    />
  );
};

export default TVDisplay;
