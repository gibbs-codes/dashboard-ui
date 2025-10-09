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
    console.log('[DEBUG] updateData called with:', { hasData: !!newData, isMounted: isMounted.current });

    if (!isMounted.current) return;

    if (newData && typeof newData === 'object') {
      setData(newData);
      setLastUpdated(new Date());
      setError(null);

      // Cache the data
      saveToCache(CACHE_KEYS.DASHBOARD_DATA, newData, CACHE_TTL_DASHBOARD);

      // Save as last valid data for fallback
      saveLastData(newData);

      if (isDevelopment) {
        console.log('[useDashboardData] Data updated:', {
          mode: newData.mode,
          timestamp: newData.timestamp,
          hasWeather: !!newData.weather,
          hasTransit: !!newData.transit,
          hasEvents: !!newData.events,
          hasTasks: !!newData.tasks,
          hasNextEvent: !!newData.nextEvent,
        });
      }
    }
  }, []);

  /**
   * Fetch dashboard data from API
   * @param {boolean} useCache - Whether to return cached data first
   */
  const fetchData = useCallback(async (useCache = true) => {
    if (isDevelopment) {
      console.log(`[useDashboardData] Fetching data for profile: ${profileRef.current}`);
    }

    // Return cached data immediately if available
    if (useCache) {
      const cached = getFromCache(CACHE_KEYS.DASHBOARD_DATA);

      if (cached) {
        if (isDevelopment) {
          console.log('[useDashboardData] Using cached data');
        }
        updateData(cached);
        setLoading(false);
        console.log('[DEBUG] Loading set to false');
      }
    }

    try {
      // Fetch fresh data from API
      const response = await getDashboardData(profileRef.current);

      if (!isMounted.current) return;

      if (response.success && response.data) {
        updateData(response.data);
        setLoading(false);
        console.log('[DEBUG] Loading set to false');
      } else {
        throw new Error(response.error || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      if (!isMounted.current) return;

      console.error('[useDashboardData] Error fetching data:', err);

      // Try to use cached data as fallback
      const cached = getFromCache(CACHE_KEYS.DASHBOARD_DATA);
      const lastValid = getLastData();

      if (cached || lastValid) {
        if (isDevelopment) {
          console.log('[useDashboardData] Using fallback data due to error');
        }
        updateData(cached || lastValid);
        setError('Using cached data - server unavailable');
      } else {
        setError(err.message || 'Failed to load dashboard data');
      }

      setLoading(false);
      console.log('[DEBUG] Loading set to false');
    }
  }, [updateData]);

  /**
   * Refresh dashboard data
   * Clears cache and fetches fresh data
   */
  const refresh = useCallback(async () => {
    if (isDevelopment) {
      console.log('[useDashboardData] Manual refresh triggered');
    }

    setLoading(true);
    setError(null);

    // Clear cache
    clearCache(CACHE_KEYS.DASHBOARD_DATA);

    try {
      // Call API refresh endpoint first
      const refreshResponse = await refreshDashboardAPI();

      if (refreshResponse.success) {
        if (isDevelopment) {
          console.log('[useDashboardData] Refresh triggered on server');
        }
      }

      // Then fetch updated data
      await fetchData(false);
    } catch (err) {
      console.error('[useDashboardData] Error during refresh:', err);

      // Still try to fetch data even if refresh call failed
      await fetchData(false);
    }
  }, [fetchData]);

  /**
   * Start polling (fallback when WebSocket is disconnected)
   */
  const startPolling = useCallback(() => {
    if (pollingTimer.current) return;

    if (isDevelopment) {
      console.log(`[useDashboardData] Starting polling (interval: ${POLLING_INTERVAL}ms)`);
    }

    pollingTimer.current = setInterval(() => {
      if (isMounted.current && wsClient.getState() !== WS_STATES.CONNECTED) {
        if (isDevelopment) {
          console.log('[useDashboardData] Polling for data update');
        }
        fetchData(true);
      }
    }, POLLING_INTERVAL);
  }, [fetchData]);

  /**
   * Stop polling
   */
  const stopPolling = useCallback(() => {
    if (pollingTimer.current) {
      if (isDevelopment) {
        console.log('[useDashboardData] Stopping polling');
      }

      clearInterval(pollingTimer.current);
      pollingTimer.current = null;
    }
  }, []);

  /**
   * Handle WebSocket dashboard update events
   */
  const handleDashboardUpdate = useCallback((incomingData) => {
    console.log('[DEBUG] Raw incoming WebSocket data:', JSON.stringify(incomingData, null, 2));

    if (isDevelopment) {
      console.log('[useDashboardData] Received dashboard update via WebSocket');
    }

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
        console.log('[DEBUG] After updateData call in handleDashboardUpdate');
      }
    }
  }, [updateData]);

  /**
   * Handle WebSocket state changes
   */
  const handleStateChange = useCallback((stateData) => {
    const { newState } = stateData;

    if (isDevelopment) {
      console.log(`[useDashboardData] WebSocket state changed to: ${newState}`);
    }

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
