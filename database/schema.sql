-- AI Travel Planner Database Schema
-- This script should be run in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Trips table
CREATE TABLE IF NOT EXISTS trips (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    destination VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    budget DECIMAL(10, 2) NOT NULL,
    travelers INTEGER NOT NULL,
    preferences TEXT,
    itinerary JSONB,
    expenses JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_created_at ON trips(created_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON trips
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

-- Users can only read their own data
CREATE POLICY users_select_own ON users
    FOR SELECT
    USING (auth.uid() = id);

-- Users can only update their own data
CREATE POLICY users_update_own ON users
    FOR UPDATE
    USING (auth.uid() = id);

-- Users can only see their own trips
CREATE POLICY trips_select_own ON trips
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own trips
CREATE POLICY trips_insert_own ON trips
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own trips
CREATE POLICY trips_update_own ON trips
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can delete their own trips
CREATE POLICY trips_delete_own ON trips
    FOR DELETE
    USING (auth.uid() = user_id);

-- Sample data for testing (optional)
-- Uncomment to insert sample data

/*
-- Insert a test user (password: "password123" hashed with bcrypt)
INSERT INTO users (email, password, name) VALUES
    ('demo@example.com', '$2a$10$rKqWlqxvXq9XbYJ5KvYv0OYGJvVZVzLJfEhqH7xXw8xXqXw8xXqXw', 'Demo User');

-- Insert a sample trip
INSERT INTO trips (
    user_id,
    destination,
    start_date,
    end_date,
    budget,
    travelers,
    preferences,
    itinerary
) VALUES (
    (SELECT id FROM users WHERE email = 'demo@example.com'),
    '东京',
    '2024-06-01',
    '2024-06-05',
    15000.00,
    2,
    '喜欢美食和文化',
    '{"overview": "精彩的5天东京之旅", "days": []}'::jsonb
);
*/

