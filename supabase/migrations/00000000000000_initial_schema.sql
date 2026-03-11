-- AgentStack Initial Schema Migration
-- Generated: 2026-03-09

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- ORGANIZATIONS
-- ============================================
CREATE TABLE public.organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'team', 'enterprise')),
    owner_id UUID NOT NULL,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    member_count INTEGER NOT NULL DEFAULT 1,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_organizations_slug ON public.organizations(slug);
CREATE INDEX idx_organizations_owner ON public.organizations(owner_id);

-- ============================================
-- USERS / PROFILES
-- ============================================
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
    onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_org ON public.profiles(organization_id);

-- ============================================
-- AGENTS
-- ============================================
CREATE TABLE public.agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'error', 'deploying')),
    runtime TEXT NOT NULL DEFAULT 'python' CHECK (runtime IN ('python', 'nodejs', 'docker')),
    model TEXT NOT NULL DEFAULT 'gpt-4o',
    system_prompt TEXT,
    tools JSONB DEFAULT '[]',
    environment_variables JSONB DEFAULT '{}',
    config JSONB DEFAULT '{}',
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES public.profiles(id),
    template_id UUID,
    last_active_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_agents_org ON public.agents(organization_id);
CREATE INDEX idx_agents_status ON public.agents(status);
CREATE INDEX idx_agents_created_by ON public.agents(created_by);

-- ============================================
-- AGENT TEMPLATES
-- ============================================
CREATE TABLE public.agent_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    runtime TEXT NOT NULL DEFAULT 'python',
    model TEXT NOT NULL DEFAULT 'gpt-4o',
    system_prompt TEXT NOT NULL,
    tools JSONB DEFAULT '[]',
    icon TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_public BOOLEAN NOT NULL DEFAULT TRUE,
    use_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_agent_templates_category ON public.agent_templates(category);
CREATE INDEX idx_agent_templates_featured ON public.agent_templates(is_featured) WHERE is_featured = TRUE;

-- ============================================
-- WORKFLOWS
-- ============================================
CREATE TABLE public.workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'archived')),
    nodes JSONB NOT NULL DEFAULT '[]',
    edges JSONB NOT NULL DEFAULT '[]',
    trigger_config JSONB DEFAULT '{}',
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES public.profiles(id),
    execution_count INTEGER NOT NULL DEFAULT 0,
    last_executed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_workflows_org ON public.workflows(organization_id);
CREATE INDEX idx_workflows_status ON public.workflows(status);

-- ============================================
-- WORKFLOW EXECUTIONS
-- ============================================
CREATE TABLE public.workflow_executions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_id UUID NOT NULL REFERENCES public.workflows(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled')),
    triggered_by TEXT DEFAULT 'manual',
    node_results JSONB DEFAULT '{}',
    error TEXT,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    duration_ms INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_executions_workflow ON public.workflow_executions(workflow_id);
CREATE INDEX idx_executions_status ON public.workflow_executions(status);
CREATE INDEX idx_executions_started ON public.workflow_executions(started_at DESC);

-- ============================================
-- API KEYS
-- ============================================
CREATE TABLE public.api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    key_hash TEXT NOT NULL UNIQUE,
    key_prefix TEXT NOT NULL,
    scopes TEXT[] NOT NULL DEFAULT '{}',
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES public.profiles(id),
    last_used_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_api_keys_hash ON public.api_keys(key_hash);
CREATE INDEX idx_api_keys_org ON public.api_keys(organization_id);

-- ============================================
-- USAGE LOGS
-- ============================================
CREATE TABLE public.usage_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    metric TEXT NOT NULL,
    value NUMERIC NOT NULL DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    period_start TIMESTAMPTZ NOT NULL,
    period_end TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_usage_org_metric ON public.usage_logs(organization_id, metric);
CREATE INDEX idx_usage_period ON public.usage_logs(period_start, period_end);

-- ============================================
-- AUDIT LOG
-- ============================================
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id),
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT,
    details JSONB DEFAULT '{}',
    ip_address INET,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_org ON public.audit_logs(organization_id);
CREATE INDEX idx_audit_created ON public.audit_logs(created_at DESC);

-- ============================================
-- INVITATIONS
-- ============================================
CREATE TABLE public.invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member', 'viewer')),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    invited_by UUID NOT NULL REFERENCES public.profiles(id),
    token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
    accepted_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '7 days',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_invitations_token ON public.invitations(token);
CREATE INDEX idx_invitations_email ON public.invitations(email);

-- ============================================
-- WEBHOOKS
-- ============================================
CREATE TABLE public.webhooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    url TEXT NOT NULL,
    events TEXT[] NOT NULL,
    secret TEXT NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    last_triggered_at TIMESTAMPTZ,
    failure_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_webhooks_org ON public.webhooks(organization_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhooks ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Organizations: members can view their org
CREATE POLICY "Org members can view org" ON public.organizations FOR SELECT 
    USING (id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()));

-- Agents: org members can view agents
CREATE POLICY "Org members can view agents" ON public.agents FOR SELECT 
    USING (organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Org members can create agents" ON public.agents FOR INSERT 
    WITH CHECK (organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Org members can update agents" ON public.agents FOR UPDATE 
    USING (organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Org members can delete agents" ON public.agents FOR DELETE 
    USING (organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()));

-- Agent templates: public templates visible to all
CREATE POLICY "Public templates visible to all" ON public.agent_templates FOR SELECT USING (is_public = TRUE);

-- Workflows: org members can CRUD
CREATE POLICY "Org members can view workflows" ON public.workflows FOR SELECT 
    USING (organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Org members can create workflows" ON public.workflows FOR INSERT 
    WITH CHECK (organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Org members can update workflows" ON public.workflows FOR UPDATE 
    USING (organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Org members can delete workflows" ON public.workflows FOR DELETE 
    USING (organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()));

-- Executions: org members can view via workflow
CREATE POLICY "Org members can view executions" ON public.workflow_executions FOR SELECT 
    USING (workflow_id IN (SELECT id FROM public.workflows WHERE organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())));

-- API Keys: org members can manage
CREATE POLICY "Org members can view api keys" ON public.api_keys FOR SELECT 
    USING (organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Org members can create api keys" ON public.api_keys FOR INSERT 
    WITH CHECK (organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Org members can delete api keys" ON public.api_keys FOR DELETE 
    USING (organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()));

-- Usage logs: org members can view
CREATE POLICY "Org members can view usage" ON public.usage_logs FOR SELECT 
    USING (organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()));

-- Audit logs: org members can view
CREATE POLICY "Org members can view audit logs" ON public.audit_logs FOR SELECT 
    USING (organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()));

-- Invitations: org members can manage
CREATE POLICY "Org members can view invitations" ON public.invitations FOR SELECT 
    USING (organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()));

-- Webhooks: org members can manage
CREATE POLICY "Org members can view webhooks" ON public.webhooks FOR SELECT 
    USING (organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()));

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables with updated_at column
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.agents FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.agent_templates FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.workflows FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.webhooks FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Increment workflow execution count
CREATE OR REPLACE FUNCTION public.increment_execution_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.workflows
    SET execution_count = execution_count + 1,
        last_executed_at = NOW()
    WHERE id = NEW.workflow_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_execution_created AFTER INSERT ON public.workflow_executions FOR EACH ROW EXECUTE FUNCTION public.increment_execution_count();
