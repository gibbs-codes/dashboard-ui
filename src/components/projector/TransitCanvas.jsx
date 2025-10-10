/**
 * TransitCanvas Component
 * Displays CTA transit arrivals (buses and trains) for projector display
 */

import React from 'react';
import { Bus, Train } from 'lucide-react';

/**
 * Get urgency color based on arrival time in minutes
 * @param {number} minutes - Minutes until arrival
 * @returns {string} Tailwind color class
 */
const getUrgencyColor = (minutes) => {
  const min = parseInt(minutes, 10);

  if (isNaN(min)) return 'text-gray-400';

  if (min < 3) return 'text-red-400'; // Urgent - less than 3 min
  if (min <= 7) return 'text-yellow-400'; // Soon - 3-7 min
  return 'text-green-400'; // Normal - more than 7 min
};

/**
 * Format arrival time for display
 * @param {string|number} minutes - Minutes until arrival
 * @returns {string} Formatted string
 */
const formatArrival = (minutes) => {
  const min = parseInt(minutes, 10);

  if (isNaN(min)) return '--';
  if (min === 0) return 'Now';
  if (min === 1) return '1 min';

  return `${min} min`;
};

/**
 * TransitDirection Component
 * Shows arrivals for one direction
 */
const TransitDirection = ({ direction, arrivals, showIcon = false, Icon }) => {
  // Take first 3 arrivals
  const times = arrivals ? arrivals.slice(0, 3) : [];

  // Fill with placeholders if less than 3
  while (times.length < 3) {
    times.push(null);
  }

  return (
    <div className="flex items-center justify-between mb-4">
      {/* Direction label */}
      <div className="flex items-center gap-2 w-24">
        {showIcon && Icon && <Icon className="w-5 h-5 text-white" strokeWidth={2} />}
        <span className="text-lg font-semibold text-white uppercase">
          {direction}
        </span>
      </div>

      {/* Arrival times */}
      <div className="flex items-center gap-6">
        {times.map((time, index) => {
          const colorClass = time !== null ? getUrgencyColor(time) : 'text-gray-600';
          const displayTime = time !== null ? formatArrival(time) : '--';

          return (
            <div
              key={index}
              className={`
                text-2xl font-bold tabular-nums
                ${colorClass}
                min-w-[5rem]
                text-right
              `}
            >
              {displayTime}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * TransitSection Component
 * Shows a complete transit line (bus route or train line)
 */
const TransitSection = ({
  title,
  icon: Icon,
  directions,
  lineColor,
  lastSection = false
}) => {
  return (
    <div className={`py-6 ${!lastSection ? 'border-b border-gray-700' : ''}`}>
      {/* Section header */}
      <div className="flex items-center gap-3 mb-6">
        <Icon className={`w-8 h-8 ${lineColor}`} strokeWidth={2} />
        <h2 className="text-3xl font-bold text-white">{title}</h2>
      </div>

      {/* Directions */}
      <div className="space-y-3">
        {directions.map((dir, index) => (
          <TransitDirection
            key={dir.direction}
            direction={dir.direction}
            arrivals={dir.arrivals}
            showIcon={index === 0}
            Icon={index === 0 ? Icon : null}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * TransitCanvas Component
 * Displays CTA bus and train arrivals for projector
 *
 * @param {Object} props
 * @param {Object} props.data - Transit data
 * @param {Object} props.data.buses - Bus 77 data { east: [], west: [] }
 * @param {Object} props.data.red - Red Line data { north: [], south: [] }
 * @param {Object} props.data.brown - Brown Line data { north: [], south: [] }
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

  const { buses, red, brown } = data;

  return (
    <div
      className={`
        h-full
        bg-black
        text-white
        p-8
        overflow-y-auto
        ${className}
      `}
      role="region"
      aria-label="Transit arrivals"
    >
      {/* Red Line Section */}
      {red && (
        <TransitSection
          title="Red Line"
          icon={Train}
          lineColor="text-red-500"
          directions={[
            { direction: 'North', arrivals: red.north },
            { direction: 'South', arrivals: red.south },
          ]}
        />
      )}

      {/* Brown Line Section */}
      {brown && (
        <TransitSection
          title="Brown Line"
          icon={Train}
          lineColor="text-amber-600"
          directions={[
            { direction: 'North', arrivals: brown.north },
            { direction: 'South', arrivals: brown.south },
          ]}
          lastSection
        />
      )}
      
      {/* Bus 77 Section */}
      {buses && (
        <TransitSection
          title="Bus 77"
          icon={Bus}
          lineColor="text-blue-400"
          directions={[
            { direction: 'East', arrivals: buses.east },
            { direction: 'West', arrivals: buses.west },
          ]}
        />
      )}

      {/* No data message */}
      {!buses && !red && !brown && (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <Bus className="w-16 h-16 text-gray-600 mx-auto mb-4" strokeWidth={1.5} />
            <p className="text-xl text-gray-500">No transit data available</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransitCanvas;
