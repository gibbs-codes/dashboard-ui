/**
 * useProfile Hook
 * Manages profile state with API sync, WebSocket updates, polling, and localStorage persistence
 *
 * The backend is the source of truth for profiles. This hook fetches the profile
 * configuration from the API and uses it directly. Local profiles.js is used as
 * a fallback only when the API is unavailable.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { getProfile as getLocalProfile } from '../config/profiles.js';
import { getProfile as getProfileFromAPI, setProfile as setProfileViaAPI } from '../services/api.js';
import { saveProfile, getProfile as getProfileFromStorage } from '../services/storage.js';
import wsClient, { WS_EVENTS } from '../services/websocket.js';

/**
 * Check if running in development mode
 */
const isDevelopment = import.meta.env.DEV;

/**
 * Polling interval for checking profile changes (2 seconds)
 * This catches profile changes from external sources like Home Assistant
 */
const PROFILE_POLL_INTERVAL = 2000;

/**
 * useProfile Hook
 * Manages profile state with API, WebSocket, and localStorage integration
 *
 * @param {string} defaultProfile - Default profile ID to use
 * @param {string} displayType - Display type ('tv' or 'projector') for validation
 * @returns {Object} Profile state and methods
 */
export const useProfile = (defaultProfile = 'default', displayType = 'tv') => {
  const [currentProfile, setCurrentProfile] = useState(defaultProfile);
  const [profileConfig, setProfileConfig] = useState(getLocalProfile(defaultProfile));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ref to track if component is mounted
  const isMounted = useRef(true);

  // Ref to track the previous profile for rollback
  const previousProfile = useRef(defaultProfile);
  const previousConfig = useRef(getLocalProfile(defaultProfile));

  /**
   * Update profile state and config
   * @param {string} profileId - Profile ID to set
   * @param {Object} apiConfig - Optional config from API (preferred over local lookup)
   */
  const updateProfileState = useCallback((profileId, apiConfig = null) => {
    if (!isMounted.current) return;

    // Prefer API config, fall back to local config
    const config = apiConfig || getLocalProfile(profileId);

    if (config) {
      setCurrentProfile(profileId);
      setProfileConfig(config);
      previousProfile.current = profileId;
      previousConfig.current = config;

      if (isDevelopment) {
        console.log(`[useProfile] Profile updated: ${profileId}`, apiConfig ? '(from API)' : '(from local)');
      }
    } else {
      console.error(`[useProfile] Invalid profile: ${profileId}`);
      setError(`Invalid profile: ${profileId}`);
    }
  }, []);

  /**
   * Fetch initial profile from API
   * The API is the source of truth - it returns the full profile config including displays
   */
  const fetchInitialProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // First, try to get from localStorage as immediate fallback
      const cachedProfile = getProfileFromStorage();

      if (cachedProfile) {
        if (isDevelopment) {
          console.log(`[useProfile] Using cached profile: ${cachedProfile}`);
        }
        updateProfileState(cachedProfile);
      }

      // Then fetch from API to ensure sync (API is source of truth)
      const response = await getProfileFromAPI();

      if (response.success && response.data) {
        // API returns full profile config including displays
        const apiProfile = response.data.mode || response.data.profile;
        const apiConfig = response.data;

        if (apiProfile) {
          // Use the full config from API (includes displays)
          updateProfileState(apiProfile, apiConfig);
          saveProfile(apiProfile);
        } else {
          console.warn(`[useProfile] API returned no profile, using default`);
          updateProfileState(defaultProfile);
          saveProfile(defaultProfile);
        }
      } else {
        // API failed, use cached or default
        if (!cachedProfile) {
          updateProfileState(defaultProfile);
          saveProfile(defaultProfile);
        }

        if (isDevelopment) {
          console.log(`[useProfile] API failed, using fallback profile`);
        }
      }
    } catch (err) {
      console.error('[useProfile] Error fetching initial profile:', err);

      // Fall back to cached or default
      const cachedProfile = getProfileFromStorage();

      if (cachedProfile) {
        updateProfileState(cachedProfile);
      } else {
        updateProfileState(defaultProfile);
        saveProfile(defaultProfile);
      }

      setError('Failed to fetch profile from server');
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [defaultProfile, updateProfileState]);

  /**
   * Set a new profile (with optimistic update and rollback on error)
   * @param {string} newProfile - Profile ID to set
   * @returns {Promise<boolean>} True if successful
   */
  const setProfile = useCallback(async (newProfile) => {
    // Store previous profile and config for potential rollback
    const rollbackProfile = currentProfile;
    const rollbackConfig = previousConfig.current;

    try {
      // Optimistic update (use local config temporarily)
      updateProfileState(newProfile);
      saveProfile(newProfile);
      setError(null);

      if (isDevelopment) {
        console.log(`[useProfile] Setting profile to: ${newProfile}`);
      }

      // Persist to API - backend validates the profile
      const response = await setProfileViaAPI(newProfile);

      if (!response.success) {
        throw new Error(response.error || 'Failed to set profile');
      }

      // Update with the full config from API response
      if (response.data) {
        updateProfileState(newProfile, response.data);
      }

      // Broadcast via WebSocket (if connected)
      if (wsClient.isConnected()) {
        wsClient.send(WS_EVENTS.PROFILE_CHANGED, {
          profile: newProfile,
          timestamp: Date.now(),
        });
      }

      if (isDevelopment) {
        console.log(`[useProfile] Profile successfully set: ${newProfile}`);
      }

      return true;
    } catch (err) {
      console.error('[useProfile] Error setting profile:', err);

      // Rollback on error
      if (isDevelopment) {
        console.log(`[useProfile] Rolling back to: ${rollbackProfile}`);
      }

      updateProfileState(rollbackProfile, rollbackConfig);
      saveProfile(rollbackProfile);

      const errorMsg = err.message || 'Failed to set profile';
      setError(errorMsg);

      return false;
    }
  }, [currentProfile, updateProfileState]);

  /**
   * Handle WebSocket profile change events
   */
  const handleProfileChanged = useCallback((data) => {
    if (!data?.profile) return;

    const newProfile = data.profile;

    if (isDevelopment) {
      console.log(`[useProfile] Received profile change via WebSocket: ${newProfile}`);
    }

    // Don't update if it's the same profile
    if (newProfile === currentProfile) return;

    // Update with data from WebSocket (may include full config)
    updateProfileState(newProfile, data);
    saveProfile(newProfile);
  }, [currentProfile, updateProfileState]);

  /**
   * Initialize profile on mount
   */
  useEffect(() => {
    fetchInitialProfile();

    return () => {
      isMounted.current = false;
    };
  }, [fetchInitialProfile]);

  /**
   * Subscribe to WebSocket profile change events
   */
  useEffect(() => {
    wsClient.subscribe(WS_EVENTS.PROFILE_CHANGED, handleProfileChanged);

    return () => {
      wsClient.unsubscribe(WS_EVENTS.PROFILE_CHANGED, handleProfileChanged);
    };
  }, [handleProfileChanged]);

  /**
   * Ref to track current profile for polling comparison
   * Using a ref avoids stale closure issues in the polling interval
   */
  const currentProfileRef = useRef(currentProfile);
  useEffect(() => {
    currentProfileRef.current = currentProfile;
  }, [currentProfile]);

  /**
   * Poll for profile changes from external sources (e.g., Home Assistant)
   * This ensures the UI updates even if WebSocket doesn't broadcast the change
   */
  useEffect(() => {
    if (isLoading) return;

    const pollForProfileChanges = async () => {
      try {
        const response = await getProfileFromAPI();

        if (isDevelopment) {
          console.log('[useProfile] Poll response:', response);
        }

        if (response.success && response.data) {
          const apiProfile = response.data.mode || response.data.profile;
          const apiConfig = response.data;
          const current = currentProfileRef.current;

          if (isDevelopment) {
            console.log(`[useProfile] Poll: API=${apiProfile}, Current=${current}`);
          }

          // Only update if the profile has changed
          if (apiProfile && apiProfile !== current) {
            console.log(`[useProfile] Profile change detected via polling: ${current} -> ${apiProfile}`);
            updateProfileState(apiProfile, apiConfig);
            saveProfile(apiProfile);
          }
        }
      } catch (err) {
        console.warn('[useProfile] Polling error:', err);
      }
    };

    // Poll immediately on mount, then every PROFILE_POLL_INTERVAL
    pollForProfileChanges();
    const pollInterval = setInterval(pollForProfileChanges, PROFILE_POLL_INTERVAL);

    return () => {
      clearInterval(pollInterval);
    };
  }, [isLoading, updateProfileState]);

  return {
    currentProfile,
    setProfile,
    profileConfig,
    isLoading,
    error,
  };
};

export default useProfile;
