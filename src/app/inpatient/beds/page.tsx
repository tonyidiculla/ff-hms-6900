'use client';

import React from 'react';
import { ContentArea, VStack } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Search, Bed, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export default function BedManagementPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [wardFilter, setWardFilter] = React.useState('all');
  const [statusFilter, setStatusFilter] = React.useState('all');

  // Mock bed data
  const beds = [
    { id: 'B101', ward: 'ICU', floor: '1', status: 'occupied', patient: 'Max', owner: 'John Smith', admissionDate: '2024-11-07', condition: 'critical', lastCleaned: '2024-11-09 08:00' },
    { id: 'B102', ward: 'ICU', floor: '1', status: 'available', patient: null, owner: null, admissionDate: null, condition: null, lastCleaned: '2024-11-09 10:00' },
    { id: 'B103', ward: 'ICU', floor: '1', status: 'maintenance', patient: null, owner: null, admissionDate: null, condition: null, lastCleaned: '2024-11-08 15:00' },
    { id: 'B201', ward: 'General', floor: '2', status: 'occupied', patient: 'Whiskers', owner: 'Sarah Johnson', admissionDate: '2024-11-08', condition: 'stable', lastCleaned: '2024-11-09 09:00' },
    { id: 'B202', ward: 'General', floor: '2', status: 'occupied', patient: 'Buddy', owner: 'Mike Brown', admissionDate: '2024-11-06', condition: 'stable', lastCleaned: '2024-11-09 09:30' },
    { id: 'B203', ward: 'General', floor: '2', status: 'available', patient: null, owner: null, admissionDate: null, condition: null, lastCleaned: '2024-11-09 11:00' },
    { id: 'B301', ward: 'Isolation', floor: '3', status: 'occupied', patient: 'Charlie', owner: 'Tom Wilson', admissionDate: '2024-11-05', condition: 'isolation', lastCleaned: '2024-11-09 07:00' },
    { id: 'B302', ward: 'Isolation', floor: '3', status: 'available', patient: null, owner: null, admissionDate: null, condition: null, lastCleaned: '2024-11-09 07:30' },
  ];

  const filteredBeds = beds.filter(bed => {
    const matchesSearch = bed.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bed.patient?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bed.owner?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesWard = wardFilter === 'all' || bed.ward.toLowerCase() === wardFilter.toLowerCase();
    const matchesStatus = statusFilter === 'all' || bed.status === statusFilter;
    return matchesSearch && matchesWard && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'occupied': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'reserved': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'stable': return 'bg-green-100 text-green-800';
      case 'isolation': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalBeds = beds.length;
  const occupiedBeds = beds.filter(b => b.status === 'occupied').length;
  const availableBeds = beds.filter(b => b.status === 'available').length;
  const maintenanceBeds = beds.filter(b => b.status === 'maintenance').length;
  const occupancyRate = Math.round((occupiedBeds / totalBeds) * 100);

  return (
    <ContentArea>
      <VStack size="sm">
        <div className="flex items-baseline gap-3">
          <h1 className="text-3xl font-bold text-slate-800">Bed Management</h1>
          <p className="text-sm text-slate-500">Monitor and manage hospital bed availability</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-blue-500">
            <CardContent className="py-3 px-4">
              <div className="text-2xl font-bold text-slate-800">{totalBeds}</div>
              <p className="text-xs text-slate-500 mt-1">Total Beds</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-red-500">
            <CardContent className="py-3 px-4">
              <div className="text-2xl font-bold text-slate-800">{occupiedBeds}</div>
              <p className="text-xs text-slate-500 mt-1">Occupied</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-green-500">
            <CardContent className="py-3 px-4">
              <div className="text-2xl font-bold text-slate-800">{availableBeds}</div>
              <p className="text-xs text-slate-500 mt-1">Available</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-yellow-500">
            <CardContent className="py-3 px-4">
              <div className="text-2xl font-bold text-slate-800">{maintenanceBeds}</div>
              <p className="text-xs text-slate-500 mt-1">Maintenance</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-purple-500">
            <CardContent className="py-3 px-4">
              <div className="text-2xl font-bold text-slate-800">{occupancyRate}%</div>
              <p className="text-xs text-slate-500 mt-1">Occupancy Rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search by bed ID or patient..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={wardFilter}
                onChange={(e) => setWardFilter(e.target.value)}
                options={[
                  { value: 'all', label: 'All Wards' },
                  { value: 'icu', label: 'ICU' },
                  { value: 'general', label: 'General Ward' },
                  { value: 'isolation', label: 'Isolation' },
                ]}
                className="w-48"
              />
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: 'all', label: 'All Status' },
                  { value: 'available', label: 'Available' },
                  { value: 'occupied', label: 'Occupied' },
                  { value: 'maintenance', label: 'Maintenance' },
                ]}
                className="w-48"
              />
            </div>
          </CardContent>
        </Card>

        {/* Beds Table */}
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bed ID</TableHead>
                  <TableHead>Ward</TableHead>
                  <TableHead>Floor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Admission Date</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Last Cleaned</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBeds.map((bed) => (
                  <TableRow key={bed.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Bed className="h-4 w-4 text-slate-400" />
                        {bed.id}
                      </div>
                    </TableCell>
                    <TableCell>{bed.ward}</TableCell>
                    <TableCell>Floor {bed.floor}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(bed.status)}>
                        {bed.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{bed.patient || '-'}</TableCell>
                    <TableCell>{bed.owner || '-'}</TableCell>
                    <TableCell>{bed.admissionDate || '-'}</TableCell>
                    <TableCell>
                      {bed.condition ? (
                        <Badge className={getConditionColor(bed.condition)}>
                          {bed.condition}
                        </Badge>
                      ) : '-'}
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">{bed.lastCleaned}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        {bed.status === 'occupied' && (
                          <Button variant="ghost" size="sm">Discharge</Button>
                        )}
                        {bed.status === 'available' && (
                          <Button variant="ghost" size="sm" className="text-blue-600">Assign</Button>
                        )}
                        {bed.status === 'maintenance' && (
                          <Button variant="ghost" size="sm" className="text-green-600">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredBeds.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                No beds found matching your search criteria
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ward Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['ICU', 'General', 'Isolation'].map((ward) => {
            const wardBeds = beds.filter(b => b.ward === ward);
            const wardOccupied = wardBeds.filter(b => b.status === 'occupied').length;
            const wardAvailable = wardBeds.filter(b => b.status === 'available').length;
            const wardRate = Math.round((wardOccupied / wardBeds.length) * 100);
            
            return (
              <Card key={ward}>
                <CardHeader>
                  <CardTitle className="text-lg">{ward} Ward</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Total Beds</span>
                      <span className="font-semibold">{wardBeds.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Occupied</span>
                      <Badge className="bg-blue-100 text-blue-800">{wardOccupied}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Available</span>
                      <Badge className="bg-green-100 text-green-800">{wardAvailable}</Badge>
                    </div>
                    <div className="mt-4 pt-3 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-700">Occupancy Rate</span>
                        <span className="text-lg font-bold text-slate-800">{wardRate}%</span>
                      </div>
                      <div className="mt-2 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${wardRate > 80 ? 'bg-red-500' : wardRate > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                          style={{ width: `${wardRate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </VStack>
    </ContentArea>
  );
}
