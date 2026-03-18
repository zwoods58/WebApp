import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: NextRequest) {
  try {
    const { businessId, pin } = await request.json();

    if (!businessId || !pin) {
      return NextResponse.json(
        { error: { message: 'Business ID and PIN are required' } },
        { status: 400 }
      );
    }

    // Validate PIN format (should be 6 digits)
    if (!/^\d{6}$/.test(pin)) {
      return NextResponse.json(
        { error: { message: 'PIN must be exactly 6 digits' } },
        { status: 400 }
      );
    }

    // Hash the PIN
    const saltRounds = 12;
    const pinHash = await bcrypt.hash(pin, saltRounds);

    // Update business with PIN hash
    const { data, error } = await supabaseAdmin
      .from('businesses')
      .update({
        pin_hash: pinHash,
        pin_attempts: 0,
        pin_locked_until: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', businessId)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: { message: 'Failed to set PIN: ' + error.message } },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: { message: 'Business not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      error: null,
      data: data
    });

  } catch (error) {
    console.error('PIN setup error:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
