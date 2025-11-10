'use client';

import React from 'react';
import { ContentArea, ContentCard, VStack } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';

export default function WardManagementPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filters, setFilters] = React.useState({ hospital_id: '', status: '', limit: '50' });
  const [patients, setPatients] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    fetchAdmissions();
  }, [filters]);

  const fetchAdmissions = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (filters.hospital_id) params.append('hospital_id', filters.hospital_id);
      if (filters.status) params.append('status', filters.status);
      if (filters.limit) params.append('limit', filters.limit);

      const response = await fetch(`/api/proxy/inpatient/admissions?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.warn('Inpatient API endpoint not available yet, using mock data');
        // Use mock data until the API endpoint is implemented
        setPatients([
          {
            id: 'ADM-001',
            pet_name: 'Max',
            species: 'Dog - Golden Retriever',
            owner_name: 'John Smith',
            ward: 'ICU Ward',
            bed: 'Bed 3',
            admission_date: '2024-11-07',
            condition: 'Post-surgery recovery',
            attending_doctor: 'Dr. Sarah Wilson',
            status: 'critical'
          },
          {
            id: 'ADM-002',
            pet_name: 'Whiskers',
            species: 'Cat - Persian',
            owner_name: 'Emily Brown',
            ward: 'General Ward A',
            bed: 'Bed 12',
            admission_date: '2024-11-08',
            condition: 'Pneumonia treatment',
            attending_doctor: 'Dr. Michael Chen',
            status: 'stable'
          },
          {
            id: 'ADM-003',
            pet_name: 'Buddy',
            species: 'Dog - Labrador',
            owner_name: 'Robert Johnson',
            ward: 'General Ward B',
            bed: 'Bed 5',
            admission_date: '2024-11-06',
            condition: 'Observation',
            attending_doctor: 'Dr. Lisa Martinez',
            status: 'stable'
          }
        ]);
        setError(null);
        return;
      }

      const data = await response.json();
      setPatients(data?.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching admissions:', err);
      setError(err as Error);
      setPatients([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'stable': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (error) {
    return (
      <ContentArea>
        <Card>
          <CardContent className="p-6">
            <p className="text-destructive">Error loading ward data: {error.message}</p>
          </CardContent>
        </Card>
      </ContentArea>
    );
  }

  return (
    <ContentArea>
      <VStack size="sm">
        <div className="flex items-baseline gap-3">
          <h1 className="text-3xl font-bold text-slate-800">Ward Management</h1>
          <p className="text-sm text-slate-500">Inpatient care and ward monitoring</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-blue-500">
            <CardContent className="py-3 px-4">
              <div className="text-2xl font-bold text-slate-800">{patients.length}</div>
              <p className="text-xs text-slate-500 mt-1">Current Inpatients</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-600">
                {patients.filter((p: any) => p.status === 'critical').length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Critical Cases</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">85%</div>
              <p className="text-xs text-muted-foreground mt-1">Bed Occupancy</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">5</div>
              <p className="text-xs text-muted-foreground mt-1">Discharges Today</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4 flex-wrap">
              <Input
                type="text"
                placeholder="Search pets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 min-w-[200px]"
              />
              <Select
                options={[
                  { value: 'all', label: 'All Wards' },
                  { value: 'icu', label: 'ICU' },
                  { value: 'general', label: 'General Ward' },
                  { value: 'isolation', label: 'Isolation' },
                ]}
                className="w-48"
              />
              <Select
                options={[
                  { value: '', label: 'All Status' },
                  { value: 'critical', label: 'Critical' },
                  { value: 'stable', label: 'Stable' },
                  { value: 'active', label: 'Active' },
                ]}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-48"
              />
            </div>
          </CardContent>
        </Card>

        {/* Inpatients Table */}
        <Card>
          <CardHeader>
            <CardTitle>Inpatient List</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading patients...</div>
            ) : patients.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No inpatients found</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Pet</TableHead>
                    <TableHead>Ward</TableHead>
                    <TableHead>Admit Date</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map((patient: any) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">{patient.id}</TableCell>
                      <TableCell>
                        <div className="font-medium">{patient.pet_name || patient.petName}</div>
                        <div className="text-xs text-muted-foreground">{patient.species}</div>
                        <div className="text-xs text-muted-foreground">{patient.owner_name || patient.owner}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{patient.ward}</div>
                        <div className="text-xs text-muted-foreground">{patient.bed}</div>
                      </TableCell>
                      <TableCell>{patient.admission_date || patient.admissionDate}</TableCell>
                      <TableCell>{patient.condition}</TableCell>
                      <TableCell>{patient.attending_doctor || patient.doctor}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(patient.status)}>
                          {patient.status}
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
      </VStack>
    </ContentArea>
  );
}
