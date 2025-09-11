import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { Line } from "react-chartjs-2";
import { format } from "date-fns";
import { coinGeckoService, CoinMarketChart } from "../services/coinGeckoService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface CoinChartProps {
  coinId: string;
  coinName: string;
  color?: string;
  darkMode: boolean;
}

const timeRanges = [
  { label: "24h", days: 1 },
  { label: "7d", days: 7 },
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
  { label: "1y", days: 365 },
  { label: "Max", days: "max" as const },
];

export const CoinChart: React.FC<CoinChartProps> = ({ 
  coinId, 
  coinName, 
  color = "#14b8a6", 
  darkMode 
}) => {
  const [chartData, setChartData] = useState<CoinMarketChart | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [timeRange, setTimeRange] = useState<number | "max">(7);
  const [error, setError] = useState<string | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState<number>(0);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);

  const fetchChartData = async () => {
    setLoading(true);
    setError(null);
    setIsRetrying(false);
    
    try {
      // Add a small delay to prevent too many requests at once
      await new Promise(resolve => setTimeout(resolve, 300));
      
      console.log(`Fetching chart data for ${coinId} with timeRange: ${timeRange}`);
      const data = await coinGeckoService.getCoinMarketChart(coinId, timeRange);
      
      if (data && data.prices && data.prices.length > 0) {
        console.log(`Successfully fetched chart data with ${data.prices.length} data points`);
        setChartData(data);
        
        // Set current price and price change
        const latestPrice = data.prices[data.prices.length - 1][1];
        const firstPrice = data.prices[0][1];
        setCurrentPrice(latestPrice);
        setPriceChange(((latestPrice - firstPrice) / firstPrice) * 100);
        
        // Reset retry count on success
        setRetryCount(0);
      } else {
        console.error(`Failed to fetch valid chart data for ${coinId}`);
        setError("Failed to fetch chart data");
      }
    } catch (err) {
      console.error(`Error fetching chart data: ${err}`);
      setError("An error occurred while fetching chart data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when coin or time range changes
  useEffect(() => {
    fetchChartData();
  }, [coinId, timeRange]);

  // Auto-retry on error (max 3 times)
  useEffect(() => {
    if (error && retryCount < 3 && !isRetrying) {
      setIsRetrying(true);
      const timer = setTimeout(() => {
        console.log(`Retrying chart data fetch (${retryCount + 1}/3)...`);
        setRetryCount(prev => prev + 1);
        fetchChartData();
      }, 2000 * (retryCount + 1)); // Exponential backoff
      
      return () => clearTimeout(timer);
    }
  }, [error, retryCount, isRetrying]);

  const handleRetry = () => {
    setRetryCount(0);
    fetchChartData();
  };

  const formatChartData = () => {
    if (!chartData || !chartData.prices) return null;

    const labels = chartData.prices.map(([timestamp]) => {
      const date = new Date(timestamp);
      
      // Format based on time range
      if (timeRange === 1) {
        return format(date, "HH:mm");
      } else if (timeRange === 7) {
        return format(date, "EEE");
      } else if (timeRange === 30) {
        return format(date, "dd MMM");
      } else {
        return format(date, "dd MMM yyyy");
      }
    });

    const prices = chartData.prices.map(([, price]) => price);

    const gradientColor = (ctx: any) => {
      if (!ctx) return color;
      const gradient = ctx.createLinearGradient(0, 0, 0, 300);
      gradient.addColorStop(0, `${color}80`); // 50% opacity
      gradient.addColorStop(1, `${color}00`); // 0% opacity
      return gradient;
    };

    return {
      labels,
      datasets: [
        {
          label: `${coinName} Price`,
          data: prices,
          borderColor: color,
          backgroundColor: (context: any) => gradientColor(context.chart.ctx),
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointBackgroundColor: color,
          pointHoverBackgroundColor: color,
          pointBorderColor: darkMode ? "#1f2937" : "#ffffff",
          pointHoverBorderColor: darkMode ? "#1f2937" : "#ffffff",
          pointBorderWidth: 2,
          pointHoverBorderWidth: 2,
          tension: 0.4,
          fill: true,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: "#1f2937",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "#374151",
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context: any) => {
            return `$${context.raw.toLocaleString(undefined, { 
              minimumFractionDigits: 2,
              maximumFractionDigits: 6 
            })}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          maxRotation: 0,
          color: "#ffffff",
          font: {
            size: 10,
          },
          maxTicksLimit: 8,
        },
      },
      y: {
        grid: {
          color: "#374151",
          drawBorder: false,
        },
        ticks: {
          color: "#ffffff",
          font: {
            size: 10,
          },
          callback: (value: any) => {
            return `$${value.toLocaleString(undefined, { 
              minimumFractionDigits: 2,
              maximumFractionDigits: 6,
              useGrouping: true 
            })}`;
          },
        },
        beginAtZero: false,
      },
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    elements: {
      line: {
        tension: 0.4,
      },
    },
  };

  const formattedData = formatChartData();

  return (
    <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500">
              {coinName} Price Chart
            </CardTitle>
            <CardDescription className="text-white">
              {timeRange === "max" ? "All time" : `Last ${timeRange} day${timeRange !== 1 ? 's' : ''}`} price movement
            </CardDescription>
          </div>
          {currentPrice && (
            <div className="text-right">
              <div className="text-xl font-bold text-white">
                ${currentPrice.toLocaleString(undefined, { 
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 6 
                })}
              </div>
              <div className={`text-sm ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {priceChange >= 0 ? '↑' : '↓'} {Math.abs(priceChange).toFixed(2)}%
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-1 mb-4 flex-wrap">
          {timeRanges.map((range) => (
            <Button
              key={range.label}
              variant={timeRange === range.days ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange(range.days)}
              className={
                timeRange === range.days
                  ? "bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-medium"
                  : "border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-teal-300 hover:border-teal-500"
              }
            >
              {range.label}
            </Button>
          ))}
        </div>
        
        <div className="h-64">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <Skeleton className="h-full w-full rounded bg-gray-700" />
            </div>
          ) : error ? (
            <div className="h-full flex items-center justify-center text-center">
              <p className="text-white">
                {error}<br />
                <Button 
                  variant="link" 
                  onClick={handleRetry}
                  className="text-teal-400 hover:text-teal-300 mt-2"
                >
                  Try again
                </Button>
              </p>
            </div>
          ) : formattedData ? (
            <Line data={formattedData} options={chartOptions} />
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-white">No data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CoinChart;
