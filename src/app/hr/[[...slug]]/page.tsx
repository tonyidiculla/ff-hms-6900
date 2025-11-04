'use client';

import { ServiceFrame } from '@/components/ServiceFrame';
import { usePathname } from 'next/navigation';

export default function HRPage() {
  const pathname = usePathname();
  
  // Map HMS Gateway HR paths to HRMS service paths
  let hrmsPath = '/';
  
  if (pathname === '/hr') {
    hrmsPath = '/'; // HRMS dashboard is at root
  } else if (pathname === '/hr/employees') {
    hrmsPath = '/employees';
  } else if (pathname === '/hr/attendance') {
    hrmsPath = '/attendance-leave?tab=attendance'; // Redirect to combined interface
  } else if (pathname === '/hr/leave') {
    hrmsPath = '/attendance-leave?tab=leave'; // Redirect to combined interface
  } else if (pathname === '/hr/attendance-leave') {
    hrmsPath = '/attendance-leave';
  } else if (pathname === '/hr/performance') {
    hrmsPath = '/performance';
  } else if (pathname === '/hr/training') {
    hrmsPath = '/training';
  } else {
    // For any other HR sub-routes, strip the /hr prefix
    hrmsPath = pathname.replace('/hr', '') || '/';
  }
  
  return <ServiceFrame url={`http://localhost:6860${hrmsPath}`} serviceName="Human Resources Management" />;
}
