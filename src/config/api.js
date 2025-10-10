/**
 * API Configuration
 * Defines base URLs and all API endpoints for the dashboard
 */

const DEFAULT_HTTP = 'http://localhost:3001';
const DEFAULT_WS = 'ws://localhost:3001';

/**
 * Build a list of fallback URLs given the configured value
 * Ensures we can reach the API even if the Docker hostname differs
 * between environments (mac mini vs local dev).
 *
 * @param {string} primaryUrl - Configured base URL
 * @param {Array<[string, string]>} replacements - List of host replacements
 * @returns {string[]} Ordered list of candidate URLs
 */
const buildFallbackUrls = (primaryUrl, replacements = []) => {
  const urlSet = new Set();

  if (primaryUrl) {
    urlSet.add(primaryUrl);
  }

  replacements.forEach(([needle, replacement]) => {
    if (primaryUrl && primaryUrl.includes(needle)) {
      urlSet.add(primaryUrl.replace(needle, replacement));
    }
  });

  if (typeof window !== 'undefined') {
    try {
      const primary = new URL(primaryUrl || DEFAULT_HTTP);
      const protocol = primary.protocol || window.location.protocol;
      const port = primary.port || '3001';
      urlSet.add(`${protocol}//${window.location.hostname}:${port}`);
    } catch (error) {
      // Ignore URL parsing issues; fall back to default
    }
  }

  if (!urlSet.size) {
    urlSet.add(DEFAULT_HTTP);
  }

  return Array.from(urlSet);
};

const rawApiUrl = import.meta.env.VITE_API_URL || DEFAULT_HTTP;
const rawWsUrl = import.meta.env.VITE_WS_URL || DEFAULT_WS;

export const API_BASE_URLS = buildFallbackUrls(rawApiUrl, [
  ['dashboard-api-production', 'ctaaapi-production'],
  ['ctaaapi-production', 'dashboard-api-production'],
  ['localhost', 'host.docker.internal'],
]);
export const API_BASE_URL = API_BASE_URLS[0];

export const WS_BASE_URLS = buildFallbackUrls(rawWsUrl, [
  ['dashboard-api-production', 'ctaaapi-production'],
  ['ctaaapi-production', 'dashboard-api-production'],
  ['localhost', 'host.docker.internal'],
]);
export const WS_BASE_URL = WS_BASE_URLS[0];

if (import.meta.env.DEV) {
  console.log('[config/api] VITE_API_URL:', import.meta.env.VITE_API_URL);
  console.log('[config/api] API_BASE_URL candidates:', API_BASE_URLS);
  console.log('[config/api] VITE_WS_URL:', import.meta.env.VITE_WS_URL);
  console.log('[config/api] WS_BASE_URL candidates:', WS_BASE_URLS);
}
/**
 * API Endpoints
 * All available routes from the dashboard-api backend
 */
export const ENDPOINTS = {
  // Dashboard endpoints
  dashboard: {
    data: '/api/dashboard/data',
    refresh: '/api/dashboard/refresh',
  },

  // Profile endpoints
  profile: {
    get: '/api/profile',
    set: '/api/profile',
    history: '/api/profile/history',
  },

  // Transit endpoints
  transit: {
    all: '/api/transit/all',
  },

  // Weather endpoints
  weather: {
    current: '/api/weather/current',
  },

  // Calendar endpoints
  calendar: {
    today: '/api/calendar/today',
  },

  // Tasks endpoints
  tasks: {
    all: '/api/tasks/all',
  },
};

/**
 * Constructs a full API URL from an endpoint path
 * @param {string} endpoint - The endpoint path
 * @returns {string} Full URL
 */
export const getApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

/**
 * Constructs a full WebSocket URL from an endpoint path
 * @param {string} endpoint - The endpoint path
 * @returns {string} Full WebSocket URL
 */
export const getWsUrl = (endpoint) => {
  return `${WS_BASE_URL}${endpoint}`;
};

/**
 * HTTP request configuration defaults
 */
export const REQUEST_CONFIG = {
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
};

/**
 * API response status codes
 */
export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

/**
 * Get dashboard data URL with profile query parameter
 * @param {string} profile - Profile ID (e.g., 'morning', 'work', 'default')
 * @returns {string} Dashboard data URL with profile param
 */
export const getDashboardDataUrl = (profile) => {
  if (!profile) {
    return ENDPOINTS.dashboard.data;
  }
  return `${ENDPOINTS.dashboard.data}?profile=${encodeURIComponent(profile)}`;
};

/**
 * Get profile endpoint URL
 * @returns {string} Profile endpoint URL
 */
export const getProfileUrl = () => {
  return ENDPOINTS.profile.get;
};
