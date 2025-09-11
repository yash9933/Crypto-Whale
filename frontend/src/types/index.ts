
export interface Wallet {
  address: string;
  nickname?: string;
  balance?: {
    sol: number;
    usd: number;
  };
  lastActivity?: Date;
  isActive?: boolean;
}

export type TransactionType = 'buy' | 'sell' | 'mint' | 'transfer';

export interface Transaction {
  id: string;
  walletAddress: string;
  type: TransactionType;
  tokenSymbol: string;
  tokenName?: string;
  amount: number;
  usdValue?: number;
  timestamp: Date;
  solscanLink?: string;
}

export interface Settings {
  notifications: {
    telegram: boolean;
    email: boolean;
  };
  notificationTypes: {
    buy: boolean;
    sell: boolean;
    mint: boolean;
    transfer: boolean;
  };
  telegramHandle?: string;
  email?: string;
  darkMode: boolean;
}
