'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { ContentArea, ContentCard, VStack, MetricsGrid } from '@/components/layout/PageLayout';
import { useBillingRecords } from '@/hooks/useOutpatientAPI';

export default function BillingPage() {
  const [filters, setFilters] = useState({
    hospital_id: '',
    status: '',
    limit: '50',
  });

  // Fetch billing records from ff-outp API
  const { data: bills = [], isLoading, error } = useBillingRecords(filters);

  const statusConfig = {
    paid: { variant: 'success' as const, label: 'Paid' },
    partial: { variant: 'warning' as const, label: 'Partial' },
    pending: { variant: 'danger' as const, label: 'Pending' },
  };

  if (isLoading) {
    return (
      <ContentArea maxWidth="full">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading billing records...</div>
        </div>
      </ContentArea>
    );
  }

  if (error) {
    return (
      <ContentArea maxWidth="full">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">Error loading billing records: {(error as Error).message}</div>
        </div>
      </ContentArea>
    );
  }

  return (
    <ContentArea maxWidth="full">
      <VStack size="lg">
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Billing & Invoicing</h1>
            <p className="text-gray-600 mt-2">Manage invoices and payments</p>
          </div>
          <Button>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Invoice
          </Button>
        </div>

        {/* Stats */}
        <MetricsGrid columns={4}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,450</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$3,280</div>
            <p className="text-xs text-muted-foreground">8 invoices</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Paid Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$850</div>
            <p className="text-xs text-muted-foreground">3 payments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">$450</div>
            <p className="text-xs text-muted-foreground">2 invoices</p>
          </CardContent>
        </Card>
        </MetricsGrid>

        {/* Filters */}
        <ContentCard title="Search & Filter">
          <div className="flex gap-4">
            <Input placeholder="Search invoices..." className="flex-1" />
            <Input type="date" />
            <Button variant="outline">Filter</Button>
            <Button variant="outline">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export
            </Button>
          </div>
        </ContentCard>

        {/* Bills Table */}
        <ContentCard title="All Invoices" scrollable={true}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Pet Name</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Services</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bills.map((bill: any) => (
                <TableRow key={bill.id}>
                  <TableCell className="font-medium">{bill.id}</TableCell>
                  <TableCell>{bill.date || new Date(bill.created_at).toISOString().split('T')[0]}</TableCell>
                  <TableCell>{bill.petName || bill.pet_name || 'N/A'}</TableCell>
                  <TableCell>{bill.owner || bill.owner_name || 'N/A'}</TableCell>
                  <TableCell>
                    <div className="text-xs">
                      {bill.services ? (
                        <>
                          {bill.services.slice(0, 2).join(', ')}
                          {bill.services.length > 2 && ` +${bill.services.length - 2} more`}
                        </>
                      ) : (
                        bill.service_description || 'N/A'
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">${(bill.amount || bill.total_amount || 0).toFixed(2)}</TableCell>
                  <TableCell>${(bill.paid || bill.paid_amount || 0).toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={statusConfig[bill.status as keyof typeof statusConfig]?.variant || 'default'}>
                      {statusConfig[bill.status as keyof typeof statusConfig]?.label || bill.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" title="View Invoice">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </Button>
                      <Button variant="ghost" size="sm" title="Print Invoice">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                      </Button>
                      {bill.status !== 'paid' && (
                        <Button variant="ghost" size="sm" title="Record Payment">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ContentCard>
      </VStack>
    </ContentArea>
  );
}
