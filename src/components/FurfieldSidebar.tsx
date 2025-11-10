'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

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

export const Sidebar: React.FC<FurfieldSidebarProps> = ({ navigation }) => {
  const pathname = usePathname();
  const { user, loading: authLoading } = useAuth();
  const [subscribedModules, setSubscribedModules] = React.useState<string[]>([]);
  const [loadingModules, setLoadingModules] = React.useState(true);
  
  // Fetch subscribed modules - only after auth is complete
  React.useEffect(() => {
    // Don't fetch if auth is still loading or user is not authenticated
    if (authLoading || !user) {
      console.log('[HMS Sidebar] Waiting for authentication...', { authLoading, hasUser: !!user });
      return;
    }

    const fetchSubscriptions = async () => {
      try {
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
          console.warn('[HMS Sidebar] Failed to fetch subscriptions:', response.status, errorData);
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
  }, [authLoading, user]);
  
  // Filter navigation based on subscriptions
  const getFilteredNavigation = () => {
    const nav = navigation || [];
    
    // If auth or modules still loading, show only Dashboard
    if (authLoading || loadingModules) {
      return nav.filter((item: NavigationItem) => item.name === 'Dashboard');
    }
    
    return nav.filter((item: NavigationItem) => {
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
  const navItems = filteredNavigation || [];

  const toggleExpanded = (name: string) => {
    setExpandedItems(prev =>
      prev.includes(name) ? prev.filter(item => item !== name) : [...prev, name]
    );
  };

  return (
    <aside className="w-64 bg-white/40 backdrop-blur-md shadow-lg border-r border-white/20 flex flex-col fixed left-0 top-16 bottom-0 h-[calc(100vh-4rem)] z-30">
      <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
        {navItems.map((item: NavigationItem, index: number) => {
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
                    <Link
                      href={item.href ?? '/chat'}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all"
                    >
                      {item.icon}
                      <span>Chat</span>
                    </Link>
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
                        {item.children!.map((child: NavigationChild) => {
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
                  {item.children!.map((child: NavigationChild) => {
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
      <div className="p-4 border-t border-gray-200 bg-white/50 shrink-0">
        <div className="flex items-center justify-center gap-3">
          <Image 
            src="/Furfield-icon.png" 
            alt="Furfield Logo" 
            width={40}
            height={40}
            className="rounded opacity-90"
            style={{ width: 'auto', height: 'auto' }}
          />
          <div className="text-center flex-1">
            <p className="text-xs text-gray-500">Powered by</p>
            <p className="text-sm font-semibold text-blue-600">FURFIELD</p>
          </div>
          <Link
            href="/finance/styles-showcase"
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors group"
            title="Styles Showcase"
          >
            <svg 
              className="w-4 h-4 text-slate-600 group-hover:text-blue-600 transition-colors" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
          </Link>
        </div>
      </div>
    </aside>
  );
};
