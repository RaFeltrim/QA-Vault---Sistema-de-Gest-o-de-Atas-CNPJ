-- =====================================================
-- QA VAULT - COMPLETE SQL MIGRATION
-- Execute in Supabase SQL Editor
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =====================================================
-- 1. FIX ATAS TABLE (add UUID default)
-- =====================================================

-- If id is text, change to UUID (recommended)
-- First check if atas.id is text and needs migration
DO $$
BEGIN
    -- Add default to id if missing
    ALTER TABLE public.atas 
    ALTER COLUMN id SET DEFAULT gen_random_uuid()::text;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Could not set default on atas.id: %', SQLERRM;
END $$;

-- Ensure project_id column exists
ALTER TABLE public.atas 
ADD COLUMN IF NOT EXISTS project_id text;

-- =====================================================
-- 2. FIX PROJECTS TABLE
-- =====================================================

-- Add created_by column
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS created_by text;

-- Add updated_at column
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- =====================================================
-- 3. FIX CATEGORIES TABLE
-- =====================================================

-- Add label column if missing
ALTER TABLE public.categories 
ADD COLUMN IF NOT EXISTS label text;

-- =====================================================
-- 4. CREATE PROJECT_MEMBERSHIPS TABLE FOR RLS
-- =====================================================

CREATE TABLE IF NOT EXISTS public.project_memberships (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id text NOT NULL,
    role text NOT NULL DEFAULT 'viewer' CHECK (role IN ('owner', 'admin', 'editor', 'viewer')),
    created_at timestamptz DEFAULT now(),
    UNIQUE(project_id, user_id)
);

-- =====================================================
-- 5. DISABLE RLS FOR NOW (enable later with policies)
-- =====================================================

ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.atas DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_memberships DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- 6. INSERT DEFAULT DATA
-- =====================================================

-- Insert default project if not exists
INSERT INTO public.projects (name, created_by) 
SELECT 'CNPJ-Alfanumérico (Equifax-BVS)', 'Rafael'
WHERE NOT EXISTS (SELECT 1 FROM public.projects LIMIT 1);

-- Get the first project and create memberships
DO $$
DECLARE
    first_project_id uuid;
BEGIN
    SELECT id INTO first_project_id FROM public.projects LIMIT 1;
    
    IF first_project_id IS NOT NULL THEN
        -- Add owner memberships
        INSERT INTO public.project_memberships (project_id, user_id, role)
        VALUES 
            (first_project_id, 'Rafael', 'owner'),
            (first_project_id, 'Mauricio', 'admin')
        ON CONFLICT (project_id, user_id) DO NOTHING;
        
        -- Insert default categories
        INSERT INTO public.categories (project_id, name, label) VALUES
            (first_project_id::text, '00-Kickoffs', '00 - Kickoffs & Planejamento'),
            (first_project_id::text, '01-Kanban', '01 - Execução (Kanban)'),
            (first_project_id::text, '02-Milestones', '02 - Revisões & Milestones')
        ON CONFLICT (id) DO NOTHING;
        
        -- Update existing atas
        UPDATE public.atas SET project_id = first_project_id::text WHERE project_id IS NULL;
    END IF;
END $$;

-- =====================================================
-- 7. VERIFY SETUP
-- =====================================================

SELECT 'Setup complete!' as status;
SELECT 'Projects: ' || count(*) as info FROM public.projects
UNION ALL
SELECT 'Categories: ' || count(*) as info FROM public.categories
UNION ALL
SELECT 'Atas: ' || count(*) as info FROM public.atas
UNION ALL
SELECT 'Memberships: ' || count(*) as info FROM public.project_memberships;
