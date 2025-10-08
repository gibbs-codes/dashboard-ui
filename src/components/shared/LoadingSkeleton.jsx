/**
 * LoadingSkeleton Component
 * Reusable skeleton loader for content placeholders
 */

import React from 'react';

/**
 * LoadingSkeleton
 * Displays an animated skeleton placeholder for loading content
 *
 * @param {Object} props
 * @param {string} props.width - Width of skeleton (CSS value, default: "100%")
 * @param {string} props.height - Height of skeleton (CSS value, default: "20px")
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.circle - Render as circle (default: false)
 * @param {number} props.count - Number of skeleton lines to render (default: 1)
 * @param {string} props.spacing - Spacing between multiple skeletons (default: "0.5rem")
 * @returns {JSX.Element}
 */
export const LoadingSkeleton = ({
  width = '100%',
  height = '20px',
  className = '',
  circle = false,
  count = 1,
  spacing = '0.5rem'
}) => {
  const baseClasses = `
    bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700
    bg-[length:200%_100%]
    animate-[shimmer_1.5s_ease-in-out_infinite]
    ${circle ? 'rounded-full' : 'rounded'}
  `;

  const style = {
    width: circle ? height : width,
    height,
  };

  // Render multiple skeletons if count > 1
  if (count > 1) {
    return (
      <div
        className={`flex flex-col ${className}`}
        style={{ gap: spacing }}
        role="status"
        aria-label="Loading"
      >
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className={baseClasses}
            style={style}
          />
        ))}
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  // Single skeleton
  return (
    <div
      className={`${baseClasses} ${className}`}
      style={style}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

/**
 * LoadingCard
 * Pre-built card skeleton for dashboard cards
 */
export const LoadingCard = ({ className = '' }) => {
  return (
    <div
      className={`
        bg-gray-800 rounded-lg p-6
        ${className}
      `}
      role="status"
      aria-label="Loading card"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <LoadingSkeleton width="120px" height="24px" />
        <LoadingSkeleton circle width="40px" height="40px" />
      </div>

      {/* Content */}
      <div className="space-y-3">
        <LoadingSkeleton width="100%" height="16px" />
        <LoadingSkeleton width="80%" height="16px" />
        <LoadingSkeleton width="90%" height="16px" />
      </div>

      {/* Footer */}
      <div className="mt-6 flex gap-2">
        <LoadingSkeleton width="80px" height="32px" />
        <LoadingSkeleton width="80px" height="32px" />
      </div>
    </div>
  );
};

/**
 * LoadingText
 * Skeleton for text content with multiple lines
 */
export const LoadingText = ({
  lines = 3,
  className = ''
}) => {
  return (
    <div className={`space-y-2 ${className}`} role="status" aria-label="Loading text">
      {Array.from({ length: lines }).map((_, index) => (
        <LoadingSkeleton
          key={index}
          width={index === lines - 1 ? '60%' : '100%'}
          height="16px"
        />
      ))}
    </div>
  );
};

/**
 * LoadingAvatar
 * Circular skeleton for avatars/profile pictures
 */
export const LoadingAvatar = ({
  size = '48px',
  className = ''
}) => {
  return (
    <LoadingSkeleton
      circle
      width={size}
      height={size}
      className={className}
    />
  );
};

export default LoadingSkeleton;
