/**
 * API Keys Management API Route
 * P0 Feature 5: Enhanced Security - API Key Management
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '../../../../src/lib/supabase'
import { generateAPIKey, getUserAPIKeys, revokeAPIKey } from '../../../../ai_builder/lib/security/api-keys'

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    const authHeader = request.headers.get('authorization')

    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const apiKeys = await getUserAPIKeys(user.id)

    return NextResponse.json({
      success: true,
      apiKeys: apiKeys.map(key => ({
        id: key.id,
        name: key.name,
        keyPrefix: key.keyPrefix,
        permissions: key.permissions,
        lastUsedAt: key.lastUsedAt,
        expiresAt: key.expiresAt,
        createdAt: key.createdAt
      }))
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to get API keys' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    const authHeader = request.headers.get('authorization')
    const { name, permissions, expiresInDays } = await request.json()

    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!name) {
      return NextResponse.json({ error: 'API key name required' }, { status: 400 })
    }

    const { key, apiKey } = await generateAPIKey(
      user.id,
      name,
      permissions || ['read:project', 'write:project'],
      expiresInDays
    )

    return NextResponse.json({
      success: true,
      key, // Only returned once - store securely!
      apiKey: {
        id: apiKey.id,
        name: apiKey.name,
        keyPrefix: apiKey.keyPrefix,
        permissions: apiKey.permissions,
        expiresAt: apiKey.expiresAt,
        createdAt: apiKey.createdAt
      }
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create API key' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    const authHeader = request.headers.get('authorization')
    const { searchParams } = new URL(request.url)
    const keyId = searchParams.get('keyId')

    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!keyId) {
      return NextResponse.json({ error: 'API key ID required' }, { status: 400 })
    }

    await revokeAPIKey(keyId, user.id)

    return NextResponse.json({
      success: true,
      message: 'API key revoked successfully'
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to revoke API key' },
      { status: 500 }
    )
  }
}





