
import { useState, FormEvent } from "react";
import { useWalletStore } from "@/store/store";
import { Check, Edit, Trash2, Plus } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

const WalletSidebar = () => {
  const { wallets, addWallet, removeWallet, activeWallet, setActiveWallet, updateWallet } = useWalletStore();
  const [newWalletAddress, setNewWalletAddress] = useState("");
  const [newWalletNickname, setNewWalletNickname] = useState("");
  const [editingWallet, setEditingWallet] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  
  const handleAddWallet = (e: FormEvent) => {
    e.preventDefault();
    
    if (!newWalletAddress.trim()) {
      toast.error("Wallet address cannot be empty");
      return;
    }
    
    // In a real app, we would validate the Solana address format here
    
    // Add the wallet
    addWallet({
      address: newWalletAddress,
      nickname: newWalletNickname.trim() || undefined,
      lastActivity: new Date(),
      balance: {
        sol: Math.random() * 100,
        usd: Math.random() * 5000,
      },
    });
    
    toast.success("Wallet added successfully!");
    
    // Clear form
    setNewWalletAddress("");
    setNewWalletNickname("");
  };
  
  const startEditWallet = (wallet: string, currentNickname: string | undefined) => {
    setEditingWallet(wallet);
    setEditValue(currentNickname || "");
  };
  
  const saveNickname = (address: string) => {
    updateWallet(address, { nickname: editValue.trim() || undefined });
    setEditingWallet(null);
    toast.success("Nickname updated");
  };
  
  const handleRemoveWallet = (address: string) => {
    removeWallet(address);
    toast.info("Wallet removed from watchlist");
  };

  return (
    <aside className="w-full md:w-80 lg:w-96 h-full flex flex-col border-r overflow-hidden">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Wallet Watchlist</h2>
        
        <form onSubmit={handleAddWallet} className="space-y-3 mb-4">
          <Input
            placeholder="Solana wallet address"
            value={newWalletAddress}
            onChange={(e) => setNewWalletAddress(e.target.value)}
            className="font-mono text-xs"
          />
          <Input
            placeholder="Nickname (optional)"
            value={newWalletNickname}
            onChange={(e) => setNewWalletNickname(e.target.value)}
          />
          <Button type="submit" className="w-full">
            <Plus className="h-4 w-4 mr-2" /> Add Wallet
          </Button>
        </form>
        
        <Separator className="my-4" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {wallets.length === 0 ? (
          <div className="text-center p-6 text-muted-foreground">
            <p>No wallets added yet.</p>
            <p className="text-sm mt-1">Add a wallet to start tracking.</p>
          </div>
        ) : (
          wallets.map((wallet) => (
            <Card
              key={wallet.address}
              className={cn(
                "p-3 transition-colors cursor-pointer hover:bg-accent/50",
                activeWallet === wallet.address && "border-primary/50 bg-accent/50"
              )}
              onClick={() => setActiveWallet(wallet.address === activeWallet ? null : wallet.address)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  {editingWallet === wallet.address ? (
                    <div className="flex items-center gap-1">
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        autoFocus
                        className="py-1 h-7 text-sm"
                      />
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-7 w-7 p-0" 
                        onClick={(e) => {
                          e.stopPropagation();
                          saveNickname(wallet.address);
                        }}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <p className="font-medium truncate">
                        {wallet.nickname || `Wallet ${wallet.address.substring(0, 4)}...`}
                      </p>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 opacity-50 hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditWallet(wallet.address, wallet.nickname);
                        }}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  
                  <p className="truncate-address text-muted-foreground">
                    {wallet.address.substring(0, 8)}...{wallet.address.substring(wallet.address.length - 8)}
                  </p>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 opacity-50 hover:opacity-100 hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveWallet(wallet.address);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              
              <div className="mt-2 grid grid-cols-2 text-xs">
                <div>
                  <p className="text-muted-foreground">Balance</p>
                  {wallet.balance ? (
                    <p>
                      {wallet.balance.sol.toFixed(2)} SOL
                      <span className="text-muted-foreground ml-1">
                        (${wallet.balance.usd.toLocaleString()})
                      </span>
                    </p>
                  ) : (
                    <p className="text-muted-foreground">Unknown</p>
                  )}
                </div>
                <div>
                  <p className="text-muted-foreground">Last Activity</p>
                  {wallet.lastActivity ? (
                    <p>{formatDistanceToNow(wallet.lastActivity, { addSuffix: true })}</p>
                  ) : (
                    <p className="text-muted-foreground">Never</p>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </aside>
  );
};

export default WalletSidebar;
