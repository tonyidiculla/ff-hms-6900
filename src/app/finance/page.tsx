'use client';

import { ContentArea, VStack } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

export default function FinancePage() {
  const modules = [
    {
      category: 'General Ledger',
      description: 'Core accounting and financial records',
      items: [
        { name: 'Chart of Accounts', href: '/finance/gl/chart-of-accounts', icon: '📊', color: 'blue' },
        { name: 'Journal Entries', href: '/finance/gl/journal-entries', icon: '📝', color: 'blue' },
        { name: 'Period Management', href: '/finance/gl/periods', icon: '📅', color: 'blue' },
        { name: 'Financial Reports', href: '/finance/gl/reports', icon: '📈', color: 'blue' },
      ],
    },
    {
      category: 'Accounts Payable',
      description: 'Vendor management and bill payments',
      items: [
        { name: 'Vendors', href: '/finance/ap/vendors', icon: '🏢', color: 'red' },
        { name: 'Purchase Invoices', href: '/finance/ap/invoices', icon: '🧾', color: 'red' },
        { name: 'Payments', href: '/finance/ap/payments', icon: '💳', color: 'red' },
        { name: 'Aging Report', href: '/finance/ap/aging', icon: '⏰', color: 'red' },
      ],
    },
    {
      category: 'Accounts Receivable',
      description: 'Customer billing and collections',
      items: [
        { name: 'Customers', href: '/finance/ar/customers', icon: '👥', color: 'green' },
        { name: 'Sales Invoices', href: '/finance/ar/invoices', icon: '📄', color: 'green' },
        { name: 'Receipts', href: '/finance/ar/receipts', icon: '💰', color: 'green' },
        { name: 'Aging Report', href: '/finance/ar/aging', icon: '📊', color: 'green' },
      ],
    },
    {
      category: 'Banking & Cash',
      description: 'Bank accounts and cash management',
      items: [
        { name: 'Bank Accounts', href: '/finance/banking/accounts', icon: '🏦', color: 'purple' },
        { name: 'Transactions', href: '/finance/banking/transactions', icon: '💸', color: 'purple' },
        { name: 'Reconciliation', href: '/finance/banking/reconciliation', icon: '✓', color: 'purple' },
        { name: 'Cash Flow', href: '/finance/banking/cash-flow', icon: '📉', color: 'purple' },
      ],
    },
    {
      category: 'Budgeting',
      description: 'Budget planning and variance analysis',
      items: [
        { name: 'Budgets', href: '/finance/budgeting/budgets', icon: '💼', color: 'orange' },
        { name: 'Variance Reports', href: '/finance/budgeting/variance', icon: '📊', color: 'orange' },
        { name: 'Forecasting', href: '/finance/budgeting/forecast', icon: '🔮', color: 'orange' },
      ],
    },
    {
      category: 'Fixed Assets',
      description: 'Asset tracking and depreciation',
      items: [
        { name: 'Assets', href: '/finance/assets/list', icon: '🏗️', color: 'yellow' },
        { name: 'Categories', href: '/finance/assets/categories', icon: '📁', color: 'yellow' },
        { name: 'Depreciation', href: '/finance/assets/depreciation', icon: '📉', color: 'yellow' },
        { name: 'Disposals', href: '/finance/assets/disposals', icon: '♻️', color: 'yellow' },
      ],
    },
    {
      category: 'FP&A',
      description: 'Financial planning and analysis',
      items: [
        { name: 'Dashboards', href: '/finance/fpa/dashboards', icon: '📊', color: 'indigo' },
        { name: 'KPI Metrics', href: '/finance/fpa/kpis', icon: '🎯', color: 'indigo' },
        { name: 'Reports', href: '/finance/fpa/reports', icon: '📈', color: 'indigo' },
      ],
    },
    {
      category: 'Compliance',
      description: 'Audit and regulatory compliance',
      items: [
        { name: 'Audit Logs', href: '/finance/compliance/audit-logs', icon: '🔍', color: 'gray' },
        { name: 'Tax Returns', href: '/finance/compliance/tax-returns', icon: '📋', color: 'gray' },
        { name: 'Statutory Reports', href: '/finance/compliance/reports', icon: '📑', color: 'gray' },
      ],
    },
    {
      category: 'Payroll Management',
      description: 'Payroll processing, schedules, and tax compliance',
      items: [
        { name: 'Payroll', href: '/finance/payroll', icon: '�', color: 'teal' },
      ],
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
      red: 'bg-red-50 hover:bg-red-100 border-red-200',
      green: 'bg-green-50 hover:bg-green-100 border-green-200',
      purple: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
      orange: 'bg-orange-50 hover:bg-orange-100 border-orange-200',
      yellow: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200',
      indigo: 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200',
      gray: 'bg-gray-50 hover:bg-gray-100 border-gray-200',
      teal: 'bg-teal-50 hover:bg-teal-100 border-teal-200',
    };
    return colors[color] || colors.blue;
  };

  return (
    <ContentArea>
      <VStack size="sm">
        <div className="flex items-baseline gap-3">
          <h1 className="text-3xl font-bold text-slate-800">Finance Management</h1>
          <p className="text-sm text-slate-500">Comprehensive financial management system with 9 integrated modules</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-emerald-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Cash Balance</p>
                  <p className="text-2xl font-bold text-slate-800">$125K</p>
                </div>
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-emerald-600 text-xl">💵</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-red-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Accounts Payable</p>
                  <p className="text-2xl font-bold text-slate-800">$45.5K</p>
                </div>
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-red-600 text-xl">💳</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-green-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Accounts Receivable</p>
                  <p className="text-2xl font-bold text-slate-800">$55.5K</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-green-600 text-xl">💰</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-purple-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Budget Utilization</p>
                  <p className="text-2xl font-bold text-slate-800">31%</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-purple-600 text-xl">📊</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Finance Modules */}
        {modules.map((module) => (
          <Card key={module.category} className="border-2 shadow-md">
            <CardHeader className="border-b-2 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{module.category}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{module.description}</p>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {module.items.length} Features
                </span>
              </div>
            </CardHeader>
            <CardContent className="py-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {module.items.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <div className={`p-4 rounded-lg border-2 transition-all shadow-sm hover:shadow-md ${getColorClasses(item.color)}`}>
                      <div className="text-2xl mb-2">{item.icon}</div>
                      <h3 className="font-semibold text-sm">{item.name}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* System Info */}
        <Card className="border-2 shadow-md">
          <CardHeader className="border-b-2 pb-4">
            <CardTitle className="text-lg">System Information</CardTitle>
          </CardHeader>
          <CardContent className="py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Fiscal Year</p>
                <p className="font-semibold text-sm">2024 (Jan - Dec)</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Current Period</p>
                <p className="font-semibold text-sm">January 2024</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Base Currency</p>
                <p className="font-semibold text-sm">USD</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </VStack>
    </ContentArea>
  );
}
