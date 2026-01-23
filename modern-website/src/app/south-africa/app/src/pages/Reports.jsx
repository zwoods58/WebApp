import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Share2, Loader2, AlertCircle, FileText, ChevronLeft, Package, TrendingUp, AlertTriangle, RefreshCcw, Plus } from 'lucide-react';
// import { supabase, generateReport } from '../utils/supabase'; // Disabled for demo
import { useAuthStore } from '../store/authStore';
import { format, startOfDay, startOfWeek, startOfMonth, endOfDay, endOfMonth, subDays, subWeeks, subMonths, isWithinInterval, parseISO } from 'date-fns';
import toast from 'react-hot-toast';
import ReportCard from '../components/reports/ReportCard';
import CategoryBreakdown from '../components/reports/CategoryBreakdown';
import TrendChart from '../components/reports/TrendChart';
import { generateReportPDF } from '../utils/reportHelpers';
import FloatingNavBar from '../components/FloatingNavBar';
import { PageSkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import SwipeToRefresh from '../components/SwipeToRefresh';
import OfflineBanner from '../components/OfflineBanner';
import { useTranslation } from 'react-i18next';
import BeeZeeLogo from '../components/BeeZeeLogo';
import { useOfflineStore } from '../store/offlineStore';
import PageHeader from '../components/PageHeader';
import InvoiceReceiptModal from '../components/InvoiceReceiptModal';
import DateRangePicker from '../components/DateRangePicker';
import { generateInvoicePDF } from '../utils/pdfGenerator';
import { useDemoData } from '../hooks/useDemoData';

export default function Reports() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { t } = useTranslation();

  const { transactions, inventory, loading: demoLoading } = useDemoData();

  const [activeTab, setActiveTab] = useState('financials'); // 'financials' or 'inventory'

  const QUICK_RANGES = [
    { id: 'today', label: t('common.today', 'Today') },
    { id: 'week', label: t('common.week', 'Week') },
    { id: 'month', label: t('common.month', 'Month') },
    { id: 'custom', label: 'Custom Range', isCustom: true },
  ];

  const [selectedRange, setSelectedRange] = useState('month');
  const [reportData, setReportData] = useState(null);
  const [previousReportData, setPreviousReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isDateRangePickerOpen, setIsDateRangePickerOpen] = useState(false);
  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);

  useEffect(() => {
    loadData();
  }, [selectedRange, activeTab, transactions, inventory]);

  const getDateRange = () => {
    const now = new Date();
    if (selectedRange === 'custom' && customStartDate && customEndDate) {
      return { start: customStartDate, end: customEndDate };
    }
    switch (selectedRange) {
      case 'today':
        return { start: startOfDay(now), end: endOfDay(now) };
      case 'week':
        return { start: startOfWeek(now), end: endOfDay(now) };
      case 'month':
        return { start: startOfMonth(now), end: endOfDay(now) };
      default:
        return { start: startOfMonth(now), end: endOfDay(now) };
    }
  };

  const loadData = () => {
    setLoading(true);
    const { start, end } = getDateRange();

    if (activeTab === 'financials') {
      const filteredTransactions = transactions.filter(t => {
        const txDate = parseISO(t.date);
        return isWithinInterval(txDate, { start, end });
      });

      const totalIncome = filteredTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount || 0), 0);

      const totalExpenses = filteredTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount || 0), 0);

      const categoryMap = filteredTransactions.reduce((acc, t) => {
        const cat = t.category || 'Other';
        if (!acc[cat]) acc[cat] = { name: cat, income: 0, expense: 0 };
        if (t.type === 'income') acc[cat].income += Number(t.amount || 0);
        else acc[cat].expense += Number(t.amount || 0);
        return acc;
      }, {});

      const dailyStatsMap = filteredTransactions.reduce((acc, t) => {
        const date = t.date.split('T')[0];
        if (!acc[date]) acc[date] = { date, income: 0, expense: 0 };
        if (t.type === 'income') acc[date].income += Number(t.amount || 0);
        else acc[date].expense += Number(t.amount || 0);
        return acc;
      }, {});

      const sortedDailyStats = Object.values(dailyStatsMap).sort((a, b) =>
        a.date.localeCompare(b.date)
      );

      setReportData({
        transactionCount: filteredTransactions.length,
        totalIncome,
        totalExpenses,
        netProfit: totalIncome - totalExpenses,
        categoryBreakdown: Object.values(categoryMap),
        dailyStats: sortedDailyStats,
        analysis: {
          summary: "Your business shows healthy growth with most revenue coming from Sales. Expenses are well-managed.",
          insights: ["Revenue is consistent", "Low stock items identified", "Profit margins holding steady"]
        }
      });

      // Simple previous period calculation for demo
      setPreviousReportData({
        totalIncome: totalIncome * 0.9,
        totalExpenses: totalExpenses * 0.95,
        netProfit: (totalIncome * 0.9) - (totalExpenses * 0.95)
      });

    } else {
      // Inventory is already provided by hook
      setReportData(null);
    }
    setLoading(false);
  };

  const handleRefresh = async () => {
    loadData();
    return Promise.resolve();
  };

  const handleExportPDF = async () => {
    if (!reportData) return;
    setGeneratingPDF(true);
    try {
      const { start, end } = getDateRange();
      await generateReportPDF(reportData, format(start, 'yyyy-MM-dd'), format(end, 'yyyy-MM-dd'));
      toast.success(t('reports.pdfGenerated', 'Report PDF generated successfully!'));
    } catch (error) {
      toast.error(t('reports.pdfFailed', 'Failed to generate PDF report.'));
    } finally {
      setGeneratingPDF(false);
    }
  };

  const handleInvoiceSubmit = async (documentData) => {
    try {
      await generateInvoicePDF(documentData);
      toast.success(`${documentData.type === 'invoice' ? 'Invoice' : 'Receipt'} generated successfully!`);
      setIsInvoiceModalOpen(false);
    } catch (error) {
      console.error('Error generating document:', error);
      toast.error('Failed to generate document');
    }
  };

  const handleCustomDateRange = (startDate, endDate) => {
    setCustomStartDate(startDate);
    setCustomEndDate(endDate);
    setSelectedRange('custom');
  };

  const handleFilterChange = (filterId) => {
    if (filterId === 'custom') {
      setIsDateRangePickerOpen(true);
    } else {
      setSelectedRange(filterId);
      setCustomStartDate(null);
      setCustomEndDate(null);
    }
  };

  if (loading || demoLoading) return (
    <div className="reports-container pb-24">
      <PageSkeleton />
      <FloatingNavBar />
    </div>
  );

  const lowStockThreshold = 10;
  const criticalItems = inventory.filter(i => (i.quantity || i.stock || 0) <= (i.min_stock_level || lowStockThreshold));

  return (
    <>
      <SwipeToRefresh onRefresh={handleRefresh}>
        <div className="reports-container pb-24">
          <PageHeader
            title={t('reports.title', 'Reports')}
            tabs={[
              { id: 'financials', label: t('reports.financials', 'Financials'), icon: <TrendingUp size={16} strokeWidth={3} /> },
              { id: 'inventory', label: t('nav.inventory', 'Inventory'), icon: <Package size={16} strokeWidth={3} /> },
            ]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            dateRangeFilters={activeTab === 'financials' ? QUICK_RANGES : []}
            activeFilter={selectedRange}
            onFilterChange={handleFilterChange}
            actionButtons={[
              ...(activeTab === 'financials' && reportData?.transactionCount > 0 ? [{
                icon: generatingPDF ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} strokeWidth={3} />,
                onClick: handleExportPDF,
                className: "h-11 px-4 bg-[#F1F5F9] border border-[#CBD5E1] rounded-full flex items-center justify-center text-[#475569] active:scale-95 transition-all shadow-sm hover:bg-[#E2E8F0]",
                title: t('reports.export', 'Export PDF')
              }] : []),
              {
                icon: <div className="flex items-center gap-2"><Plus size={18} strokeWidth={3} /> <span className="text-xs font-black uppercase tracking-widest">Invoice</span></div>,
                onClick: () => setIsInvoiceModalOpen(true),
                className: "h-11 px-6 bg-blue-600 text-white rounded-full shadow-lg active:scale-95 transition-all flex items-center justify-center hover:bg-blue-700",
                title: 'Create Invoice'
              }
            ]}
          />

          {/* Main Content */}
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
            inventory.length === 0 ? (
              <div className="mx-4">
                <EmptyState type="inventory" title="No Stock" description="Add items to track stock value." onAction={() => navigate('/dashboard/inventory')} />
              </div>
            ) : (
              <div className="space-y-8">
                {/* Inventory Scorecards */}
                <div className="report-grid">
                  <ReportCard
                    title="Stock Value"
                    amount={inventory.reduce((sum, item) => sum + (Number(item.cost_price || 0) * Number(item.quantity || item.stock || 0)), 0)}
                    type="profit"
                  />
                  <ReportCard
                    title="Potential Profit"
                    amount={inventory.reduce((sum, item) => sum + ((Number(item.selling_price || 0) - Number(item.cost_price || 0)) * Number(item.quantity || item.stock || 0)), 0)}
                    type="income"
                  />
                  <ReportCard
                    title="Low Stock Items"
                    amount={criticalItems.length}
                    isCurrency={false}
                    type="expense"
                    isFullWidth
                  />
                </div>

                {/* Inventory Category Breakdown (Pie Chart) */}
                <CategoryBreakdown
                  categories={Object.values(inventory.reduce((acc, item) => {
                    const cat = item.category || 'Other';
                    if (!acc[cat]) acc[cat] = { name: cat, income: 0, expense: 0 };
                    acc[cat].income += (Number(item.cost_price || 0) * Number(item.quantity || item.stock || 0));
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
                    {criticalItems
                      .sort((a, b) => Number(a.quantity || a.stock || 0) - Number(b.quantity || b.stock || 0))
                      .slice(0, 5)
                      .map((item) => {
                        const qty = Number(item.quantity || item.stock || 0);
                        const isOut = qty === 0;
                        return (
                          <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-white">
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isOut ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                                <AlertTriangle size={18} />
                              </div>
                              <div>
                                <p className="text-sm font-black text-gray-900">{item.name}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                  {isOut ? 'Out of Stock' : `${qty} ${item.unit || 'units'} remaining`}
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
                    {criticalItems.length === 0 && (
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
      </SwipeToRefresh>


      {/* Invoice/Receipt Modal */}
      <InvoiceReceiptModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        onSubmit={handleInvoiceSubmit}
      />

      {/* Date Range Picker Modal */}
      <DateRangePicker
        isOpen={isDateRangePickerOpen}
        onClose={() => setIsDateRangePickerOpen(false)}
        onApply={handleCustomDateRange}
        initialStartDate={customStartDate}
        initialEndDate={customEndDate}
      />
    </>
  );
}