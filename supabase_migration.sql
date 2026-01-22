-- =====================================================
-- QA VAULT - SQL MIGRATION SCRIPT
-- Execute this in Supabase SQL Editor
-- =====================================================

-- 1. Create Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- 2. Create Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id text PRIMARY KEY,
    project_id text NOT NULL,
    name text NOT NULL,
    label text,
    created_at timestamptz DEFAULT now()
);

-- 3. Add project_id to atas table (if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'atas' 
        AND column_name = 'project_id'
    ) THEN
        ALTER TABLE public.atas ADD COLUMN project_id text DEFAULT 'default';
    END IF;
END $$;

-- 4. Disable RLS for easier testing
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.atas DISABLE ROW LEVEL SECURITY;

-- 5. Insert default project if not exists
INSERT INTO public.projects (id, name) 
VALUES ('default', 'CNPJ-Alfanumérico (Equifax-BVS)')
ON CONFLICT (id) DO NOTHING;

-- 6. Insert default categories
INSERT INTO public.categories (id, project_id, name, label) VALUES
    ('00-Kickoffs', 'default', '00-Kickoffs', '00 - Kickoffs & Planejamento'),
    ('01-Kanban', 'default', '01-Kanban', '01 - Execução (Kanban)'),
    ('02-Milestones', 'default', '02-Milestones', '02 - Revisões & Milestones'),
    ('03-ShiftLeft', 'default', '03-ShiftLeft', '03 - Estratégia Shift-Left')
ON CONFLICT (id) DO UPDATE SET
    project_id = EXCLUDED.project_id,
    name = EXCLUDED.name,
    label = EXCLUDED.label;

-- 7. Update existing atas to have default project_id
UPDATE public.atas SET project_id = 'default' WHERE project_id IS NULL;

-- 8. Verify setup
SELECT 'Tables created successfully!' as status;
SELECT 'Projects: ' || count(*) as count FROM public.projects;
SELECT 'Categories: ' || count(*) as count FROM public.categories;
SELECT 'Atas: ' || count(*) as count FROM public.atas;
