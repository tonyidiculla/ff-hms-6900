'use client';

import { ServiceFrame } from '@/components/ServiceFrame';
import { usePathname } from 'next/navigation';

export default function ChatPage() {
  const pathname = usePathname();
  // Chat service has /chat base path in its routes
  // Remove /chat prefix when passing to service since it's the root of chat service
  const servicePath = pathname.replace('/chat', '') || '/';
  
  return <ServiceFrame url={`http://localhost:6880${servicePath}`} serviceName="Chat Service" />;
}