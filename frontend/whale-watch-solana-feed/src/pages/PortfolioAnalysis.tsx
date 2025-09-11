import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PortfolioAnalysis = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);
  const [timeRange, setTimeRange] = useState("1m"); // 1d, 1w, 1m, 3m, 1y, all
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [portfolioData, setPortfolioData] = useState<any>(null);

  // Get the dark mode state from localStorage if available
  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode");
    if (storedDarkMode !== null) {
      setDarkMode(storedDarkMode === "true");
    }
  }, []);

  // Load portfolio data when timeRange changes
  useEffect(() => {
    loadPortfolioData();
  }, [timeRange]);

  // Generate mock data for portfolio analysis
  const loadPortfolioData = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const mockData = generateMockData();
      setPortfolioData(mockData);
      setIsLoading(false);
    }, 1000);
  };

  // Generate mock data based on selected time range
  const generateMockData = () => {
    // Number of data points based on time range
    let dataPoints = 30;
    let startValue = 10000;
    let volatility = 0.03;
    let uptrend = 0.2; // Overall uptrend percentage
    
    switch (timeRange) {
      case "1d":
        dataPoints = 24; // Hourly for a day
        volatility = 0.01;
        uptrend = 0.03;
        break;
      case "1w":
        dataPoints = 7; // Daily for a week
        volatility = 0.02;
        uptrend = 0.05;
        break;
      case "1m":
        dataPoints = 30; // Daily for a month
        volatility = 0.03;
        uptrend = 0.1;
        break;
      case "3m":
        dataPoints = 90; // Daily for 3 months
        volatility = 0.04;
        uptrend = 0.15;
        break;
      case "1y":
        dataPoints = 12; // Monthly for a year
        volatility = 0.05;
        uptrend = 0.25;
        break;
      case "all":
        dataPoints = 24; // Monthly for 2 years
        volatility = 0.06;
        uptrend = 0.4;
        break;
    }

    // Generate portfolio value over time
    const portfolioValueData = [];
    const labels = [];
    
    let currentValue = startValue;
    const trendFactor = Math.pow(1 + uptrend, 1 / dataPoints);
    
    for (let i = 0; i < dataPoints; i++) {
      // Apply random volatility and general uptrend
      const randomFactor = 1 + (Math.random() * 2 - 1) * volatility;
      currentValue = currentValue * randomFactor * trendFactor;
      
      portfolioValueData.push(currentValue);
      
      // Generate appropriate labels based on time range
      if (timeRange === "1d") {
        labels.push(`${i}:00`);
      } else if (timeRange === "1w") {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        labels.push(days[i % 7]);
      } else if (timeRange === "1m" || timeRange === "3m") {
        labels.push(`Day ${i + 1}`);
      } else {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        labels.push(months[i % 12]);
      }
    }

    // Asset allocation data
    const assetAllocation = [
      { name: "SOL", value: 35, color: "rgba(20, 184, 166, 0.8)" },
      { name: "ETH", value: 25, color: "rgba(56, 189, 248, 0.8)" },
      { name: "BTC", value: 20, color: "rgba(139, 92, 246, 0.8)" },
      { name: "AVAX", value: 10, color: "rgba(244, 114, 182, 0.8)" },
      { name: "Other", value: 10, color: "rgba(251, 146, 60, 0.8)" }
    ];

    // Performance metrics
    const performanceMetrics = {
      totalValue: currentValue.toFixed(2),
      change24h: (Math.random() * 10 - 3).toFixed(2),
      change7d: (Math.random() * 20 - 5).toFixed(2),
      change30d: (Math.random() * 30 - 5).toFixed(2),
      totalGain: (currentValue - startValue).toFixed(2),
      totalGainPercentage: ((currentValue / startValue - 1) * 100).toFixed(2)
    };

    // Risk metrics
    const riskMetrics = {
      volatility: (volatility * 100).toFixed(2),
      sharpeRatio: (Math.random() * 2 + 0.5).toFixed(2),
      maxDrawdown: (Math.random() * 20 + 5).toFixed(2),
      beta: (Math.random() * 1.5).toFixed(2)
    };

    // Monthly returns
    const monthlyReturns = [];
    for (let i = 0; i < 12; i++) {
      monthlyReturns.push((Math.random() * 20 - 5));
    }

    return {
      portfolioValueData: {
        labels,
        datasets: [
          {
            label: 'Portfolio Value ($)',
            data: portfolioValueData,
            borderColor: 'rgba(20, 184, 166, 1)',
            backgroundColor: 'rgba(20, 184, 166, 0.1)',
            fill: true,
            tension: 0.4
          }
        ]
      },
      assetAllocation,
      performanceMetrics,
      riskMetrics,
      monthlyReturns: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
          {
            label: 'Monthly Returns (%)',
            data: monthlyReturns,
            backgroundColor: monthlyReturns.map(value => 
              value >= 0 ? 'rgba(20, 184, 166, 0.8)' : 'rgba(244, 63, 94, 0.8)'
            )
          }
        ]
      }
    };
  };

  // Theme classes
  const themeClasses = darkMode 
    ? "bg-gray-900 text-white" 
    : "bg-gray-100 text-gray-900";
  
  const cardClasses = darkMode 
    ? "bg-gray-800 border-gray-700" 
    : "bg-white border-gray-200";

  // Chart options
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          color: 'rgba(75, 85, 99, 0.2)'
        },
        ticks: {
          color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
        }
      },
      y: {
        grid: {
          color: 'rgba(75, 85, 99, 0.2)'
        },
        ticks: {
          color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
          callback: function(value: any) {
            return '$' + value.toLocaleString();
          }
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return '$' + context.raw.toLocaleString();
          }
        }
      }
    }
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
        }
      },
      y: {
        grid: {
          color: 'rgba(75, 85, 99, 0.2)'
        },
        ticks: {
          color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return context.raw.toFixed(2) + '%';
          }
        }
      }
    }
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
        }
      }
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Card className="w-full max-w-md bg-gray-900 text-white">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription className="text-gray-400">
              Please log in to view your portfolio analysis
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
              Portfolio Analysis
            </h1>
            <p className="text-white">
              Deep insights into your investment performance
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[150px] bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600 text-white">
                <SelectItem value="1d">1 Day</SelectItem>
                <SelectItem value="1w">1 Week</SelectItem>
                <SelectItem value="1m">1 Month</SelectItem>
                <SelectItem value="3m">3 Months</SelectItem>
                <SelectItem value="1y">1 Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="border-teal-500 text-teal-400 hover:bg-gray-700 hover:text-teal-300"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        ) : portfolioData ? (
          <>
            {/* Performance Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className={cardClasses}>
                <CardContent className="p-6">
                  <div className="text-sm text-gray-400">Total Portfolio Value</div>
                  <div className="text-2xl font-bold text-white mt-1">${Number(portfolioData.performanceMetrics.totalValue).toLocaleString()}</div>
                </CardContent>
              </Card>
              
              <Card className={cardClasses}>
                <CardContent className="p-6">
                  <div className="text-sm text-gray-400">24h Change</div>
                  <div className={`text-2xl font-bold mt-1 ${
                    Number(portfolioData.performanceMetrics.change24h) >= 0 
                      ? "text-green-400" 
                      : "text-red-400"
                  }`}>
                    {Number(portfolioData.performanceMetrics.change24h) >= 0 ? "+" : ""}
                    {portfolioData.performanceMetrics.change24h}%
                  </div>
                </CardContent>
              </Card>
              
              <Card className={cardClasses}>
                <CardContent className="p-6">
                  <div className="text-sm text-gray-400">7d Change</div>
                  <div className={`text-2xl font-bold mt-1 ${
                    Number(portfolioData.performanceMetrics.change7d) >= 0 
                      ? "text-green-400" 
                      : "text-red-400"
                  }`}>
                    {Number(portfolioData.performanceMetrics.change7d) >= 0 ? "+" : ""}
                    {portfolioData.performanceMetrics.change7d}%
                  </div>
                </CardContent>
              </Card>
              
              <Card className={cardClasses}>
                <CardContent className="p-6">
                  <div className="text-sm text-gray-400">Total Gain/Loss</div>
                  <div className={`text-2xl font-bold mt-1 ${
                    Number(portfolioData.performanceMetrics.totalGainPercentage) >= 0 
                      ? "text-green-400" 
                      : "text-red-400"
                  }`}>
                    {Number(portfolioData.performanceMetrics.totalGainPercentage) >= 0 ? "+" : ""}
                    {portfolioData.performanceMetrics.totalGainPercentage}%
                  </div>
                  <div className={`text-sm mt-1 ${
                    Number(portfolioData.performanceMetrics.totalGain) >= 0 
                      ? "text-green-400" 
                      : "text-red-400"
                  }`}>
                    {Number(portfolioData.performanceMetrics.totalGain) >= 0 ? "+" : ""}
                    ${Number(portfolioData.performanceMetrics.totalGain).toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Portfolio Value Chart */}
            <Card className={`${cardClasses} mb-6`}>
              <CardHeader>
                <CardTitle className="text-white">Portfolio Value Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <Line 
                    data={portfolioData.portfolioValueData} 
                    options={lineChartOptions}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Asset Allocation and Monthly Returns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card className={cardClasses}>
                <CardHeader>
                  <CardTitle className="text-white">Asset Allocation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <Doughnut 
                      data={{
                        labels: portfolioData.assetAllocation.map((asset: any) => asset.name),
                        datasets: [
                          {
                            data: portfolioData.assetAllocation.map((asset: any) => asset.value),
                            backgroundColor: portfolioData.assetAllocation.map((asset: any) => asset.color),
                            borderWidth: 1,
                            borderColor: darkMode ? '#1f2937' : '#f3f4f6'
                          }
                        ]
                      }} 
                      options={pieChartOptions}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card className={cardClasses}>
                <CardHeader>
                  <CardTitle className="text-white">Monthly Returns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <Bar 
                      data={portfolioData.monthlyReturns}
                      options={barChartOptions}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Analysis Tabs */}
            <Card className={cardClasses}>
              <CardHeader>
                <CardTitle className="text-white">Detailed Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="performance" className="w-full">
                  <TabsList className="bg-gray-700 border-gray-600 mb-6">
                    <TabsTrigger value="performance" className="text-white data-[state=active]:bg-teal-600">
                      Performance
                    </TabsTrigger>
                    <TabsTrigger value="risk" className="text-white data-[state=active]:bg-teal-600">
                      Risk
                    </TabsTrigger>
                    <TabsTrigger value="holdings" className="text-white data-[state=active]:bg-teal-600">
                      Holdings
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="performance">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-medium text-white mb-4">Performance Metrics</h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Total Value:</span>
                            <span className="text-white font-medium">${Number(portfolioData.performanceMetrics.totalValue).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">24h Change:</span>
                            <span className={Number(portfolioData.performanceMetrics.change24h) >= 0 ? "text-green-400" : "text-red-400"}>
                              {Number(portfolioData.performanceMetrics.change24h) >= 0 ? "+" : ""}
                              {portfolioData.performanceMetrics.change24h}%
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">7d Change:</span>
                            <span className={Number(portfolioData.performanceMetrics.change7d) >= 0 ? "text-green-400" : "text-red-400"}>
                              {Number(portfolioData.performanceMetrics.change7d) >= 0 ? "+" : ""}
                              {portfolioData.performanceMetrics.change7d}%
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">30d Change:</span>
                            <span className={Number(portfolioData.performanceMetrics.change30d) >= 0 ? "text-green-400" : "text-red-400"}>
                              {Number(portfolioData.performanceMetrics.change30d) >= 0 ? "+" : ""}
                              {portfolioData.performanceMetrics.change30d}%
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Total Gain/Loss:</span>
                            <span className={Number(portfolioData.performanceMetrics.totalGain) >= 0 ? "text-green-400" : "text-red-400"}>
                              {Number(portfolioData.performanceMetrics.totalGain) >= 0 ? "+" : ""}
                              ${Number(portfolioData.performanceMetrics.totalGain).toLocaleString()} 
                              ({Number(portfolioData.performanceMetrics.totalGainPercentage) >= 0 ? "+" : ""}
                              {portfolioData.performanceMetrics.totalGainPercentage}%)
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium text-white mb-4">Benchmark Comparison</h3>
                        <div className="p-6 bg-gray-700 rounded-lg text-center">
                          <p className="text-gray-300 mb-4">Your portfolio is outperforming the market by:</p>
                          <p className="text-2xl font-bold text-green-400">+{(Math.random() * 10 + 2).toFixed(2)}%</p>
                          <p className="text-gray-400 mt-2">Compared to S&P 500 in the selected time period</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="risk">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-medium text-white mb-4">Risk Metrics</h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Volatility:</span>
                            <span className="text-white font-medium">{portfolioData.riskMetrics.volatility}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Sharpe Ratio:</span>
                            <span className="text-white font-medium">{portfolioData.riskMetrics.sharpeRatio}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Maximum Drawdown:</span>
                            <span className="text-red-400">{portfolioData.riskMetrics.maxDrawdown}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Beta:</span>
                            <span className="text-white font-medium">{portfolioData.riskMetrics.beta}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium text-white mb-4">Risk Assessment</h3>
                        <div className="p-6 bg-gray-700 rounded-lg">
                          <p className="text-gray-300 mb-2">Your portfolio risk level is:</p>
                          <div className="w-full bg-gray-600 rounded-full h-4 mb-4">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-yellow-500 h-4 rounded-full" 
                              style={{ width: '60%' }}
                            ></div>
                          </div>
                          <p className="text-yellow-400 font-medium">Moderate</p>
                          <p className="text-gray-400 mt-2 text-sm">
                            Your portfolio has a balanced risk profile. Consider diversifying further to reduce volatility.
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="holdings">
                    <div>
                      <h3 className="text-lg font-medium text-white mb-4">Top Holdings</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-700">
                              <th className="text-left py-3 text-gray-400">Asset</th>
                              <th className="text-right py-3 text-gray-400">Allocation</th>
                              <th className="text-right py-3 text-gray-400">Value</th>
                              <th className="text-right py-3 text-gray-400">24h Change</th>
                            </tr>
                          </thead>
                          <tbody>
                            {portfolioData.assetAllocation.map((asset: any, index: number) => (
                              <tr key={index} className="border-b border-gray-700">
                                <td className="py-3 text-white">{asset.name}</td>
                                <td className="py-3 text-right text-white">{asset.value}%</td>
                                <td className="py-3 text-right text-white">
                                  ${((Number(portfolioData.performanceMetrics.totalValue) * asset.value) / 100).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                </td>
                                <td className={`py-3 text-right ${Math.random() > 0.5 ? "text-green-400" : "text-red-400"}`}>
                                  {Math.random() > 0.5 ? "+" : "-"}{(Math.random() * 10).toFixed(2)}%
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="text-center py-16 text-white">
            <p className="text-gray-400 mb-4">No portfolio data available</p>
            <Button 
              onClick={loadPortfolioData}
              className="bg-gradient-to-r from-teal-500 to-cyan-600"
            >
              Load Data
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioAnalysis;
