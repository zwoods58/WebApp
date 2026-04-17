import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

interface SecurityEvent {
  id: string;
  type: 'rate_limit' | 'invalid_token' | 'brute_force' | 'xss_attempt' | 'sql_injection';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  ip: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

// In-memory storage for security events (in production, use database or external service)
const securityEvents: SecurityEvent[] = [];
const MAX_EVENTS = 1000;

/**
 * Log a security event
 */
export function logSecurityEvent(event: Omit<SecurityEvent, 'id' | 'timestamp'>) {
  const securityEvent: SecurityEvent = {
    ...event,
    id: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
    timestamp: new Date().toISOString()
  };

  securityEvents.unshift(securityEvent);

  // Keep only recent events
  if (securityEvents.length > MAX_EVENTS) {
    securityEvents.pop();
  }

  // In production, also send to external monitoring service
  if (process.env.NODE_ENV === 'production') {
    // TODO: Send to Sentry, DataDog, etc.
    console.warn('[SECURITY EVENT]', securityEvent);
  }
}

/**
 * GET /api/admin/monitoring/security-events
 * Retrieve recent security events
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const severity = url.searchParams.get('severity');
    const type = url.searchParams.get('type');

    // Filter events
    let filteredEvents = [...securityEvents];

    if (severity) {
      filteredEvents = filteredEvents.filter(e => e.severity === severity);
    }

    if (type) {
      filteredEvents = filteredEvents.filter(e => e.type === type);
    }

    // Get events from last 24 hours
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    filteredEvents = filteredEvents.filter(e => 
      new Date(e.timestamp).getTime() > oneDayAgo
    );

    // Limit results
    filteredEvents = filteredEvents.slice(0, limit);

    return NextResponse.json(filteredEvents);

  } catch (error) {
    console.error('Failed to fetch security events:', error);
    return NextResponse.json({
      error: 'Failed to fetch security events'
    }, { status: 500 });
  }
}

/**
 * POST /api/admin/monitoring/security-events
 * Log a new security event
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { type, severity, message, ip, metadata } = body;

    if (!type || !severity || !message || !ip) {
      return NextResponse.json({
        error: 'Missing required fields'
      }, { status: 400 });
    }

    logSecurityEvent({
      type,
      severity,
      message,
      ip,
      metadata
    });

    return NextResponse.json({
      success: true,
      message: 'Security event logged'
    });

  } catch (error) {
    console.error('Failed to log security event:', error);
    return NextResponse.json({
      error: 'Failed to log security event'
    }, { status: 500 });
  }
}

