import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UnitSystem = 'metric' | 'imperial';
export type FirstDayOfWeek = 'monday' | 'sunday';
export type DefaultView = 'weekly' | 'excel';

export interface UserPreferences {
  units: UnitSystem;
  firstDayOfWeek: FirstDayOfWeek;
  defaultView: DefaultView;
  autoSave: boolean;
}

interface UserPreferencesContextType extends UserPreferences {
  updatePreferences: (updates: Partial<UserPreferences>) => void;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  units: 'metric',
  firstDayOfWeek: 'monday',
  defaultView: 'weekly',
  autoSave: true,
};

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export const UserPreferencesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state from localStorage or defaults
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem('editor_preferences');
      if (saved) {
        return { ...DEFAULT_PREFERENCES, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.error('Failed to parse preferences from localStorage', error);
    }
    return DEFAULT_PREFERENCES;
  });

  // Persist to localStorage whenever preferences change
  useEffect(() => {
    localStorage.setItem('editor_preferences', JSON.stringify(preferences));
  }, [preferences]);

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }));
  };

  return (
    <UserPreferencesContext.Provider value={{ ...preferences, updatePreferences }}>
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
};
