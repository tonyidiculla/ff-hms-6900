'use client';

import React from 'react';
import { ContentArea, VStack } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Search, Image, FileText, AlertCircle } from 'lucide-react';

export default function ImagingRadiologyPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [modalityFilter, setModalityFilter] = React.useState('all');
  const [statusFilter, setStatusFilter] = React.useState('all');

  // Mock imaging data
  const imagingStudies = [
    {
      id: 'IMG-001',
      patient: 'Max',
      owner: 'John Smith',
      modality: 'X-Ray',
      studyType: 'Chest X-Ray',
      requestedBy: 'Dr. Smith',
      requestDate: '2024-11-09',
      scheduledDate: '2024-11-09',
      performedDate: '2024-11-09',
      status: 'completed',
      priority: 'routine',
      findings: 'No abnormalities detected',
      radiologist: 'Dr. Anderson'
    },
    {
      id: 'IMG-002',
      patient: 'Luna',
      owner: 'Emily Davis',
      modality: 'Ultrasound',
      studyType: 'Abdominal Ultrasound',
      requestedBy: 'Dr. Johnson',
      requestDate: '2024-11-09',
      scheduledDate: '2024-11-10',
      performedDate: null,
      status: 'scheduled',
      priority: 'urgent',
      findings: null,
      radiologist: null
    },
    {
      id: 'IMG-003',
      patient: 'Buddy',
      owner: 'Mike Brown',
      modality: 'CT Scan',
      studyType: 'Brain CT',
      requestedBy: 'Dr. Williams',
      requestDate: '2024-11-08',
      scheduledDate: '2024-11-09',
      performedDate: '2024-11-09',
      status: 'awaiting-report',
      priority: 'high',
      findings: 'Pending radiologist review',
      radiologist: 'Dr. Martinez'
    },
    {
      id: 'IMG-004',
      patient: 'Whiskers',
      owner: 'Sarah Johnson',
      modality: 'MRI',
      studyType: 'Spinal MRI',
      requestedBy: 'Dr. Smith',
      requestDate: '2024-11-07',
      scheduledDate: '2024-11-11',
      performedDate: null,
      status: 'scheduled',
      priority: 'routine',
      findings: null,
      radiologist: null
    },
  ];

  const filteredStudies = imagingStudies.filter(study => {
    const matchesSearch = study.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         study.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         study.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModality = modalityFilter === 'all' || study.modality.toLowerCase() === modalityFilter.toLowerCase();
    const matchesStatus = statusFilter === 'all' || study.status === statusFilter;
    return matchesSearch && matchesModality && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'awaiting-report': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'routine': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalStudies = imagingStudies.length;
  const scheduledCount = imagingStudies.filter(s => s.status === 'scheduled').length;
  const completedCount = imagingStudies.filter(s => s.status === 'completed').length;
  const awaitingReportCount = imagingStudies.filter(s => s.status === 'awaiting-report').length;

  return (
    <ContentArea>
      <VStack size="sm">
        <div className="flex items-baseline gap-3">
          <h1 className="text-3xl font-bold text-slate-800">Imaging & Radiology</h1>
          <p className="text-sm text-slate-500">Manage diagnostic imaging studies and reports</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-blue-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center gap-3">
                <Image className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold text-slate-800">{totalStudies}</div>
                  <p className="text-xs text-slate-500 mt-1">Total Studies</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-yellow-500">
            <CardContent className="py-3 px-4">
              <div className="text-2xl font-bold text-slate-800">{scheduledCount}</div>
              <p className="text-xs text-slate-500 mt-1">Scheduled</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-purple-500">
            <CardContent className="py-3 px-4">
              <div className="text-2xl font-bold text-slate-800">{awaitingReportCount}</div>
              <p className="text-xs text-slate-500 mt-1">Awaiting Report</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-green-500">
            <CardContent className="py-3 px-4">
              <div className="text-2xl font-bold text-slate-800">{completedCount}</div>
              <p className="text-xs text-slate-500 mt-1">Completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4 flex-wrap items-center justify-between">
              <div className="flex gap-4 flex-1">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Search by patient or study ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select
                  value={modalityFilter}
                  onChange={(e) => setModalityFilter(e.target.value)}
                  options={[
                    { value: 'all', label: 'All Modalities' },
                    { value: 'x-ray', label: 'X-Ray' },
                    { value: 'ultrasound', label: 'Ultrasound' },
                    { value: 'ct scan', label: 'CT Scan' },
                    { value: 'mri', label: 'MRI' },
                  ]}
                  className="w-48"
                />
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  options={[
                    { value: 'all', label: 'All Status' },
                    { value: 'scheduled', label: 'Scheduled' },
                    { value: 'in-progress', label: 'In Progress' },
                    { value: 'awaiting-report', label: 'Awaiting Report' },
                    { value: 'completed', label: 'Completed' },
                  ]}
                  className="w-48"
                />
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Image className="h-4 w-4 mr-2" />
                Schedule Imaging
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Imaging Studies Table */}
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Study ID</TableHead>
                  <TableHead>Patient/Owner</TableHead>
                  <TableHead>Modality</TableHead>
                  <TableHead>Study Type</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Scheduled Date</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Radiologist</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudies.map((study) => (
                  <TableRow key={study.id} className={study.priority === 'urgent' ? 'bg-red-50' : ''}>
                    <TableCell className="font-medium">{study.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{study.patient}</div>
                        <div className="text-sm text-slate-500">{study.owner}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-indigo-100 text-indigo-800">
                        {study.modality}
                      </Badge>
                    </TableCell>
                    <TableCell>{study.studyType}</TableCell>
                    <TableCell>{study.requestedBy}</TableCell>
                    <TableCell>{study.scheduledDate}</TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(study.priority)}>
                        {study.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(study.status)}>
                        {study.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{study.radiologist || '-'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        {study.status === 'completed' && (
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                        )}
                        {study.status === 'awaiting-report' && (
                          <Button variant="ghost" size="sm" className="text-purple-600">Add Report</Button>
                        )}
                        <Button variant="ghost" size="sm">View</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredStudies.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                No imaging studies found matching your search criteria
              </div>
            )}
          </CardContent>
        </Card>
      </VStack>
    </ContentArea>
  );
}
