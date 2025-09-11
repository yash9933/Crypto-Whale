require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const SolanaService = require('./solana-service');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Initialize Solana Service
const solanaService = new SolanaService();

const db = admin.firestore();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'CryptoWhale Backend is running' });
});

// Solana routes
app.post('/api/solana/generate-wallet', async (req, res) => {
  try {
    const wallet = solanaService.generateWallet();
    res.status(200).json(wallet);
  } catch (error) {
    console.error('Error generating wallet:', error);
    res.status(500).json({ error: 'Failed to generate wallet' });
  }
});

app.get('/api/solana/balance/:publicKey', async (req, res) => {
  try {
    const { publicKey } = req.params;
    const balance = await solanaService.getSolBalance(publicKey);
    res.status(200).json({ balance });
  } catch (error) {
    console.error('Error getting SOL balance:', error);
    res.status(500).json({ error: 'Failed to get SOL balance' });
  }
});

app.get('/api/solana/tokens/:publicKey', async (req, res) => {
  try {
    const { publicKey } = req.params;
    const tokens = await solanaService.getTokenBalances(publicKey);
    res.status(200).json(tokens);
  } catch (error) {
    console.error('Error getting token balances:', error);
    res.status(500).json({ error: 'Failed to get token balances' });
  }
});

app.post('/api/solana/transfer', async (req, res) => {
  try {
    const { secretKey, recipient, amount } = req.body;
    
    if (!secretKey || !recipient || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const signature = await solanaService.transferSol(secretKey, recipient, amount);
    res.status(200).json({ signature });
  } catch (error) {
    console.error('Error transferring SOL:', error);
    res.status(500).json({ error: 'Failed to transfer SOL' });
  }
});

app.post('/api/solana/sign', async (req, res) => {
  try {
    const { secretKey, message } = req.body;
    
    if (!secretKey || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const messageBuffer = Buffer.from(message);
    const signature = solanaService.signMessage(secretKey, messageBuffer);
    res.status(200).json({ signature });
  } catch (error) {
    console.error('Error signing message:', error);
    res.status(500).json({ error: 'Failed to sign message' });
  }
});

app.post('/api/solana/verify', async (req, res) => {
  try {
    const { publicKey, message, signature } = req.body;
    
    if (!publicKey || !message || !signature) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const messageBuffer = Buffer.from(message);
    const isValid = solanaService.verifySignature(publicKey, messageBuffer, signature);
    res.status(200).json({ isValid });
  } catch (error) {
    console.error('Error verifying signature:', error);
    res.status(500).json({ error: 'Failed to verify signature' });
  }
});

// User data operations
app.get('/api/users/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json(userDoc.data());
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Portfolio operations
app.get('/api/portfolios/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const portfolioDoc = await db.collection('portfolios').doc(userId).get();
    
    if (!portfolioDoc.exists) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    
    res.status(200).json(portfolioDoc.data());
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Transaction operations
app.get('/api/transactions/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const transactionsSnapshot = await db.collection('transactions')
      .where('userId', '==', userId)
      .orderBy('initiatedAt', 'desc')
      .limit(10)
      .get();
    
    const transactions = [];
    transactionsSnapshot.forEach(doc => {
      transactions.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new transaction
app.post('/api/transactions', async (req, res) => {
  try {
    const { userId, from, to, amountUSD } = req.body;
    
    if (!userId || !from || !to || !amountUSD) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const transactionData = {
      userId,
      from,
      to,
      amountUSD,
      status: 'pending',
      txHash: null,
      initiatedAt: admin.firestore.FieldValue.serverTimestamp(),
      completedAt: null
    };
    
    const transactionRef = db.collection('transactions').doc();
    await transactionRef.set(transactionData);
    
    res.status(201).json({ 
      id: transactionRef.id,
      ...transactionData,
      initiatedAt: new Date() // Convert server timestamp to Date for response
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update transaction status
app.patch('/api/transactions/:transactionId', async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { status, txHash } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    
    const updateData = { status };
    
    if (status === 'completed') {
      updateData.completedAt = admin.firestore.FieldValue.serverTimestamp();
    }
    
    if (txHash) {
      updateData.txHash = txHash;
    }
    
    await db.collection('transactions').doc(transactionId).update(updateData);
    
    res.status(200).json({ id: transactionId, ...updateData });
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
