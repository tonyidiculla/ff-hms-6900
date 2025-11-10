-- Create employee_comp_guide table for salary structure by job grade
CREATE TABLE IF NOT EXISTS public.employee_comp_guide (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    job_grade TEXT NOT NULL UNIQUE,
    sal_min TEXT NOT NULL,
    sal_100 TEXT NOT NULL,
    sal_max TEXT NOT NULL,
    over_time TEXT NOT NULL DEFAULT 'no'
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_employee_comp_guide_job_grade ON public.employee_comp_guide(job_grade);

-- Add comments
COMMENT ON TABLE public.employee_comp_guide IS 'Compensation guide defining salary ranges by job grade';
COMMENT ON COLUMN public.employee_comp_guide.job_grade IS 'Job grade/level identifier (e.g., E1, M1, S1)';
COMMENT ON COLUMN public.employee_comp_guide.sal_min IS 'Minimum salary for this grade';
COMMENT ON COLUMN public.employee_comp_guide.sal_100 IS 'Target (100%) salary for this grade';
COMMENT ON COLUMN public.employee_comp_guide.sal_max IS 'Maximum salary for this grade';
COMMENT ON COLUMN public.employee_comp_guide.over_time IS 'Overtime eligibility (yes/no)';

-- Enable RLS
ALTER TABLE public.employee_comp_guide ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for employee_comp_guide
-- Allow anonymous and authenticated users to read compensation guides
CREATE POLICY "Allow anon to read compensation guides"
    ON public.employee_comp_guide
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Allow anonymous and authenticated users to insert compensation guides
CREATE POLICY "Allow anon to insert compensation guides"
    ON public.employee_comp_guide
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Allow anonymous and authenticated users to update compensation guides
CREATE POLICY "Allow anon to update compensation guides"
    ON public.employee_comp_guide
    FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- Allow anonymous and authenticated users to delete compensation guides
CREATE POLICY "Allow anon to delete compensation guides"
    ON public.employee_comp_guide
    FOR DELETE
    TO anon, authenticated
    USING (true);

-- Create employee_comp table for salary revision history
CREATE TABLE IF NOT EXISTS public.employee_comp (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    revision_date DATE NOT NULL,
    job_grade TEXT NOT NULL,
    revision_reason TEXT NOT NULL,
    new_sal TEXT NOT NULL,
    exception_reason TEXT,
    user_platform_id TEXT NOT NULL,
    employee_entity_id TEXT NOT NULL
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_employee_comp_user_platform_id ON public.employee_comp(user_platform_id);
CREATE INDEX IF NOT EXISTS idx_employee_comp_employee_entity_id ON public.employee_comp(employee_entity_id);
CREATE INDEX IF NOT EXISTS idx_employee_comp_revision_date ON public.employee_comp(revision_date DESC);

-- Add foreign key constraints
ALTER TABLE public.employee_comp
    ADD CONSTRAINT fk_employee_comp_user_platform_id
    FOREIGN KEY (user_platform_id)
    REFERENCES public.profiles(user_platform_id)
    ON DELETE CASCADE;

-- Add comments
COMMENT ON TABLE public.employee_comp IS 'Historical record of salary revisions and adjustments';
COMMENT ON COLUMN public.employee_comp.revision_date IS 'Date of salary revision';
COMMENT ON COLUMN public.employee_comp.job_grade IS 'Job grade at time of revision';
COMMENT ON COLUMN public.employee_comp.revision_reason IS 'Reason for salary revision';
COMMENT ON COLUMN public.employee_comp.new_sal IS 'New salary amount after revision';
COMMENT ON COLUMN public.employee_comp.exception_reason IS 'Reason if revision is exceptional/outside normal range';
COMMENT ON COLUMN public.employee_comp.user_platform_id IS 'Foreign key to profiles (employee receiving revision)';
COMMENT ON COLUMN public.employee_comp.employee_entity_id IS 'Human-readable employee ID (e.g., FDT000001)';

-- Enable RLS
ALTER TABLE public.employee_comp ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for employee_comp
-- Allow anonymous and authenticated users to read all compensation history
CREATE POLICY "Allow anon to read compensation history"
    ON public.employee_comp
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Allow anonymous and authenticated users to insert compensation history
CREATE POLICY "Allow anon to insert compensation history"
    ON public.employee_comp
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Allow anonymous and authenticated users to update compensation history
CREATE POLICY "Allow anon to update compensation history"
    ON public.employee_comp
    FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- Allow anonymous and authenticated users to delete compensation history
CREATE POLICY "Allow anon to delete compensation history"
    ON public.employee_comp
    FOR DELETE
    TO anon, authenticated
    USING (true);

-- Grant permissions
GRANT ALL ON public.employee_comp_guide TO anon, authenticated;
GRANT ALL ON public.employee_comp TO anon, authenticated;
