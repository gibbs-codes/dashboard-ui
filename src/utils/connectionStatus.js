/**
 * Connection Status Utilities
 * Helper functions for determining data staleness and connection status
 */

import { Wifi, WifiOff, AlertCircle } from 'lucide-react';

/**
 * Default staleness threshold (1 minute)
 */
export const DEFAULT_STALE_THRESHOLD = 60000;

/**
 * Check if data is stale based on last update time
 * @param {Date|string|number} lastUpdated - Last update timestamp
 * @param {number} threshold - Threshold in milliseconds (default: 60000)
 * @returns {boolean} True if data is stale
 *
 * @example
 * isDataStale(new Date(Date.now() - 30000)) // false (30 seconds ago)
 * isDataStale(new Date(Date.now() - 120000)) // true (2 minutes ago)
 * isDataStale(null, 60000) // true (no data)
 */
export const isDataStale = (lastUpdated, threshold = DEFAULT_STALE_THRESHOLD) => {
  if (!lastUpdated) {
    return true;
  }

  // Convert to timestamp
  let timestamp;
  if (lastUpdated instanceof Date) {
    timestamp = lastUpdated.getTime();
  } else if (typeof lastUpdated === 'string') {
    timestamp = new Date(lastUpdated).getTime();
  } else if (typeof lastUpdated === 'number') {
    timestamp = lastUpdated;
  } else {
    return true;
  }

  // Check if timestamp is valid
  if (isNaN(timestamp)) {
    return true;
  }

  const now = Date.now();
  const age = now - timestamp;

  return age > threshold;
};

/**
 * Get comprehensive connection status
 * @param {boolean} wsConnected - WebSocket connection status
 * @param {Date|string|number} lastUpdated - Last data update timestamp
 * @param {number} staleThreshold - Threshold for stale data in ms (default: 60000)
 * @returns {Object} Connection status object
 *
 * @example
 * getConnectionStatus(true, new Date())
 * // { status: 'live', message: 'Live updates', showIndicator: false }
 *
 * getConnectionStatus(false, new Date(Date.now() - 30000))
 * // { status: 'stale', message: 'Using cached data', showIndicator: true }
 *
 * getConnectionStatus(false, new Date(Date.now() - 120000))
 * // { status: 'disconnected', message: 'Connection lost', showIndicator: true }
 */
export const getConnectionStatus = (
  wsConnected,
  lastUpdated,
  staleThreshold = DEFAULT_STALE_THRESHOLD
) => {
  // WebSocket connected and data is fresh
  if (wsConnected && !isDataStale(lastUpdated, staleThreshold)) {
    return {
      status: 'live',
      message: 'Live updates',
      showIndicator: false,
    };
  }

  // WebSocket connected but data is stale (unusual case)
  if (wsConnected && isDataStale(lastUpdated, staleThreshold)) {
    return {
      status: 'stale',
      message: 'Reconnecting...',
      showIndicator: true,
    };
  }

  // WebSocket disconnected but data is fresh (polling or recent cache)
  if (!wsConnected && !isDataStale(lastUpdated, staleThreshold)) {
    return {
      status: 'stale',
      message: 'Using cached data',
      showIndicator: true,
    };
  }

  // WebSocket disconnected and data is stale
  return {
    status: 'disconnected',
    message: 'Connection lost',
    showIndicator: true,
  };
};

/**
 * Get Tailwind color class for status
 * @param {string} status - Connection status ('live' | 'stale' | 'disconnected')
 * @returns {string} Tailwind color class
 *
 * @example
 * getStatusColor('live') // "text-green-500"
 * getStatusColor('stale') // "text-yellow-500"
 * getStatusColor('disconnected') // "text-red-500"
 */
export const getStatusColor = (status) => {
  const colors = {
    live: 'text-green-500',
    stale: 'text-yellow-500',
    disconnected: 'text-red-500',
  };

  return colors[status] || 'text-gray-500';
};

/**
 * Get background color class for status
 * @param {string} status - Connection status ('live' | 'stale' | 'disconnected')
 * @returns {string} Tailwind background color class
 *
 * @example
 * getStatusBgColor('live') // "bg-green-500"
 */
export const getStatusBgColor = (status) => {
  const colors = {
    live: 'bg-green-500',
    stale: 'bg-yellow-500',
    disconnected: 'bg-red-500',
  };

  return colors[status] || 'bg-gray-500';
};

/**
 * Get lucide-react icon component for status
 * @param {string} status - Connection status ('live' | 'stale' | 'disconnected')
 * @returns {React.Component} Lucide icon component
 *
 * @example
 * const Icon = getStatusIcon('live');
 * return <Icon className="w-4 h-4" />;
 */
export const getStatusIcon = (status) => {
  const icons = {
    live: Wifi,
    stale: WifiOff,
    disconnected: AlertCircle,
  };

  return icons[status] || WifiOff;
};

/**
 * Get icon name as string (useful for dynamic imports)
 * @param {string} status - Connection status ('live' | 'stale' | 'disconnected')
 * @returns {string} Icon name
 *
 * @example
 * getStatusIconName('live') // "Wifi"
 */
export const getStatusIconName = (status) => {
  const iconNames = {
    live: 'Wifi',
    stale: 'WifiOff',
    disconnected: 'AlertCircle',
  };

  return iconNames[status] || 'WifiOff';
};

/**
 * Format time since last update
 * @param {Date|string|number} lastUpdated - Last update timestamp
 * @returns {string} Human-readable time string
 *
 * @example
 * formatTimeSinceUpdate(new Date(Date.now() - 30000)) // "30 seconds ago"
 * formatTimeSinceUpdate(new Date(Date.now() - 120000)) // "2 minutes ago"
 */
export const formatTimeSinceUpdate = (lastUpdated) => {
  if (!lastUpdated) {
    return 'Never';
  }

  let timestamp;
  if (lastUpdated instanceof Date) {
    timestamp = lastUpdated.getTime();
  } else if (typeof lastUpdated === 'string') {
    timestamp = new Date(lastUpdated).getTime();
  } else if (typeof lastUpdated === 'number') {
    timestamp = lastUpdated;
  } else {
    return 'Never';
  }

  if (isNaN(timestamp)) {
    return 'Never';
  }

  const now = Date.now();
  const diffMs = now - timestamp;
  const diffSeconds = Math.floor(diffMs / 1000);

  if (diffSeconds < 5) {
    return 'Just now';
  }

  if (diffSeconds < 60) {
    return `${diffSeconds} seconds ago`;
  }

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) {
    return diffMinutes === 1 ? '1 minute ago' : `${diffMinutes} minutes ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
};

/**
 * Get full status details with all information
 * @param {boolean} wsConnected - WebSocket connection status
 * @param {Date|string|number} lastUpdated - Last data update timestamp
 * @param {number} staleThreshold - Threshold for stale data in ms
 * @returns {Object} Complete status object with all details
 *
 * @example
 * getFullStatus(true, new Date())
 * // {
 * //   status: 'live',
 * //   message: 'Live updates',
 * //   showIndicator: false,
 * //   color: 'text-green-500',
 * //   bgColor: 'bg-green-500',
 * //   icon: Wifi,
 * //   iconName: 'Wifi',
 * //   timeSinceUpdate: 'Just now'
 * // }
 */
export const getFullStatus = (
  wsConnected,
  lastUpdated,
  staleThreshold = DEFAULT_STALE_THRESHOLD
) => {
  const baseStatus = getConnectionStatus(wsConnected, lastUpdated, staleThreshold);

  return {
    ...baseStatus,
    color: getStatusColor(baseStatus.status),
    bgColor: getStatusBgColor(baseStatus.status),
    icon: getStatusIcon(baseStatus.status),
    iconName: getStatusIconName(baseStatus.status),
    timeSinceUpdate: formatTimeSinceUpdate(lastUpdated),
  };
};
