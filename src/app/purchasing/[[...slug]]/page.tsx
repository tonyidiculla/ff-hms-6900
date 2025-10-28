'use client';

import { ServiceFrame } from '@/components/ServiceFrame';
import { usePathname } from 'next/navigation';

interface PurchasingPageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

export default function PurchasingPage({ params }: PurchasingPageProps) {
  const pathname = usePathname();
  
  // Extract the path after /purchasing
  const subPath = pathname.replace('/purchasing', '') || '/';
  const serviceUrl = `http://localhost:6870${subPath}`;
  
  return <ServiceFrame url={serviceUrl} serviceName="Purchasing Service" />;
}
