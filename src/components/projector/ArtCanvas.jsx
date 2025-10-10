/**
 * ArtCanvas Component
 * Decorative animated art display for projector
 */

import React, { useState, useEffect } from 'react';

/**
 * Art Styles
 */
const ART_STYLES = {
  GRADIENT: 'gradient',
  CIRCLES: 'circles',
  LINES: 'lines',
  WAVES: 'waves',
};

/**
 * Gradient Art Style
 * Slow animated gradient background
 */
const GradientArt = () => {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <div
        className="absolute inset-0 animate-gradient-shift"
        style={{
          background: 'linear-gradient(45deg, #1e3a8a, #7c3aed, #ec4899, #f59e0b, #10b981)',
          backgroundSize: '400% 400%',
        }}
      />
      {/* Add keyframes via style tag */}
      <style>{`
        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient-shift {
          animation: gradient-shift 30s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

/**
 * Circles Art Style
 * Concentric circles with opacity and pulse
 */
const CirclesArt = () => {
  const circles = [
    { size: '20%', delay: 0, opacity: 0.1 },
    { size: '40%', delay: 5, opacity: 0.15 },
    { size: '60%', delay: 10, opacity: 0.2 },
    { size: '80%', delay: 15, opacity: 0.15 },
    { size: '100%', delay: 20, opacity: 0.1 },
  ];

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-indigo-950 to-black">
      {circles.map((circle, index) => (
        <div
          key={index}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-purple-500 animate-pulse-slow"
          style={{
            width: circle.size,
            height: circle.size,
            opacity: circle.opacity,
            animationDelay: `${circle.delay}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes pulse-slow {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.1;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.05);
            opacity: 0.3;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 40s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

/**
 * Lines Art Style
 * Geometric line patterns
 */
const LinesArt = () => {
  const lines = Array.from({ length: 12 }, (_, i) => ({
    angle: i * 30,
    delay: i * 2,
  }));

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-slate-900 to-black">
      <div className="absolute inset-0 flex items-center justify-center">
        {lines.map((line, index) => (
          <div
            key={index}
            className="absolute w-1 h-full bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent animate-rotate-slow"
            style={{
              transform: `rotate(${line.angle}deg)`,
              transformOrigin: 'center',
              animationDelay: `${line.delay}s`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes rotate-slow {
          0% {
            opacity: 0.1;
          }
          50% {
            opacity: 0.4;
          }
          100% {
            opacity: 0.1;
          }
        }
        .animate-rotate-slow {
          animation: rotate-slow 35s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

/**
 * Waves Art Style
 * Wavy animated pattern
 */
const WavesArt = () => {
  const waves = [
    { delay: 0, opacity: 0.1, duration: 30 },
    { delay: 10, opacity: 0.15, duration: 35 },
    { delay: 20, opacity: 0.2, duration: 40 },
  ];

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-blue-950 to-black">
      {waves.map((wave, index) => (
        <div
          key={index}
          className="absolute inset-0 animate-wave"
          style={{
            background: `radial-gradient(ellipse at center, transparent 40%, rgba(59, 130, 246, ${wave.opacity}) 100%)`,
            animationDelay: `${wave.delay}s`,
            animationDuration: `${wave.duration}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes wave {
          0%, 100% {
            transform: scale(1) translateY(0);
            opacity: 0.3;
          }
          25% {
            transform: scale(1.1) translateY(-5%);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.2) translateY(0);
            opacity: 0.4;
          }
          75% {
            transform: scale(1.1) translateY(5%);
            opacity: 0.5;
          }
        }
        .animate-wave {
          animation: wave 30s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

/**
 * Generative Art Fallback
 * Shows cycling generative art patterns when no artwork is provided
 */
const GenerativeArtFallback = ({ cycleInterval = 300000 }) => {
  const styles = Object.values(ART_STYLES);
  const [currentStyleIndex, setCurrentStyleIndex] = useState(() => {
    return Math.floor(Math.random() * styles.length);
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStyleIndex((prev) => (prev + 1) % styles.length);
    }, cycleInterval);

    return () => clearInterval(interval);
  }, [cycleInterval, styles.length]);

  const currentStyle = styles[currentStyleIndex];

  const renderArt = () => {
    switch (currentStyle) {
      case ART_STYLES.GRADIENT:
        return <GradientArt />;
      case ART_STYLES.CIRCLES:
        return <CirclesArt />;
      case ART_STYLES.LINES:
        return <LinesArt />;
      case ART_STYLES.WAVES:
        return <WavesArt />;
      default:
        return <GradientArt />;
    }
  };

  return (
    <div className="h-full w-full transition-opacity duration-1000">
      {renderArt()}
    </div>
  );
};

/**
 * ArtCanvas Component
 * Displays artwork from Art Institute of Chicago or decorative generative art
 *
 * @param {Object} props
 * @param {Object} props.artwork - Artwork data { imageUrl, title, artist, date }
 * @param {string} props.className - Additional CSS classes
 * @param {number} props.cycleInterval - Time in ms to cycle generative art styles (default: 300000 = 5 min)
 * @returns {JSX.Element}
 */
export const ArtCanvas = ({
  artwork = null,
  className = '',
  cycleInterval = 300000 // 5 minutes
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Reset states when artwork changes
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [artwork?.imageUrl]);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  // Show generative art if no artwork or image failed to load
  const showGenerativeArt = !artwork?.imageUrl || imageError;

  return (
    <div
      className={`
        h-full
        w-full
        overflow-hidden
        bg-black
        ${className}
      `}
      role="presentation"
      aria-label={artwork?.title ? `Artwork: ${artwork.title}` : 'Decorative art display'}
    >
      {showGenerativeArt ? (
        // Fallback to generative art
        <GenerativeArtFallback cycleInterval={cycleInterval} />
      ) : (
        // Display artwork image
        <div className="relative h-full w-full">
          {/* Loading state - show generative art while loading */}
          {!imageLoaded && (
            <div className="absolute inset-0">
              <GenerativeArtFallback cycleInterval={cycleInterval} />
            </div>
          )}

          {/* Artwork image */}
          <img
            src={artwork.imageUrl}
            alt={artwork.title || 'Artwork'}
            onLoad={handleImageLoad}
            onError={handleImageError}
            className={`
              w-full
              h-full
              object-cover
              transition-opacity
              duration-1000
              ${imageLoaded ? 'opacity-100' : 'opacity-0'}
            `}
          />
        </div>
      )}
    </div>
  );
};

export default ArtCanvas;
