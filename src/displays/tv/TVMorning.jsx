/**
 * TVMorning Component
 * Morning-specific TV display (6am-10am): Shows tasks, calendar, and artwork
 * Outside morning hours: Reverts to pure art display
 */

import React from 'react';
import { ArtCanvas } from '../../components/projector/ArtCanvas';
import { Calendar, CheckSquare, Clock } from 'lucide-react';

/**
 * Format time in 12-hour format
 */
const formatTime = (date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const hours12 = hours % 12 || 12;
  const period = hours >= 12 ? 'PM' : 'AM';
  const formattedMinutes = minutes.toString().padStart(2, '0');
  return `${hours12}:${formattedMinutes} ${period}`;
};

/**
 * Format event time
 */
const formatEventTime = (eventTime) => {
  if (!eventTime) return '';
  const date = new Date(eventTime);
  return formatTime(date);
};

/**
 * Check if current time is within morning hours (6am-10am)
 */
const isMorningHours = () => {
  const now = new Date();
  const hour = now.getHours();
  return hour >= 6 && hour < 10;
};

/**
 * MorningOverlay Component
 * Displays tasks and calendar events in morning hours
 */
const MorningOverlay = ({ data }) => {
  const { tasks = [], nextEvent = null } = data;

  // Take only top 3 urgent tasks
  const urgentTasks = tasks.slice(0, 3);

  return (
    <div className="absolute top-16 left-16 right-16 pointer-events-none">
      <div className="flex gap-8 items-start">
        {/* Next Event Card */}
        {nextEvent && (
          <div className="backdrop-blur-xl bg-black/40 rounded-2xl px-8 py-6 drop-shadow-[0_8px_32px_rgba(0,0,0,0.6)] border border-white/10 flex-1 max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-blue-400" strokeWidth={1.5} />
              <h3 className="text-lg font-light text-white/90 uppercase tracking-wide">Next Event</h3>
            </div>
            <div>
              <h4 className="text-2xl font-light text-white mb-2">{nextEvent.title || nextEvent.summary}</h4>
              {nextEvent.start && (
                <div className="flex items-center gap-2 text-white/70">
                  <Clock className="w-4 h-4" strokeWidth={1.5} />
                  <p className="text-base font-light">{formatEventTime(nextEvent.start || nextEvent.startTime)}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Urgent Tasks Card */}
        {urgentTasks.length > 0 && (
          <div className="backdrop-blur-xl bg-black/40 rounded-2xl px-8 py-6 drop-shadow-[0_8px_32px_rgba(0,0,0,0.6)] border border-white/10 flex-1 max-w-xl">
            <div className="flex items-center gap-3 mb-4">
              <CheckSquare className="w-6 h-6 text-amber-400" strokeWidth={1.5} />
              <h3 className="text-lg font-light text-white/90 uppercase tracking-wide">Today's Tasks</h3>
            </div>
            <ul className="space-y-3">
              {urgentTasks.map((task, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                  <span className="text-base font-light text-white/90 leading-relaxed">
                    {task.title || task.content || task.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * TVMorning Component
 * Shows productivity overlay (tasks/calendar) during morning hours (6am-10am)
 * Reverts to pure art display outside those hours
 *
 * Expected API data structure:
 * {
 *   artworkTV: { imageUrl, title, artist, date, source },
 *   weather: { temp, condition, icon },
 *   tasks: [{ title, due, completed }],
 *   nextEvent: { title, start, end }
 * }
 */
export const TVMorning = ({ data = {} }) => {
  const { artworkTV: artwork = null } = data;
  const [showMorningMode, setShowMorningMode] = React.useState(isMorningHours());
  const [currentTime, setCurrentTime] = React.useState(new Date());

  // Update clock every second
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Check every minute if we're still in morning hours
  React.useEffect(() => {
    const interval = setInterval(() => {
      setShowMorningMode(isMorningHours());
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen w-screen relative">
      {/* Fullpage Art Background */}
      <ArtCanvas
        artwork={artwork}
        className="absolute inset-0"
        cycleInterval={300000} // 5 minutes
      />

      {/* Darker gradient overlay during morning mode for better text visibility */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${
        showMorningMode
          ? 'bg-gradient-to-b from-black/60 via-black/30 to-black/60'
          : 'bg-gradient-to-b from-black/20 via-transparent to-black/40'
      }`} />

      {/* Morning Overlay (6am-10am only) */}
      {showMorningMode && <MorningOverlay data={data} />}

      {/* Time Display - Bottom Left (always visible) */}
      <div className="absolute bottom-16 left-16">
        <div className="text-white">
          <div className="text-8xl font-extralight tracking-tighter tabular-nums drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
            {formatTime(currentTime)}
          </div>
        </div>
      </div>

      {/* Artwork Info - Bottom Right (only outside morning hours) */}
      {!showMorningMode && artwork?.title && (
        <div className="absolute bottom-16 right-16 max-w-md text-right">
          <div className="backdrop-blur-md bg-black/25 rounded-xl px-6 py-4 drop-shadow-[0_4px_20px_rgba(0,0,0,0.7)]">
            <h2 className="text-xl font-light text-white mb-1">
              {artwork.title}
            </h2>
            {artwork.artist && (
              <p className="text-sm font-light text-white/85">
                {artwork.artist}
              </p>
            )}
            {artwork.date && (
              <p className="text-xs font-light text-white/60 mt-1">
                {artwork.date}
              </p>
            )}
            {artwork.source && (
              <p className="text-xs font-light text-white/50 mt-2 italic">
                {artwork.source === 'artic' && 'Art Institute of Chicago'}
                {artwork.source === 'met' && 'Metropolitan Museum of Art'}
                {artwork.source === 'cleveland' && 'Cleveland Museum of Art'}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TVMorning;
