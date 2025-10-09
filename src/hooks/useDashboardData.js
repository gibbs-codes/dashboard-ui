/**
 * useDashboardData Hook
 * Manages dashboard data fetching with WebSocket updates, polling fallback, and caching
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { getDashboardData, refreshDashboard as refreshDashboardAPI } from '../services/api.js';
import {
  saveToCache,
  getFromCache,
  clearCache,
  saveLastData,
  getLastData,
  CACHE_KEYS,
  CACHE_TTL_DASHBOARD
} from '../services/storage.js';
import wsClient, { WS_EVENTS, WS_STATES } from '../services/websocket.js';
import { DEFAULT_POLLING_INTERVAL } from '../config/displays.js';

/**
 * Check if running in development mode
 */
const isDevelopment = import.meta.env.DEV;

/**
 * Polling interval when WebSocket is disconnected (30 seconds)
 */
const POLLING_INTERVAL = DEFAULT_POLLING_INTERVAL;

/**
 * useDashboardData Hook
 * Fetches and manages dashboard data with real-time updates
 *
 * @param {string} profile - Profile ID to fetch data for
 * @returns {Object} Dashboard data state and methods
 */
export const useDashboardData = (profile = 'default') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Refs
  const isMounted = useRef(true);
  const pollingTimer = useRef(null);
  const profileRef = useRef(profile);

  /**
   * Update data state with validation
   * @param {Object} newData - New dashboard data
   */
  const updateData = useCallback((newData) => {
    if (!isMounted.current) return;

    if (newData && typeof newData === 'object') {
      setData(newData);
      setLastUpdated(new Date());
      setError(null);

      // Cache the data
      saveToCache(CACHE_KEYS.DASHBOARD_DATA, newData, CACHE_TTL_DASHBOARD);

      // Save as last valid data for fallback
      saveLastData(newData);

      console.log('[Data] Updated successfully');
    }
  }, []);

  /**
   * Fetch dashboard data from API
   * @param {boolean} useCache - Whether to return cached data first
   */
  const fetchData = useCallback(async (useCache = true) => {
    // Return cached data immediately if available
    if (useCache) {
      const cached = getFromCache(CACHE_KEYS.DASHBOARD_DATA);

      if (cached) {
        updateData(cached);
        setLoading(false);
      }
    }

    try {
      // Fetch fresh data from API
      const response = await getDashboardData(profileRef.current);

      if (!isMounted.current) return;

      console.log('[API] Response structure:', { hasSuccess: 'success' in response, hasData: !!response?.data });

      if (response && (response.success || response.data)) {
        // Handle both {success: true, data: {...}} and direct data responses
        const actualData = response.data || response;
        updateData(actualData);
        setLoading(false);
      } else {
        throw new Error(response?.error || 'Failed to fetch dashboard data');
      }
      setLoading(false);
    } catch (err) {
      if (!isMounted.current) return;

      console.error('[API] Fetch error:', err.message);

      // Try to use cached data as fallback
      const cached = getFromCache(CACHE_KEYS.DASHBOARD_DATA);
      const lastValid = getLastData();

      if (cached || lastValid) {
        updateData(cached || lastValid);
        setError('Using cached data - server unavailable');
      } else {
        setError(err.message || 'Failed to load dashboard data');
      }

      setLoading(false);
    }
  }, [updateData]);

  /**
   * Refresh dashboard data
   * Clears cache and fetches fresh data
   */
  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Clear cache
    clearCache(CACHE_KEYS.DASHBOARD_DATA);

    try {
      // Call API refresh endpoint first
      await refreshDashboardAPI();

      // Then fetch updated data
      await fetchData(false);
    } catch (err) {
      console.error('[Refresh] Error:', err.message);

      // Still try to fetch data even if refresh call failed
      await fetchData(false);
    }
  }, [fetchData]);

  /**
   * Start polling (fallback when WebSocket is disconnected)
   */
  const startPolling = useCallback(() => {
    if (pollingTimer.current) return;

    pollingTimer.current = setInterval(() => {
      if (isMounted.current && wsClient.getState() !== WS_STATES.CONNECTED) {
        fetchData(true);
      }
    }, POLLING_INTERVAL);
  }, [fetchData]);

  /**
   * Stop polling
   */
  const stopPolling = useCallback(() => {
    if (pollingTimer.current) {
      clearInterval(pollingTimer.current);
      pollingTimer.current = null;
    }
  }, []);

  /**
   * Handle WebSocket dashboard update events
   */
  const handleDashboardUpdate = useCallback((incomingData) => {
    console.log('[WebSocket] Dashboard update received');

    if (incomingData) {
      // If we receive a partial update, merge with existing data
      if (incomingData.partial) {
        setData(prevData => ({
          ...prevData,
          ...incomingData,
          timestamp: incomingData.timestamp || new Date().toISOString(),
        }));
      } else {
        // Full update
        updateData(incomingData);
      }
    }
  }, [updateData]);

  /**
   * Handle WebSocket state changes
   */
  const handleStateChange = useCallback((stateData) => {
    const { newState } = stateData;

    if (newState === WS_STATES.CONNECTED) {
      // WebSocket connected, stop polling
      stopPolling();

      // Fetch fresh data
      fetchData(true);
    } else if (newState === WS_STATES.DISCONNECTED || newState === WS_STATES.ERROR) {
      // WebSocket disconnected, start polling
      startPolling();
    }
  }, [stopPolling, startPolling, fetchData]);

  /**
   * Initial data fetch on mount or profile change
   */
  useEffect(() => {
    profileRef.current = profile;
    fetchData(true);
  }, [profile, fetchData]);

  /**
   * Subscribe to WebSocket events
   */
  useEffect(() => {
    wsClient.subscribe(WS_EVENTS.DASHBOARD_UPDATE, handleDashboardUpdate);
    wsClient.subscribe(WS_EVENTS.STATE_CHANGE, handleStateChange);

    // Start polling if WebSocket is not connected
    if (wsClient.getState() !== WS_STATES.CONNECTED) {
      startPolling();
    }

    return () => {
      wsClient.unsubscribe(WS_EVENTS.DASHBOARD_UPDATE, handleDashboardUpdate);
      wsClient.unsubscribe(WS_EVENTS.STATE_CHANGE, handleStateChange);
      stopPolling();
    };
  }, [handleDashboardUpdate, handleStateChange, startPolling, stopPolling]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      isMounted.current = false;
      stopPolling();
    };
  }, [stopPolling]);

  return {
    data,
    loading,
    error,
    refresh,
    lastUpdated,
  };
};

export default useDashboardData;
