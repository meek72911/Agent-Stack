-- Supabase Tables Setup for AgentStack
-- Run this in the Supabase SQL Editor

-- Users table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email text UNIQUE,
    created_at timestamp with time zone DEFAULT now()
);

-- Organizations table
CREATE TABLE IF NOT EXISTS public.organizations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    owner_id uuid REFERENCES auth.users(id),
    created_at timestamp with time zone DEFAULT now()
);

-- Workflows table
CREATE TABLE IF NOT EXISTS public.workflows (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    definition jsonb,
    organization_id uuid REFERENCES public.organizations(id),
    user_id uuid REFERENCES auth.users(id),
    status text DEFAULT 'active',
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Workflow executions table
CREATE TABLE IF NOT EXISTS public.workflow_executions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id uuid REFERENCES public.workflows(id),
    status text NOT NULL,
    output text,
    error text,
    started_at timestamp with time zone DEFAULT now(),
    completed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now()
);

-- API keys table (for BYOK)
CREATE TABLE IF NOT EXISTS public.api_keys (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id),
    organization_id uuid REFERENCES public.organizations(id),
    name text NOT NULL,
    provider text NOT NULL,
    encrypted_key text NOT NULL,
    last_used timestamp with time zone,
    created_at timestamp with time zone DEFAULT now()
);

-- Files table
CREATE TABLE IF NOT EXISTS public.files (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id),
    organization_id uuid REFERENCES public.organizations(id),
    filename text NOT NULL,
    size integer NOT NULL,
    content_type text,
    url text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Output templates table
CREATE TABLE IF NOT EXISTS public.output_templates (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id),
    organization_id uuid REFERENCES public.organizations(id),
    name text NOT NULL,
    workflow_id text NOT NULL,
    fields jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Quality checks table
CREATE TABLE IF NOT EXISTS public.quality_checks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    execution_id uuid NOT NULL,
    organization_id uuid REFERENCES public.organizations(id),
    validations jsonb NOT NULL,
    confidence_score float NOT NULL,
    status text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Schedules table
CREATE TABLE IF NOT EXISTS public.schedules (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id),
    organization_id uuid REFERENCES public.organizations(id),
    workflow_id uuid NOT NULL,
    cron_expression text NOT NULL,
    timezone text NOT NULL,
    enabled boolean DEFAULT true,
    next_run timestamp with time zone,
    created_at timestamp with time zone DEFAULT now()
);

-- Notification settings table
CREATE TABLE IF NOT EXISTS public.notification_settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id),
    organization_id uuid REFERENCES public.organizations(id),
    execution_complete boolean DEFAULT true,
    daily_summary boolean DEFAULT false,
    weekly_report boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Exports table
CREATE TABLE IF NOT EXISTS public.exports (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    execution_id uuid NOT NULL,
    organization_id uuid REFERENCES public.organizations(id),
    format text NOT NULL,
    status text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.output_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quality_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exports ENABLE ROW LEVEL SECURITY;

-- Create policies (basic - you may want to customize these)
-- Users can read their own data
CREATE POLICY "Users can read own data" ON public.users
    FOR SELECT USING (auth.uid() = id);

-- Organizations: members can read, owners can do everything
CREATE POLICY "Organizations read for members" ON public.organizations
    FOR SELECT USING (owner_id = auth.uid() OR id IN (
        SELECT organization_id FROM public.profiles WHERE user_id = auth.uid()
    ));

-- Workflows: organization members can read, owners can do everything
CREATE POLICY "Workflows read for members" ON public.workflows
    FOR SELECT USING (organization_id IN (
        SELECT organization_id FROM public.profiles WHERE user_id = auth.uid()
    ));

-- Similar policies for other tables...
-- (Add more policies as needed based on your app's requirements)
