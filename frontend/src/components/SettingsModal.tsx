
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useSettingsStore } from "@/store/store";
import { FormEvent, useEffect, useState } from "react";
import { Settings } from "@/types";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

const SettingsModal = ({ open, onClose }: SettingsModalProps) => {
  const { settings, updateSettings } = useSettingsStore();
  const [localSettings, setLocalSettings] = useState<Settings>(settings);
  
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings, open]);
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    updateSettings(localSettings);
    toast.success("Settings saved successfully!");
    onClose();
  };
  
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Notifications</h3>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="telegram" className="flex-1">
                Telegram Alerts
              </Label>
              <Switch
                id="telegram"
                checked={localSettings.notifications.telegram}
                onCheckedChange={(checked) =>
                  setLocalSettings({
                    ...localSettings,
                    notifications: {
                      ...localSettings.notifications,
                      telegram: checked,
                    },
                  })
                }
              />
            </div>
            
            {localSettings.notifications.telegram && (
              <div className="ml-6 space-y-2">
                <Label htmlFor="telegramHandle">Telegram Handle</Label>
                <Input
                  id="telegramHandle"
                  value={localSettings.telegramHandle || ''}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      telegramHandle: e.target.value,
                    })
                  }
                  placeholder="@username"
                />
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <Label htmlFor="email" className="flex-1">
                Email Alerts
              </Label>
              <Switch
                id="email"
                checked={localSettings.notifications.email}
                onCheckedChange={(checked) =>
                  setLocalSettings({
                    ...localSettings,
                    notifications: {
                      ...localSettings.notifications,
                      email: checked,
                    },
                  })
                }
              />
            </div>
            
            {localSettings.notifications.email && (
              <div className="ml-6 space-y-2">
                <Label htmlFor="emailAddress">Email Address</Label>
                <Input
                  id="emailAddress"
                  value={localSettings.email || ''}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      email: e.target.value,
                    })
                  }
                  placeholder="you@example.com"
                  type="email"
                />
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Notification Types</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="notifyBuy"
                  checked={localSettings.notificationTypes.buy}
                  onCheckedChange={(checked) =>
                    setLocalSettings({
                      ...localSettings,
                      notificationTypes: {
                        ...localSettings.notificationTypes,
                        buy: checked,
                      },
                    })
                  }
                />
                <Label htmlFor="notifyBuy">Buy</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="notifySell"
                  checked={localSettings.notificationTypes.sell}
                  onCheckedChange={(checked) =>
                    setLocalSettings({
                      ...localSettings,
                      notificationTypes: {
                        ...localSettings.notificationTypes,
                        sell: checked,
                      },
                    })
                  }
                />
                <Label htmlFor="notifySell">Sell</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="notifyMint"
                  checked={localSettings.notificationTypes.mint}
                  onCheckedChange={(checked) =>
                    setLocalSettings({
                      ...localSettings,
                      notificationTypes: {
                        ...localSettings.notificationTypes,
                        mint: checked,
                      },
                    })
                  }
                />
                <Label htmlFor="notifyMint">Mint</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="notifyTransfer"
                  checked={localSettings.notificationTypes.transfer}
                  onCheckedChange={(checked) =>
                    setLocalSettings({
                      ...localSettings,
                      notificationTypes: {
                        ...localSettings.notificationTypes,
                        transfer: checked,
                      },
                    })
                  }
                />
                <Label htmlFor="notifyTransfer">Transfer</Label>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
