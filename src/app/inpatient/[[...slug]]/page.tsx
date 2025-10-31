'use client';

import { ServiceFrame } from '@/components/ServiceFrame';
import { usePathname } from 'next/navigation';

export default function InpatientPage() {
  const pathname = usePathname();
  // Keep the full path since the inpatient service has routes under /inpatient/
  
  return <ServiceFrame url={`http://localhost:6831${pathname}`} serviceName="Inpatient Service" />;
}
