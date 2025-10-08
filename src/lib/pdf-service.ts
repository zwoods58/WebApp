import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export interface ReportData {
  title: string
  subtitle?: string
  date: string
  period: string
  company: {
    name: string
    address: string
    phone: string
    email: string
    website: string
  }
  client?: {
    name: string
    company: string
    email: string
    phone: string
  }
  summary: {
    totalRevenue: number
    totalProjects: number
    completedProjects: number
    activeClients: number
    newClients: number
  }
  metrics: {
    pageViews: number
    uniqueVisitors: number
    conversionRate: number
    bounceRate: number
    avgSessionDuration: number
  }
  projects: Array<{
    name: string
    status: string
    startDate: string
    endDate?: string
    budget: number
    progress: number
  }>
  clients: Array<{
    name: string
    company: string
    email: string
    status: string
    joinDate: string
    totalSpent: number
  }>
  topPages: Array<{
    page: string
    views: number
    bounceRate: string
  }>
  revenue: Array<{
    month: string
    revenue: number
    expenses: number
    profit: number
  }>
}

export class PDFReportService {
  private doc: jsPDF
  private currentY: number = 20
  private pageHeight: number = 280
  private margin: number = 20

  constructor() {
    this.doc = new jsPDF()
  }

  private addHeader(data: ReportData) {
    // Company Logo/Header
    this.doc.setFontSize(24)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text(data.company.name, this.margin, this.currentY)
    
    this.currentY += 10
    this.doc.setFontSize(12)
    this.doc.setFont('helvetica', 'normal')
    this.doc.text('Professional Web Development Services', this.margin, this.currentY)
    
    this.currentY += 5
    this.doc.text(data.company.address, this.margin, this.currentY)
    
    this.currentY += 5
    this.doc.text(`Phone: ${data.company.phone} | Email: ${data.company.email}`, this.margin, this.currentY)
    
    this.currentY += 5
    this.doc.text(`Website: ${data.company.website}`, this.margin, this.currentY)
    
    // Report Title
    this.currentY += 15
    this.doc.setFontSize(20)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text(data.title, this.margin, this.currentY)
    
    if (data.subtitle) {
      this.currentY += 8
      this.doc.setFontSize(14)
      this.doc.setFont('helvetica', 'normal')
      this.doc.text(data.subtitle, this.margin, this.currentY)
    }
    
    // Date and Period
    this.currentY += 10
    this.doc.setFontSize(10)
    this.doc.text(`Generated on: ${data.date}`, this.margin, this.currentY)
    this.doc.text(`Period: ${data.period}`, this.margin + 80, this.currentY)
    
    this.currentY += 15
  }

  private addClientInfo(data: ReportData) {
    if (data.client) {
      this.doc.setFontSize(14)
      this.doc.setFont('helvetica', 'bold')
      this.doc.text('Client Information', this.margin, this.currentY)
      
      this.currentY += 8
      this.doc.setFontSize(10)
      this.doc.setFont('helvetica', 'normal')
      this.doc.text(`Name: ${data.client.name}`, this.margin, this.currentY)
      this.currentY += 5
      this.doc.text(`Company: ${data.client.company}`, this.margin, this.currentY)
      this.currentY += 5
      this.doc.text(`Email: ${data.client.email}`, this.margin, this.currentY)
      this.currentY += 5
      this.doc.text(`Phone: ${data.client.phone}`, this.margin, this.currentY)
      
      this.currentY += 10
    }
  }

  private addSummary(data: ReportData) {
    this.doc.setFontSize(14)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('Executive Summary', this.margin, this.currentY)
    
    this.currentY += 8
    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'normal')
    
    const summaryData = [
      ['Total Revenue', `$${data.summary.totalRevenue.toLocaleString()}`],
      ['Total Projects', data.summary.totalProjects.toString()],
      ['Completed Projects', data.summary.completedProjects.toString()],
      ['Active Clients', data.summary.activeClients.toString()],
      ['New Clients', data.summary.newClients.toString()]
    ]
    
    summaryData.forEach(([label, value]) => {
      this.doc.text(`${label}:`, this.margin, this.currentY)
      this.doc.text(value, this.margin + 60, this.currentY)
      this.currentY += 5
    })
    
    this.currentY += 10
  }

  private addMetrics(data: ReportData) {
    this.doc.setFontSize(14)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('Website Metrics', this.margin, this.currentY)
    
    this.currentY += 8
    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'normal')
    
    const metricsData = [
      ['Page Views', data.metrics.pageViews.toLocaleString()],
      ['Unique Visitors', data.metrics.uniqueVisitors.toLocaleString()],
      ['Conversion Rate', `${data.metrics.conversionRate}%`],
      ['Bounce Rate', `${data.metrics.bounceRate}%`],
      ['Avg Session Duration', `${Math.floor(data.metrics.avgSessionDuration / 60)}m ${data.metrics.avgSessionDuration % 60}s`]
    ]
    
    metricsData.forEach(([label, value]) => {
      this.doc.text(`${label}:`, this.margin, this.currentY)
      this.doc.text(value, this.margin + 60, this.currentY)
      this.currentY += 5
    })
    
    this.currentY += 10
  }

  private addProjects(data: ReportData) {
    this.doc.setFontSize(14)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('Project Overview', this.margin, this.currentY)
    
    this.currentY += 8
    this.doc.setFontSize(8)
    this.doc.setFont('helvetica', 'normal')
    
    // Table headers
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('Project Name', this.margin, this.currentY)
    this.doc.text('Status', this.margin + 60, this.currentY)
    this.doc.text('Budget', this.margin + 90, this.currentY)
    this.doc.text('Progress', this.margin + 120, this.currentY)
    this.doc.text('Duration', this.margin + 150, this.currentY)
    
    this.currentY += 5
    this.doc.setFont('helvetica', 'normal')
    
    data.projects.slice(0, 8).forEach(project => {
      if (this.currentY > this.pageHeight - 20) {
        this.doc.addPage()
        this.currentY = 20
      }
      
      this.doc.text(project.name.length > 20 ? project.name.substring(0, 20) + '...' : project.name, this.margin, this.currentY)
      this.doc.text(project.status, this.margin + 60, this.currentY)
      this.doc.text(`$${project.budget.toLocaleString()}`, this.margin + 90, this.currentY)
      this.doc.text(`${project.progress}%`, this.margin + 120, this.currentY)
      
      const startDate = new Date(project.startDate)
      const endDate = project.endDate ? new Date(project.endDate) : new Date()
      const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      this.doc.text(`${duration}d`, this.margin + 150, this.currentY)
      
      this.currentY += 5
    })
    
    this.currentY += 10
  }

  private addClients(data: ReportData) {
    this.doc.setFontSize(14)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('Client Overview', this.margin, this.currentY)
    
    this.currentY += 8
    this.doc.setFontSize(8)
    this.doc.setFont('helvetica', 'normal')
    
    // Table headers
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('Client Name', this.margin, this.currentY)
    this.doc.text('Company', this.margin + 50, this.currentY)
    this.doc.text('Status', this.margin + 90, this.currentY)
    this.doc.text('Total Spent', this.margin + 120, this.currentY)
    this.doc.text('Join Date', this.margin + 150, this.currentY)
    
    this.currentY += 5
    this.doc.setFont('helvetica', 'normal')
    
    data.clients.slice(0, 8).forEach(client => {
      if (this.currentY > this.pageHeight - 20) {
        this.doc.addPage()
        this.currentY = 20
      }
      
      this.doc.text(client.name.length > 15 ? client.name.substring(0, 15) + '...' : client.name, this.margin, this.currentY)
      this.doc.text(client.company.length > 15 ? client.company.substring(0, 15) + '...' : client.company, this.margin + 50, this.currentY)
      this.doc.text(client.status, this.margin + 90, this.currentY)
      this.doc.text(`$${client.totalSpent.toLocaleString()}`, this.margin + 120, this.currentY)
      this.doc.text(new Date(client.joinDate).toLocaleDateString(), this.margin + 150, this.currentY)
      
      this.currentY += 5
    })
    
    this.currentY += 10
  }

  private addTopPages(data: ReportData) {
    this.doc.setFontSize(14)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('Top Performing Pages', this.margin, this.currentY)
    
    this.currentY += 8
    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'normal')
    
    data.topPages.slice(0, 5).forEach((page, index) => {
      this.doc.text(`${index + 1}. ${page.page}`, this.margin, this.currentY)
      this.doc.text(`${page.views.toLocaleString()} views`, this.margin + 80, this.currentY)
      this.doc.text(`${page.bounceRate} bounce`, this.margin + 120, this.currentY)
      this.currentY += 5
    })
    
    this.currentY += 10
  }

  private addRevenue(data: ReportData) {
    this.doc.setFontSize(14)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('Revenue Analysis', this.margin, this.currentY)
    
    this.currentY += 8
    this.doc.setFontSize(8)
    this.doc.setFont('helvetica', 'normal')
    
    // Table headers
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('Month', this.margin, this.currentY)
    this.doc.text('Revenue', this.margin + 40, this.currentY)
    this.doc.text('Expenses', this.margin + 80, this.currentY)
    this.doc.text('Profit', this.margin + 120, this.currentY)
    this.doc.text('Margin', this.margin + 160, this.currentY)
    
    this.currentY += 5
    this.doc.setFont('helvetica', 'normal')
    
    data.revenue.slice(0, 6).forEach(month => {
      if (this.currentY > this.pageHeight - 20) {
        this.doc.addPage()
        this.currentY = 20
      }
      
      const margin = ((month.revenue - month.expenses) / month.revenue * 100).toFixed(1)
      
      this.doc.text(month.month, this.margin, this.currentY)
      this.doc.text(`$${month.revenue.toLocaleString()}`, this.margin + 40, this.currentY)
      this.doc.text(`$${month.expenses.toLocaleString()}`, this.margin + 80, this.currentY)
      this.doc.text(`$${month.profit.toLocaleString()}`, this.margin + 120, this.currentY)
      this.doc.text(`${margin}%`, this.margin + 160, this.currentY)
      
      this.currentY += 5
    })
    
    this.currentY += 10
  }

  private addFooter() {
    const pageCount = (this.doc as any).internal.getNumberOfPages()
    
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i)
      this.doc.setFontSize(8)
      this.doc.setFont('helvetica', 'normal')
      this.doc.text(`Page ${i} of ${pageCount}`, this.margin, this.pageHeight + 10)
      this.doc.text('Powered by AtarWebb Solutions', this.doc.internal.pageSize.width - this.margin - 80, this.pageHeight + 10)
    }
  }

  public generateReport(data: ReportData): jsPDF {
    this.currentY = 20
    
    this.addHeader(data)
    this.addClientInfo(data)
    this.addSummary(data)
    this.addMetrics(data)
    this.addProjects(data)
    this.addClients(data)
    this.addTopPages(data)
    this.addRevenue(data)
    this.addFooter()
    
    return this.doc
  }

  public downloadReport(data: ReportData, filename: string = 'report.pdf') {
    const doc = this.generateReport(data)
    doc.save(filename)
  }

  public async generateFromElement(elementId: string, filename: string = 'report.pdf') {
    const element = document.getElementById(elementId)
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found`)
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    
    const imgWidth = 210
    const pageHeight = 295
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight

    let position = 0

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    pdf.save(filename)
  }
}

export default PDFReportService
