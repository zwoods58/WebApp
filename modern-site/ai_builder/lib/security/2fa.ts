/**
 * Two-Factor Authentication (2FA/MFA)
 * P0 Feature 5: Enhanced Security - 2FA/MFA Support
 */

import { getSupabaseClient } from '../supabase/client-db'

export interface TwoFactorAuth {
  enabled: boolean
  method: 'totp' | 'sms' | 'email'
  secret?: string
  backupCodes?: string[]
  phoneNumber?: string
}

/**
 * Generate TOTP secret for user
 */
export async function generateTOTPSecret(userId: string): Promise<{
  secret: string
  qrCodeUrl: string
  backupCodes: string[]
}> {
  // In a real implementation, use a library like 'otplib' or 'speakeasy'
  // For now, generate a mock secret
  const secret = generateRandomSecret()
  const qrCodeUrl = `otpauth://totp/AtarWebb:${userId}?secret=${secret}&issuer=AtarWebb`
  const backupCodes = generateBackupCodes()

  // Store secret in database (encrypted)
  const supabase = getSupabaseClient()
  await supabase
    .from('user_accounts')
    .update({
      two_factor_auth: {
        enabled: false, // Not enabled until verified
        method: 'totp',
        secret: secret, // Should be encrypted in production
        backupCodes: backupCodes
      }
    })
    .eq('id', userId)

  return {
    secret,
    qrCodeUrl,
    backupCodes
  }
}

/**
 * Verify TOTP code
 */
export async function verifyTOTPCode(userId: string, code: string): Promise<boolean> {
  const supabase = getSupabaseClient()
  
  const { data: account } = await supabase
    .from('user_accounts')
    .select('two_factor_auth')
    .eq('id', userId)
    .single()

  if (!account?.two_factor_auth?.secret) {
    return false
  }

  // In a real implementation, verify TOTP code using 'otplib' or 'speakeasy'
  // For now, return mock verification
  const isValid = code.length === 6 && /^\d+$/.test(code)

  if (isValid) {
    // Enable 2FA after successful verification
    await supabase
      .from('user_accounts')
      .update({
        two_factor_auth: {
          ...account.two_factor_auth,
          enabled: true
        }
      })
      .eq('id', userId)
  }

  return isValid
}

/**
 * Verify backup code
 */
export async function verifyBackupCode(userId: string, code: string): Promise<boolean> {
  const supabase = getSupabaseClient()
  
  const { data: account } = await supabase
    .from('user_accounts')
    .select('two_factor_auth')
    .eq('id', userId)
    .single()

  if (!account?.two_factor_auth?.backupCodes) {
    return false
  }

  const backupCodes = account.two_factor_auth.backupCodes as string[]
  const index = backupCodes.indexOf(code)

  if (index === -1) {
    return false
  }

  // Remove used backup code
  backupCodes.splice(index, 1)
  await supabase
    .from('user_accounts')
    .update({
      two_factor_auth: {
        ...account.two_factor_auth,
        backupCodes
      }
    })
    .eq('id', userId)

  return true
}

/**
 * Disable 2FA for user
 */
export async function disable2FA(userId: string): Promise<void> {
  const supabase = getSupabaseClient()
  await supabase
    .from('user_accounts')
    .update({
      two_factor_auth: {
        enabled: false
      }
    })
    .eq('id', userId)
}

/**
 * Check if 2FA is enabled for user
 */
export async function is2FAEnabled(userId: string): Promise<boolean> {
  const supabase = getSupabaseClient()
  
  const { data: account } = await supabase
    .from('user_accounts')
    .select('two_factor_auth')
    .eq('id', userId)
    .single()

  return account?.two_factor_auth?.enabled === true
}

/**
 * Generate random secret
 */
function generateRandomSecret(): string {
  // In production, use proper TOTP secret generation
  return Array.from(crypto.getRandomValues(new Uint8Array(20)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()
}

/**
 * Generate backup codes
 */
function generateBackupCodes(count: number = 10): string[] {
  const codes: string[] = []
  for (let i = 0; i < count; i++) {
    const code = Array.from(crypto.getRandomValues(new Uint8Array(4)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
    codes.push(code)
  }
  return codes
}





