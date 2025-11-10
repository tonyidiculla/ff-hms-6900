'use client';

import React from 'react';
import Link from 'next/link';
import { ContentArea, VStack } from '@/components/layout/PageLayout';
import { Card, CardContent } from '@/components/ui/Card';

export default function PharmacyPage() {
  const modules = [
    {
      category: 'Inventory Management',
      description: 'Medication stock and inventory control',
      features: [
        { name: 'Inventory', href: '/pharmacy/inventory', icon: '💊', color: 'blue', description: 'Medication stock and inventory management' },
      ]
    },
    {
      category: 'Prescription Services',
      description: 'Dispensing and prescription management',
      features: [
        { name: 'Prescription Dispensing', href: '/pharmacy/dispensing', icon: '📦', color: 'green', description: 'Process and dispense patient prescriptions' },
        { name: 'Drug Interactions', href: '/pharmacy/interactions', icon: '⚠️', color: 'orange', description: 'Monitor and manage drug interactions' },
      ]
    },
    {
      category: 'Billing & Payments',
      description: 'Pharmacy sales and financial transactions',
      features: [
        { name: 'Pharmacy Billing', href: '/pharmacy/billing', icon: '💳', color: 'emerald', description: 'Manage pharmacy sales and billing' },
      ]
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
      green: 'bg-green-50 hover:bg-green-100 border-green-200',
      orange: 'bg-orange-50 hover:bg-orange-100 border-orange-200',
      emerald: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200',
    };
    return colors[color] || colors.blue;
  };

  return (
    <ContentArea>
      <VStack size="sm">
        <div className="flex items-baseline gap-3">
          <h1 className="text-3xl font-bold text-slate-800">Pharmacy Services</h1>
          <p className="text-sm text-slate-500">Medication management and inventory control</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-blue-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-slate-800">486</div>
                  <p className="text-xs text-slate-500 mt-2">Total Medications</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xl">
                  💊
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-green-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-slate-800">428</div>
                  <p className="text-xs text-slate-500 mt-2">In Stock</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-xl">
                  ✅
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-orange-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-slate-800">32</div>
                  <p className="text-xs text-slate-500 mt-2">Low Stock</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-xl">
                  ⚠️
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-red-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-slate-800">14</div>
                  <p className="text-xs text-slate-500 mt-2">Expiring Soon</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-xl">
                  🚨
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Module Sections */}
        {modules.map((module, idx) => (
          <div key={idx}>
            <div className="mb-3">
              <h2 className="text-xl font-bold text-slate-800">{module.category}</h2>
              <p className="text-sm text-slate-500">{module.description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {module.features.map((feature, featureIdx) => (
                <Link key={featureIdx} href={feature.href}>
                  <Card className={`border-2 transition-all hover:shadow-lg cursor-pointer h-full ${getColorClasses(feature.color)}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{feature.icon}</div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-800 text-sm mb-1">
                            {feature.name}
                          </h3>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </VStack>
    </ContentArea>
  );
}
