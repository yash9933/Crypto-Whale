const { existsSync } = require('fs');
const path = require('path');

// Determine the path to the compiled WebAssembly module
const getWasmPath = () => {
  const developmentPath = path.join(__dirname, 'target', 'wasm32-unknown-unknown', 'debug', 'solana_integration.wasm');
  const productionPath = path.join(__dirname, 'target', 'wasm32-unknown-unknown', 'release', 'solana_integration.wasm');
  
  if (existsSync(productionPath)) {
    return productionPath;
  } else if (existsSync(developmentPath)) {
    return developmentPath;
  } else {
    throw new Error('Solana integration WASM module not found. Please build the project with `wasm-pack build`.');
  }
};

// Load the WebAssembly module
let wasmModule;
try {
  if (typeof window === 'undefined') {
    // Node.js environment
    const { readFileSync } = require('fs');
    const wasmBinary = readFileSync(getWasmPath());
    
    // Use Node.js WebAssembly API
    wasmModule = new WebAssembly.Module(wasmBinary);
    const wasmInstance = new WebAssembly.Instance(wasmModule, {
      env: {
        // Add any required environment functions here
      }
    });
    
    module.exports = wasmInstance.exports;
  } else {
    // Browser environment
    // This would be handled differently in a browser context
    // For browser usage, wasm-pack would generate appropriate JS bindings
    console.error('Browser environment detected. Please use wasm-pack generated bindings for browser usage.');
  }
} catch (error) {
  console.error('Failed to load Solana integration WASM module:', error);
  // Provide fallback or throw error as appropriate for your application
  throw error;
}

// Helper class to make the Rust functions more ergonomic to use from JS
class SolanaWalletJS {
  constructor(rpcUrl = 'https://api.devnet.solana.com') {
    this.wallet = new module.exports.SolanaWallet(rpcUrl);
  }
  
  connectWithPrivateKey(privateKey) {
    return this.wallet.connect_with_private_key(privateKey);
  }
  
  connectWithPublicKey(publicKey) {
    return this.wallet.connect_with_public_key(publicKey);
  }
  
  getSolBalance() {
    return this.wallet.get_sol_balance();
  }
  
  transferSol(recipient, amountSol) {
    return this.wallet.transfer_sol(recipient, amountSol);
  }
  
  getTokenBalance(mintAddress) {
    const jsonString = this.wallet.get_token_balance(mintAddress);
    return JSON.parse(jsonString);
  }
  
  transferToken(mintAddress, recipient, amount, decimals) {
    return this.wallet.transfer_token(mintAddress, recipient, amount, decimals);
  }
}

module.exports.SolanaWallet = SolanaWalletJS;
