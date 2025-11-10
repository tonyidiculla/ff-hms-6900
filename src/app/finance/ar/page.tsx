'use client';

import React from 'react';
import { ContentArea, VStack } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';

type TabType = 'customers' | 'invoices' | 'receipts' | 'debit-notes' | 'aging';

export default function AccountsReceivablePage() {
  const [activeTab, setActiveTab] = React.useState<TabType>('customers');
  const [isCustomerModalOpen, setIsCustomerModalOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');

  // Sample data
  const customers = [
    {
      id: 1,
      code: 'C001',
      name: 'City General Hospital',
      contact: 'Dr. Smith',
      email: 'admin@cityhospital.com',
      phone: '555-1111',
      balance: 25000,
      status: 'active',
      creditLimit: 50000,
    },
    {
      id: 2,
      code: 'C002',
      name: 'Regional Medical Center',
      contact: 'Jane Doe',
      email: 'billing@regionalmed.com',
      phone: '555-2222',
      balance: 18500,
      status: 'active',
      creditLimit: 75000,
    },
    {
      id: 3,
      code: 'C003',
      name: 'Community Clinic Network',
      contact: 'Bob Johnson',
      email: 'accounts@communityclinic.com',
      phone: '555-3333',
      balance: 12000,
      status: 'active',
      creditLimit: 30000,
    },
  ];

  const invoices = [
    {
      id: 1,
      number: 'SI-001',
      customer: 'City General Hospital',
      date: '2024-01-15',
      dueDate: '2024-02-14',
      amount: 15000,
      paidAmount: 10000,
      status: 'partial',
    },
    {
      id: 2,
      number: 'SI-002',
      customer: 'Regional Medical Center',
      date: '2024-01-18',
      dueDate: '2024-02-17',
      amount: 8500,
      paidAmount: 8500,
      status: 'paid',
    },
  ];

  const receipts = [
    {
      id: 1,
      number: 'RCP-001',
      customer: 'City General Hospital',
      date: '2024-01-20',
      amount: 10000,
      paymentMethod: 'Bank Transfer',
      reference: 'TXN-12345',
    },
    {
      id: 2,
      number: 'RCP-002',
      customer: 'Regional Medical Center',
      date: '2024-01-22',
      amount: 8500,
      paymentMethod: 'Check',
      reference: 'CHK-6789',
    },
  ];

  const debitNotes = [
    {
      id: 1,
      number: 'DN-001',
      customer: 'City General Hospital',
      invoice: 'SI-001',
      date: '2024-01-25',
      reason: 'Service overcharge adjustment',
      amount: 500,
      status: 'approved',
    },
    {
      id: 2,
      number: 'DN-002',
      customer: 'Regional Medical Center',
      invoice: 'SI-003',
      date: '2024-01-28',
      reason: 'Billing error correction',
      amount: 750,
      status: 'pending',
    },
  ];

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

  const handleCustomerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log('Creating customer:', Object.fromEntries(formData));
    setIsCustomerModalOpen(false);
    e.currentTarget.reset();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'partial': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAgingLevel = (customer: typeof agingSummary[0]) => {
    if (customer.over90 > 0) return { level: 'Critical', color: 'bg-red-100 text-red-800' };
    if (customer.days90 > 0) return { level: 'High Risk', color: 'bg-orange-100 text-orange-800' };
    if (customer.days60 > 0) return { level: 'Moderate', color: 'bg-yellow-100 text-yellow-800' };
    return { level: 'Good', color: 'bg-green-100 text-green-800' };
  };

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

  return (
    <ContentArea>
      <VStack size="sm">
        <div className="flex items-baseline gap-3 shrink-0">
          <h1 className="text-3xl font-bold text-foreground">Accounts Receivable</h1>
          <p className="text-muted-foreground text-sm">Customer billing and collections management</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-blue-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-foreground">{customers.length}</div>
                  <p className="text-xs text-muted-foreground mt-2">Total Customers</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xl">
                  👥
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-purple-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    ${customers.reduce((sum, c) => sum + c.balance, 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Total Receivables</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-xl">
                  💰
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-green-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    ${invoices.reduce((sum, i) => sum + i.paidAmount, 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Collected</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-xl">
                  ✓
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-orange-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-orange-600">
                    ${invoices.filter(i => i.status !== 'paid').reduce((sum, i) => sum + (i.amount - i.paidAmount), 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Outstanding</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-xl">
                  💸
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="border-b-2 border-gray-200">
          <nav className="-mb-px flex space-x-6">
            <button
              onClick={() => setActiveTab('customers')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'customers'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Customers
            </button>
            <button
              onClick={() => setActiveTab('invoices')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'invoices'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Sales Invoices
            </button>
            <button
              onClick={() => setActiveTab('receipts')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'receipts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Receipts
            </button>
            <button
              onClick={() => setActiveTab('debit-notes')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'debit-notes'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Debit Notes
            </button>
            <button
              onClick={() => setActiveTab('aging')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'aging'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Aging Report
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'customers' && (
          <>
            <Card className="border-2">
              <CardContent className="py-3 px-4">
                <Input
                  type="text"
                  placeholder="Search customers by name or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardHeader className="border-b-2 pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle>Customers ({customers.length})</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Export</Button>
                    <Button onClick={() => setIsCustomerModalOpen(true)} size="sm">+ New Customer</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Customer Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead className="text-right">Credit Limit</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">{customer.code}</TableCell>
                        <TableCell className="font-medium">{customer.name}</TableCell>
                        <TableCell className="text-sm">{customer.contact}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{customer.email}</TableCell>
                        <TableCell className="text-sm">{customer.phone}</TableCell>
                        <TableCell className="text-right">${customer.creditLimit.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-medium text-blue-600">
                          ${customer.balance.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">{customer.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">View</Button>
                            <Button variant="ghost" size="sm">Edit</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === 'invoices' && (
          <>
            <Card className="border-2">
              <CardContent className="py-3 px-4">
                <Input
                  type="text"
                  placeholder="Search invoices by number or customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardHeader className="border-b-2 pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle>Sales Invoices ({invoices.length})</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Export</Button>
                    <Button size="sm">+ New Invoice</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Paid</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.number}</TableCell>
                      <TableCell>{invoice.customer}</TableCell>
                      <TableCell>{invoice.date}</TableCell>
                      <TableCell>{invoice.dueDate}</TableCell>
                      <TableCell className="text-right">${invoice.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-green-600">${invoice.paidAmount.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-bold text-blue-600">
                        ${(invoice.amount - invoice.paidAmount).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
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
          </>
        )}

        {activeTab === 'receipts' && (
          <>
            <Card className="border-2">
              <CardContent className="py-3 px-4">
                <Input
                  type="text"
                  placeholder="Search receipts by number or customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardHeader className="border-b-2 pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle>Receipts ({receipts.length})</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Export</Button>
                    <Button size="sm">+ New Receipt</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Receipt #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {receipts.map((receipt) => (
                    <TableRow key={receipt.id}>
                      <TableCell className="font-medium">{receipt.number}</TableCell>
                      <TableCell>{receipt.customer}</TableCell>
                      <TableCell>{receipt.date}</TableCell>
                      <TableCell>{receipt.paymentMethod}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{receipt.reference}</TableCell>
                      <TableCell className="text-right font-medium text-green-600">
                        ${receipt.amount.toLocaleString()}
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
          </>
        )}

        {activeTab === 'debit-notes' && (
          <>
            <Card className="border-2">
              <CardContent className="py-3 px-4">
                <Input
                  type="text"
                  placeholder="Search debit notes by number or customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardHeader className="border-b-2 pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle>Debit Notes ({debitNotes.length})</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Export</Button>
                    <Button size="sm">+ New Debit Note</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs uppercase tracking-wide">Debit Note #</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Customer</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Invoice</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Date</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Reason</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide text-right">Amount</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Status</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {debitNotes.map((note) => (
                      <TableRow key={note.id} className="hover:bg-slate-50 border-b last:border-b-0">
                        <TableCell className="font-mono text-sm font-medium">{note.number}</TableCell>
                        <TableCell className="text-sm">{note.customer}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{note.invoice}</TableCell>
                        <TableCell className="text-sm">{note.date}</TableCell>
                        <TableCell className="text-sm">{note.reason}</TableCell>
                        <TableCell className="text-right text-sm font-medium text-blue-600">
                          ${note.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            note.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {note.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <button className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1">View</button>
                            <button className="text-slate-600 hover:text-slate-800 text-sm px-2 py-1">Edit</button>
                            {note.status === 'pending' && (
                              <button className="text-green-600 hover:text-green-800 text-sm px-2 py-1">Approve</button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === 'aging' && (
          <>
            <Card className="border-2">
              <CardContent className="py-3 px-4">
                <Input
                  type="text"
                  placeholder="Search aging data..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardHeader className="border-b-2 pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle>Accounts Receivable Aging</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Export</Button>
                  </div>
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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {agingSummary.map((row) => (
                      <TableRow key={row.id} className="hover:bg-slate-50 border-b last:border-b-0">
                        <TableCell className="text-sm font-medium">{row.customer}</TableCell>
                        <TableCell className="text-right text-sm text-green-600">${row.current.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-sm text-blue-600">${row.days30.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-sm text-yellow-600">${row.days60.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-sm text-orange-600">${row.days90.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-sm text-red-600 font-semibold">${row.over90.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-sm font-bold">${row.total.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )}

        {/* Create Customer Modal */}
        <Modal isOpen={isCustomerModalOpen} onClose={() => setIsCustomerModalOpen(false)} title="Create Customer" size="lg">
          <form onSubmit={handleCustomerSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="code" label="Customer Code" placeholder="C001" required />
              <Input name="name" label="Customer Name" placeholder="Company Name" required />
              <Input name="contact" label="Contact Person" placeholder="John Doe" required />
              <Input name="email" type="email" label="Email" placeholder="customer@example.com" required />
              <Input name="phone" label="Phone" placeholder="555-1111" required />
              <Input name="creditLimit" type="number" label="Credit Limit" placeholder="50000" required />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsCustomerModalOpen(false)} type="button">
                Cancel
              </Button>
              <Button type="submit">Create Customer</Button>
            </div>
          </form>
        </Modal>
      </VStack>
    </ContentArea>
  );
}
