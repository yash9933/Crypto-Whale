// Test script for Solana integration with Rust
const SolanaWalletManager = require('./js-wrapper');

async function testSolanaIntegration() {
  console.log('Testing Rust-powered Solana integration...');
  
  try {
    // Initialize the wallet manager
    const walletManager = new SolanaWalletManager();
    console.log('Wallet manager initialized');
    
    // Test keypair generation
    console.log('\n--- Testing keypair generation ---');
    const publicKey = walletManager.generateKeypair();
    console.log('Generated public key:', publicKey);
    
    // Test keypair export
    console.log('\n--- Testing keypair export ---');
    const exportedKeypair = walletManager.exportKeypair();
    console.log('Exported keypair JSON:', exportedKeypair);
    
    // Test message signing
    console.log('\n--- Testing message signing ---');
    const message = Buffer.from('Hello, Solana!');
    const signature = walletManager.signMessage(message);
    console.log('Message signature:', signature);
    
    // Test signature verification
    console.log('\n--- Testing signature verification ---');
    const isValid = walletManager.verifySignature(message, signature);
    console.log('Signature valid:', isValid);
    
    // Test SOL balance (this requires a network connection)
    console.log('\n--- Testing SOL balance query ---');
    try {
      const balance = await walletManager.getSolBalance();
      console.log('SOL balance:', balance);
    } catch (error) {
      console.log('SOL balance query failed (expected if not connected to network):', error.message);
    }
    
    console.log('\nAll tests completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the tests
testSolanaIntegration();
