import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useWallet } from '@solana/wallet-adapter-react';
import axios from 'axios';

const API_URL = 'http://localhost:3001';

interface TokenBalance {
  mint: string;
  amount: string;
  decimals: number;
  uiAmount: number;
  symbol: string;
}

export const SolanaWalletManager: React.FC = () => {
  const { currentUser } = useAuth();
  const { publicKey, connected } = useWallet();
  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [signature, setSignature] = useState('');
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [transferResult, setTransferResult] = useState('');

  // Fetch SOL balance when wallet is connected
  useEffect(() => {
    if (connected && publicKey) {
      fetchSolBalance();
      fetchTokenBalances();
    }
  }, [connected, publicKey]);

  const fetchSolBalance = async () => {
    if (!publicKey) return;
    
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/solana/balance/${publicKey.toString()}`);
      setSolBalance(response.data.balance);
    } catch (error) {
      console.error('Error fetching SOL balance:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTokenBalances = async () => {
    if (!publicKey) return;
    
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/solana/tokens/${publicKey.toString()}`);
      setTokenBalances(response.data);
    } catch (error) {
      console.error('Error fetching token balances:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignMessage = async () => {
    if (!publicKey || !message) return;
    
    try {
      setLoading(true);
      // For demo purposes, we're using a dummy secret key
      // In a real app, this would be securely stored and never exposed to the frontend
      const dummySecretKey = "5MaiiCavjCmn9Hs1o3eznqDEhRwxo7pXiAYez7keQUviUkauRiTMD8DrESdrNjN8zd9mTmVhRvBJeg5vhyvgrAhG";
      
      const response = await axios.post(`${API_URL}/api/solana/sign`, {
        secretKey: dummySecretKey,
        message
      });
      
      setSignature(response.data.signature);
    } catch (error) {
      console.error('Error signing message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySignature = async () => {
    if (!publicKey || !message || !signature) return;
    
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/api/solana/verify`, {
        publicKey: publicKey.toString(),
        message,
        signature
      });
      
      setVerificationResult(response.data.isValid);
    } catch (error) {
      console.error('Error verifying signature:', error);
      setVerificationResult(false);
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async () => {
    if (!publicKey || !recipient || !amount) return;
    
    try {
      setLoading(true);
      // For demo purposes, we're using a dummy secret key
      // In a real app, this would be securely stored and never exposed to the frontend
      const dummySecretKey = "5MaiiCavjCmn9Hs1o3eznqDEhRwxo7pXiAYez7keQUviUkauRiTMD8DrESdrNjN8zd9mTmVhRvBJeg5vhyvgrAhG";
      
      const response = await axios.post(`${API_URL}/api/solana/transfer`, {
        secretKey: dummySecretKey,
        recipient,
        amount: parseFloat(amount)
      });
      
      setTransferResult(`Transaction successful! Signature: ${response.data.signature}`);
      
      // Refresh balances
      fetchSolBalance();
    } catch (error) {
      console.error('Error transferring SOL:', error);
      setTransferResult('Transaction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!connected) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Solana Wallet Manager</h2>
        <p className="text-gray-600">Please connect your wallet to use this feature.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Solana Wallet Manager (Rust-Powered)</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Wallet Information</h3>
        <p className="text-sm text-gray-600 mb-1">
          <span className="font-medium">Address:</span> {publicKey?.toString()}
        </p>
        <p className="text-sm text-gray-600 mb-1">
          <span className="font-medium">SOL Balance:</span> {solBalance !== null ? `${solBalance} SOL` : 'Loading...'}
        </p>
        <button 
          onClick={fetchSolBalance}
          className="mt-2 bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm"
          disabled={loading}
        >
          Refresh Balance
        </button>
      </div>
      
      {tokenBalances.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Token Balances</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left">Symbol</th>
                  <th className="py-2 px-4 border-b text-right">Balance</th>
                </tr>
              </thead>
              <tbody>
                {tokenBalances.map((token, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border-b">{token.symbol}</td>
                    <td className="py-2 px-4 border-b text-right">{token.uiAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Transfer SOL</h3>
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Address</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter recipient address"
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount (SOL)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter amount"
            step="0.001"
            min="0"
          />
        </div>
        <button
          onClick={handleTransfer}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
          disabled={loading || !recipient || !amount}
        >
          {loading ? 'Processing...' : 'Send SOL'}
        </button>
        {transferResult && (
          <p className={`mt-2 text-sm ${transferResult.includes('failed') ? 'text-red-500' : 'text-green-500'}`}>
            {transferResult}
          </p>
        )}
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Rust-Powered Cryptography</h3>
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter a message to sign"
          />
        </div>
        <button
          onClick={handleSignMessage}
          className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded mr-2"
          disabled={loading || !message}
        >
          {loading ? 'Signing...' : 'Sign Message'}
        </button>
        {signature && (
          <div className="mt-2">
            <p className="text-sm font-medium">Signature:</p>
            <p className="text-xs text-gray-600 break-all bg-gray-100 p-2 rounded">{signature}</p>
            <button
              onClick={handleVerifySignature}
              className="mt-2 bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm"
              disabled={loading}
            >
              Verify Signature
            </button>
            {verificationResult !== null && (
              <p className={`mt-1 text-sm ${verificationResult ? 'text-green-500' : 'text-red-500'}`}>
                {verificationResult ? 'Signature verified successfully!' : 'Invalid signature!'}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
