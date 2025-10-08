/**
 * Display Configuration
 * Settings specific to TV and Projector displays
 */

/**
 * TV Display Configuration
 * Optimized for 1920x1080 television screens
 */
export const TV_CONFIG = {
  // Display identifier
  id: 'tv',
  name: 'TV Display',
  type: 'tv',

  // Viewport settings
  viewport: {
    mode: 'normal',
    width: 1920,
    height: 1080,
    scale: 1.0,
    orientation: 'landscape',
  },

  // Safe area to prevent overscan issues
  safeArea: {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20,
  },

  // Refresh and polling intervals (in milliseconds)
  intervals: {
    dataRefresh: 30000,      // 30 seconds - main data refresh
    weatherRefresh: 300000,  // 5 minutes - weather updates
    transitRefresh: 60000,   // 1 minute - transit updates
    calendarRefresh: 120000, // 2 minutes - calendar updates
    tasksRefresh: 300000,    // 5 minutes - tasks updates
  },

  // WebSocket configuration
  websocket: {
    enabled: true,
    autoReconnect: true,
    reconnectInterval: 5000,   // 5 seconds
    reconnectAttempts: 10,
    heartbeatInterval: 30000,  // 30 seconds
  },

  // Feature flags
  features: {
    animations: true,
    transitions: true,
    powerSaving: true,
    dimTimeout: 300000,        // 5 minutes - dim screen after inactivity
    autoRefresh: true,
    errorReporting: true,
    debugMode: import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true',
  },

  // Performance settings
  performance: {
    lazyLoading: false,        // Load all data immediately on TV
    prefetchData: true,
    cacheTimeout: 60000,       // 1 minute cache
    maxRetries: 3,
  },

  // UI settings
  ui: {
    theme: 'tv',
    fontScale: 1.0,
    spacing: 'comfortable',
    animations: {
      duration: 300,           // ms
      easing: 'ease-in-out',
    },
    focusVisible: true,        // For remote control navigation
  },

  // Display-specific features
  displayFeatures: {
    remoteControl: true,
    voiceControl: false,
    touchInput: false,
    keyboardInput: false,
  },
};

/**
 * Projector Display Configuration
 * Optimized for wall projection with scaling
 */
export const PROJECTOR_CONFIG = {
  // Display identifier
  id: 'projector',
  name: 'Projector Display',
  type: 'projector',

  // Viewport settings with scaling
  viewport: {
    mode: 'scaled',
    width: 1920,
    height: 1080,
    scale: 0.6,                // Scale to 60% for wall projection
    orientation: 'landscape',
  },

  // Larger safe area for projection
  safeArea: {
    top: 40,
    right: 40,
    bottom: 40,
    left: 40,
  },

  // Refresh and polling intervals (in milliseconds)
  intervals: {
    dataRefresh: 30000,      // 30 seconds - main data refresh
    weatherRefresh: 300000,  // 5 minutes - weather updates
    transitRefresh: 60000,   // 1 minute - transit updates
    calendarRefresh: 120000, // 2 minutes - calendar updates
    tasksRefresh: 300000,    // 5 minutes - tasks updates
  },

  // WebSocket configuration
  websocket: {
    enabled: true,
    autoReconnect: true,
    reconnectInterval: 5000,   // 5 seconds
    reconnectAttempts: 10,
    heartbeatInterval: 30000,  // 30 seconds
  },

  // Feature flags
  features: {
    animations: true,
    transitions: true,
    powerSaving: false,        // Projectors typically stay on
    dimTimeout: 0,             // No dimming on projector
    autoRefresh: true,
    errorReporting: true,
    debugMode: import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true',
  },

  // Performance settings
  performance: {
    lazyLoading: false,        // Load all data immediately
    prefetchData: true,
    cacheTimeout: 60000,       // 1 minute cache
    maxRetries: 3,
  },

  // UI settings
  ui: {
    theme: 'projector',
    fontScale: 1.2,            // Slightly larger for projection
    spacing: 'spacious',
    animations: {
      duration: 500,           // Slower animations for better visibility
      easing: 'ease-in-out',
    },
    focusVisible: false,       // No focus states on projector
  },

  // Display-specific features
  displayFeatures: {
    remoteControl: false,
    voiceControl: false,
    touchInput: false,
    keyboardInput: false,
    highContrast: true,        // Enhanced contrast for projection
    ambientLightCompensation: true,
  },
};

/**
 * Default polling interval (30 seconds)
 * Used as fallback if not specified in display config
 */
export const DEFAULT_POLLING_INTERVAL = 30000;

/**
 * WebSocket retry settings
 * Used across all displays for WebSocket connections
 */
export const WS_RETRY_CONFIG = {
  maxAttempts: 10,
  initialDelay: 1000,        // 1 second
  maxDelay: 30000,           // 30 seconds
  backoffMultiplier: 1.5,
  reconnectOnError: true,
  reconnectOnClose: true,
};

/**
 * Get display configuration by type
 * @param {string} displayType - 'tv' or 'projector'
 * @returns {object} Display configuration object
 */
export const getDisplayConfig = (displayType) => {
  switch (displayType?.toLowerCase()) {
    case 'tv':
      return TV_CONFIG;
    case 'projector':
      return PROJECTOR_CONFIG;
    default:
      console.warn(`Unknown display type: ${displayType}, defaulting to TV`);
      return TV_CONFIG;
  }
};

/**
 * Get refresh interval for a specific data type
 * @param {string} displayType - 'tv' or 'projector'
 * @param {string} dataType - 'weather', 'transit', 'calendar', 'tasks', or 'data'
 * @returns {number} Refresh interval in milliseconds
 */
export const getRefreshInterval = (displayType, dataType = 'data') => {
  const config = getDisplayConfig(displayType);
  const intervalKey = `${dataType}Refresh`;
  return config.intervals[intervalKey] || DEFAULT_POLLING_INTERVAL;
};

/**
 * Check if a feature is enabled for a display type
 * @param {string} displayType - 'tv' or 'projector'
 * @param {string} featureName - Name of the feature to check
 * @returns {boolean} True if feature is enabled
 */
export const isFeatureEnabled = (displayType, featureName) => {
  const config = getDisplayConfig(displayType);
  return config.features[featureName] || false;
};

/**
 * Get WebSocket configuration for a display type
 * @param {string} displayType - 'tv' or 'projector'
 * @returns {object} WebSocket configuration
 */
export const getWebSocketConfig = (displayType) => {
  const config = getDisplayConfig(displayType);
  return {
    ...config.websocket,
    ...WS_RETRY_CONFIG,
  };
};

/**
 * Get viewport scaling for a display type
 * @param {string} displayType - 'tv' or 'projector'
 * @returns {number} Scale factor
 */
export const getViewportScale = (displayType) => {
  const config = getDisplayConfig(displayType);
  return config.viewport.scale;
};

/**
 * Get safe area padding for a display type
 * @param {string} displayType - 'tv' or 'projector'
 * @returns {object} Safe area padding values
 */
export const getSafeArea = (displayType) => {
  const config = getDisplayConfig(displayType);
  return config.safeArea;
};

/**
 * Display mode detection helper
 * Checks URL or environment to determine display mode
 * @returns {string} 'tv' or 'projector'
 */
export const detectDisplayMode = () => {
  const path = window.location.pathname;

  if (path.includes('projector')) {
    return 'projector';
  } else if (path.includes('tv')) {
    return 'tv';
  }

  // Default to TV if cannot detect
  return 'tv';
};
