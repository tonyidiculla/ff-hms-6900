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

export default function InventoryPage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  // Sample data
  const inventoryItems = [
    {
      id: 1,
      itemCode: 'INV-001',
      itemName: 'Surgical Gloves (Box of 100)',
      category: 'Medical Supplies',
      currentStock: 250,
      reorderLevel: 100,
      unitPrice: 25.00,
      supplier: 'MedEquip Supplies Ltd',
      lastRestocked: '2024-01-10',
      status: 'In Stock'
    },
    {
      id: 2,
      itemCode: 'INV-002',
      itemName: 'Syringes 5ml (Pack of 50)',
      category: 'Medical Supplies',
      currentStock: 80,
      reorderLevel: 100,
      unitPrice: 15.50,
      supplier: 'MedEquip Supplies Ltd',
      lastRestocked: '2024-01-08',
      status: 'Low Stock'
    },
    {
      id: 3,
      itemCode: 'INV-003',
      itemName: 'Bandages Sterile (Box of 50)',
      category: 'Medical Supplies',
      currentStock: 150,
      reorderLevel: 75,
      unitPrice: 12.00,
      supplier: 'Surgical Instruments Co',
      lastRestocked: '2024-01-15',
      status: 'In Stock'
    },
    {
      id: 4,
      itemCode: 'INV-004',
      itemName: 'Antibacterial Wipes (Pack of 100)',
      category: 'Cleaning Supplies',
      currentStock: 25,
      reorderLevel: 50,
      unitPrice: 8.50,
      supplier: 'Lab Supplies Global',
      lastRestocked: '2023-12-20',
      status: 'Critical'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Inventory item submitted');
    setIsModalOpen(false);
  };

  return (
    <ContentArea>
      <VStack size="sm">
        {/* Page Title */}
        <div className="flex items-baseline gap-3">
          <h1 className="text-3xl font-bold text-slate-800">Inventory Management</h1>
          <p className="text-sm text-slate-500">Track inventory levels and stock management</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-blue-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Total Items</p>
                  <p className="text-2xl font-bold text-slate-800">{inventoryItems.length}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-blue-600 text-xl">📦</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-green-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">In Stock</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {inventoryItems.filter(i => i.status === 'In Stock').length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-green-600 text-xl">✓</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-yellow-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Low Stock</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {inventoryItems.filter(i => i.status === 'Low Stock').length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-yellow-600 text-xl">⚠️</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-red-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Critical</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {inventoryItems.filter(i => i.status === 'Critical').length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-red-600 text-xl">🚨</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <Card className="border-2">
          <CardContent className="py-3 px-4">
            <Input
              placeholder="Search inventory items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </CardContent>
        </Card>

        {/* Inventory Table */}
        <Card className="border-2">
          <CardHeader className="border-b-2 pb-4">
            <div className="flex justify-between items-center">
              <CardTitle>Inventory Items ({inventoryItems.length})</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Export</Button>
                <Button size="sm" onClick={() => setIsModalOpen(true)}>+ New Item</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs uppercase tracking-wide">Item Code</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Item Name</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Category</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide text-right">Current Stock</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide text-right">Reorder Level</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide text-right">Unit Price</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Supplier</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Last Restocked</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Status</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventoryItems.map((item) => (
                  <TableRow key={item.id} className="hover:bg-slate-50 border-b last:border-b-0">
                    <TableCell className="font-mono text-sm font-medium">{item.itemCode}</TableCell>
                    <TableCell className="font-medium">{item.itemName}</TableCell>
                    <TableCell>
                      <Badge className="inline-flex px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                        {item.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-bold">{item.currentStock}</TableCell>
                    <TableCell className="text-right">{item.reorderLevel}</TableCell>
                    <TableCell className="text-right">${item.unitPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-sm">{item.supplier}</TableCell>
                    <TableCell>{item.lastRestocked}</TableCell>
                    <TableCell>
                      <Badge className={`inline-flex px-2 py-1 rounded-full text-xs ${
                        item.status === 'In Stock' ? 'bg-green-100 text-green-800' :
                        item.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <button className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1">View</button>
                      <button className="text-orange-600 hover:text-orange-800 text-sm px-2 py-1">Edit</button>
                      {(item.status === 'Low Stock' || item.status === 'Critical') && (
                        <button className="text-green-600 hover:text-green-800 text-sm px-2 py-1">Reorder</button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Create Inventory Item Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Inventory Item" size="lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="itemCode" label="Item Code" placeholder="INV-001" required />
              <Input name="itemName" label="Item Name" placeholder="Surgical Gloves" required />
              <Select
                name="category"
                label="Category"
                options={[
                  { value: 'medical', label: 'Medical Supplies' },
                  { value: 'cleaning', label: 'Cleaning Supplies' },
                  { value: 'lab', label: 'Laboratory' },
                  { value: 'equipment', label: 'Equipment' },
                ]}
                required
              />
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
              <Input name="currentStock" label="Current Stock" type="number" required />
              <Input name="reorderLevel" label="Reorder Level" type="number" required />
              <Input name="unitPrice" label="Unit Price" type="number" step="0.01" required />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Item</Button>
            </div>
          </form>
        </Modal>
      </VStack>
    </ContentArea>
  );
}
