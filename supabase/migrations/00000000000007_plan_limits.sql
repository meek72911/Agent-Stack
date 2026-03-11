CREATE TABLE IF NOT EXISTS public.plan_limits (
    plan TEXT PRIMARY KEY,
    agents INTEGER NOT NULL,
    workflows INTEGER NOT NULL,
    executions_per_month INTEGER NOT NULL,
    team_members INTEGER NOT NULL,
    storage_gb INTEGER NOT NULL,
    api_requests_per_day INTEGER NOT NULL
);

INSERT INTO public.plan_limits (plan, agents, workflows, executions_per_month, team_members, storage_gb, api_requests_per_day) VALUES
    ('free', 3, 5, 1000, 1, 1, 1000),
    ('pro', 25, 50, 25000, 5, 10, 50000),
    ('team', 100, 200, 100000, 25, 50, 200000),
    ('enterprise', -1, -1, -1, -1, -1, -1)
ON CONFLICT (plan) DO UPDATE SET
    agents = EXCLUDED.agents,
    workflows = EXCLUDED.workflows,
    executions_per_month = EXCLUDED.executions_per_month,
    team_members = EXCLUDED.team_members,
    storage_gb = EXCLUDED.storage_gb,
    api_requests_per_day = EXCLUDED.api_requests_per_day;

ALTER TABLE public.plan_limits ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view plan limits" ON public.plan_limits;
CREATE POLICY "Anyone can view plan limits" ON public.plan_limits FOR SELECT USING (true);
