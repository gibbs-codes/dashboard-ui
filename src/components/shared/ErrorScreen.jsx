/**
 * ErrorScreen Component
 * Full-screen error display with retry functionality
 */

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

/**
 * ErrorScreen
 * Displays a full-screen error state with retry option
 *
 * @param {Object} props
 * @param {string} props.error - Error message to display
 * @param {Function} props.onRetry - Callback function when retry button is clicked
 * @param {string} props.title - Error title (default: "Something went wrong")
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element}
 */
export const ErrorScreen = ({
  error = 'An unexpected error occurred',
  onRetry,
  title = 'Something went wrong',
  className = ''
}) => {
  return (
    <div
      className={`
        min-h-screen w-full
        flex flex-col items-center justify-center
        bg-gray-900 text-white
        px-6
        ${className}
      `}
      role="alert"
      aria-live="assertive"
    >
      {/* Error Icon */}
      <div className="mb-6">
        <div className="relative">
          {/* Pulsing background circle */}
          <div className="absolute inset-0 bg-red-500/20 rounded-full animate-pulse" />

          {/* Icon */}
          <div className="relative bg-red-500/10 p-6 rounded-full border-2 border-red-500/30">
            <AlertCircle
              className="w-16 h-16 text-red-500"
              strokeWidth={2}
            />
          </div>
        </div>
      </div>

      {/* Error Content */}
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-bold text-gray-100 mb-3">
          {title}
        </h1>

        <p className="text-lg text-red-400 mb-2">
          {error}
        </p>

        <p className="text-sm text-gray-400 mb-8">
          Please try again or contact support if the problem persists.
        </p>

        {/* Retry Button */}
        {onRetry && (
          <button
            onClick={onRetry}
            className="
              inline-flex items-center gap-2
              px-6 py-3
              bg-red-600 hover:bg-red-700
              text-white font-semibold
              rounded-lg
              transition-all duration-200
              transform hover:scale-105
              focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900
              shadow-lg hover:shadow-red-500/50
            "
            aria-label="Retry loading"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Retry</span>
          </button>
        )}
      </div>

      {/* Additional Info */}
      <div className="mt-12 text-center">
        <p className="text-xs text-gray-500">
          Error occurred at {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default ErrorScreen;
