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
      transit: true,        // Make sure this is true
      calendar: false,
      tasks: false,
      nextEvent: false,
      artwork: true,
    },
    displays: {
      tv: 'TVArt',
      projector: {
        left: 'Transit',           // Transit data
        center: 'ArtCanvas',    // Clock/Weather (CHANGE THIS)
        right: 'ArtCanvas',         // Artwork
      },
    },
  },

  /**
   * Relax Profile
   * Generative art mode on TV, museum art on projector
   */
  relax: {
    id: 'relax',
    name: 'Relax Mode',
    description: 'Generative art on TV, museum art on projector',
    data: {
      weather: true,
      transit: true,
      calendar: false,
      tasks: false,
      nextEvent: false,
      artwork: true,
    },
    displays: {
      tv: 'TVRelax',
      projector: {
        left: 'Transit',
        center: 'ClockWeather',
        right: 'ArtCanvas',
      },
    },
  },

  /**
   * Gallery Profile
   * Museum art gallery display
   */
  gallery: {
    id: 'gallery',
    name: 'Gallery Mode',
    description: 'Museum art gallery with transit',
    data: {
      weather: true,
      transit: true,
      calendar: false,
      tasks: false,
      nextEvent: false,
      artwork: true,
    },
    displays: {
      tv: 'TVRelax',
      projector: {
        left: 'Transit',
        center: 'ArtCanvas',
        right: 'ArtCanvas',
      },
    },
  },

  /**
   * Ambient Profile
   * Generative art on TV, museum art on projector
   */
  ambient: {
    id: 'ambient',
    name: 'Ambient',
    description: 'Generative art on TV, museum art on projector',
    data: {
      weather: true,
      transit: false,
      calendar: false,
      tasks: false,
      nextEvent: false,
      artwork: true,
    },
    displays: {
      tv: 'TVRelax',
      projector: {
        left: 'ArtCanvas',
        center: 'ClockWeather',
        right: 'ArtCanvas',
      },
    },
  },

  /**
   * Commute Profile
   * Transit-focused with clock
   */
  commute: {
    id: 'commute',
    name: 'Commute',
    description: 'Transit times and clock',
    data: {
      weather: true,
      transit: true,
      calendar: false,
      tasks: false,
      nextEvent: false,
      artwork: true,
    },
    displays: {
      tv: 'TVArt',
      projector: {
        left: 'Transit',
        center: 'ClockWeather',
        right: 'ArtCanvas',
      },
    },
  },

  /**
   * Artshow Profile
   * Museum art in all canvases
   */
  artshow: {
    id: 'artshow',
    name: 'Art Show',
    description: 'Museum artwork display',
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

  /**
   * Minimal Profile
   * Just clock and weather with art
   */
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean clock and weather with art',
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
        center: 'ClockWeather',
        right: 'ArtCanvas',
      },
    },
  },

  /**
   * Flow Profile
   * FlowField on TV, transit + art on projector
   */
  flow: {
    id: 'flow',
    name: 'Flow',
    description: 'Flow art on TV, transit and art on projector',
    data: {
      weather: true,
      transit: true,
      calendar: false,
      tasks: false,
      nextEvent: false,
      artwork: true,
    },
    displays: {
      tv: 'TVRelax',
      projector: {
        left: 'Transit',
        center: 'ArtCanvas',
        right: 'ArtCanvas',
      },
    },
  },

  /**
   * Orbital Profile
   * Orbital particles on TV, clock + art on projector
   */
  orbital: {
    id: 'orbital',
    name: 'Orbital',
    description: 'Orbital art on TV, clock and art on projector',
    data: {
      weather: true,
      transit: false,
      calendar: false,
      tasks: false,
      nextEvent: false,
      artwork: true,
    },
    displays: {
      tv: 'TVRelax',
      projector: {
        left: 'ArtCanvas',
        center: 'ClockWeather',
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
