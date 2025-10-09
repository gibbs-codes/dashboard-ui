/**
 * App Component
 * Root application component for dashboard displays
 */

import React, { useEffect } from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import { useProfile } from '../hooks/useProfile';
import { useWebSocket } from '../hooks/useWebSocket';
import { getDisplayConfig } from '../config/displays';
import TVDisplay from '../displays/TVDisplay';
import ProjectorDisplay from '../displays/ProjectorDisplay';

/**
 * App Component
 * Root component that manages data fetching and display routing
 *
 * @param {Object} props
 * @param {string} props.displayType - Display type: 'tv' or 'projector'
 * @returns {JSX.Element}
 */
export const App = ({ displayType = 'tv' }) => {
  // Get display configuration
  const displayConfig = getDisplayConfig(displayType);

  // Get current profile
  const { currentProfile } = useProfile(displayConfig.defaultProfile, displayType);

  // Fetch dashboard data
  const { data, loading, lastUpdated } = useDashboardData(currentProfile);

  // Connect to WebSocket
  const { connected } = useWebSocket(
    process.env.REACT_APP_WS_URL || 'ws://localhost:3000/ws',
    true // auto-connect
  );

  // Log display initialization
  useEffect(() => {
    console.log(`[App] Initializing ${displayType} display with profile: ${currentProfile}`);
  }, [displayType, currentProfile]);

  // Loading state: show black screen
  if (!data || loading) {
    return <div className="h-screen w-screen bg-black" />;
  }

  // Select display component
  const DisplayComponent = displayType === 'tv' ? TVDisplay : ProjectorDisplay;

  return (
    <DisplayComponent
      profile={currentProfile}
      data={data}
      wsConnected={connected}
      lastUpdated={lastUpdated}
    />
  );
};

export default App;
