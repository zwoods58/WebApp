/**
 * Argon2id PIN Hashing & Security Functions
 * 
 * CRITICAL: These parameters are optimized for Supabase Edge Functions (Deno runtime).
 * Target execution time: 300-500ms (the "Goldilocks Zone")
 * 
 * DO NOT CHANGE without performance testing.
 */

import * as bcrypt from "https://esm.sh/bcryptjs@2.4.3";

// ═══════════════════════════════════════════════════════════════
// ARGON2ID CONFIGURATION
// Optimized for Deno Edge Functions (V8 isolates)
// ═══════════════════════════════════════════════════════════════

const BCRYPT_SALT_ROUNDS = 10;

/**
 * Hash a PIN using Argon2id
 * 
 * Expected execution time: 300-500ms on Deno Edge
 * 
 * Why Argon2id?
 * - Won the Password Hashing Competition (2015)
 * - Resistant to GPU/ASIC cracking (unlike bcrypt)
 * - OWASP recommended for password storage
 * - Hybrid mode: resistant to both side-channel and time-memory trade-off attacks
 * 
 * @param pin - 6-digit numeric PIN
 * @returns Argon2id hash string (e.g., "$argon2id$v=19$m=12288,t=2,p=1$...")
 */
export async function hashPin(pin: string): Promise<string> {
    try {
        const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
        return await bcrypt.hash(pin, salt);
    } catch (error) {
        console.error('PIN hashing failed:', error);
        throw new Error('Failed to hash PIN');
    }
}

/**
 * Verify a PIN against its Argon2id hash
 * 
 * Uses constant-time comparison to prevent timing attacks.
 * 
 * @param storedHash - Stored Argon2id hash from database
 * @param providedPin - User-provided PIN to verify
 * @returns true if PIN matches, false otherwise
 */
export async function verifyPin(storedHash: string, providedPin: string): Promise<boolean> {
    try {
        return await bcrypt.compare(providedPin, storedHash);
    } catch (error) {
        console.error('PIN verification failed:', error);
        return false;
    }
}

/**
 * Hash any secret using SHA-256
 * 
 * Used for: refresh tokens, security answers
 * NOT used for PINs (those use Argon2id)
 * 
 * @param secret - String to hash
 * @returns SHA-256 hex string (64 characters)
 */
export async function hashSecret(secret: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(secret);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Normalize security answer (business name) for consistent hashing
 * 
 * Algorithm: lowercase + alphanumeric only
 * Example: "John's Shop!" → "johnsshop"
 * 
 * Why: Users forget punctuation and spacing, but rarely the core name.
 * 
 * @param answer - Raw security answer
 * @returns Normalized string
 */
export function normalizeSecurityAnswer(answer: string): string {
    return answer
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]/g, '');
}

/**
 * Hash a security answer with normalization
 * 
 * @param answer - Raw security answer (e.g., business name)
 * @returns SHA-256 hash of normalized answer
 */
export async function hashSecurityAnswer(answer: string): Promise<string> {
    const normalized = normalizeSecurityAnswer(answer);
    return await hashSecret(normalized);
}

/**
 * Verify security answer against stored hash
 * 
 * @param storedHash - Stored SHA-256 hash
 * @param providedAnswer - User-provided answer
 * @returns true if matches, false otherwise
 */
export async function verifySecurityAnswer(storedHash: string, providedAnswer: string): Promise<boolean> {
    const providedHash = await hashSecurityAnswer(providedAnswer);
    return storedHash === providedHash;
}
