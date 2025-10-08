// Setup script to create admin user
// Run this script to set up the admin user with the specified credentials

const { createClient } = require('@supabase/supabase-js')

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration!')
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env.local file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupAdminUser() {
  try {
    console.log('🚀 Setting up admin user...')
    
    // Create admin user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@atarwebb.com',
      password: 'Atarwebroyalblue#28',
      email_confirm: true,
      user_metadata: {
        full_name: 'AtarWebb Admin',
        role: 'admin'
      }
    })

    if (authError) {
      console.error('❌ Error creating auth user:', authError.message)
      return
    }

    console.log('✅ Admin user created in Supabase Auth:', authData.user.email)

    // Create user record in our users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: 'admin@atarwebb.com',
        full_name: 'AtarWebb Admin',
        role: 'admin',
        status: 'active'
      })
      .select()
      .single()

    if (userError) {
      console.error('❌ Error creating user record:', userError.message)
      return
    }

    console.log('✅ User record created in database:', userData.email)

    // Create some sample data
    console.log('📊 Creating sample data...')
    
    // Sample project request
    const { error: projectRequestError } = await supabase
      .from('project_requests')
      .insert({
        name: 'John Smith',
        email: 'john@example.com',
        phone: '+1-555-0123',
        company: 'Acme Corp',
        project_type: 'E-commerce Website',
        budget: '$10,000 - $25,000',
        timeline: '2-3 months',
        description: 'We need a modern e-commerce website for our online store with payment integration and inventory management.',
        requirements: 'Must support multiple payment methods, mobile responsive, SEO optimized',
        status: 'new'
      })

    if (projectRequestError) {
      console.log('⚠️  Project request creation failed (may already exist):', projectRequestError.message)
    } else {
      console.log('✅ Sample project request created')
    }

    // Sample client
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .insert({
        name: 'Jane Doe',
        email: 'jane@techstartup.com',
        phone: '+1-555-0456',
        company: 'TechStartup Inc',
        status: 'client',
        source: 'Website Contact Form',
        notes: 'High priority client, interested in multiple projects',
        user_id: authData.user.id
      })
      .select()
      .single()

    if (clientError) {
      console.log('⚠️  Client creation failed (may already exist):', clientError.message)
    } else {
      console.log('✅ Sample client created')
    }

    // Sample project
    if (clientData) {
      const { error: projectError } = await supabase
        .from('projects')
        .insert({
          title: 'TechStartup Website Redesign',
          description: 'Complete redesign of the company website with modern UI/UX and improved performance',
          status: 'in_progress',
          priority: 'high',
          budget: 15000,
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 3 months from now
          client_id: clientData.id,
          user_id: authData.user.id
        })

      if (projectError) {
        console.log('⚠️  Project creation failed (may already exist):', projectError.message)
      } else {
        console.log('✅ Sample project created')
      }
    }

    // Sample analytics data
    const { error: analyticsError } = await supabase
      .from('analytics')
      .insert([
        {
          page: '/admin',
          event: 'page_view',
          user_id: authData.user.id,
          session_id: 'session_001',
          metadata: { source: 'direct' }
        },
        {
          page: '/admin',
          event: 'button_click',
          user_id: authData.user.id,
          session_id: 'session_001',
          metadata: { button: 'refresh_data' }
        },
        {
          page: '/admin/requests',
          event: 'page_view',
          user_id: authData.user.id,
          session_id: 'session_001',
          metadata: { tab: 'requests' }
        }
      ])

    if (analyticsError) {
      console.log('⚠️  Analytics data creation failed (may already exist):', analyticsError.message)
    } else {
      console.log('✅ Sample analytics data created')
    }

    // Create welcome notification
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert({
        type: 'system',
        recipient_email: 'admin@atarwebb.com',
        recipient_name: 'AtarWebb Admin',
        subject: 'Admin Account Setup Complete',
        message: 'Your admin account has been successfully set up. You can now access the admin dashboard with your credentials.',
        status: 'sent',
        priority: 'high'
      })

    if (notificationError) {
      console.log('⚠️  Notification creation failed (may already exist):', notificationError.message)
    } else {
      console.log('✅ Welcome notification created')
    }

    console.log('\n🎉 Admin setup complete!')
    console.log('📧 Email: admin@atarwebb.com')
    console.log('🔑 Password: Atarwebroyalblue#28')
    console.log('\n🌐 You can now login to your admin dashboard at:')
    console.log('https://web-j6766d0lx-zwoods58s-projects.vercel.app/admin')

  } catch (error) {
    console.error('❌ Setup failed:', error.message)
  }
}

// Run the setup
setupAdminUser()
