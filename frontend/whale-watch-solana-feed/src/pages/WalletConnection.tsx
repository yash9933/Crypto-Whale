import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Check, Plus, Wallet } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { WalletCard, WalletData } from "@/components/wallet/WalletCard";
import { AddWalletModal } from "@/components/wallet/AddWalletModal";
import { ChainType, WalletType } from "@/components/wallet/WalletIcons";

// Mock wallet data
const mockWallets: WalletData[] = [
  // Hot wallets
  {
    id: "wallet1",
    walletType: "phantom",
    chainType: "solana",
    address: "8ZmHXQqMxAUy4FcJJ7hnMQqHiADRBu3X7uDjzcqiLjXV",
    name: "Main Solana Wallet",
    balance: 45.75,
    balanceUsd: 4682.06,
    lastSynced: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    status: "active"
  },
  {
    id: "wallet2",
    walletType: "metamask",
    chainType: "ethereum",
    address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    name: "ETH Trading",
    balance: 2.34,
    balanceUsd: 8073.00,
    lastSynced: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    status: "active"
  },
  {
    id: "wallet3",
    walletType: "trust",
    chainType: "multi",
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    name: "Multi-chain Wallet",
    balance: 0.45,
    balanceUsd: 29444.45,
    lastSynced: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    status: "error"
  },
  
  // Cold wallets
  {
    id: "wallet4",
    walletType: "ledger",
    chainType: "ethereum",
    address: "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7",
    name: "Ledger ETH",
    balance: 10.5,
    balanceUsd: 36232.88,
    lastSynced: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    status: "active"
  },
  {
    id: "wallet5",
    walletType: "trezor",
    chainType: "bitcoin",
    address: "3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5",
    name: "Trezor BTC Cold Storage",
    balance: 1.25,
    balanceUsd: 81790.13,
    lastSynced: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
    status: "active"
  },
  
  // Custodial wallets
  {
    id: "wallet6",
    walletType: "coinbase_prime",
    chainType: "multi",
    address: "Coinbase Prime Account",
    name: "Coinbase Institutional",
    balance: 250000,
    balanceUsd: 250000,
    lastSynced: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    status: "active"
  }
];

// Mock exchange data
const mockExchanges = [
  {
    id: "exchange1",
    exchangeType: "coinbase",
    apiKey: "CBPRO_API_KEY_12345",
    apiSecret: "********",
    connectedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    lastSynced: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    status: "active",
    balance: 15750.25
  },
  {
    id: "exchange2",
    exchangeType: "binance",
    apiKey: "BINANCE_API_KEY_67890",
    apiSecret: "********",
    connectedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    lastSynced: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    status: "active",
    balance: 42380.75
  }
];

const WalletConnection = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("wallets");
  const [walletDialogOpen, setWalletDialogOpen] = useState(false);
  const [exchangeDialogOpen, setExchangeDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Mock data states
  const [wallets, setWallets] = useState<WalletData[]>(mockWallets);
  const [exchanges, setExchanges] = useState(mockExchanges);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState<string | null>(null);

  // Filter wallets by category
  const hotWallets = wallets.filter(wallet => 
    ["metamask", "phantom", "keplr", "rabbi", "trust"].includes(wallet.walletType as string)
  );
  
  const coldWallets = wallets.filter(wallet => 
    ["ledger", "trezor", "lattice1"].includes(wallet.walletType as string)
  );
  
  const custodialWallets = wallets.filter(wallet => 
    ["fireblocks", "anchorage", "coinbase_prime", "bitgo"].includes(wallet.walletType as string)
  );
  
  // Calculate total wallet value
  const totalWalletValue = wallets.reduce((sum, wallet) => sum + (wallet.balanceUsd || 0), 0);
  const totalExchangeValue = exchanges.reduce((sum, exchange) => sum + (exchange.balance || 0), 0);
  
  // Handle wallet sync
  const handleSyncWallet = (walletId: string) => {
    setIsSyncing(walletId);
    setError(null);
    
    // Simulate sync process
    setTimeout(() => {
      setWallets(wallets.map(wallet => {
        if (wallet.id === walletId) {
          return {
            ...wallet,
            lastSynced: new Date().toISOString(),
            status: 'active'
          };
        }
        return wallet;
      }));
      
      setIsSyncing(null);
      setSuccess(`Wallet synced successfully!`);
      setTimeout(() => setSuccess(null), 3000);
    }, 2000);
  };
  
  // Handle wallet disconnect
  const handleDisconnectWallet = (walletId: string) => {
    setWallets(wallets.filter(wallet => wallet.id !== walletId));
    setSuccess("Wallet disconnected successfully!");
    setTimeout(() => setSuccess(null), 3000);
  };
  
  // Handle exchange disconnect
  const handleDisconnectExchange = (exchangeId: string) => {
    setExchanges(exchanges.filter(exchange => exchange.id !== exchangeId));
    setSuccess("Exchange disconnected successfully!");
    setTimeout(() => setSuccess(null), 3000);
  };
  
  // Handle new wallet connection
  const handleConnectWallet = (
    walletType: WalletType,
    chainType: ChainType,
    address: string,
    name: string
  ) => {
    const newWallet: WalletData = {
      id: `wallet${wallets.length + 1}`,
      walletType,
      chainType,
      address,
      name,
      lastSynced: new Date().toISOString(),
      status: 'active'
    };
    
    setWallets([...wallets, newWallet]);
    setSuccess("Wallet connected successfully!");
    setTimeout(() => setSuccess(null), 3000);
  };
  
  // Handle exchange connect
  const handleConnectExchange = (exchangeType: string, apiKey: string, apiSecret: string) => {
    const newExchange = {
      id: `exchange${exchanges.length + 1}`,
      exchangeType,
      apiKey,
      apiSecret,
      connectedAt: new Date().toISOString(),
      lastSynced: new Date().toISOString(),
      status: 'active',
      balance: 0
    };
    
    setExchanges([...exchanges, newExchange]);
    setExchangeDialogOpen(false);
    setSuccess("Exchange connected successfully!");
    setTimeout(() => setSuccess(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent mb-4 md:mb-0">
            Wallet & Exchange Connections
          </h1>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => navigate('/dashboard')}
              variant="outline"
              className="border-teal-500 text-teal-500 hover:bg-teal-950"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
        
        {/* Success/Error Messages */}
        {success && (
          <Alert className="mb-6 bg-green-900 border-green-800">
            <Check className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        
        {error && (
          <Alert variant="destructive" className="mb-6 bg-red-900 border-red-800">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {/* Wallet/Exchange Tabs */}
        <Tabs defaultValue="wallets" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6 bg-gray-800">
            <TabsTrigger value="wallets" className="data-[state=active]:bg-teal-600">
              <Wallet className="w-4 h-4 mr-2" />
              Wallets
            </TabsTrigger>
            <TabsTrigger value="exchanges" className="data-[state=active]:bg-teal-600">
              <svg 
                className="w-4 h-4 mr-2" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M2 7H22M16 2L21 7L16 12M8 12L3 17L8 22M22 17H2" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
              Exchanges
            </TabsTrigger>
            <TabsTrigger value="brokerages" className="data-[state=active]:bg-teal-600">
              <svg 
                className="w-4 h-4 mr-2" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M3 22H21M5 4H19C20.1046 4 21 4.89543 21 6V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V6C3 4.89543 3.89543 4 5 4ZM16 12C16 13.1046 15.1046 14 14 14C12.8954 14 12 13.1046 12 12C12 10.8954 12.8954 10 14 10C15.1046 10 16 10.8954 16 12Z" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
              Brokerages
            </TabsTrigger>
          </TabsList>
          
          {/* Wallets Tab Content */}
          <TabsContent value="wallets" className="mt-0">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-white">Connected Wallets</h2>
                <p className="text-gray-400 text-sm mt-1">
                  Total Value: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalWalletValue)}
                </p>
              </div>
              <Button
                onClick={() => setWalletDialogOpen(true)}
                className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Wallet
              </Button>
            </div>
            
            {/* Hot Wallets Section */}
            {hotWallets.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-300 mb-4">Hot Wallets</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {hotWallets.map(wallet => (
                    <WalletCard
                      key={wallet.id}
                      wallet={wallet}
                      onDisconnect={handleDisconnectWallet}
                      onSync={handleSyncWallet}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Cold/Hardware Wallets Section */}
            {coldWallets.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-300 mb-4">Hardware Wallets</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {coldWallets.map(wallet => (
                    <WalletCard
                      key={wallet.id}
                      wallet={wallet}
                      onDisconnect={handleDisconnectWallet}
                      onSync={handleSyncWallet}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Custodial/Institutional Wallets Section */}
            {custodialWallets.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-300 mb-4">Institutional Custody</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {custodialWallets.map(wallet => (
                    <WalletCard
                      key={wallet.id}
                      wallet={wallet}
                      onDisconnect={handleDisconnectWallet}
                      onSync={handleSyncWallet}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Empty State */}
            {wallets.length === 0 && (
              <Card className="bg-gray-800 border-gray-700 mb-6">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Wallet className="w-12 h-12 text-gray-500 mb-4" />
                  <h3 className="text-xl font-medium text-gray-300 mb-2">No Wallets Connected</h3>
                  <p className="text-gray-400 text-center mb-6 max-w-md">
                    Connect your crypto wallets to track your assets and transactions in one place.
                  </p>
                  <Button
                    onClick={() => setWalletDialogOpen(true)}
                    className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Wallet
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* Exchanges Tab Content */}
          <TabsContent value="exchanges" className="mt-0">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-white">Connected Exchanges</h2>
                <p className="text-gray-400 text-sm mt-1">
                  Total Value: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalExchangeValue)}
                </p>
              </div>
              <Button
                onClick={() => setExchangeDialogOpen(true)}
                className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Exchange
              </Button>
            </div>
            
            {/* Exchange List */}
            {exchanges.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {exchanges.map(exchange => (
                  <Card key={exchange.id} className="bg-gray-800 border-gray-700 hover:border-teal-500 transition-all duration-200">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg text-white capitalize">
                            {exchange.exchangeType}
                          </CardTitle>
                          <CardDescription className="text-gray-400">
                            Connected {new Date(exchange.connectedAt).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <div>
                          <div className={`px-2 py-1 rounded-full text-xs ${
                            exchange.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                          }`}>
                            {exchange.status}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex flex-col space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">API Key:</span>
                          <span className="text-gray-200 text-sm font-mono">
                            {exchange.apiKey.substring(0, 8)}...
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Balance:</span>
                          <span className="text-gray-200 text-sm">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(exchange.balance || 0)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Last Synced:</span>
                          <span className="text-gray-200 text-sm">
                            {new Date(exchange.lastSynced).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <div className="px-6 py-4 border-t border-gray-700 flex justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-white hover:bg-gray-700"
                        onClick={() => {
                          // Sync exchange data
                          setSuccess("Exchange data synced successfully!");
                          setTimeout(() => setSuccess(null), 3000);
                        }}
                      >
                        <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none">
                          <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
                          <path d="M16 12L12 8M12 8L8 12M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Sync
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-white hover:bg-red-900"
                        onClick={() => handleDisconnectExchange(exchange.id)}
                      >
                        <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none">
                          <path d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Disconnect
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-gray-800 border-gray-700 mb-6">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <svg className="w-12 h-12 text-gray-500 mb-4" viewBox="0 0 24 24" fill="none">
                    <path d="M2 7H22M16 2L21 7L16 12M8 12L3 17L8 22M22 17H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <h3 className="text-xl font-medium text-gray-300 mb-2">No Exchanges Connected</h3>
                  <p className="text-gray-400 text-center mb-6 max-w-md">
                    Connect your exchange accounts to track your trading activity and portfolio.
                  </p>
                  <Button
                    onClick={() => setExchangeDialogOpen(true)}
                    className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Exchange
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* Brokerages Tab Content */}
          <TabsContent value="brokerages" className="mt-0">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-white">Brokerage Accounts</h2>
                <p className="text-gray-400 text-sm mt-1">
                  Connect traditional investment accounts
                </p>
              </div>
              <Button
                onClick={() => setExchangeDialogOpen(true)}
                className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Brokerage
              </Button>
            </div>
            
            {/* Brokerage Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gray-800 border-gray-700 hover:border-teal-500 transition-all duration-200 overflow-hidden">
                <div className="h-3 bg-gradient-to-r from-red-500 to-red-700"></div>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center text-center mb-6">
                    <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-10 h-10 text-green-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9.5 14.5L11.5 16.5L14.5 12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M7 10.5H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10 7.5H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white">TD Ameritrade</h3>
                    <p className="text-gray-400 text-sm mt-1">Connect your TD Ameritrade account</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">API Access:</span>
                      <span className="text-gray-200">OAuth 2.0</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Data Available:</span>
                      <span className="text-gray-200">Positions, Orders, History</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Update Frequency:</span>
                      <span className="text-gray-200">Real-time</span>
                    </div>
                  </div>
                  <Button
                    className="w-full mt-6 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700"
                    onClick={() => {
                      setSuccess("TD Ameritrade connection initiated. Redirecting to authorization page...");
                      setTimeout(() => setSuccess(null), 3000);
                    }}
                  >
                    Connect Account
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800 border-gray-700 hover:border-teal-500 transition-all duration-200 overflow-hidden">
                <div className="h-3 bg-gradient-to-r from-blue-500 to-blue-700"></div>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center text-center mb-6">
                    <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-10 h-10 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 4H3C1.89543 4 1 4.89543 1 6V18C1 19.1046 1.89543 20 3 20H21C22.1046 20 23 19.1046 23 18V6C23 4.89543 22.1046 4 21 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M1 10H23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white">E*Trade</h3>
                    <p className="text-gray-400 text-sm mt-1">Connect your E*Trade account</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">API Access:</span>
                      <span className="text-gray-200">OAuth 1.0a</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Data Available:</span>
                      <span className="text-gray-200">Positions, Orders, History</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Update Frequency:</span>
                      <span className="text-gray-200">15 min delay</span>
                    </div>
                  </div>
                  <Button
                    className="w-full mt-6 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700"
                    onClick={() => {
                      setSuccess("E*Trade connection initiated. Redirecting to authorization page...");
                      setTimeout(() => setSuccess(null), 3000);
                    }}
                  >
                    Connect Account
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800 border-gray-700 hover:border-teal-500 transition-all duration-200 overflow-hidden">
                <div className="h-3 bg-gradient-to-r from-purple-500 to-purple-700"></div>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center text-center mb-6">
                    <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-10 h-10 text-purple-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white">Other Brokerages</h3>
                    <p className="text-gray-400 text-sm mt-1">Connect other brokerage accounts</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Supported:</span>
                      <span className="text-gray-200">Fidelity, Charles Schwab</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Coming Soon:</span>
                      <span className="text-gray-200">Robinhood, Webull</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Integration:</span>
                      <span className="text-gray-200">API + Manual CSV</span>
                    </div>
                  </div>
                  <Button
                    className="w-full mt-6 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700"
                    onClick={() => {
                      setSuccess("Brokerage selection menu opening...");
                      setTimeout(() => setSuccess(null), 3000);
                    }}
                  >
                    Select Brokerage
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            {/* Connected Brokerages */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-300 mb-4">Connected Brokerages</h3>
              <Card className="bg-gray-800 border-gray-700 mb-6">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <svg className="w-12 h-12 text-gray-500 mb-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 4H3C1.89543 4 1 4.89543 1 6V18C1 19.1046 1.89543 20 3 20H21C22.1046 20 23 19.1046 23 18V6C23 4.89543 22.1046 4 21 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M1 10H23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <h3 className="text-xl font-medium text-gray-300 mb-2">No Brokerages Connected</h3>
                  <p className="text-gray-400 text-center mb-6 max-w-md">
                    Connect your brokerage accounts to see all your traditional investments alongside your crypto assets.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Add Wallet Modal */}
      <AddWalletModal
        open={walletDialogOpen}
        onOpenChange={setWalletDialogOpen}
        onConnect={handleConnectWallet}
      />
    </div>
  );
};

export default WalletConnection;
