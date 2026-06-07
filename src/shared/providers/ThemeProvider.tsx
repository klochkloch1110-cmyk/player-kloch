import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import { lightTheme, darkTheme, type Theme } from '../config/theme';
import type { ThemeMode } from '../types';

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  initialMode?: ThemeMode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  initialMode = 'light' 
}) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(initialMode);

  // Автоматическая синхронизация с системной темой при режиме 'auto'
  useEffect(() => {
    if (themeMode === 'auto') {
      const subscription = Appearance.addChangeListener(({ colorScheme }) => {
        // Обновление произойдёт через getEffectiveTheme
      });

      return () => subscription.remove();
    }
  }, [themeMode]);

  // Получить эффективную тему с учётом режима 'auto'
  const getEffectiveTheme = (): Theme => {
    if (themeMode === 'auto') {
      const systemColorScheme = Appearance.getColorScheme();
      return systemColorScheme === 'dark' ? darkTheme : lightTheme;
    }
    return themeMode === 'dark' ? darkTheme : lightTheme;
  };

  const theme = getEffectiveTheme();

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
  };

  const toggleTheme = () => {
    setThemeModeState(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'auto';
      return 'light';
    });
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeMode,
        setThemeMode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
