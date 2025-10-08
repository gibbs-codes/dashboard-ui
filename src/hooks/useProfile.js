/**
 * useProfile Hook
 * Manages profile state with API sync, WebSocket updates, and localStorage persistence
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { getProfile, PROFILES } from '../config/profiles.js';
import { getProfile as getProfileFromAPI, setProfile as setProfileViaAPI } from '../services/api.js';
import { saveProfile, getProfile as getProfileFromStorage } from '../services/storage.js';
import wsClient, { WS_EVENTS } from '../services/websocket.js';

/**
 * Check if running in development mode
 */
const isDevelopment = import.meta.env.DEV;

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
  const [profileConfig, setProfileConfig] = useState(getProfile(defaultProfile));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ref to track if component is mounted
  const isMounted = useRef(true);

  // Ref to track the previous profile for rollback
  const previousProfile = useRef(defaultProfile);

  /**
   * Validate if a profile is supported by the current display
   * @param {string} profileId - Profile ID to validate
   * @returns {boolean} True if profile is supported
   */
  const isProfileSupported = useCallback((profileId) => {
    const profile = getProfile(profileId);
    if (!profile) {
      if (isDevelopment) {
        console.warn(`[useProfile] Profile not found: ${profileId}`);
      }
      return false;
    }

    // For now, we'll allow all valid profiles
    // In production, you could check against DISPLAY_CONFIGS.supportedProfiles
    return true;
  }, []);

  /**
   * Update profile state and config
   * @param {string} profileId - Profile ID to set
   */
  const updateProfileState = useCallback((profileId) => {
    if (!isMounted.current) return;

    const config = getProfile(profileId);

    if (config) {
      setCurrentProfile(profileId);
      setProfileConfig(config);
      previousProfile.current = profileId;

      if (isDevelopment) {
        console.log(`[useProfile] Profile updated: ${profileId}`);
      }
    } else {
      console.error(`[useProfile] Invalid profile: ${profileId}`);
      setError(`Invalid profile: ${profileId}`);
    }
  }, []);

  /**
   * Fetch initial profile from API
   */
  const fetchInitialProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // First, try to get from localStorage
      const cachedProfile = getProfileFromStorage();

      if (cachedProfile && isProfileSupported(cachedProfile)) {
        if (isDevelopment) {
          console.log(`[useProfile] Using cached profile: ${cachedProfile}`);
        }
        updateProfileState(cachedProfile);
      }

      // Then fetch from API to ensure sync
      const response = await getProfileFromAPI();

      if (response.success && response.data?.profile) {
        const apiProfile = response.data.profile;

        if (isProfileSupported(apiProfile)) {
          updateProfileState(apiProfile);
          saveProfile(apiProfile);
        } else {
          console.warn(`[useProfile] API returned unsupported profile: ${apiProfile}, using default`);
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

      if (cachedProfile && isProfileSupported(cachedProfile)) {
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
  }, [defaultProfile, isProfileSupported, updateProfileState]);

  /**
   * Set a new profile (with optimistic update and rollback on error)
   * @param {string} newProfile - Profile ID to set
   * @returns {Promise<boolean>} True if successful
   */
  const setProfile = useCallback(async (newProfile) => {
    if (!isProfileSupported(newProfile)) {
      const errorMsg = `Profile '${newProfile}' is not supported on this display`;
      console.error(`[useProfile] ${errorMsg}`);
      setError(errorMsg);
      return false;
    }

    // Store previous profile for potential rollback
    const rollbackProfile = currentProfile;

    try {
      // Optimistic update
      updateProfileState(newProfile);
      saveProfile(newProfile);
      setError(null);

      if (isDevelopment) {
        console.log(`[useProfile] Setting profile to: ${newProfile}`);
      }

      // Persist to API
      const response = await setProfileViaAPI(newProfile);

      if (!response.success) {
        throw new Error(response.error || 'Failed to set profile');
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

      updateProfileState(rollbackProfile);
      saveProfile(rollbackProfile);

      const errorMsg = err.message || 'Failed to set profile';
      setError(errorMsg);

      return false;
    }
  }, [currentProfile, isProfileSupported, updateProfileState]);

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

    // Validate and update
    if (isProfileSupported(newProfile)) {
      updateProfileState(newProfile);
      saveProfile(newProfile);
    } else {
      console.warn(`[useProfile] Received unsupported profile via WebSocket: ${newProfile}`);
    }
  }, [currentProfile, isProfileSupported, updateProfileState]);

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

  return {
    currentProfile,
    setProfile,
    profileConfig,
    isLoading,
    error,
  };
};

export default useProfile;
