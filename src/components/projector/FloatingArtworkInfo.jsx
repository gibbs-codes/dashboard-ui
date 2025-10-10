/**
 * FloatingArtworkInfo Component
 * Displays artwork details (title, artist, date) below canvas
 */

import React from 'react';

/**
 * FloatingArtworkInfo Component
 * Displays artwork information below the canvas
 *
 * @param {Object} props
 * @param {Object} props.artwork - Artwork data { title, artist, date }
 * @param {Object} props.style - Position and size styles
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element}
 */
export const FloatingArtworkInfo = ({ artwork, style, className = '' }) => {
  if (!artwork || (!artwork.title && !artwork.artist)) {
    return null;
  }

  const { title, artist, date } = artwork;

  return (
    <div
      className={`
        fixed
        px-6
        py-3
        bg-black/70
        backdrop-blur-md
        rounded-lg
        ${className}
      `}
      style={{
        textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
        ...style,
      }}
    >
      {title && (
        <h3 className="text-lg font-bold text-white mb-1">
          {title}
        </h3>
      )}
      {artist && (
        <p className="text-sm text-gray-300">
          {artist}
          {date && <span className="text-gray-400"> • {date}</span>}
        </p>
      )}
    </div>
  );
};

export default FloatingArtworkInfo;
