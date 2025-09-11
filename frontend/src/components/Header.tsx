
import { Moon, Sun, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSettingsStore } from '@/store/store';
import { useState } from 'react';
import SettingsModal from './SettingsModal';
import { cn } from '@/lib/utils';

const Header = () => {
  const { settings, updateSettings } = useSettingsStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const toggleDarkMode = () => {
    const newDarkMode = !settings.darkMode;
    updateSettings({ darkMode: newDarkMode });
    document.documentElement.classList.toggle('dark', newDarkMode);
  };
  
  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 sm:px-6">
        <div className="flex flex-1">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-solana flex items-center justify-center">
              <span className="text-white font-semibold text-sm">S</span>
            </div>
            <a href="/" className={cn("font-semibold text-xl hidden sm:inline-flex")}>
              SolWhaleTracker
            </a>
            <a href="/" className={cn("font-semibold text-xl sm:hidden inline-flex")}>
              SWT
            </a>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            aria-label="Toggle theme"
          >
            {settings.darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSettingsOpen(true)}
            aria-label="Open settings"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <SettingsModal open={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </header>
  );
};

export default Header;
