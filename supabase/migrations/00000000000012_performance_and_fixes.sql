-- Migration: Performance and Bug Fixes
-- Description: Adds missing indexes and fixes deleted_at inconsistency

-- 1. Fix deleted_at inconsistency on key tables
ALTER TABLE public.agents ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE public.workflows ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- 2. Add indexes for foreign keys to prevent full table scans on joins
CREATE INDEX IF NOT EXISTS idx_agents_template_id ON public.agents(template_id);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_workflow_id_status ON public.workflow_executions(workflow_id, status);

-- 3. Add index for soft-delete filtering
CREATE INDEX IF NOT EXISTS idx_agents_deleted_at ON public.agents(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_workflows_deleted_at ON public.workflows(deleted_at) WHERE deleted_at IS NULL;

-- 4. Audit Log optimization
CREATE INDEX IF NOT EXISTS idx_audit_logs_action_resource ON public.audit_logs(action, resource_type);
