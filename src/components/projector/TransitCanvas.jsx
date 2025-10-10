import React from 'react';
import { Bus } from 'lucide-react';
import AnimatedTransitDisplay from './AnimatedTransitDisplay';

/**
 * TransitCanvas Component
 * Displays CTA bus and train arrivals for projector
 *
 * @param {Object} props
 * @param {Object} props.data - Transit data
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element}
 */
export const TransitCanvas = ({
  data,
  className = ''
}) => {
  // Handle no data
  if (!data) {
    return (
      <div
        className={`
          h-full
          bg-black
          flex items-center justify-center
          ${className}
        `}
      >
        <div className="text-center">
          <Bus className="w-16 h-16 text-gray-600 mx-auto mb-4" strokeWidth={1.5} />
          <p className="text-xl text-gray-500">No transit data available</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        h-full
        bg-black
        text-white
        overflow-y-auto
        ${className}
      `}
      role="region"
      aria-label="Transit arrivals"
    >
      <AnimatedTransitDisplay data={data} />
    </div>
  );
};

export default TransitCanvas;