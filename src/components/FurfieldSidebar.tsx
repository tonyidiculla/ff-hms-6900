'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

// Type definitions
interface NavigationChild {
  name: string;
  href: string;
}

interface NavigationItem {
  name: string;
  href?: string;
  icon?: React.ReactNode;
  children?: NavigationChild[];
  isSeparator?: boolean;
  moduleId?: number | string; // Add module ID for subscription filtering (can be number or string)
}

interface FurfieldSidebarProps {
  currentModule?: string; // e.g., 'HMS', 'Finance', 'Clinic'
  currentPath?: string;
  appName?: string; // e.g., 'HMS', 'FINM', 'CLIN'
  navigation?: NavigationItem[]; // Custom navigation items (optional)
  Link?: React.ComponentType<any>; // Next.js Link component or regular <a>
  Image?: React.ComponentType<any>; // Next.js Image component or regular <img>
  usePathname?: () => string; // Next.js usePathname hook
  cn?: (...classes: any[]) => string; // Tailwind merge utility
}

const defaultNavigation: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    name: 'Outpatient',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    children: [
      { name: 'Appointments', href: '/outpatient/appointments' },
      { name: 'Consultations', href: '/outpatient/consultations' },
      { name: 'Billing', href: '/outpatient/billing' },
    ],
  },
  {
    name: 'Inpatient',
    href: '/inpatient',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    children: [
      { name: 'Admissions', href: '/inpatient/admissions' },
      { name: 'Ward Management', href: '/inpatient/wards' },
    ],
  },
  {
    name: 'Operation Theater',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
    children: [
      { name: 'Surgery Schedule', href: '/operation-theater/schedule' },
    ],
  },
  {
    name: 'Pharmacy',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    children: [
      { name: 'Inventory', href: '/pharmacy/inventory' },
    ],
  },
  {
    name: 'Diagnostics',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    children: [
      { name: 'Lab Tests', href: '/diagnostics/lab' },
    ],
  },
  // Separator
  {
    name: 'separator',
    isSeparator: true,
  },
  // Other Application Modules
  {
    name: 'Finance',
    href: 'http://localhost:6850',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    name: 'HRMS',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    children: [
      { name: 'Dashboard', href: 'http://localhost:6860' },
      { name: 'Employees', href: 'http://localhost:6860/employees' },
      { name: 'Attendance', href: 'http://localhost:6860/attendance' },
      { name: 'Leave Management', href: 'http://localhost:6860/leave' },
      { name: 'Performance', href: 'http://localhost:6860/performance' },
      { name: 'Training', href: 'http://localhost:6860/training' },
      { name: 'Rostering', href: '/rostering' },
    ],
  },
  {
    name: 'Purchasing',
    href: 'http://localhost:6870',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
];

export const Sidebar: React.FC<FurfieldSidebarProps> = ({ navigation }) => {
  const pathname = usePathname();
  const [subscribedModules, setSubscribedModules] = React.useState<string[]>([]);
  const [loadingModules, setLoadingModules] = React.useState(true);
  
  // Fetch subscribed modules (wait a bit for auth to complete)
  React.useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        // Wait a bit for auth to complete
        await new Promise(resolve => setTimeout(resolve, 500));
        
        console.log('[HMS Sidebar] Fetching subscriptions from /api/subscriptions/modules...');
        const response = await fetch('/api/subscriptions/modules');
        console.log('[HMS Sidebar] Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('[HMS Sidebar] Subscription data:', data);
          const moduleCodes = data.modules?.map((m: any) => m.code) || [];
          console.log('[HMS Sidebar] Subscribed module codes:', moduleCodes);
          setSubscribedModules(moduleCodes);
        } else {
          const errorData = await response.text();
          console.error('[HMS Sidebar] Failed to fetch subscriptions:', response.status, errorData);
          // If auth not ready, show all modules as fallback
          console.log('[HMS Sidebar] Using fallback - showing all modules');
        }
      } catch (error) {
        console.error('[HMS Sidebar] Error fetching subscriptions:', error);
      } finally {
        setLoadingModules(false);
      }
    };

    fetchSubscriptions();
  }, []);
  
  // Filter navigation based on subscriptions
  const getFilteredNavigation = () => {
    const nav = navigation || defaultNavigation;
    
    // If still loading, show only Dashboard
    if (loadingModules) {
      return nav.filter(item => item.name === 'Dashboard');
    }
    
    return nav.filter(item => {
      // Hide separator if no subscribed modules
      if (item.isSeparator) return subscribedModules.length > 0;
      
      // Dashboard is always shown
      if (item.name === 'Dashboard') {
        return true;
      }
      
      // Every other module requires subscription - no exceptions
      // Module codes must match the 'code' field in modules_master table
      const moduleMap: Record<string, string> = {
        'Outpatient': 'OPD',
        'Inpatient': 'INP',
        'Pharmacy': 'PHA',
        'Diagnostics': 'DIA',
        'Operation Theater': 'OTH',
        'Facility': 'FAC',
        'Finance': 'FIN',
        'HR': 'HRM',
        'Purchasing': 'PUR',
        'Analytics': 'ANA',
        'Scheduling': 'SCH',
        'Rostering': 'RST',
        'Chat': 'CHT'
      };
      
      const moduleCode = moduleMap[item.name];
      
      if (!moduleCode) {
        console.log('[HMS Sidebar] No module code mapping for:', item.name);
        return false;
      }
      
      const isSubscribed = subscribedModules.includes(moduleCode);
      
      console.log('[HMS Sidebar] Checking', item.name, '- Code:', moduleCode, '- Subscribed:', isSubscribed, '- Available codes:', subscribedModules);
      
      return isSubscribed;
    });
  };
  
  const filteredNavigation = getFilteredNavigation();
  
  // Function to determine which items should be expanded based on current path
  const getExpandedItems = () => {
    const expanded: string[] = []; // Start with nothing expanded
    
    // Auto-expand based on current route
    if (pathname.startsWith('/outpatient')) {
      expanded.push('Outpatient');
    }
    if (pathname.startsWith('/hr') || pathname.includes('6860')) {
      expanded.push('HR');
    }
    if (pathname.startsWith('/rostering')) {
      expanded.push('HR'); // Rostering is a child of HR
    }
    if (pathname.startsWith('/purchasing')) {
      expanded.push('Purchasing');
    }
    if (pathname.startsWith('/finance')) {
      expanded.push('Finance');
    }
    if (pathname.startsWith('/inpatient')) {
      expanded.push('Inpatient');
    }
    if (pathname.startsWith('/operation-theater')) {
      expanded.push('Operation Theater');
    }
    if (pathname.startsWith('/pharmacy')) {
      expanded.push('Pharmacy');
    }
    if (pathname.startsWith('/diagnostics')) {
      expanded.push('Diagnostics');
    }
    if (pathname.startsWith('/chat')) {
      expanded.push('Chat');
    }
    if (pathname.startsWith('/facility')) {
      expanded.push('Facility');
    }
    if (pathname.startsWith('/analytics')) {
      expanded.push('Analytics');
    }
    
    return expanded;
  };

  const [expandedItems, setExpandedItems] = React.useState<string[]>(getExpandedItems);

  // Update expanded items when pathname changes
  React.useEffect(() => {
    setExpandedItems(getExpandedItems());
  }, [pathname]);

  // Use filtered navigation
  const navItems = filteredNavigation || defaultNavigation;

  const toggleExpanded = (name: string) => {
    setExpandedItems(prev =>
      prev.includes(name) ? prev.filter(item => item !== name) : [...prev, name]
    );
  };

  return (
    <aside className="w-64 bg-white/40 backdrop-blur-md shadow-lg border-r border-white/20 flex flex-col">
      <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
        {navItems.map((item, index) => {
          // Handle separator
          if (item.isSeparator) {
            return (
              <div key={`separator-${index}`} className="py-0.5">
                <div className="border-t border-gray-200"></div>
              </div>
            );
          }

          const isActive = pathname === item.href || 
                    (item.href && pathname.startsWith(item.href) && item.href !== '/');
          const isExpanded = expandedItems.includes(item.name);
          const hasChildren = item.children && item.children.length > 0;

          return (
            <div key={item.name} className="relative group">
              {hasChildren ? (
                <div>
                  {item.name === 'Chat' ? (
                    <div className="flex items-center px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all">
                      {item.icon}
                    </div>
                  ) : item.href ? (
                    // Item has both href and children - split into link and toggle button
                    <div className={cn(
                      'flex items-center rounded-xl overflow-hidden transition-all',
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                        : 'hover:bg-blue-50 hover:text-blue-700 text-gray-700'
                    )}>
                      <Link
                        href={item.href}
                        className="flex-1 flex items-center gap-3 px-4 py-3 text-sm font-medium"
                      >
                        {item.icon}
                        {item.name}
                      </Link>
                      <button
                        onClick={() => toggleExpanded(item.name)}
                        className="px-3 py-3 text-sm font-medium border-l border-white/20"
                      >
                        <svg
                          className={cn('w-4 h-4 transition-transform', isExpanded && 'rotate-90')}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    // Item has only children, no href - just toggle button
                    <button
                      onClick={() => toggleExpanded(item.name)}
                      className={cn(
                        'flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium transition-all',
                        'hover:bg-blue-50 hover:text-blue-700'
                      )}
                    >
                      <span className="flex items-center gap-3">
                        {item.icon}
                        {item.name}
                      </span>
                      <svg
                        className={cn('w-4 h-4 transition-transform', isExpanded && 'rotate-90')}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                  
                  {/* Hover dropdown for Chat */}
                  {item.name === 'Chat' && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 hover:opacity-100 hover:visible">
                      <div className="py-2">
                        {item.children!.map((child) => {
                          const isChildActive = pathname === child.href || 
                                              (pathname.startsWith(child.href) && child.href !== '/');
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={cn(
                                'block px-4 py-2.5 transition-all',
                                isChildActive
                                  ? 'text-orange-700 font-semibold text-base'
                                  : 'text-gray-700 text-sm hover:text-orange-600'
                              )}
                            >
                              {child.name}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href!}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                      : 'hover:bg-blue-50 hover:text-blue-700 text-gray-700'
                  )}
                >
                  {item.icon}
                  {item.name}
                </Link>
              )}
              
              {hasChildren && isExpanded && item.name !== 'Chat' && (
                <div className="ml-8 mt-1 space-y-1">
                  {item.children!.map((child) => {
                    const isChildActive = pathname === child.href || 
                                        (pathname.startsWith(child.href) && child.href !== '/');
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          'block px-4 py-2.5 rounded-lg transition-all',
                          isChildActive
                            ? 'text-orange-700 font-semibold text-base'
                            : 'text-gray-600 text-sm hover:text-orange-600'
                        )}
                      >
                        {child.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
      
      {/* Powered by FURFIELD - Fixed at Bottom */}
      <div className="p-4 border-t border-gray-200 bg-white/50">
        <div className="flex items-center justify-center gap-3">
          <Image 
            src="/Furfield-icon.png" 
            alt="Furfield Logo" 
            width={40}
            height={40}
            className="rounded opacity-90"
            style={{ width: 'auto', height: 'auto' }}
          />
          <div className="text-center">
            <p className="text-xs text-gray-500">Powered by</p>
            <p className="text-sm font-semibold text-blue-600">FURFIELD</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
