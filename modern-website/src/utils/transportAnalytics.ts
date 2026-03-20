import { Transaction } from '@/hooks/useTransactionsTanStack';

export interface TransportAnalytics {
  popularServices: Array<{ service_name: string; trips: number; revenue: number }>;
  profitableAreas: Array<{ location: string; revenue: number; trips: number }>;
  totalTrips: number;
  totalRevenue: number;
  avgTripRevenue: number;
}

export function analyzeTransportTransactions(transactions: Transaction[]): TransportAnalytics {
  // Filter for transport transactions - safe with empty array
  const transportTransactions = transactions.filter(t => 
    t.category === 'transport_trip' && t.metadata?.service_name
  );

  // Calculate popular services
  const serviceStats = new Map<string, { trips: number; revenue: number }>();
  
  transportTransactions.forEach(transaction => {
    const serviceName = transaction.metadata?.service_name || 'Unknown Service';
    const current = serviceStats.get(serviceName) || { trips: 0, revenue: 0 };
    serviceStats.set(serviceName, {
      trips: current.trips + 1,
      revenue: current.revenue + transaction.amount
    });
  });

  const popularServices = Array.from(serviceStats.entries())
    .map(([service_name, stats]) => ({ service_name, ...stats }))
    .sort((a, b) => b.trips - a.trips);

  // Calculate profitable areas (from location metadata)
  const areaStats = new Map<string, { revenue: number; trips: number }>();
  
  transportTransactions.forEach(transaction => {
    const location = transaction.metadata?.location;
    if (location) {
      const current = areaStats.get(location) || { revenue: 0, trips: 0 };
      areaStats.set(location, {
        revenue: current.revenue + transaction.amount,
        trips: current.trips + 1
      });
    }
  });

  const profitableAreas = Array.from(areaStats.entries())
    .map(([location, stats]) => ({ location, ...stats }))
    .sort((a, b) => b.revenue - a.revenue);

  // Calculate totals
  const totalTrips = transportTransactions.length;
  const totalRevenue = transportTransactions.reduce((sum, t) => sum + t.amount, 0);
  const avgTripRevenue = totalTrips > 0 ? totalRevenue / totalTrips : 0;

  return {
    popularServices,
    profitableAreas,
    totalTrips,
    totalRevenue,
    avgTripRevenue
  };
}
