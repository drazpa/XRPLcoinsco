import React, { createContext, useContext, useState, useEffect } from 'react';

interface TickerContextType {
  showTickers: boolean;
  toggleTickers: () => void;
}

const TickerContext = createContext<TickerContextType | undefined>(undefined);

export const TickerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showTickers, setShowTickers] = useState(() => {
    const saved = localStorage.getItem('showTickers');
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('showTickers', JSON.stringify(showTickers));
  }, [showTickers]);

  const toggleTickers = () => {
    setShowTickers(prev => !prev);
  };

  return (
    <TickerContext.Provider value={{ showTickers, toggleTickers }}>
      {children}
    </TickerContext.Provider>
  );
};

export const useTickers = () => {
  const context = useContext(TickerContext);
  if (context === undefined) {
    throw new Error('useTickers must be used within a TickerProvider');
  }
  return context;
};