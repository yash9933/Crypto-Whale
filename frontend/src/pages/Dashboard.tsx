import React, { useState, useEffect, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Wallet, ArrowRightLeft, BarChart3, LineChart, Settings, LogOut, PieChart, DollarSign, Briefcase, Plus } from "lucide-react";

const Dashboard = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [hoveredCrypto, setHoveredCrypto] = useState(null);
  const navigate = useNavigate();

  // Mock data for portfolio breakdown chart
  const portfolioData = [
    { name: 'Bitcoin', value: 45, color: '#F7931A', hoverColor: '#ffa726', symbol: 'BTC', amount: 0.53, dollarValue: 45000 },
    { name: 'Ethereum', value: 30, color: '#627EEA', hoverColor: '#7986cb', symbol: 'ETH', amount: 15.7, dollarValue: 30000 },
    { name: 'Solana', value: 15, color: '#00FFA3', hoverColor: '#4cffb4', symbol: 'SOL', amount: 114.5, dollarValue: 15000 },
    { name: 'Other', value: 10, color: '#8A92B2', hoverColor: '#a0a8c2', symbol: 'ALT', amount: 0, dollarValue: 10000 },
  ];

  // Mock data for price history chart
  const priceHistoryData = [
    { date: '2025-04-05', price: 82500 },
    { date: '2025-04-06', price: 83200 },
    { date: '2025-04-07', price: 85000 },
    { date: '2025-04-08', price: 84300 },
    { date: '2025-04-09', price: 83700 },
    { date: '2025-04-10', price: 84900 },
    { date: '2025-04-11', price: 84500 },
    { date: '2025-04-12', price: 84894 },
  ];

  useEffect(() => {
    // Check if user is authenticated
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [currentUser, navigate]);

  // Toggle between dark and light mode every 30 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setDarkMode(prev => !prev);
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Card className="w-full max-w-md bg-gray-900 text-white">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription className="text-gray-400">
              Please log in to access the dashboard
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

  // Dynamically set theme classes based on dark/light mode
  const themeClasses = darkMode 
    ? "bg-gray-900 text-white" 
    : "bg-gray-100 text-gray-900";
  
  const cardClasses = darkMode 
    ? "bg-gray-800 border-gray-700" 
    : "bg-white border-gray-200";
  
  const textHighlightClass = "text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500";
  
  // Text color classes for regular text
  const regularTextClass = darkMode ? "text-white" : "text-gray-900";
  const labelTextClass = darkMode ? "text-gray-200" : "text-gray-700";
  const secondaryTextClass = darkMode ? "text-gray-300" : "text-gray-600";

  return (
    <div className={`min-h-screen ${themeClasses} p-4 md:p-8 transition-colors duration-500`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent">
              CryptoWhale Dashboard
            </h1>
            <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
              Welcome, {userProfile?.displayName || currentUser.email}
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Button 
              onClick={toggleDarkMode}
              variant="outline" 
              size="icon"
              className={darkMode 
                ? "border-teal-500 hover:bg-gray-800 hover:text-teal-300 text-teal-400" 
                : "border-gray-300 hover:bg-gray-200"
              }
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button 
              onClick={handleLogout}
              variant="outline" 
              className={darkMode 
                ? "border-teal-500 hover:bg-gray-800 hover:text-teal-300 text-teal-400" 
                : "border-gray-300 hover:bg-gray-200"
              }
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className={darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-300"}>
            <TabsTrigger value="overview" className="flex items-center">
              <PieChart className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Card className={cardClasses}>
                <CardHeader>
                  <CardTitle className={textHighlightClass}>Account Summary</CardTitle>
                  <CardDescription className={darkMode ? "text-gray-400" : "text-gray-600"}>
                    Your account details and status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-2">
                      <Skeleton className={`h-4 w-full ${darkMode ? "bg-gray-700" : "bg-gray-200"}`} />
                      <Skeleton className={`h-4 w-3/4 ${darkMode ? "bg-gray-700" : "bg-gray-200"}`} />
                      <Skeleton className={`h-4 w-1/2 ${darkMode ? "bg-gray-700" : "bg-gray-200"}`} />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <p className={textHighlightClass}>Email</p>
                        <p className={`font-medium ${regularTextClass}`}>{currentUser.email}</p>
                      </div>
                      <div>
                        <p className={textHighlightClass}>User ID</p>
                        <p className={`font-medium text-sm truncate ${regularTextClass}`}>{currentUser.uid}</p>
                      </div>
                      <div>
                        <p className={textHighlightClass}>Account Status</p>
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                          <p className={`font-medium ${regularTextClass}`}>Active</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className={cardClasses}>
                <CardHeader>
                  <CardTitle className={textHighlightClass}>Quick Actions</CardTitle>
                  <CardDescription className={darkMode ? "text-gray-400" : "text-gray-600"}>
                    Common tasks and operations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white flex items-center"
                      onClick={() => navigate('/wallet-connection')}
                    >
                      <Wallet className="h-4 w-4 mr-2" />
                      Connect Wallet
                    </Button>
                    <Button 
                      variant="outline" 
                      className={darkMode 
                        ? "border-teal-500 hover:bg-gray-800 hover:text-teal-300 text-teal-400 flex items-center" 
                        : "border-gray-300 hover:bg-gray-200 flex items-center"
                      }
                      onClick={() => navigate('/transaction-log')}
                    >
                      <ArrowRightLeft className="h-4 w-4 mr-2" />
                      View Transactions
                    </Button>
                    <Button 
                      variant="outline" 
                      className={darkMode 
                        ? "border-teal-500 hover:bg-gray-800 hover:text-teal-300 text-teal-400 flex items-center" 
                        : "border-gray-300 hover:bg-gray-200 flex items-center"
                      }
                      onClick={() => navigate('/portfolio-analysis')}
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Portfolio Analysis
                    </Button>
                    <Button 
                      variant="outline" 
                      className={darkMode 
                        ? "border-teal-500 hover:bg-gray-800 hover:text-teal-300 text-teal-400 flex items-center" 
                        : "border-gray-300 hover:bg-gray-200 flex items-center"
                      }
                      onClick={() => navigate('/market-data')}
                    >
                      <LineChart className="h-4 w-4 mr-2" />
                      Market Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Portfolio Breakdown Chart */}
              <Card className={cardClasses}>
                <CardHeader>
                  <CardTitle className={textHighlightClass}>Portfolio Breakdown</CardTitle>
                  <CardDescription className={darkMode ? "text-gray-400" : "text-gray-600"}>
                    Your crypto asset allocation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="h-64 flex items-center justify-center">
                      <Skeleton className={`h-48 w-48 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-200"}`} />
                    </div>
                  ) : (
                    <div className="h-64 relative">
                      {/* Modern 3D Pie Chart - Optimized for performance */}
                      <svg 
                        viewBox="0 0 100 100" 
                        className="w-full h-full"
                        style={{ overflow: 'visible' }}
                      >
                        <defs>
                          {/* Gradients for 3D effect - Pre-rendered for performance */}
                          {portfolioData.map((item, index) => (
                            <g key={`gradients-${index}`}>
                              <linearGradient 
                                id={`gradient-${index}`} 
                                x1="0%" 
                                y1="0%" 
                                x2="100%" 
                                y2="100%"
                              >
                                <stop offset="0%" stopColor={item.color} />
                                <stop offset="100%" stopColor={item.color} stopOpacity="0.8" />
                              </linearGradient>
                              <linearGradient 
                                id={`gradient-hover-${index}`} 
                                x1="0%" 
                                y1="0%" 
                                x2="100%" 
                                y2="100%"
                              >
                                <stop offset="0%" stopColor={item.hoverColor} />
                                <stop offset="100%" stopColor={item.hoverColor} stopOpacity="0.8" />
                              </linearGradient>
                            </g>
                          ))}
                          
                          {/* Drop shadow for 3D effect */}
                          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.3" />
                          </filter>
                        </defs>
                        
                        {/* Chart segments with 3D effect - Fixed positioning */}
                        <g transform="translate(50, 50)">
                          {portfolioData.map((item, index) => {
                            // Calculate the pie segments
                            const previousTotal = portfolioData
                              .slice(0, index)
                              .reduce((sum, entry) => sum + entry.value, 0);
                            const total = portfolioData.reduce((sum, entry) => sum + entry.value, 0);
                            const startAngle = (previousTotal / total) * 360;
                            const endAngle = ((previousTotal + item.value) / total) * 360;
                            
                            // Convert angles to radians for SVG arc
                            const startRad = (startAngle - 90) * Math.PI / 180;
                            const endRad = (endAngle - 90) * Math.PI / 180;
                            
                            // Calculate points on the circle - Fixed dimensions
                            const innerRadius = 15; // Fixed inner radius
                            const outerRadius = 40; // Fixed outer radius
                            
                            const startOuterX = outerRadius * Math.cos(startRad);
                            const startOuterY = outerRadius * Math.sin(startRad);
                            const endOuterX = outerRadius * Math.cos(endRad);
                            const endOuterY = outerRadius * Math.sin(endRad);
                            
                            // Create the arc path - Fixed path
                            const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
                            const pathData = `M ${innerRadius * Math.cos(startRad)} ${innerRadius * Math.sin(startRad)} 
                                              L ${startOuterX} ${startOuterY} 
                                              A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${endOuterX} ${endOuterY} 
                                              L ${innerRadius * Math.cos(endRad)} ${innerRadius * Math.sin(endRad)}
                                              A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerRadius * Math.cos(startRad)} ${innerRadius * Math.sin(startRad)}
                                              Z`;
                            
                            // Calculate position for hover tooltip - Fixed position
                            const midAngle = (startAngle + endAngle) / 2;
                            const midRad = (midAngle - 90) * Math.PI / 180;
                            
                            return (
                              <g 
                                key={`segment-${index}`}
                                onMouseEnter={() => setHoveredCrypto(item.name)}
                                onMouseLeave={() => setHoveredCrypto(null)}
                                style={{ cursor: 'pointer' }}
                              >
                                <path 
                                  d={pathData} 
                                  fill={hoveredCrypto === item.name ? `url(#gradient-hover-${index})` : `url(#gradient-${index})`}
                                  filter="url(#shadow)"
                                  stroke={darkMode ? "#1f2937" : "#f9fafb"} 
                                  strokeWidth="0.5"
                                  style={{ 
                                    transform: hoveredCrypto === item.name ? 'scale(1.05)' : 'scale(1)',
                                    transformOrigin: 'center',
                                    transformBox: 'fill-box',
                                    transition: 'transform 0.2s ease-out'
                                  }}
                                />
                              </g>
                            );
                          })}
                          
                          {/* Inner circle for donut effect - Fixed position */}
                          <circle 
                            cx="0" 
                            cy="0" 
                            r="15" 
                            fill={darkMode ? "#1f2937" : "#f9fafb"} 
                            stroke={darkMode ? "#374151" : "#e5e7eb"} 
                            strokeWidth="0.5"
                          />
                        </g>
                      </svg>
                      
                      {/* Fixed position tooltip instead of absolute positioning */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        {hoveredCrypto && (
                          <div 
                            className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-4 py-2 rounded-lg shadow-lg z-10"
                            style={{ minWidth: '150px', textAlign: 'center' }}
                          >
                            {(() => {
                              const crypto = portfolioData.find(c => c.name === hoveredCrypto);
                              return (
                                <div>
                                  <p className="font-bold">{crypto?.name} ({crypto?.symbol})</p>
                                  <p className="text-sm">{crypto?.value}% of Portfolio</p>
                                  <p className="text-sm">{crypto?.amount} {crypto?.symbol}</p>
                                  <p className="text-sm">${crypto?.dollarValue.toLocaleString()}</p>
                                </div>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                      
                      {/* Fixed position legend with pre-rendered styles */}
                      <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-4 mt-4">
                        {portfolioData.map((item, index) => {
                          const isHovered = hoveredCrypto === item.name;
                          return (
                            <div 
                              key={`legend-${index}`} 
                              className="flex items-center cursor-pointer"
                              onMouseEnter={() => setHoveredCrypto(item.name)}
                              onMouseLeave={() => setHoveredCrypto(null)}
                            >
                              <div 
                                className={`w-3 h-3 mr-1 rounded-sm ${isHovered ? 'ring-1 ring-white' : ''}`}
                                style={{ 
                                  backgroundColor: isHovered ? item.hoverColor : item.color
                                }}
                              />
                              <span className={`text-xs ${regularTextClass} ${isHovered ? 'font-bold' : ''}`}>
                                {item.name} ({item.value}%)
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Price History Chart */}
              <Card className={cardClasses}>
                <CardHeader>
                  <CardTitle className={textHighlightClass}>BTC Price History</CardTitle>
                  <CardDescription className={darkMode ? "text-gray-400" : "text-gray-600"}>
                    Last 7 days price movement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-2">
                      <Skeleton className={`h-48 w-full ${darkMode ? "bg-gray-700" : "bg-gray-200"}`} />
                    </div>
                  ) : (
                    <div className="h-64 relative">
                      {/* Simple SVG Line Chart */}
                      <svg viewBox="0 0 100 50" className="w-full h-full" preserveAspectRatio="none">
                        {/* Chart background grid */}
                        <g className={darkMode ? "text-gray-700" : "text-gray-300"}>
                          {[0, 1, 2, 3, 4].map((i) => (
                            <line 
                              key={`grid-h-${i}`}
                              x1="0" 
                              y1={i * 12.5} 
                              x2="100" 
                              y2={i * 12.5} 
                              stroke="currentColor" 
                              strokeWidth="0.2" 
                            />
                          ))}
                          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                            <line 
                              key={`grid-v-${i}`}
                              x1={i * (100/7)} 
                              y1="0" 
                              x2={i * (100/7)} 
                              y2="50" 
                              stroke="currentColor" 
                              strokeWidth="0.2" 
                            />
                          ))}
                        </g>

                        {/* Price line */}
                        <polyline
                          points={priceHistoryData.map((dataPoint, index) => {
                            // Normalize price between min and max for the chart
                            const prices = priceHistoryData.map(d => d.price);
                            const minPrice = Math.min(...prices) * 0.99;
                            const maxPrice = Math.max(...prices) * 1.01;
                            const range = maxPrice - minPrice;
                            
                            // Calculate position
                            const x = (index / (priceHistoryData.length - 1)) * 100;
                            const y = 50 - ((dataPoint.price - minPrice) / range) * 50;
                            
                            return `${x},${y}`;
                          }).join(' ')}
                          fill="none"
                          stroke="url(#lineGradient)"
                          strokeWidth="2"
                        />

                        {/* Gradient definition */}
                        <defs>
                          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#0ea5e9" />
                            <stop offset="100%" stopColor="#14b8a6" />
                          </linearGradient>
                        </defs>

                        {/* Area under the line */}
                        <path
                          d={`
                            M 0,50 
                            ${priceHistoryData.map((dataPoint, index) => {
                              // Normalize price between min and max for the chart
                              const prices = priceHistoryData.map(d => d.price);
                              const minPrice = Math.min(...prices) * 0.99;
                              const maxPrice = Math.max(...prices) * 1.01;
                              const range = maxPrice - minPrice;
                              
                              // Calculate position
                              const x = (index / (priceHistoryData.length - 1)) * 100;
                              const y = 50 - ((dataPoint.price - minPrice) / range) * 50;
                              
                              return `L ${x},${y}`;
                            }).join(' ')}
                            L 100,50 Z
                          `}
                          fill="url(#areaGradient)"
                          opacity="0.2"
                        />

                        <defs>
                          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.1" />
                          </linearGradient>
                        </defs>

                        {/* Data points */}
                        {priceHistoryData.map((dataPoint, index) => {
                          // Normalize price between min and max for the chart
                          const prices = priceHistoryData.map(d => d.price);
                          const minPrice = Math.min(...prices) * 0.99;
                          const maxPrice = Math.max(...prices) * 1.01;
                          const range = maxPrice - minPrice;
                          
                          // Calculate position
                          const x = (index / (priceHistoryData.length - 1)) * 100;
                          const y = 50 - ((dataPoint.price - minPrice) / range) * 50;
                          
                          return (
                            <circle 
                              key={index}
                              cx={x} 
                              cy={y} 
                              r="1" 
                              fill="#14b8a6" 
                            />
                          );
                        })}
                      </svg>

                      {/* X-axis labels */}
                      <div className="flex justify-between mt-2 text-xs">
                        {priceHistoryData.map((dataPoint, index) => {
                          // Only show every other label on small screens
                          if (index % 2 !== 0 && window.innerWidth < 768) return null;
                          
                          const date = new Date(dataPoint.date);
                          const day = date.getDate();
                          const month = date.getMonth() + 1;
                          
                          return (
                            <div key={index} className={secondaryTextClass}>{month}/{day}</div>
                          );
                        })}
                      </div>

                      {/* Current price */}
                      <div className="absolute top-2 right-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-2 py-1 rounded text-sm font-bold">
                        ${priceHistoryData[priceHistoryData.length - 1].price.toLocaleString()}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className={cardClasses}>
              <CardHeader>
                <CardTitle className={textHighlightClass}>Account Settings</CardTitle>
                <CardDescription className={darkMode ? "text-gray-400" : "text-gray-600"}>
                  Manage your account preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-2">
                    <Skeleton className={`h-4 w-full ${darkMode ? "bg-gray-700" : "bg-gray-200"}`} />
                    <Skeleton className={`h-4 w-3/4 ${darkMode ? "bg-gray-700" : "bg-gray-200"}`} />
                    <Skeleton className={`h-4 w-1/2 ${darkMode ? "bg-gray-700" : "bg-gray-200"}`} />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <p className={textHighlightClass + " mb-2"}>Profile Information</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className={`text-sm ${labelTextClass}`}>Display Name</label>
                          <input 
                            type="text" 
                            className={`w-full ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-100 border-gray-300 text-gray-900"} border rounded p-2 mt-1`}
                            defaultValue={userProfile?.displayName || ''}
                          />
                        </div>
                        <div>
                          <label className={`text-sm ${labelTextClass}`}>Email</label>
                          <input 
                            type="email" 
                            className={`w-full ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-100 border-gray-300 text-gray-900"} border rounded p-2 mt-1`}
                            defaultValue={currentUser.email || ''}
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className={textHighlightClass + " mb-2"}>Theme Preferences</p>
                      <div className="flex items-center space-x-2">
                        <Button 
                          onClick={toggleDarkMode}
                          variant={darkMode ? "default" : "outline"}
                          className={darkMode 
                            ? "bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700" 
                            : "border-gray-300 hover:bg-gray-200"
                          }
                        >
                          <Moon className="h-4 w-4 mr-2" />
                          Dark Mode
                        </Button>
                        <Button 
                          onClick={toggleDarkMode}
                          variant={!darkMode ? "default" : "outline"}
                          className={!darkMode 
                            ? "bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700" 
                            : "border-teal-500 text-teal-400 hover:bg-gray-800 hover:text-teal-300"
                          }
                        >
                          <Sun className="h-4 w-4 mr-2" />
                          Light Mode
                        </Button>
                      </div>
                    </div>
                    <div className="pt-4">
                      <Button className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700">
                        Save Changes
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;