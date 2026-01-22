const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase admin client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Middleware to verify Supabase authentication
 */
function verifySupabaseAuth(req, res, next) {
  const supabaseSecret = req.get('X-SUPABASE-SECRET');
  
  if (!supabaseSecret) {
    return res.status(401).json({
      error: 'Missing Authentication',
      message: 'X-SUPABASE-SECRET header is required',
      timestamp: new Date().toISOString()
    });
  }

  // In production, you might want to verify against a stored secret
  const expectedSecret = process.env.SUPABASE_SECRET;
  if (supabaseSecret !== expectedSecret) {
    return res.status(401).json({
      error: 'Invalid Authentication',
      message: 'Invalid Supabase secret',
      timestamp: new Date().toISOString()
    });
  }

  // Attach Supabase client to request for use in routes
  req.supabase = supabase;
  next();
}

module.exports = verifySupabaseAuth;
