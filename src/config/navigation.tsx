'use client';

// HMS Navigation Configuration

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
  moduleId?: number; // Module ID for subscription filtering
}

export const hmsNavigation: NavigationItem[] = [
  {
    name: 'Chat',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    children: [
      { name: 'Chat Dashboard', href: '/chat' },
      { name: 'Messages', href: '/chat/messages' },
      { name: 'Create Channel', href: '/chat/create' },
    ],
  },
  // Separator
  {
    name: 'separator',
    isSeparator: true,
  },
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
    href: '/outpatient',
    moduleId: 1, // Corresponds to Outpatient module
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2 a2 2 0 012 2" />
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
    moduleId: 2, // Corresponds to Inpatient module
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h4l3 9 4-18 3 9h4" />
      </svg>
    ),
    children: [
      { name: 'Admissions', href: '/inpatient/admissions' },
      { name: 'Ward Management', href: '/inpatient/wards' },
    ],
  },
  {
    name: 'Pharmacy',
    href: '/pharmacy',
    moduleId: 4, // Corresponds to Pharmacy module
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
    href: '/diagnostics',
    moduleId: 3, // Corresponds to Diagnostics module
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    children: [
      { name: 'Lab Tests', href: '/diagnostics/lab' },
    ],
  },
  {
    name: 'Operation Theater',
    href: '/operation-theater',
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
    name: 'Facility',
    href: '/facility',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    children: [
      { name: 'Work Orders', href: '/facility/work-orders' },
      { name: 'Equipment', href: '/facility/equipment' },
      { name: 'Maintenance', href: '/facility/maintenance' },
      { name: 'Compliance', href: '/facility/compliance' },
    ],
  },
  {
    name: 'HR',
    href: '/hr',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    children: [
      { name: 'Employees', href: '/hr/employees' },
      { name: 'Attendance & Leave', href: '/hr/attendance-leave' },
      { name: 'Performance', href: '/hr/performance' },
      { name: 'Training', href: '/hr/training' },
      { name: 'Rostering', href: '/rostering' },
    ],
  },
  {
    name: 'Purchasing',
    href: '/purchasing',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    children: [
      { name: 'Purchase Orders', href: '/purchasing/purchase-orders' },
      { name: 'Suppliers', href: '/purchasing/suppliers' },
      { name: 'Inventory', href: '/purchasing/inventory' },
      { name: 'Procurement', href: '/purchasing/procurement' },
      { name: 'Reports', href: '/purchasing/reports' },
    ],
  },
  {
    name: 'Finance',
    href: '/finance',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8h6M9 12h6m-7 8h8a2 2 0 002-2V6a2 2 0 00-2-2H8a2 2 0 00-2 2v10a2 2 0 002 2zm0 0h8a2 2 0 002-2V6a2 2 0 00-2-2H8a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    children: [
      { name: 'Accounts', href: '/finance/accounts' },
      { name: 'Invoicing', href: '/finance/invoicing' },
      { name: 'Reports', href: '/finance/reports' },
    ],
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    children: [
      { name: 'Reports', href: '/analytics/reports' },
      { name: 'Performance', href: '/analytics/performance' },
      { name: 'Financial Analytics', href: '/analytics/financial' },
      { name: 'Patient Analytics', href: '/analytics/patients' },
      { name: 'Custom Reports', href: '/analytics/custom' },
    ],
  },
];
