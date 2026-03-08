/**
 * ProfileSwitcher Component
 * Floating profile selector for projector display
 */

import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { getProfileMetadata } from '../../config/profiles';

/**
 * ProfileSwitcher Component
 * Compact dropdown for switching between display profiles
 *
 * @param {Object} props
 * @param {string} props.currentProfile - Currently active profile ID
 * @param {Function} props.onProfileChange - Callback when profile changes
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element}
 */
export const ProfileSwitcher = ({
  currentProfile = 'default',
  onProfileChange,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const profiles = getProfileMetadata();
  const current = profiles.find((p) => p.id === currentProfile) || profiles[0];

  const handleSelect = (profileId) => {
    if (onProfileChange) {
      onProfileChange(profileId);
    }
    setIsOpen(false);
  };

  return (
    <div
      className={`fixed bottom-4 left-4 z-50 ${className}`}
      style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)' }}
    >
      {/* Current Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex items-center gap-2
          px-4 py-2
          bg-black/70 backdrop-blur-md
          border border-zinc-700
          rounded-lg
          text-white
          hover:bg-black/90
          transition-colors
        "
      >
        <span className="text-sm font-medium">{current.name}</span>
        {isOpen ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronUp className="w-4 h-4" />
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="
            absolute bottom-full left-0 mb-2
            min-w-48
            bg-black/90 backdrop-blur-md
            border border-zinc-700
            rounded-lg
            overflow-hidden
          "
        >
          {profiles.map((profile) => (
            <button
              key={profile.id}
              onClick={() => handleSelect(profile.id)}
              className={`
                w-full text-left
                px-4 py-3
                hover:bg-zinc-800
                transition-colors
                ${profile.id === currentProfile ? 'bg-zinc-800' : ''}
              `}
            >
              <div className="text-sm font-medium text-white">
                {profile.name}
              </div>
              <div className="text-xs text-gray-400">{profile.description}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileSwitcher;
