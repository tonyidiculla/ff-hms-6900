'use client';

import { ServiceFrame } from '@/components/ServiceFrame';
import { usePathname } from 'next/navigation';

export default function RosteringPage() {
  const pathname = usePathname();
  // Rostering merged with HRMS service on port 6860
  // Keep the full path including /rostering since that's where the pages are in the HRMS service
  
  return <ServiceFrame url={`http://localhost:6860${pathname}`} serviceName="Rostering Service" />;
}
