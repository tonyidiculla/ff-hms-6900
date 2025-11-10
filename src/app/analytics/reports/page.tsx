'use client';

import React from 'react';
import { ContentArea, VStack } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function AnalyticsReportsPage() {
  return (
    <ContentArea>
      <VStack size="sm">
        <div className="flex items-baseline gap-3">
          <h1 className="text-3xl font-bold text-slate-800">Analytics & Reports</h1>
          <p className="text-sm text-slate-500">Business intelligence and data analytics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  <p className="text-xs text-slate-500 mt-2">Active Dashboards</p>
                  <p className="text-2xl font-bold text-slate-800">12</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-green-600 text-xl">📊</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-blue-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Data Sources</p>
                  <p className="text-2xl font-bold text-slate-800">8</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-blue-600 text-xl">🗄️</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-orange-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Scheduled Reports</p>
                  <p className="text-2xl font-bold text-slate-800">23</p>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-orange-600 text-xl">⏰</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2 shadow-md">
          <CardHeader className="border-b-2 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Reports & Analytics</CardTitle>
              <Button>+ Create Report</Button>
            </div>
          </CardHeader>
          <CardContent className="py-8">
            <div className="text-center text-slate-500">
              <p>Analytics features coming soon</p>
              <p className="text-sm mt-2">Connect to Analytics microservice API for full functionality</p>
            </div>
          </CardContent>
        </Card>
      </VStack>
    </ContentArea>
  );
}
