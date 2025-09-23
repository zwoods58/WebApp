// Simple test script to verify payment system
const testPaymentSystem = async () => {
  console.log('🧪 Testing Payment System...\n')

  try {
    // Test 1: Generate test consultations
    console.log('1️⃣ Generating test consultations...')
    const consultationResponse = await fetch('http://localhost:3000/api/test/generate-consultations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ count: 3 })
    })
    
    if (consultationResponse.ok) {
      const consultationData = await consultationResponse.json()
      console.log('✅ Generated', consultationData.consultations.length, 'test consultations')
    } else {
      console.log('❌ Failed to generate consultations')
    }

    // Test 2: Check dashboard data
    console.log('\n2️⃣ Checking dashboard data...')
    const dashboardResponse = await fetch('http://localhost:3000/api/dashboard')
    
    if (dashboardResponse.ok) {
      const dashboardData = await dashboardResponse.json()
      console.log('✅ Dashboard data loaded successfully')
      console.log('   - Pending requests:', dashboardData.data.stats.pendingRequests)
      console.log('   - Active projects:', dashboardData.data.stats.activeProjects)
      console.log('   - Total revenue:', dashboardData.data.stats.totalRevenue)
    } else {
      console.log('❌ Failed to load dashboard data')
    }

    // Test 3: Test payment intent creation (without actual payment)
    console.log('\n3️⃣ Testing payment intent creation...')
    const paymentResponse = await fetch('http://localhost:3000/api/payments/create-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 1000,
        consultationId: 'TEST-001',
        clientEmail: 'test@example.com',
        clientName: 'Test Client',
        serviceType: 'Web Development'
      })
    })

    if (paymentResponse.ok) {
      const paymentData = await paymentResponse.json()
      console.log('✅ Payment intent created successfully')
      console.log('   - Client Secret:', paymentData.clientSecret ? 'Generated' : 'Missing')
      console.log('   - Deposit Amount:', paymentData.depositAmount)
    } else {
      const errorData = await paymentResponse.json()
      console.log('❌ Failed to create payment intent:', errorData.error)
    }

    console.log('\n🎉 Payment system test completed!')
    console.log('\n📋 Next steps:')
    console.log('   1. Go to http://localhost:3000/admin')
    console.log('   2. Click "Test Payments" button')
    console.log('   3. Use test card: 4242 4242 4242 4242')
    console.log('   4. Monitor real-time updates in admin dashboard')

  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

// Run the test
testPaymentSystem()
