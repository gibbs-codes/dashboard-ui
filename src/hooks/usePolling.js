/**
 * usePolling Hook
 * Automatically fetches data at regular intervals with manual refetch support
 */

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Check if running in development mode
 */
const isDevelopment = import.meta.env.DEV;

/**
 * Default polling options
 */
const DEFAULT_OPTIONS = {
  enabled: true,
  interval: 30000, // 30 seconds
  immediate: true, // Fetch immediately on mount
};

/**
 * usePolling Hook
 * Polls a function at regular intervals and returns the result
 *
 * @param {Function} fetchFn - Async function to call for fetching data
 * @param {Object} options - Polling options
 * @param {boolean} options.enabled - Whether polling is enabled (default: true)
 * @param {number} options.interval - Polling interval in ms (default: 30000)
 * @param {boolean} options.immediate - Fetch immediately on mount (default: true)
 * @returns {Object} Polling state and methods
 *
 * @example
 * // Basic usage
 * const { data, loading, error } = usePolling(
 *   () => apiClient.get('/api/dashboard/data'),
 *   { interval: 30000 }
 * );
 *
 * @example
 * // Conditional polling (only when WebSocket disconnected)
 * const { connected } = useWebSocket();
 * const { data } = usePolling(
 *   () => getDashboardData('personal'),
 *   { interval: 30000, enabled: !connected }
 * );
 *
 * @example
 * // Manual refetch
 * const { data, loading, refetch } = usePolling(
 *   fetchWeatherData,
 *   { interval: 60000 }
 * );
 *
 * return (
 *   <div>
 *     <WeatherDisplay data={data} loading={loading} />
 *     <button onClick={refetch}>Refresh Now</button>
 *   </div>
 * );
 */
export const usePolling = (fetchFn, options = {}) => {
  // Merge with default options
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // State
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(opts.immediate);
  const [error, setError] = useState(null);

  // Refs
  const isMounted = useRef(true);
  const pollingTimer = useRef(null);
  const fetchFnRef = useRef(fetchFn);
  const optionsRef = useRef(opts);

  // Update refs when props change
  useEffect(() => {
    fetchFnRef.current = fetchFn;
    optionsRef.current = opts;
  }, [fetchFn, opts]);

  /**
   * Fetch data from the provided function
   */
  const fetchData = useCallback(async () => {
    if (!isMounted.current) return;

    try {
      if (isDevelopment) {
        console.log('[usePolling] Fetching data...');
      }

      setLoading(true);
      setError(null);

      const result = await fetchFnRef.current();

      if (!isMounted.current) return;

      setData(result);
      setError(null);

      if (isDevelopment) {
        console.log('[usePolling] Data fetched successfully');
      }
    } catch (err) {
      if (!isMounted.current) return;

      const errorMessage = err?.message || 'Failed to fetch data';

      console.error('[usePolling] Error fetching data:', err);
      setError(errorMessage);

      // Don't clear data on error - keep showing last valid data
      // This prevents UI flashing on temporary errors

      if (isDevelopment) {
        console.log('[usePolling] Continuing to poll despite error');
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  /**
   * Start polling
   */
  const startPolling = useCallback(() => {
    // Clear any existing timer
    if (pollingTimer.current) {
      clearInterval(pollingTimer.current);
      pollingTimer.current = null;
    }

    const { interval, enabled } = optionsRef.current;

    if (!enabled) {
      if (isDevelopment) {
        console.log('[usePolling] Polling disabled');
      }
      return;
    }

    if (isDevelopment) {
      console.log(`[usePolling] Starting polling (interval: ${interval}ms)`);
    }

    // Set up interval
    pollingTimer.current = setInterval(() => {
      if (isMounted.current && optionsRef.current.enabled) {
        fetchData();
      }
    }, interval);
  }, [fetchData]);

  /**
   * Stop polling
   */
  const stopPolling = useCallback(() => {
    if (pollingTimer.current) {
      if (isDevelopment) {
        console.log('[usePolling] Stopping polling');
      }

      clearInterval(pollingTimer.current);
      pollingTimer.current = null;
    }
  }, []);

  /**
   * Manual refetch
   * Immediately fetches data without waiting for the next interval
   */
  const refetch = useCallback(async () => {
    if (isDevelopment) {
      console.log('[usePolling] Manual refetch triggered');
    }

    await fetchData();
  }, [fetchData]);

  /**
   * Initial fetch and polling setup
   */
  useEffect(() => {
    const { enabled, immediate } = opts;

    // Immediate fetch on mount if enabled
    if (enabled && immediate) {
      fetchData();
    }

    // Start polling if enabled
    if (enabled) {
      startPolling();
    }

    return () => {
      stopPolling();
    };
  }, [opts.enabled, opts.immediate, opts.interval, fetchData, startPolling, stopPolling]);

  /**
   * Update polling when enabled state changes
   */
  useEffect(() => {
    if (opts.enabled) {
      startPolling();
    } else {
      stopPolling();
    }
  }, [opts.enabled, startPolling, stopPolling]);

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
    refetch,
  };
};

export default usePolling;
