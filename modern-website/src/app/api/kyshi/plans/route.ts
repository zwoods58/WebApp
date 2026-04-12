import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Get country from query parameter if provided
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country');
    
    // Query the kyshi_plans table directly
    let query = supabase
      .from('kyshi_plans')
      .select('*')
      .eq('is_active', true)
      .order('country_code', { ascending: true });
    
    // Filter by country if specified
    if (country) {
      query = query.eq('country_code', country.toUpperCase());
    }
    
    const { data: plans, error } = await query;
    
    if (error) {
      console.error('Database error fetching plans:', error);
      return NextResponse.json(
        {
          success: false,
          message: `Database error: ${error.message}`,
          plans: [],
        },
        { status: 500 }
      );
    }
    
    // Transform the data to match the expected frontend format
    const transformedPlans = (plans || []).map(plan => ({
      id: plan.id,
      name: plan.name,
      description: `${plan.name} - ${plan.interval} subscription`,
      interval: plan.interval,
      amount: plan.amount,
      localCurrency: plan.currency,
      code: plan.kyshi_plan_code,
      isActive: plan.is_active,
      country_code: plan.country_code,
      createdAt: plan.created_at,
      updatedAt: plan.created_at, // Using created_at as updated_at since it's not in the table
    }));
    
    console.log(`Retrieved ${transformedPlans.length} plans${country ? ` for ${country}` : ''}`);
    
    return NextResponse.json({
      success: true,
      message: 'Plans retrieved successfully',
      plans: transformedPlans,
    });
    
  } catch (error) {
    console.error('Plans API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: `Failed to retrieve plans: ${error instanceof Error ? error.message : 'Unknown error'}`,
        plans: [], // Always include plans array even on error
      },
      { status: 500 }
    );
  }
}
