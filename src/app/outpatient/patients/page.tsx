'use client';

import React from 'react';
import { ContentArea, VStack } from '@/components/layout/PageLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Search, UserPlus, FileText, Calendar, Phone, Mail } from 'lucide-react';

export default function PatientRegistrationPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedSpecies, setSelectedSpecies] = React.useState('all');
  const [isLoading] = React.useState(false);

  // Mock data - will be replaced with API call
  const patients = [
    { id: 1, name: 'Max', species: 'Dog', breed: 'Golden Retriever', age: '5 years', owner: 'John Smith', phone: '555-0101', lastVisit: '2024-11-08', status: 'active' },
    { id: 2, name: 'Whiskers', species: 'Cat', breed: 'Persian', age: '3 years', owner: 'Sarah Johnson', phone: '555-0102', lastVisit: '2024-11-07', status: 'active' },
    { id: 3, name: 'Buddy', species: 'Dog', breed: 'Labrador', age: '7 years', owner: 'Mike Brown', phone: '555-0103', lastVisit: '2024-11-05', status: 'active' },
    { id: 4, name: 'Luna', species: 'Cat', breed: 'Siamese', age: '2 years', owner: 'Emily Davis', phone: '555-0104', lastVisit: '2024-11-09', status: 'active' },
  ];

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecies = selectedSpecies === 'all' || patient.species.toLowerCase() === selectedSpecies.toLowerCase();
    return matchesSearch && matchesSpecies;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <ContentArea>
      <VStack size="sm">
        <div className="flex items-baseline gap-3">
          <h1 className="text-3xl font-bold text-slate-800">Patient Registration</h1>
          <p className="text-sm text-slate-500">Manage patient records and registrations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-blue-500">
            <CardContent className="py-3 px-4">
              <div className="text-2xl font-bold text-slate-800">{patients.length}</div>
              <p className="text-xs text-slate-500 mt-1">Total Patients</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-green-500">
            <CardContent className="py-3 px-4">
              <div className="text-2xl font-bold text-slate-800">
                {patients.filter(p => p.status === 'active').length}
              </div>
              <p className="text-xs text-slate-500 mt-1">Active Patients</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-purple-500">
            <CardContent className="py-3 px-4">
              <div className="text-2xl font-bold text-slate-800">12</div>
              <p className="text-xs text-slate-500 mt-1">New This Month</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-orange-500">
            <CardContent className="py-3 px-4">
              <div className="text-2xl font-bold text-slate-800">45</div>
              <p className="text-xs text-slate-500 mt-1">Visits This Week</p>
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
                    placeholder="Search by patient or owner name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select
                  value={selectedSpecies}
                  onChange={(e) => setSelectedSpecies(e.target.value)}
                  options={[
                    { value: 'all', label: 'All Species' },
                    { value: 'dog', label: 'Dogs' },
                    { value: 'cat', label: 'Cats' },
                    { value: 'bird', label: 'Birds' },
                    { value: 'other', label: 'Other' },
                  ]}
                  className="w-48"
                />
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <UserPlus className="h-4 w-4 mr-2" />
                Register New Patient
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Patients Table */}
        <Card>
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-slate-600">Loading patients...</span>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Species/Breed</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Last Visit</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">{patient.name}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{patient.species}</div>
                          <div className="text-slate-500">{patient.breed}</div>
                        </div>
                      </TableCell>
                      <TableCell>{patient.age}</TableCell>
                      <TableCell>{patient.owner}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-slate-600">
                          <Phone className="h-3 w-3" />
                          {patient.phone}
                        </div>
                      </TableCell>
                      <TableCell>{patient.lastVisit}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(patient.status)}>
                          {patient.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Calendar className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {filteredPatients.length === 0 && !isLoading && (
              <div className="text-center py-8 text-slate-500">
                No patients found matching your search criteria
              </div>
            )}
          </CardContent>
        </Card>
      </VStack>
    </ContentArea>
  );
}
