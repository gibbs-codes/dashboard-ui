/**
 * ProjectorLayout Component - Fixed Canvas System
 * Three immovable positioned canvases matching original ProjectorUI repo
 */

import React from 'react';
import { PROFILES } from '../config/profiles';
import { ConnectionIndicator } from '../components/shared/ConnectionIndicator';
import { TransitCanvas } from '../components/projector/TransitCanvas';
import { ClockWeatherCanvas } from '../components/projector/ClockWeatherCanvas';
import { ArtCanvas } from '../components/projector/ArtCanvas';
import { CalendarTimelineCanvas } from '../components/projector/CalendarTimelineCanvas';
import { FloatingClock } from '../components/projector/FloatingClock';
import { FloatingWeather } from '../components/projector/FloatingWeather';
import { FloatingArtworkInfo } from '../components/projector/FloatingArtworkInfo';
import { CanvasDebugOverlay } from '../components/debug/CanvasDebugOverlay';
import { CanvasPositionAdjuster } from '../components/debug/CanvasPositionAdjuster';

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
 * Get component props based on component name, data, and position
 */
const getComponentProps = (componentName, data, position) => {
  switch (componentName) {
    case 'Transit':
      return { data: data?.transit || null };
    case 'ClockWeather':
      return { weatherData: data?.weather || null };
    case 'CalendarTimeline':
      return { events: data?.events || [] };
    case 'ArtCanvas':
      // Determine which artwork based on canvas position
      const artworkData = position === 'center'
        ? data?.artworkCenter
        : data?.artworkRight;
      return { artwork: artworkData || null };
    default:
      return {};
  }
};

/**
 * Canvas Component
 * Renders a single fixed-position canvas with dynamic content
 */
const Canvas = ({ componentName, data, position, style, className = '' }) => {
  const Component = COMPONENT_MAP[componentName];

  if (!Component) {
    return (
      <div
        className={`projector-canvas ${className}`}
        style={style}
      >
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-600 text-lg">
            Unknown component: {componentName}
          </p>
        </div>
      </div>
    );
  }

  const props = getComponentProps(componentName, data, position);

  return (
    <div
      className={`projector-canvas ${className}`}
      style={style}
      data-canvas={position}
    >
      <Component {...props} />
    </div>
  );
};

/**
 * ProjectorLayout Component
 * Three fixed-position canvases matching original ProjectorUI dimensions
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

  // Extract canvas components
  const leftComponent = projector?.left || 'Transit';
  const centerComponent = projector?.center || 'ClockWeather';
  const rightComponent = projector?.right || 'ArtCanvas';

  // Original ProjectorUI canvas positions (pixel-perfect)
const canvasPositions = {
  left: {
    position: 'fixed',
    left: '0px',
    top: '74px',
    width: '415px',
    height: '1030px',
  },
  center: {
    position: 'fixed',
    left: '583px',
    top: '235px',
    width: '540px',
    height: '803px',
  },
  right: {
    position: 'fixed',
    right: '41px',
    top: '61px',
    width: '814px',
    height: '540px',
  },
};

  return (
    <div className="projector-viewport w-screen h-screen bg-black text-white overflow-hidden">
      {/* Left Canvas - Transit */}
      <Canvas
        componentName={leftComponent}
        data={data}
        position="left"
        style={canvasPositions.left}
        className="projector-canvas-left"
      />

      {/* Center Canvas - Clock/Weather */}
      <Canvas
        componentName={centerComponent}
        data={data}
        position="center"
        style={canvasPositions.center}
        className="projector-canvas-center"
      />

      {/* Right Canvas - Art/Calendar */}
      <Canvas
        componentName={rightComponent}
        data={data}
        position="right"
        style={canvasPositions.right}
        className="projector-canvas-right"
      />

      {/* Floating Clock (top-center) */}
      <FloatingClock />

      {/* Floating Weather (below right canvas) */}
      <FloatingWeather weatherData={data?.weather} />

      {/* Artwork Info - Below Center Canvas */}
      {centerComponent === 'ArtCanvas' && (
        <FloatingArtworkInfo
          artwork={data?.artworkCenter}
          style={{
            left: '583px',
            top: '1028px', 
            width: '540px',
          }}
        />
      )}

      {/* Artwork Info - Below Right Canvas */}
      {rightComponent === 'ArtCanvas' && (
        <FloatingArtworkInfo
          artwork={data?.artworkRight}
          style={{
            right: '41px',
            top: '601px', // 61px (right top) + 540px (right height) + 20px gap
            width: '814px',
          }}
        />
      )}

      {/* Connection indicator (bottom-right) */}
      <ConnectionIndicator
        wsConnected={wsConnected}
        lastUpdated={lastUpdated}
      />
    </div>
  );
};

export default ProjectorLayout;