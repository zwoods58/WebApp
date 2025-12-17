import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Share2, Loader2, AlertCircle, FileText, ChevronLeft } from 'lucide-react';
import { supabase, generateReport } from '../utils/supabase';
import { useAuthStore } from '../store/authStore';
import { format, startOfDay, startOfWeek, startOfMonth, endOfDay, endOfMonth } from 'date-fns';
import toast from 'react-hot-toast';
import ReportCard from '../components/reports/ReportCard';
import CategoryBreakdown from '../components/reports/CategoryBreakdown';
import TrendChart from '../components/reports/TrendChart';
import { generateReportPDF, shareReportOnWhatsApp } from '../utils/reportHelpers';
import { getReportFromCache, saveReportToCache, invalidateReportCache } from '../utils/reportCache';
import FloatingNavBar from '../components/FloatingNavBar';
import { PageSkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import SwipeToRefresh from '../components/SwipeToRefresh';
import OfflineBanner from '../components/OfflineBanner';
import { useTranslation } from 'react-i18next';

export default function Reports() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { t } = useTranslation();
  
  const QUICK_RANGES = [
    { id: 'today', label: t('common.today', 'Today') },
    { id: 'week', label: t('common.week', 'Week') },
    { id: 'month', label: t('common.month', 'Month') },
    { id: 'custom', label: t('common.custom', 'Custom') },
  ];

  const [selectedRange, setSelectedRange] = useState('month'); // Default to month to match Dashboard
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  useEffect(() => {
    loadReport();
  }, [selectedRange, user]);

  const getDateRange = () => {
    const now = new Date();
    
    switch (selectedRange) {
      case 'today':
        return {
          start: format(startOfDay(now), 'yyyy-MM-dd'),
          end: format(endOfDay(now), 'yyyy-MM-dd'),
        };
      case 'week':
        return {
          start: format(startOfWeek(now), 'yyyy-MM-dd'),
          end: format(endOfDay(now), 'yyyy-MM-dd'), // Include full end day
        };
      case 'month':
        return {
          start: format(startOfMonth(now), 'yyyy-MM-dd'),
          end: format(endOfDay(now), 'yyyy-MM-dd'), // Include full end day - matches Dashboard
        };
      case 'custom':
        return {
          start: customStartDate || format(startOfDay(now), 'yyyy-MM-dd'),
          end: customEndDate || format(endOfDay(now), 'yyyy-MM-dd'),
        };
      default:
        return {
          start: format(startOfDay(now), 'yyyy-MM-dd'),
          end: format(endOfDay(now), 'yyyy-MM-dd'),
        };
    }
  };

  const loadReport = async () => {
    setLoading(true);
    setError(null);

    try {
      const { start, end } = getDateRange();
      const skipCache = selectedRange === 'today' || selectedRange === 'month' || selectedRange === 'custom';
      const cacheKey = `report_${user.id}_${start}_${end}`;
      
      if (!skipCache) {
        const cachedReport = getReportFromCache(cacheKey);
        if (cachedReport) {
          setReportData(cachedReport);
          setLoading(false);
          return;
        }
      } else {
        invalidateReportCache(cacheKey);
      }

      const result = await generateReport('profit_loss', start, end);

      if (result.error === 'subscription_required') {
        toast.error(t('common.subscriptionRequired', 'AI features require an active subscription'), { duration: 4000 });
        setTimeout(() => {
          navigate('/dashboard/subscription');
        }, 1500);
        return;
      }

      if (result.error) throw new Error(result.error);

      setReportData(result);
      if (!skipCache) {
        saveReportToCache(cacheKey, result);
      }
    } catch (error) {
      console.error('Error loading report:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    await loadReport();
  };

  const handleExportPDF = async () => {
    if (!reportData) return;
    
    setGeneratingPDF(true);
    try {
      const { start, end } = getDateRange();
      await generateReportPDF(reportData, start, end);
      toast.success(t('reports.pdfGenerated', 'Report PDF generated successfully!'));
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error(t('reports.pdfFailed', 'Failed to generate PDF report.'));
    } finally {
      setGeneratingPDF(false);
    }
  };

  const handleShareWhatsApp = () => {
    if (!reportData) return;
    const { start, end } = getDateRange();
    shareReportOnWhatsApp(reportData, start, end);
  };

  if (loading && !reportData) return (
    <div className="reports-container">
      <OfflineBanner />
      <div className="reports-header-section">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => navigate('/dashboard')} className="p-2 -ml-2 text-gray-600">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{t('reports.title', 'Reports')}</h1>
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
        
        {/* Header Section */}
        <div className="reports-header-section">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 -ml-2 text-gray-600 hover:text-gray-900 transition-colors"
                aria-label={t('common.back', 'Go back')}
              >
                <ChevronLeft size={24} />
              </button>
              <h1 className="text-3xl font-bold text-gray-900">{t('reports.title', 'Reports')}</h1>
            </div>
            {reportData && (
              <div className="flex gap-2">
                <button
                  onClick={handleShareWhatsApp}
                  className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  aria-label={t('reports.shareWhatsApp', 'Share on WhatsApp')}
                >
                  <Share2 size={22} />
                </button>
                <button
                  onClick={handleExportPDF}
                  disabled={generatingPDF}
                  className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors disabled:opacity-50"
                  aria-label={t('reports.downloadPDF', 'Download PDF')}
                >
                  {generatingPDF ? <Loader2 size={22} className="animate-spin" /> : <Download size={22} />}
                </button>
              </div>
            )}
          </div>

          {/* Quick Date Range Selection */}
          <div className="date-range-scroll">
            <div className="date-range-pills">
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
          </div>

          {/* Custom Date Inputs (only if custom range selected) */}
          {selectedRange === 'custom' && (
            <div className="custom-date-container mt-4 animate-fade-in">
              <div className="grid grid-cols-2 gap-3">
                <div className="form-field">
                  <label className="form-label text-xs">{t('reports.startDate', 'Start Date')}</label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="description-input text-sm py-2"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label text-xs">{t('reports.endDate', 'End Date')}</label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="description-input text-sm py-2"
                  />
                </div>
              </div>
              <button
                onClick={loadReport}
                className="btn btn-primary w-full mt-3 py-2 text-sm"
              >
                {t('reports.applyRange', 'Apply Range')}
              </button>
            </div>
          )}
        </div>

        {/* Report Content */}
        <div className="reports-content mt-6 px-4">
          {error ? (
            <div className="error-card p-6 text-center">
              <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
              <p className="text-gray-800 font-semibold mb-2">{t('reports.loadError', 'Error Loading Report')}</p>
              <p className="text-gray-600 text-sm mb-4">{error}</p>
              <button onClick={loadReport} className="btn btn-primary btn-sm">
                {t('common.retry', 'Try Again')}
              </button>
            </div>
          ) : !reportData || reportData.transactionCount === 0 ? (
            <EmptyState
              icon={<FileText size={64} />}
              title={t('reports.noDataTitle', 'No Transactions Found')}
              description={t('reports.noDataDesc', "We couldn't find any transactions for this period. Try selecting a different date range or add some transactions.")}
              actionText={t('transactions.addTransaction', 'Add Transaction')}
              onAction={() => navigate('/dashboard/transactions/add')}
            />
          ) : (
            <div className="space-y-6 animate-slide-up">
              {/* Summary Cards */}
              <div className="report-grid">
                <ReportCard
                  title={t('reports.revenue', 'Revenue')}
                  amount={reportData.totalIncome}
                  type="income"
                  transactionCount={reportData.transactionCount}
                />
                <ReportCard
                  title={t('reports.expenses', 'Expenses')}
                  amount={reportData.totalExpenses}
                  type="expense"
                />
                <ReportCard
                  title={t('reports.profit', 'Net Profit')}
                  amount={reportData.netProfit}
                  type="profit"
                  isFullWidth
                />
              </div>

              {/* Visualizations */}
              <TrendChart
                data={reportData.dailyStats}
                title={t('reports.trend', 'Income vs Expenses')}
              />

              <CategoryBreakdown
                categories={reportData.categoryBreakdown}
                title={t('reports.breakdown', 'Category Breakdown')}
              />
            </div>
          )}
        </div>
      </div>
      <FloatingNavBar />
    </SwipeToRefresh>
  );
}
