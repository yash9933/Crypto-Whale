
import { useEffect, useRef, useState } from 'react';
import { Transaction } from '../types';
import { useTransactionStore, useWalletStore } from '../store/store';
import { toast } from 'sonner';

// This would usually come from an environment variable
const WS_URL = 'wss://api.example.com/sol-tracker';

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const { addTransaction } = useTransactionStore();
  const { wallets, updateWallet } = useWalletStore();
  
  // For demo purposes, we'll mock the WebSocket with fake data
  const mockSocket = useRef<NodeJS.Timeout | null>(null);
  
  const connect = () => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      return;
    }
    
    setIsConnecting(true);
    
    // In a real implementation, we would connect to the actual WebSocket here
    // socketRef.current = new WebSocket(WS_URL);
    
    // For demo purposes, we'll simulate a connection
    setTimeout(() => {
      setIsConnected(true);
      setIsConnecting(false);
      startMockDataStream();
      toast.success("Connected to transaction stream");
    }, 1500);
  };
  
  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    
    if (mockSocket.current) {
      clearInterval(mockSocket.current);
      mockSocket.current = null;
    }
    
    setIsConnected(false);
    toast.info("Disconnected from transaction stream");
  };
  
  // Mock function to generate random transactions
  const generateMockTransaction = (): Transaction => {
    const types: Transaction['type'][] = ['buy', 'sell', 'mint', 'transfer'];
    const tokens = [
      { symbol: 'SOL', name: 'Solana' },
      { symbol: 'BONK', name: 'Bonk' },
      { symbol: 'JTO', name: 'Jito' },
      { symbol: 'RAY', name: 'Raydium' },
      { symbol: 'PYTH', name: 'Pyth Network' },
    ];
    
    const randomWalletIndex = Math.floor(Math.random() * Math.max(wallets.length, 1));
    const walletAddress = wallets.length > 0 
      ? wallets[randomWalletIndex].address 
      : `Wallet${Math.floor(Math.random() * 1000)}`;
    
    const typeIndex = Math.floor(Math.random() * types.length);
    const tokenIndex = Math.floor(Math.random() * tokens.length);
    const amount = parseFloat((Math.random() * 100).toFixed(3));
    const usdValue = parseFloat((amount * (Math.random() * 100)).toFixed(2));
    
    // Update wallet's last activity
    if (wallets.length > 0) {
      updateWallet(wallets[randomWalletIndex].address, {
        lastActivity: new Date(),
        balance: {
          sol: parseFloat((Math.random() * 1000).toFixed(2)),
          usd: parseFloat((Math.random() * 50000).toFixed(2)),
        },
      });
    }
    
    return {
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      walletAddress,
      type: types[typeIndex],
      tokenSymbol: tokens[tokenIndex].symbol,
      tokenName: tokens[tokenIndex].name,
      amount,
      usdValue,
      timestamp: new Date(),
      solscanLink: `https://solscan.io/tx/example${Math.random().toString(36).substr(2, 9)}`,
    };
  };
  
  const startMockDataStream = () => {
    if (mockSocket.current) {
      clearInterval(mockSocket.current);
    }
    
    // Send a mock transaction every few seconds
    mockSocket.current = setInterval(() => {
      const transaction = generateMockTransaction();
      addTransaction(transaction);
    }, 3000);
  };
  
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);
  
  useEffect(() => {
    // If we have wallets and we're connected, make sure the mock data stream is running
    if (wallets.length > 0 && isConnected && !mockSocket.current) {
      startMockDataStream();
    }
  }, [wallets, isConnected]);
  
  return {
    isConnected,
    isConnecting,
    connect,
    disconnect,
  };
}
