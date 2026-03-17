/**
 * Rate Limiting & Account Lockout
 * 
 * Prevents brute-force PIN guessing attacks.
 * Locks account for 30 minutes after 5 failed attempts.
 */

/**
 * Check if account is currently locked
 * 
 * @param supabase - Supabase client
 * @param phone - Phone number
 * @returns true if locked, false otherwise
 */
export async function isAccountLocked(
    supabase: any,
    phone: string
): Promise<boolean> {
    const { data: user } = await supabase
        .from('business_users')
        .select('locked_until')
        .eq('phone_number', phone)
        .single();

    if (!user || !user.locked_until) return false;

    const lockedUntil = new Date(user.locked_until);
    const now = new Date();

    return lockedUntil > now;
}

/**
 * Get minutes remaining for locked account
 * 
 * @param supabase - Supabase client
 * @param phone - Phone number
 * @returns Minutes remaining, or 0 if not locked
 */
export async function getLockedMinutesRemaining(
    supabase: any,
    phone: string
): Promise<number> {
    const { data: user } = await supabase
        .from('business_users')
        .select('locked_until')
        .eq('phone_number', phone)
        .single();

    if (!user || !user.locked_until) return 0;

    const lockedUntil = new Date(user.locked_until);
    const now = new Date();

    if (lockedUntil <= now) return 0;

    return Math.ceil((lockedUntil.getTime() - now.getTime()) / (60 * 1000));
}

/**
 * Record failed login attempt
 * 
 * Increments failed_attempts counter.
 * Locks account if attempts >= 5.
 * 
 * @param supabase - Supabase client
 * @param phone - Phone number
 * @returns true if account was locked by this attempt
 */
export async function recordFailedAttempt(
    supabase: any,
    phone: string
): Promise<boolean> {
    const { data: user } = await supabase
        .from('business_users')
        .select('id, failed_attempts')
        .eq('phone_number', phone)
        .single();

    if (!user) return false;

    const newAttempts = user.failed_attempts + 1;
    const shouldLock = newAttempts >= 5;

    await supabase
        .from('business_users')
        .update({
            failed_attempts: newAttempts,
            locked_until: shouldLock
                ? new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes
                : null
        })
        .eq('id', user.id);

    return shouldLock;
}

/**
 * Reset failed attempts (on successful login)
 * 
 * @param supabase - Supabase client
 * @param userId - User ID
 */
export async function resetFailedAttempts(
    supabase: any,
    userId: string
) {
    await supabase
        .from('business_users')
        .update({
            failed_attempts: 0,
            locked_until: null,
            last_login: new Date().toISOString()
        })
        .eq('id', userId);
}
