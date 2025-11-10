'use client';

import React from 'react';
import { ContentArea, VStack } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Search, Package, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

export default function PrescriptionDispensingPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');

  // Mock dispensing data
  const dispensingQueue = [
    {
      id: 'RX-001',
      patient: 'Max',
      owner: 'John Smith',
      prescription: 'Amoxicillin 250mg',
      quantity: '30 tablets',
      dosage: '1 tablet twice daily',
      prescribedBy: 'Dr. Smith',
      prescribedDate: '2024-11-09',
      status: 'pending',
      priority: 'normal',
      stockAvailable: true,
      instructions: 'Take with food'
    },
    {
      id: 'RX-002',
      patient: 'Luna',
      owner: 'Emily Davis',
      prescription: 'Prednisolone 5mg',
      quantity: '14 tablets',
      dosage: '0.5 tablet once daily',
      prescribedBy: 'Dr. Johnson',
      prescribedDate: '2024-11-09',
      status: 'in-progress',
      priority: 'urgent',
      stockAvailable: true,
      instructions: 'Taper dosage as directed'
    },
    {
      id: 'RX-003',
      patient: 'Buddy',
      owner: 'Mike Brown',
      prescription: 'Gabapentin 100mg',
      quantity: '60 capsules',
      dosage: '1 capsule twice daily',
      prescribedBy: 'Dr. Williams',
      prescribedDate: '2024-11-08',
      status: 'ready',
      priority: 'normal',
      stockAvailable: true,
      instructions: 'May cause drowsiness'
    },
    {
      id: 'RX-004',
      patient: 'Whiskers',
      owner: 'Sarah Johnson',
      prescription: 'Meloxicam 0.5mg',
      quantity: '7 tablets',
      dosage: '1 tablet once daily',
      prescribedBy: 'Dr. Smith',
      prescribedDate: '2024-11-09',
      status: 'pending',
      priority: 'normal',
      stockAvailable: false,
      instructions: 'Give with food, monitor for GI upset'
    },
    {
      id: 'RX-005',
      patient: 'Rocky',
      owner: 'David Lee',
      prescription: 'Insulin 10 units',
      quantity: '1 vial',
      dosage: '10 units twice daily',
      prescribedBy: 'Dr. Johnson',
      prescribedDate: '2024-11-09',
      status: 'dispensed',
      priority: 'urgent',
      stockAvailable: true,
      instructions: 'Refrigerate, administer subcutaneously'
    },
  ];

  const filteredQueue = dispensingQueue.filter(item => {
    const matchesSearch = item.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'dispensed': return 'bg-slate-100 text-slate-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const pendingCount = dispensingQueue.filter(r => r.status === 'pending').length;
  const inProgressCount = dispensingQueue.filter(r => r.status === 'in-progress').length;
  const readyCount = dispensingQueue.filter(r => r.status === 'ready').length;
  const outOfStockCount = dispensingQueue.filter(r => !r.stockAvailable).length;

  return (
    <ContentArea>
      <VStack size="sm">
        <div className="flex items-baseline gap-3">
          <h1 className="text-3xl font-bold text-slate-800">Prescription Dispensing</h1>
          <p className="text-sm text-slate-500">Manage and dispense patient prescriptions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-yellow-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div>
                  <div className="text-2xl font-bold text-slate-800">{pendingCount}</div>
                  <p className="text-xs text-slate-500 mt-1">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-blue-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center gap-3">
                <Package className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold text-slate-800">{inProgressCount}</div>
                  <p className="text-xs text-slate-500 mt-1">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-green-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-slate-800">{readyCount}</div>
                  <p className="text-xs text-slate-500 mt-1">Ready for Pickup</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-red-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div>
                  <div className="text-2xl font-bold text-slate-800">{outOfStockCount}</div>
                  <p className="text-xs text-slate-500 mt-1">Out of Stock</p>
                </div>
              </div>
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
                  placeholder="Search by patient or RX ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: 'all', label: 'All Status' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'in-progress', label: 'In Progress' },
                  { value: 'ready', label: 'Ready' },
                  { value: 'dispensed', label: 'Dispensed' },
                ]}
                className="w-48"
              />
            </div>
          </CardContent>
        </Card>

        {/* Dispensing Queue */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dispensing Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>RX ID</TableHead>
                  <TableHead>Patient/Owner</TableHead>
                  <TableHead>Medication</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Dosage</TableHead>
                  <TableHead>Prescribed By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQueue.map((item) => (
                  <TableRow 
                    key={item.id} 
                    className={!item.stockAvailable ? 'bg-red-50' : item.priority === 'urgent' ? 'bg-orange-50' : ''}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {!item.stockAvailable && <AlertTriangle className="h-4 w-4 text-red-600" />}
                        {item.id}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.patient}</div>
                        <div className="text-sm text-slate-500">{item.owner}</div>
                      </div>
                    </TableCell>
                    <TableCell>{item.prescription}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell className="text-sm">{item.dosage}</TableCell>
                    <TableCell>{item.prescribedBy}</TableCell>
                    <TableCell>{item.prescribedDate}</TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(item.priority)}>
                        {item.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {item.stockAvailable ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Available
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Out of Stock
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        {item.status === 'pending' && item.stockAvailable && (
                          <Button variant="ghost" size="sm" className="text-blue-600">Start</Button>
                        )}
                        {item.status === 'in-progress' && (
                          <Button variant="ghost" size="sm" className="text-green-600">Complete</Button>
                        )}
                        {item.status === 'ready' && (
                          <Button variant="ghost" size="sm" className="text-slate-600">Dispense</Button>
                        )}
                        <Button variant="ghost" size="sm">View</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredQueue.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                No prescriptions found matching your search criteria
              </div>
            )}
          </CardContent>
        </Card>

        {/* Out of Stock Alert */}
        {outOfStockCount > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-red-800">
                <AlertTriangle className="h-5 w-5" />
                Stock Alert
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-red-700">
                {outOfStockCount} prescription{outOfStockCount !== 1 ? 's' : ''} cannot be filled due to stock shortage.
                Please order medications or contact the prescribing veterinarian for alternatives.
              </p>
            </CardContent>
          </Card>
        )}
      </VStack>
    </ContentArea>
  );
}
