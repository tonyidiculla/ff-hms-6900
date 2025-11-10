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
import { usePharmacyInventory, useAddMedication } from '@/hooks/useHMSMicroservices';

export default function PharmacyInventoryPage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filters, setFilters] = React.useState({ hospital_id: '', category: '', status: '', limit: '100' });

  const { data: medications = [], isLoading, error } = usePharmacyInventory(filters);
  const addMedication = useAddMedication();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const medicationData = {
      name: formData.get('name'),
      category: formData.get('category'),
      stock: parseInt(formData.get('stock') as string),
      unit: formData.get('unit'),
      reorder_level: parseInt(formData.get('reorderLevel') as string),
      expiry_date: formData.get('expiryDate'),
      supplier: formData.get('supplier'),
      price: parseFloat(formData.get('price') as string),
      status: 'In Stock',
    };

    try {
      await addMedication.mutateAsync(medicationData);
      setIsModalOpen(false);
      e.currentTarget.reset();
    } catch (error) {
      console.error('Failed to add medication:', error);
      alert('Failed to add medication. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock': return 'bg-green-100 text-green-800';
      case 'Low Stock': return 'bg-yellow-100 text-yellow-800';
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'Expiring Soon': return 'bg-orange-100 text-orange-800';
      case 'Out of Stock': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <ContentArea>
        <VStack size="sm">
          <div className="flex items-baseline gap-3">
            <h1 className="text-3xl font-bold text-slate-800">Pharmacy Inventory</h1>
            <p className="text-sm text-slate-500">Medication stock and inventory management</p>
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-slate-600">Loading inventory...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </VStack>
      </ContentArea>
    );
  }

  if (error) {
    return (
      <ContentArea>
        <VStack size="sm">
          <div className="flex items-baseline gap-3">
            <h1 className="text-3xl font-bold text-slate-800">Pharmacy Inventory</h1>
            <p className="text-sm text-slate-500">Medication stock and inventory management</p>
          </div>
          <Card className="border-2 border-orange-200 bg-orange-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="text-3xl">⚠️</div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">Service Unavailable</h3>
                  <p className="text-slate-600 mb-3">
                    Unable to connect to the pharmacy service. This could be due to:
                  </p>
                  <ul className="list-disc list-inside text-sm text-slate-600 space-y-1 mb-4">
                    <li>The pharmacy microservice (ff-phar-6834) may not be running</li>
                    <li>Network connectivity issues</li>
                    <li>Service is temporarily unavailable</li>
                  </ul>
                  <p className="text-sm text-slate-500 italic">
                    Error details: {error.message || 'Failed to fetch'}
                  </p>
                  <div className="mt-4">
                    <Button onClick={() => window.location.reload()} variant="outline" size="sm">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Retry
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </VStack>
      </ContentArea>
    );
  }

  return (
    <ContentArea>
      <VStack size="sm">
        <div className="flex items-baseline gap-3">
          <h1 className="text-3xl font-bold text-slate-800">Pharmacy Inventory</h1>
          <p className="text-sm text-slate-500">Medication stock and inventory management</p>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => setIsModalOpen(true)}>+ Add Medication</Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-primary">{medications.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Total Medications</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-600">
                {medications.filter((m: any) => m.status === 'Low Stock').length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Low Stock Items</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-600">
                {medications.filter((m: any) => m.status === 'Expiring Soon').length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Expiring Soon</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-600">
                {medications.filter((m: any) => m.status === 'Critical').length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Critical Stock</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4 flex-wrap">
              <Input
                placeholder="Search medications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 min-w-[200px]"
              />
              <Select
                options={[
                  { value: '', label: 'All Categories' },
                  { value: 'antibiotics', label: 'Antibiotics' },
                  { value: 'pain-relief', label: 'Pain Relief' },
                  { value: 'steroids', label: 'Steroids' },
                  { value: 'parasiticides', label: 'Parasiticides' },
                ]}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-48"
              />
              <Select
                options={[
                  { value: '', label: 'All Status' },
                  { value: 'In Stock', label: 'In Stock' },
                  { value: 'Low Stock', label: 'Low Stock' },
                  { value: 'Critical', label: 'Critical' },
                ]}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-48"
              />
            </div>
          </CardContent>
        </Card>

        {/* Inventory Table */}
        <Card>
          <CardHeader>
            <CardTitle>Medication Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading inventory...</div>
            ) : medications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No medications found</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Medication</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Reorder Level</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {medications.map((med: any) => (
                    <TableRow key={med.id}>
                      <TableCell className="font-medium">{med.name}</TableCell>
                      <TableCell>{med.category}</TableCell>
                      <TableCell>{med.stock}</TableCell>
                      <TableCell>{med.unit}</TableCell>
                      <TableCell>{med.reorder_level || med.reorderLevel}</TableCell>
                      <TableCell>{med.expiry_date || med.expiryDate}</TableCell>
                      <TableCell>{med.supplier}</TableCell>
                      <TableCell>${med.price?.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(med.status)}>
                          {med.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">Edit</Button>
                          <Button variant="ghost" size="sm">Order</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Add Medication Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Medication" size="lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="name" label="Medication Name" placeholder="Enter medication name" required />
              <Select
                name="category"
                label="Category"
                options={[
                  { value: 'antibiotics', label: 'Antibiotics' },
                  { value: 'pain-relief', label: 'Pain Relief' },
                  { value: 'steroids', label: 'Steroids' },
                  { value: 'parasiticides', label: 'Parasiticides' },
                  { value: 'hormones', label: 'Hormones' },
                ]}
                required
              />
              <Input name="stock" label="Stock Quantity" type="number" placeholder="0" required />
              <Input name="unit" label="Unit" placeholder="e.g., Tablets, ml, mg" required />
              <Input name="reorderLevel" label="Reorder Level" type="number" placeholder="0" required />
              <Input name="expiryDate" label="Expiry Date" type="date" required />
              <Input name="supplier" label="Supplier" placeholder="Supplier name" required />
              <Input name="price" label="Price ($)" type="number" step="0.01" placeholder="0.00" required />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsModalOpen(false)} type="button">
                Cancel
              </Button>
              <Button type="submit" disabled={addMedication.isPending}>
                {addMedication.isPending ? 'Adding...' : 'Add Medication'}
              </Button>
            </div>
          </form>
        </Modal>
      </VStack>
    </ContentArea>
  );
}
