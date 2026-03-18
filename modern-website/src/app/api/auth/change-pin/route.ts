import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: NextRequest) {
  try {
    const { businessId, currentPin, newPin } = await request.json();

    if (!businessId || !currentPin || !newPin) {
      return NextResponse.json(
        { error: { message: 'Business ID, current PIN, and new PIN are required' } },
        { status: 400 }
      );
    }

    // Validate new PIN format (should be 6 digits)
    if (!/^\d{6}$/.test(newPin)) {
      return NextResponse.json(
        { error: { message: 'New PIN must be exactly 6 digits' } },
        { status: 400 }
      );
    }

    // Get current business data
    const { data: business, error: fetchError } = await supabaseAdmin
      .from('businesses')
      .select('pin_hash')
      .eq('id', businessId)
      .single();

    if (fetchError || !business) {
      return NextResponse.json(
        { error: { message: 'Business not found' } },
        { status: 404 }
      );
    }

    // Verify current PIN
    if (!business.pin_hash) {
      return NextResponse.json(
        { error: { message: 'No PIN is currently set for this business' } },
        { status: 400 }
      );
    }

    const currentPinValid = await bcrypt.compare(currentPin, business.pin_hash);
    
    if (!currentPinValid) {
      return NextResponse.json(
        { error: { message: 'Current PIN is incorrect' } },
        { status: 400 }
      );
    }

    // Hash new PIN
    const saltRounds = 12;
    const newPinHash = await bcrypt.hash(newPin, saltRounds);

    // Update business with new PIN hash
    const { data, error } = await supabaseAdmin
      .from('businesses')
      .update({
        pin_hash: newPinHash,
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
        { error: { message: 'Failed to change PIN: ' + error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({
      error: null,
      data: data
    });

  } catch (error) {
    console.error('PIN change error:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
