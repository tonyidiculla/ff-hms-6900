-- Add is_manager column to employee_comp_guide table
ALTER TABLE public.employee_comp_guide 
ADD COLUMN IF NOT EXISTS is_manager BOOLEAN DEFAULT false;

-- Add index for is_manager
CREATE INDEX IF NOT EXISTS idx_employee_comp_guide_is_manager 
ON public.employee_comp_guide(is_manager);

-- Add comment
COMMENT ON COLUMN public.employee_comp_guide.is_manager IS 'Indicates if this job grade is eligible for manager positions';

-- Verify the column was added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'employee_comp_guide'
AND column_name = 'is_manager';
