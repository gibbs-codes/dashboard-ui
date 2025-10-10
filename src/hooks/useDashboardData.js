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
  console.log('[useDashboardData] Hook called with profile:', profile);

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
    console.log('[updateData] Called with data:', newData);

    if (newData && typeof newData === 'object') {
      console.log('[updateData] Validation passed, setting data');
      setData(newData);
      setLastUpdated(new Date());
      setError(null);

      // Cache the data
      saveToCache(CACHE_KEYS.DASHBOARD_DATA, newData, CACHE_TTL_DASHBOARD);

      // Save as last valid data for fallback
      saveLastData(newData);

      console.log('[Data] Updated successfully');
    } else {
      console.warn('[updateData] Validation failed:', { hasData: !!newData, type: typeof newData });
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
      console.log('[fetchData] Calling getDashboardData with profile:', profileRef.current);
      const response = await getDashboardData(profileRef.current);
      console.log('[fetchData] Got response:', response);
      console.log('[fetchData] VERSION 2 - FIXED UNMOUNT BUG');

      // Note: Removed isMounted check here - React handles state updates on unmounted components
      // This allows StrictMode double-mounting to work correctly

      if (response && (response.success || response.data)) {
        // Handle both {success: true, data: {...}} and direct data responses
        const actualData = response.data || response;
        console.log('[fetchData] Calling updateData with:', actualData);
        updateData(actualData);
        setLoading(false);
      } else {
        console.error('[fetchData] Invalid response:', response);
        throw new Error(response?.error || 'Failed to fetch dashboard data');
      }
      setLoading(false);
    } catch (err) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stopPolling, startPolling]);

  /**
   * Initial data fetch on mount or profile change
   */
  useEffect(() => {
    console.log('[useDashboardData] Effect running, profile:', profile);
    profileRef.current = profile;
    console.log('[useDashboardData] About to call fetchData');
    fetchData(true);
    console.log('[useDashboardData] Called fetchData');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

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
   * Note: We don't set isMounted to false here because in React StrictMode,
   * components mount/unmount twice, which would cause the isMounted check
   * to abort valid API calls. React handles cleanup of state updates automatically.
   */
  useEffect(() => {
    // Set mounted on mount
    isMounted.current = true;

    return () => {
      // Only clean up polling, let React handle state updates
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
