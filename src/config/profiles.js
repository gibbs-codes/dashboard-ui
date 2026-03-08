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
   * Generative art mode: flow field visuals
   */
  relax: {
    id: 'relax',
    name: 'Relax Mode',
    description: 'Generative flow field art',
    data: {
      weather: true,
      transit: true,
      calendar: false,
      tasks: false,
      nextEvent: false,
      artwork: false,
    },
    displays: {
      tv: 'TVRelax',
      projector: {
        left: 'Transit',
        center: 'FlowField',
        right: 'OrbitalParticles',
      },
    },
  },

  /**
   * Gallery Profile
   * Algorithm showcase with orbital particles
   */
  gallery: {
    id: 'gallery',
    name: 'Gallery Mode',
    description: 'Orbital particles showcase',
    data: {
      weather: true,
      transit: true,
      calendar: false,
      tasks: false,
      nextEvent: false,
      artwork: false,
    },
    displays: {
      tv: 'TVRelax',
      projector: {
        left: 'Transit',
        center: 'OrbitalParticles',
        right: 'FlowField',
      },
    },
  },

  /**
   * Ambient Profile
   * Full generative art experience
   */
  ambient: {
    id: 'ambient',
    name: 'Ambient',
    description: 'Full screen generative art',
    data: {
      weather: true,
      transit: false,
      calendar: false,
      tasks: false,
      nextEvent: false,
      artwork: false,
    },
    displays: {
      tv: 'TVRelax',
      projector: {
        left: 'FlowField',
        center: 'OrbitalParticles',
        right: 'FlowField',
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
      artwork: false,
    },
    displays: {
      tv: 'TVArt',
      projector: {
        left: 'Transit',
        center: 'ClockWeather',
        right: 'FlowField',
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
   * Just clock and weather
   */
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean clock and weather display',
    data: {
      weather: true,
      transit: false,
      calendar: false,
      tasks: false,
      nextEvent: false,
      artwork: false,
    },
    displays: {
      tv: 'TVArt',
      projector: {
        left: 'FlowField',
        center: 'ClockWeather',
        right: 'OrbitalParticles',
      },
    },
  },

  /**
   * Flow Profile
   * All FlowField generative art
   */
  flow: {
    id: 'flow',
    name: 'Flow',
    description: 'Perlin noise flow fields',
    data: {
      weather: true,
      transit: false,
      calendar: false,
      tasks: false,
      nextEvent: false,
      artwork: false,
    },
    displays: {
      tv: 'TVRelax',
      projector: {
        left: 'FlowField',
        center: 'FlowField',
        right: 'FlowField',
      },
    },
  },

  /**
   * Orbital Profile
   * All OrbitalParticles generative art
   */
  orbital: {
    id: 'orbital',
    name: 'Orbital',
    description: 'Orbital particle systems',
    data: {
      weather: true,
      transit: false,
      calendar: false,
      tasks: false,
      nextEvent: false,
      artwork: false,
    },
    displays: {
      tv: 'TVRelax',
      projector: {
        left: 'OrbitalParticles',
        center: 'OrbitalParticles',
        right: 'OrbitalParticles',
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
