/**
 * TVRelax Component
 * Fullscreen generative art with minimal clock overlay
 */

import React, { useState, useEffect } from 'react';
import { FlowField } from '../../components/generative/FlowField';

/**
 * Format time in 12-hour format (time only, no date)
 */
const formatTime = (date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const hours12 = hours % 12 || 12;
  const formattedMinutes = minutes.toString().padStart(2, '0');
  return `${hours12}:${formattedMinutes}`;
};

/**
 * TVRelax Component
 * Minimal relax display: fullscreen flow field + centered clock
 *
 * @param {Object} props
 * @param {Object} props.data - Dashboard data (not used in relax mode)
 * @returns {JSX.Element}
 */
export const TVRelax = ({ data = {} }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen w-screen relative overflow-hidden">
      {/* Fullscreen FlowField background */}
      <div className="absolute inset-0">
        <FlowField
          width={1920}
          height={1080}
          speed={0.6}
        />
      </div>

      {/* Centered clock overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="text-white text-[12rem] font-extralight tracking-tight tabular-nums"
          style={{
            textShadow: '0 4px 30px rgba(0,0,0,0.5), 0 2px 10px rgba(0,0,0,0.3)',
          }}
        >
          {formatTime(time)}
        </div>
      </div>
    </div>
  );
};

export default TVRelax;
