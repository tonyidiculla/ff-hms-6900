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

export default function ProcurementPage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  // Sample data
  const procurementRequests = [
    {
      id: 1,
      requestId: 'PR-2024-001',
      requestedBy: 'Dr. Sarah Johnson',
      department: 'Surgery',
      itemDescription: 'Surgical Instruments Set',
      quantity: 5,
      estimatedCost: 12500,
      urgency: 'High',
      dateRequested: '2024-01-15',
      status: 'Pending Approval'
    },
    {
      id: 2,
      requestId: 'PR-2024-002',
      requestedBy: 'Dr. Michael Chen',
      department: 'Laboratory',
      itemDescription: 'Lab Testing Kits',
      quantity: 50,
      estimatedCost: 8500,
      urgency: 'Medium',
      dateRequested: '2024-01-16',
      status: 'Approved'
    },
    {
      id: 3,
      requestId: 'PR-2024-003',
      requestedBy: 'Emily Davis',
      department: 'Pharmacy',
      itemDescription: 'Pharmaceutical Supplies',
      quantity: 100,
      estimatedCost: 15000,
      urgency: 'Low',
      dateRequested: '2024-01-18',
      status: 'In Review'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Procurement request submitted');
    setIsModalOpen(false);
  };

  return (
    <ContentArea>
      <VStack size="sm">
        {/* Page Title */}
        <div className="flex items-baseline gap-3">
          <h1 className="text-3xl font-bold text-slate-800">Procurement Requests</h1>
          <p className="text-sm text-slate-500">Manage procurement requests and approvals</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-blue-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Total Requests</p>
                  <p className="text-2xl font-bold text-slate-800">{procurementRequests.length}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-blue-600 text-xl">📝</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-yellow-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Pending Approval</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {procurementRequests.filter(r => r.status === 'Pending Approval').length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-yellow-600 text-xl">⏳</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-green-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Approved</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {procurementRequests.filter(r => r.status === 'Approved').length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-green-600 text-xl">✓</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-purple-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">In Review</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {procurementRequests.filter(r => r.status === 'In Review').length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-purple-600 text-xl">👀</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <Card className="border-2">
          <CardContent className="py-3 px-4">
            <Input
              placeholder="Search procurement requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </CardContent>
        </Card>

        {/* Procurement Requests Table */}
        <Card className="border-2">
          <CardHeader className="border-b-2 pb-4">
            <div className="flex justify-between items-center">
              <CardTitle>Procurement Requests ({procurementRequests.length})</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Export</Button>
                <Button size="sm" onClick={() => setIsModalOpen(true)}>+ New Request</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs uppercase tracking-wide">Request ID</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Requested By</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Department</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Item Description</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide text-right">Quantity</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide text-right">Est. Cost</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Urgency</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Date</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Status</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {procurementRequests.map((request) => (
                  <TableRow key={request.id} className="hover:bg-slate-50 border-b last:border-b-0">
                    <TableCell className="font-mono text-sm font-medium">{request.requestId}</TableCell>
                    <TableCell className="font-medium">{request.requestedBy}</TableCell>
                    <TableCell>{request.department}</TableCell>
                    <TableCell>{request.itemDescription}</TableCell>
                    <TableCell className="text-right">{request.quantity}</TableCell>
                    <TableCell className="text-right font-bold">${request.estimatedCost.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={`inline-flex px-2 py-1 rounded-full text-xs ${
                        request.urgency === 'High' ? 'bg-red-100 text-red-800' :
                        request.urgency === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {request.urgency}
                      </Badge>
                    </TableCell>
                    <TableCell>{request.dateRequested}</TableCell>
                    <TableCell>
                      <Badge className={`inline-flex px-2 py-1 rounded-full text-xs ${
                        request.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        request.status === 'Pending Approval' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <button className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1">View</button>
                      {request.status === 'Pending Approval' && (
                        <>
                          <button className="text-green-600 hover:text-green-800 text-sm px-2 py-1">Approve</button>
                          <button className="text-red-600 hover:text-red-800 text-sm px-2 py-1">Reject</button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Create Procurement Request Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Procurement Request" size="lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="requestedBy" label="Requested By" placeholder="Dr. Sarah Johnson" required />
              <Select
                name="department"
                label="Department"
                options={[
                  { value: 'surgery', label: 'Surgery' },
                  { value: 'laboratory', label: 'Laboratory' },
                  { value: 'pharmacy', label: 'Pharmacy' },
                  { value: 'radiology', label: 'Radiology' },
                ]}
                required
              />
              <Input name="itemDescription" label="Item Description" placeholder="Surgical Instruments Set" required className="md:col-span-2" />
              <Input name="quantity" label="Quantity" type="number" required />
              <Input name="estimatedCost" label="Estimated Cost" type="number" step="0.01" required />
              <Select
                name="urgency"
                label="Urgency Level"
                options={[
                  { value: 'low', label: 'Low' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'high', label: 'High' },
                ]}
                required
              />
              <Input name="dateNeeded" label="Date Needed By" type="date" required />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Submit Request</Button>
            </div>
          </form>
        </Modal>
      </VStack>
    </ContentArea>
  );
}
