import React from 'react';

const MAX_MINUTES = 30; // Max minutes to display on the track

const TrainDot = ({ arrival, direction }) => {
  const { minutesAway, line } = arrival;

  const minutes = Number(minutesAway);
  if (isNaN(minutes) || minutes > MAX_MINUTES) {
    return null;
  }

  // Position from 0 (at station) to 50 (furthest away)
  const position = (minutes / MAX_MINUTES) * 50;

  const style = {
    backgroundColor: line === 'Red' ? '#EF4444' : '#A16207',
    transition: 'top 1s linear, bottom 1s linear',
    zIndex: 10,
  };

  if (direction === 'north') {
    // Northbound trains approach from the bottom
    style.bottom = `${50 - position}%`;
  } else {
    // Southbound trains approach from the top
    style.top = `${50 - position}%`;
  }

  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full shadow-lg"
      style={style}
    >
      <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-white text-xs font-bold">
        {minutesAway}'
      </div>
    </div>
  );
};

const LineTrack = ({ lineName, arrivals, colorClass }) => {
  if (!arrivals) return null;

  return (
    <div className="h-full flex flex-col mx-8 w-24">
      <h2 className={`text-3xl font-bold text-center mb-6 ${colorClass}`}>{lineName}</h2>
      <div className="relative w-1 bg-gray-700 flex-grow">
        {/* Northbound Arrivals */}
        {arrivals.north && arrivals.north.map((arrival) => (
          <TrainDot key={`north-${arrival.runNumber}`} arrival={arrival} direction="north" />
        ))}
        {/* Southbound Arrivals */}
        {arrivals.south && arrivals.south.map((arrival) => (
          <TrainDot key={`south-${arrival.runNumber}`} arrival={arrival} direction="south" />
        ))}
      </div>
    </div>
  );
};

const AnimatedTransitDisplay = ({ data }) => {
  if (!data || (!data.red && !data.brown)) {
    return <div className="w-full h-full bg-black" />;
  }

  const { red, brown } = data;

  return (
    <div className="w-full h-full bg-black p-8 flex flex-col overflow-hidden">
      {/* Station Line */}
      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-600 z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm bg-black px-3 py-1 rounded-md z-20">
        YOUR STATION
      </div>

      <div className="flex-grow flex items-center justify-center h-full">
        <LineTrack lineName="Red Line" arrivals={red} colorClass="text-red-500" />
        <LineTrack lineName="Brown Line" arrivals={brown} colorClass="text-amber-600" />
      </div>
    </div>
  );
};

export default AnimatedTransitDisplay;