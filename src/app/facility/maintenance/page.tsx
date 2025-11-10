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

export default function FacilityMaintenancePage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  // Sample data
  const maintenanceTasks = [
    {
      id: 1,
      taskId: 'MT-001',
      title: 'HVAC System Inspection',
      equipment: 'Central HVAC Unit',
      location: 'Rooftop',
      type: 'Preventive',
      frequency: 'Monthly',
      assignedTo: 'John Smith',
      lastCompleted: '2023-12-15',
      nextDue: '2024-01-15',
      status: 'Scheduled'
    },
    {
      id: 2,
      taskId: 'MT-002',
      title: 'Fire Alarm System Test',
      equipment: 'Fire Alarm Panel',
      location: 'Main Building',
      type: 'Safety',
      frequency: 'Weekly',
      assignedTo: 'Mike Johnson',
      lastCompleted: '2024-01-08',
      nextDue: '2024-01-15',
      status: 'Overdue'
    },
    {
      id: 3,
      taskId: 'MT-003',
      title: 'Backup Generator Check',
      equipment: 'Emergency Generator',
      location: 'Basement',
      type: 'Preventive',
      frequency: 'Monthly',
      assignedTo: 'Sarah Davis',
      lastCompleted: '2024-01-10',
      nextDue: '2024-02-10',
      status: 'Scheduled'
    },
    {
      id: 4,
      taskId: 'MT-004',
      title: 'Medical Equipment Calibration',
      equipment: 'Various',
      location: 'Laboratory',
      type: 'Calibration',
      frequency: 'Quarterly',
      assignedTo: 'Tom Wilson',
      lastCompleted: '2023-10-01',
      nextDue: '2024-01-01',
      status: 'Completed'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Maintenance task submitted');
    setIsModalOpen(false);
  };

  return (
    <ContentArea>
      <VStack size="sm">
        {/* Page Title */}
        <div className="flex items-baseline gap-3">
          <h1 className="text-3xl font-bold text-slate-800">Maintenance Schedule</h1>
          <p className="text-sm text-slate-500">Manage preventive maintenance and inspections</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-blue-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Total Tasks</p>
                  <p className="text-2xl font-bold text-slate-800">{maintenanceTasks.length}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-blue-600 text-xl">📋</span>
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
                    {maintenanceTasks.filter(task => task.status === 'Completed').length}
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
                  <p className="text-xs text-slate-500 mt-2">Scheduled</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {maintenanceTasks.filter(task => task.status === 'Scheduled').length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-yellow-600 text-xl">📅</span>
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
                    {maintenanceTasks.filter(task => task.status === 'Overdue').length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-red-600 text-xl">⚠️</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <Card className="border-2">
          <CardContent className="py-3 px-4">
            <Input
              placeholder="Search maintenance tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </CardContent>
        </Card>

        {/* Maintenance Table */}
        <Card className="border-2">
          <CardHeader className="border-b-2 pb-4">
            <div className="flex justify-between items-center">
              <CardTitle>Maintenance Tasks ({maintenanceTasks.length})</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Export</Button>
                <Button size="sm" onClick={() => setIsModalOpen(true)}>+ Schedule Task</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs uppercase tracking-wide">Task ID</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Title</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Equipment</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Location</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Type</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Frequency</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Assigned To</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Next Due</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Status</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {maintenanceTasks.map((task) => (
                  <TableRow key={task.id} className="hover:bg-slate-50 border-b last:border-b-0">
                    <TableCell className="font-mono text-sm font-medium">{task.taskId}</TableCell>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell>{task.equipment}</TableCell>
                    <TableCell>{task.location}</TableCell>
                    <TableCell>
                      <Badge className={`inline-flex px-2 py-1 rounded-full text-xs ${
                        task.type === 'Safety' ? 'bg-red-100 text-red-800' :
                        task.type === 'Calibration' ? 'bg-purple-100 text-purple-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {task.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{task.frequency}</TableCell>
                    <TableCell>{task.assignedTo}</TableCell>
                    <TableCell>{task.nextDue}</TableCell>
                    <TableCell>
                      <Badge className={`inline-flex px-2 py-1 rounded-full text-xs ${
                        task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        task.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {task.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <button className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1">View</button>
                      {task.status !== 'Completed' && (
                        <button className="text-green-600 hover:text-green-800 text-sm px-2 py-1">Complete</button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Schedule Task Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Schedule Maintenance Task" size="lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="title" label="Task Title" placeholder="HVAC System Inspection" required />
              <Input name="equipment" label="Equipment" placeholder="Central HVAC Unit" required />
              <Input name="location" label="Location" placeholder="Rooftop" required />
              <Select
                name="type"
                label="Type"
                options={[
                  { value: 'preventive', label: 'Preventive' },
                  { value: 'safety', label: 'Safety' },
                  { value: 'calibration', label: 'Calibration' },
                  { value: 'inspection', label: 'Inspection' },
                ]}
                required
              />
              <Select
                name="frequency"
                label="Frequency"
                options={[
                  { value: 'daily', label: 'Daily' },
                  { value: 'weekly', label: 'Weekly' },
                  { value: 'monthly', label: 'Monthly' },
                  { value: 'quarterly', label: 'Quarterly' },
                  { value: 'annually', label: 'Annually' },
                ]}
                required
              />
              <Input name="assignedTo" label="Assigned To" placeholder="John Smith" required />
              <Input name="nextDue" label="Next Due Date" type="date" required />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Schedule Task</Button>
            </div>
          </form>
        </Modal>
      </VStack>
    </ContentArea>
  );
}
