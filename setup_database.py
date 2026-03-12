"""Setup Supabase database with all required tables."""
import os
from supabase import create_client

# Supabase credentials from environment
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: SUPABASE_URL and SUPABASE_KEY environment variables are required.")
    exit(1)

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# SQL to create missing tables
sql_commands = [
    # Users table (if not exists)
    """
    CREATE TABLE IF NOT EXISTS users (
        id uuid PRIMARY KEY DEFAULT auth.uid(),
        email text UNIQUE,
        created_at timestamp with time zone DEFAULT now()
    );
    """,
    
    # Organizations table
    """
    CREATE TABLE IF NOT EXISTS organizations (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name text NOT NULL,
        owner_id uuid REFERENCES auth.users(id),
        created_at timestamp with time zone DEFAULT now()
    );
    """,
    
    # Workflows table
    """
    CREATE TABLE IF NOT EXISTS workflows (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name text NOT NULL,
        description text,
        definition jsonb,
        organization_id uuid REFERENCES organizations(id),
        user_id uuid REFERENCES auth.users(id),
        status text DEFAULT 'active',
        created_at timestamp with time zone DEFAULT now(),
        updated_at timestamp with time zone DEFAULT now()
    );
    """,
    
    # Workflow executions table
    """
    CREATE TABLE IF NOT EXISTS workflow_executions (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        workflow_id uuid REFERENCES workflows(id),
        status text NOT NULL,
        output text,
        error text,
        started_at timestamp with time zone DEFAULT now(),
        completed_at timestamp with time zone,
        created_at timestamp with time zone DEFAULT now()
    );
    """,
    
    # API keys table (for BYOK)
    """
    CREATE TABLE IF NOT EXISTS api_keys (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid REFERENCES auth.users(id),
        organization_id uuid REFERENCES organizations(id),
        name text NOT NULL,
        provider text NOT NULL,
        encrypted_key text NOT NULL,
        last_used timestamp with time zone,
        created_at timestamp with time zone DEFAULT now()
    );
    """,
    
    # Files table
    """
    CREATE TABLE IF NOT EXISTS files (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid REFERENCES auth.users(id),
        organization_id uuid REFERENCES organizations(id),
        filename text NOT NULL,
        size integer NOT NULL,
        content_type text,
        url text NOT NULL,
        created_at timestamp with time zone DEFAULT now()
    );
    """,
    
    # Output templates table
    """
    CREATE TABLE IF NOT EXISTS output_templates (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid REFERENCES auth.users(id),
        organization_id uuid REFERENCES organizations(id),
        name text NOT NULL,
        workflow_id text NOT NULL,
        fields jsonb NOT NULL,
        created_at timestamp with time zone DEFAULT now()
    );
    """,
    
    # Quality checks table
    """
    CREATE TABLE IF NOT EXISTS quality_checks (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        execution_id uuid NOT NULL,
        organization_id uuid REFERENCES organizations(id),
        validations jsonb NOT NULL,
        confidence_score float NOT NULL,
        status text NOT NULL,
        created_at timestamp with time zone DEFAULT now()
    );
    """,
    
    # Schedules table
    """
    CREATE TABLE IF NOT EXISTS schedules (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid REFERENCES auth.users(id),
        organization_id uuid REFERENCES organizations(id),
        workflow_id uuid NOT NULL,
        cron_expression text NOT NULL,
        timezone text NOT NULL,
        enabled boolean DEFAULT true,
        next_run timestamp with time zone,
        created_at timestamp with time zone DEFAULT now()
    );
    """,
    
    # Notification settings table
    """
    CREATE TABLE IF NOT EXISTS notification_settings (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid REFERENCES auth.users(id),
        organization_id uuid REFERENCES organizations(id),
        execution_complete boolean DEFAULT true,
        daily_summary boolean DEFAULT false,
        weekly_report boolean DEFAULT false,
        created_at timestamp with time zone DEFAULT now(),
        updated_at timestamp with time zone DEFAULT now()
    );
    """,
    
    # Exports table
    """
    CREATE TABLE IF NOT EXISTS exports (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        execution_id uuid NOT NULL,
        organization_id uuid REFERENCES organizations(id),
        format text NOT NULL,
        status text NOT NULL,
        created_at timestamp with time zone DEFAULT now()
    );
    """,
]

print("Setting up Supabase database...")
for i, sql in enumerate(sql_commands, 1):
    try:
        # Use the SQL endpoint
        result = supabase.rpc('exec_sql', {'sql': sql}).execute()
        print(f"✓ Command {i} executed successfully")
    except Exception as e:
        print(f"✗ Command {i} failed: {e}")

print("\nDatabase setup complete!")
