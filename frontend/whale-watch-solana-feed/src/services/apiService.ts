import axios from 'axios';

// Create an axios instance for our backend API
const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle token refresh if 401 error
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
        const { token } = response.data;
        
        localStorage.setItem('token', token);
        originalRequest.headers.Authorization = `Bearer ${token}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// User endpoints
export const fetchUserData = async (userId: string) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

// Portfolio endpoints
export const fetchPortfolio = async (userId: string) => {
  const response = await api.get(`/portfolios/${userId}`);
  return response.data;
};

// Enhanced portfolio analysis
export const fetchPortfolioAnalysis = async (userId: string, timeframe: 'day' | 'week' | 'month' | 'year' = 'month') => {
  const response = await api.get(`/portfolios/${userId}/analysis`, { params: { timeframe } });
  return response.data;
};

// Transaction endpoints
export const fetchTransactions = async (userId: string, params?: {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  status?: 'pending' | 'completed' | 'failed';
  fromDate?: string;
  toDate?: string;
  type?: string;
}) => {
  const response = await api.get(`/transactions/${userId}`, { params });
  return response.data;
};

export const createTransaction = async (
  userId: string,
  from: 'alpaca' | 'phantom_wallet' | 'metamask' | 'coinbase' | 'binance' | 'kraken',
  to: 'alpaca' | 'phantom_wallet' | 'metamask' | 'coinbase' | 'binance' | 'kraken',
  amountUSD: number
) => {
  const response = await api.post('/transactions', {
    userId,
    from,
    to,
    amountUSD
  });
  return response.data;
};

export const updateTransactionStatus = async (
  transactionId: string,
  status: 'pending' | 'completed' | 'failed',
  txHash?: string
) => {
  const response = await api.patch(`/transactions/${transactionId}`, {
    status,
    txHash
  });
  return response.data;
};

// Wallet connection endpoints
export const connectWallet = async (
  userId: string, 
  walletType: 'solana' | 'ethereum' | 'bitcoin' | 'binance' | 'other',
  walletAddress: string,
  publicKey: string,
  metadata?: any
) => {
  const response = await api.post('/wallets/connect', {
    userId,
    walletType,
    walletAddress,
    publicKey,
    metadata
  });
  return response.data;
};

export const disconnectWallet = async (walletId: string) => {
  const response = await api.delete(`/wallets/${walletId}`);
  return response.data;
};

export const fetchWallets = async (userId: string) => {
  const response = await api.get(`/wallets/${userId}`);
  return response.data;
};

// Exchange connection endpoints
export const connectExchange = async (
  userId: string,
  exchangeType: 'coinbase' | 'binance' | 'kraken' | 'tdameritrade' | 'alpaca' | 'other',
  apiKey: string,
  apiSecret: string,
  metadata?: any
) => {
  const response = await api.post('/exchanges/connect', {
    userId,
    exchangeType,
    apiKey,
    apiSecret,
    metadata
  });
  return response.data;
};

export const disconnectExchange = async (exchangeId: string) => {
  const response = await api.delete(`/exchanges/${exchangeId}`);
  return response.data;
};

export const fetchExchanges = async (userId: string) => {
  const response = await api.get(`/exchanges/${userId}`);
  return response.data;
};

// Market data endpoints
export const fetchMarketOverview = async () => {
  const response = await api.get('/market/overview');
  return response.data;
};

export const fetchAssetPrice = async (assetId: string, currency: string = 'usd') => {
  const response = await api.get(`/market/price/${assetId}`, { params: { currency } });
  return response.data;
};

// Analytics endpoints
export const fetchUserAnalytics = async (userId: string, timeframe: 'day' | 'week' | 'month' | 'year' = 'month') => {
  const response = await api.get(`/analytics/user/${userId}`, { params: { timeframe } });
  return response.data;
};

export const fetchMarketAnalytics = async (timeframe: 'day' | 'week' | 'month' | 'year' = 'month') => {
  const response = await api.get('/analytics/market', { params: { timeframe } });
  return response.data;
};
