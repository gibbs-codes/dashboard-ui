/**
 * API Service Layer
 * Clean service layer using native fetch API for dashboard backend communication
 */

import { API_BASE_URL, ENDPOINTS, REQUEST_CONFIG, STATUS_CODES } from '../config/api.js';

/**
 * Check if running in development mode
 */
const isDevelopment = import.meta.env.DEV;

/**
 * Request timeout duration (10 seconds)
 */
const REQUEST_TIMEOUT = 10000;

/**
 * Custom error class for API errors
 */
class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Create a timeout promise
 * @param {number} ms - Timeout in milliseconds
 * @returns {Promise} Promise that rejects after timeout
 */
const createTimeout = (ms) => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Request timeout')), ms);
  });
};

/**
 * API Client
 * Provides HTTP methods with error handling and timeout support
 */
export const apiClient = {
  /**
   * GET request
   * @param {string} endpoint - API endpoint path
   * @param {object} params - Query parameters (optional)
   * @returns {Promise<any>} Response data
   */
  async get(endpoint, params = {}) {
    console.log('API GET called with endpoint:', endpoint, 'and params:', params);
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    console.log('GET URL:', url.toString());
    // Add query parameters
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });

    const fetchPromise = fetch(url.toString(), {
      method: 'GET',
      headers: {
        ...REQUEST_CONFIG.headers,
      },
    });

    try {
      const response = await Promise.race([
        fetchPromise,
        createTimeout(REQUEST_TIMEOUT),
      ]);

      return await this._handleResponse(response);
    } catch (error) {
      throw this._handleError(error, 'GET', endpoint);
    }
  },

  /**
   * POST request
   * @param {string} endpoint - API endpoint path
   * @param {object} data - Request body data
   * @returns {Promise<any>} Response data
   */
  async post(endpoint, data = {}) {
    const fetchPromise = fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        ...REQUEST_CONFIG.headers,
      },
      body: JSON.stringify(data),
    });

    try {
      const response = await Promise.race([
        fetchPromise,
        createTimeout(REQUEST_TIMEOUT),
      ]);

      return await this._handleResponse(response);
    } catch (error) {
      throw this._handleError(error, 'POST', endpoint);
    }
  },

  /**
   * PUT request
   * @param {string} endpoint - API endpoint path
   * @param {object} data - Request body data
   * @returns {Promise<any>} Response data
   */
  async put(endpoint, data = {}) {
    const fetchPromise = fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        ...REQUEST_CONFIG.headers,
      },
      body: JSON.stringify(data),
    });

    try {
      const response = await Promise.race([
        fetchPromise,
        createTimeout(REQUEST_TIMEOUT),
      ]);

      return await this._handleResponse(response);
    } catch (error) {
      throw this._handleError(error, 'PUT', endpoint);
    }
  },

  /**
   * DELETE request
   * @param {string} endpoint - API endpoint path
   * @returns {Promise<any>} Response data
   */
  async delete(endpoint) {
    const fetchPromise = fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        ...REQUEST_CONFIG.headers,
      },
    });

    try {
      const response = await Promise.race([
        fetchPromise,
        createTimeout(REQUEST_TIMEOUT),
      ]);

      return await this._handleResponse(response);
    } catch (error) {
      throw this._handleError(error, 'DELETE', endpoint);
    }
  },

  /**
   * Handle fetch response
   * @private
   * @param {Response} response - Fetch response object
   * @returns {Promise<any>} Parsed response data
   */
  async _handleResponse(response) {
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    // Parse response body
    let data = null;
    if (isJson) {
      try {
        data = await response.json();
      } catch (e) {
        // JSON parse error
        data = null;
      }
    } else {
      data = await response.text();
    }

    // Handle error responses
    if (!response.ok) {
      throw new ApiError(
        data?.message || data?.error || `HTTP ${response.status}`,
        response.status,
        data
      );
    }

    return data;
  },

  /**
   * Handle errors
   * @private
   * @param {Error} error - Error object
   * @param {string} method - HTTP method
   * @param {string} endpoint - API endpoint
   * @returns {ApiError} Formatted error
   */
  _handleError(error, method, endpoint) {
    if (isDevelopment) {
      console.error(`[API Error] ${method} ${endpoint}:`, error);
    }

    if (error instanceof ApiError) {
      return error;
    }

    if (error.message === 'Request timeout') {
      return new ApiError('Request timeout - please try again', 408);
    }

    if (error.message === 'Failed to fetch') {
      return new ApiError('Network error - cannot reach server', 0);
    }

    return new ApiError(error.message || 'Unknown error occurred', 0);
  },
};

/**
 * Standardized API response wrapper
 * @param {Function} apiCall - Async function that makes the API call
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
const wrapApiCall = async (apiCall) => {
  try {
    const data = await apiCall();

    // If the API already returns a wrapped response, return it as-is
    // (Backend returns {success: true, data: {...}} already)
    if (data && typeof data === 'object' && 'success' in data) {
      return data;
    }

    // Otherwise, wrap it
    return {
      success: true,
      data,
    };
  } catch (error) {
    const errorMessage = error instanceof ApiError
      ? error.message
      : 'An unexpected error occurred';

    if (isDevelopment) {
      console.error('[API Call Failed]:', error);
    }

    return {
      success: false,
      error: errorMessage,
      data: null,
    };
  }
};

/**
 * Get all dashboard data for a specific profile
 * @param {string} profile - Profile ID (default, personal, guest, morning, work)
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export const getDashboardData = async (profile = 'default') => {
  return wrapApiCall(async () => {
    return await apiClient.get(ENDPOINTS.dashboard.data, { profile });
  });
};

/**
 * Trigger a dashboard data refresh
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export const refreshDashboard = async () => {
  return wrapApiCall(async () => {
    return await apiClient.post(ENDPOINTS.dashboard.refresh);
  });
};

/**
 * Get current profile configuration
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export const getProfile = async () => {
  return wrapApiCall(async () => {
    return await apiClient.get(ENDPOINTS.profile.get); // ✅ Correct - this is a string
  });
};

/**
 * Set/update profile configuration
 * @param {string} profile - Profile ID to set
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export const setProfile = async (profile) => {
  return wrapApiCall(async () => {
    return await apiClient.post(ENDPOINTS.profile.set, { profile });
  });
};

/**
 * Get transit data (bus/train schedules, delays, etc.)
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export const getTransitData = async () => {
  return wrapApiCall(async () => {
    return await apiClient.get(ENDPOINTS.transit.all);
  });
};

/**
 * Get current weather data
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export const getWeatherData = async () => {
  return wrapApiCall(async () => {
    return await apiClient.get(ENDPOINTS.weather.current);
  });
};

/**
 * Get today's calendar events
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export const getCalendarData = async () => {
  return wrapApiCall(async () => {
    return await apiClient.get(ENDPOINTS.calendar.today);
  });
};

/**
 * Get all tasks
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export const getTasksData = async () => {
  return wrapApiCall(async () => {
    return await apiClient.get(ENDPOINTS.tasks.all);
  });
};

/**
 * Health check - ping the API
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export const healthCheck = async () => {
  return wrapApiCall(async () => {
    return await apiClient.get('/api/health');
  });
};

// Export for testing and advanced usage
export { ApiError };
