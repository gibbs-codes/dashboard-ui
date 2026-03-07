/**
 * BriefingCard Component
 * LLM-generated morning briefing summary card
 */

import { useState, useEffect, useCallback } from 'react';
import { getBriefingSummary } from '../../services/api';

// Refresh interval (5 minutes)
const REFRESH_INTERVAL = 5 * 60 * 1000;

/**
 * BriefingCard Component
 * Displays an LLM-generated briefing summary
 *
 * @param {Object} props
 * @param {string} props.className - Additional CSS classes for positioning
 */
export const BriefingCard = ({ className = '' }) => {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSummary = useCallback(async () => {
    try {
      const response = await getBriefingSummary();

      if (response.success && response.data?.summary) {
        setSummary(response.data.summary);
        setError(null);
      } else {
        // No summary available (LLM unavailable)
        setSummary(null);
      }
    } catch (err) {
      console.error('[BriefingCard] Error fetching summary:', err);
      setError(err.message);
      setSummary(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchSummary();

    // Set up refresh interval
    const interval = setInterval(fetchSummary, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchSummary]);

  // Don't render if no summary and not loading
  if (!isLoading && !summary) {
    return null;
  }

  return (
    <div
      className={`
        backdrop-blur-xl bg-black/40 rounded-2xl px-8 py-6
        drop-shadow-[0_8px_32px_rgba(0,0,0,0.6)]
        border border-white/10
        ${className}
      `}
    >
      {isLoading ? (
        // Loading skeleton
        <div className="space-y-3 animate-pulse">
          <div className="h-4 bg-white/20 rounded w-full" />
          <div className="h-4 bg-white/20 rounded w-11/12" />
          <div className="h-4 bg-white/20 rounded w-3/4" />
        </div>
      ) : (
        // Summary text
        <p className="text-xl font-light text-white/90 leading-relaxed">
          {summary}
        </p>
      )}
    </div>
  );
};

export default BriefingCard;
