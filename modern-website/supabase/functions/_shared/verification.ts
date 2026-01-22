/**
 * Verification Code Generation & Validation
 * 
 * Handles 6-digit codes for SMS and Email verification.
 * Includes rate limiting and expiration.
 */

/**
 * Generate a random 6-digit numeric code
 */
export function generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Store verification code in database
 * 
 * @param supabase - Supabase client
 * @param phoneOrEmail - Phone number or email address
 * @param code - 6-digit code
 * @param purpose - 'signup', 'recovery', or 'email_verify'
 * @param expiryMinutes - Code validity duration (default 10 minutes)
 */
export async function storeVerificationCode(
    supabase: any,
    phoneOrEmail: string,
    code: string,
    purpose: 'signup' | 'recovery' | 'email_verify',
    expiryMinutes: number = 10
) {
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

    const { error } = await supabase
        .from('verification_codes')
        .insert({
            phone_or_email: phoneOrEmail,
            code,
            purpose,
            expires_at: expiresAt.toISOString(),
            used: false,
            attempts: 0
        });

    if (error) {
        console.error('Failed to store verification code:', error);
        throw new Error('Failed to store verification code');
    }
}

/**
 * Validate verification code
 * 
 * @param supabase - Supabase client
 * @param phoneOrEmail - Phone number or email address
 * @param code - User-provided code
 * @param purpose - Expected purpose
 * @returns true if valid, false otherwise
 */
export async function validateVerificationCode(
    supabase: any,
    phoneOrEmail: string,
    code: string,
    purpose: 'signup' | 'recovery' | 'email_verify'
): Promise<boolean> {
    // 1. Find code
    const { data: verification, error } = await supabase
        .from('verification_codes')
        .select('*')
        .eq('phone_or_email', phoneOrEmail)
        .eq('purpose', purpose)
        .eq('used', false)
        .gte('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (error || !verification) {
        console.error('Verification code not found or expired');
        return false;
    }

    // 2. Check attempts (max 3)
    if (verification.attempts >= 3) {
        console.error('Too many verification attempts');
        return false;
    }

    // 3. Compare codes
    if (verification.code !== code) {
        // Increment attempts
        await supabase
            .from('verification_codes')
            .update({ attempts: verification.attempts + 1 })
            .eq('id', verification.id);

        return false;
    }

    // 4. Mark as used
    await supabase
        .from('verification_codes')
        .update({ used: true })
        .eq('id', verification.id);

    return true;
}

/**
 * Clean up expired verification codes (optional housekeeping)
 */
export async function cleanupExpiredCodes(supabase: any) {
    await supabase
        .from('verification_codes')
        .delete()
        .lt('expires_at', new Date().toISOString());
}
