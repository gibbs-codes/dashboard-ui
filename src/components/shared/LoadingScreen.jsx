/**
 * LoadingScreen Component
 * Full-screen loading indicator with spinner and message
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * LoadingScreen
 * Displays a full-screen loading state with animated spinner
 *
 * @param {Object} props
 * @param {string} props.message - Loading message to display (default: "Loading Dashboard...")
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element}
 */
export const LoadingScreen = ({
  message = 'Loading Dashboard...',
  className = ''
}) => {
  return (
    <div
      className={`
        min-h-screen w-full
        flex flex-col items-center justify-center
        bg-gray-900 text-white
        ${className}
      `}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      {/* Animated Spinner */}
      <div className="mb-6">
        <Loader2
          className="w-16 h-16 text-blue-500 animate-spin"
          strokeWidth={2}
        />
      </div>

      {/* Loading Message */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-100 mb-2">
          {message}
        </h2>
        <p className="text-sm text-gray-400">
          Please wait while we fetch your data
        </p>
      </div>

      {/* Optional: Loading dots animation */}
      <div className="mt-8 flex space-x-2">
        <div
          className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"
          style={{ animationDelay: '0ms' }}
        />
        <div
          className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"
          style={{ animationDelay: '150ms' }}
        />
        <div
          className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"
          style={{ animationDelay: '300ms' }}
        />
      </div>
    </div>
  );
};

export default LoadingScreen;
