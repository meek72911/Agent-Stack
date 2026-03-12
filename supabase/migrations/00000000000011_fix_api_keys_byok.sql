-- Migration: Add provider and encrypted_key to api_keys table for BYOK support
ALTER TABLE public.api_keys ADD COLUMN provider TEXT;
ALTER TABLE public.api_keys ADD COLUMN encrypted_key TEXT;
ALTER TABLE public.api_keys ADD COLUMN workspace_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL;

-- Create workflow_execution_steps table
CREATE TABLE public.workflow_execution_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    execution_id UUID NOT NULL REFERENCES public.workflow_executions(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES public.agents(id) ON DELETE SET NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'running', 'completed', 'failed')),
    input TEXT,
    output TEXT,
    error TEXT,
    input_tokens INTEGER DEFAULT 0,
    output_tokens INTEGER DEFAULT 0,
    cost_cents NUMERIC DEFAULT 0,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create tool_calls table
CREATE TABLE public.tool_calls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    step_id UUID NOT NULL REFERENCES public.workflow_execution_steps(id) ON DELETE CASCADE,
    tool_slug TEXT NOT NULL,
    args JSONB DEFAULT '{}',
    result TEXT,
    status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.workflow_execution_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_calls ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Org members can view execution steps" ON public.workflow_execution_steps FOR SELECT 
    USING (execution_id IN (SELECT id FROM public.workflow_executions WHERE organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())));

CREATE POLICY "Org members can view tool calls" ON public.tool_calls FOR SELECT 
    USING (step_id IN (SELECT id FROM public.workflow_execution_steps WHERE execution_id IN (SELECT id FROM public.workflow_executions WHERE organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()))));
