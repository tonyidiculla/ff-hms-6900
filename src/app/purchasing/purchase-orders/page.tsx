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

export default function PurchaseOrdersPage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  // Sample data
  const purchaseOrders = [
    {
      id: 1,
      poNumber: 'PO-2024-001',
      supplier: 'MedEquip Supplies Ltd',
      orderDate: '2024-01-15',
      deliveryDate: '2024-01-25',
      totalAmount: 45000,
      status: 'Approved',
      items: 12
    },
    {
      id: 2,
      poNumber: 'PO-2024-002',
      supplier: 'Pharma Distributors Inc',
      orderDate: '2024-01-16',
      deliveryDate: '2024-01-26',
      totalAmount: 28500,
      status: 'Pending',
      items: 8
    },
    {
      id: 3,
      poNumber: 'PO-2024-003',
      supplier: 'Surgical Instruments Co',
      orderDate: '2024-01-18',
      deliveryDate: '2024-01-28',
      totalAmount: 62000,
      status: 'In Transit',
      items: 15
    },
    {
      id: 4,
      poNumber: 'PO-2024-004',
      supplier: 'Lab Supplies Global',
      orderDate: '2024-01-20',
      deliveryDate: '2024-01-30',
      totalAmount: 18750,
      status: 'Delivered',
      items: 6
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Purchase order submitted');
    setIsModalOpen(false);
  };

  return (
    <ContentArea>
      <VStack size="sm">
        {/* Page Title */}
        <div className="flex items-baseline gap-3">
          <h1 className="text-3xl font-bold text-slate-800">Purchase Orders</h1>
          <p className="text-sm text-slate-500">Manage procurement and purchase orders</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-blue-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Total Orders</p>
                  <p className="text-2xl font-bold text-slate-800">{purchaseOrders.length}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-blue-600 text-xl">📋</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-yellow-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Pending Approval</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {purchaseOrders.filter(po => po.status === 'Pending').length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-yellow-600 text-xl">⏳</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-purple-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">In Transit</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {purchaseOrders.filter(po => po.status === 'In Transit').length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-purple-600 text-xl">🚚</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-green-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Delivered</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {purchaseOrders.filter(po => po.status === 'Delivered').length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-green-600 text-xl">✅</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <Card className="border-2">
          <CardContent className="py-3 px-4">
            <Input
              placeholder="Search purchase orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </CardContent>
        </Card>

        {/* Purchase Orders Table */}
        <Card className="border-2">
          <CardHeader className="border-b-2 pb-4">
            <div className="flex justify-between items-center">
              <CardTitle>Purchase Orders ({purchaseOrders.length})</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Export</Button>
                <Button size="sm" onClick={() => setIsModalOpen(true)}>+ New Purchase Order</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs uppercase tracking-wide">PO Number</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Supplier</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Order Date</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Delivery Date</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Items</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide text-right">Total Amount</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Status</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchaseOrders.map((po) => (
                  <TableRow key={po.id} className="hover:bg-slate-50 border-b last:border-b-0">
                    <TableCell className="font-mono text-sm font-medium">{po.poNumber}</TableCell>
                    <TableCell className="font-medium">{po.supplier}</TableCell>
                    <TableCell>{po.orderDate}</TableCell>
                    <TableCell>{po.deliveryDate}</TableCell>
                    <TableCell>{po.items}</TableCell>
                    <TableCell className="text-right font-bold">${po.totalAmount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={`inline-flex px-2 py-1 rounded-full text-xs ${
                        po.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        po.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        po.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {po.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <button className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1">View</button>
                      <button className="text-orange-600 hover:text-orange-800 text-sm px-2 py-1">Edit</button>
                      {po.status === 'Pending' && (
                        <button className="text-green-600 hover:text-green-800 text-sm px-2 py-1">Approve</button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Create Purchase Order Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Purchase Order" size="lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                name="supplier"
                label="Supplier"
                options={[
                  { value: 'supplier1', label: 'MedEquip Supplies Ltd' },
                  { value: 'supplier2', label: 'Pharma Distributors Inc' },
                  { value: 'supplier3', label: 'Surgical Instruments Co' },
                ]}
                required
              />
              <Input name="orderDate" label="Order Date" type="date" required />
              <Input name="deliveryDate" label="Expected Delivery Date" type="date" required />
              <Input name="totalAmount" label="Total Amount" type="number" step="0.01" required />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Purchase Order</Button>
            </div>
          </form>
        </Modal>
      </VStack>
    </ContentArea>
  );
}
