import { useState, useCallback } from 'react';
import { useAutoRefresh } from './useAutoRefresh';
import {
  getTotalUsers,
  getActiveUsers,
  getUsersByCountry,
  getTopBeehiveRequests,
  getARPU,
  getMRR,
  getRevenueByPeriod,
  getRevenueByCountry,
  getConversionMetrics,
  getChurnMetrics,
} from '../lib/database';
import type { CountryUserStats, BeehiveRequest, ConversionMetrics, ChurnMetrics } from '../lib/types';

export function useMetrics() {
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  // Core metrics
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [inactiveUsers, setInactiveUsers] = useState(0);
  const [arpu, setArpu] = useState(0);
  const [mrr, setMrr] = useState(0);
  
  // Country breakdown
  const [usersByCountry, setUsersByCountry] = useState<CountryUserStats[]>([]);
  
  // Beehive
  const [topBeehiveRequests, setTopBeehiveRequests] = useState<BeehiveRequest[]>([]);
  
  // Revenue tracking
  const [dailyRevenue, setDailyRevenue] = useState<any[]>([]);
  const [weeklyRevenue, setWeeklyRevenue] = useState<any[]>([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState<any[]>([]);
  const [quarterlyRevenue, setQuarterlyRevenue] = useState<any[]>([]);
  const [yearlyRevenue, setYearlyRevenue] = useState<any[]>([]);
  const [revenueByCountry, setRevenueByCountry] = useState<any[]>([]);
  
  // Conversion metrics
  const [conversionMetrics, setConversionMetrics] = useState<ConversionMetrics | null>(null);
  const [churnMetrics, setChurnMetrics] = useState<ChurnMetrics | null>(null);

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);

      const [
        total,
        active,
        byCountry,
        topBeehive,
        arpuValue,
        mrrValue,
        dailyRev,
        weeklyRev,
        monthlyRev,
        quarterlyRev,
        yearlyRev,
        revByCountry,
        conversions,
        churn,
      ] = await Promise.all([
        getTotalUsers(),
        getActiveUsers(30),
        getUsersByCountry(),
        getTopBeehiveRequests(5),
        getARPU(),
        getMRR(),
        getRevenueByPeriod('daily'),
        getRevenueByPeriod('weekly'),
        getRevenueByPeriod('monthly'),
        getRevenueByPeriod('quarterly'),
        getRevenueByPeriod('yearly'),
        getRevenueByCountry(),
        getConversionMetrics(),
        getChurnMetrics(),
      ]);

      setTotalUsers(total);
      setActiveUsers(active);
      setInactiveUsers(total - active);
      setUsersByCountry(byCountry);
      setTopBeehiveRequests(topBeehive);
      setArpu(arpuValue);
      setMrr(mrrValue);
      setDailyRevenue(dailyRev);
      setWeeklyRevenue(weeklyRev);
      setMonthlyRevenue(monthlyRev);
      setQuarterlyRevenue(quarterlyRev);
      setYearlyRevenue(yearlyRev);
      setRevenueByCountry(revByCountry);
      setConversionMetrics(conversions);
      setChurnMetrics(churn);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const { refresh } = useAutoRefresh({
    enabled: true,
    onRefresh: fetchMetrics,
    interval: 30000, // 30 seconds
  });

  return {
    loading,
    lastUpdated,
    totalUsers,
    activeUsers,
    inactiveUsers,
    arpu,
    mrr,
    usersByCountry,
    topBeehiveRequests,
    dailyRevenue,
    weeklyRevenue,
    monthlyRevenue,
    quarterlyRevenue,
    yearlyRevenue,
    revenueByCountry,
    conversionMetrics,
    churnMetrics,
    refresh: () => {
      setLoading(true);
      fetchMetrics();
    },
  };
}
