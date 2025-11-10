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

export default function FacilityEquipmentPage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  // Sample data
  const equipment = [
    {
      id: 1,
      equipmentId: 'EQ-001',
      name: 'X-Ray Machine',
      category: 'Diagnostic',
      location: 'Radiology - Floor 2',
      manufacturer: 'Siemens',
      model: 'YSIO Max',
      serialNumber: 'SN-2023-001',
      status: 'Operational',
      lastMaintenance: '2024-01-05',
      nextMaintenance: '2024-04-05'
    },
    {
      id: 2,
      equipmentId: 'EQ-002',
      name: 'Ventilator',
      category: 'Life Support',
      location: 'ICU',
      manufacturer: 'Dräger',
      model: 'Evita V800',
      serialNumber: 'SN-2023-012',
      status: 'Operational',
      lastMaintenance: '2024-01-10',
      nextMaintenance: '2024-02-10'
    },
    {
      id: 3,
      equipmentId: 'EQ-003',
      name: 'Anesthesia Machine',
      category: 'Surgery',
      location: 'Operating Theater 1',
      manufacturer: 'GE Healthcare',
      model: 'Aisys CS2',
      serialNumber: 'SN-2023-025',
      status: 'Under Repair',
      lastMaintenance: '2024-01-08',
      nextMaintenance: '2024-01-20'
    },
    {
      id: 4,
      equipmentId: 'EQ-004',
      name: 'Ultrasound Machine',
      category: 'Diagnostic',
      location: 'Diagnostic Center',
      manufacturer: 'Philips',
      model: 'EPIQ 7',
      serialNumber: 'SN-2023-040',
      status: 'Operational',
      lastMaintenance: '2023-12-15',
      nextMaintenance: '2024-03-15'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Equipment submitted');
    setIsModalOpen(false);
  };

  return (
    <ContentArea>
      <VStack size="sm">
        {/* Page Title */}
        <div className="flex items-baseline gap-3">
          <h1 className="text-3xl font-bold text-slate-800">Equipment Management</h1>
          <p className="text-sm text-slate-500">Track and manage facility equipment inventory</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-blue-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Total Equipment</p>
                  <p className="text-2xl font-bold text-slate-800">{equipment.length}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-blue-600 text-xl">⚙️</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-green-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Operational</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {equipment.filter(eq => eq.status === 'Operational').length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-green-600 text-xl">✓</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-red-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Under Repair</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {equipment.filter(eq => eq.status === 'Under Repair').length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-red-600 text-xl">🔧</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-orange-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Maintenance Due</p>
                  <p className="text-2xl font-bold text-slate-800">2</p>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-orange-600 text-xl">⏰</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <Card className="border-2">
          <CardContent className="py-3 px-4">
            <Input
              placeholder="Search equipment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </CardContent>
        </Card>

        {/* Equipment Table */}
        <Card className="border-2">
          <CardHeader className="border-b-2 pb-4">
            <div className="flex justify-between items-center">
              <CardTitle>Equipment Inventory ({equipment.length})</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Export</Button>
                <Button size="sm" onClick={() => setIsModalOpen(true)}>+ Add Equipment</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs uppercase tracking-wide">Equipment ID</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Name</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Category</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Location</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Manufacturer</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Serial Number</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Status</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Next Maintenance</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {equipment.map((item) => (
                  <TableRow key={item.id} className="hover:bg-slate-50 border-b last:border-b-0">
                    <TableCell className="font-mono text-sm font-medium">{item.equipmentId}</TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <Badge className="inline-flex px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        {item.category}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>{item.manufacturer}</TableCell>
                    <TableCell className="font-mono text-xs">{item.serialNumber}</TableCell>
                    <TableCell>
                      <Badge className={`inline-flex px-2 py-1 rounded-full text-xs ${
                        item.status === 'Operational' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.nextMaintenance}</TableCell>
                    <TableCell>
                      <button className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1">View</button>
                      <button className="text-green-600 hover:text-green-800 text-sm px-2 py-1">Service</button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Add Equipment Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Equipment" size="lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="name" label="Equipment Name" placeholder="X-Ray Machine" required />
              <Select
                name="category"
                label="Category"
                options={[
                  { value: 'diagnostic', label: 'Diagnostic' },
                  { value: 'life-support', label: 'Life Support' },
                  { value: 'surgery', label: 'Surgery' },
                  { value: 'laboratory', label: 'Laboratory' },
                ]}
                required
              />
              <Input name="location" label="Location" placeholder="Radiology - Floor 2" required />
              <Input name="manufacturer" label="Manufacturer" placeholder="Siemens" required />
              <Input name="model" label="Model" placeholder="YSIO Max" required />
              <Input name="serialNumber" label="Serial Number" placeholder="SN-2024-XXX" required />
              <Input name="purchaseDate" label="Purchase Date" type="date" />
              <Input name="warrantyExpiry" label="Warranty Expiry" type="date" />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Equipment</Button>
            </div>
          </form>
        </Modal>
      </VStack>
    </ContentArea>
  );
}
