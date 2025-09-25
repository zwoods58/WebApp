import { supabase } from './supabase'

export async function seedSampleData() {
  try {
    console.log('🌱 Seeding sample data...')

    // Seed analytics data
    const analyticsData = []
    for (let i = 0; i < 30; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      
      analyticsData.push({
        page: '/',
        event: 'page_view',
        page_views: Math.floor(Math.random() * 100) + 50,
        unique_visitors: Math.floor(Math.random() * 50) + 25,
        bounce_rate: Math.floor(Math.random() * 20) + 20,
        avg_session_duration: Math.floor(Math.random() * 200) + 120,
        conversion_rate: Math.floor(Math.random() * 3) + 1,
        device_type: ['Desktop', 'Mobile', 'Tablet'][Math.floor(Math.random() * 3)],
        created_at: date.toISOString()
      })
    }

    await supabase.from('analytics').insert(analyticsData)
    console.log('✅ Analytics data seeded')

    // Seed project requests
    const projectRequests = []
    for (let i = 1; i <= 15; i++) {
      projectRequests.push({
        name: `Client ${i}`,
        email: `client${i}@example.com`,
        company: `Company ${i}`,
        phone: `+1-555-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        project_type: ['Web App', 'E-commerce', 'API Development'][Math.floor(Math.random() * 3)],
        budget: ['$5,000 - $10,000', '$10,000 - $25,000', '$25,000 - $50,000', '$50,000+'][Math.floor(Math.random() * 4)],
        timeline: ['1-3 months', '3-6 months', '6-12 months', '12+ months'][Math.floor(Math.random() * 4)],
        description: `Project description for client ${i}`,
        requirements: `Requirements for project ${i}`,
        status: ['new', 'in_progress', 'completed', 'cancelled'][Math.floor(Math.random() * 4)],
        created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      })
    }

    await supabase.from('project_requests').insert(projectRequests)
    console.log('✅ Project requests seeded')

    // Seed clients
    const clients = []
    for (let i = 1; i <= 20; i++) {
      clients.push({
        name: `Client ${i}`,
        email: `client${i}@example.com`,
        company: `Company ${i}`,
        phone: `+1-555-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        status: ['active', 'inactive', 'lead'][Math.floor(Math.random() * 3)],
        source: ['Google Search', 'Social Media', 'Referral', 'Direct', 'Email'][Math.floor(Math.random() * 5)],
        created_at: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString()
      })
    }

    await supabase.from('clients').insert(clients)
    console.log('✅ Clients seeded')

    // Seed projects
    const projects = []
    for (let i = 1; i <= 12; i++) {
      projects.push({
        title: `Project ${i}`,
        description: `Description for project ${i}`,
        status: ['planning', 'in_progress', 'completed', 'on_hold'][Math.floor(Math.random() * 4)],
        priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
        start_date: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
        end_date: Math.random() > 0.3 ? new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : null,
        budget: Math.floor(Math.random() * 50000) + 10000,
        client_id: Math.floor(Math.random() * 20) + 1,
        created_at: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString()
      })
    }

    await supabase.from('projects').insert(projects)
    console.log('✅ Projects seeded')

    // Seed invoices
    const invoices = []
    for (let i = 1; i <= 25; i++) {
      invoices.push({
        invoice_number: `INV-${String(i).padStart(4, '0')}`,
        amount: Math.floor(Math.random() * 25000) + 5000,
        status: ['draft', 'sent', 'paid', 'overdue'][Math.floor(Math.random() * 4)],
        due_date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        client_id: Math.floor(Math.random() * 20) + 1,
        created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      })
    }

    await supabase.from('invoices').insert(invoices)
    console.log('✅ Invoices seeded')

    // Seed files
    const files = []
    for (let i = 1; i <= 30; i++) {
      files.push({
        filename: `file_${i}.pdf`,
        original_filename: `Document ${i}.pdf`,
        file_size: Math.floor(Math.random() * 5000000) + 100000,
        file_type: 'application/pdf',
        project_id: Math.floor(Math.random() * 12) + 1,
        client_id: Math.floor(Math.random() * 20) + 1,
        created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      })
    }

    await supabase.from('files').insert(files)
    console.log('✅ Files seeded')

    // Seed notifications
    const notifications = []
    for (let i = 1; i <= 20; i++) {
      notifications.push({
        title: `Notification ${i}`,
        message: `This is notification message ${i}`,
        type: ['info', 'warning', 'success', 'error'][Math.floor(Math.random() * 4)],
        status: ['unread', 'read'][Math.floor(Math.random() * 2)],
        created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      })
    }

    await supabase.from('notifications').insert(notifications)
    console.log('✅ Notifications seeded')

    console.log('🎉 Sample data seeding completed!')
    return true
  } catch (error) {
    console.error('❌ Error seeding data:', error)
    return false
  }
}

export default seedSampleData
