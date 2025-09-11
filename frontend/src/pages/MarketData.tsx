import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import CoinChart from "../components/CoinChart";
import { coinGeckoService, Coin } from "../services/coinGeckoService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const MarketData = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(true); // Match the dashboard theme
  const [globalData, setGlobalData] = useState<any>(null);
  const navigate = useNavigate();

  // Get the dark mode state from localStorage if available
  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode");
    if (storedDarkMode !== null) {
      setDarkMode(storedDarkMode === "true");
    }
  }, []);

  // Fetch top coins and global market data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [coinsData, globalMarketData] = await Promise.all([
          coinGeckoService.getTopCoins(20),
          coinGeckoService.getGlobalData()
        ]);
        
        setCoins(coinsData);
        setGlobalData(globalMarketData?.data || null);
        
        // Set the first coin as selected by default
        if (coinsData.length > 0 && !selectedCoin) {
          setSelectedCoin(coinsData[0]);
        }
      } catch (error) {
        console.error("Error fetching market data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Search for coins
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      // Use a more comprehensive search approach
      const searchResults = await coinGeckoService.searchCoins(searchQuery);
      
      if (searchResults.length > 0) {
        // Get detailed data for the first search result
        const coinId = searchResults[0].id;
        
        // Try to find the coin in our existing list first (faster)
        let foundCoin = coins.find(c => c.id === coinId);
        
        if (!foundCoin) {
          // If not found in our list, fetch detailed data
          try {
            const coinDetails = await coinGeckoService.getCoinDetails(coinId);
            if (coinDetails) {
              // Create a simplified coin object from the details
              foundCoin = {
                id: coinDetails.id,
                symbol: coinDetails.symbol,
                name: coinDetails.name,
                image: coinDetails.image?.large || '',
                current_price: coinDetails.market_data?.current_price?.usd || 0,
                market_cap: coinDetails.market_data?.market_cap?.usd || 0,
                market_cap_rank: coinDetails.market_cap_rank || 999,
                fully_diluted_valuation: coinDetails.market_data?.fully_diluted_valuation?.usd || 0,
                total_volume: coinDetails.market_data?.total_volume?.usd || 0,
                high_24h: coinDetails.market_data?.high_24h?.usd || 0,
                low_24h: coinDetails.market_data?.low_24h?.usd || 0,
                price_change_24h: coinDetails.market_data?.price_change_24h || 0,
                price_change_percentage_24h: coinDetails.market_data?.price_change_percentage_24h || 0,
                market_cap_change_24h: coinDetails.market_data?.market_cap_change_24h || 0,
                market_cap_change_percentage_24h: coinDetails.market_data?.market_cap_change_percentage_24h || 0,
                circulating_supply: coinDetails.market_data?.circulating_supply || 0,
                total_supply: coinDetails.market_data?.total_supply || 0,
                max_supply: coinDetails.market_data?.max_supply || 0,
                ath: coinDetails.market_data?.ath?.usd || 0,
                ath_change_percentage: coinDetails.market_data?.ath_change_percentage?.usd || 0,
                ath_date: coinDetails.market_data?.ath_date?.usd || '',
                atl: coinDetails.market_data?.atl?.usd || 0,
                atl_change_percentage: coinDetails.market_data?.atl_change_percentage?.usd || 0,
                atl_date: coinDetails.market_data?.atl_date?.usd || '',
                last_updated: coinDetails.last_updated || '',
              };
            }
          } catch (detailsError) {
            console.error("Error fetching coin details:", detailsError);
          }
        }
        
        if (foundCoin) {
          setSelectedCoin(foundCoin);
        } else {
          // If we still couldn't get the coin data, show an error
          console.error("Could not find detailed data for:", coinId);
        }
      } else {
        console.error("No search results found for:", searchQuery);
      }
    } catch (error) {
      console.error("Error searching for coins:", error);
    } finally {
      setLoading(false);
    }
  };

  // Format large numbers with abbreviations
  const formatNumber = (num: number) => {
    if (num >= 1000000000000) {
      return (num / 1000000000000).toFixed(2) + 'T';
    }
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(2) + 'B';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(2) + 'K';
    }
    return num.toString();
  };

  // Get color based on price change
  const getPriceChangeColor = (change: number) => {
    if (change > 0) return "text-green-500";
    if (change < 0) return "text-red-500";
    return darkMode ? "text-gray-400" : "text-gray-600";
  };

  // Get chart color based on coin
  const getChartColor = (symbol: string) => {
    const colors: Record<string, string> = {
      btc: "#F7931A", // Bitcoin
      eth: "#627EEA", // Ethereum
      sol: "#00FFA3", // Solana
      usdt: "#26A17B", // Tether
      usdc: "#2775CA", // USD Coin
      bnb: "#F3BA2F", // Binance Coin
      xrp: "#23292F", // XRP
      ada: "#0033AD", // Cardano
      doge: "#C2A633", // Dogecoin
      dot: "#E6007A", // Polkadot
    };
    
    return colors[symbol.toLowerCase()] || "#14b8a6"; // Default to teal
  };

  // Theme classes
  const themeClasses = darkMode 
    ? "bg-gray-900 text-white" 
    : "bg-gray-100 text-gray-900";
  
  const cardClasses = darkMode 
    ? "bg-gray-800 border-gray-700" 
    : "bg-white border-gray-200";
  
  const textHighlightClass = "text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500";

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Card className="w-full max-w-md bg-gray-900 text-white">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription className="text-gray-400">
              Please log in to access the market data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/login')}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-600"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${themeClasses} p-4 md:p-8 transition-colors duration-500`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent">
              Cryptocurrency Market Data
            </h1>
            <p className="text-white">
              Real-time prices and charts powered by CoinGecko
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="border-teal-500 text-teal-400 hover:bg-gray-700 hover:text-teal-300 mr-2"
            >
              Back to Dashboard
            </Button>
            <div className="relative">
              <Input
                type="text"
                placeholder="Search any coin (BTC, ETH, SOL, XMR, ERC-20...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pr-10 bg-gray-800 border-gray-700 text-white w-64"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={handleSearch}
              >
                <Search className="h-4 w-4 text-white" />
              </Button>
            </div>
          </div>
        </div>

        {/* Global Market Data */}
        {globalData && (
          <Card className={`${cardClasses} mb-6`}>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-white">
                    Market Cap
                  </p>
                  <p className="font-bold text-white">
                    ${formatNumber(globalData.total_market_cap.usd)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-white">
                    24h Volume
                  </p>
                  <p className="font-bold text-white">
                    ${formatNumber(globalData.total_volume.usd)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-white">
                    BTC Dominance
                  </p>
                  <p className="font-bold text-white">
                    {globalData.market_cap_percentage.btc.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-white">
                    Active Cryptocurrencies
                  </p>
                  <p className="font-bold text-white">
                    {globalData.active_cryptocurrencies}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coin List */}
          <Card className={`${cardClasses} lg:col-span-1`}>
            <CardHeader>
              <CardTitle className={textHighlightClass}>Top Cryptocurrencies</CardTitle>
              <CardDescription className="text-white">
                By market capitalization
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[600px] overflow-y-auto">
                {loading ? (
                  <div className="p-4 space-y-4">
                    {Array(10).fill(0).map((_, i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <Skeleton className={`h-10 w-10 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-200"}`} />
                        <div className="space-y-2 flex-1">
                          <Skeleton className={`h-4 w-1/3 ${darkMode ? "bg-gray-700" : "bg-gray-200"}`} />
                          <Skeleton className={`h-4 w-1/2 ${darkMode ? "bg-gray-700" : "bg-gray-200"}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    {coins.map((coin) => (
                      <div 
                        key={coin.id}
                        className={`flex items-center p-4 border-b ${
                          darkMode ? "border-gray-700 hover:bg-gray-700" : "border-gray-200 hover:bg-gray-100"
                        } cursor-pointer ${selectedCoin?.id === coin.id ? (darkMode ? "bg-gray-700" : "bg-gray-100") : ""}`}
                        onClick={() => setSelectedCoin(coin)}
                      >
                        <div className="flex-shrink-0 mr-4">
                          <img 
                            src={coin.image} 
                            alt={coin.name} 
                            className="w-8 h-8 rounded-full"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium text-white">{coin.name}</p>
                              <p className="text-xs text-white">
                                {coin.symbol.toUpperCase()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-white">
                                ${coin.current_price.toLocaleString(undefined, { 
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 6 
                                })}
                              </p>
                              <p className={`text-xs ${getPriceChangeColor(coin.price_change_percentage_24h)}`}>
                                {coin.price_change_percentage_24h >= 0 ? "+" : ""}
                                {coin.price_change_percentage_24h.toFixed(2)}%
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Coin Chart */}
          <div className="lg:col-span-2">
            {selectedCoin ? (
              <CoinChart 
                coinId={selectedCoin.id} 
                coinName={selectedCoin.name} 
                color={getChartColor(selectedCoin.symbol)}
                darkMode={darkMode}
              />
            ) : loading ? (
              <Card className={cardClasses}>
                <CardHeader>
                  <Skeleton className={`h-8 w-1/3 ${darkMode ? "bg-gray-700" : "bg-gray-200"}`} />
                  <Skeleton className={`h-4 w-1/2 ${darkMode ? "bg-gray-700" : "bg-gray-200"}`} />
                </CardHeader>
                <CardContent>
                  <Skeleton className={`h-64 w-full ${darkMode ? "bg-gray-700" : "bg-gray-200"}`} />
                </CardContent>
              </Card>
            ) : (
              <Card className={cardClasses}>
                <CardHeader>
                  <CardTitle className={textHighlightClass}>Select a Cryptocurrency</CardTitle>
                  <CardDescription className="text-white">
                    Choose a coin from the list to view its chart
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-64">
                  <p className="text-white">
                    No cryptocurrency selected
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Coin Details */}
            {selectedCoin && (
              <Card className={`${cardClasses} mt-6`}>
                <CardHeader>
                  <CardTitle className={textHighlightClass}>
                    {selectedCoin.name} Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-white">
                        Market Cap
                      </p>
                      <p className="font-bold text-white">
                        ${formatNumber(selectedCoin.market_cap)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-white">
                        24h Volume
                      </p>
                      <p className="font-bold text-white">
                        ${formatNumber(selectedCoin.total_volume)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-white">
                        Circulating Supply
                      </p>
                      <p className="font-bold text-white">
                        {formatNumber(selectedCoin.circulating_supply)} {selectedCoin.symbol.toUpperCase()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-white">
                        All-Time High
                      </p>
                      <p className="font-bold text-white">
                        ${selectedCoin.ath.toLocaleString()}
                        <span className="text-red-500 text-xs ml-1">
                          {selectedCoin.ath_change_percentage.toFixed(1)}% from ATH
                        </span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketData;
