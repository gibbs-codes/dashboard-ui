/**
 * Display Configuration
 * Settings specific to TV and Projector displays
 */

/**
 * TV Display Configuration
 * Optimized for 1920x1080 television screens
 */
export const TV_CONFIG = {
  name: 'TV Display',
  viewport: 'normal',
  defaultProfile: 'morning',
  refreshInterval: 30000,
  features: {
    generativeArt: true,
    timeBasedGradients: true,
    animations: true,
  },
  dimensions: {
    width: 1920,
    height: 1080,
  },
};

/**
 * Projector Display Configuration
 * Optimized for wall projection with 3-column layout
 */
export const PROJECTOR_CONFIG = {
  name: 'Projector Display',
  viewport: 'scaled-0.6',
  defaultProfile: 'default',
  refreshInterval: 30000,
  features: {
    highContrast: true,
    largeFonts: true,
    animations: false,
  },
  dimensions: {
    width: 1920,
    height: 1080,
  },
  columns: {
    left: { width: '30%' },
    center: { width: '40%' },
    right: { width: '30%' },
  },
};

/**
 * Polling and Connection Constants
 */
export const DEFAULT_POLLING_INTERVAL = 30000; // 30 seconds
export const WS_RECONNECT_INTERVAL = 5000; // 5 seconds
export const WS_RECONNECT_MAX_ATTEMPTS = Infinity; // Always reconnect
export const STALE_DATA_THRESHOLD = 60000; // 1 minute

/**
 * Time of Day Configuration
 * Used for time-based gradients on TV display
 */
export const TIME_OF_DAY = {
  morning: {
    start: 6,
    end: 12,
    gradient: ['#1e3a8a', '#f59e0b'], // Deep blue to amber
  },
  afternoon: {
    start: 12,
    end: 18,
    gradient: ['#f59e0b', '#ec4899'], // Amber to pink
  },
  evening: {
    start: 18,
    end: 22,
    gradient: ['#ec4899', '#7c3aed'], // Pink to purple
  },
  night: {
    start: 22,
    end: 6,
    gradient: ['#1e1b4b', '#000000'], // Dark indigo to black
  },
};

/**
 * Get display configuration by type
 * @param {string} displayType - 'tv' or 'projector'
 * @returns {Object} Display configuration object
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
 * Get current time of day period
 * @param {Date} [date] - Optional date object (defaults to now)
 * @returns {string} Time period: 'morning', 'afternoon', 'evening', or 'night'
 */
export const getTimeOfDay = (date = new Date()) => {
  const hour = date.getHours();

  if (hour >= TIME_OF_DAY.morning.start && hour < TIME_OF_DAY.morning.end) {
    return 'morning';
  }

  if (hour >= TIME_OF_DAY.afternoon.start && hour < TIME_OF_DAY.afternoon.end) {
    return 'afternoon';
  }

  if (hour >= TIME_OF_DAY.evening.start && hour < TIME_OF_DAY.evening.end) {
    return 'evening';
  }

  return 'night';
};

/**
 * Get gradient colors for current time
 * @param {Date} [date] - Optional date object (defaults to now)
 * @returns {Array<string>} Array of gradient color hex codes
 */
export const getGradientForTime = (date = new Date()) => {
  const period = getTimeOfDay(date);
  return TIME_OF_DAY[period].gradient;
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
 * Get refresh interval for a display type
 * @param {string} displayType - 'tv' or 'projector'
 * @returns {number} Refresh interval in milliseconds
 */
export const getRefreshInterval = (displayType) => {
  const config = getDisplayConfig(displayType);
  return config.refreshInterval || DEFAULT_POLLING_INTERVAL;
};

/**
 * Get default profile for a display type
 * @param {string} displayType - 'tv' or 'projector'
 * @returns {string} Default profile ID
 */
export const getDefaultProfile = (displayType) => {
  const config = getDisplayConfig(displayType);
  return config.defaultProfile || 'default';
};

/**
 * Get viewport setting for a display type
 * @param {string} displayType - 'tv' or 'projector'
 * @returns {string} Viewport setting
 */
export const getViewport = (displayType) => {
  const config = getDisplayConfig(displayType);
  return config.viewport || 'normal';
};

/**
 * Get column configuration for projector
 * @returns {Object|null} Column configuration or null if not projector
 */
export const getProjectorColumns = () => {
  return PROJECTOR_CONFIG.columns;
};

/**
 * Detect display type from URL or environment
 * @returns {string} 'tv' or 'projector'
 */
export const detectDisplayType = () => {
  // Check URL path
  const path = window.location.pathname;

  if (path.includes('/projector') || path.includes('projector.html')) {
    return 'projector';
  }

  if (path.includes('/tv') || path.includes('tv.html')) {
    return 'tv';
  }

  // Default to TV
  return 'tv';
};

/**
 * Check if data is stale
 * @param {Date|string|number} lastUpdate - Last update timestamp
 * @returns {boolean} True if data is stale
 */
export const isDataStale = (lastUpdate) => {
  if (!lastUpdate) return true;

  const timestamp = lastUpdate instanceof Date
    ? lastUpdate.getTime()
    : new Date(lastUpdate).getTime();

  const now = Date.now();
  const age = now - timestamp;

  return age > STALE_DATA_THRESHOLD;
};

/**
 * Get Tailwind gradient classes for current time
 * @param {Date} [date] - Optional date object (defaults to now)
 * @returns {string} Tailwind gradient classes
 */
export const getTailwindGradientForTime = (date = new Date()) => {
  const period = getTimeOfDay(date);

  const gradientClasses = {
    morning: 'from-blue-900 to-amber-500',
    afternoon: 'from-amber-500 to-pink-500',
    evening: 'from-pink-500 to-purple-600',
    night: 'from-indigo-950 to-black',
  };

  return gradientClasses[period];
};
