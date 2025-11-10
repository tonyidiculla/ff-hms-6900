'use client';

import React from 'react';
import { ContentArea, VStack } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';

export default function AgingReportPage() {
  const agingSummary = [
    {
      id: 1,
      customer: 'City General Hospital',
      current: 5000,
      days30: 8000,
      days60: 7000,
      days90: 5000,
      over90: 0,
      total: 25000,
    },
    {
      id: 2,
      customer: 'Regional Medical Center',
      current: 12500,
      days30: 4000,
      days60: 2000,
      days90: 0,
      over90: 0,
      total: 18500,
    },
    {
      id: 3,
      customer: 'Community Clinic Network',
      current: 8000,
      days30: 2000,
      days60: 1500,
      days90: 500,
      over90: 0,
      total: 12000,
    },
  ];

  const totals = agingSummary.reduce(
    (acc, row) => ({
      current: acc.current + row.current,
      days30: acc.days30 + row.days30,
      days60: acc.days60 + row.days60,
      days90: acc.days90 + row.days90,
      over90: acc.over90 + row.over90,
      total: acc.total + row.total,
    }),
    { current: 0, days30: 0, days60: 0, days90: 0, over90: 0, total: 0 }
  );

  const getAgingLevel = (customer: typeof agingSummary[0]) => {
    if (customer.over90 > 0) return { level: 'Critical', color: 'bg-red-100 text-red-800' };
    if (customer.days90 > 0) return { level: 'High Risk', color: 'bg-orange-100 text-orange-800' };
    if (customer.days60 > 0) return { level: 'Moderate', color: 'bg-yellow-100 text-yellow-800' };
    return { level: 'Good', color: 'bg-green-100 text-green-800' };
  };

  return (
    <ContentArea>
      <VStack size="sm">
        <div className="flex items-baseline gap-3 shrink-0">
          <h1 className="text-3xl font-bold text-foreground">Accounts Receivable Aging</h1>
          <p className="text-muted-foreground text-sm">Analyze outstanding receivables by age</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-green-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">${(totals.current / 1000).toFixed(0)}K</div>
                  <p className="text-xs text-muted-foreground mt-2">Current</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-xl">
                  ✓
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-blue-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-600">${(totals.days30 / 1000).toFixed(0)}K</div>
                  <p className="text-xs text-muted-foreground mt-2">1-30 Days</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xl">
                  📅
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-yellow-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-yellow-600">${(totals.days60 / 1000).toFixed(0)}K</div>
                  <p className="text-xs text-muted-foreground mt-2">31-60 Days</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-xl">
                  ⚠️
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-orange-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-orange-600">${(totals.days90 / 1000).toFixed(0)}K</div>
                  <p className="text-xs text-muted-foreground mt-2">61-90 Days</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-xl">
                  ⏰
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-red-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-red-600">${(totals.over90 / 1000).toFixed(0)}K</div>
                  <p className="text-xs text-muted-foreground mt-2">Over 90 Days</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-xl">
                  🚨
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-purple-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-purple-600">${(totals.total / 1000).toFixed(0)}K</div>
                  <p className="text-xs text-muted-foreground mt-2">Total</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-xl">
                  💰
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Aging Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Aging Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Current</span>
                  <span className="font-medium">{((totals.current / totals.total) * 100).toFixed(1)}%</span>
                </div>
                <div className="h-8 bg-muted rounded-lg overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{ width: `${(totals.current / totals.total) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>1-30 Days</span>
                  <span className="font-medium">{((totals.days30 / totals.total) * 100).toFixed(1)}%</span>
                </div>
                <div className="h-8 bg-muted rounded-lg overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${(totals.days30 / totals.total) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>31-60 Days</span>
                  <span className="font-medium">{((totals.days60 / totals.total) * 100).toFixed(1)}%</span>
                </div>
                <div className="h-8 bg-muted rounded-lg overflow-hidden">
                  <div
                    className="h-full bg-yellow-500"
                    style={{ width: `${(totals.days60 / totals.total) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>61-90 Days</span>
                  <span className="font-medium">{((totals.days90 / totals.total) * 100).toFixed(1)}%</span>
                </div>
                <div className="h-8 bg-muted rounded-lg overflow-hidden">
                  <div
                    className="h-full bg-orange-500"
                    style={{ width: `${(totals.days90 / totals.total) * 100}%` }}
                  ></div>
                </div>
              </div>
              {totals.over90 > 0 && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Over 90 Days</span>
                    <span className="font-medium">{((totals.over90 / totals.total) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-8 bg-muted rounded-lg overflow-hidden">
                    <div
                      className="h-full bg-red-500"
                      style={{ width: `${(totals.over90 / totals.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Aging Detail Table */}
        <Card className="border-2">
          <CardHeader className="border-b-2 pb-4">
            <div className="flex justify-between items-center">
              <CardTitle>Customer Aging Detail</CardTitle>
              <Button variant="outline" size="sm">Export Report</Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs uppercase tracking-wide">Customer</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide text-right">Current</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide text-right">1-30 Days</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide text-right">31-60 Days</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide text-right">61-90 Days</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide text-right">Over 90</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide text-right">Total</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Risk Level</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agingSummary.map((customer) => {
                  const aging = getAgingLevel(customer);
                  return (
                    <TableRow key={customer.id} className="hover:bg-slate-50 border-b last:border-b-0">
                      <TableCell className="text-sm font-medium">{customer.customer}</TableCell>
                      <TableCell className="text-right text-sm text-green-600">${customer.current.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-sm text-blue-600">${customer.days30.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-sm text-yellow-600">${customer.days60.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-sm text-orange-600">${customer.days90.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-sm text-red-600">${customer.over90.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-sm font-bold">${customer.total.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${aging.color}`}>
                          {aging.level}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
                <TableRow className="font-bold bg-slate-50">
                  <TableCell className="text-sm">Totals</TableCell>
                  <TableCell className="text-right text-sm text-green-600">${totals.current.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-sm text-blue-600">${totals.days30.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-sm text-yellow-600">${totals.days60.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-sm text-orange-600">${totals.days90.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-sm text-red-600">${totals.over90.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-sm font-bold">${totals.total.toLocaleString()}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </VStack>
    </ContentArea>
  );
}
