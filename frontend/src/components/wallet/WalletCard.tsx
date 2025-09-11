import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChainIcon, ChainType, WalletIcon, WalletType, getExplorerUrl } from './WalletIcons';
import { ExternalLink, RefreshCw, Trash2 } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

export interface WalletData {
  id: string;
  walletType: WalletType;
  chainType: ChainType;
  address: string;
  name?: string;
  balance?: number;
  balanceUsd?: number;
  lastSynced?: string;
  status?: 'active' | 'syncing' | 'error';
}

interface WalletCardProps {
  wallet: WalletData;
  onDisconnect: (id: string) => void;
  onSync: (id: string) => void;
}

export const WalletCard: React.FC<WalletCardProps> = ({ wallet, onDisconnect, onSync }) => {
  const [isHovering, setIsHovering] = useState(false);
  
  const handleExplorerClick = () => {
    const explorerUrl = getExplorerUrl(wallet.walletType, wallet.chainType, wallet.address);
    if (explorerUrl) {
      window.open(explorerUrl, '_blank');
    }
  };
  
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'syncing': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  const formatBalance = (balance?: number) => {
    if (balance === undefined) return 'Unknown';
    return balance.toLocaleString(undefined, { maximumFractionDigits: 8 });
  };
  
  const formatUsdBalance = (balanceUsd?: number) => {
    if (balanceUsd === undefined) return '';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(balanceUsd);
  };
  
  const formatLastSynced = (lastSynced?: string) => {
    if (!lastSynced) return 'Never';
    return formatDistanceToNow(new Date(lastSynced), { addSuffix: true });
  };
  
  const truncateAddress = (address: string) => {
    if (address.length <= 12) return address;
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };
  
  return (
    <Card 
      className="bg-gray-800 border-gray-700 hover:border-teal-500 transition-all duration-200"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <WalletIcon walletType={wallet.walletType} size={32} />
            <div>
              <CardTitle className="text-lg text-white">
                {wallet.name || wallet.walletType.charAt(0).toUpperCase() + wallet.walletType.slice(1)}
              </CardTitle>
              <CardDescription className="text-gray-400 flex items-center mt-1">
                <ChainIcon chainType={wallet.chainType} size={16} />
                <span className="ml-1">{wallet.chainType.charAt(0).toUpperCase() + wallet.chainType.slice(1)}</span>
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Badge className={`${getStatusColor(wallet.status)} text-xs`}>
              {wallet.status || 'Unknown'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Address:</span>
            <span className="text-gray-200 text-sm font-mono">
              {truncateAddress(wallet.address)}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Balance:</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-gray-200 text-sm font-medium">
                    {formatBalance(wallet.balance)}
                    {wallet.balanceUsd !== undefined && isHovering && (
                      <span className="ml-1 text-teal-400">{formatUsdBalance(wallet.balanceUsd)}</span>
                    )}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Current USD value: {formatUsdBalance(wallet.balanceUsd)}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Last Synced:</span>
            <span className="text-gray-200 text-sm">
              {formatLastSynced(wallet.lastSynced)}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2 border-t border-gray-700">
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white hover:bg-gray-700"
          onClick={() => onSync(wallet.id)}
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Sync
        </Button>
        
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white hover:bg-gray-700"
            onClick={handleExplorerClick}
            disabled={!getExplorerUrl(wallet.walletType, wallet.chainType, wallet.address)}
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Explorer
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-red-400 hover:text-white hover:bg-red-900"
            onClick={() => onDisconnect(wallet.id)}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Disconnect
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
