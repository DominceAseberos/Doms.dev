-- DIAGNOSTIC & ANALYTICS SYSTEM - HARDENED SCHEMA
-- Security improvements based on Supabase best practices

-- 0. Ensure UUID helper exists
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. CLEANUP & TABLE CREATION
DROP TABLE IF EXISTS public.site_analytics;
DROP TABLE IF EXISTS public.error_logs;

CREATE TABLE public.error_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    message TEXT NOT NULL,
    stack_trace TEXT,
    url TEXT,
    journey JSONB DEFAULT '[]'::jsonb,
    user_agent TEXT,
    component_name TEXT,
    resolved BOOLEAN DEFAULT FALSE
);

CREATE TABLE public.site_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_path TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    session_id TEXT
);

-- Add uniqueness to prevent duplicate visits by session (server-side enforcement)
CREATE UNIQUE INDEX IF NOT EXISTS idx_site_analytics_page_session 
    ON public.site_analytics (page_path, session_id);

-- 2. SECURITY (RLS)
ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_analytics ENABLE ROW LEVEL SECURITY;

-- Allow anyone to report an error or a visit (INSERT)
-- NOTE: Allows unauthenticated users. Monitor for abuse; can add rate limiting if needed.
CREATE POLICY "Public Insert Errors" ON public.error_logs
    FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "Public Insert Analytics" ON public.site_analytics
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Only the admin email can SELECT/UPDATE/DELETE (explicit per operation)
-- Using SELECT wrapper for auth.jwt() for better planner caching
CREATE POLICY "Admin Select Errors" ON public.error_logs
    FOR SELECT
    TO authenticated
    USING ((SELECT auth.jwt() ->> 'email') = 'daseberos@gmail.com');

CREATE POLICY "Admin Update Errors" ON public.error_logs
    FOR UPDATE
    TO authenticated
    USING ((SELECT auth.jwt() ->> 'email') = 'daseberos@gmail.com')
    WITH CHECK ((SELECT auth.jwt() ->> 'email') = 'daseberos@gmail.com');

CREATE POLICY "Admin Delete Errors" ON public.error_logs
    FOR DELETE
    TO authenticated
    USING ((SELECT auth.jwt() ->> 'email') = 'daseberos@gmail.com');

-- SELECT/UPDATE/DELETE policies for analytics
CREATE POLICY "Admin Select Analytics" ON public.site_analytics
    FOR SELECT
    TO authenticated
    USING ((SELECT auth.jwt() ->> 'email') = 'daseberos@gmail.com');

CREATE POLICY "Admin Update Analytics" ON public.site_analytics
    FOR UPDATE
    TO authenticated
    USING ((SELECT auth.jwt() ->> 'email') = 'daseberos@gmail.com')
    WITH CHECK ((SELECT auth.jwt() ->> 'email') = 'daseberos@gmail.com');

CREATE POLICY "Admin Delete Analytics" ON public.site_analytics
    FOR DELETE
    TO authenticated
    USING ((SELECT auth.jwt() ->> 'email') = 'daseberos@gmail.com');

-- 3. INDEXING FOR SPEED
CREATE INDEX IF NOT EXISTS idx_logs_resolved ON public.error_logs(resolved);
CREATE INDEX IF NOT EXISTS idx_logs_created ON public.error_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_site_analytics_session ON public.site_analytics(session_id);
