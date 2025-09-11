import axios from 'axios';

// Types
export interface AlpacaPosition {
  symbol: string;
  qty: number;
  market_value: number;
  current_price: number;
  change_today: number;
  unrealized_pl: number;
  unrealized_plpc: number;
  asset_class: string;
}

export interface AlpacaAccount {
  id: string;
  equity: number;
  cash: number;
  buying_power: number;
  portfolio_value: number;
}

// In a real application, this would be handled by a backend service
// For MVP purposes, we'll simulate API calls with mock data
// and then show how to integrate with the real Alpaca API

// Mock data for development
const mockPositions: AlpacaPosition[] = [
  {
    symbol: 'AAPL',
    qty: 10,
    market_value: 1750.50,
    current_price: 175.05,
    change_today: 0.0125,
    unrealized_pl: 250.50,
    unrealized_plpc: 0.1669,
    asset_class: 'us_equity'
  },
  {
    symbol: 'MSFT',
    qty: 5,
    market_value: 2000.75,
    current_price: 400.15,
    change_today: -0.0075,
    unrealized_pl: 175.25,
    unrealized_plpc: 0.0959,
    asset_class: 'us_equity'
  },
  {
    symbol: 'AMZN',
    qty: 3,
    market_value: 525.30,
    current_price: 175.10,
    change_today: 0.0225,
    unrealized_pl: 45.90,
    unrealized_plpc: 0.0956,
    asset_class: 'us_equity'
  }
];

const mockAccount: AlpacaAccount = {
  id: 'mock-account-id',
  equity: 5276.55,
  cash: 1000.00,
  buying_power: 2000.00,
  portfolio_value: 4276.55
};

// Mock API functions
export async function getPositions(apiKey: string, apiSecret: string): Promise<AlpacaPosition[]> {
  // For MVP, return mock data
  // In production, this would call the Alpaca API
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockPositions), 500);
  });
}

export async function getAccount(apiKey: string, apiSecret: string): Promise<AlpacaAccount> {
  // For MVP, return mock data
  // In production, this would call the Alpaca API
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockAccount), 500);
  });
}

// Example of how to integrate with the real Alpaca API
// This would be implemented in a backend service in production
export async function getRealPositions(apiKey: string, apiSecret: string): Promise<AlpacaPosition[]> {
  try {
    const response = await axios.get('https://paper-api.alpaca.markets/v2/positions', {
      headers: {
        'APCA-API-KEY-ID': apiKey,
        'APCA-API-SECRET-KEY': apiSecret
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Alpaca positions:', error);
    return [];
  }
}

export async function getRealAccount(apiKey: string, apiSecret: string): Promise<AlpacaAccount> {
  try {
    const response = await axios.get('https://paper-api.alpaca.markets/v2/account', {
      headers: {
        'APCA-API-KEY-ID': apiKey,
        'APCA-API-SECRET-KEY': apiSecret
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Alpaca account:', error);
    throw error;
  }
}

// Function to place a market order
export async function placeOrder(
  apiKey: string, 
  apiSecret: string, 
  symbol: string, 
  qty: number, 
  side: 'buy' | 'sell'
): Promise<any> {
  try {
    // For MVP, log the order but don't actually place it
    console.log(`Placing ${side} order for ${qty} shares of ${symbol}`);
    
    // In production, this would call the Alpaca API
    /*
    const response = await axios.post(
      'https://paper-api.alpaca.markets/v2/orders',
      {
        symbol,
        qty,
        side,
        type: 'market',
        time_in_force: 'day'
      },
      {
        headers: {
          'APCA-API-KEY-ID': apiKey,
          'APCA-API-SECRET-KEY': apiSecret
        }
      }
    );
    return response.data;
    */
    
    // Return mock order data
    return {
      id: 'mock-order-id',
      client_order_id: 'mock-client-order-id',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      submitted_at: new Date().toISOString(),
      filled_at: null,
      expired_at: null,
      canceled_at: null,
      failed_at: null,
      asset_id: 'mock-asset-id',
      symbol,
      qty,
      filled_qty: '0',
      type: 'market',
      side,
      time_in_force: 'day',
      status: 'new'
    };
  } catch (error) {
    console.error('Error placing Alpaca order:', error);
    throw error;
  }
}
