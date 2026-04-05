-- Add service_id column to calendar table to fix 400 Bad Request errors
-- This allows appointments to maintain a relationship with the services table

ALTER TABLE calendar ADD COLUMN service_id UUID REFERENCES services(id);

-- Add comment for documentation
COMMENT ON COLUMN calendar.service_id IS 'Foreign key reference to the service booked for this appointment';
