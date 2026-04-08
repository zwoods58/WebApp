// =====================================================
// EDGE FUNCTION: Archive Old Data
// PURPOSE: Runs weekly to archive data older than 3 months
// DEPLOY: supabase functions deploy archive-old-data
// SCHEDULE: Weekly via cron-job.org or Supabase Dashboard
// =====================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

interface ArchiveResult {
  success: boolean;
  archive_date?: string;
  rows_archived?: number;
  error?: string;
  timestamp: string;
}

serve(async (req: Request) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Verify authorization header (optional security)
  const authHeader = req.headers.get('Authorization');
  const expectedToken = Deno.env.get('ARCHIVE_WEBHOOK_SECRET');
  
  if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Initialize Supabase client with service role
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    console.log('Starting archive process...');

    // Call the archive function
    const { data, error } = await supabaseAdmin.rpc('archive_old_data');

    if (error) {
      console.error('Archive function error:', error);
      throw new Error(error.message);
    }

    console.log('Archive completed:', data);

    // Log the archive operation
    await supabaseAdmin
      .from('system_settings')
      .upsert({
        key: 'last_archive_run_details',
        value: JSON.stringify({
          timestamp: new Date().toISOString(),
          result: data,
          status: 'success',
        }),
      });

    // Send notification (optional - can add Slack/Discord webhook)
    const webhookUrl = Deno.env.get('ALERT_WEBHOOK_URL');
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `Archive completed successfully\nTimestamp: ${new Date().toISOString()}\nResult: ${JSON.stringify(data)}`,
        }),
      });
    }

    const result: ArchiveResult = {
      success: true,
      archive_date: data?.archive_date,
      timestamp: new Date().toISOString(),
    };

    return new Response(
      JSON.stringify(result),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        } 
      }
    );

  } catch (error) {
    console.error('Archive failed:', error);

    // Send error notification
    const webhookUrl = Deno.env.get('ALERT_WEBHOOK_URL');
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `Archive failed!\nError: ${error.message}\nTimestamp: ${new Date().toISOString()}`,
        }),
      });
    }

    const result: ArchiveResult = {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    };

    return new Response(
      JSON.stringify(result),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
});
