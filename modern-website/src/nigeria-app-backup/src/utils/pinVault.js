import CryptoJS from 'crypto-js';
import { authenticator } from 'otplib';

/**
 * PIN + Local OTP Security System for BeeZee Finance
 * Implements "Software Vault" architecture for informal sector
 */

export class PinVault {
  constructor() {
    this.storageKey = 'beezee_vault_data';
    this.commonPins = ['1234', '0000', '1111', '8888'];
    this.maxAttempts = 7;
    this.wipeDelay = 30000; // 30 seconds
  }

  generateSalt() {
    return CryptoJS.lib.WordArray.random(128 / 8).toString();
  }

  deriveKey(pin, salt) {
    if (!pin || !salt) {
      console.error('Missing input for deriveKey:', { pin: !!pin, salt: !!salt });
      return null;
    }

    try {
      return CryptoJS.PBKDF2(pin.toString(), salt.toString(), {
        keySize: 256 / 32,
        iterations: 10000
      });
    } catch (error) {
      console.error('Error in deriveKey:', error);
      return null;
    }
  }

  encryptSecret(secretKey, pin) {
    try {
      console.log('Attempting to encrypt secret...');

      if (!secretKey) {
        throw new Error('Secret key is missing');
      }
      if (!pin || pin.toString().length !== 4) {
        throw new Error('Invalid PIN: Must be 4 digits');
      }

      const salt = this.generateSalt();
      const key = this.deriveKey(pin, salt);

      if (!key) {
        throw new Error('Failed to derive encryption key');
      }

      // Ensure inputs are strings and logs state for debugging
      const secretStr = typeof secretKey === 'string' ? secretKey : secretKey.toString();

      console.log('Encryption params:', {
        secretLength: secretStr.length,
        saltExists: !!salt,
        keyExists: !!key,
        keyWordsExists: !!key.words
      });

      const encrypted = CryptoJS.AES.encrypt(secretStr, key).toString();

      if (!encrypted) {
        throw new Error('Encryption resulted in empty output');
      }

      const vaultData = {
        encrypted,
        salt,
        attempts: 0,
        lastAttempt: null,
        createdAt: Date.now()
      };

      localStorage.setItem(this.storageKey, JSON.stringify(vaultData));
      console.log('Secret encrypted and stored successfully');
      return { success: true };
    } catch (error) {
      console.error('Error encrypting secret:', error);
      return { success: false, error: 'Security Setup Error: ' + (error.message || 'Unknown error') };
    }
  }

  decryptSecret(pin) {
    try {
      const vaultData = this.getVaultData();
      if (!vaultData) {
        return { success: false, error: 'No security data found' };
      }

      if (vaultData.lastAttempt && vaultData.attempts >= 3) {
        const timeSinceLastAttempt = Date.now() - vaultData.lastAttempt;
        if (timeSinceLastAttempt < this.wipeDelay) {
          const remainingTime = Math.ceil((this.wipeDelay - timeSinceLastAttempt) / 1000);
          return {
            success: false,
            error: `Please wait ${remainingTime} seconds before trying again`,
            lockout: true
          };
        }
      }

      if (vaultData.attempts >= this.maxAttempts) {
        this.wipeVault();
        return {
          success: false,
          error: 'Too many failed attempts. Security data has been reset for your protection.',
          wiped: true
        };
      }

      const key = this.deriveKey(pin, vaultData.salt);
      const decrypted = CryptoJS.AES.decrypt(vaultData.encrypted, key).toString(CryptoJS.enc.Utf8);

      if (!decrypted) {
        vaultData.attempts++;
        vaultData.lastAttempt = Date.now();
        localStorage.setItem(this.storageKey, JSON.stringify(vaultData));

        const remainingAttempts = this.maxAttempts - vaultData.attempts;
        return {
          success: false,
          error: `Incorrect Security PIN. ${remainingAttempts} attempts remaining before security reset.`,
          attempts: vaultData.attempts,
          remainingAttempts
        };
      }

      vaultData.attempts = 0;
      vaultData.lastAttempt = null;
      localStorage.setItem(this.storageKey, JSON.stringify(vaultData));

      return { success: true, secretKey: decrypted };
    } catch (error) {
      console.error('Error decrypting secret:', error);
      return { success: false, error: 'Failed to access your account' };
    }
  }

  getVaultData() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading vault data:', error);
      return null;
    }
  }

  generateOTP(secretKey) {
    try {
      return authenticator.generate(secretKey);
    } catch (error) {
      console.error('Error generating OTP:', error);
      return null;
    }
  }

  validatePIN(pin) {
    if (!pin || pin.length !== 4) {
      return { valid: false, message: 'PIN must be 4 digits' };
    }

    if (!/^\d{4}$/.test(pin)) {
      return { valid: false, message: 'PIN must contain only numbers' };
    }

    if (this.commonPins.includes(pin)) {
      return {
        valid: false,
        message: 'This PIN is too easy for others to guess. Please pick a harder one.'
      };
    }

    return { valid: true, strength: this.getPINStrength(pin) };
  }

  getPINStrength(pin) {
    const isSequential = pin === '0123' || pin === '1234' || pin === '2345' ||
      pin === '3456' || pin === '4567' || pin === '5678' ||
      pin === '6789' || pin === '7890' || pin === '8901' ||
      pin === '9012';

    const isRepeated = pin[0] === pin[1] && pin[1] === pin[2] && pin[2] === pin[3];

    if (isSequential || isRepeated) {
      return 'Too Weak';
    }

    return 'Good';
  }

  wipeVault() {
    localStorage.removeItem(this.storageKey);
    console.log('Vault data wiped due to too many failed attempts');
  }

  hasVault() {
    return this.getVaultData() !== null;
  }

  requestPersistentStorage() {
    if (navigator.storage && navigator.storage.persist) {
      try {
        navigator.storage.persist().then(isPersisted => {
          console.log(`Persistent storage granted: ${isPersisted}`);
        });
      } catch (error) {
        console.error('Error requesting persistent storage:', error);
      }
    }
  }

  detectBrowserSupport() {
    const userAgent = navigator.userAgent.toLowerCase();

    if (userAgent.includes('opera mini')) {
      return {
        supported: false,
        message: 'Security features are not supported on Opera Mini. Please open in Google Chrome to continue.',
        browser: 'opera-mini'
      };
    }

    if (userAgent.includes('ucbrowser') || userAgent.includes('uc browser')) {
      return {
        supported: false,
        message: 'This browser may not work properly with security features. Please use Google Chrome.',
        browser: 'uc-browser'
      };
    }

    return { supported: true };
  }
}

export const pinVault = new PinVault();
