'use client';

import { ServiceFrame } from '@/components/ServiceFrame';
import { usePathname } from 'next/navigation';

export default function AnalyticsPage() {
  const pathname = usePathname();
  // Keep the full path including /analytics since that's where the pages are in the service
  
  return <ServiceFrame url={`http://localhost:6820${pathname}`} serviceName="Analytics Service" />;
}