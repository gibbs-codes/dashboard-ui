import React from 'react';

const MAX_MINUTES = 30;

const LINE_CONFIG = {
  red: {
    label: 'Red Line',
    primary: '#ef4444',
    badgeClass: 'bg-red-600/10 text-red-300',
  },
  brown: {
    label: 'Brown Line',
    primary: '#f59e0b',
    badgeClass: 'bg-amber-600/10 text-amber-200',
  },
};

const DIRECTION_LABELS = {
  north: 'Northbound',
  south: 'Southbound',
};

const sanitizeArrivals = (arrivals = [], direction = 'unknown') => {
  return (Array.isArray(arrivals) ? arrivals : [])
    .map((arrival, index) => {
      const minutes = Number(arrival?.minutesAway);

      if (!Number.isFinite(minutes) || minutes < 0) {
        return null;
      }

      const destination = arrival?.destination || arrival?.destNm || arrival?.headsign || '';

      return {
        minutes,
        destination,
        runNumber: arrival?.runNumber ?? '—',
        id: arrival?.runNumber ?? `${direction}-${index}`,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.minutes - b.minutes);
};

const formatMinutes = (minutes) => {
  if (minutes <= 0) return 'Due';
  if (minutes === 1) return '1 min';
  return `${Math.round(minutes)} min`;
};

const DirectionTrack = ({ direction, arrivals, color }) => {
  const processed = sanitizeArrivals(arrivals, direction);
  const trackArrivals = processed.filter(({ minutes }) => minutes <= MAX_MINUTES);
  const upcoming = processed.slice(0, 3);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold uppercase tracking-widest text-gray-400">
          {DIRECTION_LABELS[direction] || direction}
        </span>
        {upcoming[0] && (
          <span className="text-xs text-gray-500">
            Next <span className="font-semibold text-gray-200">{formatMinutes(upcoming[0].minutes)}</span>
          </span>
        )}
      </div>

      <div className="relative h-2 rounded-full bg-zinc-800 overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-1 bg-zinc-700" />

        {trackArrivals.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-500 uppercase tracking-wide">
            No trains within {MAX_MINUTES} min
          </div>
        ) : (
          trackArrivals.map((arrival) => {
            const position = Math.min((arrival.minutes / MAX_MINUTES) * 100, 100);

            return (
              <div key={`${direction}-${arrival.id}`} className="group">
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full shadow-lg border border-black transition-transform duration-300"
                  style={{
                    left: `${position}%`,
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: color,
                  }}
                />
                <div
                  className="absolute top-full mt-2 text-xs text-gray-300 whitespace-nowrap"
                  style={{
                    left: `${position}%`,
                    transform: 'translateX(-50%)',
                  }}
                >
                  {formatMinutes(arrival.minutes)}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="flex flex-col gap-2 text-sm">
        {upcoming.length === 0 ? (
          <div className="text-gray-500">No scheduled trains</div>
        ) : (
          upcoming.map((arrival, index) => (
            <div
              key={`${direction}-list-${arrival.id}-${index}`}
              className="flex items-center justify-between bg-zinc-900/60 border border-zinc-800 rounded-xl px-3 py-2"
            >
              <div className="flex flex-col">
                <span className="text-gray-200 font-semibold">{formatMinutes(arrival.minutes)}</span>
                {arrival.destination && (
                  <span className="text-xs uppercase tracking-wide text-gray-500">
                    {arrival.destination}
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-500">
                Run {arrival.runNumber}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const LineSection = ({ lineKey, arrivals }) => {
  const config = LINE_CONFIG[lineKey];

  if (!config || !arrivals) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6 bg-zinc-900/50 border border-zinc-800/80 rounded-3xl px-6 py-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold text-gray-100">{config.label}</h2>
        <span className={`text-xs uppercase tracking-widest px-3 py-1 rounded-full ${config.badgeClass}`}>
          {lineKey.toUpperCase()}
        </span>
      </div>

      <div className="flex flex-col gap-8">
        <DirectionTrack direction="north" arrivals={arrivals.north} color={config.primary} />
        <DirectionTrack direction="south" arrivals={arrivals.south} color={config.primary} />
      </div>
    </div>
  );
};

const AnimatedTransitDisplay = ({ data }) => {
  if (!data || (!data.red && !data.brown)) {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center text-gray-600">
        Transit data unavailable
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-black p-8 flex flex-col gap-8 overflow-y-auto">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {data.red && <LineSection lineKey="red" arrivals={data.red} />}
        {data.brown && <LineSection lineKey="brown" arrivals={data.brown} />}
      </div>
    </div>
  );
};

export default AnimatedTransitDisplay;
