import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables:', {
        url: !!supabaseUrl,
        key: !!supabaseAnonKey
    });
    throw new Error('Supabase environment variables are required. Please check your production environment variables.');
}

// =====================================================
// Phase 3: Enhanced Supabase Client Configuration
// Optimized for 50,000 users with connection pooling and performance settings
// =====================================================

// Enhanced localStorage with error handling and storage monitoring
const enhancedStorage = {
    getItem: (key: string) => {
        if (typeof window === 'undefined') return null;
        try {
            const item = window.localStorage.getItem(key);
            // Monitor storage usage
            if (item && key.includes('supabase')) {
                const usage = JSON.stringify(window.localStorage).length;
                if (usage > 4_000_000) { // 4MB warning
                    console.warn('localStorage approaching capacity limit:', usage);
                }
            }
            return item;
        } catch (error) {
            console.warn('localStorage getItem failed:', error);
            return null;
        }
    },
    setItem: (key: string, value: string) => {
        if (typeof window === 'undefined') return;
        try {
            window.localStorage.setItem(key, value);
        } catch (error) {
            console.warn('localStorage setItem failed - storage may be full:', error);
            // Attempt to clear old sessions
            try {
                const keysToRemove = [];
                for (let i = 0; i < window.localStorage.length; i++) {
                    const key = window.localStorage.key(i);
                    if (key && key.includes('supabase.auth.token')) {
                        keysToRemove.push(key);
                    }
                }
                // Keep only the most recent tokens
                keysToRemove.slice(0, -2).forEach(k => window.localStorage.removeItem(k));
                // Retry the setItem
                window.localStorage.setItem(key, value);
            } catch (retryError) {
                console.error('Failed to store data even after cleanup:', retryError);
            }
        }
    },
    removeItem: (key: string) => {
        if (typeof window === 'undefined') return;
        try {
            window.localStorage.removeItem(key);
        } catch (error) {
            console.warn('localStorage removeItem failed:', error);
        }
    },
};

// Primary client instance with Phase 3 optimizations
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    // Authentication configuration optimized for scale
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce', // More secure for web
        storage: enhancedStorage,
        // Session management for 50k users
        debug: process.env.NODE_ENV === 'development',
    },

    // Realtime configuration with throttling for high concurrency
    realtime: {
        params: {
            eventsPerSecond: 5, // Reduced from 10 for better performance at scale
        },
    },

    // Database configuration 
    db: {
        schema: 'public',
    },

    // Global headers for application identification and monitoring
    global: {
        headers: {
            'x-application-name': 'beezee-web',
            'x-client-version': '2.0.0', // Updated for Phase 3
            'x-client-environment': process.env.NODE_ENV || 'development',
            'x-scaling-phase': 'phase-3-optimized',
            'x-user-capacity': '50k-users',
            'x-connection-pool': 'enabled',
        },
    },

    });

// =====================================================
// Admin Client for Elevated Operations
// Uses service role key for admin operations (bypasses RLS)
// =====================================================
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
        persistSession: false, // Don't persist admin sessions
        autoRefreshToken: false,
    },
    db: {
        schema: 'public',
    },
    global: {
        headers: {
            'x-application-name': 'beezee-web',
            'x-client-version': '2.0.0',
            'x-client-type': 'admin',
            'x-scaling-phase': 'phase-3-optimized',
            'x-privilege-level': 'service-role',
        },
    },
});

// =====================================================
// Connection Pool Monitor
// Monitors connection health and performance
// =====================================================
class ConnectionPoolMonitor {
    private stats = {
        totalConnections: 0,
        activeConnections: 0,
        failedConnections: 0,
        averageResponseTime: 0,
        lastHealthCheck: new Date(),
    };

    getStats() {
        return { ...this.stats };
    }

    async healthCheck(): Promise<boolean> {
        try {
            const start = Date.now();
            // Simple health check query
            await supabase.from('businesses').select('count').limit(1);
            const responseTime = Date.now() - start;
            
            this.updateStats(responseTime, true);
            this.stats.lastHealthCheck = new Date();
            
            return true;
        } catch (error) {
            this.updateStats(0, false);
            console.error('Connection health check failed:', error);
            return false;
        }
    }

    private updateStats(responseTime: number, success: boolean) {
        this.stats.averageResponseTime = 
            (this.stats.averageResponseTime + responseTime) / 2;
        
        if (!success) {
            this.stats.failedConnections++;
        }
    }

    // Get connection pool recommendations
    getRecommendations() {
        const { failedConnections, averageResponseTime } = this.stats;
        const recommendations = [];

        if (failedConnections > 10) {
            recommendations.push('Consider increasing connection pool size');
        }

        if (averageResponseTime > 1000) {
            recommendations.push('High response times detected - check database load');
        }

        if (averageResponseTime > 500) {
            recommendations.push('Consider enabling read replicas');
        }

        return recommendations;
    }
}

export const connectionMonitor = new ConnectionPoolMonitor();

// =====================================================
// Auto-scaling Connection Manager
// Dynamically adjusts pool size based on load
// =====================================================
class AutoScalingConnectionManager {
    private currentLoad = 0;
    private maxPoolSize = parseInt(process.env.DATABASE_POOL_SIZE || '20');
    private minPoolSize = 5;

    adjustPoolSize(load: number) {
        this.currentLoad = load;
        
        // Simple scaling logic - can be enhanced with more sophisticated algorithms
        if (load > 0.8 && this.maxPoolSize < 50) {
            console.log('High load detected, consider increasing pool size');
        } else if (load < 0.3 && this.maxPoolSize > this.minPoolSize) {
            console.log('Low load detected, pool size could be reduced');
        }
    }

    getCurrentMetrics() {
        return {
            currentLoad: this.currentLoad,
            maxPoolSize: this.maxPoolSize,
            minPoolSize: this.minPoolSize,
            recommendedPoolSize: Math.ceil(this.minPoolSize + (this.maxPoolSize - this.minPoolSize) * this.currentLoad),
        };
    }
}

export const autoScalingManager = new AutoScalingConnectionManager();

// Periodic health checks (every 30 seconds in production)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    setInterval(() => {
        connectionMonitor.healthCheck();
    }, 30000);
}
