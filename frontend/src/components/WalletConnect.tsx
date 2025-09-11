import { useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Wallet } from '../types/database';

export function WalletConnect() {
  const { publicKey, connected } = useWallet();
  const { currentUser, userProfile } = useAuth();

  useEffect(() => {
    const saveWalletAddress = async () => {
      if (connected && publicKey && currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const wallets = userData.wallets || [];
          
          // Check if this wallet is already saved
          const walletExists = wallets.some(
            (wallet: Wallet) => wallet.type === 'solana' && wallet.address === publicKey.toString()
          );
          
          if (!walletExists) {
            // Add the wallet to the user's wallets array
            await updateDoc(userRef, {
              wallets: arrayUnion({
                type: 'solana',
                address: publicKey.toString()
              })
            });
          }
        }
      }
    };
    
    saveWalletAddress();
  }, [connected, publicKey, currentUser]);

  const connectedWallets = userProfile?.wallets?.filter(wallet => wallet.type === 'solana') || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect Crypto Wallet</CardTitle>
        <CardDescription>Link your Solana wallet to view and trade crypto assets</CardDescription>
      </CardHeader>
      <CardContent>
        {connectedWallets.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Connected Wallets:</h4>
            <ul className="space-y-1">
              {connectedWallets.map((wallet, index) => (
                <li key={index} className="text-sm text-gray-600">
                  {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="flex justify-center">
          <WalletMultiButton />
        </div>
      </CardContent>
    </Card>
  );
}
