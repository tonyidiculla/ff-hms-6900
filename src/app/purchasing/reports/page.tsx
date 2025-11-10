'use client';

import React from 'react';
import { ContentArea, VStack } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function PurchasingReportsPage() {
  return (
    <ContentArea>
      <VStack size="sm">
        {/* Page Title */}
        <div className="flex items-baseline gap-3">
          <h1 className="text-3xl font-bold text-slate-800">Purchasing Reports</h1>
          <p className="text-sm text-slate-500">Analytics and insights for purchasing operations</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-blue-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Total Spend (YTD)</p>
                  <p className="text-2xl font-bold text-slate-800">$1.8M</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-blue-600 text-xl">💰</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-green-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Cost Savings</p>
                  <p className="text-2xl font-bold text-slate-800">$245K</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-green-600 text-xl">📈</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-purple-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Avg. Order Value</p>
                  <p className="text-2xl font-bold text-slate-800">$6,042</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-purple-600 text-xl">📊</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-orange-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">On-Time Delivery</p>
                  <p className="text-2xl font-bold text-slate-800">94%</p>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-orange-600 text-xl">🚚</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Spend Analysis Report */}
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader className="border-b-2 pb-4">
              <div className="flex justify-between items-center">
                <CardTitle>Spend Analysis</CardTitle>
                <span className="text-4xl">📊</span>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-slate-600 mb-4">
                Comprehensive analysis of spending patterns across departments, categories, and time periods.
              </p>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-slate-600">Top Category</span>
                  <span className="font-bold">Medical Supplies</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-slate-600">Monthly Avg</span>
                  <span className="font-bold">$145K</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-slate-600">Trend</span>
                  <span className="font-bold text-green-600">↑ 8.5%</span>
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline">Generate Report</Button>
            </CardContent>
          </Card>

          {/* Supplier Performance Report */}
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader className="border-b-2 pb-4">
              <div className="flex justify-between items-center">
                <CardTitle>Supplier Performance</CardTitle>
                <span className="text-4xl">⭐</span>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-slate-600 mb-4">
                Detailed metrics on supplier reliability, quality, delivery times, and overall performance ratings.
              </p>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-slate-600">Top Supplier</span>
                  <span className="font-bold">MedEquip Inc</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-slate-600">Avg Rating</span>
                  <span className="font-bold">4.6 ★</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-slate-600">Active Suppliers</span>
                  <span className="font-bold">48</span>
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline">Generate Report</Button>
            </CardContent>
          </Card>

          {/* Inventory Turnover Report */}
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader className="border-b-2 pb-4">
              <div className="flex justify-between items-center">
                <CardTitle>Inventory Turnover</CardTitle>
                <span className="text-4xl">📦</span>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-slate-600 mb-4">
                Analysis of inventory movement, stock levels, turnover rates, and optimization opportunities.
              </p>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-slate-600">Avg Turnover</span>
                  <span className="font-bold">12.3 days</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-slate-600">Fast Moving</span>
                  <span className="font-bold">42 items</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-slate-600">Slow Moving</span>
                  <span className="font-bold text-orange-600">8 items</span>
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline">Generate Report</Button>
            </CardContent>
          </Card>

          {/* Purchase Order Summary Report */}
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader className="border-b-2 pb-4">
              <div className="flex justify-between items-center">
                <CardTitle>Purchase Order Summary</CardTitle>
                <span className="text-4xl">📄</span>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-slate-600 mb-4">
                Overview of purchase order volumes, values, approval times, and completion rates by period.
              </p>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-slate-600">Total POs (MTD)</span>
                  <span className="font-bold">24</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-slate-600">Avg Approval Time</span>
                  <span className="font-bold">2.3 days</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-slate-600">Completion Rate</span>
                  <span className="font-bold text-green-600">96%</span>
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline">Generate Report</Button>
            </CardContent>
          </Card>

          {/* Procurement Efficiency Report */}
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader className="border-b-2 pb-4">
              <div className="flex justify-between items-center">
                <CardTitle>Procurement Efficiency</CardTitle>
                <span className="text-4xl">⚡</span>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-slate-600 mb-4">
                Metrics on procurement cycle times, request approval rates, and process efficiency indicators.
              </p>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-slate-600">Avg Cycle Time</span>
                  <span className="font-bold">5.8 days</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-slate-600">Approval Rate</span>
                  <span className="font-bold">92%</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-slate-600">Requests (MTD)</span>
                  <span className="font-bold">18</span>
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline">Generate Report</Button>
            </CardContent>
          </Card>

          {/* Cost Variance Analysis Report */}
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader className="border-b-2 pb-4">
              <div className="flex justify-between items-center">
                <CardTitle>Cost Variance Analysis</CardTitle>
                <span className="text-4xl">💸</span>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-slate-600 mb-4">
                Comparison of budgeted vs. actual costs, variance tracking, and cost-saving opportunity identification.
              </p>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-slate-600">Budget Variance</span>
                  <span className="font-bold text-green-600">-5.2%</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-slate-600">Budgeted (MTD)</span>
                  <span className="font-bold">$152K</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-slate-600">Actual (MTD)</span>
                  <span className="font-bold">$145K</span>
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline">Generate Report</Button>
            </CardContent>
          </Card>
        </div>
      </VStack>
    </ContentArea>
  );
}
