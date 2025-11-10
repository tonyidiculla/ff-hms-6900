-- Seed data for employee_comp_guide table
-- Insert sample job grades with salary ranges

INSERT INTO public.employee_comp_guide (job_grade, sal_min, sal_100, sal_max, over_time)
VALUES
    ('E1', '30000', '40000', '50000', 'yes'),
    ('E2', '50000', '65000', '80000', 'yes'),
    ('E3', '70000', '90000', '110000', 'yes'),
    ('M1', '90000', '115000', '140000', 'no'),
    ('M2', '120000', '150000', '180000', 'no'),
    ('M3', '160000', '200000', '240000', 'no'),
    ('S1', '200000', '250000', '300000', 'no'),
    ('S2', '280000', '350000', '420000', 'no')
ON CONFLICT (job_grade) DO NOTHING;

-- Verify the data was inserted
SELECT * FROM public.employee_comp_guide ORDER BY job_grade;
