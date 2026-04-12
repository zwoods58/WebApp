import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // Test the plans API endpoint
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const plansResponse = await fetch(`${baseUrl}/api/kyshi/plans`);
    
    if (!plansResponse.ok) {
      return NextResponse.json({
        success: false,
        error: `Plans API returned ${plansResponse.status}: ${plansResponse.statusText}`,
        response: await plansResponse.text()
      });
    }
    
    const plansData = await plansResponse.json();
    
    // Also test country-specific endpoints
    const kenyaPlansResponse = await fetch(`${baseUrl}/api/kyshi/plans?country=KE`);
    const kenyaPlansData = kenyaPlansResponse.ok ? await kenyaPlansResponse.json() : null;
    
    // Get raw database data for comparison
    const { data: dbPlans, error: dbError } = await supabase
      .from('kyshi_plans')
      .select('*')
      .eq('is_active', true)
      .order('country_code', { ascending: true });
    
    return NextResponse.json({
      success: true,
      message: 'Plans API test successful',
      apiResponse: {
        data: plansData,
        isArray: Array.isArray(plansData.plans),
        plansCount: plansData.plans?.length || 0,
        success: plansData.success
      },
      kenyaTest: {
        success: kenyaPlansResponse.ok,
        data: kenyaPlansData,
        plansCount: kenyaPlansData?.plans?.length || 0
      },
      databaseCheck: {
        success: !dbError,
        totalPlans: dbPlans?.length || 0,
        plans: dbPlans?.map(p => ({
          country_code: p.country_code,
          name: p.name,
          amount: p.amount,
          currency: p.currency,
          interval: p.interval
        }))
      }
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    });
  }
}
