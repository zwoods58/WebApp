import { supabase } from '@/lib/supabase';

interface DataIntegrityReport {
  totalUsers: number;
  totalBusinesses: number;
  businessesWithNullUser: number;
  duplicateBusinesses: number;
  orphanedData: {
    transactions: number;
    expenses: number;
    inventory: number;
    credit: number;
    appointments: number;
  };
  timestamp: string;
}

export class DataIntegrityMonitor {
  static async generateReport(): Promise<DataIntegrityReport> {
    try {
      const timestamp = new Date().toISOString();
      
      // Get user count
      const { data: userData } = await supabase
        .from('users')
        .select('id', { count: 'exact', head: true });
      const totalUsers = userData?.length || 0;

      // Get business statistics
      const { data: businesses } = await supabase
        .from('businesses')
        .select('user_id, business_name, country, industry');

      const totalBusinesses = businesses?.length || 0;
      const businessesWithNullUser = businesses?.filter(b => !b.user_id).length || 0;
      
      // Check for duplicate businesses (same name, country, industry for same user)
      const duplicateMap = new Map();
      let duplicateBusinesses = 0;
      
      businesses?.forEach(b => {
        if (b.user_id) {
          const key = `${b.user_id}-${b.business_name}-${b.country}-${b.industry}`;
          if (duplicateMap.has(key)) {
            duplicateBusinesses++;
          } else {
            duplicateMap.set(key, 1);
          }
        }
      });

      // Check for orphaned data (data without valid user/business associations)
      const [
        { data: transactionData },
        { data: expenseData },
        { data: inventoryData },
        { data: creditData },
        { data: appointmentData }
      ] = await Promise.all([
        supabase.from('transactions').select('id', { count: 'exact', head: true }),
        supabase.from('expenses').select('id', { count: 'exact', head: true }),
        supabase.from('inventory').select('id', { count: 'exact', head: true }),
        supabase.from('credit').select('id', { count: 'exact', head: true }),
        supabase.from('appointments').select('id', { count: 'exact', head: true })
      ]);

      return {
        totalUsers,
        totalBusinesses,
        businessesWithNullUser,
        duplicateBusinesses,
        orphanedData: {
          transactions: transactionData?.length || 0,
          expenses: expenseData?.length || 0,
          inventory: inventoryData?.length || 0,
          credit: creditData?.length || 0,
          appointments: appointmentData?.length || 0
        },
        timestamp
      };
    } catch (error) {
      console.error('Failed to generate data integrity report:', error);
      throw error;
    }
  }

  static async checkAndAlert(): Promise<void> {
    try {
      const report = await this.generateReport();
      
      // Log critical issues
      if (report.businessesWithNullUser > 0) {
        console.error(`🚨 CRITICAL: ${report.businessesWithNullUser} businesses without user association detected!`);
        console.error('This can cause data leakage and security issues.');
      }
      
      if (report.duplicateBusinesses > 0) {
        console.error(`🚨 CRITICAL: ${report.duplicateBusinesses} duplicate businesses detected!`);
        console.error('This can cause data inconsistency and routing issues.');
      }
      
      const totalOrphaned = Object.values(report.orphanedData).reduce((sum, count) => sum + count, 0);
      if (totalOrphaned > 0) {
        console.error(`🚨 CRITICAL: ${totalOrphaned} orphaned data records detected!`);
        console.error('Orphaned data:', report.orphanedData);
      }
      
      // Log summary
      console.log(`📊 Data Integrity Report (${report.timestamp}):`);
      console.log(`   Users: ${report.totalUsers}`);
      console.log(`   Businesses: ${report.totalBusinesses}`);
      console.log(`   Issues: ${report.businessesWithNullUser + report.duplicateBusinesses + totalOrphaned}`);
      
      // If no issues, log success
      if (report.businessesWithNullUser === 0 && report.duplicateBusinesses === 0 && totalOrphaned === 0) {
        console.log('✅ Data integrity check passed - no issues detected');
      }
    } catch (error) {
      console.error('Failed to check data integrity:', error);
    }
  }

  static async runPeriodicCheck(): Promise<void> {
    // Run integrity check every 5 minutes
    setInterval(async () => {
      await this.checkAndAlert();
    }, 5 * 60 * 1000);
  }
}

// Export for use in development/production
export const dataIntegrityMonitor = DataIntegrityMonitor;
