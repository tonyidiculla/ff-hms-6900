'use client';

import React from 'react';
import { ContentArea, VStack } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Search, ArrowRightLeft, CheckCircle, Clock } from 'lucide-react';

export default function PatientTransfersPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');

  // Mock transfer data
  const transfers = [
    {
      id: 'TR-001',
      patient: 'Max',
      owner: 'John Smith',
      fromWard: 'ICU',
      fromBed: 'B101',
      toWard: 'General',
      toBed: 'B205',
      reason: 'Condition improved',
      requestedBy: 'Dr. Smith',
      requestedDate: '2024-11-09 10:00',
      status: 'pending',
      priority: 'normal'
    },
    {
      id: 'TR-002',
      patient: 'Luna',
      owner: 'Emily Davis',
      fromWard: 'General',
      fromBed: 'B204',
      toWard: 'ICU',
      toBed: 'B102',
      reason: 'Condition worsened',
      requestedBy: 'Dr. Johnson',
      requestedDate: '2024-11-09 08:30',
      status: 'in-progress',
      priority: 'urgent'
    },
    {
      id: 'TR-003',
      patient: 'Whiskers',
      owner: 'Sarah Johnson',
      fromWard: 'Isolation',
      fromBed: 'B301',
      toWard: 'General',
      toBed: 'B201',
      reason: 'No longer contagious',
      requestedBy: 'Dr. Williams',
      requestedDate: '2024-11-08 15:00',
      status: 'completed',
      priority: 'normal'
    },
    {
      id: 'TR-004',
      patient: 'Rocky',
      owner: 'David Lee',
      fromWard: 'General',
      fromBed: 'B203',
      toWard: 'Isolation',
      toBed: 'B302',
      reason: 'Suspected infection',
      requestedBy: 'Dr. Smith',
      requestedDate: '2024-11-09 11:45',
      status: 'pending',
      priority: 'urgent'
    },
  ];

  const filteredTransfers = transfers.filter(transfer => {
    const matchesSearch = transfer.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transfer.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transfer.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transfer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const pendingCount = transfers.filter(t => t.status === 'pending').length;
  const inProgressCount = transfers.filter(t => t.status === 'in-progress').length;
  const completedToday = transfers.filter(t => t.status === 'completed').length;
  const urgentCount = transfers.filter(t => t.priority === 'urgent' && t.status !== 'completed').length;

  return (
    <ContentArea>
      <VStack size="sm">
        <div className="flex items-baseline gap-3">
          <h1 className="text-3xl font-bold text-slate-800">Patient Transfers</h1>
          <p className="text-sm text-slate-500">Manage inter-ward patient transfers</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-yellow-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div>
                  <div className="text-2xl font-bold text-slate-800">{pendingCount}</div>
                  <p className="text-xs text-slate-500 mt-1">Pending Transfers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-blue-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center gap-3">
                <ArrowRightLeft className="h-8 w-8 text-blue-600" />
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
                  <div className="text-2xl font-bold text-slate-800">{completedToday}</div>
                  <p className="text-xs text-slate-500 mt-1">Completed Today</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-red-500">
            <CardContent className="py-3 px-4">
              <div className="text-2xl font-bold text-slate-800">{urgentCount}</div>
              <p className="text-xs text-slate-500 mt-1">Urgent Transfers</p>
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
                    placeholder="Search by patient or transfer ID..."
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
                    { value: 'completed', label: 'Completed' },
                    { value: 'cancelled', label: 'Cancelled' },
                  ]}
                  className="w-48"
                />
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <ArrowRightLeft className="h-4 w-4 mr-2" />
                Request Transfer
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transfers Table */}
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transfer ID</TableHead>
                  <TableHead>Patient/Owner</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransfers.map((transfer) => (
                  <TableRow key={transfer.id} className={transfer.priority === 'urgent' ? 'bg-red-50' : ''}>
                    <TableCell className="font-medium">{transfer.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{transfer.patient}</div>
                        <div className="text-sm text-slate-500">{transfer.owner}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{transfer.fromWard}</div>
                        <div className="text-slate-500">{transfer.fromBed}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{transfer.toWard}</div>
                        <div className="text-slate-500">{transfer.toBed}</div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <span className="text-sm text-slate-600">{transfer.reason}</span>
                    </TableCell>
                    <TableCell>{transfer.requestedBy}</TableCell>
                    <TableCell className="text-sm">{transfer.requestedDate}</TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(transfer.priority)}>
                        {transfer.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(transfer.status)}>
                        {transfer.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        {transfer.status === 'pending' && (
                          <>
                            <Button variant="ghost" size="sm" className="text-green-600">Approve</Button>
                            <Button variant="ghost" size="sm" className="text-red-600">Cancel</Button>
                          </>
                        )}
                        {transfer.status === 'in-progress' && (
                          <Button variant="ghost" size="sm" className="text-blue-600">Complete</Button>
                        )}
                        {transfer.status === 'completed' && (
                          <Button variant="ghost" size="sm">View</Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredTransfers.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                No transfers found matching your search criteria
              </div>
            )}
          </CardContent>
        </Card>
      </VStack>
    </ContentArea>
  );
}
