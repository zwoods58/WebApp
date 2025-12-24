import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Share2, Loader2, AlertCircle, FileText, ChevronLeft, Package, TrendingUp, AlertTriangle, RefreshCcw } from 'lucide-react';
import { supabase, generateReport } from '../utils/supabase';
import { useAuthStore } from '../store/authStore';
import { format, startOfDay, startOfWeek, startOfMonth, endOfDay, endOfMonth, subDays, subWeeks, subMonths, endOfWeek } from 'date-fns';
import toast from 'react-hot-toast';
import ReportCard from '../components/reports/ReportCard';
import CategoryBreakdown from '../components/reports/CategoryBreakdown';
import TrendChart from '../components/reports/TrendChart';
import { generateReportPDF, shareReportOnWhatsApp, calculateGrowthRate } from '../utils/reportHelpers';
import FloatingNavBar from '../components/FloatingNavBar';
import { PageSkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import SwipeToRefresh from '../components/SwipeToRefresh';
import OfflineBanner from '../components/OfflineBanner';
import { useTranslation } from 'react-i18next';
import BeeZeeLogo from '../components/BeeZeeLogo';
import { useOfflineStore } from '../store/offlineStore';
import { getAllOfflineTransactions } from '../utils/offlineSync';

export default function Reports() {
  const navigate = useNavigate();
  const { user, clearAuth } = useAuthStore();
  const { t } = useTranslation();
  const { syncCompleted } = useOfflineStore();
  
  const [activeTab, setActiveTab] = useState('financials'); // 'financials' or 'inventory'
  
  const QUICK_RANGES = [
    { id: 'today', label: t('common.today', 'Today') },
    { id: 'week', label: t('common.week', 'Week') },
    { id: 'month', label: t('common.month', 'Month') },
  ];

  const [selectedRange, setSelectedRange] = useState('month');
  const [reportData, setReportData] = useState(null);
  const [previousReportData, setPreviousReportData] = useState(null); // For growth calculations
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  // BRAND COLORS
  const BRAND_BLUE = '#A8D5E2';
  const BRAND_CHARCOAL = '#2C2C2E';

  useEffect(() => {
    loadData();
    // Clear AI analysis when date range or tab changes
    setReportData(prev => prev ? { ...prev, analysis: null } : null);
  }, [selectedRange, user, activeTab]);

  // Refresh when sync completes (syncCompleted is a counter that increments)
  useEffect(() => {
    if (syncCompleted > 0) {
      console.log('Sync completed - refreshing Reports...');
      loadData();
      // Also reload AI analysis when sync completes (after data loads)
      // Use a longer timeout to ensure reportData is updated
      setTimeout(() => {
        if (activeTab === 'financials' && reportData) {
          const { start, end } = getDateRange();
          let finalUserId = user?.id || localStorage.getItem('beezee_user_id');
          const calculatedData = {
            totalIncome: reportData.totalIncome,
            totalExpenses: reportData.totalExpenses,
            netProfit: reportData.netProfit,
            transactionCount: reportData.transactionCount,
            categoryBreakdown: reportData.categoryBreakdown,
            dailyStats: reportData.dailyStats
          };
          if (!finalUserId) {
            supabase.auth.getSession().then(({ data: { session } }) => {
              if (session?.user?.id) {
                loadAiAnalysis(start, end, session.user.id, calculatedData);
              }
            });
          } else {
            loadAiAnalysis(start, end, finalUserId, calculatedData);
          }
        }
      }, 2000); // Wait for data to load first
    }
  }, [syncCompleted, reportData]);

  const loadData = async () => {
    if (activeTab === 'financials') {
      await loadFinancials();
    } else {
      await loadInventory();
    }
  };

  const getDateRange = () => {
    const now = new Date();
    switch (selectedRange) {
      case 'today':
        return { start: format(startOfDay(now), 'yyyy-MM-dd'), end: format(endOfDay(now), 'yyyy-MM-dd') };
      case 'week':
        return { start: format(startOfWeek(now), 'yyyy-MM-dd'), end: format(endOfDay(now), 'yyyy-MM-dd') };
      case 'month':
        return { start: format(startOfMonth(now), 'yyyy-MM-dd'), end: format(endOfDay(now), 'yyyy-MM-dd') };
      default:
        return { start: format(startOfMonth(now), 'yyyy-MM-dd'), end: format(endOfDay(now), 'yyyy-MM-dd') };
    }
  };

  const loadFinancials = async () => {
    // Robust User Detection
    let finalUserId = user?.id || localStorage.getItem('beezee_user_id');
    if (!finalUserId) {
      const { data: { session } } = await supabase.auth.getSession();
      finalUserId = session?.user?.id;
    }

    setLoading(true);
    setError(null);

    if (!finalUserId) {
      setError('auth_missing');
      setLoading(false);
      return;
    }

    try {
      const { start, end } = getDateRange();

      // Step 1: Fetch raw transactions directly from Supabase (Bypass AI for core data)
      console.log('[Reports] Loading for user:', finalUserId, 'Date range:', start, 'to', end);
      
      const { data: transactions, error: txError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', finalUserId)
        .gte('date', start)
        .lte('date', end)
        .order('date', { ascending: true });

      console.log('[Reports] Found transactions:', transactions?.length || 0, transactions);

      if (txError) {
        console.warn('[Reports] Transaction Fetch Error (Non-blocking):', txError);
      }

      // Get offline transactions and merge with online ones (same as Dashboard)
      let allTransactions = [...(transactions || [])];
      try {
        const offlineTransactions = await getAllOfflineTransactions();
        console.log('[Reports] Found offline transactions:', offlineTransactions.length);
        
        // Filter offline transactions by date range and merge
        const dateFilteredOffline = offlineTransactions.filter(t => {
          const txDate = t.date;
          return txDate >= start && txDate <= end;
        });
        
        // Filter out already synced offline transactions and add pending ones
        const unsyncedOffline = dateFilteredOffline.filter(t => !t.synced);
        console.log('[Reports] Unsynced offline transactions in range:', unsyncedOffline.length);
        
        // Mark offline transactions as pending and merge
        const pendingTransactions = unsyncedOffline.map(t => ({
          ...t,
          pending: true,
          synced: false,
          id: t.offline_id || `offline_${t.id}`,
        }));
        
        allTransactions = [...allTransactions, ...pendingTransactions];
        
        // Sort by date
        allTransactions.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA - dateB;
        });
      } catch (error) {
        console.error('[Reports] Error loading offline transactions:', error);
      }

      if (!allTransactions || allTransactions.length === 0) {
        setReportData({ transactionCount: 0 });
        setLoading(false);
        return;
      }

      // Step 2: Calculate financial metrics on frontend (No AI dependency) - using allTransactions
      const totalIncome = allTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount || 0), 0);
      
      const totalExpenses = allTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount || 0), 0);

      const categoryBreakdown = allTransactions.reduce((acc, t) => {
        const cat = t.category || 'Other';
        if (!acc[cat]) acc[cat] = { name: cat, income: 0, expense: 0 };
        if (t.type === 'income') acc[cat].income += Number(t.amount || 0);
        else acc[cat].expense += Number(t.amount || 0);
        return acc;
      }, {});

      const dailyStatsMap = allTransactions.reduce((acc, t) => {
        const date = t.date;
        if (!acc[date]) acc[date] = { date, income: 0, expense: 0 };
        if (t.type === 'income') acc[date].income += Number(t.amount || 0);
        else acc[date].expense += Number(t.amount || 0);
        return acc;
      }, {});

      const sortedDailyStats = Object.values(dailyStatsMap).sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      // Store current report as previous for next calculation
      if (reportData) {
        setPreviousReportData(reportData);
      }

      const initialReport = {
        transactionCount: allTransactions.length,
        totalIncome,
        totalExpenses,
        netProfit: totalIncome - totalExpenses,
        categoryBreakdown: Object.values(categoryBreakdown),
        dailyStats: sortedDailyStats,
        analysis: null // Will be filled by AI in background
      };

      // Clear old analysis when new data loads to show it's updating
      setReportData(prev => ({
        ...initialReport,
        analysis: null // Clear old analysis
      }));
      setLoading(false);
      
      // Load previous period data for comparison (in background)
      loadPreviousPeriodData(start, end, finalUserId);

      // Step 3: Load AI analysis in background (Does NOT block the UI)
      // Pass the calculated values so AI uses the same numbers displayed on the page
      setTimeout(() => {
        loadAiAnalysis(start, end, finalUserId, {
          totalIncome,
          totalExpenses,
          netProfit: totalIncome - totalExpenses,
          transactionCount: allTransactions.length,
          categoryBreakdown: Object.values(categoryBreakdown),
          dailyStats: sortedDailyStats
        });
      }, 100);

    } catch (err) {
      console.error('[Reports] Main Load Error:', err);
      setError(err.message || 'Failed to load core data');
      setLoading(false);
    }
  };

  const loadAiAnalysis = async (start, end, userId, calculatedData = null) => {
    setAiLoading(true);
    try {
      console.log('[Reports] Loading AI analysis for date range:', start, 'to', end);
      if (calculatedData) {
        console.log('[Reports] Using calculated data:', calculatedData);
      }
      
      // Use a safe wrapper for AI calls
      // Pass calculated data so AI uses the same numbers displayed on the page
      const result = await generateReport('profit_loss', start, end, userId, calculatedData).catch(err => {
        console.warn('[Reports] AI Call failed (likely unauthorized or network):', err);
        return { success: false, error: 'AI_OFFLINE' };
      });

      if (result.error === 'AI_OFFLINE' || result.error?.includes('User not found')) {
        console.warn('[Reports] AI Analysis skipped to prevent UI crash.');
        setAiLoading(false);
        return;
      }
      
      if (result.success && result.report?.analysis) {
        console.log('[Reports] AI Analysis updated:', result.report.analysis);
        setReportData(prev => ({
          ...prev,
          analysis: result.report.analysis
        }));
      } else {
        // Clear old analysis if new one failed
        console.log('[Reports] AI Analysis failed, clearing old analysis');
        setReportData(prev => ({
          ...prev,
          analysis: null
        }));
      }
    } catch (err) {
      console.warn('[Reports] AI Analysis caught error:', err);
      // Clear old analysis on error
      setReportData(prev => ({
        ...prev,
        analysis: null
      }));
    } finally {
      setAiLoading(false);
    }
  };

  const loadPreviousPeriodData = async (currentStart, currentEnd, userId) => {
    try {
      // Calculate previous period date range based on current range
      const currentStartDate = new Date(currentStart);
      const currentEndDate = new Date(currentEnd);
      const daysDiff = Math.ceil((currentEndDate - currentStartDate) / (1000 * 60 * 60 * 24)) + 1;
      
      let previousStart, previousEnd;
      
      if (selectedRange === 'today') {
        // Previous day
        const yesterday = subDays(currentStartDate, 1);
        previousStart = format(startOfDay(yesterday), 'yyyy-MM-dd');
        previousEnd = format(endOfDay(yesterday), 'yyyy-MM-dd');
      } else if (selectedRange === 'week') {
        // Previous week
        const prevWeekStart = subWeeks(currentStartDate, 1);
        const prevWeekEnd = subDays(currentStartDate, 1);
        previousStart = format(startOfWeek(prevWeekStart), 'yyyy-MM-dd');
        previousEnd = format(endOfDay(prevWeekEnd), 'yyyy-MM-dd');
      } else {
        // Previous month
        const prevMonthStart = subMonths(currentStartDate, 1);
        const prevMonthEnd = subDays(currentStartDate, 1);
        previousStart = format(startOfMonth(prevMonthStart), 'yyyy-MM-dd');
        previousEnd = format(endOfMonth(prevMonthStart), 'yyyy-MM-dd');
      }

      console.log('[Reports] Loading previous period data:', previousStart, 'to', previousEnd);

      // Fetch transactions for previous period
      const { data: previousTransactions, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .gte('date', previousStart)
        .lte('date', previousEnd);

      if (error) {
        console.warn('[Reports] Error loading previous period data:', error);
        return;
      }

      if (!previousTransactions || previousTransactions.length === 0) {
        console.log('[Reports] No previous period transactions found');
        setPreviousReportData({
          totalIncome: 0,
          totalExpenses: 0,
          netProfit: 0,
        });
        return;
      }

      // Calculate previous period totals
      const previousIncome = previousTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0);
      
      const previousExpenses = previousTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const previousNetProfit = previousIncome - previousExpenses;

      console.log('[Reports] Previous period totals:', {
        totalIncome: previousIncome,
        totalExpenses: previousExpenses,
        netProfit: previousNetProfit,
      });

      setPreviousReportData({
        totalIncome: previousIncome,
        totalExpenses: previousExpenses,
        netProfit: previousNetProfit,
      });
    } catch (err) {
      console.error('[Reports] Error loading previous period data:', err);
    }
  };

  const loadInventory = async () => {
    let finalUserId = user?.id || localStorage.getItem('beezee_user_id');
    if (!finalUserId) {
      const { data: { session } } = await supabase.auth.getSession();
      finalUserId = session?.user?.id;
    }

    setLoading(true);
    setError(null);

    if (!finalUserId) {
      setError('auth_missing');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .eq('user_id', finalUserId)
        .order('name', { ascending: true });

      if (error) {
        console.warn('[Reports] Inventory Fetch Error (Non-blocking):', error);
        setInventoryData([]);
        setLoading(false);
        return;
      }
      setInventoryData(data || []);
    } catch (err) {
      console.warn('[Reports] Inventory Exception:', err);
      setInventoryData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => loadData();

  const handleExportPDF = async () => {
    if (!reportData) return;
    setGeneratingPDF(true);
    try {
      const { start, end } = getDateRange();
      await generateReportPDF(reportData, start, end);
      toast.success(t('reports.pdfGenerated', 'Report PDF generated successfully!'));
    } catch (error) {
      toast.error(t('reports.pdfFailed', 'Failed to generate PDF report.'));
    } finally {
      setGeneratingPDF(false);
    }
  };

  const handleLogoutReset = () => {
    localStorage.clear();
    clearAuth();
    navigate('/login');
  };

  if (loading && !reportData && inventoryData.length === 0) return (
    <div className="reports-container pb-24">
      <div className="reports-header-section">
        <div className="px-4 flex items-center gap-4 mb-6">
          <h1 className="text-3xl font-black">{t('reports.title', 'Reports')}</h1>
        </div>
      </div>
      <PageSkeleton />
      <FloatingNavBar />
    </div>
  );

  return (
    <SwipeToRefresh onRefresh={handleRefresh}>
      <div className="reports-container pb-24">
        <OfflineBanner />
        
        {/* Modern Header Section */}
        <div className="reports-header-section">
          <div className="reports-title-row">
            <div className="px-4">
              <BeeZeeLogo />
            </div>
            <div className="flex items-center gap-2">
              <h1 className="reports-title">{t('reports.title', 'Reports')}</h1>
            </div>
            {activeTab === 'financials' && reportData?.transactionCount > 0 && (
              <button 
                onClick={handleExportPDF} 
                disabled={generatingPDF} 
                className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400"
              >
                {generatingPDF ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />}
              </button>
            )}
          </div>

          {/* Premium Tabs */}
          <div className="reports-tabs-container">
            <button
              onClick={() => setActiveTab('financials')}
              className={`reports-tab-button ${activeTab === 'financials' ? 'active' : ''}`}
            >
              <TrendingUp size={16} strokeWidth={3} />
              {t('reports.financials', 'Financials')}
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`reports-tab-button ${activeTab === 'inventory' ? 'active' : ''}`}
            >
              <Package size={16} strokeWidth={3} />
              {t('nav.inventory', 'Inventory')}
            </button>
          </div>

          {activeTab === 'financials' && (
            <div className="date-range-scroll">
              {QUICK_RANGES.map((range) => (
                <button
                  key={range.id}
                  onClick={() => setSelectedRange(range.id)}
                  className={`date-range-pill ${selectedRange === range.id ? 'active' : ''}`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="pt-2">
          {activeTab === 'financials' ? (
            reportData?.transactionCount === 0 ? (
              <div className="mx-4">
                <EmptyState
                  type="reports"
                  title={t('reports.noDataTitle', 'No Transactions')}
                  description={t('reports.noDataDesc', "Start recording transactions to see reports.")}
                  actionLabel={t('transactions.addTransaction', 'Add Transaction')}
                  onAction={() => navigate('/dashboard/transactions/add')}
                />
              </div>
            ) : reportData ? (
              <div className="space-y-8">
                {/* AI Insight Highlight */}
                {reportData.analysis && (
                  <div className="mx-4 bg-[#F0F9FF] rounded-[32px] p-6 border border-[#E0F2FE] animate-slide-up">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                      <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">AI Insight</span>
                    </div>
                    <p className="text-gray-700 text-sm font-bold leading-relaxed italic">"{reportData.analysis.summary}"</p>
                  </div>
                )}

                {/* Scorecards */}
                <div className="report-grid">
                  <ReportCard 
                    title="Revenue" 
                    amount={reportData.totalIncome} 
                    type="income" 
                    transactionCount={reportData.transactionCount}
                    previousAmount={previousReportData?.totalIncome}
                    isFullWidth
                  />
                  <ReportCard 
                    title="Expenses" 
                    amount={reportData.totalExpenses} 
                    type="expense"
                    previousAmount={previousReportData?.totalExpenses}
                    isFullWidth
                  />
                  <ReportCard 
                    title="Net Profit" 
                    amount={reportData.netProfit} 
                    type="profit" 
                    isFullWidth
                    previousAmount={previousReportData?.netProfit}
                  />
                </div>

                {/* Charts */}
                <TrendChart data={reportData.dailyStats} title="Cash Flow" />
                <CategoryBreakdown categories={reportData.categoryBreakdown} />
              </div>
            ) : null
          ) : (
            /* Inventory Content */
            inventoryData.length === 0 ? (
              <div className="mx-4">
                <EmptyState type="inventory" title="No Stock" description="Add items to track stock value." onAction={() => navigate('/dashboard/inventory')} />
              </div>
            ) : (
              <div className="space-y-8">
                {/* Inventory Scorecards */}
                <div className="report-grid">
                  <ReportCard 
                    title="Stock Value" 
                    amount={inventoryData.reduce((sum, item) => sum + (Number(item.cost_price) * Number(item.quantity)), 0)} 
                    type="profit" 
                  />
                  <ReportCard 
                    title="Potential Profit" 
                    amount={inventoryData.reduce((sum, item) => sum + ((Number(item.selling_price) - Number(item.cost_price)) * Number(item.quantity)), 0)} 
                    type="income" 
                  />
                  <ReportCard 
                    title="Low Stock Items" 
                    amount={inventoryData.filter(i => Number(i.quantity) <= Number(i.min_stock_level || i.min_stock || 0)).length} 
                    isCurrency={false} 
                    type="expense" 
                    isFullWidth
                  />
                </div>
                
                {/* Inventory Category Breakdown (Pie Chart) */}
                <CategoryBreakdown 
                  categories={Object.values(inventoryData.reduce((acc, item) => {
                    const cat = item.category || 'Other';
                    if (!acc[cat]) acc[cat] = { name: cat, income: 0, expense: 0 };
                    acc[cat].income += (Number(item.cost_price) * Number(item.quantity));
                    return acc;
                  }, {}))} 
                  title="Stock Value by Category"
                  type="income"
                />

                {/* Critical Stock List */}
                <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 mx-4 animate-slide-up">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-black text-gray-900 tracking-tight">
                      Critical Stock
                    </h3>
                    <div className="bg-red-50 text-red-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                      Action Needed
                    </div>
                  </div>

                  <div className="space-y-3">
                    {inventoryData
                      .filter(i => Number(i.quantity) <= Number(i.min_stock_level || i.min_stock || 0))
                      .sort((a, b) => Number(a.quantity) - Number(b.quantity))
                      .slice(0, 5)
                      .map((item) => {
                        const isOut = Number(item.quantity) === 0;
                        return (
                          <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-white">
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isOut ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                                <AlertTriangle size={18} />
                              </div>
                              <div>
                                <p className="text-sm font-black text-gray-900">{item.name}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                  {isOut ? 'Out of Stock' : `${item.quantity} ${item.unit} remaining`}
                                </p>
                              </div>
                            </div>
                            <button 
                              onClick={() => navigate('/dashboard/inventory')}
                              className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-3 py-2 rounded-lg"
                            >
                              Restock
                            </button>
                          </div>
                        );
                      })}
                    {inventoryData.filter(i => Number(i.quantity) <= Number(i.min_stock_level || i.min_stock || 0)).length === 0 && (
                      <div className="text-center py-4">
                        <p className="text-sm font-bold text-gray-400 italic">All stock levels are healthy! ✨</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
        
        <FloatingNavBar />
      </div>
    </SwipeToRefresh>
  );
}
