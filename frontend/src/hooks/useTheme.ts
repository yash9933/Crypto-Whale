import { useSettingsStore } from '../store/store';

export const useTheme = () => {
  const { settings, updateSettings } = useSettingsStore();
  
  const toggleTheme = () => {
    updateSettings({ darkMode: !settings.darkMode });
  };
  
  const setTheme = (darkMode: boolean) => {
    updateSettings({ darkMode });
  };
  
  return {
    darkMode: settings.darkMode,
    toggleTheme,
    setTheme,
    isDark: settings.darkMode,
    isLight: !settings.darkMode,
  };
};
