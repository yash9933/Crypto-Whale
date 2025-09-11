import { Timestamp } from 'firebase/firestore';

export interface User {
  uid: string;
  email: string;
  plaidLinked: boolean;
  alpacaLinked: boolean;
  wallets: Wallet[];
  createdAt: Timestamp;
  lastLogin: Timestamp;
}

export interface Wallet {
  type: 'solana' | 'eth';
  address: string;
}

export interface Portfolio {
  userId: string;
  alpacaHoldings: Record<string, number>;
  defiHoldings: Record<string, number>;
  totalEquityUSD: number;
  lastUpdated: Timestamp;
}

export interface Transaction {
  userId: string;
  from: 'alpaca' | 'phantom_wallet' | 'metamask';
  to: 'alpaca' | 'phantom_wallet' | 'metamask';
  amountUSD: number;
  status: 'pending' | 'completed' | 'failed';
  txHash: string | null;
  initiatedAt: Timestamp;
  completedAt: Timestamp | null;
}
