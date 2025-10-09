/**
 * API Configuration
 * Defines base URLs and all API endpoints for the dashboard
 */

// Base URLs from environment variables with fallback defaults
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
export const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';

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
