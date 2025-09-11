// Create an async initialization function
let solanaIntegrationPromise;

// This initializes the module
function initModule() {
  if (!solanaIntegrationPromise) {
    // Dynamic import works in CommonJS and can import ESM
    solanaIntegrationPromise = import('./js-wrapper.mjs');
  }
  return solanaIntegrationPromise;
}

// Create a wrapper class that proxies to the ESM module
class SolanaWalletManagerCompat {
  constructor(rpcUrl) {
    this.rpcUrl = rpcUrl;
    this.manager = null;
    this.initPromise = initModule().then(async (module) => {
      const SolanaWalletManager = module.default;
      this.manager = new SolanaWalletManager(rpcUrl);
    });
  }

  // Add proxy methods for each method in the original class
  async generateKeypair() {
    await this.initPromise;
    return this.manager.generateKeypair();
  }

  async importKeypair(secretKeyBase58) {
    await this.initPromise;
    return this.manager.importKeypair(secretKeyBase58);
  }

  async importPublicKey(publicKeyBase58) {
    await this.initPromise;
    return this.manager.importPublicKey(publicKeyBase58);
  }

  async getPublicKey() {
    await this.initPromise;
    return this.manager.getPublicKey();
  }

  async signMessage(message) {
    await this.initPromise;
    return this.manager.signMessage(message);
  }

  async verifySignature(message, signatureBase58) {
    await this.initPromise;
    return this.manager.verifySignature(message, signatureBase58);
  }

  async exportKeypair() {
    await this.initPromise;
    return this.manager.exportKeypair();
  }

  async getSolBalance() {
    await this.initPromise;
    return this.manager.getSolBalance();
  }

  async transferSol(recipientPublicKey, amount) {
    await this.initPromise;
    return this.manager.transferSol(recipientPublicKey, amount);
  }
}

// Export the compatibility wrapper
module.exports = SolanaWalletManagerCompat;