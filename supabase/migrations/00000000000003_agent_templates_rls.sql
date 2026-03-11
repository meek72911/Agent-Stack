-- Enable RLS on agent_templates table
ALTER TABLE public.agent_templates ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to published templates
CREATE POLICY "agent_templates_public_read"
ON public.agent_templates FOR SELECT
USING (is_public = true);

-- Create policy for admin access (service role)
CREATE POLICY "agent_templates_admin_all"
ON public.agent_templates FOR ALL
USING (auth.role() = 'service_role');
