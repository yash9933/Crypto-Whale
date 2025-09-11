import React from 'react';

// Wallet type definitions
export type WalletType = 
  // Hot wallets
  | 'metamask' | 'phantom' | 'keplr' | 'rabbi' | 'trust'
  // Cold/Hardware wallets
  | 'ledger' | 'trezor' | 'lattice1'
  // Custodial/Institutional
  | 'fireblocks' | 'anchorage' | 'coinbase_prime' | 'bitgo';

export type WalletCategory = 'hot' | 'cold' | 'custodial';

export type ChainType = 'ethereum' | 'solana' | 'bitcoin' | 'cosmos' | 'multi';

export interface WalletInfo {
  id: WalletType;
  name: string;
  category: WalletCategory;
  chains: ChainType[];
  logo: string;
  explorerBaseUrl?: Partial<Record<ChainType, string>>;
  description: string;
}

// Wallet information
export const walletInfo: Record<WalletType, WalletInfo> = {
  // Hot wallets
  metamask: {
    id: 'metamask',
    name: 'MetaMask',
    category: 'hot',
    chains: ['ethereum'],
    logo: '/assets/wallets/metamask.svg',
    explorerBaseUrl: {
      ethereum: 'https://etherscan.io/address/'
    },
    description: 'The most popular Ethereum wallet with browser extension and mobile app'
  },
  phantom: {
    id: 'phantom',
    name: 'Phantom',
    category: 'hot',
    chains: ['solana'],
    logo: '/assets/wallets/phantom.svg',
    explorerBaseUrl: {
      solana: 'https://solscan.io/account/'
    },
    description: 'Leading Solana wallet with browser extension and mobile app'
  },
  keplr: {
    id: 'keplr',
    name: 'Keplr',
    category: 'hot',
    chains: ['cosmos'],
    logo: '/assets/wallets/keplr.svg',
    explorerBaseUrl: {
      cosmos: 'https://www.mintscan.io/cosmos/account/'
    },
    description: 'The most popular wallet for the Cosmos ecosystem'
  },
  rabbi: {
    id: 'rabbi',
    name: 'Rabbi Wallet',
    category: 'hot',
    chains: ['bitcoin', 'ethereum'],
    logo: '/assets/wallets/rabbi.svg',
    explorerBaseUrl: {
      bitcoin: 'https://mempool.space/address/',
      ethereum: 'https://etherscan.io/address/'
    },
    description: 'Bitcoin and Ethereum wallet with Ordinals support'
  },
  trust: {
    id: 'trust',
    name: 'Trust Wallet',
    category: 'hot',
    chains: ['multi'],
    logo: '/assets/wallets/trust.svg',
    explorerBaseUrl: {
      ethereum: 'https://etherscan.io/address/',
      solana: 'https://solscan.io/account/',
      bitcoin: 'https://mempool.space/address/'
    },
    description: 'Multi-chain wallet supporting 40+ blockchains and 160K+ assets'
  },
  
  // Cold/Hardware wallets
  ledger: {
    id: 'ledger',
    name: 'Ledger Nano',
    category: 'cold',
    chains: ['multi'],
    logo: '/assets/wallets/ledger.svg',
    explorerBaseUrl: {
      ethereum: 'https://etherscan.io/address/',
      solana: 'https://solscan.io/account/',
      bitcoin: 'https://mempool.space/address/'
    },
    description: 'Industry-leading hardware wallet with multi-chain support'
  },
  trezor: {
    id: 'trezor',
    name: 'Trezor',
    category: 'cold',
    chains: ['multi'],
    logo: '/assets/wallets/trezor.svg',
    explorerBaseUrl: {
      ethereum: 'https://etherscan.io/address/',
      bitcoin: 'https://mempool.space/address/'
    },
    description: 'Open-source hardware wallet with strong security features'
  },
  lattice1: {
    id: 'lattice1',
    name: 'GridPlus Lattice1',
    category: 'cold',
    chains: ['ethereum', 'bitcoin'],
    logo: '/assets/wallets/gridplus.svg',
    explorerBaseUrl: {
      ethereum: 'https://etherscan.io/address/',
      bitcoin: 'https://mempool.space/address/'
    },
    description: 'Enterprise-grade hardware wallet with advanced security'
  },
  
  // Custodial/Institutional
  fireblocks: {
    id: 'fireblocks',
    name: 'Fireblocks',
    category: 'custodial',
    chains: ['multi'],
    logo: '/assets/wallets/fireblocks.svg',
    description: 'Enterprise-grade digital asset custody platform'
  },
  anchorage: {
    id: 'anchorage',
    name: 'Anchorage Digital',
    category: 'custodial',
    chains: ['multi'],
    logo: '/assets/wallets/anchorage.svg',
    description: 'Federally chartered crypto bank with institutional custody'
  },
  coinbase_prime: {
    id: 'coinbase_prime',
    name: 'Coinbase Prime',
    category: 'custodial',
    chains: ['multi'],
    logo: '/assets/wallets/coinbase_prime.svg',
    description: 'Institutional trading and custody platform by Coinbase'
  },
  bitgo: {
    id: 'bitgo',
    name: 'BitGo',
    category: 'custodial',
    chains: ['multi'],
    logo: '/assets/wallets/bitgo.svg',
    description: 'Institutional digital asset custody and security solution'
  }
};

// Chain information
export const chainInfo: Record<ChainType, { name: string; icon: string; color: string }> = {
  ethereum: {
    name: 'Ethereum',
    icon: '/assets/chains/ethereum.svg',
    color: '#627EEA'
  },
  solana: {
    name: 'Solana',
    icon: '/assets/chains/solana.svg',
    color: '#9945FF'
  },
  bitcoin: {
    name: 'Bitcoin',
    icon: '/assets/chains/bitcoin.svg',
    color: '#F7931A'
  },
  cosmos: {
    name: 'Cosmos',
    icon: '/assets/chains/cosmos.svg',
    color: '#2E3148'
  },
  multi: {
    name: 'Multi-chain',
    icon: '/assets/chains/multi.svg',
    color: '#3B82F6'
  }
};

// Placeholder for wallet icons until actual SVGs are available
export const WalletIcon: React.FC<{ walletType: WalletType; size?: number }> = ({ walletType, size = 24 }) => {
  // This is a placeholder component that would normally load SVG icons
  // In a real implementation, you would import actual SVG files
  const colors: Record<WalletType, string> = {
    metamask: '#F6851B',
    phantom: '#AB9FF2',
    keplr: '#7C63F5',
    rabbi: '#FF5C00',
    trust: '#3375BB',
    ledger: '#000000',
    trezor: '#1A1A1A',
    lattice1: '#00A4FF',
    fireblocks: '#FF6B4A',
    anchorage: '#0052FF',
    coinbase_prime: '#0052FF',
    bitgo: '#0074C7'
  };
  
  return (
    <div 
      style={{ 
        width: size, 
        height: size, 
        backgroundColor: colors[walletType],
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: size / 2,
        fontWeight: 'bold'
      }}
    >
      {walletType.charAt(0).toUpperCase()}
    </div>
  );
};

// Chain icon component
export const ChainIcon: React.FC<{ chainType: ChainType; size?: number }> = ({ chainType, size = 24 }) => {
  return (
    <div 
      style={{ 
        width: size, 
        height: size, 
        backgroundColor: chainInfo[chainType].color,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: size / 2,
        fontWeight: 'bold'
      }}
    >
      {chainType.charAt(0).toUpperCase()}
    </div>
  );
};

// Get explorer URL for a wallet address
export const getExplorerUrl = (walletType: WalletType, chainType: ChainType, address: string): string | null => {
  const wallet = walletInfo[walletType];
  if (!wallet.explorerBaseUrl || !wallet.explorerBaseUrl[chainType]) {
    return null;
  }
  
  return `${wallet.explorerBaseUrl[chainType]}${address}`;
};
