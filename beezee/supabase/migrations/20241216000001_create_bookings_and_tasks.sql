-- Create Bookings and Tasks Tables Migration
-- Adds support for client bookings, appointments, and task management

-- ============================================
-- BOOKINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    client_name VARCHAR(200) NOT NULL,
    client_phone VARCHAR(20),
    client_email VARCHAR(255),
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    service VARCHAR(200),
    location TEXT,
    notes TEXT,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_appointment_date ON bookings(appointment_date);
CREATE INDEX idx_bookings_appointment_time ON bookings(appointment_time);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_user_date ON bookings(user_id, appointment_date);

-- ============================================
-- TASKS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    due_date DATE,
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_completed ON tasks(completed);
CREATE INDEX idx_tasks_user_completed ON tasks(user_id, completed);
CREATE INDEX idx_tasks_priority ON tasks(priority);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- ============================================
-- BOOKINGS TABLE RLS POLICIES
-- Support custom auth (user_id from localStorage)
-- ============================================

-- Allow public to view bookings where user_id exists in users table
CREATE POLICY "Public can view own bookings" ON bookings
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users WHERE id = bookings.user_id
        )
    );

-- Allow public to insert bookings where user_id exists in users table
CREATE POLICY "Public can insert own bookings" ON bookings
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM users WHERE id = bookings.user_id
        )
    );

-- Allow public to update bookings where user_id exists in users table
CREATE POLICY "Public can update own bookings" ON bookings
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM users WHERE id = bookings.user_id
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM users WHERE id = bookings.user_id
        )
    );

-- Allow public to delete bookings where user_id exists in users table
CREATE POLICY "Public can delete own bookings" ON bookings
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM users WHERE id = bookings.user_id
        )
    );

-- ============================================
-- TASKS TABLE RLS POLICIES
-- Support custom auth (user_id from localStorage)
-- ============================================

-- Allow public to view tasks where user_id exists in users table
CREATE POLICY "Public can view own tasks" ON tasks
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users WHERE id = tasks.user_id
        )
    );

-- Allow public to insert tasks where user_id exists in users table
CREATE POLICY "Public can insert own tasks" ON tasks
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM users WHERE id = tasks.user_id
        )
    );

-- Allow public to update tasks where user_id exists in users table
CREATE POLICY "Public can update own tasks" ON tasks
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM users WHERE id = tasks.user_id
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM users WHERE id = tasks.user_id
        )
    );

-- Allow public to delete tasks where user_id exists in users table
CREATE POLICY "Public can delete own tasks" ON tasks
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM users WHERE id = tasks.user_id
        )
    );

-- ============================================
-- UPDATE TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for bookings updated_at
CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for tasks updated_at
CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

