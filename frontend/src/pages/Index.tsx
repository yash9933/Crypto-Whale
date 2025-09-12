
import Header from "@/components/Header";
import Dashboard from "@/pages/Dashboard";
import { useEffect } from "react";
import { useSettingsStore } from "@/store/store";

const Index = () => {
  const { settings } = useSettingsStore();
  
  // Apply dark mode setting and update when settings change
  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.darkMode);
  }, [settings.darkMode]);
  
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <Dashboard />
    </div>
  );
};

export default Index;
