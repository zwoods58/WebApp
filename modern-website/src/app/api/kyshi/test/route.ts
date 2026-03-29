import { NextRequest, NextResponse } from 'next/server';
import { kyshiApi, createKenyaWeeklyPlan, testKyshiConnection } from '@/lib/kyshi';

export async function GET() {
  try {
    const connectionTest = await testKyshiConnection();
    return NextResponse.json(connectionTest);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: `Connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    // First test connection
    const connectionTest = await testKyshiConnection();
    if (!connectionTest.success) {
      return NextResponse.json(connectionTest, { status: 400 });
    }

    // Create Kenya weekly plan
    const plan = await createKenyaWeeklyPlan();
    
    return NextResponse.json({
      success: true,
      message: 'Kenya weekly plan created successfully',
      plan,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: `Plan creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
      { status: 500 }
    );
  }
}
