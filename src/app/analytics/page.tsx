'use client';

import React from 'react';
import { ContentArea, VStack } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Link from 'next/link';

export default function AnalyticsPage() {
  const modules = [
    {
      category: 'Financial Analytics',
      description: 'Financial planning and analysis dashboards',
      items: [
        { name: 'KPI Metrics', href: '/analytics/financial#kpi-metrics', icon: '🎯', color: 'blue' },
        { name: 'Financial Reports', href: '/analytics/financial#reports', icon: '📊', color: 'blue' },
        { name: 'Dashboards', href: '/analytics/financial#dashboards', icon: '📈', color: 'blue' },
        { name: 'Data Views', href: '/analytics/financial#data-views', icon: '📉', color: 'blue' },
      ],
    },
    {
      category: 'Performance Analytics',
      description: 'Staff, equipment, and operational metrics',
      items: [
        { name: 'Staff Performance', href: '/analytics/performance#staff', icon: '�', color: 'purple' },
        { name: 'Equipment Usage', href: '/analytics/performance#equipment', icon: '⚙️', color: 'purple' },
        { name: 'Operations', href: '/analytics/performance#operations', icon: '📋', color: 'purple' },
        { name: 'Departments', href: '/analytics/performance#departments', icon: '🏢', color: 'purple' },
      ],
    },
    {
      category: 'Patient Analytics',
      description: 'Patient demographics, outcomes, and satisfaction',
      items: [
        { name: 'Demographics', href: '/analytics/patients#demographics', icon: '👤', color: 'green' },
        { name: 'Treatment Outcomes', href: '/analytics/patients#outcomes', icon: '✓', color: 'green' },
        { name: 'Visit Patterns', href: '/analytics/patients#visits', icon: '📅', color: 'green' },
        { name: 'Satisfaction', href: '/analytics/patients#satisfaction', icon: '⭐', color: 'green' },
      ],
    },
    {
      category: 'Custom Reports',
      description: 'Build, schedule, and manage custom reports',
      items: [
        { name: 'Report Library', href: '/analytics/custom#library', icon: '📚', color: 'orange' },
        { name: 'Scheduled Reports', href: '/analytics/custom#scheduled', icon: '⏰', color: 'orange' },
        { name: 'Report Builder', href: '/analytics/custom#custom', icon: '🎨', color: 'orange' },
        { name: 'All Reports', href: '/analytics/reports', icon: '📋', color: 'orange' },
      ],
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
      purple: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
      green: 'bg-green-50 hover:bg-green-100 border-green-200',
      orange: 'bg-orange-50 hover:bg-orange-100 border-orange-200',
    };
    return colors[color] || colors.blue;
  };

  return (
    <ContentArea>
      <VStack size="sm">
        <div className="flex items-baseline gap-3">
          <h1 className="text-3xl font-bold text-slate-800">Analytics & Business Intelligence</h1>
          <p className="text-sm text-slate-500">Data-driven insights across all hospital operations</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-blue-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Active Dashboards</p>
                  <p className="text-2xl font-bold text-slate-800">12</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-blue-600 text-xl">📊</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-purple-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Total Reports</p>
                  <p className="text-2xl font-bold text-slate-800">47</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-purple-600 text-xl">📋</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-green-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Data Sources</p>
                  <p className="text-2xl font-bold text-slate-800">8</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-green-600 text-xl">🗄️</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-orange-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Scheduled Jobs</p>
                  <p className="text-2xl font-bold text-slate-800">23</p>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-orange-600 text-xl">⏰</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Modules */}
        {modules.map((module) => (
          <Card key={module.category} className="border-2 shadow-md">
            <CardHeader className="border-b-2 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{module.category}</CardTitle>
                  <p className="text-sm text-slate-500 mt-1">{module.description}</p>
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
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Last Data Refresh</p>
                <p className="font-semibold text-sm">5 minutes ago</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Data Coverage</p>
                <p className="font-semibold text-sm">Jan 2020 - Present</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Analytics Engine</p>
                <p className="font-semibold text-sm">Furfield Analytics v2.0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </VStack>
    </ContentArea>
  );
}
