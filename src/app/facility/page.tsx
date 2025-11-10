'use client';

import React from 'react';
import { ContentArea, VStack } from '@/components/layout/PageLayout';
import { Card, CardContent } from '@/components/ui/Card';
import Link from 'next/link';

export default function FacilityPage() {
  return (
    <ContentArea>
      <VStack size="sm">
        {/* Page Title */}
        <div className="flex items-baseline gap-3">
          <h1 className="text-3xl font-bold text-slate-800">Facility Management</h1>
          <p className="text-sm text-slate-500">Comprehensive facility operations and maintenance</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-blue-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Active Work Orders</p>
                  <p className="text-2xl font-bold text-slate-800">18</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-blue-600 text-xl">🔧</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-green-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Total Equipment</p>
                  <p className="text-2xl font-bold text-slate-800">142</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-green-600 text-xl">⚙️</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-orange-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Scheduled Maintenance</p>
                  <p className="text-2xl font-bold text-slate-800">7</p>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-orange-600 text-xl">🔨</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-purple-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Compliance Items</p>
                  <p className="text-2xl font-bold text-slate-800">3</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-purple-600 text-xl">✓</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Module Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          <Link href="/facility/work-orders">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-300">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-blue-600 text-2xl">🔧</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Work Orders</h3>
                    <p className="text-sm text-slate-600 mb-3">
                      Create and track maintenance work orders, repairs, and facility requests
                    </p>
                    <div className="flex gap-4 text-xs text-slate-500">
                      <span>• 18 Active</span>
                      <span>• 5 Pending</span>
                      <span>• 13 In Progress</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/facility/equipment">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-green-300">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-green-600 text-2xl">⚙️</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Equipment</h3>
                    <p className="text-sm text-slate-600 mb-3">
                      Manage medical and facility equipment inventory, tracking, and calibration
                    </p>
                    <div className="flex gap-4 text-xs text-slate-500">
                      <span>• 142 Total</span>
                      <span>• 138 Operational</span>
                      <span>• 4 Under Repair</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/facility/maintenance">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-orange-300">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-orange-600 text-2xl">🔨</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Maintenance</h3>
                    <p className="text-sm text-slate-600 mb-3">
                      Schedule preventive maintenance, inspections, and routine service tasks
                    </p>
                    <div className="flex gap-4 text-xs text-slate-500">
                      <span>• 7 Scheduled</span>
                      <span>• 2 This Week</span>
                      <span>• 5 This Month</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/facility/compliance">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-purple-300">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-purple-600 text-2xl">✓</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Compliance</h3>
                    <p className="text-sm text-slate-600 mb-3">
                      Track safety inspections, certifications, and regulatory compliance
                    </p>
                    <div className="flex gap-4 text-xs text-slate-500">
                      <span>• 3 Due Soon</span>
                      <span>• 24 Completed</span>
                      <span>• 100% Compliant</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </VStack>
    </ContentArea>
  );
}
