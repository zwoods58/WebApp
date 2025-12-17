/**
 * API Key Management
 * P0 Feature 5: Enhanced Security - API Key Management
 */

import { getSupabaseClient } from '../supabase/client-db'
import crypto from 'crypto'

export interface APIKey {
  id: string
  userId: string
  name: string
  keyPrefix: string
  keyHash: string
  permissions: string[]
  lastUsedAt?: Date
  expiresAt?: Date
  createdAt: Date
}

/**
 * Generate API key
 */
export async function generateAPIKey(
  userId: string,
  name: string,
  permissions: string[] = ['read:project', 'write:project'],
  expiresInDays?: number
): Promise<{ key: string; apiKey: APIKey }> {
  // Generate secure random key
  const key = `atw_${crypto.randomBytes(32).toString('hex')}`
  const keyHash = crypto.createHash('sha256').update(key).digest('hex')
  const keyPrefix = key.substring(0, 12) // Show first 12 chars for identification

  const expiresAt = expiresInDays
    ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
    : undefined

  const apiKey: APIKey = {
    id: crypto.randomUUID(),
    userId,
    name,
    keyPrefix,
    keyHash,
    permissions,
    expiresAt,
    createdAt: new Date()
  }

  // Store in database
  const supabase = getSupabaseClient()
  await supabase.from('api_keys').insert({
    id: apiKey.id,
    user_id: userId,
    name,
    key_prefix: keyPrefix,
    key_hash: keyHash,
    permissions,
    expires_at: expiresAt?.toISOString(),
    created_at: apiKey.createdAt.toISOString()
  })

  return { key, apiKey }
}

/**
 * Verify API key
 */
export async function verifyAPIKey(key: string): Promise<{
  valid: boolean
  userId?: string
  permissions?: string[]
  error?: string
}> {
  const keyHash = crypto.createHash('sha256').update(key).digest('hex')

  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('api_keys')
    .select('user_id, permissions, expires_at, revoked')
    .eq('key_hash', keyHash)
    .single()

  if (error || !data) {
    return { valid: false, error: 'Invalid API key' }
  }

  if (data.revoked) {
    return { valid: false, error: 'API key has been revoked' }
  }

  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return { valid: false, error: 'API key has expired' }
  }

  // Update last used timestamp
  await supabase
    .from('api_keys')
    .update({ last_used_at: new Date().toISOString() })
    .eq('key_hash', keyHash)

  return {
    valid: true,
    userId: data.user_id,
    permissions: data.permissions || []
  }
}

/**
 * Revoke API key
 */
export async function revokeAPIKey(keyId: string, userId: string): Promise<void> {
  const supabase = getSupabaseClient()
  await supabase
    .from('api_keys')
    .update({ revoked: true, revoked_at: new Date().toISOString() })
    .eq('id', keyId)
    .eq('user_id', userId)
}

/**
 * Get user's API keys
 */
export async function getUserAPIKeys(userId: string): Promise<APIKey[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('api_keys')
    .select('*')
    .eq('user_id', userId)
    .eq('revoked', false)
    .order('created_at', { ascending: false })

  if (error || !data) {
    return []
  }

  return data.map(key => ({
    id: key.id,
    userId: key.user_id,
    name: key.name,
    keyPrefix: key.key_prefix,
    keyHash: key.key_hash,
    permissions: key.permissions || [],
    lastUsedAt: key.last_used_at ? new Date(key.last_used_at) : undefined,
    expiresAt: key.expires_at ? new Date(key.expires_at) : undefined,
    createdAt: new Date(key.created_at)
  }))
}





