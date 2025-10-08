/**
 * Profile Configuration
 * Defines different dashboard profiles and display configurations
 */

/**
 * Available data modules
 */
export const DATA_MODULES = {
  WEATHER: 'weather',
  TRANSIT: 'transit',
  CALENDAR: 'calendar',
  TASKS: 'tasks',
  STATS: 'stats',
  NEXT_EVENT: 'nextEvent',
};

/**
 * Profile Definitions
 * Each profile specifies which data modules are visible and their settings
 */
export const PROFILES = {
  /**
   * Default Profile
   * Basic information: weather and transit only
   */
  default: {
    id: 'default',
    name: 'Default',
    description: 'Weather and transit information only',
    modules: {
      [DATA_MODULES.WEATHER]: {
        enabled: true,
        priority: 1,
      },
      [DATA_MODULES.TRANSIT]: {
        enabled: true,
        priority: 2,
      },
      [DATA_MODULES.CALENDAR]: {
        enabled: false,
      },
      [DATA_MODULES.TASKS]: {
        enabled: false,
      },
      [DATA_MODULES.STATS]: {
        enabled: false,
      },
      [DATA_MODULES.NEXT_EVENT]: {
        enabled: false,
      },
    },
    layout: 'simple',
    refreshInterval: 30000, // 30 seconds
  },

  /**
   * Personal Profile
   * All data visible - full dashboard experience
   */
  personal: {
    id: 'personal',
    name: 'Personal',
    description: 'All data visible - full dashboard',
    modules: {
      [DATA_MODULES.WEATHER]: {
        enabled: true,
        priority: 1,
      },
      [DATA_MODULES.TRANSIT]: {
        enabled: true,
        priority: 2,
      },
      [DATA_MODULES.CALENDAR]: {
        enabled: true,
        priority: 3,
      },
      [DATA_MODULES.TASKS]: {
        enabled: true,
        priority: 4,
      },
      [DATA_MODULES.STATS]: {
        enabled: true,
        priority: 5,
      },
      [DATA_MODULES.NEXT_EVENT]: {
        enabled: true,
        priority: 6,
      },
    },
    layout: 'grid',
    refreshInterval: 30000, // 30 seconds
  },

  /**
   * Guest Profile
   * Public information only - safe for visitors
   */
  guest: {
    id: 'guest',
    name: 'Guest',
    description: 'Public information only (weather, transit)',
    modules: {
      [DATA_MODULES.WEATHER]: {
        enabled: true,
        priority: 1,
      },
      [DATA_MODULES.TRANSIT]: {
        enabled: true,
        priority: 2,
      },
      [DATA_MODULES.CALENDAR]: {
        enabled: false,
      },
      [DATA_MODULES.TASKS]: {
        enabled: false,
      },
      [DATA_MODULES.STATS]: {
        enabled: false,
      },
      [DATA_MODULES.NEXT_EVENT]: {
        enabled: false,
      },
    },
    layout: 'simple',
    refreshInterval: 60000, // 60 seconds (less frequent for guests)
  },

  /**
   * Morning Profile
   * Briefing mode with stats and key information
   */
  morning: {
    id: 'morning',
    name: 'Morning Briefing',
    description: 'Daily briefing with stats and key information',
    modules: {
      [DATA_MODULES.WEATHER]: {
        enabled: true,
        priority: 1,
      },
      [DATA_MODULES.TRANSIT]: {
        enabled: true,
        priority: 2,
      },
      [DATA_MODULES.CALENDAR]: {
        enabled: true,
        priority: 3,
      },
      [DATA_MODULES.TASKS]: {
        enabled: false,
      },
      [DATA_MODULES.STATS]: {
        enabled: true,
        priority: 4,
      },
      [DATA_MODULES.NEXT_EVENT]: {
        enabled: true,
        priority: 5,
      },
    },
    layout: 'briefing',
    refreshInterval: 30000, // 30 seconds
  },

  /**
   * Work Profile
   * Focus on calendar, tasks, and next event
   */
  work: {
    id: 'work',
    name: 'Work Mode',
    description: 'Calendar, tasks, and next event focus',
    modules: {
      [DATA_MODULES.WEATHER]: {
        enabled: false,
      },
      [DATA_MODULES.TRANSIT]: {
        enabled: false,
      },
      [DATA_MODULES.CALENDAR]: {
        enabled: true,
        priority: 1,
      },
      [DATA_MODULES.TASKS]: {
        enabled: true,
        priority: 2,
      },
      [DATA_MODULES.STATS]: {
        enabled: false,
      },
      [DATA_MODULES.NEXT_EVENT]: {
        enabled: true,
        priority: 3,
      },
    },
    layout: 'work',
    refreshInterval: 30000, // 30 seconds
  },
};

/**
 * Display Configuration
 * Settings for different display types (TV and Projector)
 */
export const DISPLAY_CONFIGS = {
  /**
   * TV Display Configuration
   */
  tv: {
    id: 'tv',
    name: 'TV Display',
    defaultProfile: 'personal',
    supportedProfiles: ['default', 'personal', 'guest', 'morning', 'work'],
    viewport: 'normal',
    settings: {
      resolution: {
        width: 1920,
        height: 1080,
      },
      scale: 1,
      safeArea: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
      },
    },
  },

  /**
   * Projector Display Configuration
   */
  projector: {
    id: 'projector',
    name: 'Projector Display',
    defaultProfile: 'default',
    supportedProfiles: ['default', 'guest', 'morning'],
    viewport: 'scaled',
    settings: {
      resolution: {
        width: 1920,
        height: 1080,
      },
      scale: 0.6,
      safeArea: {
        top: 40,
        right: 40,
        bottom: 40,
        left: 40,
      },
    },
  },
};

/**
 * Get profile by ID
 * @param {string} profileId - The profile ID
 * @returns {object|null} Profile object or null if not found
 */
export const getProfile = (profileId) => {
  return PROFILES[profileId] || null;
};

/**
 * Get display config by ID
 * @param {string} displayId - The display ID ('tv' or 'projector')
 * @returns {object|null} Display config or null if not found
 */
export const getDisplayConfig = (displayId) => {
  return DISPLAY_CONFIGS[displayId] || null;
};

/**
 * Check if a module is enabled in a profile
 * @param {string} profileId - The profile ID
 * @param {string} moduleId - The module ID
 * @returns {boolean} True if module is enabled
 */
export const isModuleEnabled = (profileId, moduleId) => {
  const profile = getProfile(profileId);
  if (!profile) return false;

  const module = profile.modules[moduleId];
  return module?.enabled || false;
};

/**
 * Get enabled modules for a profile, sorted by priority
 * @param {string} profileId - The profile ID
 * @returns {Array} Array of enabled module IDs sorted by priority
 */
export const getEnabledModules = (profileId) => {
  const profile = getProfile(profileId);
  if (!profile) return [];

  return Object.entries(profile.modules)
    .filter(([_, config]) => config.enabled)
    .sort((a, b) => (a[1].priority || 999) - (b[1].priority || 999))
    .map(([moduleId, _]) => moduleId);
};

/**
 * Validate if a profile is supported by a display
 * @param {string} displayId - The display ID
 * @param {string} profileId - The profile ID
 * @returns {boolean} True if profile is supported
 */
export const isProfileSupported = (displayId, profileId) => {
  const displayConfig = getDisplayConfig(displayId);
  if (!displayConfig) return false;

  return displayConfig.supportedProfiles.includes(profileId);
};
