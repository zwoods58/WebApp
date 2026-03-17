import { NextResponse } from 'next/server';
import { getTopBeehiveRequests, getBeehiveStats } from '@/app/admin/lib/database';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5');

    const [topRequests, stats] = await Promise.all([
      getTopBeehiveRequests(limit),
      getBeehiveStats(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        topRequests,
        stats,
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching Beehive metrics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch Beehive metrics' },
      { status: 500 }
    );
  }
}
