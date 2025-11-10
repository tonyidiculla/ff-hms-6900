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
import { useSurgeries, useScheduleSurgery } from '@/hooks/useHMSMicroservices';

export default function OTSchedulePage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [filters, setFilters] = React.useState({ hospital_id: '', date: '', status: '', theater: '', limit: '100' });

  const { data: surgeries = [], isLoading, error } = useSurgeries(filters);
  const scheduleSurgery = useScheduleSurgery();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const surgeryData = {
      patient_name: formData.get('patientName'),
      species: formData.get('species'),
      owner_name: formData.get('ownerName'),
      procedure: formData.get('procedure'),
      surgeon: formData.get('surgeon'),
      theater: formData.get('theater'),
      scheduled_date: formData.get('scheduledDate'),
      scheduled_time: formData.get('scheduledTime'),
      duration: formData.get('duration'),
      status: 'Scheduled',
      priority: formData.get('priority'),
    };

    try {
      await scheduleSurgery.mutateAsync(surgeryData);
      setIsModalOpen(false);
      e.currentTarget.reset();
    } catch (error) {
      console.error('Failed to schedule surgery:', error);
      alert('Failed to schedule surgery. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Emergency': return 'bg-red-100 text-red-800';
      case 'Urgent': return 'bg-orange-100 text-orange-800';
      case 'Routine': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <ContentArea>
        <VStack size="sm">
          <div className="flex items-baseline gap-3">
            <h1 className="text-3xl font-bold text-slate-800">Operation Theater Schedule</h1>
            <p className="text-sm text-slate-500">Surgery scheduling and theater management</p>
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-slate-600">Loading surgery schedule...</p>
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
            <h1 className="text-3xl font-bold text-slate-800">Operation Theater Schedule</h1>
            <p className="text-sm text-slate-500">Surgery scheduling and theater management</p>
          </div>
          <Card className="border-2 border-orange-200 bg-orange-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="text-3xl">⚠️</div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">Service Unavailable</h3>
                  <p className="text-slate-600 mb-3">
                    Unable to connect to the operation theater service. The OT microservice (ff-oper-6833) may not be running.
                  </p>
                  <p className="text-sm text-slate-500 italic">Error: {error.message || 'Failed to fetch'}</p>
                  <div className="mt-4">
                    <Button onClick={() => window.location.reload()} variant="outline" size="sm">
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
          <h1 className="text-3xl font-bold text-slate-800">Operation Theater Schedule</h1>
          <p className="text-sm text-slate-500">Surgery scheduling and theater management</p>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => setIsModalOpen(true)}>+ Schedule Surgery</Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-primary">{surgeries.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Total Surgeries</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-600">
                {surgeries.filter((s: any) => s.status === 'Scheduled').length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Scheduled</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">
                {surgeries.filter((s: any) => s.status === 'In Progress').length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">In Progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-600">
                {surgeries.filter((s: any) => s.priority === 'Emergency').length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Emergency</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4 flex-wrap">
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setFilters({ ...filters, date: e.target.value });
                }}
                className="w-48"
              />
              <Select
                options={[
                  { value: '', label: 'All Theaters' },
                  { value: 'OT-1', label: 'OT-1' },
                  { value: 'OT-2', label: 'OT-2' },
                  { value: 'OT-3', label: 'OT-3' },
                ]}
                onChange={(e) => setFilters({ ...filters, theater: e.target.value })}
                className="w-48"
              />
              <Select
                options={[
                  { value: '', label: 'All Status' },
                  { value: 'Scheduled', label: 'Scheduled' },
                  { value: 'In Progress', label: 'In Progress' },
                  { value: 'Completed', label: 'Completed' },
                ]}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-48"
              />
            </div>
          </CardContent>
        </Card>

        {/* Surgery Schedule Table */}
        <Card>
          <CardHeader>
            <CardTitle>Surgery Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading schedule...</div>
            ) : surgeries.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No surgeries scheduled</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Procedure</TableHead>
                    <TableHead>Surgeon</TableHead>
                    <TableHead>Theater</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {surgeries.map((surgery: any) => (
                    <TableRow key={surgery.id}>
                      <TableCell className="font-medium">{surgery.scheduled_time || surgery.time}</TableCell>
                      <TableCell>
                        <div className="font-medium">{surgery.patient_name || surgery.patient}</div>
                        <div className="text-xs text-muted-foreground">{surgery.species}</div>
                        <div className="text-xs text-muted-foreground">{surgery.owner_name || surgery.owner}</div>
                      </TableCell>
                      <TableCell>{surgery.procedure}</TableCell>
                      <TableCell>{surgery.surgeon}</TableCell>
                      <TableCell>{surgery.theater}</TableCell>
                      <TableCell>{surgery.duration}</TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(surgery.priority)}>
                          {surgery.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(surgery.status)}>
                          {surgery.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">View</Button>
                          <Button variant="ghost" size="sm">Update</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Schedule Surgery Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Schedule Surgery" size="lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="patientName" label="Patient Name" placeholder="Pet name" required />
              <Select
                name="species"
                label="Species"
                options={[
                  { value: 'dog', label: 'Dog' },
                  { value: 'cat', label: 'Cat' },
                  { value: 'bird', label: 'Bird' },
                  { value: 'rabbit', label: 'Rabbit' },
                ]}
                required
              />
              <Input name="ownerName" label="Owner Name" placeholder="Owner name" required />
              <Input name="procedure" label="Procedure" placeholder="e.g., Spay Surgery" required />
              <Select
                name="surgeon"
                label="Surgeon"
                options={[
                  { value: 'Dr. Smith', label: 'Dr. Smith' },
                  { value: 'Dr. Johnson', label: 'Dr. Johnson' },
                  { value: 'Dr. Lee', label: 'Dr. Lee' },
                ]}
                required
              />
              <Select
                name="theater"
                label="Operation Theater"
                options={[
                  { value: 'OT-1', label: 'OT-1' },
                  { value: 'OT-2', label: 'OT-2' },
                  { value: 'OT-3', label: 'OT-3' },
                ]}
                required
              />
              <Input name="scheduledDate" label="Surgery Date" type="date" required />
              <Input name="scheduledTime" label="Surgery Time" type="time" required />
              <Input name="duration" label="Duration" placeholder="e.g., 2 hours" required />
              <Select
                name="priority"
                label="Priority"
                options={[
                  { value: 'Routine', label: 'Routine' },
                  { value: 'Urgent', label: 'Urgent' },
                  { value: 'Emergency', label: 'Emergency' },
                ]}
                required
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsModalOpen(false)} type="button">
                Cancel
              </Button>
              <Button type="submit" disabled={scheduleSurgery.isPending}>
                {scheduleSurgery.isPending ? 'Scheduling...' : 'Schedule Surgery'}
              </Button>
            </div>
          </form>
        </Modal>
      </VStack>
    </ContentArea>
  );
}
