-- Add job_grade column to employee_seat_assignment table
ALTER TABLE public.employee_seat_assignment 
ADD COLUMN IF NOT EXISTS job_grade TEXT;

-- Add is_manager column to employee_seat_assignment table
ALTER TABLE public.employee_seat_assignment 
ADD COLUMN IF NOT EXISTS is_manager BOOLEAN DEFAULT false;

-- Add index for job_grade
CREATE INDEX IF NOT EXISTS idx_employee_seat_assignment_job_grade 
ON public.employee_seat_assignment(job_grade);

-- Add index for is_manager
CREATE INDEX IF NOT EXISTS idx_employee_seat_assignment_is_manager 
ON public.employee_seat_assignment(is_manager);

-- Add comments
COMMENT ON COLUMN public.employee_seat_assignment.job_grade IS 'Job grade assigned to this position (e.g., E1, M1, S1)';
COMMENT ON COLUMN public.employee_seat_assignment.is_manager IS 'Indicates if this is a manager position';

-- Verify the columns were added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'employee_seat_assignment'
AND column_name IN ('job_grade', 'is_manager');
