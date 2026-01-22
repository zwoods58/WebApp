import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * PDF Generator for Invoices and Receipts
 * Professional template with company branding and proper formatting
 */

export const generateInvoicePDF = async (documentData) => {
  const { 
    type, 
    number, 
    issueDate, 
    dueDate, 
    companyInfo, 
    clientInfo, 
    items, 
    taxRate, 
    subtotal, 
    taxAmount, 
    totalAmount, 
    notes 
  } = documentData;

  // Create PDF document
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  // Set font
  pdf.setFont('helvetica');
  
  // Colors
  const primaryColor = [59, 130, 246]; // Blue
  const textColor = [31, 41, 55]; // Dark gray
  const lightGray = [243, 244, 246]; // Light background
  
  // Header Section
  pdf.setFillColor(...primaryColor);
  pdf.rect(0, 0, pageWidth, 80, 'F');
  
  // Company Logo Placeholder (you can replace with actual logo)
  pdf.setFillColor(255, 255, 255);
  pdf.circle(30, 40, 15, 'F');
  pdf.setFontSize(10);
  pdf.setTextColor(...primaryColor);
  pdf.text('LOGO', 30, 43, { align: 'center' });
  
  // Document Title
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text(type === 'invoice' ? 'INVOICE' : 'RECEIPT', pageWidth - 30, 30, { align: 'right' });
  
  // Document Number
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`#${number}`, pageWidth - 30, 40, { align: 'right' });
  
  // Company Information Box
  pdf.setFillColor(...lightGray);
  pdf.rect(20, 90, pageWidth - 40, 60, 'F');
  
  pdf.setTextColor(...textColor);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('FROM:', 30, 105);
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  let yPos = 115;
  if (companyInfo.name) pdf.text(companyInfo.name, 30, yPos);
  if (companyInfo.email) pdf.text(companyInfo.email, 30, yPos + 8);
  if (companyInfo.phone) pdf.text(companyInfo.phone, 30, yPos + 16);
  if (companyInfo.address) pdf.text(companyInfo.address, 30, yPos + 24);
  
  // Client Information Box
  pdf.setFillColor(...lightGray);
  pdf.rect(20, 160, pageWidth - 40, 60, 'F');
  
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.text('TO:', 30, 175);
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  yPos = 185;
  if (clientInfo.name) pdf.text(clientInfo.name, 30, yPos);
  if (clientInfo.email) pdf.text(clientInfo.email, 30, yPos + 8);
  if (clientInfo.phone) pdf.text(clientInfo.phone, 30, yPos + 16);
  if (clientInfo.address) pdf.text(clientInfo.address, 30, yPos + 24);
  
  // Document Details
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.text('DOCUMENT DETAILS', 30, 235);
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.text(`Issue Date: ${formatDate(issueDate)}`, 30, 245);
  if (type === 'invoice' && dueDate) {
    pdf.text(`Due Date: ${formatDate(dueDate)}`, 30, 255);
  }
  
  // Items Table
  const tableData = items.map(item => [
    item.description || '',
    item.quantity.toString(),
    `R${item.unitPrice.toFixed(2)}`,
    `R${item.total.toFixed(2)}`
  ]);
  
  pdf.autoTable({
    head: [['Description', 'Quantity', 'Unit Price', 'Total']],
    body: tableData,
    startY: 270,
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 10,
      textColor: textColor,
      lineColor: [229, 231, 235],
      fillColor: [255, 255, 255]
    },
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251]
    },
    margin: { left: 20, right: 20 }
  });
  
  // Totals Section
  const finalY = pdf.lastAutoTable.finalY + 20;
  
  // Draw totals box
  pdf.setFillColor(...lightGray);
  pdf.rect(pageWidth - 120, finalY, 100, 80, 'F');
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.text('Subtotal:', pageWidth - 110, finalY + 15);
  pdf.text(`R${subtotal.toFixed(2)}`, pageWidth - 30, finalY + 15, { align: 'right' });
  
  pdf.text(`Tax (${taxRate}%):`, pageWidth - 110, finalY + 30);
  pdf.text(`R${taxAmount.toFixed(2)}`, pageWidth - 30, finalY + 30, { align: 'right' });
  
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.text('TOTAL:', pageWidth - 110, finalY + 50);
  pdf.text(`R${totalAmount.toFixed(2)}`, pageWidth - 30, finalY + 50, { align: 'right' });
  
  // Notes Section
  if (notes) {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text('NOTES:', 30, finalY + 100);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    const splitNotes = pdf.splitTextToSize(notes, pageWidth - 60);
    pdf.text(splitNotes, 30, finalY + 110);
  }
  
  // Footer
  pdf.setFont('helvetica', 'italic');
  pdf.setFontSize(8);
  pdf.setTextColor(156, 163, 175);
  pdf.text('Thank you for your business!', pageWidth / 2, pageHeight - 20, { align: 'center' });
  pdf.text(`Generated on ${formatDate(new Date().toISOString().split('T')[0])}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
  
  // Save the PDF
  const fileName = `${type}-${number}.pdf`;
  pdf.save(fileName);
  
  return fileName;
};

export const generateReportPDF = async (reportData) => {
  const { 
    startDate, 
    endDate, 
    income, 
    expenses, 
    profit, 
    transactions,
    categories 
  } = reportData;

  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  
  pdf.setFont('helvetica');
  
  // Header
  pdf.setFillColor(59, 130, 246);
  pdf.rect(0, 0, pageWidth, 60, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('FINANCIAL REPORT', pageWidth / 2, 30, { align: 'center' });
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`${formatDate(startDate)} - ${formatDate(endDate)}`, pageWidth / 2, 45, { align: 'center' });
  
  // Summary Section
  pdf.setTextColor(31, 41, 55);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  pdf.text('SUMMARY', 30, 80);
  
  pdf.setFillColor(243, 244, 246);
  pdf.rect(20, 90, pageWidth - 40, 60, 'F');
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(12);
  pdf.text(`Total Income: R${income.toFixed(2)}`, 30, 110);
  pdf.text(`Total Expenses: R${expenses.toFixed(2)}`, 30, 125);
  pdf.text(`Net Profit: R${profit.toFixed(2)}`, 30, 140);
  
  // Category Breakdown
  if (categories && categories.length > 0) {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.text('CATEGORY BREAKDOWN', 30, 170);
    
    const categoryData = categories.map(cat => [
      cat.name,
      `R${cat.amount.toFixed(2)}`,
      `${cat.percentage}%`
    ]);
    
    pdf.autoTable({
      head: [['Category', 'Amount', 'Percentage']],
      body: categoryData,
      startY: 180,
      theme: 'grid',
      styles: {
        font: 'helvetica',
        fontSize: 10,
        textColor: [31, 41, 55]
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      margin: { left: 20, right: 20 }
    });
  }
  
  // Transactions List
  if (transactions && transactions.length > 0) {
    const transactionData = transactions.map(t => [
      formatDate(t.date),
      t.description,
      t.category,
      t.type === 'income' ? `+R${t.amount.toFixed(2)}` : `-R${t.amount.toFixed(2)}`
    ]);
    
    pdf.autoTable({
      head: [['Date', 'Description', 'Category', 'Amount']],
      body: transactionData,
      startY: pdf.lastAutoTable ? pdf.lastAutoTable.finalY + 20 : 250,
      theme: 'grid',
      styles: {
        font: 'helvetica',
        fontSize: 9,
        textColor: [31, 41, 55]
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      margin: { left: 20, right: 20 }
    });
  }
  
  // Save the PDF
  const fileName = `financial-report-${formatDate(startDate)}-${formatDate(endDate)}.pdf`;
  pdf.save(fileName);
  
  return fileName;
};

// Helper function to format dates
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
