import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { syncPortfolio, calculateAllocation } from '../services/portfolioService';
import { Portfolio } from '../types/database';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Skeleton } from './ui/skeleton';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export function DashboardView() {
  const { currentUser } = useAuth();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [allocation, setAllocation] = useState({ tradfi: 0, defi: 0 });
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const portfolioData = await syncPortfolio(currentUser.uid);
        setPortfolio(portfolioData);
        
        const allocationData = calculateAllocation(portfolioData);
        setAllocation(allocationData);
      } catch (error) {
        console.error('Error fetching portfolio:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPortfolio();
  }, [currentUser]);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  // Prepare data for pie chart
  const pieData = [
    { name: 'TradFi', value: allocation.tradfi },
    { name: 'DeFi', value: allocation.defi }
  ];
  
  const COLORS = ['#0088FE', '#00C49F'];

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[200px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Overview</CardTitle>
          <CardDescription>Your combined TradFi and DeFi assets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="w-full md:w-1/2">
              <div className="text-3xl font-bold mb-2">
                {portfolio ? formatCurrency(portfolio.totalEquityUSD) : '$0.00'}
              </div>
              <div className="text-sm text-gray-500 mb-4">
                Total Portfolio Value
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">TradFi</span>
                  <span className="text-sm">{allocation.tradfi}%</span>
                </div>
                <Progress value={allocation.tradfi} className="h-2" />
                
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm font-medium">DeFi</span>
                  <span className="text-sm">{allocation.defi}%</span>
                </div>
                <Progress value={allocation.defi} className="h-2" />
              </div>
            </div>
            
            <div className="w-full md:w-1/2 h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tradfi">TradFi Assets</TabsTrigger>
          <TabsTrigger value="defi">DeFi Assets</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Asset Allocation</CardTitle>
              <CardDescription>Current distribution of your portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">TradFi Assets ({allocation.tradfi}%)</h4>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    {portfolio && Object.keys(portfolio.alpacaHoldings).length > 0 ? (
                      <ul className="space-y-2">
                        {Object.entries(portfolio.alpacaHoldings).map(([symbol, qty]) => (
                          <li key={symbol} className="flex justify-between">
                            <span className="font-medium">{symbol}</span>
                            <span>{qty} shares</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">No TradFi assets found</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">DeFi Assets ({allocation.defi}%)</h4>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    {portfolio && Object.keys(portfolio.defiHoldings).length > 0 ? (
                      <ul className="space-y-2">
                        {Object.entries(portfolio.defiHoldings).map(([symbol, amount]) => (
                          <li key={symbol} className="flex justify-between">
                            <span className="font-medium">{symbol}</span>
                            <span>{amount}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">No DeFi assets found</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tradfi" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>TradFi Portfolio</CardTitle>
              <CardDescription>Your traditional finance investments</CardDescription>
            </CardHeader>
            <CardContent>
              {portfolio && Object.keys(portfolio.alpacaHoldings).length > 0 ? (
                <div className="space-y-4">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left pb-2">Symbol</th>
                        <th className="text-right pb-2">Quantity</th>
                        <th className="text-right pb-2">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(portfolio.alpacaHoldings).map(([symbol, qty]) => (
                        <tr key={symbol} className="border-b">
                          <td className="py-2">{symbol}</td>
                          <td className="text-right py-2">{qty}</td>
                          <td className="text-right py-2">
                            {/* In a real app, you would calculate the actual value */}
                            {formatCurrency(symbol === 'AAPL' ? 175.05 * qty : 
                                           symbol === 'MSFT' ? 400.15 * qty : 
                                           symbol === 'AMZN' ? 175.10 * qty : 0)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No TradFi assets found</p>
                  <p className="text-sm">Connect your Alpaca account to view your TradFi portfolio</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="defi" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>DeFi Portfolio</CardTitle>
              <CardDescription>Your cryptocurrency holdings</CardDescription>
            </CardHeader>
            <CardContent>
              {portfolio && Object.keys(portfolio.defiHoldings).length > 0 ? (
                <div className="space-y-4">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left pb-2">Token</th>
                        <th className="text-right pb-2">Amount</th>
                        <th className="text-right pb-2">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(portfolio.defiHoldings).map(([symbol, amount]) => (
                        <tr key={symbol} className="border-b">
                          <td className="py-2">{symbol}</td>
                          <td className="text-right py-2">{amount}</td>
                          <td className="text-right py-2">
                            {/* In a real app, you would calculate the actual value */}
                            {formatCurrency(symbol === 'SOL' ? 150 * amount : 
                                           symbol === 'USDC' ? 1 * amount : 
                                           symbol === 'USDT' ? 1 * amount : 0)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No DeFi assets found</p>
                  <p className="text-sm">Connect your crypto wallet to view your DeFi portfolio</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
