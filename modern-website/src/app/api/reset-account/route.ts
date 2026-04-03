import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { businessId } = await request.json();
    
    // Verify user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Verify the business belongs to the authenticated user
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('id, owner_id')
      .eq('id', businessId)
      .single();
    
    if (businessError || !business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }
    
    if (business.owner_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    // Delete all data for this business
    console.log('🔄 Resetting account data for business:', businessId);
    
    // Delete appointments
    await supabase.from('appointments').delete().eq('business_id', businessId);
    console.log('✅ Deleted appointments');
    
    // Delete inventory
    await supabase.from('inventory').delete().eq('business_id', businessId);
    console.log('✅ Deleted inventory');
    
    // Delete services
    await supabase.from('services').delete().eq('business_id', businessId);
    console.log('✅ Deleted services');
    
    // Delete credit records
    await supabase.from('credit').delete().eq('business_id', businessId);
    console.log('✅ Deleted credit records');
    
    // Delete transactions
    await supabase.from('transactions').delete().eq('business_id', businessId);
    console.log('✅ Deleted transactions');
    
    // Delete expenses
    await supabase.from('expenses').delete().eq('business_id', businessId);
    console.log('✅ Deleted expenses');
    
    // Delete customers
    await supabase.from('customers').delete().eq('business_id', businessId);
    console.log('✅ Deleted customers');
    
    // Reset business settings
    await supabase
      .from('businesses')
      .update({ 
        settings: { daily_target: 0 },
        updated_at: new Date().toISOString()
      })
      .eq('id', businessId);
    console.log('✅ Reset business settings');
    
    return NextResponse.json({ 
      success: true,
      message: 'Account has been reset successfully. All data cleared.'
    });
  } catch (error) {
    console.error('Reset failed:', error);
    return NextResponse.json({ 
      error: 'Reset failed',
      message: 'Failed to reset account. Please try again.'
    }, { status: 500 });
  }
}
