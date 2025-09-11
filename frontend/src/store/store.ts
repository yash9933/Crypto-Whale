
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Settings, Transaction, Wallet } from '../types';

interface WalletStore {
  wallets: Wallet[];
  activeWallet: string | null;
  addWallet: (wallet: Wallet) => void;
  removeWallet: (address: string) => void;
  updateWallet: (address: string, updates: Partial<Wallet>) => void;
  setActiveWallet: (address: string | null) => void;
}

interface TransactionStore {
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
  clearTransactions: () => void;
}

interface SettingsStore {
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
}

export const useWalletStore = create<WalletStore>()(
  persist(
    (set) => ({
      wallets: [],
      activeWallet: null,
      addWallet: (wallet) =>
        set((state) => ({
          wallets: state.wallets.some((w) => w.address === wallet.address)
            ? state.wallets
            : [...state.wallets, wallet],
        })),
      removeWallet: (address) =>
        set((state) => ({
          wallets: state.wallets.filter((w) => w.address !== address),
          activeWallet: state.activeWallet === address ? null : state.activeWallet,
        })),
      updateWallet: (address, updates) =>
        set((state) => ({
          wallets: state.wallets.map((wallet) =>
            wallet.address === address ? { ...wallet, ...updates } : wallet
          ),
        })),
      setActiveWallet: (address) => set({ activeWallet: address }),
    }),
    {
      name: 'wallet-storage',
    }
  )
);

export const useTransactionStore = create<TransactionStore>((set) => ({
  transactions: [],
  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [transaction, ...state.transactions].slice(0, 100), // Keep only the latest 100 transactions
    })),
  clearTransactions: () => set({ transactions: [] }),
}));

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: {
        notifications: {
          telegram: false,
          email: false,
        },
        notificationTypes: {
          buy: true,
          sell: true,
          mint: true,
          transfer: true,
        },
        darkMode: false,
      },
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
    }),
    {
      name: 'settings-storage',
    }
  )
);
