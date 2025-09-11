use wasm_bindgen::prelude::*;
use ed25519_dalek::{Keypair, PublicKey, SecretKey, Signature, Signer, Verifier};
use rand::{RngCore, CryptoRng};
use serde::{Serialize, Deserialize};
use std::convert::TryFrom;

// JavaScript function to get random values
#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = crypto, js_name = getRandomValues)]
    fn get_random_values(array: &mut [u8]);
}

// Custom RNG that uses JavaScript's crypto.getRandomValues
struct JsRng;

// Mark JsRng as a cryptographically secure RNG
impl CryptoRng for JsRng {}

impl RngCore for JsRng {
    fn next_u32(&mut self) -> u32 {
        let mut buf = [0u8; 4];
        self.fill_bytes(&mut buf);
        u32::from_le_bytes(buf)
    }

    fn next_u64(&mut self) -> u64 {
        let mut buf = [0u8; 8];
        self.fill_bytes(&mut buf);
        u64::from_le_bytes(buf)
    }

    fn fill_bytes(&mut self, dest: &mut [u8]) {
        get_random_values(dest);
    }

    fn try_fill_bytes(&mut self, dest: &mut [u8]) -> Result<(), rand::Error> {
        self.fill_bytes(dest);
        Ok(())
    }
}

#[wasm_bindgen]
pub struct SolanaWallet {
    keypair: Option<Keypair>,
    public_key: Option<PublicKey>,
}

#[derive(Serialize, Deserialize)]
struct KeypairJson {
    public_key: String,
    secret_key: String,
}

#[wasm_bindgen]
impl SolanaWallet {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        SolanaWallet {
            keypair: None,
            public_key: None,
        }
    }

    pub fn generate_keypair(&mut self) -> Result<String, JsValue> {
        // Use our custom JsRng instead of OsRng
        let mut rng = JsRng;
        
        // Generate a keypair using our custom RNG
        let keypair = Keypair::generate(&mut rng);
        let public_key = keypair.public;
        let public_key_bs58 = bs58::encode(public_key.as_bytes()).into_string();
        
        self.keypair = Some(keypair);
        self.public_key = Some(public_key);
        
        Ok(public_key_bs58)
    }

    pub fn import_keypair(&mut self, secret_key_bs58: &str) -> Result<String, JsValue> {
        let secret_key_bytes = match bs58::decode(secret_key_bs58).into_vec() {
            Ok(bytes) => bytes,
            Err(e) => return Err(JsValue::from_str(&format!("Invalid secret key: {}", e))),
        };

        let secret_key = match SecretKey::from_bytes(&secret_key_bytes) {
            Ok(sk) => sk,
            Err(e) => return Err(JsValue::from_str(&format!("Invalid secret key: {}", e))),
        };

        let public_key = PublicKey::from(&secret_key);
        let keypair = Keypair {
            secret: secret_key,
            public: public_key,
        };

        let public_key_bs58 = bs58::encode(public_key.as_bytes()).into_string();
        self.keypair = Some(keypair);
        self.public_key = Some(public_key);
        Ok(public_key_bs58)
    }

    pub fn import_public_key(&mut self, public_key_bs58: &str) -> Result<(), JsValue> {
        let public_key_bytes = match bs58::decode(public_key_bs58).into_vec() {
            Ok(bytes) => bytes,
            Err(e) => return Err(JsValue::from_str(&format!("Invalid public key: {}", e))),
        };

        let public_key = match PublicKey::from_bytes(&public_key_bytes) {
            Ok(pk) => pk,
            Err(e) => return Err(JsValue::from_str(&format!("Invalid public key: {}", e))),
        };

        self.keypair = None;
        self.public_key = Some(public_key);
        Ok(())
    }

    pub fn get_public_key(&self) -> Result<String, JsValue> {
        match &self.public_key {
            Some(pk) => Ok(bs58::encode(pk.as_bytes()).into_string()),
            None => Err(JsValue::from_str("No public key available")),
        }
    }

    pub fn sign_message(&self, message: &[u8]) -> Result<String, JsValue> {
        let keypair = match &self.keypair {
            Some(kp) => kp,
            None => return Err(JsValue::from_str("No keypair available for signing")),
        };

        let signature = keypair.sign(message);
        Ok(bs58::encode(signature.to_bytes()).into_string())
    }

    pub fn verify_signature(&self, message: &[u8], signature_bs58: &str) -> Result<bool, JsValue> {
        let public_key = match &self.public_key {
            Some(pk) => pk,
            None => return Err(JsValue::from_str("No public key available for verification")),
        };

        let signature_bytes = match bs58::decode(signature_bs58).into_vec() {
            Ok(bytes) => bytes,
            Err(e) => return Err(JsValue::from_str(&format!("Invalid signature: {}", e))),
        };

        let signature = match Signature::try_from(signature_bytes.as_slice()) {
            Ok(sig) => sig,
            Err(e) => return Err(JsValue::from_str(&format!("Invalid signature: {}", e))),
        };

        Ok(public_key.verify(message, &signature).is_ok())
    }

    pub fn export_keypair(&self) -> Result<String, JsValue> {
        let keypair = match &self.keypair {
            Some(kp) => kp,
            None => return Err(JsValue::from_str("No keypair available for export")),
        };

        let keypair_json = KeypairJson {
            public_key: bs58::encode(keypair.public.as_bytes()).into_string(),
            secret_key: bs58::encode(keypair.secret.as_bytes()).into_string(),
        };

        match serde_json::to_string(&keypair_json) {
            Ok(json) => Ok(json),
            Err(e) => Err(JsValue::from_str(&format!("Error exporting keypair: {}", e))),
        }
    }
}

pub fn add(left: u64, right: u64) -> u64 {
    left + right
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        let result = add(2, 2);
        assert_eq!(result, 4);
    }
}
