'use client';

import React from 'react';
import { ContentArea, VStack } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { hrApiClient } from '@/lib/api/hr-client';
import { CheckCircle, XCircle, TrendingUp, Calendar } from 'lucide-react';

export default function AttendanceLeavePage() {
  const [attendance, setAttendance] = React.useState<any[]>([]);
  const [leaveRequests, setLeaveRequests] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<'attendance' | 'leave'>('attendance');

  React.useEffect(() => {
    fetchAttendance();
    fetchLeaveRequests();
  }, []);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const response = await hrApiClient.fetchAttendance({});
      if (response.error) {
        setError(response.error);
      } else {
        setAttendance(response.data || []);
      }
    } catch (err) {
      setError('Failed to fetch attendance records');
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaveRequests = async () => {
    try {
      const response = await hrApiClient.fetchLeaveRequests({});
      if (!response.error) {
        setLeaveRequests(response.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch leave requests');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'present':
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'absent':
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'late':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const presentCount = attendance.filter(a => a.status?.toLowerCase() === 'present').length;
  const absentCount = attendance.filter(a => a.status?.toLowerCase() === 'absent').length;
  const pendingLeave = leaveRequests.filter(l => l.status?.toLowerCase() === 'pending').length;
  const attendanceRate = attendance.length > 0 ? ((presentCount / attendance.length) * 100).toFixed(1) : '0';

  return (
    <ContentArea>
      <VStack size="sm">
        <div className="flex items-baseline gap-3">
          <h1 className="text-3xl font-bold text-slate-800">Attendance & Leave</h1>
          <p className="text-sm text-slate-500">Track attendance and manage leave requests</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-green-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Present Today</p>
                  <p className="text-2xl font-bold text-slate-800">{presentCount}</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-red-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Absent Today</p>
                  <p className="text-2xl font-bold text-slate-800">{absentCount}</p>
                </div>
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-purple-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Attendance Rate</p>
                  <p className="text-2xl font-bold text-slate-800">{attendanceRate}%</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-yellow-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Pending Leave</p>
                  <p className="text-2xl font-bold text-slate-800">{pendingLeave}</p>
                </div>
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center shrink-0">
                  <Calendar className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-2 border-b-2">
          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'attendance'
                ? 'text-blue-600 border-b-2 border-blue-600 -mb-0.5'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            Attendance Records
          </button>
          <button
            onClick={() => setActiveTab('leave')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'leave'
                ? 'text-blue-600 border-b-2 border-blue-600 -mb-0.5'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            Leave Requests
          </button>
        </div>

        {activeTab === 'attendance' ? (
          <Card className="border-2">
            <CardHeader className="border-b-2 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Attendance Records</CardTitle>
                  <p className="text-sm text-slate-500 mt-1">{attendance.length} records today</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">Export</Button>
                  <Button variant="primary">Mark Attendance</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-sm text-slate-500">Loading attendance...</p>
                </div>
              ) : error ? (
                <div className="p-8 text-center">
                  <p className="text-red-600 mb-4">{error}</p>
                  <Button onClick={fetchAttendance} variant="primary">Retry</Button>
                </div>
              ) : attendance.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <p>No attendance records found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="uppercase text-xs">Employee</TableHead>
                      <TableHead className="uppercase text-xs">Date</TableHead>
                      <TableHead className="uppercase text-xs">Clock In</TableHead>
                      <TableHead className="uppercase text-xs">Clock Out</TableHead>
                      <TableHead className="uppercase text-xs">Hours</TableHead>
                      <TableHead className="uppercase text-xs">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendance.map((record) => (
                      <TableRow key={record.id} className="hover:bg-slate-50">
                        <TableCell>
                          <div>
                            <p className="font-medium text-slate-800">{record.employee_name}</p>
                            <p className="text-sm text-slate-500">{record.employee_id}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {record.date ? new Date(record.date).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {record.clock_in || '-'}
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {record.clock_out || '-'}
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {record.hours || '-'}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(record.status)}>
                            {record.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="border-2">
            <CardHeader className="border-b-2 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Leave Requests</CardTitle>
                  <p className="text-sm text-slate-500 mt-1">{leaveRequests.length} total requests</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">Export</Button>
                  <Button variant="primary">New Request</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {leaveRequests.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <p>No leave requests found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="uppercase text-xs">Employee</TableHead>
                      <TableHead className="uppercase text-xs">Leave Type</TableHead>
                      <TableHead className="uppercase text-xs">Start Date</TableHead>
                      <TableHead className="uppercase text-xs">End Date</TableHead>
                      <TableHead className="uppercase text-xs">Days</TableHead>
                      <TableHead className="uppercase text-xs">Status</TableHead>
                      <TableHead className="uppercase text-xs">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaveRequests.map((request) => (
                      <TableRow key={request.id} className="hover:bg-slate-50">
                        <TableCell>
                          <div>
                            <p className="font-medium text-slate-800">{request.employee_name}</p>
                            <p className="text-sm text-slate-500">{request.employee_id}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {request.leave_type || 'Annual'}
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {request.start_date ? new Date(request.start_date).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {request.end_date ? new Date(request.end_date).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {request.days || '-'}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(request.status)}>
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {request.status?.toLowerCase() === 'pending' ? (
                              <>
                                <Button variant="outline" size="sm">Approve</Button>
                                <Button variant="outline" size="sm">Reject</Button>
                              </>
                            ) : (
                              <Button variant="outline" size="sm">View</Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}
      </VStack>
    </ContentArea>
  );
}
