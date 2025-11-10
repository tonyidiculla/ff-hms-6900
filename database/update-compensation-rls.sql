-- Update RLS policies for compensation tables to allow anonymous access

-- Drop existing policies for employee_comp_guide
DROP POLICY IF EXISTS "Allow authenticated users to read compensation guides" ON public.employee_comp_guide;
DROP POLICY IF EXISTS "Allow service role to manage compensation guides" ON public.employee_comp_guide;
DROP POLICY IF EXISTS "Allow authenticated users to manage compensation guides" ON public.employee_comp_guide;

-- Drop existing policies for employee_comp
DROP POLICY IF EXISTS "Allow users to read their own compensation history" ON public.employee_comp;
DROP POLICY IF EXISTS "Allow service role to manage compensation history" ON public.employee_comp;
DROP POLICY IF EXISTS "Allow authenticated users to manage compensation history" ON public.employee_comp;

-- Create new RLS policies for employee_comp_guide
CREATE POLICY "Allow anon to read compensation guides"
    ON public.employee_comp_guide
    FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow anon to insert compensation guides"
    ON public.employee_comp_guide
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Allow anon to update compensation guides"
    ON public.employee_comp_guide
    FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow anon to delete compensation guides"
    ON public.employee_comp_guide
    FOR DELETE
    TO anon, authenticated
    USING (true);

-- Create new RLS policies for employee_comp
CREATE POLICY "Allow anon to read compensation history"
    ON public.employee_comp
    FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow anon to insert compensation history"
    ON public.employee_comp
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Allow anon to update compensation history"
    ON public.employee_comp
    FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow anon to delete compensation history"
    ON public.employee_comp
    FOR DELETE
    TO anon, authenticated
    USING (true);

-- Update grants
REVOKE ALL ON public.employee_comp_guide FROM authenticated;
REVOKE ALL ON public.employee_comp_guide FROM service_role;
GRANT ALL ON public.employee_comp_guide TO anon, authenticated;

REVOKE ALL ON public.employee_comp FROM authenticated;
REVOKE ALL ON public.employee_comp FROM service_role;
GRANT ALL ON public.employee_comp TO anon, authenticated;

-- Verify policies
SELECT schemaname, tablename, policyname, roles, cmd 
FROM pg_policies 
WHERE tablename IN ('employee_comp_guide', 'employee_comp')
ORDER BY tablename, policyname;
