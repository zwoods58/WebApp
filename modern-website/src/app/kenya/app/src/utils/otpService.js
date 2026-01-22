import { supabase } from '../supabase';

/**
 * Custom OTP Service for BeeZee Finance
 */
class CustomOTPService {
  constructor() {
    this.otpStore = new Map(); // In-memory OTP storage
    this.otpExpiry = 5 * 60 * 1000; // 5 minutes in milliseconds
  }

  /**
   * Generate 6-digit OTP
   */
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Send OTP via SMS (using Twilio or similar)
   */
  async sendOTP(phoneNumber, countryCode) {
    try {
      const otp = this.generateOTP();
      const expiryTime = Date.now() + this.otpExpiry;

      // Store OTP with expiry
      this.otpStore.set(phoneNumber, {
        otp,
        expiryTime,
        attempts: 0,
        countryCode
      });

      // Log OTP clearly for testing
      console.log(`%c [OTP] Code for ${phoneNumber}: [${otp}] `, 'background: #22c55e; color: #ffffff; font-weight: bold; padding: 4px; border-radius: 4px;');

      // TODO: Integrate with SMS service (Twilio, Africa's Talking, etc.)
      // For now, we'll simulate SMS sending
      const message = `Your BeeZee Finance verification code is: ${otp}. Valid for 5 minutes.`;

      // Simulate SMS sending (replace with actual SMS service)
      console.log(`SMS would be sent to ${phoneNumber}: ${message}`);

      return {
        success: true,
        message: 'OTP sent successfully',
        otpForTesting: otp // Remove in production
      };
    } catch (error) {
      console.error('Error sending OTP:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Verify OTP
   */
  async verifyOTP(phoneNumber, enteredOTP) {
    try {
      const storedData = this.otpStore.get(phoneNumber);

      if (!storedData) {
        return {
          success: false,
          error: 'OTP not found. Please request a new one.'
        };
      }

      // Check if OTP has expired
      if (Date.now() > storedData.expiryTime) {
        this.otpStore.delete(phoneNumber);
        return {
          success: false,
          error: 'OTP has expired. Please request a new one.'
        };
      }

      // Check if too many attempts
      if (storedData.attempts >= 3) {
        this.otpStore.delete(phoneNumber);
        return {
          success: false,
          error: 'Too many failed attempts. Please request a new OTP.'
        };
      }

      // Verify OTP
      if (storedData.otp !== enteredOTP) {
        storedData.attempts++;
        return {
          success: false,
          error: `Invalid OTP. ${3 - storedData.attempts} attempts remaining.`
        };
      }

      // OTP is correct - clean up
      this.otpStore.delete(phoneNumber);

      return {
        success: true,
        message: 'OTP verified successfully'
      };
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Clean up expired OTPs
   */
  cleanupExpiredOTPs() {
    const now = Date.now();
    for (const [phone, data] of this.otpStore.entries()) {
      if (now > data.expiryTime) {
        this.otpStore.delete(phone);
      }
    }
  }
}

// Create singleton instance
const otpService = new CustomOTPService();

// Clean up expired OTPs every 5 minutes
setInterval(() => {
  otpService.cleanupExpiredOTPs();
}, 5 * 60 * 1000);

export default otpService;
