/**
 * Security Audit Logging
 * 
 * Track all authentication events for security monitoring and compliance.
 * Never delete audit logs.
 */

export type AuditEventType =
    | 'signup_success'
    | 'signup_fail'
    | 'login_success'
    | 'login_fail'
    | 'pin_reset'
    | 'account_locked'
    | 'session_revoked'
    | 'verification_sent'
    | 'verification_failed';

/**
 * Log authentication event
 * 
 * @param supabase - Supabase client
 * @param event - Event details
 */
export async function logAuditEvent(
    supabase: any,
    event: {
        userId?: string;
        phone?: string;
        eventType: AuditEventType;
        ipAddress?: string;
        userAgent?: string;
        countryCode?: string;
        metadata?: Record<string, any>;
    }
) {
    try {
        await supabase
            .from('auth_audit_log')
            .insert({
                user_id: event.userId || null,
                phone_number: event.phone || null,
                event_type: event.eventType,
                ip_address: event.ipAddress || null,
                user_agent: event.userAgent || null,
                country_code: event.countryCode || null,
                metadata: event.metadata || {}
            });
    } catch (error) {
        console.error('Failed to log audit event:', error);
        // Don't throw - audit logging should never break the main flow
    }
}

/**
 * Extract IP address from request
 * 
 * @param req - Request object
 * @returns IP address
 */
export function getIpAddress(req: Request): string {
    const xForwardedFor = req.headers.get('x-forwarded-for');
    const xRealIp = req.headers.get('x-real-ip');
    const cfConnectingIp = req.headers.get('cf-connecting-ip');

    if (cfConnectingIp) return cfConnectingIp;
    if (xRealIp) return xRealIp;
    if (xForwardedFor) {
        return xForwardedFor.split(',')[0].trim();
    }

    return 'unknown';
}

/**
 * Get user agent from request
 * 
 * @param req - Request object
 * @returns User agent string
 */
export function getUserAgent(req: Request): string {
    return req.headers.get('user-agent') || 'unknown';
}
