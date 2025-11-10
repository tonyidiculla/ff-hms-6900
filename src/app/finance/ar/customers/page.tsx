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

export default function CustomersPage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');

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

  const filteredCustomers = customers.filter((customer) =>
    searchTerm === '' ||
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log('Creating customer:', Object.fromEntries(formData));
    setIsModalOpen(false);
    e.currentTarget.reset();
  };

  return (
    <ContentArea maxWidth="full">
      <VStack size="sm">
        <div className="flex items-baseline gap-3 shrink-0">
          <h1 className="text-3xl font-bold text-foreground">Customers</h1>
          <p className="text-muted-foreground text-sm">Manage customer accounts and relationships</p>
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
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-green-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {customers.filter(c => c.status === 'active').length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Active</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-xl">
                  ✓
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
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-orange-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-orange-600">
                    ${customers.reduce((sum, c) => sum + c.creditLimit, 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Total Credit Limit</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-xl">
                  💳
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="border-2">
          <CardContent className="py-3 px-4">
            <Input
              type="text"
              placeholder="Search customers by name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </CardContent>
        </Card>

        {/* Customers Table */}
        <Card className="border-2">
          <CardHeader className="border-b-2 pb-4">
            <div className="flex justify-between items-center">
              <CardTitle>Customer List</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Export</Button>
                <Button onClick={() => setIsModalOpen(true)} size="sm">+ New Customer</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs uppercase tracking-wide">Customer Code</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Customer Name</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Contact</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Email</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Phone</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide text-right">Credit Limit</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide text-right">Balance</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide text-right">Available</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Status</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id} className="hover:bg-slate-50 border-b last:border-b-0">
                    <TableCell className="font-mono text-sm font-medium">{customer.code}</TableCell>
                    <TableCell className="text-sm font-medium">{customer.name}</TableCell>
                    <TableCell className="text-sm">{customer.contact}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{customer.email}</TableCell>
                    <TableCell className="text-sm">{customer.phone}</TableCell>
                    <TableCell className="text-right text-sm font-semibold">
                      ${customer.creditLimit.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-sm font-semibold text-purple-600">
                      ${customer.balance.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-sm font-semibold text-green-600">
                      ${(customer.creditLimit - customer.balance).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {customer.status}
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

        {/* Create Customer Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Customer" size="lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="code" label="Customer Code" placeholder="C001" required />
              <Input name="name" label="Customer Name" placeholder="Company Name" required />
              <Input name="contact" label="Contact Person" placeholder="John Doe" required />
              <Input name="email" type="email" label="Email" placeholder="customer@example.com" required />
              <Input name="phone" label="Phone" placeholder="555-1111" required />
              <Input name="website" label="Website" placeholder="www.example.com" />
              <Input name="creditLimit" type="number" label="Credit Limit" placeholder="50000" required />
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
              <Button type="submit">Create Customer</Button>
            </div>
          </form>
        </Modal>
      </VStack>
    </ContentArea>
  );
}
