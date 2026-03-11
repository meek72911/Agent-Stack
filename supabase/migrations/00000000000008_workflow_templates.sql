-- Workflow Templates Table
-- Create the table for pre-defined multi-agent workflows

CREATE TABLE IF NOT EXISTS public.workflow_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    nodes JSONB NOT NULL DEFAULT '[]',
    edges JSONB NOT NULL DEFAULT '[]',
    icon TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    use_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS
ALTER TABLE public.workflow_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workflow templates are viewable by everyone" 
    ON public.workflow_templates FOR SELECT 
    USING (true);

-- Seed some templates (Pack definitions)
INSERT INTO public.workflow_templates (name, description, category, nodes, edges, icon, is_featured)
VALUES 
(
    'AI Engineering Squad', 
    'A high-performance team that writes code, generates documentation, and reviews security vulnerabilities.', 
    'Engineering',
    '[
        {"id": "node-1", "type": "agent", "data": {"agent_slug": "excel-sheets-specialist", "name": "Data Analyst"}},
        {"id": "node-2", "type": "agent", "data": {"agent_slug": "mlops-engineer", "name": "Deployment Specialist"}}
    ]',
    '[
        {"id": "edge-1", "source": "node-1", "target": "node-2"}
    ]',
    '🛠️',
    true
),
(
    'Market Intelligence Engine',
    'Scrapes Reddit, analyzes competitors, and produces a deep market research report.',
    'Research',
    '[
        {"id": "node-1", "type": "agent", "data": {"agent_slug": "reddit-market-intelligence-researcher", "name": "Reddit Researcher"}},
        {"id": "node-2", "type": "agent", "data": {"agent_slug": "technical-documentation-writer", "name": "Reporter"}}
    ]',
    '[
        {"id": "edge-1", "source": "node-1", "target": "node-2"}
    ]',
    '🔍',
    true
),
(
    'Growth Marketing Machine',
    'Generates SEO content, social media posts, and ad copy based on a single product brief.',
    'Marketing',
    '[]',
    '[]',
    '📈',
    true
);
