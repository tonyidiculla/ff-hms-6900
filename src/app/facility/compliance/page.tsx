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

export default function FacilityCompliancePage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  // Sample data
  const complianceItems = [
    {
      id: 1,
      itemId: 'COMP-001',
      title: 'Fire Safety Inspection',
      category: 'Safety',
      requirement: 'Annual fire safety inspection by certified inspector',
      authority: 'Fire Department',
      dueDate: '2024-06-30',
      lastCompleted: '2023-06-15',
      status: 'Current',
      documentUrl: '#'
    },
    {
      id: 2,
      itemId: 'COMP-002',
      title: 'Biomedical Waste License',
      category: 'License',
      requirement: 'Valid biomedical waste management license',
      authority: 'Health Department',
      dueDate: '2024-03-31',
      lastCompleted: '2023-03-20',
      status: 'Expiring Soon',
      documentUrl: '#'
    },
    {
      id: 3,
      itemId: 'COMP-003',
      title: 'HVAC System Certification',
      category: 'Certification',
      requirement: 'Biannual HVAC system efficiency certification',
      authority: 'Environmental Agency',
      dueDate: '2024-07-15',
      lastCompleted: '2024-01-10',
      status: 'Current',
      documentUrl: '#'
    },
    {
      id: 4,
      itemId: 'COMP-004',
      title: 'Electrical Safety Audit',
      category: 'Inspection',
      requirement: 'Annual electrical safety audit and certification',
      authority: 'Electrical Safety Board',
      dueDate: '2024-01-10',
      lastCompleted: '2023-01-15',
      status: 'Overdue',
      documentUrl: '#'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Compliance item submitted');
    setIsModalOpen(false);
  };

  return (
    <ContentArea>
      <VStack size="sm">
        {/* Page Title */}
        <div className="flex items-baseline gap-3">
          <h1 className="text-3xl font-bold text-slate-800">Compliance Management</h1>
          <p className="text-sm text-slate-500">Track regulatory compliance and certifications</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-blue-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Total Items</p>
                  <p className="text-2xl font-bold text-slate-800">{complianceItems.length}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-blue-600 text-xl">📄</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-green-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Current</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {complianceItems.filter(item => item.status === 'Current').length}
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
                  <p className="text-xs text-slate-500 mt-2">Expiring Soon</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {complianceItems.filter(item => item.status === 'Expiring Soon').length}
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
                  <p className="text-xs text-slate-500 mt-2">Overdue</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {complianceItems.filter(item => item.status === 'Overdue').length}
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
              placeholder="Search compliance items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </CardContent>
        </Card>

        {/* Compliance Table */}
        <Card className="border-2">
          <CardHeader className="border-b-2 pb-4">
            <div className="flex justify-between items-center">
              <CardTitle>Compliance Items ({complianceItems.length})</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Export</Button>
                <Button size="sm" onClick={() => setIsModalOpen(true)}>+ Add Compliance Item</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs uppercase tracking-wide">Item ID</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Title</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Category</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Requirement</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Authority</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Due Date</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Last Completed</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Status</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {complianceItems.map((item) => (
                  <TableRow key={item.id} className="hover:bg-slate-50 border-b last:border-b-0">
                    <TableCell className="font-mono text-sm font-medium">{item.itemId}</TableCell>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>
                      <Badge className={`inline-flex px-2 py-1 rounded-full text-xs ${
                        item.category === 'Safety' ? 'bg-red-100 text-red-800' :
                        item.category === 'License' ? 'bg-purple-100 text-purple-800' :
                        item.category === 'Certification' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {item.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{item.requirement}</TableCell>
                    <TableCell>{item.authority}</TableCell>
                    <TableCell>{item.dueDate}</TableCell>
                    <TableCell>{item.lastCompleted}</TableCell>
                    <TableCell>
                      <Badge className={`inline-flex px-2 py-1 rounded-full text-xs ${
                        item.status === 'Current' ? 'bg-green-100 text-green-800' :
                        item.status === 'Expiring Soon' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <button className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1">View</button>
                      <button className="text-green-600 hover:text-green-800 text-sm px-2 py-1">Update</button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Add Compliance Item Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Compliance Item" size="lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="title" label="Title" placeholder="Fire Safety Inspection" required />
              <Select
                name="category"
                label="Category"
                options={[
                  { value: 'safety', label: 'Safety' },
                  { value: 'license', label: 'License' },
                  { value: 'certification', label: 'Certification' },
                  { value: 'inspection', label: 'Inspection' },
                  { value: 'permit', label: 'Permit' },
                ]}
                required
              />
              <Input name="authority" label="Regulatory Authority" placeholder="Fire Department" required />
              <Input name="dueDate" label="Due Date" type="date" required />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Requirement Description</label>
              <textarea
                name="requirement"
                placeholder="Describe the compliance requirement..."
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                required
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Compliance Item</Button>
            </div>
          </form>
        </Modal>
      </VStack>
    </ContentArea>
  );
}
