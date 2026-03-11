-- Add updated_at trigger for agent_templates
CREATE TRIGGER update_agent_templates_updated_at
BEFORE UPDATE ON public.agent_templates
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
