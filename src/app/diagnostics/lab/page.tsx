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
import { useDiagnosticTests, useCreateDiagnosticTest } from '@/hooks/useHMSMicroservices';

export default function DiagnosticsLabPage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filters, setFilters] = React.useState({ hospital_id: '', category: '', status: '', limit: '100' });

  const { data: tests = [], isLoading, error } = useDiagnosticTests(filters);
  const createTest = useCreateDiagnosticTest();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const testData = {
      patient_name: formData.get('patientName'),
      species: formData.get('species'),
      owner_name: formData.get('ownerName'),
      test_type: formData.get('testType'),
      category: formData.get('category'),
      request_date: new Date().toISOString().split('T')[0],
      sample_type: formData.get('sampleType'),
      status: 'Pending',
      result: 'Pending',
      technician: formData.get('technician'),
    };

    try {
      await createTest.mutateAsync(testData);
      setIsModalOpen(false);
      e.currentTarget.reset();
    } catch (error) {
      console.error('Failed to create test:', error);
      alert('Failed to create test. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <ContentArea>
        <VStack size="sm">
          <div className="flex items-baseline gap-3">
            <h1 className="text-3xl font-bold text-slate-800">Diagnostics Laboratory</h1>
            <p className="text-sm text-slate-500">Lab tests and diagnostic procedures</p>
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-slate-600">Loading lab tests...</p>
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
            <h1 className="text-3xl font-bold text-slate-800">Diagnostics Laboratory</h1>
            <p className="text-sm text-slate-500">Lab tests and diagnostic procedures</p>
          </div>
          <Card className="border-2 border-orange-200 bg-orange-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="text-3xl">⚠️</div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">Service Unavailable</h3>
                  <p className="text-slate-600 mb-3">
                    Unable to connect to the diagnostics service. The diagnostics microservice (ff-diag-6832) may not be running.
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
          <h1 className="text-3xl font-bold text-slate-800">Diagnostics Laboratory</h1>
          <p className="text-sm text-slate-500">Lab tests and diagnostic procedures</p>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => setIsModalOpen(true)}>+ New Test Request</Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-primary">{tests.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Total Tests</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-600">
                {tests.filter((t: any) => t.status === 'Pending').length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">
                {tests.filter((t: any) => t.status === 'In Progress').length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">In Progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">
                {tests.filter((t: any) => t.status === 'Completed').length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4 flex-wrap">
              <Input
                placeholder="Search tests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 min-w-[200px]"
              />
              <Select
                options={[
                  { value: '', label: 'All Categories' },
                  { value: 'hematology', label: 'Hematology' },
                  { value: 'clinical-pathology', label: 'Clinical Pathology' },
                  { value: 'radiology', label: 'Radiology' },
                  { value: 'serology', label: 'Serology' },
                ]}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-48"
              />
              <Select
                options={[
                  { value: '', label: 'All Status' },
                  { value: 'Pending', label: 'Pending' },
                  { value: 'In Progress', label: 'In Progress' },
                  { value: 'Completed', label: 'Completed' },
                ]}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-48"
              />
            </div>
          </CardContent>
        </Card>

        {/* Tests Table */}
        <Card>
          <CardHeader>
            <CardTitle>Laboratory Tests</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading tests...</div>
            ) : tests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No tests found</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Test Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Request Date</TableHead>
                    <TableHead>Sample Type</TableHead>
                    <TableHead>Technician</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tests.map((test: any) => (
                    <TableRow key={test.id}>
                      <TableCell className="font-medium">{test.id}</TableCell>
                      <TableCell>
                        <div className="font-medium">{test.patient_name || test.patient}</div>
                        <div className="text-xs text-muted-foreground">{test.species}</div>
                        <div className="text-xs text-muted-foreground">{test.owner_name || test.owner}</div>
                      </TableCell>
                      <TableCell>{test.test_type || test.testType}</TableCell>
                      <TableCell>{test.category}</TableCell>
                      <TableCell>{test.request_date || test.requestDate}</TableCell>
                      <TableCell>{test.sample_type || test.sampleType}</TableCell>
                      <TableCell>{test.technician}</TableCell>
                      <TableCell>{test.result}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(test.status)}>
                          {test.status}
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

        {/* New Test Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Test Request" size="lg">
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
              <Input name="testType" label="Test Type" placeholder="e.g., Complete Blood Count" required />
              <Select
                name="category"
                label="Category"
                options={[
                  { value: 'hematology', label: 'Hematology' },
                  { value: 'clinical-pathology', label: 'Clinical Pathology' },
                  { value: 'radiology', label: 'Radiology' },
                  { value: 'serology', label: 'Serology' },
                ]}
                required
              />
              <Select
                name="sampleType"
                label="Sample Type"
                options={[
                  { value: 'blood', label: 'Blood' },
                  { value: 'urine', label: 'Urine' },
                  { value: 'tissue', label: 'Tissue' },
                  { value: 'imaging', label: 'Imaging' },
                ]}
                required
              />
              <Input name="technician" label="Technician" placeholder="Technician name" required />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsModalOpen(false)} type="button">
                Cancel
              </Button>
              <Button type="submit" disabled={createTest.isPending}>
                {createTest.isPending ? 'Creating...' : 'Create Test Request'}
              </Button>
            </div>
          </form>
        </Modal>
      </VStack>
    </ContentArea>
  );
}
