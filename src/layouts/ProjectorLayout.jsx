/**
 * ProjectorLayout Component
 * Main layout wrapper for projector display with 3-column grid
 */

import React from 'react';
import { PROFILES } from '../config/profiles';
import { ConnectionIndicator } from '../components/shared/ConnectionIndicator';
import { TransitCanvas } from '../components/projector/TransitCanvas';
import { ClockWeatherCanvas } from '../components/projector/ClockWeatherCanvas';
import { ArtCanvas } from '../components/projector/ArtCanvas';
import { CalendarTimelineCanvas } from '../components/projector/CalendarTimelineCanvas';

/**
 * Component mapping
 * Maps string names from profile config to actual components
 */
const COMPONENT_MAP = {
  Transit: TransitCanvas,
  ClockWeather: ClockWeatherCanvas,
  ArtCanvas: ArtCanvas,
  CalendarTimeline: CalendarTimelineCanvas,
};

/**
 * Get component props based on component name and data
 * @param {string} componentName - Name of component
 * @param {Object} data - Dashboard data
 * @returns {Object} Props for component
 */
const getComponentProps = (componentName, data) => {
  switch (componentName) {
    case 'Transit':
      return { data: data?.transit || null };
    case 'ClockWeather':
      return { weatherData: data?.weather || null };
    case 'CalendarTimeline':
      return { events: data?.events || [] };
    case 'ArtCanvas':
      return {}; // No data needed
    default:
      return {};
  }
};

/**
 * Column Component
 * Renders a single column with dynamic component
 */
const Column = ({ componentName, data, position }) => {
  const Component = COMPONENT_MAP[componentName];

  if (!Component) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-600 text-lg">
          Unknown component: {componentName}
        </p>
      </div>
    );
  }

  const props = getComponentProps(componentName, data);

  return (
    <div
      className={`
        h-full
        ${position === 'center' ? 'border-x border-gray-800' : ''}
      `}
    >
      <Component {...props} />
    </div>
  );
};

/**
 * ProjectorLayout Component
 * Main layout wrapper for projector display
 *
 * @param {Object} props
 * @param {string} props.profile - Profile ID
 * @param {Object} props.data - Dashboard data
 * @param {boolean} props.wsConnected - WebSocket connection status
 * @param {Date|null} props.lastUpdated - Last data update timestamp
 * @returns {JSX.Element}
 */
export const ProjectorLayout = ({
  profile = 'default',
  data = {},
  wsConnected = false,
  lastUpdated = null,
}) => {
  // Get profile configuration
  const profileConfig = PROFILES[profile] || PROFILES.default;
  const { projector } = profileConfig.displays;

  // Extract column components
  const leftComponent = projector?.left || 'Transit';
  const centerComponent = projector?.center || 'ClockWeather';
  const rightComponent = projector?.right || 'ArtCanvas';

  return (
    <div
      className="
        projector-viewport
        w-screen
        h-screen
        bg-black
        text-white
        overflow-hidden
      "
    >
      {/* 3-column grid layout */}
      <div
        className="
          grid
          grid-cols-[30%_40%_30%]
          h-full
          w-full
        "
      >
        {/* Left column (30%) */}
        <Column
          componentName={leftComponent}
          data={data}
          position="left"
        />

        {/* Center column (40%) */}
        <Column
          componentName={centerComponent}
          data={data}
          position="center"
        />

        {/* Right column (30%) */}
        <Column
          componentName={rightComponent}
          data={data}
          position="right"
        />
      </div>

      {/* Connection indicator (bottom-right) */}
      <ConnectionIndicator
        wsConnected={wsConnected}
        lastUpdated={lastUpdated}
      />
    </div>
  );
};

export default ProjectorLayout;
