/**
 * 2FA Setup API Route
 * P0 Feature 5: Enhanced Security - 2FA/MFA
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '../../../../src/lib/supabase'
import { generateTOTPSecret } from '../../../../ai_builder/lib/security/2fa'

export async function POST(request: NextRequest) {
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

    const { secret, qrCodeUrl, backupCodes } = await generateTOTPSecret(user.id)

    return NextResponse.json({
      success: true,
      secret,
      qrCodeUrl,
      backupCodes
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to setup 2FA' },
      { status: 500 }
    )
  }
}





