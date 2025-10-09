/**
 * ConnectionIndicator Component
 * Shows connection status indicator in bottom-right corner
 */

import React from 'react';
import {
  getConnectionStatus,
  getStatusIcon,
  getStatusColor,
  formatTimeSinceUpdate
} from '../../utils/connectionStatus.js';

/**
 * ConnectionIndicator
 * Displays a small status indicator when connection is degraded
 *
 * @param {Object} props
 * @param {boolean} props.wsConnected - WebSocket connection status
 * @param {Date|null} props.lastUpdated - Last data update timestamp
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element|null}
 *
 * @example
 * <ConnectionIndicator wsConnected={connected} lastUpdated={lastUpdate} />
 */
export const ConnectionIndicator = ({
  wsConnected,
  lastUpdated,
  className = ''
}) => {
  const status = getConnectionStatus(wsConnected, lastUpdated);

  // Only show when status is not 'live'
  if (!status.showIndicator) {
    return null;
  }

  const Icon = getStatusIcon(status.status);
  const colorClass = getStatusColor(status.status);
  const timeSince = formatTimeSinceUpdate(lastUpdated);

  // Tooltip message
  const tooltipMessage = `${status.message} - Last update: ${timeSince}`;

  // Get background color based on status
  const getBgColor = () => {
    switch (status.status) {
      case 'stale':
        return 'bg-yellow-500/20 border-yellow-500/50';
      case 'disconnected':
        return 'bg-red-500/20 border-red-500/50';
      default:
        return 'bg-gray-500/20 border-gray-500/50';
    }
  };

  return (
    <div
      className={`
        fixed bottom-4 right-4
        w-10 h-10
        flex items-center justify-center
        rounded-full
        border-2
        ${getBgColor()}
        backdrop-blur-sm
        transition-all duration-300
        hover:scale-110
        z-50
        cursor-help
        animate-in fade-in duration-300
        ${className}
      `}
      title={tooltipMessage}
      role="status"
      aria-label={tooltipMessage}
    >
      <Icon
        className={`w-5 h-5 ${colorClass} ${
          status.status === 'disconnected' ? 'animate-pulse' : ''
        }`}
        strokeWidth={2}
      />
    </div>
  );
};

/**
 * ConnectionIndicatorDetailed
 * Detailed version with text - for headers or sidebars
 */
export const ConnectionIndicatorDetailed = ({
  wsConnected,
  lastUpdated,
  className = ''
}) => {
  const status = getConnectionStatus(wsConnected, lastUpdated);

  if (!status.showIndicator) {
    return null;
  }

  const Icon = getStatusIcon(status.status);
  const colorClass = getStatusColor(status.status);
  const timeSince = formatTimeSinceUpdate(lastUpdated);

  const getBgColor = () => {
    switch (status.status) {
      case 'stale':
        return 'bg-yellow-500/10 border-yellow-500/30';
      case 'disconnected':
        return 'bg-red-500/10 border-red-500/30';
      default:
        return 'bg-gray-500/10 border-gray-500/30';
    }
  };

  return (
    <div
      className={`
        flex items-center gap-2
        px-3 py-2
        rounded-lg
        border
        ${getBgColor()}
        backdrop-blur-sm
        transition-all duration-300
        animate-in fade-in duration-300
        ${className}
      `}
      role="status"
      aria-live="polite"
    >
      <Icon
        className={`w-4 h-4 ${colorClass} flex-shrink-0 ${
          status.status === 'disconnected' ? 'animate-pulse' : ''
        }`}
        strokeWidth={2}
      />
      <div className="flex flex-col min-w-0">
        <span className={`text-sm font-medium ${colorClass}`}>
          {status.message}
        </span>
        <span className="text-xs text-gray-500 truncate">
          {timeSince}
        </span>
      </div>
    </div>
  );
};

export default ConnectionIndicator;
