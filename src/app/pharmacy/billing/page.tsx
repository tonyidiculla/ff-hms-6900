'use client';

import React from 'react';
import { ContentArea, VStack } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Search, DollarSign, Receipt, CheckCircle, Clock } from 'lucide-react';

export default function PharmacyBillingPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');

  // Mock billing data
  const billingRecords = [
    {
      id: 'PB-001',
      patient: 'Max',
      owner: 'John Smith',
      items: [
        { name: 'Amoxicillin 250mg (30 tablets)', quantity: 1, price: 45.00 },
        { name: 'Dispensing Fee', quantity: 1, price: 10.00 }
      ],
      subtotal: 55.00,
      tax: 4.40,
      total: 59.40,
      date: '2024-11-09',
      paymentMethod: 'Credit Card',
      status: 'paid',
      prescribedBy: 'Dr. Smith'
    },
    {
      id: 'PB-002',
      patient: 'Luna',
      owner: 'Emily Davis',
      items: [
        { name: 'Prednisolone 5mg (14 tablets)', quantity: 1, price: 28.00 },
        { name: 'Dispensing Fee', quantity: 1, price: 10.00 }
      ],
      subtotal: 38.00,
      tax: 3.04,
      total: 41.04,
      date: '2024-11-09',
      paymentMethod: 'Pending',
      status: 'pending',
      prescribedBy: 'Dr. Johnson'
    },
    {
      id: 'PB-003',
      patient: 'Buddy',
      owner: 'Mike Brown',
      items: [
        { name: 'Gabapentin 100mg (60 capsules)', quantity: 1, price: 85.00 },
        { name: 'Pain Relief Gel', quantity: 1, price: 25.00 },
        { name: 'Dispensing Fee', quantity: 1, price: 10.00 }
      ],
      subtotal: 120.00,
      tax: 9.60,
      total: 129.60,
      date: '2024-11-08',
      paymentMethod: 'Cash',
      status: 'paid',
      prescribedBy: 'Dr. Williams'
    },
    {
      id: 'PB-004',
      patient: 'Whiskers',
      owner: 'Sarah Johnson',
      items: [
        { name: 'Meloxicam 0.5mg (7 tablets)', quantity: 1, price: 18.00 },
        { name: 'Dispensing Fee', quantity: 1, price: 10.00 }
      ],
      subtotal: 28.00,
      tax: 2.24,
      total: 30.24,
      date: '2024-11-09',
      paymentMethod: 'Insurance',
      status: 'processing',
      prescribedBy: 'Dr. Smith'
    },
  ];

  const filteredRecords = billingRecords.filter(record => {
    const matchesSearch = record.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalRevenue = billingRecords
    .filter(r => r.status === 'paid')
    .reduce((sum, r) => sum + r.total, 0);
  const pendingAmount = billingRecords
    .filter(r => r.status === 'pending')
    .reduce((sum, r) => sum + r.total, 0);
  const paidCount = billingRecords.filter(r => r.status === 'paid').length;
  const pendingCount = billingRecords.filter(r => r.status === 'pending').length;

  return (
    <ContentArea>
      <VStack size="sm">
        <div className="flex items-baseline gap-3">
          <h1 className="text-3xl font-bold text-slate-800">Pharmacy Billing</h1>
          <p className="text-sm text-slate-500">Manage pharmacy sales and billing records</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-green-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center gap-3">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-slate-800">${totalRevenue.toFixed(2)}</div>
                  <p className="text-xs text-slate-500 mt-1">Total Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-yellow-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div>
                  <div className="text-2xl font-bold text-slate-800">${pendingAmount.toFixed(2)}</div>
                  <p className="text-xs text-slate-500 mt-1">Pending Payments</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-blue-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center gap-3">
                <Receipt className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold text-slate-800">{billingRecords.length}</div>
                  <p className="text-xs text-slate-500 mt-1">Total Transactions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-purple-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold text-slate-800">{paidCount}/{billingRecords.length}</div>
                  <p className="text-xs text-slate-500 mt-1">Collection Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4 flex-wrap items-center justify-between">
              <div className="flex gap-4 flex-1">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Search by patient or bill ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  options={[
                    { value: 'all', label: 'All Status' },
                    { value: 'paid', label: 'Paid' },
                    { value: 'pending', label: 'Pending' },
                    { value: 'processing', label: 'Processing' },
                    { value: 'overdue', label: 'Overdue' },
                  ]}
                  className="w-48"
                />
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Receipt className="h-4 w-4 mr-2" />
                New Bill
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Billing Records */}
        <div className="space-y-4">
          {filteredRecords.map((record) => (
            <Card key={record.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {record.id} - {record.patient}
                      <Badge className={getStatusColor(record.status)}>
                        {record.status}
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-slate-500 mt-1">
                      Owner: {record.owner} • Date: {record.date} • Prescribed by {record.prescribedBy}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-800">${record.total.toFixed(2)}</p>
                    <p className="text-sm text-slate-500">{record.paymentMethod}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-center">Quantity</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {record.items.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">${(item.quantity * item.price).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="mt-4 space-y-2 border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="font-medium">${record.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Tax (8%)</span>
                    <span className="font-medium">${record.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total</span>
                    <span>${record.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex gap-2 justify-end mt-4 pt-4 border-t">
                  {record.status === 'pending' && (
                    <Button className="bg-green-600 hover:bg-green-700">Process Payment</Button>
                  )}
                  <Button variant="outline">
                    <Receipt className="h-4 w-4 mr-2" />
                    Print Receipt
                  </Button>
                  <Button variant="ghost">View Details</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRecords.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-slate-500">
              No billing records found matching your search criteria
            </CardContent>
          </Card>
        )}
      </VStack>
    </ContentArea>
  );
}
