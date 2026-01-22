import { supabase } from './supabase';
import { formatCurrency } from './currency';
import { formatDate, getDateRange } from './dateTime';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * Financial Reports Management System
 * Generates comprehensive financial reports with charts and export capabilities
 */

export class ReportsManager {
  constructor() {
    this.storageKey = 'beezee_reports_cache';
  }

  /**
   * Generate comprehensive financial report
   */
  async generateFinancialReport(userId, options = {}) {
    try {
      const { startDate, endDate } = this.getDateRange(options.period);
      
      // Get transactions data
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: true });

      if (error) throw error;

      // Generate report data
      const reportData = {
        period: options.period || 'thisMonth',
        startDate,
        endDate,
        summary: this.generateSummary(transactions),
        revenueBreakdown: this.generateRevenueBreakdown(transactions),
        expenseBreakdown: this.generateExpenseBreakdown(transactions),
        profitLoss: this.generateProfitLoss(transactions),
        cashFlow: this.generateCashFlow(transactions),
        topProducts: this.generateTopProducts(transactions),
        customerAnalytics: this.generateCustomerAnalytics(transactions),
        paymentMethods: this.generatePaymentMethodAnalysis(transactions),
        trends: this.generateTrends(transactions),
        metrics: this.generateMetrics(transactions)
      };

      return {
        success: true,
        report: reportData
      };
    } catch (error) {
      console.error('Error generating report:', error);
      return {
        success: false,
        error: 'Failed to generate report'
      };
    }
  }

  /**
   * Get date range for report period
   */
  getDateRange(period) {
    const range = getDateRange(period);
    return {
      startDate: range.startDate?.toISOString() || new Date(0).toISOString(),
      endDate: range.endDate?.toISOString() || new Date().toISOString()
    };
  }

  /**
   * Generate summary statistics
   */
  generateSummary(transactions) {
    const income = transactions.filter(t => t.type === 'income');
    const expenses = transactions.filter(t => t.type === 'expense');
    
    const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    const netProfit = totalIncome - totalExpenses;
    const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;
    
    return {
      totalRevenue: totalIncome,
      totalExpenses,
      netProfit,
      profitMargin,
      totalTransactions: transactions.length,
      averageTransaction: transactions.length > 0 ? (totalIncome + totalExpenses) / transactions.length : 0,
      formattedTotalRevenue: formatCurrency(totalIncome),
      formattedTotalExpenses: formatCurrency(totalExpenses),
      formattedNetProfit: formatCurrency(netProfit),
      formattedAverageTransaction: formatCurrency(transactions.length > 0 ? (totalIncome + totalExpenses) / transactions.length : 0)
    };
  }

  /**
   * Generate revenue breakdown by category
   */
  generateRevenueBreakdown(transactions) {
    const incomeTransactions = transactions.filter(t => t.type === 'income');
    const breakdown = {};
    
    incomeTransactions.forEach(transaction => {
      if (!breakdown[transaction.category]) {
        breakdown[transaction.category] = {
          amount: 0,
          count: 0,
          percentage: 0
        };
      }
      breakdown[transaction.category].amount += transaction.amount;
      breakdown[transaction.category].count += 1;
    });
    
    const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    Object.keys(breakdown).forEach(category => {
      breakdown[category].percentage = totalIncome > 0 ? (breakdown[category].amount / totalIncome) * 100 : 0;
      breakdown[category].formattedAmount = formatCurrency(breakdown[category].amount);
    });
    
    return breakdown;
  }

  /**
   * Generate expense breakdown by category
   */
  generateExpenseBreakdown(transactions) {
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    const breakdown = {};
    
    expenseTransactions.forEach(transaction => {
      if (!breakdown[transaction.category]) {
        breakdown[transaction.category] = {
          amount: 0,
          count: 0,
          percentage: 0
        };
      }
      breakdown[transaction.category].amount += transaction.amount;
      breakdown[transaction.category].count += 1;
    });
    
    const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    Object.keys(breakdown).forEach(category => {
      breakdown[category].percentage = totalExpenses > 0 ? (breakdown[category].amount / totalExpenses) * 100 : 0;
      breakdown[category].formattedAmount = formatCurrency(breakdown[category].amount);
    });
    
    return breakdown;
  }

  /**
   * Generate profit & loss statement
   */
  generateProfitLoss(transactions) {
    const income = transactions.filter(t => t.type === 'income');
    const expenses = transactions.filter(t => t.type === 'expense');
    
    const incomeByCategory = {};
    const expensesByCategory = {};
    
    income.forEach(t => {
      if (!incomeByCategory[t.category]) {
        incomeByCategory[t.category] = 0;
      }
      incomeByCategory[t.category] += t.amount;
    });
    
    expenses.forEach(t => {
      if (!expensesByCategory[t.category]) {
        expensesByCategory[t.category] = 0;
      }
      expensesByCategory[t.category] += t.amount;
    });
    
    const totalIncome = Object.values(incomeByCategory).reduce((sum, amount) => sum + amount, 0);
    const totalExpenses = Object.values(expensesByCategory).reduce((sum, amount) => sum + amount, 0);
    const netProfit = totalIncome - totalExpenses;
    
    return {
      income: Object.entries(incomeByCategory).map(([category, amount]) => ({
        category,
        amount,
        formattedAmount: formatCurrency(amount)
      })),
      expenses: Object.entries(expensesByCategory).map(([category, amount]) => ({
        category,
        amount,
        formattedAmount: formatCurrency(amount)
      })),
      totalIncome,
      totalExpenses,
      netProfit,
      formattedTotalIncome: formatCurrency(totalIncome),
      formattedTotalExpenses: formatCurrency(totalExpenses),
      formattedNetProfit: formatCurrency(netProfit)
    };
  }

  /**
   * Generate cash flow analysis
   */
  generateCashFlow(transactions) {
    const cashFlowByDate = {};
    
    transactions.forEach(transaction => {
      const date = transaction.date.split('T')[0];
      if (!cashFlowByDate[date]) {
        cashFlowByDate[date] = {
          inflow: 0,
          outflow: 0,
          net: 0
        };
      }
      
      if (transaction.type === 'income') {
        cashFlowByDate[date].inflow += transaction.amount;
        cashFlowByDate[date].net += transaction.amount;
      } else {
        cashFlowByDate[date].outflow += transaction.amount;
        cashFlowByDate[date].net -= transaction.amount;
      }
    });
    
    const cashFlowData = Object.entries(cashFlowByDate)
      .map(([date, data]) => ({
        date,
        ...data,
        formattedInflow: formatCurrency(data.inflow),
        formattedOutflow: formatCurrency(data.outflow),
        formattedNet: formatCurrency(data.net)
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return cashFlowData;
  }

  /**
   * Generate top products/services analysis
   */
  generateTopProducts(transactions) {
    const products = {};
    
    transactions
      .filter(t => t.type === 'income')
      .forEach(transaction => {
        const product = transaction.description || 'Unknown';
        if (!products[product]) {
          products[product] = {
            amount: 0,
            count: 0
          };
        }
        products[product].amount += transaction.amount;
        products[product].count += 1;
      });
    
    return Object.entries(products)
      .map(([name, data]) => ({
        name,
        ...data,
        formattedAmount: formatCurrency(data.amount),
        averageAmount: data.count > 0 ? data.amount / data.count : 0,
        formattedAverageAmount: formatCurrency(data.count > 0 ? data.amount / data.count : 0)
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10);
  }

  /**
   * Generate customer analytics
   */
  generateCustomerAnalytics(transactions) {
    const customers = {};
    
    transactions
      .filter(t => t.type === 'income')
      .forEach(transaction => {
        const customer = transaction.reference || 'Cash Customer';
        if (!customers[customer]) {
          customers[customer] = {
            amount: 0,
            count: 0,
            firstTransaction: transaction.date,
            lastTransaction: transaction.date
          };
        }
        customers[customer].amount += transaction.amount;
        customers[customer].count += 1;
        
        if (transaction.date < customers[customer].firstTransaction) {
          customers[customer].firstTransaction = transaction.date;
        }
        if (transaction.date > customers[customer].lastTransaction) {
          customers[customer].lastTransaction = transaction.date;
        }
      });
    
    return Object.entries(customers)
      .map(([name, data]) => ({
        name,
        ...data,
        formattedAmount: formatCurrency(data.amount),
        averageAmount: data.count > 0 ? data.amount / data.count : 0,
        formattedAverageAmount: formatCurrency(data.count > 0 ? data.amount / data.count : 0)
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10);
  }

  /**
   * Generate payment method analysis
   */
  generatePaymentMethodAnalysis(transactions) {
    const methods = {};
    
    transactions.forEach(transaction => {
      const method = transaction.payment_method || 'Unknown';
      if (!methods[method]) {
        methods[method] = {
          income: 0,
          expenses: 0,
          count: 0
        };
      }
      
      if (transaction.type === 'income') {
        methods[method].income += transaction.amount;
      } else {
        methods[method].expenses += transaction.amount;
      }
      methods[method].count += 1;
    });
    
    return Object.entries(methods).map(([name, data]) => ({
      name,
      ...data,
      total: data.income + data.expenses,
      formattedIncome: formatCurrency(data.income),
      formattedExpenses: formatCurrency(data.expenses),
      formattedTotal: formatCurrency(data.income + data.expenses)
    }));
  }

  /**
   * Generate trends analysis
   */
  generateTrends(transactions) {
    const trends = {
      daily: this.generateDailyTrends(transactions),
      weekly: this.generateWeeklyTrends(transactions),
      monthly: this.generateMonthlyTrends(transactions)
    };
    
    return trends;
  }

  /**
   * Generate daily trends
   */
  generateDailyTrends(transactions) {
    const dailyData = {};
    
    transactions.forEach(transaction => {
      const date = transaction.date.split('T')[0];
      if (!dailyData[date]) {
        dailyData[date] = { income: 0, expenses: 0, transactions: 0 };
      }
      
      if (transaction.type === 'income') {
        dailyData[date].income += transaction.amount;
      } else {
        dailyData[date].expenses += transaction.amount;
      }
      dailyData[date].transactions += 1;
    });
    
    return Object.entries(dailyData)
      .map(([date, data]) => ({
        date,
        ...data,
        net: data.income - data.expenses,
        formattedIncome: formatCurrency(data.income),
        formattedExpenses: formatCurrency(data.expenses),
        formattedNet: formatCurrency(data.income - data.expenses)
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-30); // Last 30 days
  }

  /**
   * Generate weekly trends
   */
  generateWeeklyTrends(transactions) {
    const weeklyData = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = { income: 0, expenses: 0, transactions: 0 };
      }
      
      if (transaction.type === 'income') {
        weeklyData[weekKey].income += transaction.amount;
      } else {
        weeklyData[weekKey].expenses += transaction.amount;
      }
      weeklyData[weekKey].transactions += 1;
    });
    
    return Object.entries(weeklyData)
      .map(([week, data]) => ({
        week,
        ...data,
        net: data.income - data.expenses,
        formattedIncome: formatCurrency(data.income),
        formattedExpenses: formatCurrency(data.expenses),
        formattedNet: formatCurrency(data.income - data.expenses)
      }))
      .sort((a, b) => new Date(a.week) - new Date(b.week))
      .slice(-12); // Last 12 weeks
  }

  /**
   * Generate monthly trends
   */
  generateMonthlyTrends(transactions) {
    const monthlyData = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expenses: 0, transactions: 0 };
      }
      
      if (transaction.type === 'income') {
        monthlyData[monthKey].income += transaction.amount;
      } else {
        monthlyData[monthKey].expenses += transaction.amount;
      }
      monthlyData[monthKey].transactions += 1;
    });
    
    return Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        ...data,
        net: data.income - data.expenses,
        formattedIncome: formatCurrency(data.income),
        formattedExpenses: formatCurrency(data.expenses),
        formattedNet: formatCurrency(data.income - data.expenses)
      }))
      .sort((a, b) => new Date(a.month) - new Date(b.month))
      .slice(-12); // Last 12 months
  }

  /**
   * Generate key metrics
   */
  generateMetrics(transactions) {
    const income = transactions.filter(t => t.type === 'income');
    const expenses = transactions.filter(t => t.type === 'expense');
    
    const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    
    // Success rate (completed transactions)
    const completedTransactions = transactions.filter(t => t.status === 'completed');
    const successRate = transactions.length > 0 ? (completedTransactions.length / transactions.length) * 100 : 0;
    
    // Peak hours and days
    const hourlyData = {};
    const dailyData = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const hour = date.getHours();
      const day = date.getDay();
      
      hourlyData[hour] = (hourlyData[hour] || 0) + 1;
      dailyData[day] = (dailyData[day] || 0) + 1;
    });
    
    const peakHour = Object.entries(hourlyData).sort((a, b) => b[1] - a[1])[0];
    const peakDay = Object.entries(dailyData).sort((a, b) => b[1] - a[1])[0];
    
    return {
      successRate,
      peakHour: peakHour ? parseInt(peakHour[0]) : null,
      peakDay: peakDay ? parseInt(peakDay[0]) : null,
      totalTransactions: transactions.length,
      averageTransactionValue: transactions.length > 0 ? (totalIncome + totalExpenses) / transactions.length : 0,
      formattedAverageTransactionValue: formatCurrency(transactions.length > 0 ? (totalIncome + totalExpenses) / transactions.length : 0)
    };
  }

  /**
   * Export report to PDF
   */
  async exportToPDF(reportData, title = 'Financial Report') {
    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(20);
      doc.text(title, 20, 20);
      
      // Add period
      doc.setFontSize(12);
      doc.text(`Period: ${reportData.period}`, 20, 30);
      doc.text(`From: ${formatDate(reportData.startDate)}`, 20, 40);
      doc.text(`To: ${formatDate(reportData.endDate)}`, 20, 50);
      
      // Add summary
      doc.setFontSize(14);
      doc.text('Summary', 20, 70);
      doc.setFontSize(10);
      
      const summaryData = [
        ['Total Revenue', reportData.summary.formattedTotalRevenue],
        ['Total Expenses', reportData.summary.formattedTotalExpenses],
        ['Net Profit', reportData.summary.formattedNetProfit],
        ['Profit Margin', `${reportData.summary.profitMargin.toFixed(2)}%`],
        ['Total Transactions', reportData.summary.totalTransactions.toString()],
        ['Average Transaction', reportData.summary.formattedAverageTransaction]
      ];
      
      doc.autoTable({
        head: [['Metric', 'Value']],
        body: summaryData,
        startY: 80,
        theme: 'grid'
      });
      
      // Add revenue breakdown
      const revenueData = Object.entries(reportData.revenueBreakdown).map(([category, data]) => [
        category,
        data.formattedAmount,
        `${data.percentage.toFixed(2)}%`
      ]);
      
      if (revenueData.length > 0) {
        doc.addPage();
        doc.setFontSize(14);
        doc.text('Revenue Breakdown', 20, 20);
        
        doc.autoTable({
          head: [['Category', 'Amount', 'Percentage']],
          body: revenueData,
          startY: 30,
          theme: 'grid'
        });
      }
      
      // Add expense breakdown
      const expenseData = Object.entries(reportData.expenseBreakdown).map(([category, data]) => [
        category,
        data.formattedAmount,
        `${data.percentage.toFixed(2)}%`
      ]);
      
      if (expenseData.length > 0) {
        doc.addPage();
        doc.setFontSize(14);
        doc.text('Expense Breakdown', 20, 20);
        
        doc.autoTable({
          head: [['Category', 'Amount', 'Percentage']],
          body: expenseData,
          startY: 30,
          theme: 'grid'
        });
      }
      
      // Save PDF
      const filename = `beezee_financial_report_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);
      
      return { success: true, filename };
    } catch (error) {
      console.error('Error exporting PDF:', error);
      return {
        success: false,
        error: 'Failed to export PDF'
      };
    }
  }

  /**
   * Export report to CSV
   */
  async exportToCSV(reportData, title = 'Financial Report') {
    try {
      const csvData = [];
      
      // Add summary
      csvData.push(['Financial Report Summary']);
      csvData.push(['Period', reportData.period]);
      csvData.push(['Start Date', formatDate(reportData.startDate)]);
      csvData.push(['End Date', formatDate(reportData.endDate)]);
      csvData.push([]);
      
      csvData.push(['Summary Metrics']);
      csvData.push(['Total Revenue', reportData.summary.formattedTotalRevenue]);
      csvData.push(['Total Expenses', reportData.summary.formattedTotalExpenses]);
      csvData.push(['Net Profit', reportData.summary.formattedNetProfit]);
      csvData.push(['Profit Margin', `${reportData.summary.profitMargin.toFixed(2)}%`]);
      csvData.push(['Total Transactions', reportData.summary.totalTransactions]);
      csvData.push(['Average Transaction', reportData.summary.formattedAverageTransaction]);
      csvData.push([]);
      
      // Add revenue breakdown
      csvData.push(['Revenue Breakdown']);
      csvData.push(['Category', 'Amount', 'Percentage']);
      Object.entries(reportData.revenueBreakdown).forEach(([category, data]) => {
        csvData.push([category, data.formattedAmount, `${data.percentage.toFixed(2)}%`]);
      });
      csvData.push([]);
      
      // Add expense breakdown
      csvData.push(['Expense Breakdown']);
      csvData.push(['Category', 'Amount', 'Percentage']);
      Object.entries(reportData.expenseBreakdown).forEach(([category, data]) => {
        csvData.push([category, data.formattedAmount, `${data.percentage.toFixed(2)}%`]);
      });
      
      // Convert to CSV string
      const csvContent = csvData.map(row => 
        row.map(cell => `"${cell}"`).join(',')
      ).join('\n');
      
      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      
      const filename = `beezee_financial_report_${new Date().toISOString().split('T')[0]}.csv`;
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      
      URL.revokeObjectURL(url);
      
      return { success: true, filename };
    } catch (error) {
      console.error('Error exporting CSV:', error);
      return {
        success: false,
        error: 'Failed to export CSV'
      };
    }
  }

  /**
   * Cache report data
   */
  cacheReport(reportId, reportData) {
    try {
      const cache = this.getReportCache();
      cache[reportId] = {
        data: reportData,
        timestamp: Date.now()
      };
      localStorage.setItem(this.storageKey, JSON.stringify(cache));
    } catch (error) {
      console.error('Error caching report:', error);
    }
  }

  /**
   * Get cached report
   */
  getCachedReport(reportId) {
    try {
      const cache = this.getReportCache();
      const cached = cache[reportId];
      
      if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) { // 5 minutes
        return cached.data;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting cached report:', error);
      return null;
    }
  }

  /**
   * Get report cache
   */
  getReportCache() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error reading report cache:', error);
      return {};
    }
  }
}

// Create singleton instance
export const reportsManager = new ReportsManager();
