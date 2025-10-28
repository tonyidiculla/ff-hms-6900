'use client';

import { ServiceFrame } from '@/components/ServiceFrame';
import { usePathname } from 'next/navigation';

export default function FacilityPage() {
  const pathname = usePathname();
  // Keep the full path including /facility since that's where the pages are in the service
  
  return <ServiceFrame url={`http://localhost:6840${pathname}`} serviceName="Facility Management Service" />;
}