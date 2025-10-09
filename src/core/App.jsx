/**
 * App Component
 * Root application component for dashboard displays
 */

import React, { useEffect, useState } from 'react';
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
  const [forceRender, setForceRender] = useState(false);

  // Get display configuration
  const displayConfig = getDisplayConfig(displayType);

  // Get current profile
  const { currentProfile, isLoading: profileLoading } = useProfile(displayConfig.defaultProfile, displayType);

  // Fetch dashboard data
  const { data, loading: dataLoading, lastUpdated } = useDashboardData(currentProfile);

  // Connect to WebSocket
  const { connected } = useWebSocket(
    import.meta.env.VITE_WS_URL || 'ws://localhost:3001',
    true // auto-connect
  );

  // Timeout fallback: force render after 5 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!data && (dataLoading || profileLoading)) {
        console.log('[App] TIMEOUT: Forcing render. Data:', !!data, 'Loading:', dataLoading, profileLoading);
        setForceRender(true);
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [data, dataLoading, profileLoading]);

  // Show loading only if both conditions are true:
  // 1. No data available yet
  // 2. Either profile or data is still loading
  // 3. Haven't hit the timeout fallback
  const shouldShowLoading = !data && (dataLoading || profileLoading) && !forceRender;

  if (shouldShowLoading) {
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
