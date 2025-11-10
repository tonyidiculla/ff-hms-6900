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

export default function PurchaseInvoicesPage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [lines, setLines] = React.useState([
    { id: 1, description: '', quantity: '', unitPrice: '', amount: 0 },
  ]);

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

  const vendors = [
    { value: '1', label: 'Medical Supplies Inc' },
    { value: '2', label: 'Lab Equipment Corp' },
    { value: '3', label: 'Pharmaceutical Distributors' },
  ];

  const filteredInvoices = invoices.filter((invoice) =>
    searchTerm === '' ||
    invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.poNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addLine = () => {
    setLines([...lines, { id: Date.now(), description: '', quantity: '', unitPrice: '', amount: 0 }]);
  };

  const removeLine = (id: number) => {
    if (lines.length > 1) {
      setLines(lines.filter((line) => line.id !== id));
    }
  };

  const updateLine = (id: number, field: string, value: string) => {
    setLines(lines.map((line) => {
      if (line.id === id) {
        const updated = { ...line, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          const qty = parseFloat(updated.quantity) || 0;
          const price = parseFloat(updated.unitPrice) || 0;
          updated.amount = qty * price;
        }
        return updated;
      }
      return line;
    }));
  };

  const totalAmount = lines.reduce((sum, line) => sum + line.amount, 0);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log('Creating purchase invoice:', Object.fromEntries(formData), lines);
    setIsModalOpen(false);
    e.currentTarget.reset();
    setLines([{ id: 1, description: '', quantity: '', unitPrice: '', amount: 0 }]);
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
    <ContentArea maxWidth="full">
      <VStack size="sm">
        <div className="flex items-baseline gap-3 shrink-0">
          <h1 className="text-3xl font-bold text-foreground">Purchase Invoices</h1>
          <p className="text-muted-foreground text-sm">Manage vendor bills and purchase invoices</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-blue-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-foreground">{invoices.length}</div>
                  <p className="text-xs text-muted-foreground mt-2">Total Invoices</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xl">
                  📄
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-yellow-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {invoices.filter(i => i.status === 'pending').length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Pending</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-xl">
                  ⏳
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-red-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    ${invoices.filter(i => i.status !== 'paid').reduce((sum, i) => sum + (i.amount - i.paidAmount), 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Outstanding</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-xl">
                  💸
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
                  <p className="text-xs text-muted-foreground mt-2">Total Paid</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-xl">
                  ✓
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Actions */}
        <div className="flex items-center gap-3">
          <Card className="border-2 flex-1">
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
          <Button variant="outline" size="sm">Export</Button>
          <Button onClick={() => setIsModalOpen(true)} size="sm">+ New Invoice</Button>
        </div>

        {/* Invoices Table */}
        <Card className="border-2">
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
                {filteredInvoices.map((invoice) => (
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

        {/* Create Invoice Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Purchase Invoice" size="xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select name="vendor" label="Vendor" options={vendors} required />
              <Input name="invoiceNumber" label="Invoice Number" placeholder="INV-001" required />
              <Input name="poNumber" label="PO Number" placeholder="PO-1234" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="date" type="date" label="Invoice Date" required />
              <Input name="dueDate" type="date" label="Due Date" required />
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">Invoice Lines</h3>
                <Button type="button" variant="outline" size="sm" onClick={addLine}>
                  + Add Line
                </Button>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-[100px] text-right">Quantity</TableHead>
                      <TableHead className="w-[120px] text-right">Unit Price</TableHead>
                      <TableHead className="w-[120px] text-right">Amount</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lines.map((line) => (
                      <TableRow key={line.id}>
                        <TableCell>
                          <Input
                            value={line.description}
                            onChange={(e) => updateLine(line.id, 'description', e.target.value)}
                            placeholder="Item description"
                            required
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            value={line.quantity}
                            onChange={(e) => updateLine(line.id, 'quantity', e.target.value)}
                            placeholder="0"
                            className="text-right"
                            required
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            value={line.unitPrice}
                            onChange={(e) => updateLine(line.id, 'unitPrice', e.target.value)}
                            placeholder="0.00"
                            className="text-right"
                            required
                          />
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ${line.amount.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          {lines.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeLine(line.id)}
                            >
                              ×
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/50">
                      <TableCell colSpan={3} className="font-semibold text-right">Total:</TableCell>
                      <TableCell className="text-right font-bold text-lg">
                        ${totalAmount.toFixed(2)}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>

            <Input name="notes" label="Notes" placeholder="Additional notes or comments" />

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsModalOpen(false)} type="button">
                Cancel
              </Button>
              <Button type="submit">Create Invoice</Button>
            </div>
          </form>
        </Modal>
      </VStack>
    </ContentArea>
  );
}
