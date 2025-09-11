import { doc, setDoc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { getPortfolioValue, getTokenBalances, getSolBalance } from './solanaService';
import { getPositions, getAccount } from './alpacaService';
import { Portfolio } from '../types/database';

// Function to fetch and update a user's portfolio data
export async function syncPortfolio(userId: string): Promise<Portfolio> {
  try {
    // Get user document to check for connected accounts
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }
    
    const userData = userDoc.data();
    const portfolioRef = doc(db, 'portfolios', userId);
    
    // Initialize portfolio data
    let portfolioData: Partial<Portfolio> = {
      userId,
      alpacaHoldings: {},
      defiHoldings: {},
      totalEquityUSD: 0,
      lastUpdated: Timestamp.now()
    };
    
    // Check if portfolio document exists
    const portfolioDoc = await getDoc(portfolioRef);
    if (portfolioDoc.exists()) {
      portfolioData = { ...portfolioDoc.data() };
    }
    
    // Fetch TradFi data if Alpaca is connected
    if (userData.alpacaLinked) {
      // In a real app, you would retrieve API keys from a secure backend
      // For MVP, we'll use mock data
      const positions = await getPositions('mock-api-key', 'mock-api-secret');
      const account = await getAccount('mock-api-key', 'mock-api-secret');
      
      // Update alpaca holdings
      const alpacaHoldings = {};
      positions.forEach(position => {
        alpacaHoldings[position.symbol] = position.qty;
      });
      
      portfolioData.alpacaHoldings = alpacaHoldings;
      
      // Add TradFi equity to total
      portfolioData.totalEquityUSD = (portfolioData.totalEquityUSD || 0) + account.portfolio_value;
    }
    
    // Fetch DeFi data if wallets are connected
    if (userData.wallets && userData.wallets.length > 0) {
      const defiHoldings = {};
      let defiTotalValue = 0;
      
      // Process each connected wallet
      for (const wallet of userData.wallets) {
        if (wallet.type === 'solana') {
          // Get Solana token balances
          const tokenBalances = await getTokenBalances(wallet.address);
          const solBalance = await getSolBalance(wallet.address);
          
          // Add SOL balance
          defiHoldings['SOL'] = (defiHoldings['SOL'] || 0) + solBalance;
          
          // Add other token balances
          tokenBalances.forEach(token => {
            defiHoldings[token.symbol] = (defiHoldings[token.symbol] || 0) + token.uiAmount;
          });
          
          // Calculate wallet value
          const walletValue = await getPortfolioValue(wallet.address);
          defiTotalValue += walletValue;
        }
        // Add support for other wallet types (ETH, etc.) here
      }
      
      portfolioData.defiHoldings = defiHoldings;
      
      // Add DeFi equity to total
      if (!userData.alpacaLinked) {
        // If Alpaca isn't connected, set the total to DeFi value only
        portfolioData.totalEquityUSD = defiTotalValue;
      } else {
        // Otherwise add DeFi value to existing total
        portfolioData.totalEquityUSD = (portfolioData.totalEquityUSD || 0) + defiTotalValue;
      }
    }
    
    // Update the portfolio document
    await setDoc(portfolioRef, portfolioData);
    
    return portfolioData as Portfolio;
  } catch (error) {
    console.error('Error syncing portfolio:', error);
    throw error;
  }
}

// Calculate allocation percentages
export function calculateAllocation(portfolio: Portfolio): { tradfi: number, defi: number } {
  if (!portfolio || portfolio.totalEquityUSD === 0) {
    return { tradfi: 0, defi: 0 };
  }
  
  // Calculate TradFi value (sum of all Alpaca holdings)
  let tradfiValue = 0;
  if (portfolio.alpacaHoldings) {
    // In a real app, you would calculate the actual value
    // For MVP, we'll use the mock account data
    tradfiValue = 4276.55; // Mock value from alpacaService
  }
  
  // Calculate DeFi value (total - tradfi)
  const defiValue = portfolio.totalEquityUSD - tradfiValue;
  
  // Calculate percentages
  const tradfiPercentage = (tradfiValue / portfolio.totalEquityUSD) * 100;
  const defiPercentage = (defiValue / portfolio.totalEquityUSD) * 100;
  
  return {
    tradfi: Math.round(tradfiPercentage),
    defi: Math.round(defiPercentage)
  };
}

// Record a transaction between TradFi and DeFi
export async function recordTransaction(
  userId: string,
  from: 'alpaca' | 'phantom_wallet' | 'metamask',
  to: 'alpaca' | 'phantom_wallet' | 'metamask',
  amountUSD: number
): Promise<string> {
  try {
    // Create a new transaction document
    const transactionData = {
      userId,
      from,
      to,
      amountUSD,
      status: 'pending',
      txHash: null,
      initiatedAt: Timestamp.now(),
      completedAt: null
    };
    
    // Add to transactions collection
    const transactionRef = doc(db, 'transactions', `${userId}_${Date.now()}`);
    await setDoc(transactionRef, transactionData);
    
    return transactionRef.id;
  } catch (error) {
    console.error('Error recording transaction:', error);
    throw error;
  }
}

// Update transaction status
export async function updateTransactionStatus(
  transactionId: string,
  status: 'pending' | 'completed' | 'failed',
  txHash?: string
): Promise<void> {
  try {
    const transactionRef = doc(db, 'transactions', transactionId);
    
    const updateData: any = { status };
    
    if (status === 'completed') {
      updateData.completedAt = Timestamp.now();
    }
    
    if (txHash) {
      updateData.txHash = txHash;
    }
    
    await updateDoc(transactionRef, updateData);
  } catch (error) {
    console.error('Error updating transaction status:', error);
    throw error;
  }
}
