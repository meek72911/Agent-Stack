-- ================================================================
-- AgentStack: Run this in Supabase SQL Editor to fix onboarding
-- URL: https://supabase.com/dashboard/project/xtjprakqvjrbdpzgsdsh/editor
-- ================================================================

-- 1. Add user_api_keys table for BYOK (Bring Your Own Key) storage
CREATE TABLE IF NOT EXISTS public.user_api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    provider TEXT NOT NULL,          -- 'openai', 'anthropic', 'gemini', 'groq'
    encrypted_key TEXT NOT NULL,     -- AES-256 encrypted
    key_hint TEXT,                   -- last 4 chars for display
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, provider)
);

CREATE INDEX IF NOT EXISTS idx_user_api_keys_user ON public.user_api_keys(user_id);
ALTER TABLE public.user_api_keys ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own API keys" ON public.user_api_keys;
CREATE POLICY "Users manage own API keys" ON public.user_api_keys
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 2. Replace the new-user trigger to also auto-create an organization
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    new_org_id UUID;
    user_name TEXT;
    user_slug TEXT;
BEGIN
    -- Get display name from metadata (OAuth provides full_name)
    user_name := COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'name',
        split_part(NEW.email, '@', 1),
        'My Workspace'
    );

    -- Create a URL-safe unique slug
    user_slug := lower(regexp_replace(
        regexp_replace(user_name, '[^a-zA-Z0-9\s-]', '', 'g'),
        '\s+', '-', 'g'
    ));
    -- Append short unique suffix to avoid collisions
    user_slug := user_slug || '-' || substr(NEW.id::text, 1, 6);

    -- Create default organization for the new user
    INSERT INTO public.organizations (name, slug, owner_id)
    VALUES (user_name || '''s Workspace', user_slug, NEW.id)
    RETURNING id INTO new_org_id;

    -- Create profile linked to the new org
    INSERT INTO public.profiles (id, email, full_name, avatar_url, organization_id, role)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url',
        new_org_id,
        'owner'
    )
    ON CONFLICT (id) DO UPDATE SET
        organization_id = new_org_id,
        role = 'owner',
        email = NEW.email;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger (drop first in case it exists)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Backfill: create orgs for any existing users that don't have one
DO $$
DECLARE
    profile_row RECORD;
    new_org_id UUID;
BEGIN
    FOR profile_row IN
        SELECT p.id, p.email, p.full_name
        FROM public.profiles p
        WHERE p.organization_id IS NULL
    LOOP
        INSERT INTO public.organizations (name, slug, owner_id)
        VALUES (
            COALESCE(profile_row.full_name, split_part(profile_row.email, '@', 1)) || '''s Workspace',
            lower(regexp_replace(split_part(profile_row.email, '@', 1), '[^a-z0-9]', '-', 'g'))
                || '-' || substr(profile_row.id::text, 1, 6),
            profile_row.id
        )
        ON CONFLICT (slug) DO UPDATE SET slug = EXCLUDED.slug || '-2'
        RETURNING id INTO new_org_id;

        UPDATE public.profiles
        SET organization_id = new_org_id, role = 'owner'
        WHERE id = profile_row.id;
    END LOOP;
END;
$$;

-- 4. Add INSERT policy on profiles so the trigger can write
DROP POLICY IF EXISTS "Service role can insert profiles" ON public.profiles;
CREATE POLICY "Service role can insert profiles" ON public.profiles
    FOR INSERT WITH CHECK (true);

-- Done! New users will now automatically get an org + profile on signup.
SELECT 'Setup complete! ' || count(*) || ' profile(s) now have organizations.'
FROM public.profiles WHERE organization_id IS NOT NULL;
