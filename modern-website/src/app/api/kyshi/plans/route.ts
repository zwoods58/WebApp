import { NextRequest, NextResponse } from 'next/server';
import { kyshiApi } from '@/lib/kyshi';

export async function GET() {
  try {
    const plans = await kyshiApi().listPlans();
    
    return NextResponse.json({
      success: true,
      message: 'Plans retrieved successfully',
      plans,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: `Failed to retrieve plans: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
      { status: 500 }
    );
  }
}
