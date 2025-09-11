import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { 
  CalendarIcon, 
  Download, 
  ExternalLink, 
  Filter, 
  Search, 
  SortAsc, 
  SortDesc, 
  ArrowUpDown, 
  Clock, 
  DollarSign, 
  FileText, 
  BarChart2, 
  Wallet,
  RefreshCw
} from "lucide-react";

// Transaction type definition
interface Transaction {
  id: string;
  timestamp: string;
  txid: string;
  fromAccount: string;
  toAccount: string;
  asset: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'failed';
  networkFee: number;
  exchangeRate: number;
  type: 'deposit' | 'withdrawal' | 'trade' | 'transfer' | 'brokerage_deposit' | 'brokerage_withdrawal' | 'wallet_funding';
  explorerUrl: string;
  batchId?: string;
  accountType?: 'wallet' | 'exchange' | 'brokerage';
  brokerageInfo?: {
    name: string;
    accountNumber: string;
    transactionType: string;
  };
  notes?: string;
  category?: string;
  tags?: string[];
}

// Mock transaction data
const mockTransactions: Transaction[] = [
  {
    id: "tx1",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    txid: "0x7a69b1c21c7647e5a45356585b0f98d1c2a2a8b2c3d4e5f6a7b8c9d0e1f2a3b4",
    fromAccount: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    toAccount: "0x8A7F8E9D1C2B3A4F5E6D7C8B9A0F1E2D3C4B5A6E",
    asset: "ETH",
    amount: 1.25,
    status: "confirmed",
    networkFee: 0.0025,
    exchangeRate: 3450.75,
    type: "transfer",
    explorerUrl: "https://etherscan.io/tx/0x7a69b1c21c7647e5a45356585b0f98d1c2a2a8b2c3d4e5f6a7b8c9d0e1f2a3b4",
    accountType: "wallet"
  },
  {
    id: "tx2",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    txid: "0x8b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
    fromAccount: "8ZmHXQqMxAUy4FcJJ7hnMQqHiADRBu3X7uDjzcqiLjXV",
    toAccount: "Coinbase",
    asset: "SOL",
    amount: 15.5,
    status: "confirmed",
    networkFee: 0.00005,
    exchangeRate: 102.75,
    type: "withdrawal",
    explorerUrl: "https://solscan.io/tx/0x8b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
    accountType: "exchange"
  },
  {
    id: "tx3",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    txid: "0x9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0",
    fromAccount: "Binance",
    toAccount: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    asset: "BTC",
    amount: 0.075,
    status: "pending",
    networkFee: 0.0001,
    exchangeRate: 65432.10,
    type: "deposit",
    explorerUrl: "https://www.blockchain.com/explorer/transactions/btc/0x9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0",
    accountType: "exchange"
  },
  {
    id: "tx4",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    txid: "0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1",
    fromAccount: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    toAccount: "0xD3F4A5B6C7D8E9F0A1B2C3D4E5F6A7B8C9D0E1F2",
    asset: "USDC",
    amount: 5000,
    status: "failed",
    networkFee: 0.5,
    exchangeRate: 1.0,
    type: "transfer",
    explorerUrl: "https://etherscan.io/tx/0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1",
    accountType: "wallet"
  },
  {
    id: "tx5",
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    txid: "0xb2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
    fromAccount: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    toAccount: "Kraken",
    asset: "ETH",
    amount: 2.5,
    status: "confirmed",
    networkFee: 0.003,
    exchangeRate: 3425.50,
    type: "withdrawal",
    explorerUrl: "https://etherscan.io/tx/0xb2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
    accountType: "exchange"
  },
  // New brokerage transactions
  {
    id: "tx6",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    txid: "TD-AMERITRADE-TX-12345",
    fromAccount: "Coinbase",
    toAccount: "TD Ameritrade",
    asset: "USD",
    amount: 10000,
    status: "confirmed",
    networkFee: 0,
    exchangeRate: 1.0,
    type: "brokerage_deposit",
    explorerUrl: "",
    accountType: "brokerage",
    brokerageInfo: {
      name: "TD Ameritrade",
      accountNumber: "****1234",
      transactionType: "ACH Transfer"
    }
  },
  {
    id: "tx7",
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    txid: "ETRADE-TX-67890",
    fromAccount: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    toAccount: "E*Trade",
    asset: "USD",
    amount: 5000,
    status: "confirmed",
    networkFee: 0,
    exchangeRate: 1.0,
    type: "brokerage_deposit",
    explorerUrl: "",
    accountType: "brokerage",
    brokerageInfo: {
      name: "E*Trade",
      accountNumber: "****5678",
      transactionType: "Wire Transfer"
    }
  },
  {
    id: "tx8",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    txid: "ETRADE-TX-67891",
    fromAccount: "E*Trade",
    toAccount: "Kraken",
    asset: "USD",
    amount: 2500,
    status: "confirmed",
    networkFee: 0,
    exchangeRate: 1.0,
    type: "brokerage_withdrawal",
    explorerUrl: "",
    accountType: "brokerage",
    brokerageInfo: {
      name: "E*Trade",
      accountNumber: "****5678",
      transactionType: "ACH Transfer"
    }
  },
  {
    id: "tx9",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    txid: "BANK-TRANSFER-12345",
    fromAccount: "Bank Account ****4321",
    toAccount: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    asset: "USD",
    amount: 2000,
    status: "confirmed",
    networkFee: 0,
    exchangeRate: 1.0,
    type: "wallet_funding",
    explorerUrl: "",
    accountType: "wallet"
  },
  {
    id: "tx10",
    timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    txid: "TD-AMERITRADE-TX-12346",
    fromAccount: "TD Ameritrade",
    toAccount: "0x8A7F8E9D1C2B3A4F5E6D7C8B9A0F1E2D3C4B5A6E",
    asset: "USD",
    amount: 3500,
    status: "confirmed",
    networkFee: 0,
    exchangeRate: 1.0,
    type: "brokerage_withdrawal",
    explorerUrl: "",
    accountType: "brokerage",
    brokerageInfo: {
      name: "TD Ameritrade",
      accountNumber: "****1234",
      transactionType: "Wire Transfer"
    }
  }
];

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return format(date, "yyyy-MM-dd HH:mm:ss 'UTC'");
};

// Helper function to truncate long strings
const truncate = (str: string, n: number) => {
  return str.length > n ? str.substr(0, n - 1) + "..." : str;
};

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

// Helper function to export transactions to CSV
const exportToCSV = (transactions: Transaction[]) => {
  const headers = [
    "Timestamp (UTC)",
    "Transaction ID (TXID)",
    "From Account/Wallet",
    "To Account/Wallet",
    "Asset",
    "Amount",
    "Status",
    "Network Fee",
    "Exchange Rate (USD)",
    "Type",
    "Batch ID"
  ];

  const rows = transactions.map(tx => [
    formatDate(tx.timestamp),
    tx.txid,
    tx.fromAccount,
    tx.toAccount,
    tx.asset,
    tx.amount.toString(),
    tx.status,
    tx.networkFee.toString(),
    tx.exchangeRate.toString(),
    tx.type,
    tx.batchId || ""
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.join(","))
  ].join("\n");

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `transaction-log-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Helper function to get badge color based on transaction type
const getTypeBadgeColor = (type: string) => {
  switch (type) {
    case 'deposit':
      return 'bg-green-500 hover:bg-green-600';
    case 'withdrawal':
      return 'bg-red-500 hover:bg-red-600';
    case 'trade':
      return 'bg-blue-500 hover:bg-blue-600';
    case 'transfer':
      return 'bg-purple-500 hover:bg-purple-600';
    case 'brokerage_deposit':
      return 'bg-emerald-500 hover:bg-emerald-600';
    case 'brokerage_withdrawal':
      return 'bg-orange-500 hover:bg-orange-600';
    case 'wallet_funding':
      return 'bg-cyan-500 hover:bg-cyan-600';
    default:
      return 'bg-gray-500 hover:bg-gray-600';
  }
};

// Helper function to format transaction type for display
const formatTransactionType = (type: string) => {
  switch (type) {
    case 'deposit':
      return 'Deposit';
    case 'withdrawal':
      return 'Withdrawal';
    case 'trade':
      return 'Trade';
    case 'transfer':
      return 'Transfer';
    case 'brokerage_deposit':
      return 'Brokerage Deposit';
    case 'brokerage_withdrawal':
      return 'Brokerage Withdrawal';
    case 'wallet_funding':
      return 'Wallet Funding';
    default:
      return type.charAt(0).toUpperCase() + type.slice(1);
  }
};

const TransactionHistory: React.FC = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(mockTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [assetFilter, setAssetFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [walletFilter, setWalletFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Transaction | ''; direction: 'asc' | 'desc' }>({
    key: 'timestamp',
    direction: 'desc'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);

  // Get unique values for filters
  const uniqueAssets = Array.from(new Set(transactions.map(tx => tx.asset)));
  const uniqueStatuses = Array.from(new Set(transactions.map(tx => tx.status)));
  const uniqueTypes = Array.from(new Set(transactions.map(tx => tx.type)));
  const uniqueWallets = Array.from(new Set([
    ...transactions.map(tx => tx.fromAccount),
    ...transactions.map(tx => tx.toAccount)
  ]));
  
  // Calculate total transaction volume
  const totalVolume = transactions.reduce((sum, tx) => sum + (tx.amount * tx.exchangeRate), 0);
  
  // Calculate total fees paid
  const totalFees = transactions.reduce((sum, tx) => sum + (tx.networkFee * tx.exchangeRate), 0);
  
  // Count transactions by type
  const transactionsByType = transactions.reduce((acc, tx) => {
    acc[tx.type] = (acc[tx.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...transactions];
    
    // Filter by date range
    if (startDate) {
      filtered = filtered.filter(tx => {
        const txDate = new Date(tx.timestamp);
        return txDate >= startDate;
      });
    }
    
    if (endDate) {
      // Add one day to include the end date fully
      const endDatePlusOne = new Date(endDate);
      endDatePlusOne.setDate(endDatePlusOne.getDate() + 1);
      filtered = filtered.filter(tx => {
        const txDate = new Date(tx.timestamp);
        return txDate < endDatePlusOne;
      });
    }
    
    // Filter by asset
    if (assetFilter && assetFilter !== "all") {
      filtered = filtered.filter(tx => tx.asset === assetFilter);
    }
    
    // Filter by status
    if (statusFilter && statusFilter !== "all") {
      filtered = filtered.filter(tx => tx.status === statusFilter);
    }
    
    // Filter by type
    if (typeFilter && typeFilter !== 'all') {
      filtered = filtered.filter(tx => tx.type === typeFilter);
    }
    
    // Filter by wallet/account
    if (walletFilter) {
      if (walletFilter === 'wallet' || walletFilter === 'exchange' || walletFilter === 'brokerage') {
        // Filter by account type
        filtered = filtered.filter(tx => tx.accountType === walletFilter);
      } else if (walletFilter !== 'all') {
        // Filter by specific wallet address
        filtered = filtered.filter(tx => 
          tx.fromAccount === walletFilter || tx.toAccount === walletFilter
        );
      }
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(tx => 
        tx.txid.toLowerCase().includes(term) ||
        tx.fromAccount.toLowerCase().includes(term) ||
        tx.toAccount.toLowerCase().includes(term) ||
        tx.asset.toLowerCase().includes(term) ||
        tx.type.toLowerCase().includes(term) ||
        (tx.brokerageInfo?.name && tx.brokerageInfo.name.toLowerCase().includes(term)) ||
        (tx.brokerageInfo?.accountNumber && tx.brokerageInfo.accountNumber.toLowerCase().includes(term))
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      } else {
        // Default to timestamp sorting if types don't match
        return sortConfig.direction === 'asc'
          ? new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          : new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
    });
    
    setFilteredTransactions(filtered);
  }, [
    transactions, 
    searchTerm, 
    statusFilter, 
    assetFilter, 
    typeFilter, 
    walletFilter, 
    startDate, 
    endDate,
    sortConfig
  ]);
  
  // Handle sort click
  const handleSort = (field: keyof Transaction) => {
    if (field === sortConfig.key) {
      setSortConfig({ key: field, direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' });
    } else {
      setSortConfig({ key: field, direction: 'asc' });
    }
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setAssetFilter("all");
    setTypeFilter("all");
    setWalletFilter("all");
    setStartDate(null);
    setEndDate(null);
  };
  
  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'confirmed': return "bg-green-500 hover:bg-green-600";
      case 'pending': return "bg-yellow-500 hover:bg-yellow-600";
      case 'failed': return "bg-red-500 hover:bg-red-600";
      default: return "bg-gray-500 hover:bg-gray-600";
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent">
              Transaction History
            </h1>
            <p className="text-gray-400 mt-1">
              Complete record of all your financial transactions
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Button 
              onClick={() => navigate('/dashboard')}
              variant="outline" 
              className="border-teal-500 hover:bg-gray-800 hover:text-teal-300 text-teal-400"
            >
              Back to Dashboard
            </Button>
            <Button 
              onClick={() => exportToCSV(filteredTransactions)}
              className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700"
            >
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>
        
        {/* Transaction Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-400 text-sm">Total Transactions</p>
                  <p className="text-2xl font-bold text-white">{transactions.length}</p>
                </div>
                <div className="bg-teal-500/20 p-3 rounded-full">
                  <FileText className="h-6 w-6 text-teal-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-400 text-sm">Total Volume</p>
                  <p className="text-2xl font-bold text-white">${totalVolume.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
                </div>
                <div className="bg-cyan-500/20 p-3 rounded-full">
                  <DollarSign className="h-6 w-6 text-cyan-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-400 text-sm">Total Fees</p>
                  <p className="text-2xl font-bold text-white">${totalFees.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
                </div>
                <div className="bg-purple-500/20 p-3 rounded-full">
                  <BarChart2 className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-400 text-sm">Last Transaction</p>
                  <p className="text-2xl font-bold text-white">{formatDate(transactions[0]?.timestamp || '')}</p>
                </div>
                <div className="bg-emerald-500/20 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Filters */}
        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by TXID, wallet, or asset..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 bg-gray-700 border-gray-600"
                />
              </div>
              
              {/* Status filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Asset filter */}
              <Select value={assetFilter} onValueChange={setAssetFilter}>
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Asset" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="all">All Assets</SelectItem>
                  {uniqueAssets.map(asset => (
                    <SelectItem key={asset} value={asset}>{asset}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Type filter */}
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="deposit">Deposit</SelectItem>
                  <SelectItem value="withdrawal">Withdrawal</SelectItem>
                  <SelectItem value="trade">Trade</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                  <SelectItem value="brokerage_deposit">Brokerage Deposit</SelectItem>
                  <SelectItem value="brokerage_withdrawal">Brokerage Withdrawal</SelectItem>
                  <SelectItem value="wallet_funding">Wallet Funding</SelectItem>
                  </SelectContent>
              </Select>
              
              {/* Wallet filter */}
              <Select value={walletFilter} onValueChange={setWalletFilter}>
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Wallet/Account" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="all">All Accounts</SelectItem>
                  <SelectItem value="wallet">Wallets</SelectItem>
                  <SelectItem value="exchange">Exchanges</SelectItem>
                  <SelectItem value="brokerage">Brokerages</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Date range */}
              <div className="flex space-x-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="bg-gray-700 border-gray-600 text-gray-300 w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Start Date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-gray-700 border-gray-600">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="bg-gray-700 border-gray-600 text-gray-300 w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "End Date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-gray-700 border-gray-600">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              {/* Reset filters button */}
              <Button
                variant="outline"
                onClick={resetFilters}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Reset Filters
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Transaction Table */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-900">
                  <TableRow>
                    <TableHead 
                      className="text-gray-300 cursor-pointer hover:text-teal-400"
                      onClick={() => handleSort('timestamp')}
                    >
                      <div className="flex items-center">
                        Timestamp (UTC)
                        {sortConfig.key === 'timestamp' && (
                          sortConfig.direction === 'asc' ? 
                            <SortAsc className="ml-1 w-4 h-4" /> : 
                            <SortDesc className="ml-1 w-4 h-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead 
                      className="text-gray-300 cursor-pointer hover:text-teal-400"
                      onClick={() => handleSort('asset')}
                    >
                      <div className="flex items-center">
                        Asset
                        {sortConfig.key === 'asset' && (
                          sortConfig.direction === 'asc' ? 
                            <SortAsc className="ml-1 w-4 h-4" /> : 
                            <SortDesc className="ml-1 w-4 h-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="text-gray-300 cursor-pointer hover:text-teal-400"
                      onClick={() => handleSort('amount')}
                    >
                      <div className="flex items-center">
                        Amount
                        {sortConfig.key === 'amount' && (
                          sortConfig.direction === 'asc' ? 
                            <SortAsc className="ml-1 w-4 h-4" /> : 
                            <SortDesc className="ml-1 w-4 h-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="text-gray-300 cursor-pointer hover:text-teal-400"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center">
                        Status
                        {sortConfig.key === 'status' && (
                          sortConfig.direction === 'asc' ? 
                            <SortAsc className="ml-1 w-4 h-4" /> : 
                            <SortDesc className="ml-1 w-4 h-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Fee</TableHead>
                    <TableHead>Value (USD)</TableHead>
                    <TableHead 
                      className="text-gray-300 cursor-pointer hover:text-teal-400"
                      onClick={() => handleSort('type')}
                    >
                      <div className="flex items-center">
                        Type
                        {sortConfig.key === 'type' && (
                          sortConfig.direction === 'asc' ? 
                            <SortAsc className="ml-1 w-4 h-4" /> : 
                            <SortDesc className="ml-1 w-4 h-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>TXID</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-8 text-gray-400">
                        No transactions found matching your filters
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.map(tx => (
                      <TableRow 
                        key={tx.id} 
                        className="border-gray-700 hover:bg-gray-700/50 cursor-pointer"
                        onClick={() => {
                          setSelectedTransaction(tx);
                          setShowTransactionDetails(true);
                        }}
                      >
                        <TableCell className="whitespace-nowrap">{formatDate(tx.timestamp)}</TableCell>
                        <TableCell>
                          {tx.fromAccount}
                          {tx.accountType === 'brokerage' && tx.brokerageInfo && (
                            <div className="text-xs text-gray-400 mt-1">
                              {tx.brokerageInfo.name} ({tx.brokerageInfo.accountNumber})
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {tx.toAccount}
                          {tx.type === 'brokerage_deposit' && (
                            <div className="text-xs text-gray-400 mt-1">
                              {tx.brokerageInfo?.transactionType}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>{tx.asset}</TableCell>
                        <TableCell>{tx.amount}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadgeColor(tx.status)}>
                            {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{tx.networkFee} {tx.asset}</TableCell>
                        <TableCell>{formatCurrency(tx.amount * tx.exchangeRate)}</TableCell>
                        <TableCell>
                          <Badge className={getTypeBadgeColor(tx.type)}>
                            {formatTransactionType(tx.type)}
                          </Badge>
                          {tx.batchId && (
                            <Badge variant="outline" className="ml-2 border-gray-500 text-gray-300">
                              Batch
                            </Badge>
                          )}
                          {tx.tags && tx.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {tx.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs border-gray-600 text-gray-400">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {tx.explorerUrl ? (
                            <a 
                              href={tx.explorerUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center text-teal-500 hover:text-teal-400"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {truncate(tx.txid, 8)}
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          ) : (
                            <span className="text-gray-500">
                              {truncate(tx.txid, 12)}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-gray-400 hover:text-teal-400"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTransaction(tx);
                              setShowTransactionDetails(true);
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                              <circle cx="12" cy="12" r="1" />
                              <circle cx="19" cy="12" r="1" />
                              <circle cx="5" cy="12" r="1" />
                            </svg>
                            <span className="sr-only">View details</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        
        {/* Transaction Details Modal */}
        {showTransactionDetails && selectedTransaction && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-white">Transaction Details</h2>
                    <p className="text-gray-400 text-sm">
                      {formatDate(selectedTransaction.timestamp)}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                    onClick={() => setShowTransactionDetails(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    <span className="sr-only">Close</span>
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Transaction Info */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-gray-400 text-sm font-medium mb-1">Transaction Type</h3>
                      <Badge className={`${getTypeBadgeColor(selectedTransaction.type)} text-sm px-3 py-1`}>
                        {formatTransactionType(selectedTransaction.type)}
                      </Badge>
                    </div>
                    
                    <div>
                      <h3 className="text-gray-400 text-sm font-medium mb-1">Status</h3>
                      <Badge className={`${getStatusBadgeColor(selectedTransaction.status)} text-sm px-3 py-1`}>
                        {selectedTransaction.status.charAt(0).toUpperCase() + selectedTransaction.status.slice(1)}
                      </Badge>
                    </div>
                    
                    <div>
                      <h3 className="text-gray-400 text-sm font-medium mb-1">Amount</h3>
                      <p className="text-white text-lg font-semibold">
                        {selectedTransaction.amount} {selectedTransaction.asset}
                      </p>
                      <p className="text-gray-400 text-sm">
                        ≈ {formatCurrency(selectedTransaction.amount * selectedTransaction.exchangeRate)}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-gray-400 text-sm font-medium mb-1">Network Fee</h3>
                      <p className="text-white">
                        {selectedTransaction.networkFee} {selectedTransaction.asset}
                      </p>
                      <p className="text-gray-400 text-sm">
                        ≈ {formatCurrency(selectedTransaction.networkFee * selectedTransaction.exchangeRate)}
                      </p>
                    </div>
                    
                    {selectedTransaction.batchId && (
                      <div>
                        <h3 className="text-gray-400 text-sm font-medium mb-1">Batch ID</h3>
                        <p className="text-white">{selectedTransaction.batchId}</p>
                      </div>
                    )}
                    
                    {selectedTransaction.category && (
                      <div>
                        <h3 className="text-gray-400 text-sm font-medium mb-1">Category</h3>
                        <p className="text-white">{selectedTransaction.category}</p>
                      </div>
                    )}
                    
                    {selectedTransaction.tags && selectedTransaction.tags.length > 0 && (
                      <div>
                        <h3 className="text-gray-400 text-sm font-medium mb-1">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedTransaction.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="border-gray-600 text-gray-300">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Account Info */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-gray-400 text-sm font-medium mb-1">From</h3>
                      <p className="text-white font-medium break-all">{selectedTransaction.fromAccount}</p>
                      {selectedTransaction.accountType === 'brokerage' && selectedTransaction.brokerageInfo && (
                        <div className="mt-1 p-2 bg-gray-700/50 rounded text-sm">
                          <p className="text-teal-400 font-medium">{selectedTransaction.brokerageInfo.name}</p>
                          <p className="text-gray-300">Account: {selectedTransaction.brokerageInfo.accountNumber}</p>
                          <p className="text-gray-300">Transfer Type: {selectedTransaction.brokerageInfo.transactionType}</p>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-gray-400 text-sm font-medium mb-1">To</h3>
                      <p className="text-white font-medium break-all">{selectedTransaction.toAccount}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-gray-400 text-sm font-medium mb-1">Transaction ID</h3>
                      <div className="flex items-center">
                        <p className="text-white font-mono break-all">{selectedTransaction.txid}</p>
                        {selectedTransaction.explorerUrl && (
                          <a 
                            href={selectedTransaction.explorerUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="ml-2 text-teal-400 hover:text-teal-300"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-gray-400 text-sm font-medium mb-1">Exchange Rate</h3>
                      <p className="text-white">{selectedTransaction.exchangeRate} USD per {selectedTransaction.asset}</p>
                    </div>
                    
                    {selectedTransaction.notes && (
                      <div>
                        <h3 className="text-gray-400 text-sm font-medium mb-1">Notes</h3>
                        <p className="text-white bg-gray-700/50 p-3 rounded">{selectedTransaction.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-700 flex justify-between">
                  <Button 
                    variant="outline" 
                    className="border-teal-500 text-teal-400 hover:bg-teal-950"
                    onClick={() => setShowTransactionDetails(false)}
                  >
                    Close
                  </Button>
                  
                  {selectedTransaction.explorerUrl && (
                    <Button 
                      className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700"
                      onClick={() => window.open(selectedTransaction.explorerUrl, '_blank')}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View on Explorer
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;