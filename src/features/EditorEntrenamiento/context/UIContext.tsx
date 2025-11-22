import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UIContextType {
  isFitCoachOpen: boolean;
  toggleFitCoach: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isFitCoachOpen, setIsFitCoachOpen] = useState(false);

  const toggleFitCoach = () => {
    setIsFitCoachOpen((prev) => !prev);
  };

  return (
    <UIContext.Provider value={{ isFitCoachOpen, toggleFitCoach }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUIContext = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUIContext must be used within a UIProvider');
  }
  return context;
};
