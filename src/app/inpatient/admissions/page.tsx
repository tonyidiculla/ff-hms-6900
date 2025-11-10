'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { ContentArea, ContentCard, VStack, MetricsGrid } from '@/components/layout/PageLayout';
import { useAdmissions, useCreateAdmission } from '@/hooks/useHMSMicroservices';

export default function AdmissionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    hospital_id: '',
    status: '',
    limit: '50',
  });

  // Fetch admissions from API
  const { data: admissions = [], isLoading, error } = useAdmissions(filters);
  const createAdmission = useCreateAdmission();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const admissionData = {
      pet_name: formData.get('petName'),
      species: formData.get('species'),
      owner_name: formData.get('ownerName'),
      owner_phone: formData.get('ownerPhone'),
      admission_date: formData.get('admissionDate'),
      admission_time: formData.get('admissionTime'),
      ward: formData.get('ward'),
      bed: formData.get('bed'),
      attending_doctor: formData.get('doctor'),
      condition: formData.get('admissionType'),
      reason: formData.get('reason'),
      status: 'active',
    };

    try {
      await createAdmission.mutateAsync(admissionData);
      setIsModalOpen(false);
      e.currentTarget.reset();
    } catch (error) {
      console.error('Failed to create admission:', error);
      alert('Failed to create admission. Please try again.');
    }
  };

  const statusConfig = {
    active: { variant: 'info' as const, label: 'Active' },
    critical: { variant: 'danger' as const, label: 'Critical' },
    stable: { variant: 'success' as const, label: 'Stable' },
    discharged: { variant: 'default' as const, label: 'Discharged' },
  };

  if (error) {
    return (
      <ContentArea>
        <Card>
          <CardContent className="p-6">
            <p className="text-destructive">Error loading admissions: {error.message}</p>
          </CardContent>
        </Card>
      </ContentArea>
    );
  }

  return (
    <ContentArea>
      <VStack size="sm">
        <div className="flex items-baseline gap-3">
          <h1 className="text-3xl font-bold text-slate-800">Inpatient Admissions</h1>
          <p className="text-sm text-slate-500">Manage pet admissions and ward assignments</p>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => setIsModalOpen(true)}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Admission
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Admitted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{admissions.length}</div>
              <p className="text-xs text-muted-foreground">Active pets</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Available Beds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Out of 30 total</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Critical Care</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {admissions.filter((a: any) => a.status === 'critical').length}
              </div>
              <p className="text-xs text-muted-foreground">Requires attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Stay</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3.5 days</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input placeholder="Search pet..." />
              <Select
                options={[
                  { value: '', label: 'All Status' },
                  { value: 'active', label: 'Active' },
                  { value: 'critical', label: 'Critical' },
                  { value: 'stable', label: 'Stable' },
                ]}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              />
              <Select
                options={[
                  { value: 'all', label: 'All Wards' },
                  { value: 'ward-a', label: 'Ward A' },
                  { value: 'ward-b', label: 'Ward B' },
                  { value: 'icu', label: 'ICU' },
                ]}
              />
              <Button variant="outline">Filter</Button>
            </div>
          </CardContent>
        </Card>

        {/* Admissions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Current Admissions</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading admissions...</div>
            ) : admissions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No admissions found</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Admission ID</TableHead>
                    <TableHead>Pet Details</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Admission Date</TableHead>
                    <TableHead>Ward/Bed</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admissions.map((admission: any) => (
                    <TableRow key={admission.id}>
                      <TableCell className="font-medium">{admission.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{admission.pet_name || admission.petName}</p>
                          <p className="text-xs text-muted-foreground">{admission.species}</p>
                        </div>
                      </TableCell>
                      <TableCell>{admission.owner_name || admission.owner}</TableCell>
                      <TableCell>{admission.admission_date || admission.admissionDate}</TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{admission.ward}</p>
                          <p className="text-xs text-muted-foreground">{admission.bed}</p>
                        </div>
                      </TableCell>
                      <TableCell>{admission.attending_doctor || admission.doctor}</TableCell>
                      <TableCell>{admission.condition}</TableCell>
                      <TableCell>
                        <Badge variant={statusConfig[admission.status as keyof typeof statusConfig]?.variant || 'default'}>
                          {statusConfig[admission.status as keyof typeof statusConfig]?.label || admission.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" title="View Details">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </Button>
                          <Button variant="ghost" size="sm" title="Update Status">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Button>
                          <Button variant="ghost" size="sm" title="Discharge">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* New Admission Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Admission" size="lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="petName" label="Pet Name" placeholder="Enter pet name" required />
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
              <Input name="ownerPhone" label="Owner Phone" type="tel" placeholder="Phone number" required />
              <Input name="admissionDate" label="Admission Date" type="date" required />
              <Input name="admissionTime" label="Admission Time" type="time" required />
              <Select
                name="ward"
                label="Ward"
                options={[
                  { value: 'ward-a', label: 'Ward A' },
                  { value: 'ward-b', label: 'Ward B' },
                  { value: 'icu', label: 'ICU' },
                ]}
                required
              />
              <Select
                name="bed"
                label="Bed Number"
                options={[
                  { value: 'bed-1', label: 'Bed 1' },
                  { value: 'bed-2', label: 'Bed 2' },
                  { value: 'bed-3', label: 'Bed 3' },
                ]}
                required
              />
              <Select
                name="doctor"
                label="Attending Doctor"
                options={[
                  { value: 'dr-smith', label: 'Dr. Smith' },
                  { value: 'dr-johnson', label: 'Dr. Johnson' },
                ]}
                required
              />
              <Select
                name="admissionType"
                label="Admission Type"
                options={[
                  { value: 'post-surgery', label: 'Post-Surgery' },
                  { value: 'observation', label: 'Observation' },
                  { value: 'critical', label: 'Critical Care' },
                  { value: 'treatment', label: 'Treatment' },
                ]}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Reason for Admission <span className="text-destructive">*</span>
              </label>
              <textarea
                name="reason"
                className="w-full min-h-[100px] rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Enter reason and clinical notes..."
                required
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsModalOpen(false)} type="button">
                Cancel
              </Button>
              <Button type="submit" disabled={createAdmission.isPending}>
                {createAdmission.isPending ? 'Admitting...' : 'Admit Pet'}
              </Button>
            </div>
          </form>
        </Modal>
      </VStack>
    </ContentArea>
  );
}
