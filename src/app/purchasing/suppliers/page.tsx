'use client';

import React from 'react';
import { ContentArea, VStack } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';

export default function SuppliersPage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  // Sample data
  const suppliers = [
    {
      id: 1,
      code: 'SUP-001',
      name: 'MedEquip Supplies Ltd',
      category: 'Medical Equipment',
      contact: 'John Smith',
      email: 'john@medequip.com',
      phone: '+1-555-0101',
      status: 'Active',
      rating: 4.5,
      totalOrders: 24
    },
    {
      id: 2,
      code: 'SUP-002',
      name: 'Pharma Distributors Inc',
      category: 'Pharmaceuticals',
      contact: 'Sarah Johnson',
      email: 'sarah@pharmadist.com',
      phone: '+1-555-0102',
      status: 'Active',
      rating: 4.8,
      totalOrders: 38
    },
    {
      id: 3,
      code: 'SUP-003',
      name: 'Surgical Instruments Co',
      category: 'Surgical Equipment',
      contact: 'Mike Chen',
      email: 'mike@surgicalco.com',
      phone: '+1-555-0103',
      status: 'Active',
      rating: 4.2,
      totalOrders: 15
    },
    {
      id: 4,
      code: 'SUP-004',
      name: 'Lab Supplies Global',
      category: 'Laboratory',
      contact: 'Emily Davis',
      email: 'emily@labsupplies.com',
      phone: '+1-555-0104',
      status: 'Inactive',
      rating: 3.9,
      totalOrders: 8
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Supplier submitted');
    setIsModalOpen(false);
  };

  return (
    <ContentArea>
      <VStack size="sm">
        {/* Page Title */}
        <div className="flex items-baseline gap-3">
          <h1 className="text-3xl font-bold text-slate-800">Suppliers</h1>
          <p className="text-sm text-slate-500">Manage supplier information and relationships</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-blue-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Total Suppliers</p>
                  <p className="text-2xl font-bold text-slate-800">{suppliers.length}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-blue-600 text-xl">🏢</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-green-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Active Suppliers</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {suppliers.filter(s => s.status === 'Active').length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-green-600 text-xl">✓</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-purple-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Categories</p>
                  <p className="text-2xl font-bold text-slate-800">4</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-purple-600 text-xl">📂</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-orange-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Avg Rating</p>
                  <p className="text-2xl font-bold text-slate-800">4.4</p>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-orange-600 text-xl">⭐</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <Card className="border-2">
          <CardContent className="py-3 px-4">
            <Input
              placeholder="Search suppliers by name, code, or contact..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </CardContent>
        </Card>

        {/* Suppliers Table */}
        <Card className="border-2">
          <CardHeader className="border-b-2 pb-4">
            <div className="flex justify-between items-center">
              <CardTitle>Suppliers ({suppliers.length})</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Export</Button>
                <Button size="sm" onClick={() => setIsModalOpen(true)}>+ New Supplier</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs uppercase tracking-wide">Code</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Supplier Name</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Category</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Contact Person</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Email</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Phone</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Total Orders</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Rating</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Status</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suppliers.map((supplier) => (
                  <TableRow key={supplier.id} className="hover:bg-slate-50 border-b last:border-b-0">
                    <TableCell className="font-mono text-sm font-medium">{supplier.code}</TableCell>
                    <TableCell className="font-medium">{supplier.name}</TableCell>
                    <TableCell>
                      <Badge className="inline-flex px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        {supplier.category}
                      </Badge>
                    </TableCell>
                    <TableCell>{supplier.contact}</TableCell>
                    <TableCell className="text-sm">{supplier.email}</TableCell>
                    <TableCell className="text-sm">{supplier.phone}</TableCell>
                    <TableCell>{supplier.totalOrders}</TableCell>
                    <TableCell>
                      <span className="text-yellow-600 font-medium">★ {supplier.rating}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={`inline-flex px-2 py-1 rounded-full text-xs ${
                        supplier.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {supplier.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <button className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1">View</button>
                      <button className="text-orange-600 hover:text-orange-800 text-sm px-2 py-1">Edit</button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Create Supplier Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Supplier" size="lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="code" label="Supplier Code" placeholder="SUP-001" required />
              <Input name="name" label="Supplier Name" placeholder="MedEquip Supplies Ltd" required />
              <Select
                name="category"
                label="Category"
                options={[
                  { value: 'medical', label: 'Medical Equipment' },
                  { value: 'pharma', label: 'Pharmaceuticals' },
                  { value: 'surgical', label: 'Surgical Equipment' },
                  { value: 'lab', label: 'Laboratory' },
                ]}
                required
              />
              <Input name="contact" label="Contact Person" placeholder="John Smith" required />
              <Input name="email" label="Email" type="email" placeholder="contact@supplier.com" required />
              <Input name="phone" label="Phone" placeholder="+1-555-0101" required />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Supplier</Button>
            </div>
          </form>
        </Modal>
      </VStack>
    </ContentArea>
  );
}
