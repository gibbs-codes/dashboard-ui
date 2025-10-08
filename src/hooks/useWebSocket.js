/**
 * useWebSocket Hook
 * React hook wrapper for WebSocketClient service
 * Manages WebSocket connection lifecycle within React components
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import wsClient, { WS_EVENTS, WS_STATES } from '../services/websocket.js';
import { WS_BASE_URL } from '../config/api.js';

/**
 * Check if running in development mode
 */
const isDevelopment = import.meta.env.DEV;

/**
 * useWebSocket Hook
 * Provides WebSocket functionality to React components
 *
 * @param {string} url - WebSocket URL (optional, defaults to WS_BASE_URL)
 * @param {boolean} autoConnect - Auto-connect on mount (default: true)
 * @returns {Object} WebSocket state and methods
 *
 * @example
 * function MyComponent() {
 *   const { connected, subscribe, send } = useWebSocket();
 *
 *   useEffect(() => {
 *     if (connected) {
 *       const handleUpdate = (data) => {
 *         console.log('Dashboard updated:', data);
 *       };
 *
 *       subscribe('dashboard:update', handleUpdate);
 *
 *       // Cleanup
 *       return () => {
 *         unsubscribe('dashboard:update', handleUpdate);
 *       };
 *     }
 *   }, [connected, subscribe]);
 *
 *   return (
 *     <button onClick={() => send('ping', { timestamp: Date.now() })}>
 *       Send Ping
 *     </button>
 *   );
 * }
 */
export const useWebSocket = (url = WS_BASE_URL, autoConnect = true) => {
  const [connectionState, setConnectionState] = useState(wsClient.getState());
  const [connected, setConnected] = useState(wsClient.isConnected());

  // Ref to track if component is mounted
  const isMounted = useRef(true);

  /**
   * Handle WebSocket state changes
   */
  const handleStateChange = useCallback((data) => {
    if (!isMounted.current) return;

    const { newState } = data;

    if (isDevelopment) {
      console.log(`[useWebSocket] State changed to: ${newState}`);
    }

    setConnectionState(newState);
    setConnected(newState === WS_STATES.CONNECTED);
  }, []);

  /**
   * Subscribe to a WebSocket event
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  const subscribe = useCallback((event, callback) => {
    if (isDevelopment) {
      console.log(`[useWebSocket] Subscribing to event: ${event}`);
    }

    wsClient.subscribe(event, callback);

    // Return unsubscribe function for cleanup
    return () => {
      if (isDevelopment) {
        console.log(`[useWebSocket] Unsubscribing from event: ${event}`);
      }
      wsClient.unsubscribe(event, callback);
    };
  }, []);

  /**
   * Unsubscribe from a WebSocket event
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  const unsubscribe = useCallback((event, callback) => {
    if (isDevelopment) {
      console.log(`[useWebSocket] Unsubscribing from event: ${event}`);
    }

    wsClient.unsubscribe(event, callback);
  }, []);

  /**
   * Send a message via WebSocket
   * @param {string} event - Event name
   * @param {any} data - Data to send
   * @returns {boolean} True if message was sent
   */
  const send = useCallback((event, data = {}) => {
    if (!connected) {
      console.warn('[useWebSocket] Cannot send message - not connected');
      return false;
    }

    return wsClient.send(event, data);
  }, [connected]);

  /**
   * Manually connect to WebSocket
   * @returns {Promise<void>}
   */
  const connect = useCallback(async () => {
    try {
      await wsClient.connect(url);

      if (isDevelopment) {
        console.log('[useWebSocket] Connected successfully');
      }
    } catch (error) {
      console.error('[useWebSocket] Connection failed:', error);
    }
  }, [url]);

  /**
   * Manually disconnect from WebSocket
   */
  const disconnect = useCallback(() => {
    if (isDevelopment) {
      console.log('[useWebSocket] Disconnecting');
    }

    wsClient.disconnect();
  }, []);

  /**
   * Auto-connect on mount and subscribe to state changes
   */
  useEffect(() => {
    // Subscribe to state changes
    wsClient.subscribe(WS_EVENTS.STATE_CHANGE, handleStateChange);

    // Auto-connect if enabled
    if (autoConnect && wsClient.getState() === WS_STATES.DISCONNECTED) {
      if (isDevelopment) {
        console.log('[useWebSocket] Auto-connecting on mount');
      }

      wsClient.connect(url).catch(error => {
        console.error('[useWebSocket] Auto-connect failed:', error);
      });
    } else {
      // Sync initial state
      setConnectionState(wsClient.getState());
      setConnected(wsClient.isConnected());
    }

    return () => {
      isMounted.current = false;
      wsClient.unsubscribe(WS_EVENTS.STATE_CHANGE, handleStateChange);

      // Note: We don't disconnect here because WebSocket is shared across components
      // The singleton connection should persist across component lifecycles
    };
  }, [url, autoConnect, handleStateChange]);

  return {
    connected,
    connectionState,
    subscribe,
    unsubscribe,
    send,
    connect,
    disconnect,
  };
};

export default useWebSocket;
