/**
 * Profile Configuration (Local Fallback)
 *
 * NOTE: The backend (lifestack) is the source of truth for profiles.
 * This file is used as a fallback when the API is unavailable.
 * Keep this in sync with: lifestack/services/dashboard/profiles.js
 *
 * Each profile specifies:
 * 1. Data sources to include (what to fetch from backend)
 * 2. Display configuration (what components to render on TV/projector)
 */

export const PROFILES = {
  // Default profile - Art display with weather and transit
  default: {
    id: 'default',
    name: 'Default',
    description: 'Fullpage art display with weather and time',
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
        center: 'ArtCanvas',
        right: 'ArtCanvas',
      },
    },
  },

  // Relax profile - Generative art on TV, museum art on projector
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

  // Gallery profile - Art focused with weather and transit
  gallery: {
    id: 'gallery',
    name: 'Gallery',
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

  // Morning profile - Info-heavy: transit, next event, weather forecast, briefing on TV
  morning: {
    id: 'morning',
    name: 'Morning',
    description: 'Morning briefing - transit, next event, weather forecast',
    data: {
      weather: true,
      transit: true,
      calendar: true,
      tasks: true,
      nextEvent: true,
      artwork: false,
    },
    displays: {
      tv: 'TVMorning',
      projector: {
        left: 'Transit',
        center: 'NextEvent',
        right: 'WeatherForecast',
      },
    },
  },

  // Focus profile - Next event only with art
  focus: {
    id: 'focus',
    name: 'Focus',
    description: 'Focus mode - next event and art only',
    data: {
      weather: false,
      transit: false,
      calendar: false,
      tasks: false,
      nextEvent: true,
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

  // Work profile - Tasks and calendar only
  work: {
    id: 'work',
    name: 'Work',
    description: 'Work focus - calendar and tasks',
    data: {
      weather: false,
      transit: false,
      calendar: true,
      tasks: true,
      nextEvent: true,
      artwork: false,
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

  // Personal profile - Full dashboard with all data
  personal: {
    id: 'personal',
    name: 'Personal',
    description: 'Full dashboard with calendar, tasks, weather, and transit',
    data: {
      weather: true,
      transit: true,
      calendar: true,
      tasks: true,
      nextEvent: true,
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

  // Guest profile - Public data only (weather and transit)
  guest: {
    id: 'guest',
    name: 'Guest',
    description: 'Public information only - weather and transit',
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
        center: 'ArtCanvas',
        right: 'ArtCanvas',
      },
    },
  },

  // Transit profile - Transit information only
  transit: {
    id: 'transit',
    name: 'Transit',
    description: 'Transit information only',
    data: {
      weather: false,
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
        right: 'ArtCanvas',
      },
    },
  },

  // Ambient profile - Generative art, no transit
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

  // Commute profile - Transit-focused with clock
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

  // Artshow profile - Museum art in all canvases
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

  // Minimal profile - Just clock and weather with art
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

  // Flow profile - Flow art on TV, transit + art on projector
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

  // Orbital profile - Orbital art on TV, clock + art on projector
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

  // Evening profile - Moody geometric shapes on projector, flow on TV
  evening: {
    id: 'evening',
    name: 'Evening',
    description: 'Moody evening ambiance with geometric shapes',
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
        left: 'ShapeField',
        center: 'ShapeField',
        right: 'ShapeField',
      },
    },
  },

  // Experimental profile - For testing new features
  experimental: {
    id: 'experimental',
    name: 'Experimental',
    description: 'Testing ground for new features',
    data: {
      weather: true,
      transit: true,
      calendar: true,
      tasks: true,
      nextEvent: true,
      artwork: true,
    },
    displays: {
      tv: 'TVArt',
      projector: {
        left: 'Transit',
        center: 'NextEvent',
        right: 'WeatherForecast',
      },
    },
  },
};

/**
 * Get profile by ID (fallback for when API is unavailable)
 * @param {string} profileId - Profile ID
 * @returns {Object|null} Profile configuration or default if not found
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
