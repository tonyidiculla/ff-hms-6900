'use client';

import React from 'react';
import { ContentArea, VStack } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';

export default function RosteringPage() {
  const [schedules, setSchedules] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedWeek, setSelectedWeek] = React.useState('current');
  const [activeTab, setActiveTab] = React.useState<'schedule' | 'shifts' | 'coverage'>('schedule');

  // Mock data for demonstration
  React.useEffect(() => {
    const mockSchedules = [
      {
        id: 1,
        employee_name: 'Dr. Sarah Johnson',
        employee_id: 'EMP001',
        department: 'Emergency',
        monday: 'Morning (8AM-4PM)',
        tuesday: 'Off',
        wednesday: 'Evening (4PM-12AM)',
        thursday: 'Morning (8AM-4PM)',
        friday: 'Off',
        saturday: 'Night (12AM-8AM)',
        sunday: 'Off',
        total_hours: 32,
      },
      {
        id: 2,
        employee_name: 'Dr. Michael Chen',
        employee_id: 'EMP002',
        department: 'Surgery',
        monday: 'Morning (8AM-4PM)',
        tuesday: 'Morning (8AM-4PM)',
        wednesday: 'Off',
        thursday: 'Evening (4PM-12AM)',
        friday: 'Morning (8AM-4PM)',
        saturday: 'Off',
        sunday: 'Off',
        total_hours: 32,
      },
      {
        id: 3,
        employee_name: 'Nurse Emily Davis',
        employee_id: 'EMP003',
        department: 'ICU',
        monday: 'Night (12AM-8AM)',
        tuesday: 'Night (12AM-8AM)',
        wednesday: 'Night (12AM-8AM)',
        thursday: 'Off',
        friday: 'Off',
        saturday: 'Night (12AM-8AM)',
        sunday: 'Night (12AM-8AM)',
        total_hours: 40,
      },
    ];
    setSchedules(mockSchedules);
  }, [selectedWeek]);

  const getShiftColor = (shift: string) => {
    if (shift === 'Off') return 'bg-gray-100 text-gray-800';
    if (shift.includes('Morning')) return 'bg-blue-100 text-blue-800';
    if (shift.includes('Evening')) return 'bg-orange-100 text-orange-800';
    if (shift.includes('Night')) return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  const totalStaff = schedules.length;
  const onDutyToday = schedules.filter(s => s.monday !== 'Off').length;
  const avgHoursPerWeek = schedules.length > 0 
    ? (schedules.reduce((sum, s) => sum + s.total_hours, 0) / schedules.length).toFixed(1)
    : 0;

  return (
    <ContentArea>
      <VStack size="sm">
        <div className="flex items-baseline gap-3">
          <h1 className="text-3xl font-bold text-slate-800">Staff Rostering</h1>
          <p className="text-sm text-slate-500">Manage staff schedules and shift assignments</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-blue-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Total Staff</p>
                  <p className="text-2xl font-bold text-slate-800">{totalStaff}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-blue-600 text-xl">👥</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-green-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">On Duty Today</p>
                  <p className="text-2xl font-bold text-slate-800">{onDutyToday}</p>
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
                  <p className="text-xs text-slate-500 mt-2">Avg Hours/Week</p>
                  <p className="text-2xl font-bold text-slate-800">{avgHoursPerWeek}</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-purple-600 text-xl">⏱️</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-yellow-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Open Shifts</p>
                  <p className="text-2xl font-bold text-slate-800">5</p>
                </div>
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-yellow-600 text-xl">📋</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2 border-b-2">
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'schedule'
                  ? 'text-blue-600 border-b-2 border-blue-600 -mb-0.5'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Weekly Schedule
            </button>
            <button
              onClick={() => setActiveTab('shifts')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'shifts'
                  ? 'text-blue-600 border-b-2 border-blue-600 -mb-0.5'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Shift Templates
            </button>
            <button
              onClick={() => setActiveTab('coverage')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'coverage'
                  ? 'text-blue-600 border-b-2 border-blue-600 -mb-0.5'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Coverage Analysis
            </button>
          </div>
          <div className="flex gap-2">
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              className="px-3 py-2 border-2 rounded-lg text-sm"
            >
              <option value="previous">Previous Week</option>
              <option value="current">Current Week</option>
              <option value="next">Next Week</option>
            </select>
          </div>
        </div>

        {activeTab === 'schedule' && (
          <Card className="border-2">
            <CardHeader className="border-b-2 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Weekly Schedule</CardTitle>
                  <p className="text-sm text-slate-500 mt-1">November 4-10, 2025</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">Export</Button>
                  <Button variant="outline">Print</Button>
                  <Button variant="primary">Create Schedule</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-sm text-slate-500">Loading schedule...</p>
                </div>
              ) : schedules.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <p>No schedules found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="uppercase text-xs sticky left-0 bg-white z-10">Employee</TableHead>
                      <TableHead className="uppercase text-xs">Mon</TableHead>
                      <TableHead className="uppercase text-xs">Tue</TableHead>
                      <TableHead className="uppercase text-xs">Wed</TableHead>
                      <TableHead className="uppercase text-xs">Thu</TableHead>
                      <TableHead className="uppercase text-xs">Fri</TableHead>
                      <TableHead className="uppercase text-xs">Sat</TableHead>
                      <TableHead className="uppercase text-xs">Sun</TableHead>
                      <TableHead className="uppercase text-xs">Total Hours</TableHead>
                      <TableHead className="uppercase text-xs">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schedules.map((schedule) => (
                      <TableRow key={schedule.id} className="hover:bg-slate-50">
                        <TableCell className="sticky left-0 bg-white">
                          <div>
                            <p className="font-medium text-slate-800">{schedule.employee_name}</p>
                            <p className="text-sm text-slate-500">{schedule.department}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getShiftColor(schedule.monday)} size="sm">
                            {schedule.monday}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getShiftColor(schedule.tuesday)} size="sm">
                            {schedule.tuesday}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getShiftColor(schedule.wednesday)} size="sm">
                            {schedule.wednesday}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getShiftColor(schedule.thursday)} size="sm">
                            {schedule.thursday}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getShiftColor(schedule.friday)} size="sm">
                            {schedule.friday}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getShiftColor(schedule.saturday)} size="sm">
                            {schedule.saturday}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getShiftColor(schedule.sunday)} size="sm">
                            {schedule.sunday}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm font-medium text-slate-800">
                          {schedule.total_hours}h
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Edit</Button>
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

        {activeTab === 'shifts' && (
          <Card className="border-2">
            <CardHeader className="border-b-2 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Shift Templates</CardTitle>
                  <p className="text-sm text-slate-500 mt-1">Predefined shift patterns</p>
                </div>
                <Button variant="primary">Create Template</Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="uppercase text-xs">Shift Name</TableHead>
                    <TableHead className="uppercase text-xs">Start Time</TableHead>
                    <TableHead className="uppercase text-xs">End Time</TableHead>
                    <TableHead className="uppercase text-xs">Duration</TableHead>
                    <TableHead className="uppercase text-xs">Break</TableHead>
                    <TableHead className="uppercase text-xs">Type</TableHead>
                    <TableHead className="uppercase text-xs">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="hover:bg-slate-50">
                    <TableCell className="font-medium text-slate-800">Morning Shift</TableCell>
                    <TableCell className="text-sm text-slate-600">8:00 AM</TableCell>
                    <TableCell className="text-sm text-slate-600">4:00 PM</TableCell>
                    <TableCell className="text-sm text-slate-600">8 hours</TableCell>
                    <TableCell className="text-sm text-slate-600">1 hour</TableCell>
                    <TableCell>
                      <Badge className="bg-blue-100 text-blue-800">Day</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm">Delete</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-slate-50">
                    <TableCell className="font-medium text-slate-800">Evening Shift</TableCell>
                    <TableCell className="text-sm text-slate-600">4:00 PM</TableCell>
                    <TableCell className="text-sm text-slate-600">12:00 AM</TableCell>
                    <TableCell className="text-sm text-slate-600">8 hours</TableCell>
                    <TableCell className="text-sm text-slate-600">1 hour</TableCell>
                    <TableCell>
                      <Badge className="bg-orange-100 text-orange-800">Evening</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm">Delete</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-slate-50">
                    <TableCell className="font-medium text-slate-800">Night Shift</TableCell>
                    <TableCell className="text-sm text-slate-600">12:00 AM</TableCell>
                    <TableCell className="text-sm text-slate-600">8:00 AM</TableCell>
                    <TableCell className="text-sm text-slate-600">8 hours</TableCell>
                    <TableCell className="text-sm text-slate-600">1 hour</TableCell>
                    <TableCell>
                      <Badge className="bg-purple-100 text-purple-800">Night</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm">Delete</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {activeTab === 'coverage' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border-2">
              <CardHeader className="border-b-2 pb-4">
                <CardTitle>Department Coverage</CardTitle>
                <p className="text-sm text-slate-500 mt-1">Staff distribution by department</p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">Emergency</span>
                      <span className="text-sm text-slate-600">8/10 staff</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">ICU</span>
                      <span className="text-sm text-slate-600">5/8 staff</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '62.5%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">Surgery</span>
                      <span className="text-sm text-slate-600">6/6 staff</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">Pediatrics</span>
                      <span className="text-sm text-slate-600">3/6 staff</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '50%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader className="border-b-2 pb-4">
                <CardTitle>Shift Distribution</CardTitle>
                <p className="text-sm text-slate-500 mt-1">Staff by shift type</p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-800">Morning Shift</p>
                      <p className="text-sm text-slate-600">8:00 AM - 4:00 PM</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">12</p>
                      <p className="text-sm text-slate-600">staff</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-800">Evening Shift</p>
                      <p className="text-sm text-slate-600">4:00 PM - 12:00 AM</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-orange-600">8</p>
                      <p className="text-sm text-slate-600">staff</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-800">Night Shift</p>
                      <p className="text-sm text-slate-600">12:00 AM - 8:00 AM</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-purple-600">6</p>
                      <p className="text-sm text-slate-600">staff</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </VStack>
    </ContentArea>
  );
}
