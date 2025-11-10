'use client';

import React from 'react';
import { ContentArea, VStack } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';

export default function FinanceStylesShowcase() {
  // Sample data
  const sampleData = [
    { id: 1, number: 'INV-001', date: '2024-01-15', amount: 5000, status: 'paid', customer: 'Acme Corp' },
    { id: 2, number: 'INV-002', date: '2024-01-16', amount: 12000, status: 'pending', customer: 'Tech Solutions' },
    { id: 3, number: 'INV-003', date: '2024-01-17', amount: 8500, status: 'overdue', customer: 'Global Industries' },
  ];

  return (
    <ContentArea maxWidth="full">
      <VStack size="lg">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Finance Styles Showcase</h1>
          <p className="text-muted-foreground mt-1">Different table and card styling options</p>
        </div>

        {/* Style 1: Modern Elevated Cards */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Style 1: Modern Elevated Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-200 border-l-4 border-l-blue-500">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                    <div className="text-3xl font-bold text-blue-600 mt-2">$25,500</div>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">💰</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-green-600 font-medium">↑ 12.5%</span>
                  <span className="text-muted-foreground ml-2">vs last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-200 border-l-4 border-l-green-500">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Paid Invoices</p>
                    <div className="text-3xl font-bold text-green-600 mt-2">148</div>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">✓</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-green-600 font-medium">↑ 8.2%</span>
                  <span className="text-muted-foreground ml-2">vs last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-200 border-l-4 border-l-yellow-500">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending</p>
                    <div className="text-3xl font-bold text-yellow-600 mt-2">23</div>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">⏳</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-yellow-600 font-medium">→ 0%</span>
                  <span className="text-muted-foreground ml-2">vs last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-200 border-l-4 border-l-red-500">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                    <div className="text-3xl font-bold text-red-600 mt-2">$3,200</div>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">⚠️</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-red-600 font-medium">↑ 15.3%</span>
                  <span className="text-muted-foreground ml-2">vs last month</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Style 2: Gradient Cards */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Style 2: Gradient Background Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-linear-to-br from-blue-500 to-blue-700 text-white shadow-lg">
              <CardContent className="pt-6">
                <div className="text-sm font-medium opacity-90">Assets</div>
                <div className="text-4xl font-bold mt-2">$458,900</div>
                <div className="mt-4 text-sm opacity-80">Total company assets</div>
              </CardContent>
            </Card>

            <Card className="bg-linear-to-br from-green-500 to-green-700 text-white shadow-lg">
              <CardContent className="pt-6">
                <div className="text-sm font-medium opacity-90">Revenue</div>
                <div className="text-4xl font-bold mt-2">$125,430</div>
                <div className="mt-4 text-sm opacity-80">This quarter</div>
              </CardContent>
            </Card>

            <Card className="bg-linear-to-br from-purple-500 to-purple-700 text-white shadow-lg">
              <CardContent className="pt-6">
                <div className="text-sm font-medium opacity-90">Expenses</div>
                <div className="text-4xl font-bold mt-2">$78,520</div>
                <div className="mt-4 text-sm opacity-80">This quarter</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Style 3: Minimalist Cards */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Style 3: Minimalist Flat Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:bg-blue-100 transition-colors">
              <div className="text-xs uppercase tracking-wide text-blue-600 font-semibold">Revenue</div>
              <div className="text-2xl font-bold text-blue-900 mt-1">$25,500</div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 hover:bg-green-100 transition-colors">
              <div className="text-xs uppercase tracking-wide text-green-600 font-semibold">Profit</div>
              <div className="text-2xl font-bold text-green-900 mt-1">$8,340</div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 hover:bg-yellow-100 transition-colors">
              <div className="text-xs uppercase tracking-wide text-yellow-600 font-semibold">Pending</div>
              <div className="text-2xl font-bold text-yellow-900 mt-1">$4,120</div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 hover:bg-red-100 transition-colors">
              <div className="text-xs uppercase tracking-wide text-red-600 font-semibold">Overdue</div>
              <div className="text-2xl font-bold text-red-900 mt-1">$1,850</div>
            </div>
          </div>
        </div>

        {/* Table Style 1: Striped with Hover */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Table Style 1: Striped Rows with Hover</h2>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Invoice List</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader className="bg-slate-100">
                  <TableRow>
                    <TableHead className="font-bold">Invoice #</TableHead>
                    <TableHead className="font-bold">Date</TableHead>
                    <TableHead className="font-bold">Customer</TableHead>
                    <TableHead className="text-right font-bold">Amount</TableHead>
                    <TableHead className="font-bold">Status</TableHead>
                    <TableHead className="font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleData.map((item, index) => (
                    <TableRow key={item.id} className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-slate-50' : ''}`}>
                      <TableCell className="font-medium">{item.number}</TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>{item.customer}</TableCell>
                      <TableCell className="text-right font-semibold">${item.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={
                          item.status === 'paid' ? 'bg-green-100 text-green-800' :
                          item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Table Style 2: Bordered with Shadow */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Table Style 2: Bordered Cells</h2>
          <Card className="shadow-lg">
            <CardHeader className="bg-linear-to-r from-blue-600 to-blue-700 text-white">
              <CardTitle>Financial Transactions</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-blue-50 border-b-2 border-blue-200">
                      <TableHead className="font-bold border-r">Invoice #</TableHead>
                      <TableHead className="font-bold border-r">Date</TableHead>
                      <TableHead className="font-bold border-r">Customer</TableHead>
                      <TableHead className="text-right font-bold border-r">Amount</TableHead>
                      <TableHead className="font-bold border-r">Status</TableHead>
                      <TableHead className="font-bold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleData.map((item) => (
                      <TableRow key={item.id} className="hover:bg-slate-50 border-b">
                        <TableCell className="font-medium border-r">{item.number}</TableCell>
                        <TableCell className="border-r">{item.date}</TableCell>
                        <TableCell className="border-r">{item.customer}</TableCell>
                        <TableCell className="text-right font-semibold border-r">${item.amount.toLocaleString()}</TableCell>
                        <TableCell className="border-r">
                          <Badge className={
                            item.status === 'paid' ? 'bg-green-100 text-green-800' :
                            item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }>
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="text-blue-600">View</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table Style 3: Compact Minimal */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Table Style 3: Compact & Minimal</h2>
          <Card className="border-2">
            <CardHeader className="border-b-2 pb-4">
              <div className="flex justify-between items-center">
                <CardTitle>Recent Transactions</CardTitle>
                <Button size="sm">Export</Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-b">
                    <TableHead className="text-xs uppercase tracking-wide">Invoice</TableHead>
                    <TableHead className="text-xs uppercase tracking-wide">Date</TableHead>
                    <TableHead className="text-xs uppercase tracking-wide">Customer</TableHead>
                    <TableHead className="text-xs uppercase tracking-wide text-right">Amount</TableHead>
                    <TableHead className="text-xs uppercase tracking-wide">Status</TableHead>
                    <TableHead className="text-xs uppercase tracking-wide">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleData.map((item) => (
                    <TableRow key={item.id} className="hover:bg-slate-50 border-b last:border-b-0">
                      <TableCell className="font-mono text-sm font-medium">{item.number}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{item.date}</TableCell>
                      <TableCell className="text-sm">{item.customer}</TableCell>
                      <TableCell className="text-right text-sm font-semibold">${item.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === 'paid' ? 'bg-green-100 text-green-800' :
                          item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {item.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <button className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1">View</button>
                          <button className="text-slate-600 hover:text-slate-800 text-sm px-2 py-1">Edit</button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Table Style 4: Dark Header with Actions */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Table Style 4: Dark Header with Prominent Actions</h2>
          <Card className="overflow-hidden shadow-xl">
            <div className="bg-slate-800 text-white p-6">
              <h3 className="text-xl font-bold">Payment Records</h3>
              <p className="text-slate-300 text-sm mt-1">Track and manage all payment transactions</p>
            </div>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-700 text-white hover:bg-slate-700">
                    <TableHead className="text-white font-semibold">Invoice #</TableHead>
                    <TableHead className="text-white font-semibold">Date</TableHead>
                    <TableHead className="text-white font-semibold">Customer</TableHead>
                    <TableHead className="text-white font-semibold text-right">Amount</TableHead>
                    <TableHead className="text-white font-semibold">Status</TableHead>
                    <TableHead className="text-white font-semibold text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleData.map((item) => (
                    <TableRow key={item.id} className="hover:bg-slate-50">
                      <TableCell className="font-mono font-bold text-blue-600">{item.number}</TableCell>
                      <TableCell className="text-muted-foreground">{item.date}</TableCell>
                      <TableCell className="font-medium">{item.customer}</TableCell>
                      <TableCell className="text-right font-bold text-lg">${item.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={`text-xs font-semibold ${
                          item.status === 'paid' ? 'bg-green-500 text-white' :
                          item.status === 'pending' ? 'bg-yellow-500 text-white' :
                          'bg-red-500 text-white'
                        }`}>
                          {item.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">View</Button>
                          <Button size="sm" variant="outline">Edit</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Table Style 5: Card-Based Layout */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Table Style 5: Card-Based Row Layout</h2>
          <div className="space-y-3">
            {sampleData.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-sm">{item.number.split('-')[1]}</span>
                      </div>
                      <div>
                        <div className="font-bold text-lg">{item.customer}</div>
                        <div className="text-sm text-muted-foreground">{item.number} · {item.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-2xl font-bold">${item.amount.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Invoice Amount</div>
                      </div>
                      <Badge className={`px-4 py-2 text-sm ${
                        item.status === 'paid' ? 'bg-green-100 text-green-800' :
                        item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.status}
                      </Badge>
                      <div className="flex gap-2">
                        <Button size="sm">View</Button>
                        <Button size="sm" variant="outline">Actions</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Comparison Grid */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Style 6: Financial Summary Grid</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-2 border-blue-200">
              <CardHeader className="bg-blue-50 border-b-2 border-blue-200">
                <CardTitle className="text-blue-900">Accounts Receivable</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Current (0-30 days)</span>
                    <span className="font-bold text-lg">$18,450</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">31-60 days</span>
                    <span className="font-bold text-lg text-yellow-600">$5,200</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">61-90 days</span>
                    <span className="font-bold text-lg text-orange-600">$2,100</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Over 90 days</span>
                    <span className="font-bold text-lg text-red-600">$1,850</span>
                  </div>
                  <div className="border-t-2 pt-4 flex justify-between items-center">
                    <span className="font-bold text-lg">Total Outstanding</span>
                    <span className="font-bold text-2xl text-blue-600">$27,600</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200">
              <CardHeader className="bg-green-50 border-b-2 border-green-200">
                <CardTitle className="text-green-900">Cash Flow</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Operating Activities</span>
                    <span className="font-bold text-lg text-green-600">+$45,230</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Investing Activities</span>
                    <span className="font-bold text-lg text-red-600">-$12,450</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Financing Activities</span>
                    <span className="font-bold text-lg text-red-600">-$8,900</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Beginning Balance</span>
                    <span className="font-bold text-lg">$125,680</span>
                  </div>
                  <div className="border-t-2 pt-4 flex justify-between items-center">
                    <span className="font-bold text-lg">Ending Balance</span>
                    <span className="font-bold text-2xl text-green-600">$149,560</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

      </VStack>
    </ContentArea>
  );
}
