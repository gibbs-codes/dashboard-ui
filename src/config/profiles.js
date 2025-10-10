/**
 * Profile Configuration
 * Profile system optimized for signage displays (TV and Projector)
 */

/**
 * Profile Definitions
 * Each profile defines what data to fetch and which components to display
 */
export const PROFILES = {
  /**
   * Default Profile
   * Fullpage art with weather and time
   */
  default: {
    id: 'default',
    name: 'Default',
    description: 'Fullpage art display with weather and time',
    data: {
      weather: true,
      transit: false,
      calendar: false,
      tasks: false,
      nextEvent: false,
      artwork: true,
    },
    displays: {
      tv: 'TVArt',
      projector: {
        left: 'Transit',
        center: 'ArtCanvas',
        right: 'ArtCanvas',
      },
    },
  },

  /**
   * Morning Profile
   * Morning briefing with weather, transit, calendar, and tasks
   */
  morning: {
    id: 'morning',
    name: 'Morning Briefing',
    description: 'Complete morning briefing with schedule and tasks',
    data: {
      weather: true,
      transit: true,
      calendar: true,
      tasks: true,
      nextEvent: true,
    },
    displays: {
      tv: 'TVMorning',
      projector: {
        left: 'WeatherTransit',
        center: 'ClockDate',
        right: 'CalendarTasks',
      },
    },
  },

  /**
   * Focus Profile
   * Minimal distraction: next event only
   */
  focus: {
    id: 'focus',
    name: 'Focus Mode',
    description: 'Minimal distraction - next event only',
    data: {
      weather: false,
      transit: false,
      calendar: false,
      tasks: false,
      nextEvent: true,
    },
    displays: {
      tv: 'TVFocus',
      projector: {
        left: 'ArtCanvas',
        center: 'NextEventLarge',
        right: 'ArtCanvas',
      },
    },
  },

  /**
   * Work Profile
   * Productivity mode: calendar, tasks, and next event
   */
  work: {
    id: 'work',
    name: 'Work Mode',
    description: 'Productivity mode with calendar and tasks',
    data: {
      weather: false,
      transit: false,
      calendar: true,
      tasks: true,
      nextEvent: true,
    },
    displays: {
      tv: 'TVWork',
      projector: {
        left: 'Calendar',
        center: 'NextEventClock',
        right: 'Tasks',
      },
    },
  },

  /**
   * Relax Profile
   * Art mode: no information, just visuals
   */
  relax: {
    id: 'relax',
    name: 'Relax Mode',
    description: 'Art mode with minimal information',
    data: {
      weather: false,
      transit: false,
      calendar: false,
      tasks: false,
      nextEvent: false,
    },
    displays: {
      tv: 'TVRelax',
      projector: {
        left: 'ArtCanvas',
        center: 'ClockOnly',
        right: 'ArtCanvas',
      },
    },
  },

  /**
   * Gallery Profile
   * Fullpage art with weather and time (matches backend mode: "gallery")
   */
  gallery: {
    id: 'gallery',
    name: 'Gallery Mode',
    description: 'Fullpage art display with weather and time',
    data: {
      weather: true,
      transit: false,
      calendar: false,
      tasks: false,
      nextEvent: false,
      artwork: true,
    },
    displays: {
      tv: 'TVArt',
      projector: {
        left: 'ArtCanvas',
        center: 'ArtCanvas',
        right: 'ArtCanvas',
      },
    },
  },
};

/**
 * Get profile by ID
 * @param {string} profileId - Profile ID
 * @returns {Object|null} Profile configuration or null if not found
 */
export const getProfile = (profileId) => {
  return PROFILES[profileId] || PROFILES.default;
};

/**
 * Validate if a profile exists
 * @param {string} profileId - Profile ID to validate
 * @returns {boolean} True if profile exists
 */
export const validateProfile = (profileId) => {
  return Object.prototype.hasOwnProperty.call(PROFILES, profileId);
};

/**
 * Get data requirements for a profile
 * Returns object indicating which data sources need to be fetched
 * @param {string} profileId - Profile ID
 * @returns {Object} Data requirements object
 */
export const getDataRequirements = (profileId) => {
  const profile = getProfile(profileId);

  if (!profile || !profile.data) {
    return {
      weather: false,
      transit: false,
      calendar: false,
      tasks: false,
      nextEvent: false,
    };
  }

  return { ...profile.data };
};

/**
 * Get display configuration for a profile
 * @param {string} profileId - Profile ID
 * @param {string} displayType - Display type ('tv' or 'projector')
 * @returns {Object|string|null} Display configuration
 */
export const getDisplayConfig = (profileId, displayType) => {
  const profile = getProfile(profileId);

  if (!profile || !profile.displays) {
    return null;
  }

  return profile.displays[displayType] || null;
};

/**
 * Get all profile IDs
 * @returns {Array<string>} Array of profile IDs
 */
export const getAllProfileIds = () => {
  return Object.keys(PROFILES);
};

/**
 * Get all profiles
 * @returns {Object} All profiles
 */
export const getAllProfiles = () => {
  return { ...PROFILES };
};

/**
 * Check if data type is required for a profile
 * @param {string} profileId - Profile ID
 * @param {string} dataType - Data type to check (weather, transit, etc.)
 * @returns {boolean} True if data type is required
 */
export const isDataRequired = (profileId, dataType) => {
  const requirements = getDataRequirements(profileId);
  return requirements[dataType] || false;
};

/**
 * Get profile metadata (without data/display configs)
 * Useful for UI selectors
 * @returns {Array<Object>} Array of profile metadata
 */
export const getProfileMetadata = () => {
  return Object.values(PROFILES).map(profile => ({
    id: profile.id,
    name: profile.name,
    description: profile.description,
  }));
};
