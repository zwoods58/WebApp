-- Create operations_queue table for server-side persistence of offline sync operations
-- This enables cross-device sync and better monitoring of pending operations

CREATE TABLE operations_queue (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('CREATE', 'UPDATE', 'DELETE')),
  "table" TEXT NOT NULL CHECK ("table" IN ('transactions', 'inventory', 'credit', 'expenses', 'services', 'targets', 'calendar')),
  entity_id TEXT,
  data JSONB NOT NULL,
  timestamp BIGINT NOT NULL,
  idempotency_key TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'syncing', 'completed', 'failed')),
  retry_count INTEGER NOT NULL DEFAULT 0,
  error_message TEXT,
  business_id UUID NOT NULL REFERENCES businesses(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for efficient querying
CREATE INDEX idx_operations_queue_status ON operations_queue(status);
CREATE INDEX idx_operations_queue_business ON operations_queue(business_id);
CREATE INDEX idx_operations_queue_timestamp ON operations_queue(timestamp);
CREATE INDEX idx_operations_queue_table ON operations_queue("table");

-- Add comments for documentation
COMMENT ON TABLE operations_queue IS 'Server-side queue for offline sync operations, enables cross-device sync and operation monitoring';
COMMENT ON COLUMN operations_queue.idempotency_key IS 'Unique key to prevent duplicate operations';
COMMENT ON COLUMN operations_queue.retry_count IS 'Number of times this operation has been retried';
COMMENT ON COLUMN operations_queue.timestamp IS 'Unix timestamp when operation was created';
