/**
 * ProjectorDisplay Component
 * Profile-based rendering wrapper for projector display
 */

import React from 'react';
import ProjectorLayout from '../layouts/ProjectorLayout';

/**
 * ProjectorDisplay Component
 * Thin wrapper for ProjectorLayout with loading state handling
 *
 * @param {Object} props
 * @param {string} props.profile - Profile ID
 * @param {Object} props.data - Dashboard data
 * @param {boolean} props.wsConnected - WebSocket connection status
 * @param {Date|null} props.lastUpdated - Last data update timestamp
 * @returns {JSX.Element}
 */
export const ProjectorDisplay = ({
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
    <ProjectorLayout
      profile={profile}
      data={data}
      wsConnected={wsConnected}
      lastUpdated={lastUpdated}
    />
  );
};

export default ProjectorDisplay;
