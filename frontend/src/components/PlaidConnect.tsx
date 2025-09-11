import { useState, useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import axios from 'axios';

export function PlaidConnect() {
  const { currentUser, userProfile } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Function to get a link token from your backend
  const getPlaidLinkToken = useCallback(async () => {
    try {
      setLoading(true);
      // In a real app, this would be an API call to your backend
      // For MVP, we'll simulate this
      // const response = await axios.post('/api/create-link-token');
      // setToken(response.data.link_token);
      
      // For demo purposes only - in production this would come from your backend
      setToken('link-sandbox-12345');
      setLoading(false);
    } catch (error) {
      console.error('Error getting Plaid link token:', error);
      setLoading(false);
    }
  }, []);

  const onSuccess = useCallback(async (publicToken: string) => {
    try {
      setLoading(true);
      // Exchange public token for access token (would be done on your backend)
      // const response = await axios.post('/api/exchange-public-token', { public_token: publicToken });
      
      // Update user profile to mark Plaid as linked
      if (currentUser) {
        await updateDoc(doc(db, 'users', currentUser.uid), {
          plaidLinked: true,
          lastLogin: new Date()
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error exchanging Plaid public token:', error);
      setLoading(false);
    }
  }, [currentUser]);

  const { open, ready } = usePlaidLink({
    token,
    onSuccess,
  });

  const handleClick = useCallback(() => {
    if (token) {
      open();
    } else {
      getPlaidLinkToken();
    }
  }, [token, open, getPlaidLinkToken]);

  if (userProfile?.plaidLinked) {
    return (
      <div className="p-4 border rounded-lg bg-green-50">
        <p className="text-green-700 font-medium">Your bank account is connected!</p>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-medium mb-2">Connect Your Bank Account</h3>
      <p className="text-sm text-gray-600 mb-4">
        Link your bank account to enable transfers between TradFi and DeFi assets.
      </p>
      <Button 
        onClick={handleClick} 
        disabled={!ready || loading}
        className="w-full"
      >
        {loading ? 'Connecting...' : 'Connect Bank Account'}
      </Button>
    </div>
  );
}
