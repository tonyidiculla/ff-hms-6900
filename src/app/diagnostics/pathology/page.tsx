'use client';

import React from 'react';
import { ContentArea, VStack } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Search, FileText, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export default function PathologyReportsPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');

  // Mock pathology data
  const pathologyReports = [
    {
      id: 'PATH-001',
      patient: 'Max',
      owner: 'John Smith',
      testType: 'Blood Panel',
      specimen: 'Blood',
      collectedDate: '2024-11-08',
      receivedDate: '2024-11-08',
      reportedDate: '2024-11-09',
      status: 'completed',
      priority: 'routine',
      pathologist: 'Dr. Chen',
      findings: 'Within normal limits',
      abnormal: false
    },
    {
      id: 'PATH-002',
      patient: 'Luna',
      owner: 'Emily Davis',
      testType: 'Biopsy',
      specimen: 'Tissue',
      collectedDate: '2024-11-07',
      receivedDate: '2024-11-07',
      reportedDate: null,
      status: 'in-progress',
      priority: 'urgent',
      pathologist: 'Dr. Patel',
      findings: 'Pending analysis',
      abnormal: null
    },
    {
      id: 'PATH-003',
      patient: 'Whiskers',
      owner: 'Sarah Johnson',
      testType: 'Urinalysis',
      specimen: 'Urine',
      collectedDate: '2024-11-09',
      receivedDate: '2024-11-09',
      reportedDate: '2024-11-09',
      status: 'completed',
      priority: 'routine',
      pathologist: 'Dr. Lee',
      findings: 'Mild crystalluria detected',
      abnormal: true
    },
    {
      id: 'PATH-004',
      patient: 'Buddy',
      owner: 'Mike Brown',
      testType: 'Cytology',
      specimen: 'Fine Needle Aspirate',
      collectedDate: '2024-11-08',
      receivedDate: '2024-11-08',
      reportedDate: null,
      status: 'pending',
      priority: 'high',
      pathologist: null,
      findings: 'Awaiting processing',
      abnormal: null
    },
  ];

  const filteredReports = pathologyReports.filter(report => {
    const matchesSearch = report.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'reviewed': return 'bg-purple-100 text-purple-800';
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

  const totalReports = pathologyReports.length;
  const pendingCount = pathologyReports.filter(r => r.status === 'pending').length;
  const inProgressCount = pathologyReports.filter(r => r.status === 'in-progress').length;
  const abnormalCount = pathologyReports.filter(r => r.abnormal === true).length;

  return (
    <ContentArea>
      <VStack size="sm">
        <div className="flex items-baseline gap-3">
          <h1 className="text-3xl font-bold text-slate-800">Pathology Reports</h1>
          <p className="text-sm text-slate-500">Laboratory pathology and specimen analysis</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-blue-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold text-slate-800">{totalReports}</div>
                  <p className="text-xs text-slate-500 mt-1">Total Reports</p>
                </div>
              </div>
            </CardContent>
          </Card>
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
              <div className="text-2xl font-bold text-slate-800">{inProgressCount}</div>
              <p className="text-xs text-slate-500 mt-1">In Progress</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-red-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-8 w-8 text-red-600" />
                <div>
                  <div className="text-2xl font-bold text-slate-800">{abnormalCount}</div>
                  <p className="text-xs text-slate-500 mt-1">Abnormal Findings</p>
                </div>
              </div>
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
                    placeholder="Search by patient or report ID..."
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
                    { value: 'reviewed', label: 'Reviewed' },
                  ]}
                  className="w-48"
                />
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <FileText className="h-4 w-4 mr-2" />
                New Report
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Reports Table */}
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report ID</TableHead>
                  <TableHead>Patient/Owner</TableHead>
                  <TableHead>Test Type</TableHead>
                  <TableHead>Specimen</TableHead>
                  <TableHead>Collected</TableHead>
                  <TableHead>Reported</TableHead>
                  <TableHead>Pathologist</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Findings</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id} className={report.abnormal ? 'bg-red-50' : ''}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {report.abnormal && <AlertCircle className="h-4 w-4 text-red-600" />}
                        {report.id}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{report.patient}</div>
                        <div className="text-sm text-slate-500">{report.owner}</div>
                      </div>
                    </TableCell>
                    <TableCell>{report.testType}</TableCell>
                    <TableCell className="text-sm text-slate-600">{report.specimen}</TableCell>
                    <TableCell>{report.collectedDate}</TableCell>
                    <TableCell>{report.reportedDate || '-'}</TableCell>
                    <TableCell>{report.pathologist || '-'}</TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(report.priority)}>
                        {report.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="flex items-center gap-2">
                        {report.abnormal === true && (
                          <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                        )}
                        {report.abnormal === false && (
                          <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                        )}
                        <span className="text-sm text-slate-600">{report.findings}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        {report.status === 'completed' && (
                          <Button variant="ghost" size="sm">View Report</Button>
                        )}
                        {report.status === 'in-progress' && (
                          <Button variant="ghost" size="sm" className="text-blue-600">Update</Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredReports.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                No pathology reports found matching your search criteria
              </div>
            )}
          </CardContent>
        </Card>

        {/* Abnormal Findings Alert */}
        {abnormalCount > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-red-800">
                <AlertCircle className="h-5 w-5" />
                Critical Findings Alert
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-red-700">
                {abnormalCount} report{abnormalCount !== 1 ? 's' : ''} with abnormal findings detected.
                Please review and notify the attending veterinarian immediately.
              </p>
            </CardContent>
          </Card>
        )}
      </VStack>
    </ContentArea>
  );
}
