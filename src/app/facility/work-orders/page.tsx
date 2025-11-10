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

export default function FacilityWorkOrdersPage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  // Sample data
  const workOrders = [
    {
      id: 1,
      orderId: 'WO-2024-001',
      title: 'HVAC System Repair - ICU',
      location: 'Intensive Care Unit',
      type: 'Repair',
      priority: 'High',
      status: 'In Progress',
      assignedTo: 'John Smith',
      dateCreated: '2024-01-10',
      dueDate: '2024-01-15'
    },
    {
      id: 2,
      orderId: 'WO-2024-002',
      title: 'Replace Broken Window - Room 204',
      location: 'Patient Ward - Floor 2',
      type: 'Repair',
      priority: 'Medium',
      status: 'Pending',
      assignedTo: 'Mike Johnson',
      dateCreated: '2024-01-12',
      dueDate: '2024-01-18'
    },
    {
      id: 3,
      orderId: 'WO-2024-003',
      title: 'Electrical Panel Inspection',
      location: 'Main Building',
      type: 'Inspection',
      priority: 'Low',
      status: 'Completed',
      assignedTo: 'Sarah Davis',
      dateCreated: '2024-01-08',
      dueDate: '2024-01-14'
    },
    {
      id: 4,
      orderId: 'WO-2024-004',
      title: 'Plumbing Leak - Surgery Prep',
      location: 'Operating Theater',
      type: 'Emergency',
      priority: 'Critical',
      status: 'In Progress',
      assignedTo: 'Tom Wilson',
      dateCreated: '2024-01-15',
      dueDate: '2024-01-15'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Work order submitted');
    setIsModalOpen(false);
  };

  return (
    <ContentArea>
      <VStack size="sm">
        {/* Page Title */}
        <div className="flex items-baseline gap-3">
          <h1 className="text-3xl font-bold text-slate-800">Work Orders</h1>
          <p className="text-sm text-slate-500">Manage maintenance and facility requests</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-blue-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Total Orders</p>
                  <p className="text-2xl font-bold text-slate-800">{workOrders.length}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-blue-600 text-xl">🔧</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-yellow-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Pending</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {workOrders.filter(wo => wo.status === 'Pending').length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-yellow-600 text-xl">⏳</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-orange-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">In Progress</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {workOrders.filter(wo => wo.status === 'In Progress').length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-orange-600 text-xl">🔨</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-green-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Completed</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {workOrders.filter(wo => wo.status === 'Completed').length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-green-600 text-xl">✓</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <Card className="border-2">
          <CardContent className="py-3 px-4">
            <Input
              placeholder="Search work orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </CardContent>
        </Card>

        {/* Work Orders Table */}
        <Card className="border-2">
          <CardHeader className="border-b-2 pb-4">
            <div className="flex justify-between items-center">
              <CardTitle>Work Orders ({workOrders.length})</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Export</Button>
                <Button size="sm" onClick={() => setIsModalOpen(true)}>+ New Work Order</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs uppercase tracking-wide">Order ID</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Title</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Location</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Type</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Priority</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Status</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Assigned To</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Due Date</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workOrders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-slate-50 border-b last:border-b-0">
                    <TableCell className="font-mono text-sm font-medium">{order.orderId}</TableCell>
                    <TableCell className="font-medium">{order.title}</TableCell>
                    <TableCell>{order.location}</TableCell>
                    <TableCell>
                      <Badge className={`inline-flex px-2 py-1 rounded-full text-xs ${
                        order.type === 'Emergency' ? 'bg-red-100 text-red-800' :
                        order.type === 'Repair' ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {order.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`inline-flex px-2 py-1 rounded-full text-xs ${
                        order.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                        order.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                        order.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {order.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`inline-flex px-2 py-1 rounded-full text-xs ${
                        order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'In Progress' ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.assignedTo}</TableCell>
                    <TableCell>{order.dueDate}</TableCell>
                    <TableCell>
                      <button className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1">View</button>
                      <button className="text-green-600 hover:text-green-800 text-sm px-2 py-1">Edit</button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Create Work Order Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Work Order" size="lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="title" label="Work Order Title" placeholder="HVAC System Repair" required className="md:col-span-2" />
              <Input name="location" label="Location" placeholder="ICU - Floor 3" required />
              <Select
                name="type"
                label="Type"
                options={[
                  { value: 'repair', label: 'Repair' },
                  { value: 'maintenance', label: 'Maintenance' },
                  { value: 'inspection', label: 'Inspection' },
                  { value: 'emergency', label: 'Emergency' },
                ]}
                required
              />
              <Select
                name="priority"
                label="Priority"
                options={[
                  { value: 'low', label: 'Low' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'high', label: 'High' },
                  { value: 'critical', label: 'Critical' },
                ]}
                required
              />
              <Input name="assignedTo" label="Assign To" placeholder="Select technician" required />
              <Input name="dueDate" label="Due Date" type="date" required className="md:col-span-2" />
              <textarea
                name="description"
                placeholder="Describe the work order details..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent md:col-span-2"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Work Order</Button>
            </div>
          </form>
        </Modal>
      </VStack>
    </ContentArea>
  );
}
