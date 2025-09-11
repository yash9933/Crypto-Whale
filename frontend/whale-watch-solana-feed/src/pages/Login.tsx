import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FirebaseError } from 'firebase/app';
import { FiAlertTriangle } from 'react-icons/fi';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Logo
import WhaleIcon from '../assets/whale-icon.svg';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showFirebaseStatus, setShowFirebaseStatus] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting to log in with:', { email, password: '********' });
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setLoading(false);
      
      if (err instanceof FirebaseError) {
        console.log('Login error:', err);
        
        // Handle specific Firebase auth errors
        switch (err.code) {
          case 'auth/invalid-email':
            setError('Invalid email address format.');
            break;
          case 'auth/user-not-found':
            setError('No account found with this email. Please sign up first.');
            break;
          case 'auth/wrong-password':
            setError('Incorrect password. Please try again.');
            break;
          case 'auth/invalid-credential':
            setError('Invalid login credentials. Please check your email and password.');
            break;
          case 'auth/too-many-requests':
            setError('Too many failed login attempts. Please try again later or reset your password.');
            break;
          case 'auth/network-request-failed':
            setError('Network error. Please check your internet connection and try again.');
            break;
          case 'auth/api-key-not-valid':
            setError('Authentication service configuration error. Please contact support.');
            setShowFirebaseStatus(true);
            break;
          default:
            setError(`Login failed: ${err.message}`);
        }
      } else {
        setError('An unexpected error occurred. Please try again later.');
        console.error('Unexpected login error:', err);
      }
    }
  };

  const handleTestLogin = () => {
    setEmail('test@example.com');
    setPassword('password123');
  };

  const handleViewDashboard = () => {
    navigate('/dashboard');
  };

  // Mock data for preview dashboard
  const mockPortfolioData = [
    { asset: 'Bitcoin', allocation: 45, color: '#F7931A' },
    { asset: 'Ethereum', allocation: 30, color: '#627EEA' },
    { asset: 'Solana', allocation: 15, color: '#00FFA3' },
    { asset: 'Other', allocation: 10, color: '#8C8C8C' }
  ];

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Tabs 
        defaultValue="login" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full max-w-6xl"
      >
        <TabsList className="grid grid-cols-2 max-w-md mx-auto mb-6 bg-gray-800">
          <TabsTrigger value="login" className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-cyan-600">
            Sign In
          </TabsTrigger>
          <TabsTrigger value="preview" className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-cyan-600">
            Dashboard Preview
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <Card className="w-full max-w-md mx-auto bg-gray-900 text-white border-gray-800">
            <CardHeader className="space-y-1 flex flex-col items-center">
              <div className="w-16 h-16 mb-2">
                <img src={WhaleIcon} alt="CryptoWhale Logo" className="w-full h-full" />
              </div>
              <CardTitle className="text-2xl text-center bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent">
                CryptoWhale
              </CardTitle>
              <CardDescription className="text-gray-400 text-center">
                Sign in to your account
              </CardDescription>
            </CardHeader>

            {error && (
              <div className="px-6">
                <Alert className="bg-red-900/30 border-red-800 text-red-300 mb-4">
                  <FiAlertTriangle className="h-4 w-4 mr-2" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </div>
            )}

            {showFirebaseStatus && (
              <div className="px-6">
                <Alert className="bg-yellow-900/30 border-yellow-800 text-yellow-300 mb-4">
                  <FiAlertTriangle className="h-4 w-4 mr-2" />
                  <AlertDescription>
                    Firebase configuration issue detected. The API key may be invalid or the service may be unavailable.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="password" className="text-gray-300">Password</Label>
                    <Link to="/forgot-password" className="text-sm text-cyan-500 hover:text-cyan-400">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="rounded bg-gray-800 border-gray-700 text-cyan-500"
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-300">Remember me</Label>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700"
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </Button>
              </form>

              <div className="mt-4">
                <Button
                  variant="outline"
                  onClick={handleTestLogin}
                  className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Use Test Account
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-center text-sm text-gray-400">
                Don't have an account?{' '}
                <Link to="/register" className="text-cyan-500 hover:text-cyan-400">
                  Sign up
                </Link>
              </div>
              
              <div className="text-xs text-gray-500 text-center">
                Test Account: test@example.com / password123
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="preview">
          <div className="w-full max-w-6xl mx-auto bg-gray-900 text-white border border-gray-800 rounded-lg overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-gray-800 to-gray-900">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent">
                    CryptoWhale Dashboard
                  </h1>
                  <p className="text-gray-400">Welcome to your crypto analytics platform</p>
                </div>
                <Button 
                  onClick={handleViewDashboard}
                  className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700"
                >
                  Go to Dashboard
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">Total Portfolio Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">$124,567.89</div>
                    <p className="text-sm text-green-400">+5.23% (24h)</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">Active Wallets</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">3</div>
                    <p className="text-sm text-gray-400">Solana, Ethereum, Bitcoin</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">Recent Transactions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">28</div>
                    <p className="text-sm text-gray-400">Last 30 days</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">Market Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-400">Bullish</div>
                    <p className="text-sm text-gray-400">Fear & Greed: 65</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Portfolio Breakdown</CardTitle>
                    <CardDescription className="text-gray-400">Your crypto asset allocation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center h-64">
                      <div className="relative w-48 h-48 rounded-full overflow-hidden bg-gray-700">
                        {/* Simple donut chart visualization */}
                        <div className="absolute inset-0" style={{ 
                          background: `conic-gradient(
                            ${mockPortfolioData[0].color} 0% ${mockPortfolioData[0].allocation}%, 
                            ${mockPortfolioData[1].color} ${mockPortfolioData[0].allocation}% ${mockPortfolioData[0].allocation + mockPortfolioData[1].allocation}%, 
                            ${mockPortfolioData[2].color} ${mockPortfolioData[0].allocation + mockPortfolioData[1].allocation}% ${mockPortfolioData[0].allocation + mockPortfolioData[1].allocation + mockPortfolioData[2].allocation}%, 
                            ${mockPortfolioData[3].color} ${mockPortfolioData[0].allocation + mockPortfolioData[1].allocation + mockPortfolioData[2].allocation}% 100%
                          )`
                        }}></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 bg-gray-800 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 mt-4">
                      {mockPortfolioData.map((item) => (
                        <div key={item.asset} className="flex items-center">
                          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                          <span className="text-sm text-white">{item.asset} ({item.allocation}%)</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">BTC Price History</CardTitle>
                    <CardDescription className="text-gray-400">Last 7 days price movement</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 relative">
                      {/* Simple line chart visualization */}
                      <div className="absolute inset-0 flex items-end">
                        <div className="h-20% w-1/7 bg-gray-700"></div>
                        <div className="h-40% w-1/7 bg-gray-700"></div>
                        <div className="h-60% w-1/7 bg-gray-700"></div>
                        <div className="h-50% w-1/7 bg-gray-700"></div>
                        <div className="h-30% w-1/7 bg-gray-700"></div>
                        <div className="h-70% w-1/7 bg-gray-700"></div>
                        <div className="h-80% w-1/7 bg-gray-700"></div>
                      </div>
                      <div className="absolute inset-0 flex items-end">
                        <svg className="w-full h-full" viewBox="0 0 700 300" preserveAspectRatio="none">
                          <path 
                            d="M0,240 L100,180 L200,120 L300,150 L400,210 L500,90 L600,60" 
                            fill="none" 
                            stroke="#14b8a6" 
                            strokeWidth="3"
                          />
                        </svg>
                      </div>
                      <div className="absolute top-4 right-4 bg-gray-900/50 px-2 py-1 rounded text-white">
                        $56,789
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
