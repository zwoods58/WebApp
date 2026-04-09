-- Cache Tracking Migration
-- Creates tables for monitoring cache performance and hit rates

-- Create cache_tracking table for cache hit rate monitoring
CREATE TABLE IF NOT EXISTS cache_tracking (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    cache_key VARCHAR(255) NOT NULL,
    cache_prefix VARCHAR(50) NOT NULL,
    identifier VARCHAR(255),
    hit BOOLEAN NOT NULL,
    ttl INTEGER,
    endpoint VARCHAR(255),
    user_id UUID REFERENCES auth.users(id),
    business_id UUID REFERENCES businesses(id),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_cache_tracking_created_at ON cache_tracking(created_at);
CREATE INDEX IF NOT EXISTS idx_cache_tracking_cache_key ON cache_tracking(cache_key);
CREATE INDEX IF NOT EXISTS idx_cache_tracking_cache_prefix ON cache_tracking(cache_prefix);
CREATE INDEX IF NOT EXISTS idx_cache_tracking_hit ON cache_tracking(hit);
CREATE INDEX IF NOT EXISTS idx_cache_tracking_user_id ON cache_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_cache_tracking_business_id ON cache_tracking(business_id);
CREATE INDEX IF NOT EXISTS idx_cache_tracking_endpoint ON cache_tracking(endpoint);

-- Create cache_performance view for monitoring
CREATE OR REPLACE VIEW cache_performance AS
SELECT 
    cache_prefix,
    COUNT(*) as total_requests,
    COUNT(*) FILTER (WHERE hit = true) as hits,
    COUNT(*) FILTER (WHERE hit = false) as misses,
    ROUND(
        (COUNT(*) FILTER (WHERE hit = true) * 100.0 / NULLIF(COUNT(*), 0)), 2
    ) as hit_rate_percentage,
    AVG(ttl) as avg_ttl,
    MIN(created_at) as first_seen,
    MAX(created_at) as last_seen
FROM cache_tracking
WHERE created_at >= NOW() - INTERVAL '24 hours'
GROUP BY cache_prefix
ORDER BY total_requests DESC;

-- Create cache_hourly_stats view for time-based analysis
CREATE OR REPLACE VIEW cache_hourly_stats AS
SELECT 
    DATE_TRUNC('hour', created_at) as hour,
    cache_prefix,
    COUNT(*) as total_requests,
    COUNT(*) FILTER (WHERE hit = true) as hits,
    COUNT(*) FILTER (WHERE hit = false) as misses,
    ROUND(
        (COUNT(*) FILTER (WHERE hit = true) * 100.0 / NULLIF(COUNT(*), 0)), 2
    ) as hit_rate_percentage
FROM cache_tracking
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY DATE_TRUNC('hour', created_at), cache_prefix
ORDER BY hour DESC, cache_prefix;

-- Create cache_top_keys view for most accessed keys
CREATE OR REPLACE VIEW cache_top_keys AS
SELECT 
    cache_key,
    cache_prefix,
    COUNT(*) as access_count,
    COUNT(*) FILTER (WHERE hit = true) as hits,
    COUNT(*) FILTER (WHERE hit = false) as misses,
    ROUND(
        (COUNT(*) FILTER (WHERE hit = true) * 100.0 / NULLIF(COUNT(*), 0)), 2
    ) as hit_rate_percentage,
    MAX(created_at) as last_accessed
FROM cache_tracking
WHERE created_at >= NOW() - INTERVAL '24 hours'
GROUP BY cache_key, cache_prefix
ORDER BY access_count DESC
LIMIT 100;

-- Function to log cache events
CREATE OR REPLACE FUNCTION log_cache_event(
    p_cache_key VARCHAR(255),
    p_cache_prefix VARCHAR(50),
    p_identifier VARCHAR(255) DEFAULT NULL,
    p_hit BOOLEAN,
    p_ttl INTEGER DEFAULT NULL,
    p_endpoint VARCHAR(255) DEFAULT NULL,
    p_user_id UUID DEFAULT NULL,
    p_business_id UUID DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO cache_tracking (
        cache_key,
        cache_prefix,
        identifier,
        hit,
        ttl,
        endpoint,
        user_id,
        business_id,
        ip_address,
        user_agent,
        metadata
    ) VALUES (
        p_cache_key,
        p_cache_prefix,
        p_identifier,
        p_hit,
        p_ttl,
        p_endpoint,
        p_user_id,
        p_business_id,
        p_ip_address,
        p_user_agent,
        p_metadata
    );
END;
$$;

-- Function to get cache statistics for a time period
CREATE OR REPLACE FUNCTION get_cache_stats(
    p_start_time TIMESTAMPTZ DEFAULT NOW() - INTERVAL '24 hours',
    p_end_time TIMESTAMPTZ DEFAULT NOW(),
    p_cache_prefix VARCHAR(50) DEFAULT NULL
)
RETURNS TABLE (
    cache_prefix VARCHAR(50),
    total_requests BIGINT,
    hits BIGINT,
    misses BIGINT,
    hit_rate_percentage NUMERIC,
    avg_ttl NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ct.cache_prefix,
        COUNT(*) as total_requests,
        COUNT(*) FILTER (WHERE hit = true) as hits,
        COUNT(*) FILTER (WHERE hit = false) as misses,
        ROUND(
            (COUNT(*) FILTER (WHERE hit = true) * 100.0 / NULLIF(COUNT(*), 0)), 2
        ) as hit_rate_percentage,
        AVG(ct.ttl) as avg_ttl
    FROM cache_tracking ct
    WHERE ct.created_at BETWEEN p_start_time AND p_end_time
    AND (p_cache_prefix IS NULL OR ct.cache_prefix = p_cache_prefix)
    GROUP BY ct.cache_prefix
    ORDER BY total_requests DESC;
END;
$$;

-- Function to clean up old cache tracking data
CREATE OR REPLACE FUNCTION cleanup_cache_tracking(
    p_days_old INTEGER DEFAULT 30
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM cache_tracking 
    WHERE created_at < NOW() - INTERVAL '1 day' * p_days_old;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    RETURN deleted_count;
END;
$$;

-- Enable RLS for cache_tracking
ALTER TABLE cache_tracking ENABLE ROW LEVEL SECURITY;

-- RLS policies for cache_tracking
CREATE POLICY "Users can view their own cache events" ON cache_tracking
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage cache tracking" ON cache_tracking
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role');

-- Grant permissions
GRANT SELECT ON cache_performance TO authenticated;
GRANT SELECT ON cache_hourly_stats TO authenticated;
GRANT SELECT ON cache_top_keys TO authenticated;
GRANT EXECUTE ON FUNCTION log_cache_event TO authenticated;
GRANT EXECUTE ON FUNCTION get_cache_stats TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_cache_tracking TO authenticated;

-- Grant service role permissions
GRANT ALL ON cache_tracking TO service_role;
GRANT ALL ON cache_performance TO service_role;
GRANT ALL ON cache_hourly_stats TO service_role;
GRANT ALL ON cache_top_keys TO service_role;

-- Create trigger to automatically log cache events (optional)
-- This would be used if you want to log cache events from the database side
-- CREATE OR REPLACE FUNCTION trigger_cache_event_logging()
-- RETURNS TRIGGER
-- LANGUAGE plpgsql
-- AS $$
-- BEGIN
--     -- Log cache event logic here
--     RETURN NEW;
-- END;
-- $$;

-- Comments for documentation
COMMENT ON TABLE cache_tracking IS 'Tracks cache hits and misses for performance monitoring';
COMMENT ON VIEW cache_performance IS 'Aggregated cache performance metrics by prefix';
COMMENT ON VIEW cache_hourly_stats IS 'Hourly cache statistics for time-based analysis';
COMMENT ON VIEW cache_top_keys IS 'Most frequently accessed cache keys';
COMMENT ON FUNCTION log_cache_event IS 'Logs a cache event for tracking';
COMMENT ON FUNCTION get_cache_stats IS 'Returns cache statistics for a time period';
COMMENT ON FUNCTION cleanup_cache_tracking IS 'Cleans up old cache tracking data';
