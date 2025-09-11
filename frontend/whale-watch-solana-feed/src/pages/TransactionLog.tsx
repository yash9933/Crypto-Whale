import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertCircle, 
  ArrowDown, 
  ArrowUp, 
  ChevronLeft, 
  ChevronRight, 
  Search,
  BarChart3,
  PieChart,
  LineChart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  Filter,
  Table as TableIcon
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Mock transaction data
const mockTransactions = [
  {
    id: "tx1",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    type: "buy",
    asset: "SOL",
    amount: 10.5,
    price: 102.75,
    total: 1078.88,
    fee: 2.5,
    status: "completed",
    exchange: "Coinbase",
    wallet: "8ZmHXQqMxAUy4FcJJ7hnMQqHiADRBu3X7uDjzcqiLjXV"
  },
  {
    id: "tx2",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    type: "sell",
    asset: "ETH",
    amount: 1.2,
    price: 3450.25,
    total: 4140.30,
    fee: 8.75,
    status: "completed",
    exchange: "Binance",
    wallet: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
  },
  {
    id: "tx3",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    type: "transfer",
    asset: "BTC",
    amount: 0.25,
    price: 42500.00,
    total: 10625.00,
    fee: 0.0005,
    status: "completed",
    exchange: null,
    wallet: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
  },
  {
    id: "tx4",
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    type: "buy",
    asset: "AVAX",
    amount: 50,
    price: 28.75,
    total: 1437.50,
    fee: 3.25,
    status: "completed",
    exchange: "Kraken",
    wallet: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
  },
  {
    id: "tx5",
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    type: "buy",
    asset: "SOL",
    amount: 25,
    price: 98.50,
    total: 2462.50,
    fee: 5.75,
    status: "completed",
    exchange: "Coinbase",
    wallet: "8ZmHXQqMxAUy4FcJJ7hnMQqHiADRBu3X7uDjzcqiLjXV"
  },
  {
    id: "tx6",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    type: "sell",
    asset: "BTC",
    amount: 0.1,
    price: 43250.00,
    total: 4325.00,
    fee: 8.65,
    status: "pending",
    exchange: "Binance",
    wallet: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
  },
  {
    id: "tx7",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    type: "buy",
    asset: "DOT",
    amount: 75,
    price: 13.25,
    total: 993.75,
    fee: 1.99,
    status: "completed",
    exchange: "Kraken",
    wallet: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
  },
  {
    id: "tx8",
    date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
    type: "buy",
    asset: "MATIC",
    amount: 500,
    price: 1.15,
    total: 575.00,
    fee: 1.15,
    status: "completed",
    exchange: "Binance",
    wallet: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
  },
  {
    id: "tx9",
    date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days ago
    type: "sell",
    asset: "AVAX",
    amount: 20,
    price: 30.50,
    total: 610.00,
    fee: 1.22,
    status: "completed",
    exchange: "Coinbase",
    wallet: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
  },
  {
    id: "tx10",
    date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(), // 18 days ago
    type: "transfer",
    asset: "ETH",
    amount: 2.5,
    price: 3200.00,
    total: 8000.00,
    fee: 0.001,
    status: "completed",
    exchange: null,
    wallet: "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7"
  },
  {
    id: "tx11",
    date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
    type: "buy",
    asset: "SOL",
    amount: 15,
    price: 95.25,
    total: 1428.75,
    fee: 2.86,
    status: "completed",
    exchange: "Binance",
    wallet: "8ZmHXQqMxAUy4FcJJ7hnMQqHiADRBu3X7uDjzcqiLjXV"
  },
  {
    id: "tx12",
    date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(), // 25 days ago
    type: "buy",
    asset: "BTC",
    amount: 0.15,
    price: 41000.00,
    total: 6150.00,
    fee: 12.30,
    status: "completed",
    exchange: "Coinbase",
    wallet: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
  }
];

// Mock price history data for charts
const generatePriceHistoryData = (days = 30, startPrice = 100, volatility = 0.03) => {
  const data = [];
  let currentPrice = startPrice;
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Add some random price movement
    const change = (Math.random() - 0.5) * 2 * volatility;
    currentPrice = currentPrice * (1 + change);
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: currentPrice
    });
  }
  
  return data;
};

// Generate mock price history for different assets
const mockPriceHistory = {
  SOL: generatePriceHistoryData(30, 100, 0.05),
  BTC: generatePriceHistoryData(30, 42000, 0.02),
  ETH: generatePriceHistoryData(30, 3200, 0.03),
  AVAX: generatePriceHistoryData(30, 28, 0.04),
  MATIC: generatePriceHistoryData(30, 1.2, 0.06),
  DOT: generatePriceHistoryData(30, 13, 0.04)
};

// Helper function to calculate transaction statistics
const calculateTransactionStats = (transactions: any[]) => {
  // Total value of all transactions
  const totalValue = transactions.reduce((sum, tx) => sum + tx.total, 0);
  
  // Total fees paid
  const totalFees = transactions.reduce((sum, tx) => sum + tx.fee, 0);
  
  // Count by transaction type
  const typeCount = transactions.reduce((counts, tx) => {
    counts[tx.type] = (counts[tx.type] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);
  
  // Value by asset
  const assetValue = transactions.reduce((values, tx) => {
    if (!values[tx.asset]) {
      values[tx.asset] = 0;
    }
    
    if (tx.type === 'buy') {
      values[tx.asset] += tx.total;
    } else if (tx.type === 'sell') {
      values[tx.asset] -= tx.total;
    }
    
    return values;
  }, {} as Record<string, number>);
  
  // Transaction volume by date (for time series)
  const volumeByDate = transactions.reduce((volumes, tx) => {
    const date = tx.date.split('T')[0];
    volumes[date] = (volumes[date] || 0) + tx.total;
    return volumes;
  }, {} as Record<string, number>);
  
  // Convert to array for charting
  const volumeByDateArray = Object.entries(volumeByDate).map(([date, volume]) => ({
    date,
    volume: volume as number
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Calculate profit/loss (simplified)
  const profitLoss = transactions
    .filter(tx => tx.type === 'sell')
    .reduce((sum, tx) => sum + tx.total, 0) - 
    transactions
    .filter(tx => tx.type === 'buy')
    .reduce((sum, tx) => sum + tx.total, 0);
  
  return {
    totalValue,
    totalFees,
    typeCount,
    assetValue,
    volumeByDate: volumeByDateArray,
    profitLoss
  };
};

const TransactionLog: React.FC = () => {
  console.log("TransactionLog component rendered");
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);
  
  // Filter and pagination states
  const [searchTerm, setSearchTerm] = useState("");
  const [assetFilter, setAssetFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("transactions");
  const [timeRange, setTimeRange] = useState("30");
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  
  // Pagination settings
  const itemsPerPage = 5;

  // Get the dark mode state from localStorage if available
  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode");
    if (storedDarkMode !== null) {
      setDarkMode(storedDarkMode === "true");
    }
  }, []);

  // Simulate loading data
  useEffect(() => {
    console.log("Loading transaction data...");
    // Simulate API call
    const timer = setTimeout(() => {
      setIsLoading(false);
      console.log("Transaction data loaded successfully");
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Filter and sort transactions
  const filteredTransactions = mockTransactions.filter(tx => {
    // Search term filter (case insensitive)
    if (searchTerm && !Object.values(tx).some(value => 
      value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )) {
      return false;
    }
    
    // Asset filter
    if (assetFilter && tx.asset !== assetFilter) {
      return false;
    }
    
    // Type filter
    if (typeFilter && tx.type !== typeFilter) {
      return false;
    }
    
    // Status filter
    if (statusFilter && tx.status !== statusFilter) {
      return false;
    }
    
    return true;
  });

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortField === "date") {
      return sortDirection === "asc" 
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    
    if (sortField === "amount") {
      return sortDirection === "asc" ? a.amount - b.amount : b.amount - a.amount;
    }
    
    if (sortField === "price") {
      return sortDirection === "asc" ? a.price - b.price : b.price - a.price;
    }
    
    if (sortField === "total") {
      return sortDirection === "asc" ? a.total - b.total : b.total - a.total;
    }
    
    // Default sort by date desc
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Paginate transactions
  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);
  const paginatedTransactions = sortedTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate transaction statistics
  const stats = useMemo(() => {
    return calculateTransactionStats(filteredTransactions);
  }, [filteredTransactions]);

  // Get unique asset types for filter dropdown
  const uniqueAssets = Array.from(new Set(mockTransactions.map(tx => tx.asset)));
  
  // Get transaction type options
  const transactionTypes = ["buy", "sell", "transfer"];
  
  // Get transaction status options
  const statusTypes = ["completed", "pending", "failed"];

  // Handle sort toggle
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setAssetFilter("");
    setTypeFilter("");
    setStatusFilter("");
    setCurrentPage(1);
  };

  // View transaction details
  const viewTransactionDetails = (txId: string) => {
    setSelectedTransaction(selectedTransaction === txId ? null : txId);
  };

  // Theme classes
  const themeClasses = darkMode 
    ? "bg-gray-900 text-white" 
    : "bg-gray-100 text-gray-900";
  
  const cardClasses = darkMode 
    ? "bg-gray-800 border-gray-700" 
    : "bg-white border-gray-200";

  // Show login prompt if user is not authenticated, but still render the component
  const renderAuthPrompt = () => {
    if (!currentUser) {
      return (
        <Card className="w-full mb-6 bg-gray-800 border-gray-700 text-white">
          <CardHeader>
            <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500">Authentication Required</CardTitle>
            <CardDescription className="text-gray-400">
              Please log in to access all transaction features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button 
                onClick={() => navigate('/login')}
                className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700"
              >
                Go to Login
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="border-teal-500 text-teal-400 hover:bg-gray-700 hover:text-teal-300"
              >
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }
    return null;
  };

  // Generate chart data for transaction volume over time
  const volumeChartData = useMemo(() => {
    return stats.volumeByDate.map(item => ({
      name: item.date,
      value: item.volume
    }));
  }, [stats.volumeByDate]);

  // Generate chart data for asset allocation
  const assetAllocationData = useMemo(() => {
    return Object.entries(stats.assetValue).map(([asset, value]) => ({
      name: asset,
      value: Math.abs(Number(value))
    }));
  }, [stats.assetValue]);

  // Generate chart data for transaction types
  const transactionTypeData = useMemo(() => {
    return Object.entries(stats.typeCount).map(([type, count]) => ({
      name: type,
      value: Number(count)
    }));
  }, [stats.typeCount]);

  return (
    <div className={`min-h-screen ${themeClasses} p-4 md:p-8 transition-colors duration-500`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent">
              Transaction History
            </h1>
            <p className="text-white">
              View and analyze your crypto transaction history
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="border-teal-500 text-teal-400 hover:bg-gray-700 hover:text-teal-300"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>

        {/* Authentication Prompt */}
        {renderAuthPrompt()}

        {/* Error Message */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Main Tabs */}
        <Tabs 
          defaultValue="transactions" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="mb-6"
        >
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto bg-gray-800">
            <TabsTrigger 
              value="transactions"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white"
            >
              <TableIcon className="h-4 w-4 mr-2" />
              Transactions
            </TabsTrigger>
            <TabsTrigger 
              value="analytics"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Transactions Tab Content */}
          <TabsContent value="transactions">
            {/* Filters */}
            <Card className={`mb-6 ${cardClasses}`}>
              <CardHeader>
                <CardTitle className="text-white">Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="relative">
                    <Search className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search transactions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  
                  <Select value={assetFilter} onValueChange={setAssetFilter}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Asset" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600 text-white">
                      <SelectItem value="">All Assets</SelectItem>
                      {uniqueAssets.map(asset => (
                        <SelectItem key={asset} value={asset}>{asset}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600 text-white">
                      <SelectItem value="">All Types</SelectItem>
                      {transactionTypes.map(type => (
                        <SelectItem key={type} value={type} className="capitalize">{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600 text-white">
                      <SelectItem value="">All Statuses</SelectItem>
                      {statusTypes.map(status => (
                        <SelectItem key={status} value={status} className="capitalize">{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    variant="outline" 
                    onClick={resetFilters}
                    className="border-gray-600 text-white hover:bg-gray-700"
                  >
                    Reset Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Transactions Table */}
            <Card className={cardClasses}>
              <CardHeader>
                <CardTitle className="text-white">Transactions</CardTitle>
                <CardDescription className="text-gray-400">
                  {filteredTransactions.length} transactions found
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
                  </div>
                ) : paginatedTransactions.length === 0 ? (
                  <div className="text-center py-16 text-white">
                    <p className="text-gray-400 mb-4">No transactions found</p>
                    <Button 
                      onClick={resetFilters}
                      className="bg-gradient-to-r from-teal-500 to-cyan-600"
                    >
                      Reset Filters
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-gray-700">
                            <TableHead 
                              className="text-white cursor-pointer"
                              onClick={() => handleSort("date")}
                            >
                              Date
                              {sortField === "date" && (
                                sortDirection === "asc" ? 
                                  <ArrowUp className="inline ml-1 h-4 w-4" /> : 
                                  <ArrowDown className="inline ml-1 h-4 w-4" />
                              )}
                            </TableHead>
                            <TableHead className="text-white">Type</TableHead>
                            <TableHead className="text-white">Asset</TableHead>
                            <TableHead 
                              className="text-white cursor-pointer"
                              onClick={() => handleSort("amount")}
                            >
                              Amount
                              {sortField === "amount" && (
                                sortDirection === "asc" ? 
                                  <ArrowUp className="inline ml-1 h-4 w-4" /> : 
                                  <ArrowDown className="inline ml-1 h-4 w-4" />
                              )}
                            </TableHead>
                            <TableHead 
                              className="text-white cursor-pointer"
                              onClick={() => handleSort("price")}
                            >
                              Price
                              {sortField === "price" && (
                                sortDirection === "asc" ? 
                                  <ArrowUp className="inline ml-1 h-4 w-4" /> : 
                                  <ArrowDown className="inline ml-1 h-4 w-4" />
                              )}
                            </TableHead>
                            <TableHead 
                              className="text-white cursor-pointer"
                              onClick={() => handleSort("total")}
                            >
                              Total
                              {sortField === "total" && (
                                sortDirection === "asc" ? 
                                  <ArrowUp className="inline ml-1 h-4 w-4" /> : 
                                  <ArrowDown className="inline ml-1 h-4 w-4" />
                              )}
                            </TableHead>
                            <TableHead className="text-white">Status</TableHead>
                            <TableHead className="text-white">Details</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedTransactions.map((tx) => (
                            <React.Fragment key={tx.id}>
                              <TableRow className="border-gray-700 hover:bg-gray-700">
                                <TableCell className="text-white">
                                  {new Date(tx.date).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                  <Badge 
                                    className={
                                      tx.type === "buy" 
                                        ? "bg-green-900 text-green-300" 
                                        : tx.type === "sell"
                                        ? "bg-red-900 text-red-300"
                                        : "bg-blue-900 text-blue-300"
                                    }
                                  >
                                    {tx.type.toUpperCase()}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-white">{tx.asset}</TableCell>
                                <TableCell className="text-white">{tx.amount}</TableCell>
                                <TableCell className="text-white">${tx.price.toFixed(2)}</TableCell>
                                <TableCell className="text-white">${tx.total.toFixed(2)}</TableCell>
                                <TableCell>
                                  <Badge 
                                    className={
                                      tx.status === "completed" 
                                        ? "bg-green-900 text-green-300" 
                                        : tx.status === "pending"
                                        ? "bg-yellow-900 text-yellow-300"
                                        : "bg-red-900 text-red-300"
                                    }
                                  >
                                    {tx.status.toUpperCase()}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => viewTransactionDetails(tx.id)}
                                    className="text-teal-400 hover:text-teal-300 hover:bg-gray-700"
                                  >
                                    {selectedTransaction === tx.id ? "Hide" : "View"}
                                  </Button>
                                </TableCell>
                              </TableRow>
                              
                              {/* Transaction Details */}
                              {selectedTransaction === tx.id && (
                                <TableRow className="border-gray-700 bg-gray-700">
                                  <TableCell colSpan={8} className="p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div>
                                        <h4 className="text-white font-medium mb-2">Transaction Details</h4>
                                        <p className="text-gray-300">
                                          <span className="text-gray-400">ID:</span> {tx.id}
                                        </p>
                                        <p className="text-gray-300">
                                          <span className="text-gray-400">Date:</span> {new Date(tx.date).toLocaleString()}
                                        </p>
                                        <p className="text-gray-300">
                                          <span className="text-gray-400">Fee:</span> ${tx.fee.toFixed(2)}
                                        </p>
                                      </div>
                                      <div>
                                        <h4 className="text-white font-medium mb-2">Source/Destination</h4>
                                        {tx.exchange && (
                                          <p className="text-gray-300">
                                            <span className="text-gray-400">Exchange:</span> {tx.exchange}
                                          </p>
                                        )}
                                        <p className="text-gray-300">
                                          <span className="text-gray-400">Wallet:</span> {tx.wallet.substring(0, 8)}...{tx.wallet.substring(tx.wallet.length - 8)}
                                        </p>
                                      </div>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )}
                            </React.Fragment>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex justify-between items-center mt-6">
                        <div className="text-sm text-gray-400">
                          Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} transactions
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="border-gray-600 text-white hover:bg-gray-700"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="border-gray-600 text-white hover:bg-gray-700"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab Content */}
          <TabsContent value="analytics">
            {/* Analytics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className={cardClasses}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-400">Total Transaction Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-teal-500" />
                    <span className="text-2xl font-bold text-white">${stats.totalValue.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className={cardClasses}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-400">Total Fees Paid</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-yellow-500" />
                    <span className="text-2xl font-bold text-white">${stats.totalFees.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className={cardClasses}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-400">Profit/Loss (Simplified)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    {stats.profitLoss >= 0 ? (
                      <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                    ) : (
                      <TrendingDown className="h-5 w-5 mr-2 text-red-500" />
                    )}
                    <span className={`text-2xl font-bold ${stats.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      ${Math.abs(stats.profitLoss).toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className={cardClasses}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-400">Transaction Count</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-cyan-500" />
                    <span className="text-2xl font-bold text-white">{filteredTransactions.length}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Transaction Volume Chart */}
              <Card className={cardClasses}>
                <CardHeader>
                  <CardTitle className="text-white">Transaction Volume Over Time</CardTitle>
                  <CardDescription className="text-gray-400">
                    Daily transaction volume in USD
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 w-full">
                    {/* Placeholder for chart - in a real app, use a charting library like recharts */}
                    <div className="bg-gray-700 h-full w-full rounded-md p-4 flex flex-col">
                      <div className="flex justify-between mb-2">
                        <span className="text-xs text-gray-400">Volume</span>
                        <span className="text-xs text-gray-400">Date</span>
                      </div>
                      <div className="flex-1 flex items-end">
                        {volumeChartData.map((item, index) => (
                          <div 
                            key={index} 
                            className="flex-1 mx-0.5 bg-gradient-to-t from-teal-600 to-cyan-400 rounded-t-sm"
                            style={{ 
                              height: `${Math.min(100, (item.value / Math.max(...volumeChartData.map(d => d.value))) * 100)}%`,
                            }}
                            title={`${item.name}: $${item.value.toFixed(2)}`}
                          />
                        ))}
                      </div>
                      <div className="flex justify-between mt-2">
                        {volumeChartData.length > 0 && (
                          <>
                            <span className="text-xs text-gray-400">{volumeChartData[0].name}</span>
                            <span className="text-xs text-gray-400">
                              {volumeChartData[volumeChartData.length - 1].name}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Asset Allocation Chart */}
              <Card className={cardClasses}>
                <CardHeader>
                  <CardTitle className="text-white">Asset Allocation</CardTitle>
                  <CardDescription className="text-gray-400">
                    Distribution of transaction value by asset
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 w-full">
                    {/* Placeholder for pie chart */}
                    <div className="bg-gray-700 h-full w-full rounded-md p-4 flex flex-col items-center justify-center">
                      <div className="relative h-48 w-48 mb-4">
                        <div className="absolute inset-0 rounded-full border-8 border-gray-600"></div>
                        {assetAllocationData.map((item, index) => {
                          const total = assetAllocationData.reduce((sum, i) => sum + i.value, 0);
                          const percentage = (item.value / total) * 100;
                          const colors = ['bg-teal-500', 'bg-cyan-500', 'bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500'];
                          return (
                            <div 
                              key={index}
                              className={`absolute inset-0 ${colors[index % colors.length]} opacity-80`}
                              style={{
                                clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(index * (360 / assetAllocationData.length) * Math.PI / 180)}% ${50 - 50 * Math.sin(index * (360 / assetAllocationData.length) * Math.PI / 180)}%, ${50 + 50 * Math.cos((index + 1) * (360 / assetAllocationData.length) * Math.PI / 180)}% ${50 - 50 * Math.sin((index + 1) * (360 / assetAllocationData.length) * Math.PI / 180)}%)`
                              }}
                              title={`${item.name}: $${item.value.toFixed(2)} (${percentage.toFixed(1)}%)`}
                            />
                          );
                        })}
                        <div className="absolute inset-0 rounded-full border-4 border-gray-800"></div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {assetAllocationData.map((item, index) => {
                          const colors = ['bg-teal-500', 'bg-cyan-500', 'bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500'];
                          return (
                            <div key={index} className="flex items-center">
                              <div className={`h-3 w-3 ${colors[index % colors.length]} rounded-full mr-2`}></div>
                              <span className="text-xs text-white">{item.name}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Transaction Type Distribution */}
            <Card className={cardClasses}>
              <CardHeader>
                <CardTitle className="text-white">Transaction Type Distribution</CardTitle>
                <CardDescription className="text-gray-400">
                  Number of transactions by type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-40 w-full">
                  {/* Placeholder for horizontal bar chart */}
                  <div className="bg-gray-700 h-full w-full rounded-md p-4 flex flex-col justify-center">
                    {transactionTypeData.map((item, index) => {
                      const max = Math.max(...transactionTypeData.map(d => d.value));
                      const colors = ['bg-green-500', 'bg-red-500', 'bg-blue-500'];
                      return (
                        <div key={index} className="mb-3 last:mb-0">
                          <div className="flex justify-between mb-1">
                            <span className="text-xs text-white capitalize">{item.name}</span>
                            <span className="text-xs text-gray-400">{item.value}</span>
                          </div>
                          <div className="h-4 bg-gray-600 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${colors[index % colors.length]}`}
                              style={{ width: `${(item.value / max) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TransactionLog;