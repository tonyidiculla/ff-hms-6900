'use client';

import React from 'react';
import Link from 'next/link';
import { ContentArea, VStack } from '@/components/layout/PageLayout';
import { Card, CardContent } from '@/components/ui/Card';

export default function OperationTheaterPage() {
  const modules = [
    {
      category: 'Surgery Management',
      description: 'Operation theater scheduling and management',
      features: [
        { name: 'Surgery Schedule', href: '/operation-theater/schedule', icon: '🏥', color: 'blue', description: 'Schedule and manage surgical procedures' },
      ]
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
    };
    return colors[color] || colors.blue;
  };

  return (
    <ContentArea>
      <VStack size="sm">
        <div className="flex items-baseline gap-3">
          <h1 className="text-3xl font-bold text-slate-800">Operation Theater</h1>
          <p className="text-sm text-slate-500">Surgical services and operation theater management</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-blue-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-slate-800">8</div>
                  <p className="text-xs text-slate-500 mt-2">Today's Surgeries</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xl">
                  🏥
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-green-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-slate-800">2</div>
                  <p className="text-xs text-slate-500 mt-2">In Progress</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-xl">
                  ⏳
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-orange-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-slate-800">3</div>
                  <p className="text-xs text-slate-500 mt-2">Emergency Cases</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-xl">
                  🚨
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-purple-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-slate-800">4</div>
                  <p className="text-xs text-slate-500 mt-2">Available Theaters</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-xl">
                  🏢
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
