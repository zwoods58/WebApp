/**
 * Setup Admin User Script
 * 
 * This script creates the admin user in Supabase Auth and sets the account tier to 'admin'
 * 
 * Usage:
 *   node scripts/setup-admin.js
 * 
 * Make sure to set these environment variables:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY (from Supabase Dashboard > Settings > API)
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing Supabase environment variables')
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

// Use service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function setupAdminUser() {
  const adminEmail = 'admin@atarwebb.com'
  const adminPassword = 'Royalblue#28'

  try {
    console.log('Setting up admin user...')

    // Check if user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers()
    const existingUser = existingUsers?.users?.find(u => u.email === adminEmail)

    let userId

    if (existingUser) {
      console.log('Admin user already exists, updating...')
      userId = existingUser.id

      // Update password
      await supabase.auth.admin.updateUserById(userId, {
        password: adminPassword
      })
      console.log('✓ Password updated')
    } else {
      // Create new user
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          full_name: 'AtarWebb Admin'
        }
      })

      if (createError) throw createError
      userId = newUser.user.id
      console.log('✓ Admin user created')
    }

    // Wait a bit for the trigger to create user_accounts record
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Update account tier to admin
    const { error: updateError } = await supabase
      .from('user_accounts')
      .update({ account_tier: 'admin' })
      .eq('id', userId)

    if (updateError) {
      // If user_accounts doesn't exist yet, create it
      const { error: insertError } = await supabase
        .from('user_accounts')
        .insert({
          id: userId,
          email: adminEmail,
          account_tier: 'admin',
          full_name: 'AtarWebb Admin'
        })

      if (insertError) throw insertError
      console.log('✓ Admin account tier set')
    } else {
      console.log('✓ Admin account tier updated')
    }

    console.log('\n✅ Admin user setup complete!')
    console.log(`   Email: ${adminEmail}`)
    console.log(`   Password: ${adminPassword}`)
    console.log('\nYou can now login at: /admin/login')

  } catch (error) {
    console.error('Error setting up admin user:', error)
    process.exit(1)
  }
}

setupAdminUser()


