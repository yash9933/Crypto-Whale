import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChainIcon, ChainType, WalletIcon, WalletType, walletInfo } from './WalletIcons';
import { AlertCircle, Check } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AddWalletModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConnect: (walletType: WalletType, chainType: ChainType, address: string, name: string) => void;
}

export const AddWalletModal: React.FC<AddWalletModalProps> = ({ open, onOpenChange, onConnect }) => {
  const [selectedCategory, setSelectedCategory] = useState<'hot' | 'cold' | 'custodial'>('hot');
  const [selectedWalletType, setSelectedWalletType] = useState<WalletType | ''>('');
  const [selectedChainType, setSelectedChainType] = useState<ChainType | ''>('');
  const [walletAddress, setWalletAddress] = useState('');
  const [walletName, setWalletName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  
  // Reset form when modal opens/closes
  useEffect(() => {
    if (!open) {
      setSelectedCategory('hot');
      setSelectedWalletType('');
      setSelectedChainType('');
      setWalletAddress('');
      setWalletName('');
      setError(null);
    }
  }, [open]);
  
  // Filter wallets by category
  const filteredWallets = Object.values(walletInfo).filter(wallet => wallet.category === selectedCategory);
  
  // Get available chains for selected wallet
  const availableChains = selectedWalletType 
    ? walletInfo[selectedWalletType as WalletType].chains 
    : [];
  
  // Handle wallet selection
  const handleWalletSelect = (walletType: string) => {
    setSelectedWalletType(walletType as WalletType);
    setSelectedChainType('');
    setError(null);
  };
  
  // Handle chain selection
  const handleChainSelect = (chainType: string) => {
    setSelectedChainType(chainType as ChainType);
    setError(null);
  };
  
  // Validate wallet address based on chain
  const validateAddress = (address: string, chainType: ChainType): boolean => {
    if (!address) return false;
    
    // Basic validation patterns for different chains
    const patterns: Record<ChainType, RegExp> = {
      ethereum: /^0x[a-fA-F0-9]{40}$/,
      solana: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
      bitcoin: /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/,
      cosmos: /^cosmos[a-zA-Z0-9]{39}$/,
      multi: /.+/ // Any non-empty string for multi-chain
    };
    
    return patterns[chainType].test(address);
  };
  
  // Handle connect button click
  const handleConnect = async () => {
    // Validate inputs
    if (!selectedWalletType) {
      setError('Please select a wallet');
      return;
    }
    
    if (!selectedChainType) {
      setError('Please select a blockchain');
      return;
    }
    
    if (!walletAddress) {
      setError('Please enter a wallet address');
      return;
    }
    
    if (!validateAddress(walletAddress, selectedChainType as ChainType)) {
      setError(`Invalid ${selectedChainType} address format`);
      return;
    }
    
    // Simulate connection process
    setIsConnecting(true);
    setError(null);
    
    try {
      // In a real app, this would connect to the wallet or verify the address
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Call the onConnect callback with the wallet details
      onConnect(
        selectedWalletType as WalletType,
        selectedChainType as ChainType,
        walletAddress,
        walletName || `${selectedWalletType} ${selectedChainType}`
      );
      
      // Close the modal
      onOpenChange(false);
    } catch (err) {
      setError('Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 text-white border-gray-700 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">Connect Wallet</DialogTitle>
          <DialogDescription className="text-gray-400">
            Add a new wallet to track your crypto assets
          </DialogDescription>
        </DialogHeader>
        
        {/* Wallet Category Tabs */}
        <Tabs 
          defaultValue="hot" 
          value={selectedCategory}
          onValueChange={(value) => setSelectedCategory(value as 'hot' | 'cold' | 'custodial')}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 mb-4 bg-gray-700">
            <TabsTrigger value="hot" className="data-[state=active]:bg-teal-600">
              Hot Wallets
            </TabsTrigger>
            <TabsTrigger value="cold" className="data-[state=active]:bg-teal-600">
              Hardware
            </TabsTrigger>
            <TabsTrigger value="custodial" className="data-[state=active]:bg-teal-600">
              Institutional
            </TabsTrigger>
          </TabsList>
          
          {/* Wallet Selection */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
            {filteredWallets.map((wallet) => (
              <Button
                key={wallet.id}
                variant="outline"
                className={`flex flex-col items-center justify-center h-20 p-2 border-gray-600 hover:border-teal-500 hover:bg-gray-700 ${
                  selectedWalletType === wallet.id ? 'border-teal-500 bg-gray-700' : ''
                }`}
                onClick={() => handleWalletSelect(wallet.id)}
              >
                <WalletIcon walletType={wallet.id} size={28} />
                <span className="mt-1 text-xs text-center">{wallet.name}</span>
              </Button>
            ))}
          </div>
          
          {/* Chain Selection (if wallet is selected) */}
          {selectedWalletType && (
            <div className="mb-4">
              <Label htmlFor="chain-select" className="text-sm text-gray-300 mb-1.5 block">
                Select Blockchain
              </Label>
              <Select value={selectedChainType} onValueChange={handleChainSelect}>
                <SelectTrigger id="chain-select" className="bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Select blockchain" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {availableChains.map((chain) => (
                    <SelectItem key={chain} value={chain} className="flex items-center">
                      <div className="flex items-center">
                        <ChainIcon chainType={chain} size={16} />
                        <span className="ml-2 capitalize">{chain}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {/* Wallet Details (if chain is selected) */}
          {selectedChainType && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="wallet-address" className="text-sm text-gray-300 mb-1.5 block">
                  Wallet Address
                </Label>
                <Input
                  id="wallet-address"
                  placeholder={`Enter ${selectedChainType} address`}
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              
              <div>
                <Label htmlFor="wallet-name" className="text-sm text-gray-300 mb-1.5 block">
                  Wallet Name (Optional)
                </Label>
                <Input
                  id="wallet-name"
                  placeholder="My Trading Wallet"
                  value={walletName}
                  onChange={(e) => setWalletName(e.target.value)}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
            </div>
          )}
        </Tabs>
        
        {/* Error Message */}
        {error && (
          <Alert variant="destructive" className="bg-red-900 border-red-800">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConnect}
            disabled={!selectedWalletType || !selectedChainType || !walletAddress || isConnecting}
            className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700"
          >
            {isConnecting ? (
              <>Connecting...</>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Connect Wallet
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
