/**
 * 2FA Verify API Route
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '../../../../src/lib/supabase'
import { verifyTOTPCode, verifyBackupCode } from '../../../../ai_builder/lib/security/2fa'

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    const authHeader = request.headers.get('authorization')
    const { code, isBackupCode } = await request.json()

    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!code) {
      return NextResponse.json({ error: 'Code required' }, { status: 400 })
    }

    const isValid = isBackupCode
      ? await verifyBackupCode(user.id, code)
      : await verifyTOTPCode(user.id, code)

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: '2FA verified successfully'
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to verify 2FA' },
      { status: 500 }
    )
  }
}





