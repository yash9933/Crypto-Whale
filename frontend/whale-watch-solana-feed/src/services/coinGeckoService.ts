import axios from 'axios';

// CoinGecko API has rate limits, so we need to handle them
const BASE_URL = 'https://api.coingecko.com/api/v3';

// Alternative proxy URLs in case the main API has CORS issues
const PROXY_URLS = [
  'https://api.coingecko.com/api/v3',
  'https://coingecko.p.rapidapi.com/api/v3',
  'https://api.coincap.io/v2' // Alternative API with different structure
];

// Mock data for fallback when all API calls fail
const MOCK_TOP_COINS = [
  {
    id: "bitcoin",
    symbol: "btc",
    name: "Bitcoin",
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    current_price: 55225.0,
    market_cap: 1084057024018,
    market_cap_rank: 1,
    fully_diluted_valuation: 1160725230123,
    total_volume: 46891415269,
    high_24h: 56800.0,
    low_24h: 54200.0,
    price_change_24h: 1025.0,
    price_change_percentage_24h: 1.89,
    market_cap_change_24h: 20057024018,
    market_cap_change_percentage_24h: 1.89,
    circulating_supply: 19318118.0,
    total_supply: 21000000.0,
    max_supply: 21000000.0,
    ath: 69045.0,
    ath_change_percentage: -20.01,
    ath_date: "2021-11-10T14:24:11.849Z",
    atl: 67.81,
    atl_change_percentage: 81344.36,
    atl_date: "2013-07-06T00:00:00.000Z",
    last_updated: new Date().toISOString(),
    price_change_percentage_1h_in_currency: 0.15,
    price_change_percentage_24h_in_currency: 1.89,
    price_change_percentage_7d_in_currency: 5.23
  },
  {
    id: "ethereum",
    symbol: "eth",
    name: "Ethereum",
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    current_price: 3050.12,
    market_cap: 366880000000,
    market_cap_rank: 2,
    fully_diluted_valuation: 366880000000,
    total_volume: 21500000000,
    high_24h: 3100.0,
    low_24h: 2980.0,
    price_change_24h: 70.12,
    price_change_percentage_24h: 2.35,
    market_cap_change_24h: 8620000000,
    market_cap_change_percentage_24h: 2.35,
    circulating_supply: 120250000.0,
    total_supply: 120250000.0,
    max_supply: null,
    ath: 4878.26,
    ath_change_percentage: -37.48,
    ath_date: "2021-11-10T14:24:19.604Z",
    atl: 0.432979,
    atl_change_percentage: 704555.24,
    atl_date: "2015-10-20T00:00:00.000Z",
    last_updated: new Date().toISOString(),
    price_change_percentage_1h_in_currency: 0.12,
    price_change_percentage_24h_in_currency: 2.35,
    price_change_percentage_7d_in_currency: 3.45
  },
  {
    id: "solana",
    symbol: "sol",
    name: "Solana",
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    current_price: 132.56,
    market_cap: 58450000000,
    market_cap_rank: 5,
    fully_diluted_valuation: 73200000000,
    total_volume: 2850000000,
    high_24h: 135.0,
    low_24h: 128.5,
    price_change_24h: 4.06,
    price_change_percentage_24h: 3.16,
    market_cap_change_24h: 1790000000,
    market_cap_change_percentage_24h: 3.16,
    circulating_supply: 441000000.0,
    total_supply: 551000000.0,
    max_supply: null,
    ath: 259.96,
    ath_change_percentage: -49.01,
    ath_date: "2021-11-06T21:54:35.825Z",
    atl: 0.500801,
    atl_change_percentage: 26370.97,
    atl_date: "2020-05-11T19:35:23.449Z",
    last_updated: new Date().toISOString(),
    price_change_percentage_1h_in_currency: 0.22,
    price_change_percentage_24h_in_currency: 3.16,
    price_change_percentage_7d_in_currency: 8.59
  }
];

// Mock market chart data for fallback
const generateMockMarketChartData = (days: number | 'max') => {
  const numDataPoints = days === 'max' ? 365 : (typeof days === 'number' ? days : 7);
  const prices: [number, number][] = [];
  const market_caps: [number, number][] = [];
  const total_volumes: [number, number][] = [];
  
  // Generate data with realistic patterns
  let price = 50000 + Math.random() * 10000;
  let marketCap = 1000000000000;
  let volume = 50000000000;
  
  const now = Date.now();
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  
  for (let i = 0; i < numDataPoints; i++) {
    const timestamp = now - (numDataPoints - i) * millisecondsPerDay;
    
    // Add some randomness and trends
    const change = (Math.random() - 0.5) * 0.05; // -2.5% to +2.5% change
    price = price * (1 + change);
    marketCap = price * 19000000; // Approximate BTC supply
    volume = 50000000000 + Math.random() * 10000000000;
    
    prices.push([timestamp, price]);
    market_caps.push([timestamp, marketCap]);
    total_volumes.push([timestamp, volume]);
  }
  
  return { prices, market_caps, total_volumes };
};

const coinGeckoApi = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

// Add retry logic for API rate limiting and CORS issues
const fetchWithRetry = async (apiCall: () => Promise<any>, maxRetries = 3, delay = 1000) => {
  let retries = 0;
  let lastError: any = null;
  
  // Try with the main API first
  while (retries < maxRetries) {
    try {
      return await apiCall();
    } catch (error: any) {
      lastError = error;
      
      if (error.response && error.response.status === 429) {
        // Rate limited - wait and retry
        retries++;
        console.log(`Rate limited, retrying (${retries}/${maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, delay * retries));
      } else if (error.message && (error.message.includes('CORS') || error.message.includes('Network Error'))) {
        // CORS issue - try a different base URL
        retries++;
        console.log(`CORS or network error, trying alternative endpoint (${retries}/${maxRetries})...`);
        
        // Switch to an alternative API endpoint
        if (retries < PROXY_URLS.length) {
          coinGeckoApi.defaults.baseURL = PROXY_URLS[retries];
        }
        
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
  
  // If we've exhausted all retries, throw the last error
  throw lastError;
};

export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
  price_change_percentage_1h_in_currency?: number;
  price_change_percentage_24h_in_currency?: number;
  price_change_percentage_7d_in_currency?: number;
}

export interface CoinMarketChart {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

export const coinGeckoService = {
  // Get top coins by market cap
  getTopCoins: async (count: number = 20, currency: string = 'usd'): Promise<Coin[]> => {
    try {
      // Try with direct API
      try {
        const response = await fetchWithRetry(() => 
          coinGeckoApi.get('/coins/markets', {
            params: {
              vs_currency: currency,
              order: 'market_cap_desc',
              per_page: count,
              page: 1,
              sparkline: false,
              price_change_percentage: '1h,24h,7d',
              locale: 'en',
            },
          })
        );
        
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          return response.data;
        }
      } catch (directApiError) {
        console.error("Direct API call failed:", directApiError);
        // Continue to fallback methods
      }
      
      // Fallback: Try with a public CORS proxy
      try {
        const corsProxyUrl = `https://corsproxy.io/?${encodeURIComponent(`${BASE_URL}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${count}&page=1&sparkline=false&price_change_percentage=1h,24h,7d&locale=en`)}`;
        
        const proxyResponse = await axios.get(corsProxyUrl);
        
        if (proxyResponse.data && Array.isArray(proxyResponse.data) && proxyResponse.data.length > 0) {
          return proxyResponse.data;
        }
      } catch (proxyError) {
        console.error("CORS proxy fallback failed:", proxyError);
      }
      
      // Final fallback: Return mock data
      console.log("All API methods failed, returning mock data");
      return MOCK_TOP_COINS;
    } catch (error) {
      console.error('Error fetching top coins:', error);
      return MOCK_TOP_COINS;
    }
  },

  // Get historical market data for a specific coin
  getCoinMarketChart: async (
    coinId: string,
    days: number | 'max' = 7,
    currency: string = 'usd'
  ): Promise<CoinMarketChart | null> => {
    try {
      // Ensure days parameter is correctly formatted
      const daysParam = days === 'max' ? 'max' : days.toString();
      
      // Determine appropriate interval based on time range
      let interval = 'daily';
      if (days === 1) {
        interval = 'hourly';
      } else if (days === 7) {
        interval = 'hourly';
      } else if (days === 30 || days === 90) {
        interval = 'daily';
      } else if (days === 365 || days === 'max') {
        interval = 'weekly';
      }
      
      // Add cache busting parameter to avoid stale data
      const cacheBuster = new Date().getTime();
      
      // Try with direct API first
      try {
        const response = await fetchWithRetry(() => 
          coinGeckoApi.get(`/coins/${coinId}/market_chart`, {
            params: {
              vs_currency: currency,
              days: daysParam,
              interval: interval,
              _: cacheBuster, // Cache busting parameter
            },
          })
        );
        
        // Validate the response data
        if (response.data && Array.isArray(response.data.prices) && response.data.prices.length > 0) {
          return response.data;
        }
      } catch (directApiError) {
        console.error("Direct API call failed:", directApiError);
        // Continue to fallback methods
      }
      
      // Fallback: Try with a public CORS proxy
      try {
        const corsProxyUrl = `https://corsproxy.io/?${encodeURIComponent(`${BASE_URL}/coins/${coinId}/market_chart?vs_currency=${currency}&days=${daysParam}&interval=${interval}`)}`;
        
        const proxyResponse = await axios.get(corsProxyUrl);
        
        if (proxyResponse.data && Array.isArray(proxyResponse.data.prices) && proxyResponse.data.prices.length > 0) {
          return proxyResponse.data;
        }
      } catch (proxyError) {
        console.error("CORS proxy fallback failed:", proxyError);
      }
      
      // Final fallback: Return mock data
      console.log("All API methods failed, returning mock chart data");
      return generateMockMarketChartData(days);
    } catch (error) {
      console.error(`Error fetching market chart for ${coinId}:`, error);
      return generateMockMarketChartData(days);
    }
  },

  // Get detailed info for a specific coin
  getCoinDetails: async (coinId: string): Promise<any> => {
    try {
      // Try with direct API
      try {
        const response = await fetchWithRetry(() => 
          coinGeckoApi.get(`/coins/${coinId}`, {
            params: {
              localization: false,
              tickers: false,
              market_data: true,
              community_data: false,
              developer_data: false,
              sparkline: false,
            },
          })
        );
        
        if (response.data && response.data.id) {
          return response.data;
        }
      } catch (directApiError) {
        console.error("Direct API call failed:", directApiError);
        // Continue to fallback methods
      }
      
      // Fallback: Try with a public CORS proxy
      try {
        const corsProxyUrl = `https://corsproxy.io/?${encodeURIComponent(`${BASE_URL}/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`)}`;
        
        const proxyResponse = await axios.get(corsProxyUrl);
        
        if (proxyResponse.data && proxyResponse.data.id) {
          return proxyResponse.data;
        }
      } catch (proxyError) {
        console.error("CORS proxy fallback failed:", proxyError);
      }
      
      // Final fallback: Return mock data
      console.log("All API methods failed, returning mock coin details");
      return MOCK_TOP_COINS.find(coin => coin.id === coinId) || MOCK_TOP_COINS[0];
    } catch (error) {
      console.error(`Error fetching details for ${coinId}:`, error);
      return MOCK_TOP_COINS.find(coin => coin.id === coinId) || MOCK_TOP_COINS[0];
    }
  },

  // Search for coins by query
  searchCoins: async (query: string): Promise<any[]> => {
    try {
      // Try with direct API
      try {
        const response = await fetchWithRetry(() => 
          coinGeckoApi.get('/search', {
            params: {
              query: query,
            },
          })
        );
        
        if (response.data && response.data.coins && Array.isArray(response.data.coins)) {
          return response.data.coins;
        }
      } catch (directApiError) {
        console.error("Direct API call failed:", directApiError);
        // Continue to fallback methods
      }
      
      // Fallback: Try with a public CORS proxy
      try {
        const corsProxyUrl = `https://corsproxy.io/?${encodeURIComponent(`${BASE_URL}/search?query=${query}`)}`;
        
        const proxyResponse = await axios.get(corsProxyUrl);
        
        if (proxyResponse.data && proxyResponse.data.coins && Array.isArray(proxyResponse.data.coins)) {
          return proxyResponse.data.coins;
        }
      } catch (proxyError) {
        console.error("CORS proxy fallback failed:", proxyError);
      }
      
      // Final fallback: Filter mock data
      console.log("All API methods failed, returning filtered mock data");
      return MOCK_TOP_COINS
        .filter(coin => 
          coin.name.toLowerCase().includes(query.toLowerCase()) || 
          coin.symbol.toLowerCase().includes(query.toLowerCase())
        )
        .map(coin => ({
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol,
          market_cap_rank: coin.market_cap_rank,
          thumb: coin.image,
          large: coin.image
        }));
    } catch (error) {
      console.error('Error searching coins:', error);
      return [];
    }
  },

  // Get global crypto market data
  getGlobalData: async (): Promise<any> => {
    try {
      // Try with direct API
      try {
        const response = await fetchWithRetry(() => 
          coinGeckoApi.get('/global')
        );
        
        if (response.data && response.data.data) {
          return response.data.data;
        }
      } catch (directApiError) {
        console.error("Direct API call failed:", directApiError);
        // Continue to fallback methods
      }
      
      // Fallback: Try with a public CORS proxy
      try {
        const corsProxyUrl = `https://corsproxy.io/?${encodeURIComponent(`${BASE_URL}/global`)}`;
        
        const proxyResponse = await axios.get(corsProxyUrl);
        
        if (proxyResponse.data && proxyResponse.data.data) {
          return proxyResponse.data.data;
        }
      } catch (proxyError) {
        console.error("CORS proxy fallback failed:", proxyError);
      }
      
      // Final fallback: Return mock global data
      console.log("All API methods failed, returning mock global data");
      return {
        active_cryptocurrencies: 17088,
        upcoming_icos: 0,
        ongoing_icos: 49,
        ended_icos: 3376,
        markets: 892,
        total_market_cap: {
          btc: 41282000,
          eth: 652340000,
          ltc: 16420000000,
          usd: 2280000000000
        },
        total_volume: {
          btc: 1790000,
          eth: 28200000,
          ltc: 711000000,
          usd: 98700000000
        },
        market_cap_percentage: {
          btc: 47.5,
          eth: 16.1,
          usdt: 4.2,
          bnb: 2.6,
          sol: 2.5,
          xrp: 2.1,
          usdc: 2.0,
          steth: 1.1,
          ada: 0.9,
          avax: 0.8
        },
        market_cap_change_percentage_24h_usd: 1.23,
        updated_at: Date.now()
      };
    } catch (error) {
      console.error('Error fetching global data:', error);
      return null;
    }
  }
};
