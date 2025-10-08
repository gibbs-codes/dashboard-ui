/**
 * Storage Service
 * Handles caching and persistence using localStorage with TTL support
 */

/**
 * Check if running in development mode
 */
const isDevelopment = import.meta.env.DEV;

/**
 * Cache TTL Constants (in milliseconds)
 */
export const CACHE_TTL_DASHBOARD = 60000; // 1 minute
export const CACHE_TTL_PROFILE = Infinity; // Never expires (until manually changed)

/**
 * Cache Keys
 */
export const CACHE_KEYS = {
  DASHBOARD_DATA: 'dashboard_data',
  PROFILE_CURRENT: 'profile_current',
  PROFILE_HISTORY: 'profile_history',
  LAST_VALID_DATA: 'last_valid_data',
};

/**
 * Storage namespace prefix to avoid conflicts
 */
const STORAGE_PREFIX = 'dashboard_ui_';

/**
 * Create a namespaced key
 * @private
 * @param {string} key - Original key
 * @returns {string} Namespaced key
 */
const getNamespacedKey = (key) => {
  return `${STORAGE_PREFIX}${key}`;
};

/**
 * Cache entry structure
 * @typedef {Object} CacheEntry
 * @property {any} data - Cached data
 * @property {number} timestamp - When the data was cached
 * @property {number} ttl - Time to live in milliseconds
 */

/**
 * Check if localStorage is available
 * @returns {boolean} True if localStorage is available
 */
const isLocalStorageAvailable = () => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Save data to cache with TTL
 * @param {string} key - Cache key
 * @param {any} data - Data to cache
 * @param {number} ttl - Time to live in milliseconds (default: CACHE_TTL_DASHBOARD)
 * @returns {boolean} True if successfully saved
 */
export const saveToCache = (key, data, ttl = CACHE_TTL_DASHBOARD) => {
  if (!isLocalStorageAvailable()) {
    console.warn('[Storage] localStorage is not available');
    return false;
  }

  try {
    const cacheEntry = {
      data,
      timestamp: Date.now(),
      ttl,
    };

    const namespacedKey = getNamespacedKey(key);
    localStorage.setItem(namespacedKey, JSON.stringify(cacheEntry));

    if (isDevelopment) {
      console.log(`[Storage] Saved to cache: ${key}`, { ttl });
    }

    return true;
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      console.error('[Storage] Quota exceeded - cleaning up old cache');
      cleanupExpiredCache();

      // Try again after cleanup
      try {
        const cacheEntry = {
          data,
          timestamp: Date.now(),
          ttl,
        };

        const namespacedKey = getNamespacedKey(key);
        localStorage.setItem(namespacedKey, JSON.stringify(cacheEntry));
        return true;
      } catch (retryError) {
        console.error('[Storage] Still unable to save after cleanup:', retryError);
        return false;
      }
    }

    console.error('[Storage] Error saving to cache:', error);
    return false;
  }
};

/**
 * Get data from cache (with TTL validation)
 * @param {string} key - Cache key
 * @returns {any|null} Cached data or null if not found/expired
 */
export const getFromCache = (key) => {
  if (!isLocalStorageAvailable()) {
    return null;
  }

  try {
    const namespacedKey = getNamespacedKey(key);
    const cached = localStorage.getItem(namespacedKey);

    if (!cached) {
      return null;
    }

    const cacheEntry = JSON.parse(cached);

    // Check if cache has expired
    if (cacheEntry.ttl !== Infinity) {
      const age = Date.now() - cacheEntry.timestamp;

      if (age > cacheEntry.ttl) {
        if (isDevelopment) {
          console.log(`[Storage] Cache expired: ${key} (age: ${age}ms, ttl: ${cacheEntry.ttl}ms)`);
        }

        // Remove expired entry
        clearCache(key);
        return null;
      }
    }

    if (isDevelopment) {
      const age = Date.now() - cacheEntry.timestamp;
      console.log(`[Storage] Retrieved from cache: ${key} (age: ${age}ms)`);
    }

    return cacheEntry.data;
  } catch (error) {
    console.error('[Storage] Error getting from cache:', error);
    return null;
  }
};

/**
 * Clear specific cache entry
 * @param {string} key - Cache key to clear
 * @returns {boolean} True if successfully cleared
 */
export const clearCache = (key) => {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  try {
    const namespacedKey = getNamespacedKey(key);
    localStorage.removeItem(namespacedKey);

    if (isDevelopment) {
      console.log(`[Storage] Cleared cache: ${key}`);
    }

    return true;
  } catch (error) {
    console.error('[Storage] Error clearing cache:', error);
    return false;
  }
};

/**
 * Clear all cache entries
 * @returns {boolean} True if successfully cleared
 */
export const clearAllCache = () => {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  try {
    const keys = Object.keys(localStorage);
    let cleared = 0;

    keys.forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
        cleared++;
      }
    });

    if (isDevelopment) {
      console.log(`[Storage] Cleared all cache (${cleared} entries)`);
    }

    return true;
  } catch (error) {
    console.error('[Storage] Error clearing all cache:', error);
    return false;
  }
};

/**
 * Cleanup expired cache entries
 * @returns {number} Number of entries cleaned up
 */
export const cleanupExpiredCache = () => {
  if (!isLocalStorageAvailable()) {
    return 0;
  }

  try {
    const keys = Object.keys(localStorage);
    let cleaned = 0;

    keys.forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        try {
          const cached = localStorage.getItem(key);
          const cacheEntry = JSON.parse(cached);

          if (cacheEntry.ttl !== Infinity) {
            const age = Date.now() - cacheEntry.timestamp;

            if (age > cacheEntry.ttl) {
              localStorage.removeItem(key);
              cleaned++;
            }
          }
        } catch (e) {
          // Invalid cache entry, remove it
          localStorage.removeItem(key);
          cleaned++;
        }
      }
    });

    if (isDevelopment && cleaned > 0) {
      console.log(`[Storage] Cleaned up ${cleaned} expired cache entries`);
    }

    return cleaned;
  } catch (error) {
    console.error('[Storage] Error cleaning up cache:', error);
    return 0;
  }
};

/**
 * Save current profile
 * @param {string} profile - Profile ID
 * @returns {boolean} True if successfully saved
 */
export const saveProfile = (profile) => {
  const success = saveToCache(CACHE_KEYS.PROFILE_CURRENT, profile, CACHE_TTL_PROFILE);

  if (success) {
    // Also add to profile history
    const history = getProfileHistory();
    const timestamp = Date.now();

    const newEntry = {
      profile,
      timestamp,
    };

    // Keep last 10 profile changes
    const updatedHistory = [newEntry, ...history].slice(0, 10);
    saveToCache(CACHE_KEYS.PROFILE_HISTORY, updatedHistory, CACHE_TTL_PROFILE);

    if (isDevelopment) {
      console.log(`[Storage] Saved profile: ${profile}`);
    }
  }

  return success;
};

/**
 * Get current profile
 * @returns {string|null} Current profile ID or null if not found
 */
export const getProfile = () => {
  const profile = getFromCache(CACHE_KEYS.PROFILE_CURRENT);

  if (isDevelopment && profile) {
    console.log(`[Storage] Retrieved profile: ${profile}`);
  }

  return profile;
};

/**
 * Get profile history
 * @returns {Array} Array of profile history entries
 */
export const getProfileHistory = () => {
  const history = getFromCache(CACHE_KEYS.PROFILE_HISTORY);
  return history || [];
};

/**
 * Save last valid dashboard data (fallback for when API fails)
 * @param {any} data - Dashboard data to save
 * @returns {boolean} True if successfully saved
 */
export const saveLastData = (data) => {
  const success = saveToCache(CACHE_KEYS.LAST_VALID_DATA, data, Infinity);

  if (isDevelopment && success) {
    console.log('[Storage] Saved last valid data as fallback');
  }

  return success;
};

/**
 * Get last valid dashboard data
 * @returns {any|null} Last valid data or null if not found
 */
export const getLastData = () => {
  const data = getFromCache(CACHE_KEYS.LAST_VALID_DATA);

  if (isDevelopment && data) {
    console.log('[Storage] Retrieved last valid data');
  }

  return data;
};

/**
 * Get cache statistics
 * @returns {Object} Cache statistics
 */
export const getCacheStats = () => {
  if (!isLocalStorageAvailable()) {
    return {
      available: false,
      totalEntries: 0,
      totalSize: 0,
      entries: [],
    };
  }

  try {
    const keys = Object.keys(localStorage);
    const entries = [];
    let totalSize = 0;

    keys.forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        const value = localStorage.getItem(key);
        const size = new Blob([value]).size;
        totalSize += size;

        try {
          const cacheEntry = JSON.parse(value);
          const age = Date.now() - cacheEntry.timestamp;
          const isExpired = cacheEntry.ttl !== Infinity && age > cacheEntry.ttl;

          entries.push({
            key: key.replace(STORAGE_PREFIX, ''),
            size,
            timestamp: cacheEntry.timestamp,
            age,
            ttl: cacheEntry.ttl,
            expired: isExpired,
          });
        } catch (e) {
          entries.push({
            key: key.replace(STORAGE_PREFIX, ''),
            size,
            invalid: true,
          });
        }
      }
    });

    return {
      available: true,
      totalEntries: entries.length,
      totalSize,
      entries,
    };
  } catch (error) {
    console.error('[Storage] Error getting cache stats:', error);
    return {
      available: false,
      totalEntries: 0,
      totalSize: 0,
      entries: [],
    };
  }
};

/**
 * Initialize storage service
 * Performs cleanup on startup
 */
export const initStorage = () => {
  if (isDevelopment) {
    console.log('[Storage] Initializing storage service');
  }

  // Cleanup expired cache on init
  cleanupExpiredCache();

  // Log cache stats in development
  if (isDevelopment) {
    const stats = getCacheStats();
    console.log('[Storage] Cache stats:', stats);
  }
};

// Auto-initialize on import
initStorage();
