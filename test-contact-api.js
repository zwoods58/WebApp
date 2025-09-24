// Test the contact form API
async function testContactAPI() {
  try {
    console.log('Testing contact form API...')
    
    // Create FormData exactly like the contact form
    const formData = new FormData()
    formData.append('name', 'Test Contact User')
    formData.append('email', 'woodszebulun502@gmail.com')
    formData.append('phone', '555-1234')
    formData.append('company', 'Test Company')
    formData.append('projectType', 'Business Website')
    formData.append('budget', '$1,000 - $2,500')
    formData.append('timeline', 'Within 1 month')
    formData.append('description', 'Testing contact form API submission')
    formData.append('requirements', 'Need a modern, responsive website')
    
    console.log('Submitting to contact API...')
    
    const response = await fetch('https://atarweb.com/api/project-request/submit', {
      method: 'POST',
      body: formData
    })
    
    console.log('Response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))
    
    const result = await response.json()
    console.log('Response body:', result)
    
    if (response.ok) {
      console.log('✅ Contact form API submission successful!')
      console.log('📧 Check your email inboxes:')
      console.log('   1. Admin notification: admin@atarweb.com')
      console.log('   2. Client confirmation: woodszebulun502@gmail.com')
      console.log('')
      console.log('💡 If you received these emails:')
      console.log('   - The contact form API is working correctly')
      console.log('   - Both admin and client emails are being sent')
      console.log('')
      console.log('💡 If you didn\'t receive these emails:')
      console.log('   - Check spam folder')
      console.log('   - There might be an email delivery issue')
    } else {
      console.log('❌ Contact form API submission failed:', result.error)
    }
    
  } catch (error) {
    console.error('❌ Error testing contact API:', error)
  }
}

testContactAPI()
