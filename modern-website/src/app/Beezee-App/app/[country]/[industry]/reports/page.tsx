"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Package, 
  Calendar,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart,
  LineChart,
  FileText,
  Star
} from 'lucide-react';
import { useParams } from 'next/navigation';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { formatCurrency, getCurrency } from '@/utils/currency';
import { useTransactionsTanStack, useExpensesTanStack, useCreditTanStack, useInventoryTanStack, useServicesTanStack } from '@/hooks';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';
import { useLanguage } from '@/hooks/LanguageContext';
import Header from '@/components/universal/Header';
import BottomNav from '@/components/universal/BottomNav';
import { getDailySalesHistory, formatDisplayDate, calculateAchievementPercentage } from '@/utils/dailyTargetHelpers';

export default function ReportsPage() {
  const params = useParams();
  const country = (params.country as string) || 'ke';
  const industry = (params.industry as string) || 'retail';
  const { t } = useLanguage();
  
  // Ref for PDF export
  const reportContentRef = useRef<HTMLDivElement>(null);
  // Loading state for export
  const [isExporting, setIsExporting] = useState(false);
  
  // Use TanStack Query hooks for data
  const { business } = useUnifiedAuth();
  const { data: transactions } = useTransactionsTanStack({ industry });
  const { data: expenses } = useExpensesTanStack({ industry });
  const { data: credit } = useCreditTanStack({ industry });
  const { data: inventory } = useInventoryTanStack({ industry });
  const { data: services } = useServicesTanStack({ industry });
  
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [selectedReport, setSelectedReport] = useState<'overview' | 'sales' | 'expenses' | 'inventory' | 'services' | 'customers' | 'daily'>('overview');
  const [dailyHistory, setDailyHistory] = useState<any[]>([]);

  // Fetch daily sales history
  useEffect(() => {
    if (business?.id && selectedReport === 'daily') {
      getDailySalesHistory(business.id, 30).then(setDailyHistory);
    }
  }, [business?.id, selectedReport]);

  // Calculate report data
  const calculateOverviewStats = () => {
    const now = new Date();
    const periodStart = getPeriodStart(now, selectedPeriod);
    
    const periodTransactions = transactions.filter(t => 
      new Date(t.transaction_date) >= periodStart
    );
    const periodExpenses = expenses.filter((e: any) => 
      new Date(e.expense_date) >= periodStart
    );
    
    const totalRevenue = periodTransactions.reduce((sum: number, t: any) => sum + t.amount, 0);
    const totalExpenses = periodExpenses.reduce((sum: number, e: any) => sum + e.amount, 0);
    const netProfit = totalRevenue - totalExpenses;
    const totalTransactions = periodTransactions.length;
    
    return {
      totalRevenue,
      totalExpenses,
      netProfit,
      totalTransactions,
      averageTransactionValue: totalTransactions > 0 ? totalRevenue / totalTransactions : 0
    };
  };

  const calculateSalesData = () => {
    const now = new Date();
    const periodStart = getPeriodStart(now, selectedPeriod);
    
    const periodTransactions = transactions.filter((t: any) => 
      new Date(t.transaction_date) >= periodStart
    );
    
    // Group by day for chart data
    const dailyData: Record<string, number> = {};
    for (let i = 0; i < getPeriodDays(selectedPeriod); i++) {
      const date = new Date(periodStart);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      dailyData[dateStr] = 0;
    }
    
    periodTransactions.forEach((t: any) => {
      const dateStr = t.transaction_date;
      if (dailyData[dateStr] !== undefined) {
        dailyData[dateStr] += t.amount;
      }
    });
    
    return {
      dailyData,
      totalSales: periodTransactions.reduce((sum: number, t: any) => sum + t.amount, 0),
      topCategories: getTopCategories(periodTransactions),
      paymentMethods: getPaymentMethods(periodTransactions)
    };
  };

  const calculateInventoryData = () => {
    const totalItems = inventory.length;
    const lowStockItems = inventory.filter((item: any) => item.quantity <= item.threshold).length;
    const totalValue = inventory.reduce((sum: number, item: any) => 
      sum + ((item.selling_price || item.cost_price || 0) * item.quantity), 0
    );
    
    const categoryBreakdown: Record<string, number> = {};
    inventory.forEach((item: any) => {
      const category = item.category || 'uncategorized';
      categoryBreakdown[category] = (categoryBreakdown[category] || 0) + 1;
    });
    
    return {
      totalItems,
      lowStockItems,
      totalValue,
      categoryBreakdown,
      stockTurnover: calculateStockTurnover(inventory, transactions)
    };
  };

  const calculateServicesData = () => {
    // Filter transactions related to services
    const serviceTransactions = transactions.filter(t => {
      if (industry === 'transport') {
        return t.category === 'transport_trip' && t.metadata?.service_name;
      } else {
        // For other industries, look for service-related transactions
        return t.metadata?.service_name || t.category === 'Service Fee' || t.description?.includes('service');
      }
    });

    // Calculate service performance
    const serviceStats = new Map<string, { count: number; revenue: number; avgRevenue: number }>();
    
    serviceTransactions.forEach(transaction => {
      const serviceName = transaction.metadata?.service_name || 
                        (transaction.category === 'Service Fee' ? transaction.description?.replace('Service fee - ', '') : 'Unknown Service');
      const current = serviceStats.get(serviceName) || { count: 0, revenue: 0, avgRevenue: 0 };
      const newRevenue = current.revenue + transaction.amount;
      const newCount = current.count + 1;
      
      serviceStats.set(serviceName, {
        count: newCount,
        revenue: newRevenue,
        avgRevenue: newRevenue / newCount
      });
    });

    const servicePerformance = Array.from(serviceStats.entries())
      .map(([service_name, stats]) => ({ service_name, ...stats }))
      .sort((a, b) => b.revenue - a.revenue);

    // Calculate totals
    const totalServices = services.length;
    const activeServices = servicePerformance.length;
    const totalTransactions = serviceTransactions.length;
    const totalRevenue = serviceTransactions.reduce((sum, t) => sum + t.amount, 0);
    const avgRevenuePerService = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

    return {
      totalServices,
      activeServices,
      totalTransactions,
      totalRevenue,
      avgRevenuePerService,
      servicePerformance
    };
  };

  const calculateCustomerData = () => {
    const totalCustomers = credit.length;
    const outstandingCredit = credit.filter((c: any) => c.status === 'outstanding').length;
    const totalOwed = credit
      .filter((c: any) => c.status === 'outstanding')
      .reduce((sum: number, c: any) => sum + (c.amount - c.paid_amount), 0);
    
    const topCustomers = credit
      .sort((a: any, b: any) => (b.amount - b.paid_amount) - (a.amount - a.paid_amount))
      .slice(0, 5);
    
    return {
      totalCustomers,
      outstandingCredit,
      totalOwed,
      topCustomers,
      averageCreditValue: totalCustomers > 0 ? credit.reduce((sum: number, c: any) => sum + c.amount, 0) / totalCustomers : 0
    };
  };

  // Helper functions
  const getPeriodStart = (date: Date, period: string): Date => {
    const start = new Date(date);
    switch (period) {
      case 'week':
        start.setDate(date.getDate() - 7);
        break;
      case 'month':
        start.setMonth(date.getMonth() - 1);
        break;
      case 'quarter':
        start.setMonth(date.getMonth() - 3);
        break;
      case 'year':
        start.setFullYear(date.getFullYear() - 1);
        break;
    }
    return start;
  };

  const getPeriodDays = (period: string): number => {
    switch (period) {
      case 'week': return 7;
      case 'month': return 30;
      case 'quarter': return 90;
      case 'year': return 365;
      default: return 30;
    }
  };

  const getTopCategories = (transactions: any[]): { name: string; value: number }[] => {
    const categories: Record<string, number> = {};
    transactions.forEach(t => {
      const category = t.category || 'other';
      categories[category] = (categories[category] || 0) + t.amount;
    });
    return Object.entries(categories)
      .sort(([,a]: [string, number], [,b]: [string, number]) => b - a)
      .slice(0, 5)
      .map(([name, value]: [string, number]) => ({ name, value }));
  };

  const getPaymentMethods = (transactions: any[]): { name: string; value: number; percentage: string }[] => {
    const methods: Record<string, number> = {};
    transactions.forEach(t => {
      const method = t.payment_method || 'other';
      methods[method] = (methods[method] || 0) + 1;
    });
    return Object.entries(methods).map(([name, value]: [string, number]) => ({ 
      name, 
      value, 
      percentage: (value / transactions.length * 100).toFixed(1) 
    }));
  };

  const calculateStockTurnover = (inventory: any[], transactions: any[]): string => {
    // Simple calculation: items sold / total items
    const itemsSold = transactions.length;
    const totalItems = inventory.reduce((sum: number, item: any) => sum + item.quantity, 0);
    return totalItems > 0 ? (itemsSold / totalItems * 100).toFixed(1) : '0';
  };

  // Calculate Top Selling Items
  const calculateTopSellers = () => {
    const now = new Date();
    const periodStart = getPeriodStart(now, selectedPeriod);
    
    const periodTransactions = transactions.filter((t: any) => 
      new Date(t.transaction_date) >= periodStart
    );

    // Group by item/description
    const itemSales: Record<string, { quantity: number; revenue: number; name: string }> = {};
    periodTransactions.forEach((t: any) => {
      const itemName = t.description || 'Unknown Item';
      if (!itemSales[itemName]) {
        itemSales[itemName] = { name: itemName, quantity: 0, revenue: 0 };
      }
      itemSales[itemName].quantity += 1;
      itemSales[itemName].revenue += t.amount;
    });

    return Object.values(itemSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  };

  // Calculate Customer Purchase Frequency
  const calculateCustomerFrequency = () => {
    const now = new Date();
    const periodStart = getPeriodStart(now, selectedPeriod);
    
    const periodTransactions = transactions.filter((t: any) => 
      new Date(t.transaction_date) >= periodStart
    );

    const customerPurchases: Record<string, number> = {};
    periodTransactions.forEach((t: any) => {
      const customer = t.customer_name || 'Walk-in';
      customerPurchases[customer] = (customerPurchases[customer] || 0) + 1;
    });

    const uniqueCustomers = Object.keys(customerPurchases).length;
    const repeatCustomers = Object.values(customerPurchases).filter(count => count > 1).length;
    const avgPurchases = uniqueCustomers > 0 
      ? periodTransactions.length / uniqueCustomers 
      : 0;

    return {
      uniqueCustomers,
      repeatCustomers,
      repeatRate: uniqueCustomers > 0 ? (repeatCustomers / uniqueCustomers * 100).toFixed(1) : '0',
      avgPurchases: avgPurchases.toFixed(1)
    };
  };

  // Calculate Peak Sales Times
  const calculatePeakTimes = () => {
    const now = new Date();
    const periodStart = getPeriodStart(now, selectedPeriod);
    
    const periodTransactions = transactions.filter((t: any) => 
      new Date(t.transaction_date) >= periodStart
    );

    // Group by day of week
    const dayOfWeek: Record<string, number> = {
      'Sunday': 0, 'Monday': 0, 'Tuesday': 0, 'Wednesday': 0,
      'Thursday': 0, 'Friday': 0, 'Saturday': 0
    };

    periodTransactions.forEach((t: any) => {
      const date = new Date(t.transaction_date);
      const day = date.toLocaleDateString('en-US', { weekday: 'long' });
      dayOfWeek[day] = (dayOfWeek[day] || 0) + t.amount;
    });

    const sortedDays = Object.entries(dayOfWeek)
      .sort(([,a], [,b]) => b - a)
      .map(([day, amount]) => ({ day, amount }));

    return {
      peakDay: sortedDays[0],
      allDays: sortedDays
    };
  };

  // Calculate Product Performance
  const calculateProductPerformance = () => {
    const itemPerformance = inventory.map((item: any) => {
      const itemTransactions = transactions.filter((t: any) => 
        t.description?.toLowerCase().includes(item.item_name.toLowerCase())
      );

      const revenue = itemTransactions.reduce((sum: number, t: any) => sum + t.amount, 0);
      const quantitySold = itemTransactions.length;
      const profitMargin = item.selling_price && item.cost_price 
        ? ((item.selling_price - item.cost_price) / item.selling_price * 100).toFixed(1)
        : '0';

      return {
        name: item.item_name,
        revenue,
        quantitySold,
        profitMargin,
        currentStock: item.quantity
      };
    }).sort((a: any, b: any) => b.revenue - a.revenue).slice(0, 10);

    return itemPerformance;
  };

  // Calculate Profit Margins by Category
  const calculateCategoryMargins = () => {
    const categoryData: Record<string, { revenue: number; cost: number; count: number }> = {};

    inventory.forEach((item: any) => {
      const category = item.category || 'Uncategorized';
      if (!categoryData[category]) {
        categoryData[category] = { revenue: 0, cost: 0, count: 0 };
      }

      const itemTransactions = transactions.filter((t: any) => 
        t.description?.toLowerCase().includes(item.item_name.toLowerCase())
      );

      const revenue = itemTransactions.reduce((sum: number, t: any) => sum + t.amount, 0);
      const cost = (item.cost_price || 0) * itemTransactions.length;

      categoryData[category].revenue += revenue;
      categoryData[category].cost += cost;
      categoryData[category].count += itemTransactions.length;
    });

    return Object.entries(categoryData)
      .map(([category, data]) => ({
        category,
        revenue: data.revenue,
        margin: data.revenue > 0 ? ((data.revenue - data.cost) / data.revenue * 100).toFixed(1) : '0',
        transactions: data.count
      }))
      .sort((a, b) => b.revenue - a.revenue);
  };

  // Get calculated data
  const overviewStats = calculateOverviewStats();
  const salesData = calculateSalesData();
  const inventoryData = calculateInventoryData();
  const servicesData = calculateServicesData();
  const customerData = calculateCustomerData();
  const topSellers = calculateTopSellers();
  const customerFrequency = calculateCustomerFrequency();
  const peakTimes = calculatePeakTimes();
  const productPerformance = calculateProductPerformance();
  const categoryMargins = calculateCategoryMargins();

  const handleExportReport = async () => {
    if (!reportContentRef.current) {
      console.error('Report content not found');
      return;
    }

    setIsExporting(true);

    try {
      let canvas;
      
      // Create a simple, reliable PDF generation method
      const createSimplePDF = () => {
        const pdfCanvas = document.createElement('canvas');
        const ctx = pdfCanvas.getContext('2d');
        if (!ctx) throw new Error('Could not get canvas context');
        
        pdfCanvas.width = 800;
        pdfCanvas.height = 1400;
        
        // Draw white background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, pdfCanvas.width, pdfCanvas.height);
        
        // Set Times New Roman font
        ctx.font = 'Times New Roman';
        
        // Draw professional header
        ctx.fillStyle = '#111827';
        ctx.font = 'bold 20px Times New Roman';
        ctx.textAlign = 'center';
        ctx.fillText(`${industry.charAt(0).toUpperCase() + industry.slice(1)} Business Report`, 400, 50);
        
        ctx.font = '12px Times New Roman';
        ctx.fillStyle = '#6b7280';
        ctx.fillText(`Generated on ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`, 400, 80);
        
        ctx.fillStyle = '#9ca3af';
        ctx.fillText('Complete Business Overview', 400, 100);
        
        // Draw line separator
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(50, 120);
        ctx.lineTo(750, 120);
        ctx.stroke();
        
        let yPosition = 150;
        ctx.textAlign = 'left';
        
        // Function to draw a section
        const drawSection = (title: string, metrics: Array<{label: string, value: string, color?: string}>) => {
          ctx.fillStyle = '#374151';
          ctx.font = 'bold 14px Times New Roman';
          ctx.fillText(title, 50, yPosition);
          yPosition += 25;
          
          metrics.forEach(metric => {
            ctx.fillStyle = '#6b7280';
            ctx.font = '10px Times New Roman';
            ctx.fillText(metric.label, 70, yPosition);
            
            ctx.fillStyle = metric.color || '#111827';
            ctx.font = 'bold 12px Times New Roman';
            ctx.fillText(metric.value, 70, yPosition + 15);
            yPosition += 35;
          });
          
          yPosition += 10;
        };
        
        // Overview section
        drawSection('📊 OVERVIEW', [
          { label: 'Total Revenue', value: formatCurrency(overviewStats.totalRevenue, country), color: '#10b981' },
          { label: 'Total Expenses', value: formatCurrency(overviewStats.totalExpenses, country), color: '#ef4444' },
          { label: 'Net Profit', value: formatCurrency(overviewStats.netProfit, country), color: '#3b82f6' },
          { label: 'Total Transactions', value: overviewStats.totalTransactions.toString(), color: '#8b5cf6' }
        ]);
        
        // Sales section
        const averageSale = transactions.length > 0 ? salesData.totalSales / transactions.length : 0;
        const dailyEntries = Object.entries(salesData.dailyData);
        const bestDayEntry = dailyEntries.reduce((max, [date, amount]) => amount > max.amount ? { date, amount } : max, { date: '', amount: 0 });
        
        drawSection('💰 SALES', [
          { label: 'Total Sales', value: formatCurrency(salesData.totalSales, country), color: '#10b981' },
          { label: 'Average Sale', value: formatCurrency(averageSale, country), color: '#3b82f6' },
          { label: 'Best Day', value: `${bestDayEntry.date || 'N/A'} (${formatCurrency(bestDayEntry.amount, country)})`, color: '#f59e0b' },
          { label: 'Transactions', value: transactions.length.toString(), color: '#8b5cf6' }
        ]);
        
        // Expenses section
        const totalExpenses = expenses.reduce((sum: number, e: any) => sum + Number(e.amount), 0);
        drawSection('💸 EXPENSES', [
          { label: 'Total Expenses', value: formatCurrency(totalExpenses, country), color: '#ef4444' },
          { label: 'Number of Expenses', value: expenses.length.toString(), color: '#6b7280' },
          { label: 'Average Expense', value: formatCurrency(totalExpenses / expenses.length, country), color: '#f59e0b' }
        ]);
        
        // Industry-specific section
        if (servicesData) {
          drawSection('⭐ SERVICES', [
            { label: 'Total Services', value: servicesData.totalServices.toString(), color: '#3b82f6' },
            { label: 'Active Services', value: servicesData.activeServices.toString(), color: '#10b981' },
            { label: 'Total Transactions', value: servicesData.totalTransactions.toString(), color: '#f59e0b' },
            { label: 'Total Revenue', value: formatCurrency(servicesData.totalRevenue, country), color: '#10b981' },
            { label: 'Avg Revenue/Service', value: formatCurrency(servicesData.avgRevenuePerService, country), color: '#8b5cf6' }
          ]);
          
          // Add top services table
          if (servicesData.servicePerformance.length > 0) {
            yPosition += 10;
            ctx.fillStyle = '#374151';
            ctx.font = 'bold 12px Times New Roman';
            ctx.fillText('Top Performing Services', 50, yPosition);
            yPosition += 20;
            
            // Table header
            ctx.fillStyle = '#6b7280';
            ctx.font = '9px Times New Roman';
            ctx.fillText('Service', 50, yPosition);
            ctx.fillText('Count', 300, yPosition);
            ctx.fillText('Revenue', 450, yPosition);
            ctx.fillText('Avg/Service', 600, yPosition);
            yPosition += 15;
            
            // Table rows
            servicesData.servicePerformance.slice(0, 5).forEach(service => {
              ctx.fillStyle = '#374151';
              ctx.font = '9px Times New Roman';
              ctx.fillText(service.service_name.substring(0, 20), 50, yPosition);
              ctx.fillText(service.count.toString(), 300, yPosition);
              ctx.fillText(formatCurrency(service.revenue, country), 450, yPosition);
              ctx.fillText(formatCurrency(service.avgRevenue, country), 600, yPosition);
              yPosition += 12;
            });
          }
        } else if (industry !== 'transport') {
          drawSection('📦 INVENTORY', [
            { label: 'Total Items', value: inventoryData.totalItems.toString(), color: '#3b82f6' },
            { label: 'Low Stock Items', value: inventoryData.lowStockItems.toString(), color: '#ef4444' },
            { label: 'Total Value', value: formatCurrency(inventoryData.totalValue, country), color: '#10b981' },
            { label: 'Stock Turnover', value: `${inventoryData.stockTurnover}%`, color: '#f59e0b' }
          ]);
        }
        
        // Customers section
        drawSection('👥 CUSTOMERS', [
          { label: 'Total Customers', value: customerData.totalCustomers.toString(), color: '#3b82f6' },
          { label: 'Outstanding Credit', value: formatCurrency(customerData.totalOwed, country), color: '#ef4444' },
          { label: 'Average Credit Value', value: formatCurrency(customerData.averageCreditValue, country), color: '#10b981' }
        ]);
        
        return pdfCanvas;
      };
      
      // Always use the simple, reliable method
      canvas = createSimplePDF();

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Calculate dimensions
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Generate filename
      const reportType = selectedReport.charAt(0).toUpperCase() + selectedReport.slice(1);
      const industryName = industry.charAt(0).toUpperCase() + industry.slice(1);
      const date = new Date().toISOString().split('T')[0];
      const filename = `${industryName}_${reportType}_Report_${date}.pdf`;

      // Download PDF
      pdf.save(filename);
      
      console.log('PDF exported successfully:', filename);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div ref={reportContentRef} className="min-h-screen bg-gray-50 pb-20">
      <Header industry={industry} country={country} />

      <div className="p-4 max-w-md mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-gray-900 mb-6"
        >
          {t('reports.title', 'Reports')}
        </motion.h1>

        {/* Period Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="bg-white rounded-xl border border-gray-200 p-1 flex">
            {['week', 'month', 'quarter', 'year'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period as any)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  selectedPeriod === period
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t(`reports.${period}`, period.charAt(0).toUpperCase() + period.slice(1))}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Report Type Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex gap-2 overflow-x-auto">
            {[
              { id: 'overview', label: t('reports.overview', 'Overview'), icon: BarChart3 },
              { id: 'sales', label: t('reports.sales', 'Sales'), icon: TrendingUp },
              { id: 'expenses', label: t('reports.expenses', 'Expenses'), icon: TrendingDown },
              { id: 'inventory', label: t('reports.inventory', 'Inventory'), icon: Package },
              { id: 'services', label: t('reports.services', 'Services'), icon: Star },
              { id: 'customers', label: t('reports.customers', 'Customers'), icon: Users },
              { id: 'daily', label: t('reports.daily_performance', 'Daily Performance'), icon: Calendar }
            ].map((report) => (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedReport === report.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 border border-gray-200'
                }`}
              >
                <report.icon size={16} />
                {report.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Export Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <button
            onClick={handleExportReport}
            disabled={isExporting}
            className="w-full py-3 bg-green-500 hover:bg-green-600 disabled:bg-green-400 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Download size={20} />
            {isExporting ? 'Generating PDF...' : t('reports.export', 'Export Report')}
          </button>
        </motion.div>

        {/* Report Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl border border-gray-200 p-4"
        >
          {selectedReport === 'overview' && (
            <div className="space-y-4">
              {/* Revenue Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <DollarSign className="text-green-600" size={16} />
                    {t('reports.total_revenue', 'Total Revenue')}
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    <ArrowUpRight size={16} />
                    <span className="text-xs font-medium">+12%</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(overviewStats.totalRevenue, country)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {overviewStats.totalTransactions} {t('reports.transactions', 'transactions')}
                </div>
              </div>

              {/* Expenses Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <TrendingDown className="text-red-600" size={16} />
                    {t('reports.total_expenses', 'Total Expenses')}
                  </div>
                  <div className="flex items-center gap-1 text-red-600">
                    <ArrowDownRight size={16} />
                    <span className="text-xs font-medium">+8%</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(overviewStats.totalExpenses, country)}
                </div>
              </div>

              {/* Net Profit Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <BarChart3 className="text-blue-600" size={16} />
                    {t('reports.net_profit', 'Net Profit')}
                  </div>
                  <div className={`flex items-center gap-1 ${overviewStats.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {overviewStats.netProfit >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    <span className="text-xs font-medium">
                      {overviewStats.netProfit >= 0 ? '+15%' : '-5%'}
                    </span>
                  </div>
                </div>
                <div className={`text-2xl font-bold ${overviewStats.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(overviewStats.netProfit, country)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {t('reports.profit_margin', 'Profit margin')}: {overviewStats.totalRevenue > 0 ? ((overviewStats.netProfit / overviewStats.totalRevenue) * 100).toFixed(1) : 0}%
                </div>
              </div>
            </div>
          )}

          {selectedReport === 'sales' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-3">{t('reports.sales_performance', 'Sales Performance')}</h3>
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {formatCurrency(salesData.totalSales, country)}
                </div>
                <div className="text-sm text-gray-500">
                  {t('reports.period_sales', 'Sales this period')}
                </div>
              </div>

              {/* Top Categories */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-3">{t('reports.top_categories', 'Top Categories')}</h3>
                <div className="space-y-2">
                  {salesData.topCategories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{category.name}</span>
                      <span className="text-sm font-medium">{formatCurrency(category.value, country)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-3">{t('reports.payment_methods', 'Payment Methods')}</h3>
                <div className="space-y-2">
                  {salesData.paymentMethods.map((method, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{method.name}</span>
                      <span className="text-sm font-medium">{method.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Selling Items - Popularity */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  <span className="flex items-center gap-2">
                    <Star className="text-yellow-500" size={18} />
                    {t('reports.top_sellers', 'Top Selling Items')}
                  </span>
                </h3>
                <div className="space-y-3">
                  {topSellers.slice(0, 5).map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">
                          {index + 1}
                        </div>
                        <span className="text-sm text-gray-900 font-medium">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-green-600">{formatCurrency(item.revenue, country)}</div>
                        <div className="text-xs text-gray-500">{item.quantity} {t('reports.sold', 'sold')}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Frequency */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-3">{t('reports.customer_frequency', 'Customer Frequency')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-lg font-bold text-blue-600">{customerFrequency.uniqueCustomers}</div>
                    <div className="text-xs text-gray-500">{t('reports.unique_customers', 'Unique Customers')}</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-600">{customerFrequency.repeatRate}%</div>
                    <div className="text-xs text-gray-500">{t('reports.repeat_rate', 'Repeat Rate')}</div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{t('reports.avg_purchases', 'Avg Purchases')}</span>
                    <span className="font-medium text-gray-900">{customerFrequency.avgPurchases}</span>
                  </div>
                </div>
              </div>

              {/* Peak Sales Times */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-3">{t('reports.peak_times', 'Peak Sales Times')}</h3>
                <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                  <div className="text-xs text-blue-600 font-medium mb-1">{t('reports.best_day', 'Best Day')}</div>
                  <div className="text-lg font-bold text-blue-900">{peakTimes.peakDay.day}</div>
                  <div className="text-sm text-blue-700">{formatCurrency(peakTimes.peakDay.amount, country)}</div>
                </div>
                <div className="space-y-2">
                  {peakTimes.allDays.slice(1, 4).map((day, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{day.day}</span>
                      <span className="font-medium">{formatCurrency(day.amount, country)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedReport === 'services' && servicesData && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-3">{t('reports.services_summary', 'Services Summary')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-lg font-bold text-gray-900">{servicesData.totalServices}</div>
                    <div className="text-xs text-gray-500">{t('reports.total_services', 'Total Services')}</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-600">{servicesData.activeServices}</div>
                    <div className="text-xs text-gray-500">{t('reports.active_services', 'Active Services')}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-3">{t('reports.service_performance', 'Service Performance')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-lg font-bold text-blue-900">{servicesData.totalTransactions}</div>
                    <div className="text-xs text-gray-500">{t('reports.total_transactions', 'Total Transactions')}</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-600">{formatCurrency(servicesData.totalRevenue, country)}</div>
                    <div className="text-xs text-gray-500">{t('reports.total_revenue', 'Total Revenue')}</div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="text-lg font-bold text-purple-600">{formatCurrency(servicesData.avgRevenuePerService, country)}</div>
                  <div className="text-sm text-gray-500">{t('reports.avg_revenue_per_service', 'Average Revenue per Service')}</div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-3">{t('reports.top_services', 'Top Services')}</h3>
                <div className="space-y-2">
                  {servicesData.servicePerformance.slice(0, 5).map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{service.service_name}</div>
                        <div className="text-sm text-gray-500">{service.count} transactions</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">{formatCurrency(service.revenue, country)}</div>
                        <div className="text-sm text-gray-500">{formatCurrency(service.avgRevenue, country)} avg</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedReport === 'inventory' && industry !== 'transport' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-3">{t('reports.inventory_summary', 'Inventory Summary')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-lg font-bold text-gray-900">{inventoryData.totalItems}</div>
                    <div className="text-xs text-gray-500">{t('reports.total_items', 'Total Items')}</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-orange-600">{inventoryData.lowStockItems}</div>
                    <div className="text-xs text-gray-500">{t('reports.low_stock', 'Low Stock')}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-3">{t('reports.inventory_value', 'Inventory Value')}</h3>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(inventoryData.totalValue, country)}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {t('reports.total_value', 'Total inventory value')}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-3">{t('reports.stock_turnover', 'Stock Turnover')}</h3>
                <div className="text-2xl font-bold text-blue-600">{inventoryData.stockTurnover}%</div>
                <div className="text-sm text-gray-500 mt-1">
                  {t('reports.turnover_rate', 'Items sold / Total items')}
                </div>
              </div>
            </div>
          )}

          {selectedReport === 'customers' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-3">{t('reports.customer_summary', 'Customer Summary')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-lg font-bold text-gray-900">{customerData.totalCustomers}</div>
                    <div className="text-xs text-gray-500">{t('reports.total_customers', 'Total Customers')}</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-orange-600">{customerData.outstandingCredit}</div>
                    <div className="text-xs text-gray-500">{t('reports.outstanding', 'Outstanding')}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-3">{t('reports.total_owed', 'Total Owed')}</h3>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(customerData.totalOwed, country)}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {t('reports.outstanding_balance', 'Outstanding balance')}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-3">{t('reports.average_credit', 'Average Credit Value')}</h3>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(customerData.averageCreditValue, country)}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {t('reports.avg_per_customer', 'Average per customer')}
                </div>
              </div>
            </div>
          )}

          {selectedReport === 'expenses' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-3">{t('reports.expenses_breakdown', 'Expenses Breakdown')}</h3>
                <div className="text-2xl font-bold text-red-600 mb-1">
                  {formatCurrency(overviewStats.totalExpenses, country)}
                </div>
                <div className="text-sm text-gray-500">
                  {t('reports.total_expenses_period', 'Total expenses this period')}
                </div>
              </div>

              {/* Expense Categories */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-3">{t('reports.expense_categories', 'Expense Categories')}</h3>
                <div className="space-y-2">
                  {expenses.slice(0, 5).map((expense: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{expense.category || 'Other'}</span>
                      <span className="text-sm font-medium">{formatCurrency(expense.amount, country)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedReport === 'daily' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-4">{t('reports.daily_performance', 'Daily Performance')}</h3>
                <p className="text-sm text-gray-500 mb-4">
                  {t('reports.last_30_days', 'Last 30 days of daily sales performance')}
                </p>

                {dailyHistory.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar size={48} className="mx-auto mb-3 opacity-50" />
                    <p>{t('reports.no_daily_history', 'No daily history available yet')}</p>
                    <p className="text-xs mt-2">{t('reports.daily_history_info', 'History is recorded automatically at midnight each day')}</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-2 font-semibold text-gray-700">{t('reports.date', 'Date')}</th>
                          <th className="text-right py-3 px-2 font-semibold text-gray-700">{t('reports.sales', 'Sales')}</th>
                          <th className="text-right py-3 px-2 font-semibold text-gray-700">{t('reports.target', 'Target')}</th>
                          <th className="text-right py-3 px-2 font-semibold text-gray-700">{t('reports.achievement', 'Achievement')}</th>
                          <th className="text-center py-3 px-2 font-semibold text-gray-700">{t('reports.status', 'Status')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dailyHistory.map((day, index) => {
                          const achievement = calculateAchievementPercentage(day.sales_total, day.daily_target);
                          return (
                            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-3 px-2 text-gray-900">{formatDisplayDate(day.date)}</td>
                              <td className="py-3 px-2 text-right font-medium text-gray-900">
                                {formatCurrency(day.sales_total, country)}
                              </td>
                              <td className="py-3 px-2 text-right text-gray-600">
                                {formatCurrency(day.daily_target, country)}
                              </td>
                              <td className="py-3 px-2 text-right">
                                <span className={`font-semibold ${
                                  achievement >= 100 ? 'text-green-600' : 
                                  achievement >= 75 ? 'text-blue-600' : 
                                  achievement >= 50 ? 'text-yellow-600' : 
                                  'text-red-600'
                                }`}>
                                  {achievement}%
                                </span>
                              </td>
                              <td className="py-3 px-2 text-center">
                                {day.target_achieved ? (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    ✅ {t('reports.met', 'Met')}
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    ❌ {t('reports.not_met', 'Not Met')}
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Summary Stats */}
              {dailyHistory.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="text-xs text-gray-500 mb-1">{t('reports.days_target_met', 'Days Target Met')}</div>
                    <div className="text-2xl font-bold text-green-600">
                      {dailyHistory.filter(d => d.target_achieved).length}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {t('reports.out_of', 'out of')} {dailyHistory.length} {t('reports.days', 'days')}
                    </div>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="text-xs text-gray-500 mb-1">{t('reports.success_rate', 'Success Rate')}</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round((dailyHistory.filter(d => d.target_achieved).length / dailyHistory.length) * 100)}%
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {t('reports.overall_achievement', 'Overall achievement')}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      <BottomNav industry={industry} country={country} />
    </div>
  );
}
