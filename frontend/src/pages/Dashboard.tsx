import React, { useState, useEffect, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Wallet, ArrowRightLeft, BarChart3, LineChart, Settings, LogOut, PieChart, DollarSign, Briefcase, Plus } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import ModularColorPicker from "@/components/ModularColorPicker";
import { useSettingsStore } from "@/store/store";
import { initializeModularTheme } from "@/lib/modularColors";

const Dashboard = () => {
  const { currentUser, userProfile, logout, updateUserProfile } = useAuth();
  const { settings } = useSettingsStore();
  const [loading, setLoading] = useState(true);
  const [hoveredCrypto, setHoveredCrypto] = useState(null);
  const [hoveredPricePoint, setHoveredPricePoint] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  
  const darkMode = settings.darkMode;

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
    
    // Initialize modular color theme
    initializeModularTheme();
    
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [currentUser, navigate]);


  // Initialize display name when userProfile changes
  useEffect(() => {
    if (userProfile?.displayName) {
      setDisplayName(userProfile.displayName);
    }
  }, [userProfile]);

  // Save profile changes
  const handleSaveProfile = async () => {
    if (!displayName.trim()) {
      toast.error("Display name cannot be empty");
      return;
    }

    setSaving(true);
    try {
      await updateUserProfile(displayName.trim());
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };


  if (!currentUser) {
    return (
      <div className={`min-h-screen ${darkMode ? "bg-black" : "bg-gray-100"} flex items-center justify-center`}>
        <Card className={`w-full max-w-md ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription className="text-gray-400">
              Please log in to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/login')}
              className="w-full bg-gradient-to-r from-[var(--button-gradient-from)] to-[var(--button-gradient-to)]"
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
  
  const textHighlightClass = darkMode 
    ? "text-transparent bg-clip-text bg-gradient-to-r from-[#CCD5FF] to-[#B8C5FF]"  // Light lavender blue gradient for dark mode
    : "text-transparent bg-clip-text bg-gradient-to-r from-[#4169E1] to-[#2E4BC6]"; // Royal blue gradient for light mode
  
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
            <h1 className={`text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${
              darkMode 
                ? "from-[#CCD5FF] to-[#B8C5FF]"  // Light lavender blue gradient for dark mode
                : "from-[#4169E1] to-[#2E4BC6]"  // Royal blue gradient for light mode
            }`}>
              CryptoWhale Dashboard
            </h1>
            <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
              Welcome, {userProfile?.displayName || currentUser.email}
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <ThemeToggle />
            <Button 
              onClick={handleLogout}
              variant="outline" 
              className={darkMode 
                ? "border-lime-500 hover:bg-gray-800 hover:text-lime-300 text-lime-400" 
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
                      className={`bg-gradient-to-r text-white flex items-center ${
                        darkMode 
                          ? "from-[#CCD5FF] to-[#B8C5FF] hover:from-[#B8C5FF] hover:to-[#A3B2FF]"  // Light lavender blue gradient for dark mode
                          : "from-[#4169E1] to-[#2E4BC6] hover:from-[#2E4BC6] hover:to-[#1E3A8A]"  // Royal blue gradient for light mode
                      }`}
                      onClick={() => navigate('/wallet-connection')}
                    >
                      <Wallet className="h-4 w-4 mr-2" />
                      Connect Wallet
                    </Button>
                    <Button 
                      variant="outline" 
                      className={darkMode 
                        ? "border-lime-500 hover:bg-gray-800 hover:text-lime-300 text-lime-400 flex items-center" 
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
                        ? "border-lime-500 hover:bg-gray-800 hover:text-lime-300 text-lime-400 flex items-center" 
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
                        ? "border-lime-500 hover:bg-gray-800 hover:text-lime-300 text-lime-400 flex items-center" 
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
                    <div className="h-72 flex items-center justify-center">
                      <Skeleton className={`h-52 w-52 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-200"}`} />
                    </div>
                  ) : (
                    <div className="h-72 relative pt-2">
                      {/* Modern 3D Pie Chart - Optimized for performance */}
                      <svg 
                        viewBox="0 0 140 140" 
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
                        <g transform="translate(70, 55)">
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
                            const innerRadius = 28; // Increased inner radius for larger donut hole
                            const outerRadius = 58; // Further increased outer radius
                            
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
                            r="28" 
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
                            className={`bg-gradient-to-r text-white px-4 py-2 rounded-lg shadow-lg z-10 ${
                              darkMode 
                                ? "from-[#CCD5FF] to-[#B8C5FF]"  // Light lavender blue gradient for dark mode
                                : "from-[#4169E1] to-[#2E4BC6]"  // Royal blue gradient for light mode
                            }`}
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
                      <Skeleton className={`h-56 w-full ${darkMode ? "bg-gray-700" : "bg-gray-200"}`} />
                    </div>
                  ) : (
                    <div className="h-72 relative pb-4">
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
                            <stop offset="0%" stopColor={darkMode ? "#CCD5FF" : "#4169E1"} />
                            <stop offset="100%" stopColor={darkMode ? "#B8C5FF" : "#2E4BC6"} />
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
                            <stop offset="0%" stopColor={darkMode ? "#CCD5FF" : "#4169E1"} stopOpacity="0.8" />
                            <stop offset="100%" stopColor={darkMode ? "#CCD5FF" : "#4169E1"} stopOpacity="0.1" />
                          </linearGradient>
                        </defs>

                        {/* Interactive data points */}
                        {priceHistoryData.map((dataPoint, index) => {
                          const prices = priceHistoryData.map(d => d.price);
                          const minPrice = Math.min(...prices) * 0.99;
                          const maxPrice = Math.max(...prices) * 1.01;
                          const range = maxPrice - minPrice;
                          
                          const x = (index / (priceHistoryData.length - 1)) * 100;
                          const y = 50 - ((dataPoint.price - minPrice) / range) * 50;
                          const isHovered = hoveredPricePoint === index;
                          
                          return (
                            <g key={`point-${index}`}>
                              {/* Invisible larger circle for easier hovering */}
                              <circle
                                cx={x}
                                cy={y}
                                r="8"
                                fill="transparent"
                                className="cursor-pointer"
                                onMouseEnter={() => setHoveredPricePoint(index)}
                                onMouseLeave={() => setHoveredPricePoint(null)}
                              />
                              {/* Visible data point */}
                              <circle
                                cx={x}
                                cy={y}
                                r={isHovered ? "4" : "2"}
                                fill={isHovered ? (darkMode ? "#CCD5FF" : "#4169E1") : (darkMode ? "#B8C5FF" : "#2E4BC6")}
                                stroke={isHovered ? "#ffffff" : "transparent"}
                                strokeWidth={isHovered ? "2" : "0"}
                                className="transition-all duration-200"
                              />
                            </g>
                          );
                        })}

                      </svg>

                      {/* Hover tooltip */}
                      {hoveredPricePoint !== null && (
                        <div 
                          className="absolute bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg text-sm pointer-events-none z-10"
                          style={{
                            left: `${(hoveredPricePoint / (priceHistoryData.length - 1)) * 100}%`,
                            top: '10px',
                            transform: 'translateX(-50%)'
                          }}
                        >
                          <div className="font-semibold">
                            ${priceHistoryData[hoveredPricePoint].price.toLocaleString()}
                          </div>
                          <div className="text-gray-300 text-xs">
                            {new Date(priceHistoryData[hoveredPricePoint].date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </div>
                        </div>
                      )}

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
                      <div className={`absolute top-2 right-2 bg-gradient-to-r text-white px-2 py-1 rounded text-sm font-bold ${
                        darkMode 
                          ? "from-[#CCD5FF] to-[#B8C5FF]"  // Light lavender blue gradient for dark mode
                          : "from-[#4169E1] to-[#2E4BC6]"  // Royal blue gradient for light mode
                      }`}>
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
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="Enter your display name"
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
                      <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <span className="text-sm text-muted-foreground">
                          {darkMode ? 'Dark Mode' : 'Light Mode'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <ModularColorPicker />
                    </div>
                    <div className="pt-4">
                      <Button 
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className={`bg-gradient-to-r disabled:opacity-50 ${
                          darkMode 
                            ? "from-[#CCD5FF] to-[#B8C5FF] hover:from-[#B8C5FF] hover:to-[#A3B2FF]"  // Light lavender blue gradient for dark mode
                            : "from-[#4169E1] to-[#2E4BC6] hover:from-[#2E4BC6] hover:to-[#1E3A8A]"  // Royal blue gradient for light mode
                        }`}
                      >
                        {saving ? "Saving..." : "Save Changes"}
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