import React from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import { useProfile } from '../hooks/useProfile';
import TVDisplay from '../displays/TVDisplay';
import ProjectorDisplay from '../displays/ProjectorDisplay';

export const App = ({ displayType = 'tv' }) => {
  const { currentProfile, profileConfig, setProfile } = useProfile('default', displayType);
  const { data } = useDashboardData(currentProfile);

  const DisplayComponent = displayType === 'tv' ? TVDisplay : ProjectorDisplay;

  return (
    <DisplayComponent
      profile={currentProfile}
      profileConfig={profileConfig}
      onProfileChange={setProfile}
      data={data}
      wsConnected={true}
      lastUpdated={new Date()}
    />
  );
};

export default App;