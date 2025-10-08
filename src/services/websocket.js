/**
 * WebSocket Service
 * Handles real-time communication with the dashboard backend
 */

import { WS_BASE_URL } from '../config/api.js';

/**
 * Check if running in development mode
 */
const isDevelopment = import.meta.env.DEV;

/**
 * WebSocket connection states
 */
export const WS_STATES = {
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  ERROR: 'error',
};

/**
 * WebSocket events
 */
export const WS_EVENTS = {
  CONNECTION: 'connection',
  DASHBOARD_UPDATE: 'dashboard:update',
  PROFILE_CHANGED: 'profile:changed',
  PONG: 'pong',
  ERROR: 'error',
  STATE_CHANGE: 'state:change',
};

/**
 * WebSocket Client
 * Manages WebSocket connections with auto-reconnect and heartbeat
 */
export class WebSocketClient {
  constructor() {
    this.ws = null;
    this.url = null;
    this.state = WS_STATES.DISCONNECTED;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000; // Initial delay: 1 second
    this.maxReconnectDelay = 30000; // Max delay: 30 seconds
    this.reconnectTimer = null;
    this.heartbeatInterval = 15000; // 15 seconds
    this.heartbeatTimer = null;
    this.lastPongTime = null;
    this.eventHandlers = new Map();
    this.shouldReconnect = false;

    // Bind methods to preserve context
    this._handleOpen = this._handleOpen.bind(this);
    this._handleMessage = this._handleMessage.bind(this);
    this._handleError = this._handleError.bind(this);
    this._handleClose = this._handleClose.bind(this);
  }

  /**
   * Connect to WebSocket server
   * @param {string} url - WebSocket URL (optional, defaults to WS_BASE_URL)
   * @returns {Promise<void>}
   */
  connect(url = WS_BASE_URL) {
    // If already connected or connecting, don't reconnect
    if (this.state === WS_STATES.CONNECTED || this.state === WS_STATES.CONNECTING) {
      if (isDevelopment) {
        console.log('[WebSocket] Already connected or connecting');
      }
      return Promise.resolve();
    }

    this.url = url;
    this.shouldReconnect = true;
    this._setState(WS_STATES.CONNECTING);

    return new Promise((resolve, reject) => {
      try {
        if (isDevelopment) {
          console.log('[WebSocket] Connecting to:', url);
        }

        this.ws = new WebSocket(url);

        // Set up event listeners
        this.ws.addEventListener('open', (event) => {
          this._handleOpen(event);
          resolve();
        });

        this.ws.addEventListener('message', this._handleMessage);
        this.ws.addEventListener('error', (event) => {
          this._handleError(event);
          reject(new Error('WebSocket connection failed'));
        });
        this.ws.addEventListener('close', this._handleClose);

      } catch (error) {
        if (isDevelopment) {
          console.error('[WebSocket] Connection error:', error);
        }
        this._setState(WS_STATES.ERROR);
        reject(error);
      }
    });
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect() {
    this.shouldReconnect = false;
    this._clearReconnectTimer();
    this._stopHeartbeat();

    if (this.ws) {
      if (isDevelopment) {
        console.log('[WebSocket] Disconnecting');
      }

      this.ws.close();
      this.ws = null;
    }

    this._setState(WS_STATES.DISCONNECTED);
  }

  /**
   * Subscribe to an event
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  subscribe(event, callback) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }

    this.eventHandlers.get(event).add(callback);

    if (isDevelopment) {
      console.log(`[WebSocket] Subscribed to event: ${event}`);
    }
  }

  /**
   * Unsubscribe from an event
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  unsubscribe(event, callback) {
    if (this.eventHandlers.has(event)) {
      this.eventHandlers.get(event).delete(callback);

      if (isDevelopment) {
        console.log(`[WebSocket] Unsubscribed from event: ${event}`);
      }
    }
  }

  /**
   * Send a message to the server
   * @param {string} event - Event name
   * @param {any} data - Data to send
   */
  send(event, data = {}) {
    if (this.state !== WS_STATES.CONNECTED) {
      console.warn('[WebSocket] Cannot send message - not connected');
      return false;
    }

    try {
      const message = JSON.stringify({ event, data });
      this.ws.send(message);

      if (isDevelopment) {
        console.log(`[WebSocket] Sent message:`, { event, data });
      }

      return true;
    } catch (error) {
      console.error('[WebSocket] Error sending message:', error);
      return false;
    }
  }

  /**
   * Get current connection state
   * @returns {string} Current state
   */
  getState() {
    return this.state;
  }

  /**
   * Check if connected
   * @returns {boolean} True if connected
   */
  isConnected() {
    return this.state === WS_STATES.CONNECTED;
  }

  /**
   * Handle connection open
   * @private
   */
  _handleOpen(event) {
    if (isDevelopment) {
      console.log('[WebSocket] Connected');
    }

    this._setState(WS_STATES.CONNECTED);
    this.reconnectAttempts = 0;
    this.reconnectDelay = 1000;
    this._startHeartbeat();

    // Emit connection event
    this._emit(WS_EVENTS.CONNECTION, { timestamp: Date.now() });
  }

  /**
   * Handle incoming message
   * @private
   */
  _handleMessage(event) {
    try {
      const message = JSON.parse(event.data);

      if (isDevelopment && message.event !== WS_EVENTS.PONG) {
        console.log('[WebSocket] Received message:', message);
      }

      // Handle pong messages for heartbeat
      if (message.event === WS_EVENTS.PONG) {
        this.lastPongTime = Date.now();
        return;
      }

      // Emit the event to subscribers
      this._emit(message.event, message.data);

    } catch (error) {
      console.error('[WebSocket] Error parsing message:', error);

      // Emit error event for parsing errors
      this._emit(WS_EVENTS.ERROR, {
        type: 'parse_error',
        message: error.message,
        raw: event.data,
      });
    }
  }

  /**
   * Handle connection error
   * @private
   */
  _handleError(event) {
    console.error('[WebSocket] Connection error:', event);

    this._setState(WS_STATES.ERROR);

    // Emit error event
    this._emit(WS_EVENTS.ERROR, {
      type: 'connection_error',
      message: 'WebSocket connection error',
      event,
    });
  }

  /**
   * Handle connection close
   * @private
   */
  _handleClose(event) {
    if (isDevelopment) {
      console.log('[WebSocket] Connection closed:', {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean,
      });
    }

    this._stopHeartbeat();
    this._setState(WS_STATES.DISCONNECTED);

    // Attempt to reconnect if we should
    if (this.shouldReconnect) {
      this._attemptReconnect();
    }
  }

  /**
   * Attempt to reconnect with exponential backoff
   * @private
   */
  _attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[WebSocket] Max reconnection attempts reached');

      this._emit(WS_EVENTS.ERROR, {
        type: 'max_reconnect_attempts',
        message: 'Failed to reconnect after maximum attempts',
        attempts: this.reconnectAttempts,
      });

      return;
    }

    this.reconnectAttempts++;

    // Calculate delay with exponential backoff
    const delay = Math.min(
      this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts - 1),
      this.maxReconnectDelay
    );

    if (isDevelopment) {
      console.log(`[WebSocket] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    }

    this._clearReconnectTimer();

    this.reconnectTimer = setTimeout(() => {
      if (this.shouldReconnect) {
        this.connect(this.url).catch(error => {
          console.error('[WebSocket] Reconnection failed:', error);
        });
      }
    }, delay);
  }

  /**
   * Start heartbeat ping/pong
   * @private
   */
  _startHeartbeat() {
    this._stopHeartbeat();

    this.heartbeatTimer = setInterval(() => {
      if (this.state === WS_STATES.CONNECTED) {
        // Check if we received a pong recently
        if (this.lastPongTime && (Date.now() - this.lastPongTime) > this.heartbeatInterval * 2) {
          console.warn('[WebSocket] Heartbeat timeout - connection may be stale');
          this.ws?.close();
          return;
        }

        // Send ping
        this.send('ping', { timestamp: Date.now() });
      }
    }, this.heartbeatInterval);

    // Initialize last pong time
    this.lastPongTime = Date.now();
  }

  /**
   * Stop heartbeat
   * @private
   */
  _stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  /**
   * Clear reconnect timer
   * @private
   */
  _clearReconnectTimer() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  /**
   * Set connection state
   * @private
   */
  _setState(newState) {
    if (this.state !== newState) {
      const oldState = this.state;
      this.state = newState;

      if (isDevelopment) {
        console.log(`[WebSocket] State changed: ${oldState} -> ${newState}`);
      }

      // Emit state change event
      this._emit(WS_EVENTS.STATE_CHANGE, {
        oldState,
        newState,
        timestamp: Date.now(),
      });
    }
  }

  /**
   * Emit event to subscribers
   * @private
   */
  _emit(event, data) {
    if (this.eventHandlers.has(event)) {
      this.eventHandlers.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`[WebSocket] Error in event handler for '${event}':`, error);
        }
      });
    }
  }

  /**
   * Clean up resources
   */
  destroy() {
    this.disconnect();
    this.eventHandlers.clear();
  }
}

/**
 * Singleton instance
 */
const wsClient = new WebSocketClient();

// Export singleton as default
export default wsClient;
