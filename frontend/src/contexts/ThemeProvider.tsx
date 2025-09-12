import { useEffect } from 'react';
import { useSettingsStore } from '../store/store';
import { initializeModularTheme } from '../lib/modularColors';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings } = useSettingsStore();

  // Apply theme synchronously on render to prevent flash
  if (settings.darkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  // Apply theme globally and ensure it persists
  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.toggle('dark', settings.darkMode);
    
    // Initialize modular color theme
    initializeModularTheme();
    
    // Ensure theme is applied correctly
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  // Apply theme on initial mount to prevent flash
  useEffect(() => {
    // Force theme application on initial load
    document.documentElement.classList.toggle('dark', settings.darkMode);
    initializeModularTheme();
  }, []); // Empty dependency array for initial mount only

  return <>{children}</>;
};
