'use client';

import { ServiceFrame } from '@/components/ServiceFrame';
import { usePathname } from 'next/navigation';

export default function OutpatientPage() {
  const pathname = usePathname();
  // Strip /outpatient prefix since the service doesn't have that in its routes
  const servicePath = pathname.replace('/outpatient', '') || '/';
  
  return (
    <div className="flex-1">
      <ServiceFrame url={`http://localhost:6830${servicePath}`} serviceName="Outpatient Service" />
    </div>
  );
}
