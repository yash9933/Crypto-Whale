import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import axios from 'axios';

// Constants
const SOLANA_RPC_URL = 'https://api.devnet.solana.com'; // Use mainnet-beta for production
const connection = new Connection(SOLANA_RPC_URL);

// Token list from Solana token list
const KNOWN_TOKENS = {
  'So11111111111111111111111111111111111111112': { symbol: 'SOL', decimals: 9, coingeckoId: 'solana' },
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': { symbol: 'USDC', decimals: 6, coingeckoId: 'usd-coin' },
  'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB': { symbol: 'USDT', decimals: 6, coingeckoId: 'tether' },
};

// Types
interface TokenBalance {
  mint: string;
  amount: number;
  decimals: number;
  uiAmount: number;
  symbol: string;
}

interface TokenPrice {
  symbol: string;
  usdPrice: number;
}

// Get SOL balance
export async function getSolBalance(walletAddress: string): Promise<number> {
  try {
    const publicKey = new PublicKey(walletAddress);
    const balance = await connection.getBalance(publicKey);
    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error('Error fetching SOL balance:', error);
    return 0;
  }
}

// Get SPL token balances
export async function getTokenBalances(walletAddress: string): Promise<TokenBalance[]> {
  try {
    const publicKey = new PublicKey(walletAddress);
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
      programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
    });

    return tokenAccounts.value
      .map(tokenAccount => {
        const accountData = tokenAccount.account.data.parsed.info;
        const mintAddress = accountData.mint;
        const amount = accountData.tokenAmount.amount;
        const decimals = accountData.tokenAmount.decimals;
        const uiAmount = accountData.tokenAmount.uiAmount;
        
        // Only include tokens with a balance
        if (uiAmount === 0) return null;
        
        // Get token symbol if known
        const tokenInfo = KNOWN_TOKENS[mintAddress];
        const symbol = tokenInfo?.symbol || 'Unknown';
        
        return {
          mint: mintAddress,
          amount: parseInt(amount),
          decimals,
          uiAmount,
          symbol,
        };
      })
      .filter(Boolean);
  } catch (error) {
    console.error('Error fetching token balances:', error);
    return [];
  }
}

// Get token prices from CoinGecko
export async function getTokenPrices(tokens: TokenBalance[]): Promise<TokenPrice[]> {
  try {
    // Get coingecko IDs for the tokens
    const tokenIds = tokens
      .map(token => {
        const tokenInfo = Object.values(KNOWN_TOKENS).find(t => t.symbol === token.symbol);
        return tokenInfo?.coingeckoId;
      })
      .filter(Boolean)
      .join(',');
    
    if (!tokenIds) return [];
    
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${tokenIds}&vs_currencies=usd`
    );
    
    return tokens
      .map(token => {
        const tokenInfo = Object.values(KNOWN_TOKENS).find(t => t.symbol === token.symbol);
        if (!tokenInfo?.coingeckoId) return null;
        
        const usdPrice = response.data[tokenInfo.coingeckoId]?.usd || 0;
        
        return {
          symbol: token.symbol,
          usdPrice,
        };
      })
      .filter(Boolean);
  } catch (error) {
    console.error('Error fetching token prices:', error);
    return [];
  }
}

// Calculate total portfolio value in USD
export async function getPortfolioValue(walletAddress: string): Promise<number> {
  try {
    // Get SOL balance
    const solBalance = await getSolBalance(walletAddress);
    
    // Get token balances
    const tokenBalances = await getTokenBalances(walletAddress);
    
    // Get token prices
    const tokenPrices = await getTokenPrices([
      ...tokenBalances,
      { mint: 'So11111111111111111111111111111111111111112', amount: solBalance * LAMPORTS_PER_SOL, decimals: 9, uiAmount: solBalance, symbol: 'SOL' },
    ]);
    
    // Calculate total value
    let totalValue = 0;
    
    // Add SOL value
    const solPrice = tokenPrices.find(tp => tp.symbol === 'SOL')?.usdPrice || 0;
    totalValue += solBalance * solPrice;
    
    // Add token values
    tokenBalances.forEach(token => {
      const price = tokenPrices.find(tp => tp.symbol === token.symbol)?.usdPrice || 0;
      totalValue += token.uiAmount * price;
    });
    
    return totalValue;
  } catch (error) {
    console.error('Error calculating portfolio value:', error);
    return 0;
  }
}
