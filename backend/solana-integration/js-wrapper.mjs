// JavaScript wrapper for the Solana integration Rust library
import solanaIntegration from './pkg/solana_integration.js';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

class SolanaWalletManager {
  constructor(rpcUrl = 'https://api.devnet.solana.com') {
    this.rpcUrl = rpcUrl;
    this.connection = new Connection(rpcUrl);
    this.rustWallet = new solanaIntegration.SolanaWallet();
    this.publicKey = null;
  }

  /**
   * Generate a new Solana keypair
   * @returns {string} The public key of the generated keypair
   */
  generateKeypair() {
    try {
      const publicKey = this.rustWallet.generate_keypair();
      this.publicKey = new PublicKey(publicKey);
      return publicKey;
    } catch (error) {
      console.error('Error generating keypair:', error);
      throw error;
    }
  }

  /**
   * Import an existing keypair using a secret key
   * @param {string} secretKeyBase58 - The base58-encoded secret key
   * @returns {string} The public key of the imported keypair
   */
  importKeypair(secretKeyBase58) {
    try {
      const publicKey = this.rustWallet.import_keypair(secretKeyBase58);
      this.publicKey = new PublicKey(publicKey);
      return publicKey;
    } catch (error) {
      console.error('Error importing keypair:', error);
      throw error;
    }
  }

  /**
   * Import a public key for read-only operations
   * @param {string} publicKeyBase58 - The base58-encoded public key
   */
  importPublicKey(publicKeyBase58) {
    try {
      this.rustWallet.import_public_key(publicKeyBase58);
      this.publicKey = new PublicKey(publicKeyBase58);
    } catch (error) {
      console.error('Error importing public key:', error);
      throw error;
    }
  }

  /**
   * Get the current public key
   * @returns {string} The base58-encoded public key
   */
  getPublicKey() {
    try {
      return this.rustWallet.get_public_key();
    } catch (error) {
      console.error('Error getting public key:', error);
      throw error;
    }
  }

  /**
   * Sign a message using the wallet's keypair
   * @param {Uint8Array} message - The message to sign
   * @returns {string} The base58-encoded signature
   */
  signMessage(message) {
    try {
      return this.rustWallet.sign_message(message);
    } catch (error) {
      console.error('Error signing message:', error);
      throw error;
    }
  }

  /**
   * Verify a signature for a message
   * @param {Uint8Array} message - The original message
   * @param {string} signatureBase58 - The base58-encoded signature
   * @returns {boolean} Whether the signature is valid
   */
  verifySignature(message, signatureBase58) {
    try {
      return this.rustWallet.verify_signature(message, signatureBase58);
    } catch (error) {
      console.error('Error verifying signature:', error);
      throw error;
    }
  }

  /**
   * Export the keypair as a JSON string
   * @returns {string} JSON string containing the keypair
   */
  exportKeypair() {
    try {
      return this.rustWallet.export_keypair();
    } catch (error) {
      console.error('Error exporting keypair:', error);
      throw error;
    }
  }

  /**
   * Get the SOL balance for the current wallet
   * @returns {Promise<number>} The SOL balance
   */
  async getSolBalance() {
    try {
      if (!this.publicKey) {
        throw new Error('No public key available');
      }
      
      const balance = await this.connection.getBalance(this.publicKey);
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error('Error getting SOL balance:', error);
      throw error;
    }
  }

  /**
   * Transfer SOL to another wallet
   * @param {string} recipientPublicKey - The recipient's public key
   * @param {number} amount - The amount of SOL to transfer
   * @returns {Promise<string>} The transaction signature
   */
  async transferSol(recipientPublicKey, amount) {
    try {
      if (!this.publicKey) {
        throw new Error('No public key available');
      }
      
      // Create a transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: this.publicKey,
          toPubkey: new PublicKey(recipientPublicKey),
          lamports: amount * LAMPORTS_PER_SOL
        })
      );
      
      // Get the latest blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = this.publicKey;
      
      // Sign the transaction
      const serializedTransaction = transaction.serializeMessage();
      const signature = this.signMessage(serializedTransaction);
      
      // Send the transaction
      const txid = await this.connection.sendRawTransaction(
        transaction.serialize()
      );
      
      return txid;
    } catch (error) {
      console.error('Error transferring SOL:', error);
      throw error;
    }
  }
}

// Change module.exports to export default
export default SolanaWalletManager;