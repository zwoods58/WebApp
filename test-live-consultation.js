// Test the live consultation form submission
async function testLiveConsultation() {
  try {
    console.log('Testing live consultation form...')
    
    // Create FormData exactly like the website form
    const formData = new FormData()
    formData.append('name', 'Live Test User')
    formData.append('email', 'woodszebulun502@gmail.com')
    formData.append('phone', '555-1234')
    formData.append('company', 'Test Company')
    formData.append('projectDetails', 'Testing live consultation form')
    formData.append('preferredDate', '2024-01-25')
    formData.append('preferredTime', '14:00')
    
    console.log('Submitting to live website...')
    
    const response = await fetch('https://atarwebb.com/api/consultation/submit', {
      method: 'POST',
      body: formData
    })
    
    console.log('Response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))
    
    const result = await response.json()
    console.log('Response body:', result)
    
    if (response.ok) {
      console.log('✅ Live consultation form submission successful!')
      console.log('📧 Check your email inboxes:')
      console.log('   1. Admin notification: admin@atarwebb.com')
      console.log('   2. Client confirmation: woodszebulun502@gmail.com')
      console.log('')
      console.log('💡 If you received these emails:')
      console.log('   - The API is working correctly')
      console.log('   - The issue is with the website form interface')
      console.log('')
      console.log('💡 If you didn\'t receive these emails:')
      console.log('   - Check spam folder')
      console.log('   - There might be an email delivery issue')
    } else {
      console.log('❌ Live consultation form submission failed:', result.error)
    }
    
  } catch (error) {
    console.error('❌ Error testing live consultation:', error)
  }
}

testLiveConsultation()
