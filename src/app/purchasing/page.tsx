'use client';

import { ContentArea, VStack } from '@/components/layout/PageLayout';
import { Card, CardContent } from '@/components/ui/Card';
import Link from 'next/link';

export default function PurchasingPage() {
  const modules = [
    {
      name: 'Purchase Orders',
      href: '/purchasing/purchase-orders',
      icon: '📋',
      description: 'Create and manage purchase orders',
      color: 'blue'
    },
    {
      name: 'Suppliers',
      href: '/purchasing/suppliers',
      icon: '🏢',
      description: 'Manage supplier information and relationships',
      color: 'green'
    },
    {
      name: 'Inventory',
      href: '/purchasing/inventory',
      icon: '📦',
      description: 'Track inventory levels and stock management',
      color: 'purple'
    },
    {
      name: 'Procurement',
      href: '/purchasing/procurement',
      icon: '🛒',
      description: 'Procurement requests and approvals',
      color: 'orange'
    },
    {
      name: 'Reports',
      href: '/purchasing/reports',
      icon: '📊',
      description: 'Purchasing analytics and reports',
      color: 'indigo'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
      green: 'bg-green-50 hover:bg-green-100 border-green-200',
      purple: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
      orange: 'bg-orange-50 hover:bg-orange-100 border-orange-200',
      indigo: 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200',
    };
    return colors[color] || colors.blue;
  };

  return (
    <ContentArea>
      <VStack size="sm">
        {/* Page Title */}
        <div className="flex items-baseline gap-3">
          <h1 className="text-3xl font-bold text-slate-800">Purchasing Management</h1>
          <p className="text-sm text-slate-500">Manage procurement, suppliers, and inventory</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-blue-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Active POs</p>
                  <p className="text-2xl font-bold text-slate-800">24</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-blue-600 text-xl">📋</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-green-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Active Suppliers</p>
                  <p className="text-2xl font-bold text-slate-800">48</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-green-600 text-xl">🏢</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-purple-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Total Spend (MTD)</p>
                  <p className="text-2xl font-bold text-slate-800">$145K</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-purple-600 text-xl">💰</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-orange-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Low Stock Items</p>
                  <p className="text-2xl font-bold text-slate-800">12</p>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-orange-600 text-xl">⚠️</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <Link key={module.href} href={module.href}>
              <Card className={`border-2 ${getColorClasses(module.color)} transition-all duration-200 hover:shadow-lg cursor-pointer h-full`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl shrink-0">{module.icon}</div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 mb-2">{module.name}</h3>
                      <p className="text-sm text-slate-600">{module.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </VStack>
    </ContentArea>
  );
}
