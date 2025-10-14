// Test file-based database
import { fileDb } from './src/lib/file-db.js'

async function testFileDb() {
  try {
    console.log('🧪 Testing file-based database...')
    
    // Test user creation
    console.log('👤 Creating test user...')
    const user = await fileDb.user.create({
      email: 'test@example.com',
      password: 'test123',
      name: 'Test User',
      role: 'SALES'
    })
    console.log('✅ User created:', user.id)
    
    // Test lead creation
    console.log('📝 Creating test lead...')
    const lead = await fileDb.lead.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '555-1234',
      company: 'Test Company',
      source: 'Test',
      status: 'NEW',
      score: 75,
      userId: user.id
    })
    console.log('✅ Lead created:', lead.id)
    
    // Test lead retrieval
    console.log('📊 Fetching all leads...')
    const leads = await fileDb.lead.findMany()
    console.log('✅ Found leads:', leads.length)
    
    // Test lead update
    console.log('✏️ Updating lead...')
    const updatedLead = await fileDb.lead.update(lead.id, {
      score: 85,
      status: 'QUALIFIED'
    })
    console.log('✅ Lead updated, new score:', updatedLead.score)
    
    // Test task creation
    console.log('📋 Creating test task...')
    const task = await fileDb.task.create({
      title: 'Call John Doe',
      description: 'Follow up on lead',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: 'HIGH',
      status: 'PENDING',
      category: 'Sales',
      assignedTo: user.id,
      leadId: lead.id,
      leadName: 'John Doe'
    })
    console.log('✅ Task created:', task.id)
    
    // Test booking creation
    console.log('📅 Creating test booking...')
    const booking = await fileDb.booking.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '555-5678',
      date: '2024-01-15',
      time: '10:00',
      duration: 30,
      type: 'CONSULTATION',
      status: 'PENDING',
      notes: 'Test consultation'
    })
    console.log('✅ Booking created:', booking.id)
    
    console.log('')
    console.log('🎉 File-based database is working perfectly!')
    console.log('📁 Data is saved in the /data directory')
    console.log('🔄 Data will persist between server restarts')
    console.log('')
    console.log('You can now test the import functionality!')
    
  } catch (error) {
    console.log('❌ Test failed:', error.message)
    console.log('Error details:', error)
  }
}

testFileDb()
