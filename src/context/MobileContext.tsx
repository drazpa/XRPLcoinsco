import React, { createContext, useContext, useState, useEffect } from 'react';

interface MobileContextType {
  isMobileView: boolean;
  isMobileDevice: boolean;
  isTabletDevice: boolean;
  toggleView: () => void;
}

const MobileContext = createContext<MobileContextType | undefined>(undefined);

export const MobileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Manual view preference
  const [isMobileView, setIsMobileView] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('preferMobileView');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });

  // Device detection states
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isTabletDevice, setIsTabletDevice] = useState(false);

  useEffect(() => {
    const detectDevice = () => {
      // Get the viewport width
      const width = window.innerWidth;
      
      // Check for mobile user agent
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      const isMobileUA = mobileRegex.test(navigator.userAgent);
      
      // Device width breakpoints
      const isMobileWidth = width < 768;
      const isTabletWidth = width >= 768 && width < 1024;
      
      // Touch capability check
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Set device states
      setIsMobileDevice(isMobileUA && isMobileWidth);
      setIsTabletDevice(isMobileUA && isTabletWidth);
      
      // Automatically set mobile view for mobile devices and tablets
      if (!localStorage.getItem('preferMobileView')) {
        setIsMobileView(isMobileUA && (isMobileWidth || isTabletWidth));
      }
    };

    // Initial detection
    detectDevice();

    // Add resize listener
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(detectDevice, 250); // Debounce resize events
    };

    window.addEventListener('resize', handleResize);
    
    // Orientation change handler for mobile devices
    window.addEventListener('orientationchange', detectDevice);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', detectDevice);
      clearTimeout(resizeTimer);
    };
  }, []);

  // Save preference to localStorage
  useEffect(() => {
    localStorage.setItem('preferMobileView', JSON.stringify(isMobileView));
  }, [isMobileView]);

  const toggleView = () => {
    setIsMobileView(prev => !prev);
  };

  return (
    <MobileContext.Provider value={{ 
      isMobileView, 
      isMobileDevice,
      isTabletDevice,
      toggleView 
    }}>
      {children}
    </MobileContext.Provider>
  );
};

export const useMobileView = () => {
  const context = useContext(MobileContext);
  if (context === undefined) {
    throw new Error('useMobileView must be used within a MobileProvider');
  }
  return context;
};