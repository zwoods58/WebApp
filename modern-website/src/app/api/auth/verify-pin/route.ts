import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: NextRequest) {
  try {
    const { phone, pin, businessId } = await request.json();

    if (!phone || (!pin && !businessId)) {
      return NextResponse.json(
        { error: { message: 'Missing required fields' } },
        { status: 400 }
      );
    }

    // Find business by phone number if businessId not provided
    let business;
    if (businessId) {
      const { data, error } = await supabaseAdmin
        .from('businesses')
        .select('*')
        .eq('id', businessId)
        .single();

      if (error || !data) {
        return NextResponse.json(
          { error: { message: 'Business not found' } },
          { status: 404 }
        );
      }
      business = data;
    } else {
      const { data, error } = await supabaseAdmin
        .from('businesses')
        .select('*')
        .eq('phone_number', phone)
        .single();

      if (error || !data) {
        return NextResponse.json(
          { error: { message: 'Business not found' } },
          { status: 404 }
        );
      }
      business = data;
    }

    // Check for account lockout
    if (business.pin_locked_until && business.pin_locked_until > Date.now()) {
      const lockoutRemaining = Math.ceil((business.pin_locked_until - Date.now()) / 1000);
      return NextResponse.json({
        error: {
          message: 'ACCOUNT_LOCKED',
          lockoutTime: lockoutRemaining,
          remainingAttempts: 0
        }
      });
    }

    // Verify PIN if provided
    if (business.pin_hash && pin) {
      const pinValid = await bcrypt.compare(pin, business.pin_hash);
      
      if (!pinValid) {
        // Increment failed attempts
        const newAttempts = (business.pin_attempts || 0) + 1;
        const lockoutTime = newAttempts >= 3 ? Date.now() + (30 * 60 * 1000) : null; // 30 minutes
        
        await supabaseAdmin
          .from('businesses')
          .update({
            pin_attempts: newAttempts,
            pin_locked_until: lockoutTime
          })
          .eq('id', business.id);

        if (newAttempts >= 3) {
          return NextResponse.json({
            error: {
              message: 'ACCOUNT_LOCKED',
              lockoutTime: 30 * 60, // 30 minutes in seconds
              remainingAttempts: 0
            }
          });
        }

        return NextResponse.json({
          error: {
            message: 'Invalid PIN. Please try again.',
            remainingAttempts: 3 - newAttempts
          }
        });
      }

      // Reset failed attempts on successful PIN verification
      await supabaseAdmin
        .from('businesses')
        .update({
          pin_attempts: 0,
          pin_locked_until: null
        })
        .eq('id', business.id);

      return NextResponse.json({
        error: null,
        data: {
          verified: true,
          business: business
        }
      });
    }

    return NextResponse.json({
      error: { message: 'PIN verification failed' }
    });

  } catch (error) {
    console.error('PIN verification error:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
