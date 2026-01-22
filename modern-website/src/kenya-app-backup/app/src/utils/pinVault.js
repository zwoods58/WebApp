import CryptoJS from 'crypto-js';
import { authenticator } from 'otplib';

/**
 * PIN + Local OTP Security System for BeeZee Finance
 * Implements "Software Vault" architecture for informal sector
 */

export class PinVault {
  constructor() {
    this.baseStorageKey = 'beezee_vault_data';
    this.commonPins = ['1234', '0000', '1111', '8888'];
    this.maxAttempts = 7;
    this.wipeDelay = 30000; // 30 seconds
  }

  /**
   * Get user-specific storage key
   */
  getUserStorageKey(userId = null) {
    return userId ? `${this.baseStorageKey}_${userId}` : this.baseStorageKey;
  }

  /**
   * Generate a random salt for encryption
   */
  generateSalt() {
    return CryptoJS.lib.WordArray.random(128 / 8).toString();
  }

  /**
   * Derive encryption key from PIN using PBKDF2
   */
  deriveKey(pin, salt) {
    return CryptoJS.PBKDF2(pin, salt, {
      keySize: 256 / 32,
      iterations: 10000
    });
  }

  /**
   * Encrypt secret key with PIN-derived key
   */
  encryptSecret(secretKey, pin, userId = null) {
    try {
      const salt = this.generateSalt();
      const storageKey = this.getUserStorageKey(userId);

      // Generate encryption key from PIN and salt
      const key = CryptoJS.PBKDF2(pin, salt, {
        keySize: 256 / 32,
        iterations: 10000
      });

      // Encrypt the secret key
      const encrypted = CryptoJS.AES.encrypt(secretKey, key.toString()).toString();

      const vaultData = {
        encrypted,
        salt,
        attempts: 0,
        lastAttempt: null,
        createdAt: Date.now()
      };

      localStorage.setItem(storageKey, JSON.stringify(vaultData));
      return { success: true, salt, encrypted };

    } catch (error) {
      console.error('Error encrypting secret:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Decrypt secret key using PIN
   */
  decryptSecret(pin, userId = null) {
    try {
      const vaultData = this.getVaultData(userId);
      if (!vaultData) {
        return { success: false, error: 'No security data found' };
      }

      // Check if we're in lockout period
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

      // Check if we've exceeded max attempts
      if (vaultData.attempts >= this.maxAttempts) {
        this.wipeVault(userId);
        return {
          success: false,
          error: 'Too many failed attempts. Security data has been reset for your protection.',
          wiped: true
        };
      }

      // Generate decryption key from PIN and stored salt
      const key = CryptoJS.PBKDF2(pin, vaultData.salt, {
        keySize: 256 / 32,
        iterations: 10000
      });

      // Decrypt the secret key
      // Decrypt the secret key - Key must be stringified if it was stringified during encryption (treated as passphrase)
      const decrypted = CryptoJS.AES.decrypt(vaultData.encrypted, key.toString()).toString(CryptoJS.enc.Utf8);

      if (!decrypted) {
        // Increment failed attempts
        vaultData.attempts++;
        vaultData.lastAttempt = Date.now();
        const storageKey = this.getUserStorageKey(userId);
        localStorage.setItem(storageKey, JSON.stringify(vaultData));

        const remainingAttempts = this.maxAttempts - vaultData.attempts;
        return {
          success: false,
          error: `Incorrect Security PIN. ${remainingAttempts} attempts remaining before security reset.`,
          attempts: vaultData.attempts,
          remainingAttempts
        };
      }

      // Success - reset attempts counter
      vaultData.attempts = 0;
      vaultData.lastAttempt = null;
      const storageKey = this.getUserStorageKey(userId);
      localStorage.setItem(storageKey, JSON.stringify(vaultData));

      return { success: true, secretKey: decrypted };
    } catch (error) {
      console.error('Error decrypting secret:', error);
      return { success: false, error: 'Failed to access your account' };
    }
  }

  /**
   * Get vault data from localStorage
   */
  getVaultData(userId = null) {
    try {
      const storageKey = this.getUserStorageKey(userId);
      const data = localStorage.getItem(storageKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading vault data:', error);
      return null;
    }
  }

  /**
   * Generate TOTP from secret key
   */
  generateOTP(secretKey) {
    try {
      return authenticator.generate(secretKey);
    } catch (error) {
      console.error('Error generating OTP:', error);
      return null;
    }
  }

  /**
   * Validate PIN strength
   */
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

  /**
   * Simple PIN strength assessment
   */
  getPINStrength(pin) {
    // Check for sequential numbers
    const isSequential = pin === '0123' || pin === '1234' || pin === '2345' ||
      pin === '3456' || pin === '4567' || pin === '5678' ||
      pin === '6789' || pin === '7890' || pin === '8901' ||
      pin === '9012';

    // Check for repeated numbers
    const isRepeated = pin[0] === pin[1] && pin[1] === pin[2] && pin[2] === pin[3];

    if (isSequential || isRepeated) {
      return 'Too Weak';
    }

    return 'Good';
  }

  /**
   * Wipe vault data after too many failed attempts
   */
  wipeVault(userId = null) {
    const storageKey = this.getUserStorageKey(userId);
    localStorage.removeItem(storageKey);
    console.log('Vault data wiped due to too many failed attempts');
  }

  /**
   * Check if vault exists
   */
  hasVault() {
    return this.getVaultData() !== null;
  }

  /**
   * Request persistent storage
   */
  async requestPersistentStorage() {
    if (navigator.storage && navigator.storage.persist) {
      try {
        const isPersisted = await navigator.storage.persist();
        console.log(`Persistent storage granted: ${isPersisted}`);
        return isPersisted;
      } catch (error) {
        console.error('Error requesting persistent storage:', error);
        return false;
      }
    }
    return false;
  }

  /**
   * Detect problematic browsers
   */
  detectBrowserSupport() {
    const userAgent = navigator.userAgent.toLowerCase();

    // Detect Opera Mini
    if (userAgent.includes('opera mini')) {
      return {
        supported: false,
        message: 'Security features are not supported on Opera Mini. Please open in Google Chrome to continue.',
        browser: 'opera-mini'
      };
    }

    // Detect other problematic browsers
    if (userAgent.includes('ucbrowser') || userAgent.includes('uc browser')) {
      return {
        supported: false,
        message: 'This browser may not work properly with security features. Please use Google Chrome.',
        browser: 'uc-browser'
      };
    }

    return { supported: true };
  }

  /**
   * Verify remote PIN and restore vault if successful
   */
  async verifyRemotePin(pin, encryptedData, salt, userId = null) {
    try {
      // 1. Derive key from entered PIN and remote salt
      const key = CryptoJS.PBKDF2(pin, salt, {
        keySize: 256 / 32,
        iterations: 10000
      });

      // 2. Attempt to decrypt the remote secret
      const decrypted = CryptoJS.AES.decrypt(encryptedData, key.toString()).toString(CryptoJS.enc.Utf8);

      // 3. If decryption succeeds (we get a string), the PIN is correct
      if (decrypted) {
        // Restore/Create local vault
        this.restoreVault(decrypted, pin, salt, encryptedData, userId);
        return { success: true, secretKey: decrypted };
      }

      return { success: false, error: 'Incorrect PIN' };
    } catch (error) {
      console.error('Remote verification error:', error);
      return { success: false, error: 'Failed to verify PIN' };
    }
  }

  /**
   * Restore vault from verified data
   */
  restoreVault(secretKey, pin, salt, encrypted, userId = null) {
    try {
      const storageKey = this.getUserStorageKey(userId);
      const vaultData = {
        encrypted,
        salt,
        attempts: 0,
        lastAttempt: null,
        createdAt: Date.now()
      };

      localStorage.setItem(storageKey, JSON.stringify(vaultData));
      return true;
    } catch (error) {
      console.error('Vault restoration error:', error);
      return false;
    }
  }
}

// Create singleton instance
export const pinVault = new PinVault();
