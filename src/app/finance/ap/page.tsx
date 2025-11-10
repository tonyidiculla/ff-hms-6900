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

type TabType = 'vendors' | 'invoices' | 'payments' | 'credit-notes';

export default function AccountsPayablePage() {
  const [activeTab, setActiveTab] = React.useState<TabType>('vendors');
  const [isVendorModalOpen, setIsVendorModalOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');

  // Sample data
  const vendors = [
    {
      id: 1,
      code: 'V001',
      name: 'Medical Supplies Inc',
      contact: 'John Smith',
      email: 'john@medsupplies.com',
      phone: '555-0123',
      balance: 15000,
      status: 'active',
      paymentTerms: 'Net 30',
    },
    {
      id: 2,
      code: 'V002',
      name: 'Lab Equipment Corp',
      contact: 'Sarah Johnson',
      email: 'sarah@labequip.com',
      phone: '555-0456',
      balance: 8500,
      status: 'active',
      paymentTerms: 'Net 45',
    },
    {
      id: 3,
      code: 'V003',
      name: 'Pharmaceutical Distributors',
      contact: 'Mike Davis',
      email: 'mike@pharmdist.com',
      phone: '555-0789',
      balance: 22000,
      status: 'active',
      paymentTerms: 'Net 30',
    },
  ];

  const invoices = [
    {
      id: 1,
      number: 'PI-001',
      vendor: 'Medical Supplies Inc',
      date: '2024-01-15',
      dueDate: '2024-02-14',
      amount: 5000,
      paidAmount: 5000,
      status: 'paid',
      poNumber: 'PO-1234',
    },
    {
      id: 2,
      number: 'PI-002',
      vendor: 'Lab Equipment Corp',
      date: '2024-01-18',
      dueDate: '2024-03-02',
      amount: 8500,
      paidAmount: 0,
      status: 'pending',
      poNumber: 'PO-1235',
    },
    {
      id: 3,
      number: 'PI-003',
      vendor: 'Pharmaceutical Distributors',
      date: '2024-01-20',
      dueDate: '2024-02-19',
      amount: 12000,
      paidAmount: 6000,
      status: 'partial',
      poNumber: 'PO-1236',
    },
  ];

  const payments = [
    {
      id: 1,
      number: 'PMT-001',
      vendor: 'Medical Supplies Inc',
      invoice: 'PI-001',
      date: '2024-01-30',
      amount: 5000,
      paymentMethod: 'Bank Transfer',
      reference: 'TXN-98765',
    },
    {
      id: 2,
      number: 'PMT-002',
      vendor: 'Pharmaceutical Distributors',
      invoice: 'PI-003',
      date: '2024-02-01',
      amount: 6000,
      paymentMethod: 'Check',
      reference: 'CHK-4321',
    },
  ];

  const creditNotes = [
    {
      id: 1,
      number: 'CN-001',
      vendor: 'Medical Supplies Inc',
      invoice: 'PI-005',
      date: '2024-01-26',
      reason: 'Damaged goods returned',
      amount: 1200,
      status: 'approved',
    },
    {
      id: 2,
      number: 'CN-002',
      vendor: 'Lab Equipment Corp',
      invoice: 'PI-002',
      date: '2024-01-29',
      reason: 'Price adjustment - volume discount',
      amount: 850,
      status: 'pending',
    },
  ];

  const handleVendorSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log('Creating vendor:', Object.fromEntries(formData));
    setIsVendorModalOpen(false);
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

  return (
    <ContentArea>
      <VStack size="sm">
        <div className="flex items-baseline gap-3 shrink-0">
          <h1 className="text-3xl font-bold text-foreground">Accounts Payable</h1>
          <p className="text-muted-foreground text-sm">Vendor management and bill payment processing</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-blue-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-foreground">{vendors.length}</div>
                  <p className="text-xs text-muted-foreground mt-2">Total Vendors</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xl">
                  👥
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-red-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    ${vendors.reduce((sum, v) => sum + v.balance, 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Total Payables</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-xl">
                  💳
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-green-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    ${payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Paid This Month</p>
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
              onClick={() => setActiveTab('vendors')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'vendors'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Vendors
            </button>
            <button
              onClick={() => setActiveTab('invoices')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'invoices'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Purchase Invoices
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'payments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Payments
            </button>
            <button
              onClick={() => setActiveTab('credit-notes')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'credit-notes'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Credit Notes
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'vendors' && (
          <>
            <Card className="border-2">
              <CardContent className="py-3 px-4">
                <Input
                  type="text"
                  placeholder="Search vendors by name or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardHeader className="border-b-2 pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle>Vendors ({vendors.length})</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Export</Button>
                    <Button onClick={() => setIsVendorModalOpen(true)} size="sm">+ New Vendor</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs uppercase tracking-wide">Code</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Vendor Name</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Contact</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Email</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Phone</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Payment Terms</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide text-right">Balance</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Status</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vendors.map((vendor) => (
                      <TableRow key={vendor.id} className="hover:bg-slate-50 border-b last:border-b-0">
                        <TableCell className="font-mono text-sm font-medium">{vendor.code}</TableCell>
                        <TableCell className="text-sm font-medium">{vendor.name}</TableCell>
                        <TableCell className="text-sm">{vendor.contact}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{vendor.email}</TableCell>
                        <TableCell className="text-sm">{vendor.phone}</TableCell>
                        <TableCell className="text-sm">{vendor.paymentTerms}</TableCell>
                        <TableCell className="text-right text-sm font-medium text-red-600">
                          ${vendor.balance.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {vendor.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <button className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1">View</button>
                            <button className="text-slate-600 hover:text-slate-800 text-sm px-2 py-1">Edit</button>
                            <button className="text-red-600 hover:text-red-800 text-sm px-2 py-1">Delete</button>
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
                  placeholder="Search invoices by number, vendor, or PO..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardHeader className="border-b-2 pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle>Purchase Invoices ({invoices.length})</CardTitle>
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
                      <TableHead className="text-xs uppercase tracking-wide">Invoice #</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Vendor</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">PO Number</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Date</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Due Date</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide text-right">Amount</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide text-right">Paid</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide text-right">Balance</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Status</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id} className="hover:bg-slate-50 border-b last:border-b-0">
                        <TableCell className="font-mono text-sm font-medium">{invoice.number}</TableCell>
                        <TableCell className="text-sm">{invoice.vendor}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{invoice.poNumber}</TableCell>
                        <TableCell className="text-sm">{invoice.date}</TableCell>
                        <TableCell className="text-sm">{invoice.dueDate}</TableCell>
                        <TableCell className="text-right text-sm font-semibold">${invoice.amount.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-sm text-green-600">${invoice.paidAmount.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-sm font-bold text-red-600">
                          ${(invoice.amount - invoice.paidAmount).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                            {invoice.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <button className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1">View</button>
                            <button className="text-green-600 hover:text-green-800 text-sm px-2 py-1">Pay</button>
                            <button className="text-slate-600 hover:text-slate-800 text-sm px-2 py-1">Edit</button>
                            <button className="text-red-600 hover:text-red-800 text-sm px-2 py-1">Delete</button>
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

        {activeTab === 'payments' && (
          <>
            <Card className="border-2">
              <CardContent className="py-3 px-4">
                <Input
                  type="text"
                  placeholder="Search payments by number, vendor, or invoice..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardHeader className="border-b-2 pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle>Payments ({payments.length})</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Export</Button>
                    <Button size="sm">+ New Payment</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs uppercase tracking-wide">Payment #</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Vendor</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Invoice</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Date</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Payment Method</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Reference</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide text-right">Amount</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id} className="hover:bg-slate-50 border-b last:border-b-0">
                        <TableCell className="font-mono text-sm font-medium">{payment.number}</TableCell>
                        <TableCell className="text-sm">{payment.vendor}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{payment.invoice}</TableCell>
                        <TableCell className="text-sm">{payment.date}</TableCell>
                        <TableCell className="text-sm">{payment.paymentMethod}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{payment.reference}</TableCell>
                        <TableCell className="text-right text-sm font-medium text-green-600">
                          ${payment.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <button className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1">View</button>
                            <button className="text-slate-600 hover:text-slate-800 text-sm px-2 py-1">Edit</button>
                            <button className="text-red-600 hover:text-red-800 text-sm px-2 py-1">Void</button>
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

        {activeTab === 'credit-notes' && (
          <>
            <Card className="border-2">
              <CardContent className="py-3 px-4">
                <Input
                  type="text"
                  placeholder="Search credit notes by number, vendor, or invoice..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardHeader className="border-b-2 pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle>Credit Notes ({creditNotes.length})</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Export</Button>
                    <Button size="sm">+ New Credit Note</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs uppercase tracking-wide">Credit Note #</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Vendor</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Invoice</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Date</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Reason</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide text-right">Amount</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Status</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {creditNotes.map((note) => (
                      <TableRow key={note.id} className="hover:bg-slate-50 border-b last:border-b-0">
                        <TableCell className="font-mono text-sm font-medium">{note.number}</TableCell>
                        <TableCell className="text-sm">{note.vendor}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{note.invoice}</TableCell>
                        <TableCell className="text-sm">{note.date}</TableCell>
                        <TableCell className="text-sm">{note.reason}</TableCell>
                        <TableCell className="text-right text-sm font-medium text-green-600">
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

        {/* Create Vendor Modal */}
        <Modal isOpen={isVendorModalOpen} onClose={() => setIsVendorModalOpen(false)} title="Create Vendor" size="lg">
          <form onSubmit={handleVendorSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="code" label="Vendor Code" placeholder="V001" required />
              <Input name="name" label="Vendor Name" placeholder="Company Name" required />
              <Input name="contact" label="Contact Person" placeholder="John Doe" required />
              <Input name="email" type="email" label="Email" placeholder="vendor@example.com" required />
              <Input name="phone" label="Phone" placeholder="555-0123" required />
              <Select
                name="paymentTerms"
                label="Payment Terms"
                options={[
                  { value: 'Net 15', label: 'Net 15 days' },
                  { value: 'Net 30', label: 'Net 30 days' },
                  { value: 'Net 45', label: 'Net 45 days' },
                  { value: 'Net 60', label: 'Net 60 days' },
                ]}
                required
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsVendorModalOpen(false)} type="button">
                Cancel
              </Button>
              <Button type="submit">Create Vendor</Button>
            </div>
          </form>
        </Modal>
      </VStack>
    </ContentArea>
  );
}
