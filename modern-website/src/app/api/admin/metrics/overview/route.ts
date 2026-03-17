import { NextResponse } from 'next/server';
import {
  getTotalUsers,
  getActiveUsers,
  getUsersByCountry,
  getTopBeehiveRequests,
  getARPU,
  getMRR,
} from '@/app/admin/lib/database';

export async function GET() {
  try {
    const [
      totalUsers,
      activeUsers,
      usersByCountry,
      topBeehive,
      arpu,
      mrr,
    ] = await Promise.all([
      getTotalUsers(),
      getActiveUsers(30),
      getUsersByCountry(),
      getTopBeehiveRequests(5),
      getARPU(),
      getMRR(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        inactiveUsers: totalUsers - activeUsers,
        usersByCountry,
        topBeehiveRequests: topBeehive,
        arpu,
        mrr,
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching overview metrics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}
