import React from 'react';
import { ContentArea } from '@/components/layout/PageLayout';
import Link from 'next/link';

interface TabItem {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  current?: boolean;
}

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  breadcrumbs?: Array<{ name: string; href?: string }>;
}

interface HRMSLayoutProps {
  children: React.ReactNode;
  header: HeaderProps;
  tabs?: TabItem[];
}

export function HRMSLayout({ children, header, tabs }: HRMSLayoutProps) {
  return (
    <ContentArea>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
              {header.breadcrumbs?.map((crumb, index) => (
                <React.Fragment key={index}>
                  {crumb.href ? (
                    <Link href={crumb.href} className="hover:text-gray-700">
                      {crumb.name}
                    </Link>
                  ) : (
                    <span className="text-gray-900">{crumb.name}</span>
                  )}
                  {index < header.breadcrumbs!.length - 1 && <span>/</span>}
                </React.Fragment>
              ))}
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{header.title}</h1>
            {header.subtitle && (
              <p className="text-gray-600 mt-1">{header.subtitle}</p>
            )}
          </div>
          {header.actions && (
            <div className="shrink-0">
              {header.actions}
            </div>
          )}
        </div>

        {/* Tabs */}
        {tabs && (
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <Link
                    key={tab.name}
                    href={tab.href}
                    className="flex items-center py-2 px-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  >
                    {Icon && <Icon className="h-4 w-4 mr-2" />}
                    {tab.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}

        {/* Content */}
        {children}
      </div>
    </ContentArea>
  );
}

interface ContentCardProps {
  title?: string;
  children: React.ReactNode;
  headerActions?: React.ReactNode;
}

export function ContentCard({ title, children, headerActions }: ContentCardProps) {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      {title && (
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {headerActions}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}

interface MetricsGridProps {
  children: React.ReactNode;
  columns?: number;
}

export function MetricsGrid({ children, columns = 4 }: MetricsGridProps) {
  const gridColsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  }[columns] || 'grid-cols-4';

  return (
    <div className={`grid ${gridColsClass} gap-6`}>
      {children}
    </div>
  );
}