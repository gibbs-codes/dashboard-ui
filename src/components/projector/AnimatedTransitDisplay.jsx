import React from 'react';

const MAX_MINUTES = 30;
const TRACK_SPAN_PERCENT = 40;

const LINE_CONFIG = {
  red: {
    label: 'Red Line',
    short: 'RED',
    primary: '#ef4444',
    badgeClass: 'bg-red-600/10 text-red-300',
  },
  brown: {
    label: 'Brown Line',
    short: 'BRN',
    primary: '#f59e0b',
    badgeClass: 'bg-amber-600/10 text-amber-200',
  },
  default: {
    label: 'Line',
    short: 'LINE',
    primary: '#38bdf8',
    badgeClass: 'bg-sky-600/10 text-sky-200',
  },
};

const DIRECTION_LABELS = {
  north: 'North',
  south: 'South',
};

const formatMinutes = (minutes) => {
  if (minutes <= 0) return 'Due';
  return `${Math.round(minutes)}`;
};

const getLineConfig = (lineKey) => LINE_CONFIG[lineKey] || LINE_CONFIG.default;

const sanitizeLineDirectionArrivals = (lineKey, direction, lineData = {}) => {
  const arrivals = Array.isArray(lineData?.[direction]) ? lineData[direction] : [];

  return arrivals
    .map((arrival, index) => {
      const minutes = Number(arrival?.minutesAway);
      if (!Number.isFinite(minutes)) {
        return null;
      }

      const destination = arrival?.destination || arrival?.destNm || arrival?.headsign || '';

      return {
        id: arrival?.runNumber ?? `${lineKey}-${direction}-${index}`,
        minutes,
        destination,
        runNumber: arrival?.runNumber ?? '—',
        lineKey,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.minutes - b.minutes);
};

const buildLineDirectionMap = (data = {}) => {
  return Object.entries(data).reduce((acc, [lineKey, lineData]) => {
    if (!lineData) return acc;

    const north = sanitizeLineDirectionArrivals(lineKey, 'north', lineData);
    const south = sanitizeLineDirectionArrivals(lineKey, 'south', lineData);

    if (north.length === 0 && south.length === 0) {
      return acc;
    }

    acc[lineKey] = { north, south };
    return acc;
  }, {});
};

const buildDirectionAggregates = (lineDirectionMap) => {
  return Object.keys(DIRECTION_LABELS).reduce((acc, direction) => {
    const aggregated = Object.values(lineDirectionMap)
      .flatMap((directionData) => directionData[direction] || [])
      .filter(({ minutes }) => minutes > 0 && minutes <= MAX_MINUTES)
      .sort((a, b) => a.minutes - b.minutes);

    acc[direction] = aggregated;
    return acc;
  }, {});
};

const computeDotPositionPercent = (minutes, direction) => {
  const ratio = Math.min(Math.max(minutes, 0) / MAX_MINUTES, 1);

  if (direction === 'north') {
    return 50 + ratio * TRACK_SPAN_PERCENT;
  }

  return 50 - ratio * TRACK_SPAN_PERCENT;
};

const TrainDot = ({ arrival, direction }) => {
  const { lineKey, minutes } = arrival;
  const config = getLineConfig(lineKey);
  const topPercent = computeDotPositionPercent(minutes, direction);
  const positionClasses =
    direction === 'north'
      ? 'right-0 translate-x-1/2 flex-row'
      : 'left-0 -translate-x-1/2 flex-row-reverse';

  return (
    <div className={`absolute flex items-center gap-2 transform ${positionClasses}`} style={{ top: `${topPercent}%` }}>
      <span
        className="w-4 h-4 rounded-full shadow-lg border border-black"
        style={{ backgroundColor: config.primary }}
      />
      <span className="text-sm font-semibold text-gray-200">
        {formatMinutes(minutes)}
      </span>
    </div>
  );
};

const DirectionTrackVisual = ({ direction, arrivals }) => {
  const displayArrivals = arrivals.filter(({ minutes }) => minutes > 0 && minutes <= MAX_MINUTES);

  return (
    <div className="relative flex flex-col items-center w-32">
      <span className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-400">
        {DIRECTION_LABELS[direction]}
      </span>
      <div className="relative flex-[3] w-3 bg-zinc-900/80 border border-zinc-800 mt-6 mb-6 rounded-full overflow-visible">
        <div
          className={`absolute inset-0 ${direction === 'north' ? 'right-0' : 'left-0'} w-[2px] bg-zinc-600`}
        />

        {displayArrivals.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-[10px] text-gray-600 uppercase tracking-widest">
            No arrivals
          </div>
        ) : (
          displayArrivals.map((arrival) => (
            <TrainDot key={`${direction}-${arrival.id}`} arrival={arrival} direction={direction} />
          ))
        )}
      </div>
    </div>
  );
};

const StationMarker = () => (
  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
    <div className="flex flex-col items-center gap-2">
      <div className="w-32 h-1 bg-gray-600/60" />
      <span className="px-4 py-1 text-xs font-semibold tracking-[0.25em] text-black uppercase bg-gray-200 rounded-full">
        Belmont
      </span>
      <div className="w-32 h-1 bg-gray-600/60" />
    </div>
  </div>
);

const BottomLineSection = ({ lineKey, direction, arrivals }) => {
  const config = getLineConfig(lineKey);
  const upcoming = arrivals.filter(({ minutes }) => minutes >= 0).slice(0, 3);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <span
          className="text-xs font-semibold uppercase tracking-[0.25em]"
          style={{ color: config.primary }}
        >
          {config.short}
        </span>
        <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500">
          {direction === 'north' ? 'NB' : 'SB'}
        </span>
      </div>

      <div className="flex gap-2 text-sm text-gray-200">
        {upcoming.length === 0 ? (
          <span className="text-xs text-gray-600">—</span>
        ) : (
          upcoming.map((arrival) => (
            <span key={`${direction}-list-${arrival.id}`} className="px-2 py-1 rounded-md bg-zinc-800/80 text-xs">
              {formatMinutes(arrival.minutes)}
            </span>
          ))
        )}
      </div>
    </div>
  );
};

const BottomList = ({ lineDirectionMap }) => {
  const lineEntries = Object.entries(lineDirectionMap);
  const directionOrder = ['south', 'north'];

  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      {directionOrder.map((direction) => (
        <div
          key={direction}
          className="bg-zinc-900/60 border border-zinc-800 rounded-2xl px-3 py-2 flex flex-col gap-2"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-100">
              {DIRECTION_LABELS[direction]}
            </h3>
            <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500">
              Next
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            {lineEntries.map(([lineKey, directionData]) => (
              <BottomLineSection
                key={`${direction}-${lineKey}`}
                lineKey={lineKey}
                direction={direction}
                arrivals={directionData[direction] || []}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const AnimatedTransitDisplay = ({ data }) => {
  const lineDirectionMap = buildLineDirectionMap(data);
  const hasLines = Object.keys(lineDirectionMap).length > 0;

  if (!hasLines) {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center text-gray-600">
        Transit data unavailable
      </div>
    );
  }

  const directionArrivals = buildDirectionAggregates(lineDirectionMap);

  return (
    <div className="w-full h-full bg-black px-8 py-4 flex flex-col gap-4 overflow-hidden">
      <div className="flex-[4] relative flex items-stretch justify-center gap-20">
        <DirectionTrackVisual direction="south" arrivals={directionArrivals.south} />
        <DirectionTrackVisual direction="north" arrivals={directionArrivals.north} />
        <StationMarker />
      </div>

      <div className="flex-[0.8] overflow-hidden">
        <BottomList lineDirectionMap={lineDirectionMap} />
      </div>
    </div>
  );
};

export default AnimatedTransitDisplay;
