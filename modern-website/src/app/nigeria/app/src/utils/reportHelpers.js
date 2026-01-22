// Report Helper Functions
// PDF generation and WhatsApp sharing

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { format } from 'date-fns';

/**
 * Generate and download PDF report
 * @param {Object} reportData - Report data
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 * @param {Object} user - User object
 */
export async function generateReportPDF(reportData, startDate, endDate, user) {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  // Colors
  const primaryColor = [245, 158, 11]; // Primary orange
  const greenColor = [16, 185, 129];
  const redColor = [239, 68, 68];
  
  let yPos = 20;

  // Header
  pdf.setFillColor(...primaryColor);
  pdf.rect(0, 0, pageWidth, 40, 'F');
  
  // Logo/Icon
  pdf.setFontSize(32);
  pdf.text('🐝', 15, 25);
  
  // Title
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont(undefined, 'bold');
  pdf.text('BeeZee Finance', 35, 20);
  
  pdf.setFontSize(14);
  pdf.setFont(undefined, 'normal');
  pdf.text('Business Report', 35, 28);
  
  yPos = 50;

  // Report Period
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(16);
  pdf.setFont(undefined, 'bold');
  pdf.text('Report Period', 15, yPos);
  
  yPos += 8;
  pdf.setFontSize(12);
  pdf.setFont(undefined, 'normal');
  pdf.text(`${format(new Date(startDate), 'dd MMM yyyy')} - ${format(new Date(endDate), 'dd MMM yyyy')}`, 15, yPos);
  
  yPos += 15;

  // Summary Section
  const metrics = reportData.metrics || {};
  
  // Money In
  pdf.setFillColor(220, 252, 231);
  pdf.roundedRect(15, yPos, 180, 20, 3, 3, 'F');
  pdf.setFontSize(12);
  pdf.setTextColor(...greenColor);
  pdf.text('💰 Money In', 20, yPos + 7);
  pdf.setFontSize(18);
  pdf.setFont(undefined, 'bold');
  pdf.text(`R ${metrics.totalIncome?.toFixed(2) || '0.00'}`, 20, yPos + 15);
  
  yPos += 25;

  // Money Out
  pdf.setFillColor(254, 226, 226);
  pdf.roundedRect(15, yPos, 180, 20, 3, 3, 'F');
  pdf.setFontSize(12);
  pdf.setTextColor(...redColor);
  pdf.text('💸 Money Out', 20, yPos + 7);
  pdf.setFontSize(18);
  pdf.setFont(undefined, 'bold');
  pdf.text(`R ${metrics.totalExpenses?.toFixed(2) || '0.00'}`, 20, yPos + 15);
  
  yPos += 25;

  // Profit/Loss
  const isProfit = metrics.netProfit >= 0;
  pdf.setFillColor(isProfit ? 220 : 254, isProfit ? 252 : 226, isProfit ? 231 : 226);
  pdf.roundedRect(15, yPos, 180, 25, 3, 3, 'F');
  pdf.setFontSize(14);
  pdf.setTextColor(...(isProfit ? greenColor : redColor));
  pdf.text(isProfit ? '✅ Profit' : '⚠️ Loss', 20, yPos + 8);
  pdf.setFontSize(22);
  pdf.setFont(undefined, 'bold');
  pdf.text(`R ${Math.abs(metrics.netProfit || 0).toFixed(2)}`, 20, yPos + 18);
  
  yPos += 35;

  // AI Insights
  const aiInsights = reportData.aiInsights;
  if (aiInsights && aiInsights.insights) {
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(14);
    pdf.setFont(undefined, 'bold');
    pdf.text('💡 Key Insights', 15, yPos);
    
    yPos += 8;
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    
    aiInsights.insights.slice(0, 3).forEach((insight, index) => {
      const lines = pdf.splitTextToSize(`${index + 1}. ${insight}`, 170);
      pdf.text(lines, 20, yPos);
      yPos += lines.length * 5 + 3;
    });
  }

  yPos += 10;

  // Category Breakdown
  if (reportData.categoryBreakdown && yPos < pageHeight - 60) {
    pdf.setFontSize(14);
    pdf.setFont(undefined, 'bold');
    pdf.text('📊 Category Breakdown', 15, yPos);
    
    yPos += 8;

    const categories = Object.entries(reportData.categoryBreakdown)
      .map(([cat, data]) => ({ category: cat, ...data }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    pdf.setFontSize(9);
    pdf.setFont(undefined, 'normal');
    
    categories.forEach((cat) => {
      if (yPos > pageHeight - 30) return; // Stop if reaching bottom
      
      const color = cat.type === 'income' ? greenColor : redColor;
      pdf.setTextColor(...color);
      pdf.text(`• ${cat.category}`, 20, yPos);
      pdf.text(`R ${cat.total.toFixed(2)}`, 150, yPos, { align: 'right' });
      yPos += 5;
    });
  }

  // Footer
  pdf.setTextColor(150, 150, 150);
  pdf.setFontSize(8);
  pdf.text(`Generated on ${format(new Date(), 'dd MMM yyyy HH:mm')}`, 15, pageHeight - 15);
  pdf.text('BeeZee Finance - Business made simple', pageWidth / 2, pageHeight - 15, { align: 'center' });
  pdf.text('Page 1', pageWidth - 15, pageHeight - 15, { align: 'right' });

  // Save PDF
  const filename = `BeeZee-Report-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
  pdf.save(filename);
}

/**
 * Share report on WhatsApp
 * @param {Object} reportData - Report data
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 */
export async function shareReportOnWhatsApp(reportData, startDate, endDate) {
  const metrics = reportData.metrics || {};
  
  const period = `${format(new Date(startDate), 'dd MMM')} - ${format(new Date(endDate), 'dd MMM')}`;
  const profit = metrics.netProfit || 0;
  const isProfit = profit >= 0;
  
  const message = `
Check out my business report for ${period}! 

💰 Money In: R${(metrics.totalIncome || 0).toFixed(2)}
💸 Money Out: R${(metrics.totalExpenses || 0).toFixed(2)}
${isProfit ? '✅' : '⚠️'} ${isProfit ? 'Profit' : 'Loss'}: R${Math.abs(profit).toFixed(2)}

Generated with BeeZee Finance 🐝
  `.trim();

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
  
  window.open(whatsappUrl, '_blank');
}

/**
 * Generate report image for sharing
 * @param {HTMLElement} element - DOM element to convert
 * @returns {Promise<string>} Base64 image
 */
export async function generateReportImage(element) {
  const canvas = await html2canvas(element, {
    backgroundColor: '#ffffff',
    scale: 2,
    logging: false,
  });
  
  return canvas.toDataURL('image/png');
}

/**
 * Format currency for display
 * @param {number} amount - Amount
 * @returns {string} Formatted amount
 */
export function formatCurrency(amount) {
  return `R${amount.toFixed(2)}`;
}

/**
 * Calculate percentage change
 * @param {number} current - Current value
 * @param {number} previous - Previous value
 * @returns {number} Percentage change
 */
export function calculatePercentageChange(current, previous) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / Math.abs(previous)) * 100;
}

/**
 * Calculate percentage of total
 * @param {number} value - Value to calculate percentage for
 * @param {number} total - Total value
 * @returns {number} Percentage (0-100)
 */
export function calculatePercentageOfTotal(value, total) {
  if (total === 0) return 0;
  return (value / total) * 100;
}

/**
 * Calculate growth rate between periods
 * @param {number} currentPeriod - Current period value
 * @param {number} previousPeriod - Previous period value
 * @returns {object} { value: number, isPositive: boolean, formatted: string }
 */
export function calculateGrowthRate(currentPeriod, previousPeriod) {
  const change = calculatePercentageChange(currentPeriod, previousPeriod);
  return {
    value: Math.round(change * 10) / 10, // Round to 1 decimal
    isPositive: change >= 0,
    formatted: `${change >= 0 ? '+' : ''}${Math.round(change * 10) / 10}%`
  };
}

/**
 * Get color for amount
 * @param {number} amount - Amount
 * @param {boolean} isIncome - Is income
 * @returns {string} Color class
 */
export function getAmountColor(amount, isIncome = false) {
  if (isIncome) {
    return 'text-green-600';
  }
  return amount >= 0 ? 'text-green-600' : 'text-red-600';
}

