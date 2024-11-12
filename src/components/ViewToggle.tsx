import React from 'react';
import { Smartphone, Monitor } from 'lucide-react';
import { useMobileView } from '../context/MobileContext';

export const ViewToggle: React.FC = () => {
  const { isMobileView, isMobileDevice, isTabletDevice, toggleView } = useMobileView();

  // Only show toggle on tablets and desktop
  if (isMobileDevice && !isTabletDevice) return null;

  return (
    <button
      onClick={toggleView}
      className="p-2 rounded-lg bg-gray-200/80 dark:bg-gray-700/80 text-gray-800 dark:text-gray-200 hover:bg-gray-300/80 dark:hover:bg-gray-600/80 backdrop-blur-sm transition-colors duration-200 flex items-center space-x-2"
      aria-label="Toggle view mode"
    >
      {isMobileView ? (
        <>
          <Monitor className="h-5 w-5" />
          <span className="text-sm hidden sm:inline">Desktop View</span>
        </>
      ) : (
        <>
          <Smartphone className="h-5 w-5" />
          <span className="text-sm hidden sm:inline">Mobile View</span>
        </>
      )}
    </button>
  );
};