// Solana service using our Rust integration
const SolanaWalletManager = require('../solana-integration/js-wrapper-compat.js');
const { Connection, PublicKey, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const { Token, TOKEN_PROGRAM_ID } = require('@solana/spl-token');

class SolanaService {
  constructor(rpcUrl = 'https://api.devnet.solana.com') {
    this.walletManager = new SolanaWalletManager(rpcUrl);
    this.connection = new Connection(rpcUrl);
  }

  /**
   * Generate a new wallet
   * @returns {Object} The wallet information
   */
  generateWallet() {
    const publicKey = this.walletManager.generateKeypair();
    const keypairJson = this.walletManager.exportKeypair();
    return {
      publicKey,
      keypairJson
    };
  }

  /**
   * Import a wallet from a secret key
   * @param {string} secretKey - The base58-encoded secret key
   * @returns {string} The public key
   */
  importWallet(secretKey) {
    return this.walletManager.importKeypair(secretKey);
  }

  /**
   * Get the SOL balance for a wallet
   * @param {string} publicKey - The wallet's public key
   * @returns {Promise<number>} The SOL balance
   */
  async getSolBalance(publicKey) {
    this.walletManager.importPublicKey(publicKey);
    return await this.walletManager.getSolBalance();
  }

  /**
   * Get token balances for a wallet
   * @param {string} publicKey - The wallet's public key
   * @returns {Promise<Array>} Array of token balances
   */
  async getTokenBalances(publicKey) {
    try {
      const pubKey = new PublicKey(publicKey);
      const tokenAccounts = await this.connection.getParsedTokenAccountsByOwner(
        pubKey,
        { programId: TOKEN_PROGRAM_ID }
      );

      return tokenAccounts.value.map(accountInfo => {
        const accountData = accountInfo.account.data.parsed.info;
        const mintAddress = accountData.mint;
        const tokenBalance = {
          mint: mintAddress,
          amount: accountData.tokenAmount.amount,
          decimals: accountData.tokenAmount.decimals,
          uiAmount: accountData.tokenAmount.uiAmount,
          symbol: this.getTokenSymbol(mintAddress)
        };
        return tokenBalance;
      });
    } catch (error) {
      console.error('Error fetching token balances:', error);
      return [];
    }
  }

  /**
   * Get a token symbol from its mint address
   * @param {string} mintAddress - The token's mint address
   * @returns {string} The token symbol
   */
  getTokenSymbol(mintAddress) {
    // This would typically use a token registry
    // For now, we'll use a simple mapping for common tokens
    const tokenMap = {
      'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': 'USDC',
      'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB': 'USDT',
      'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So': 'mSOL'
    };
    
    return tokenMap[mintAddress] || 'Unknown';
  }

  /**
   * Transfer SOL from one wallet to another
   * @param {string} secretKey - The sender's secret key
   * @param {string} recipientPublicKey - The recipient's public key
   * @param {number} amount - The amount of SOL to transfer
   * @returns {Promise<string>} The transaction signature
   */
  async transferSol(secretKey, recipientPublicKey, amount) {
    this.walletManager.importKeypair(secretKey);
    return await this.walletManager.transferSol(recipientPublicKey, amount);
  }

  /**
   * Sign a message using the Rust implementation
   * @param {string} secretKey - The signer's secret key
   * @param {Uint8Array} message - The message to sign
   * @returns {string} The signature
   */
  signMessage(secretKey, message) {
    this.walletManager.importKeypair(secretKey);
    return this.walletManager.signMessage(message);
  }

  /**
   * Verify a signature using the Rust implementation
   * @param {string} publicKey - The signer's public key
   * @param {Uint8Array} message - The original message
   * @param {string} signature - The signature to verify
   * @returns {boolean} Whether the signature is valid
   */
  verifySignature(publicKey, message, signature) {
    this.walletManager.importPublicKey(publicKey);
    return this.walletManager.verifySignature(message, signature);
  }
}

module.exports = SolanaService;
