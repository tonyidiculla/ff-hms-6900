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

export default function VendorsPage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');

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

  const filteredVendors = vendors.filter((vendor) =>
    searchTerm === '' ||
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log('Creating vendor:', Object.fromEntries(formData));
    setIsModalOpen(false);
    e.currentTarget.reset();
  };

  return (
    <ContentArea maxWidth="full">
      <VStack size="sm">
        <div className="flex items-baseline gap-3 shrink-0">
          <h1 className="text-3xl font-bold text-foreground">Vendors</h1>
          <p className="text-muted-foreground text-sm">Manage vendor accounts and relationships</p>
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
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-green-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {vendors.filter(v => v.status === 'active').length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Active</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-xl">
                  ✓
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
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-orange-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-orange-600">
                    ${Math.round(vendors.reduce((sum, v) => sum + v.balance, 0) / vendors.length).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Avg Balance</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-xl">
                  📊
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
                placeholder="Search vendors by name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </CardContent>
          </Card>
          <Button variant="outline" size="sm">Export</Button>
          <Button onClick={() => setIsModalOpen(true)} size="sm">+ New Vendor</Button>
        </div>

        {/* Vendors Table */}
        <Card className="border-2">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs uppercase tracking-wide">Vendor Code</TableHead>
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
                {filteredVendors.map((vendor) => (
                  <TableRow key={vendor.id} className="hover:bg-slate-50 border-b last:border-b-0">
                    <TableCell className="font-mono text-sm font-medium">{vendor.code}</TableCell>
                    <TableCell className="text-sm font-medium">{vendor.name}</TableCell>
                    <TableCell className="text-sm">{vendor.contact}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{vendor.email}</TableCell>
                    <TableCell className="text-sm">{vendor.phone}</TableCell>
                    <TableCell className="text-sm">{vendor.paymentTerms}</TableCell>
                    <TableCell className="text-right text-sm font-semibold text-red-600">
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
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Create Vendor Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Vendor" size="lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="code" label="Vendor Code" placeholder="V001" required />
              <Input name="name" label="Vendor Name" placeholder="Company Name" required />
              <Input name="contact" label="Contact Person" placeholder="John Doe" required />
              <Input name="email" type="email" label="Email" placeholder="vendor@example.com" required />
              <Input name="phone" label="Phone" placeholder="555-0123" required />
              <Input name="website" label="Website" placeholder="www.example.com" />
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
              <Select
                name="currency"
                label="Currency"
                options={[
                  { value: 'USD', label: 'USD' },
                  { value: 'EUR', label: 'EUR' },
                  { value: 'GBP', label: 'GBP' },
                ]}
                required
              />
            </div>
            <Input name="address" label="Address" placeholder="Street address" />
            <div className="grid grid-cols-3 gap-4">
              <Input name="city" label="City" placeholder="City" />
              <Input name="state" label="State/Province" placeholder="State" />
              <Input name="zip" label="ZIP/Postal" placeholder="ZIP" />
            </div>
            <Input name="taxId" label="Tax ID" placeholder="Tax identification number" />
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsModalOpen(false)} type="button">
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
