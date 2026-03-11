-- Add slug column to agent_templates table
ALTER TABLE public.agent_templates 
ADD COLUMN slug TEXT;

-- Add unique constraint for slug
ALTER TABLE public.agent_templates 
ADD CONSTRAINT agent_templates_slug_unique 
UNIQUE (slug);
