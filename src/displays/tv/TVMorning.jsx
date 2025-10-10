/**
 * TVMorning Component
 * Morning briefing layout for TV display
 */

import React from 'react';
import { DateDisplay } from '../../components/shared/DateDisplay';
import { getGreeting } from '../../utils/dateTime';
import { Calendar, CheckCircle, CloudSun, Clock, Bus, Train } from 'lucide-react';

/**
 * StatCard Component
 * Displays a statistic with icon
 */
const StatCard = ({ icon: Icon, value, label, iconColor = 'text-blue-400' }) => {
  return (
    <div className="flex-1 tv-glass-card rounded-lg p-6 shadow-2xl">
      <div className="flex items-center gap-4">
        <Icon className={`w-10 h-10 ${iconColor}`} strokeWidth={1.5} />
        <div>
          <div className="text-4xl font-bold text-white">{value}</div>
          <div className="text-sm text-white/70">{label}</div>
        </div>
      </div>
    </div>
  );
};

/**
 * EventsList Component
 * Shows next 3 events
 */
const EventsList = ({ events = [] }) => {
  if (!events || events.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-white/60">
        <p className="text-lg">No events scheduled</p>
      </div>
    );
  }

  const upcomingEvents = events
    .filter(event => new Date(event.start) > new Date())
    .slice(0, 3);

  if (upcomingEvents.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-white/60">
        <p className="text-lg">No upcoming events</p>
      </div>
    );
  }

  /**
   * Format event time
   * @param {string} dateStr - ISO datetime string
   * @returns {string} Formatted time
   */
  const formatEventTime = (dateStr) => {
    const date = new Date(dateStr);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    return `${displayHours}:${displayMinutes} ${ampm}`;
  };

  return (
    <div className="space-y-4 text-white">
      {upcomingEvents.map((event, idx) => (
        <div key={event.id || idx} className="flex gap-4 items-start">
          <Clock className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" strokeWidth={1.5} />
          <div className="flex-1">
            <div className="font-bold text-xl mb-1">{event.title}</div>
            <div className="text-white/70 text-sm">
              {formatEventTime(event.start)}
              {event.location && (
                <span className="ml-2">• {event.location}</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * TasksList Component
 * Shows top 3 urgent tasks
 */
const TasksList = ({ tasks = [] }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-white/60">
        <p className="text-lg">No tasks due</p>
      </div>
    );
  }

  const urgentTasks = tasks
    .filter(task => !task.completed)
    .sort((a, b) => {
      // Sort by due date if available
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      // Tasks with due dates come first
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      // Then by priority
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return (priorityOrder[a.priority] || 3) - (priorityOrder[b.priority] || 3);
    })
    .slice(0, 3);

  if (urgentTasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-white/60">
        <p className="text-lg">All tasks complete!</p>
      </div>
    );
  }

  /**
   * Get priority color
   * @param {string} priority - high, medium, low
   * @returns {string} Tailwind color class
   */
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  /**
   * Format due time
   * @param {string} dateStr - ISO datetime string
   * @returns {string} Formatted due time
   */
  const formatDueTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();

    // Check if today
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      const displayMinutes = minutes.toString().padStart(2, '0');
      return `Due ${displayHours}:${displayMinutes} ${ampm}`;
    }

    return `Due ${date.toLocaleDateString()}`;
  };

  return (
    <div className="space-y-4 text-white">
      {urgentTasks.map((task, idx) => (
        <div key={task.id || idx} className="flex gap-4 items-start">
          <CheckCircle
            className={`w-6 h-6 flex-shrink-0 mt-1 ${getPriorityColor(task.priority)}`}
            strokeWidth={1.5}
          />
          <div className="flex-1">
            <div className="font-bold text-xl mb-1">{task.title}</div>
            {task.dueDate && (
              <div className="text-white/70 text-sm">
                {formatDueTime(task.dueDate)}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * TransitStrip Component
 * Compact transit times at bottom
 */
const TransitStrip = ({ data }) => {
  if (!data) {
    return (
      <div className="text-center text-white/60 py-4">
        <p>No transit data</p>
      </div>
    );
  }

  const { buses = [], red = [], brown = [] } = data;

  /**
   * Format arrival
   * @param {number} minutes - Minutes until arrival
   * @returns {string} Formatted time
   */
  const formatArrival = (minutes) => {
    if (minutes <= 1) return 'Due';
    return `${minutes} min`;
  };

  /**
   * Get urgency color
   * @param {number} minutes - Minutes until arrival
   * @returns {string} Tailwind color class
   */
  const getUrgencyColor = (minutes) => {
    if (minutes <= 3) return 'text-red-400';
    if (minutes <= 7) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="flex gap-8 justify-around text-white">
      {/* Bus 77 */}
      {buses.length > 0 && (
        <div className="flex items-center gap-3">
          <Bus className="w-6 h-6 text-blue-400" />
          <div>
            <div className="text-sm text-white/70 mb-1">Bus 77</div>
            <div className="flex gap-3">
              {buses.slice(0, 2).map((arrival, idx) => (
                <span key={idx} className={`font-bold ${getUrgencyColor(arrival.minutes)}`}>
                  {formatArrival(arrival.minutes)}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Red Line */}
      {red.length > 0 && (
        <div className="flex items-center gap-3">
          <Train className="w-6 h-6 text-red-500" />
          <div>
            <div className="text-sm text-white/70 mb-1">Red Line</div>
            <div className="flex gap-3">
              {red.slice(0, 2).map((arrival, idx) => (
                <span key={idx} className={`font-bold ${getUrgencyColor(arrival.minutes)}`}>
                  {formatArrival(arrival.minutes)}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Brown Line */}
      {brown.length > 0 && (
        <div className="flex items-center gap-3">
          <Train className="w-6 h-6 text-amber-600" />
          <div>
            <div className="text-sm text-white/70 mb-1">Brown Line</div>
            <div className="flex gap-3">
              {brown.slice(0, 2).map((arrival, idx) => (
                <span key={idx} className={`font-bold ${getUrgencyColor(arrival.minutes)}`}>
                  {formatArrival(arrival.minutes)}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * TVMorning Component
 * Morning briefing layout for TV display
 *
 * @param {Object} props
 * @param {Object} props.data - Dashboard data
 * @returns {JSX.Element}
 */
export const TVMorning = ({ data = {} }) => {
  const { weather, events = [], tasks = [], transit } = data;

  // Calculate stats
  const eventsCount = events.filter(event => new Date(event.start) > new Date()).length;
  const tasksCount = tasks.filter(task => !task.completed).length;
  const weatherSummary = weather
    ? `${Math.round(weather.temp)}°F, ${weather.description}`
    : 'No data';

  return (
    <div className="h-screen w-screen p-8 flex flex-col">
      {/* Header: Greeting + Date */}
      <div className="mb-8 text-white">
        <h1 className="text-5xl font-bold mb-2 text-shadow-lg">
          {getGreeting()}
        </h1>
        <DateDisplay format="full" className="text-2xl text-white/80 text-shadow" />
      </div>

      {/* Stats Row */}
      <div className="flex gap-4 mb-8">
        <StatCard
          icon={Calendar}
          value={eventsCount}
          label="events today"
          iconColor="text-blue-400"
        />
        <StatCard
          icon={CheckCircle}
          value={tasksCount}
          label="tasks due"
          iconColor="text-green-400"
        />
        <StatCard
          icon={CloudSun}
          value={weather ? `${Math.round(weather.temp)}°` : '--'}
          label={weather?.description || 'No data'}
          iconColor="text-yellow-400"
        />
      </div>

      {/* Main: Events and Tasks */}
      <div className="grid grid-cols-2 gap-6 flex-1 mb-8">
        {/* Events */}
        <div className="tv-glass-card rounded-lg p-6 shadow-2xl overflow-y-auto">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Calendar className="w-7 h-7 text-blue-400" strokeWidth={1.5} />
            Upcoming Events
          </h2>
          <EventsList events={events} />
        </div>

        {/* Tasks */}
        <div className="tv-glass-card rounded-lg p-6 shadow-2xl overflow-y-auto">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <CheckCircle className="w-7 h-7 text-green-400" strokeWidth={1.5} />
            Priority Tasks
          </h2>
          <TasksList tasks={tasks} />
        </div>
      </div>

      {/* Bottom: Transit */}
      <div className="tv-glass-card rounded-lg p-4 shadow-2xl">
        <TransitStrip data={transit} />
      </div>
    </div>
  );
};

export default TVMorning;
