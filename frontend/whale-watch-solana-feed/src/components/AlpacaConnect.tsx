import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';

export function AlpacaConnect() {
  const { currentUser, userProfile } = useAuth();
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    if (!apiKey || !apiSecret || !currentUser) return;

    try {
      setLoading(true);
      
      // In a production app, you would validate the API key and secret with Alpaca
      // For MVP purposes, we'll simulate a successful connection
      
      // Store the connection status in Firestore
      // Note: In a real app, you would NOT store API keys in Firestore directly
      // Instead, you would store them securely on your backend or use a service like Firebase Functions
      await updateDoc(doc(db, 'users', currentUser.uid), {
        alpacaLinked: true,
        lastLogin: new Date()
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error connecting to Alpaca:', error);
      setLoading(false);
    }
  };

  if (userProfile?.alpacaLinked) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Alpaca Brokerage</CardTitle>
          <CardDescription>Your brokerage account is connected</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-green-700 font-medium">Successfully connected to Alpaca!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect Alpaca Brokerage</CardTitle>
        <CardDescription>Link your Alpaca account to view and trade TradFi assets</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="apiKey">API Key</Label>
          <Input
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Alpaca API key"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="apiSecret">API Secret</Label>
          <Input
            id="apiSecret"
            type="password"
            value={apiSecret}
            onChange={(e) => setApiSecret(e.target.value)}
            placeholder="Enter your Alpaca API secret"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleConnect} 
          disabled={!apiKey || !apiSecret || loading}
          className="w-full"
        >
          {loading ? 'Connecting...' : 'Connect Alpaca Account'}
        </Button>
      </CardFooter>
    </Card>
  );
}
