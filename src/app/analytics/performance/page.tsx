'use client';

import React from 'react';
import { ContentArea, VStack } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';

type TabType = 'staff' | 'equipment' | 'operations' | 'departments';

export default function PerformanceAnalyticsPage() {
  const [activeTab, setActiveTab] = React.useState<TabType>('staff');
  const [dateRange, setDateRange] = React.useState('This Month');

  // Sample data - would come from API
  const staffPerformance = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      department: 'Cardiology',
      patientsServed: 142,
      avgConsultTime: 28,
      satisfactionScore: 4.8,
      utilizationRate: 92,
      status: 'excellent',
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      department: 'Emergency',
      patientsServed: 203,
      avgConsultTime: 15,
      satisfactionScore: 4.6,
      utilizationRate: 88,
      status: 'good',
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      department: 'Pediatrics',
      patientsServed: 167,
      avgConsultTime: 32,
      satisfactionScore: 4.9,
      utilizationRate: 85,
      status: 'excellent',
    },
    {
      id: 4,
      name: 'Dr. James Wilson',
      department: 'Orthopedics',
      patientsServed: 98,
      avgConsultTime: 35,
      satisfactionScore: 4.4,
      utilizationRate: 75,
      status: 'fair',
    },
  ];

  const equipmentMetrics = [
    {
      id: 1,
      name: 'MRI Scanner - Unit A',
      location: 'Radiology Wing 2',
      utilizationRate: 87,
      uptime: 98.5,
      avgSessionTime: 45,
      maintenanceStatus: 'Good',
      nextMaintenance: '2025-12-15',
      status: 'operational',
    },
    {
      id: 2,
      name: 'CT Scanner - Unit B',
      location: 'Radiology Wing 1',
      utilizationRate: 92,
      uptime: 99.2,
      avgSessionTime: 30,
      maintenanceStatus: 'Excellent',
      nextMaintenance: '2025-11-20',
      status: 'operational',
    },
    {
      id: 3,
      name: 'Ventilator - ICU-12',
      location: 'ICU Floor 3',
      utilizationRate: 65,
      uptime: 100,
      avgSessionTime: 480,
      maintenanceStatus: 'Good',
      nextMaintenance: '2025-12-01',
      status: 'operational',
    },
    {
      id: 4,
      name: 'X-Ray Machine - ER',
      location: 'Emergency Room',
      utilizationRate: 78,
      uptime: 95.8,
      avgSessionTime: 12,
      maintenanceStatus: 'Fair',
      nextMaintenance: '2025-11-10',
      status: 'maintenance-due',
    },
  ];

  const operationalMetrics = [
    {
      id: 1,
      metric: 'Average Patient Wait Time',
      current: 23,
      target: 20,
      unit: 'minutes',
      trend: 'up',
      variance: 15,
      status: 'warning',
    },
    {
      id: 2,
      metric: 'Bed Occupancy Rate',
      current: 82,
      target: 85,
      unit: '%',
      trend: 'down',
      variance: -3.5,
      status: 'good',
    },
    {
      id: 3,
      metric: 'Emergency Response Time',
      current: 4.2,
      target: 5.0,
      unit: 'minutes',
      trend: 'down',
      variance: -16,
      status: 'excellent',
    },
    {
      id: 4,
      metric: 'Patient Transfer Time',
      current: 12,
      target: 15,
      unit: 'minutes',
      trend: 'stable',
      variance: -20,
      status: 'excellent',
    },
    {
      id: 5,
      metric: 'Surgery Scheduling Efficiency',
      current: 88,
      target: 90,
      unit: '%',
      trend: 'up',
      variance: -2.2,
      status: 'good',
    },
  ];

  const departmentPerformance = [
    {
      id: 1,
      name: 'Emergency Department',
      patientsServed: 1247,
      avgWaitTime: 18,
      satisfactionScore: 4.2,
      staffUtilization: 91,
      revenuePerPatient: 485,
      status: 'excellent',
    },
    {
      id: 2,
      name: 'Cardiology',
      patientsServed: 534,
      avgWaitTime: 28,
      satisfactionScore: 4.7,
      staffUtilization: 86,
      revenuePerPatient: 1240,
      status: 'excellent',
    },
    {
      id: 3,
      name: 'Orthopedics',
      patientsServed: 423,
      avgWaitTime: 35,
      satisfactionScore: 4.5,
      staffUtilization: 78,
      revenuePerPatient: 1680,
      status: 'good',
    },
    {
      id: 4,
      name: 'Pediatrics',
      patientsServed: 678,
      avgWaitTime: 22,
      satisfactionScore: 4.8,
      staffUtilization: 82,
      revenuePerPatient: 320,
      status: 'excellent',
    },
  ];

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      excellent: 'bg-green-100 text-green-800',
      good: 'bg-blue-100 text-blue-800',
      fair: 'bg-yellow-100 text-yellow-800',
      warning: 'bg-orange-100 text-orange-800',
      operational: 'bg-green-100 text-green-800',
      'maintenance-due': 'bg-yellow-100 text-yellow-800',
    };
    return colors[status] || colors.good;
  };

  return (
    <ContentArea>
      <VStack size="sm">
        <div className="flex items-baseline gap-3">
          <h1 className="text-3xl font-bold text-slate-800">Performance Analytics</h1>
          <p className="text-sm text-slate-500">Staff productivity, equipment, and operational metrics</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-blue-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Avg Staff Utilization</p>
                  <p className="text-2xl font-bold text-slate-800">86%</p>
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
                  <p className="text-xs text-slate-500 mt-2">Equipment Uptime</p>
                  <p className="text-2xl font-bold text-slate-800">98.2%</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-green-600 text-xl">⚙️</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-purple-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Patient Satisfaction</p>
                  <p className="text-2xl font-bold text-slate-800">4.6/5</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-purple-600 text-xl">⭐</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-orange-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Avg Wait Time</p>
                  <p className="text-2xl font-bold text-slate-800">23 min</p>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-orange-600 text-xl">⏱️</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('staff')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'staff'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Staff Performance
            </button>
            <button
              onClick={() => setActiveTab('equipment')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'equipment'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Equipment Utilization
            </button>
            <button
              onClick={() => setActiveTab('operations')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'operations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Operational Metrics
            </button>
            <button
              onClick={() => setActiveTab('departments')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'departments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Department Performance
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'staff' && (
          <Card className="border-2 shadow-md">
            <CardHeader className="border-b-2 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Staff Performance Analysis</CardTitle>
                <div className="flex gap-2">
                  <select 
                    value={dateRange} 
                    onChange={(e) => setDateRange(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  >
                    <option>This Week</option>
                    <option>This Month</option>
                    <option>This Quarter</option>
                    <option>This Year</option>
                  </select>
                  <Button>Export Report</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="py-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff Member</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead className="text-right">Patients Served</TableHead>
                    <TableHead className="text-right">Avg Time (min)</TableHead>
                    <TableHead className="text-right">Satisfaction</TableHead>
                    <TableHead className="text-right">Utilization</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staffPerformance.map((staff) => (
                    <TableRow key={staff.id}>
                      <TableCell className="font-medium">{staff.name}</TableCell>
                      <TableCell>{staff.department}</TableCell>
                      <TableCell className="text-right">{staff.patientsServed}</TableCell>
                      <TableCell className="text-right">{staff.avgConsultTime}</TableCell>
                      <TableCell className="text-right">{staff.satisfactionScore}/5</TableCell>
                      <TableCell className="text-right">{staff.utilizationRate}%</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(staff.status)}>
                          {staff.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {activeTab === 'equipment' && (
          <Card className="border-2 shadow-md">
            <CardHeader className="border-b-2 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Equipment Utilization & Status</CardTitle>
                <div className="flex gap-2">
                  <select 
                    value={dateRange} 
                    onChange={(e) => setDateRange(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  >
                    <option>This Week</option>
                    <option>This Month</option>
                    <option>This Quarter</option>
                    <option>This Year</option>
                  </select>
                  <Button>Export Report</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="py-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Equipment</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Utilization</TableHead>
                    <TableHead className="text-right">Uptime</TableHead>
                    <TableHead className="text-right">Avg Session (min)</TableHead>
                    <TableHead>Maintenance</TableHead>
                    <TableHead>Next Service</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {equipmentMetrics.map((equipment) => (
                    <TableRow key={equipment.id}>
                      <TableCell className="font-medium">{equipment.name}</TableCell>
                      <TableCell>{equipment.location}</TableCell>
                      <TableCell className="text-right">{equipment.utilizationRate}%</TableCell>
                      <TableCell className="text-right">{equipment.uptime}%</TableCell>
                      <TableCell className="text-right">{equipment.avgSessionTime}</TableCell>
                      <TableCell>{equipment.maintenanceStatus}</TableCell>
                      <TableCell>{equipment.nextMaintenance}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(equipment.status)}>
                          {equipment.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {activeTab === 'operations' && (
          <Card className="border-2 shadow-md">
            <CardHeader className="border-b-2 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Key Operational Metrics</CardTitle>
                <div className="flex gap-2">
                  <select 
                    value={dateRange} 
                    onChange={(e) => setDateRange(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  >
                    <option>This Week</option>
                    <option>This Month</option>
                    <option>This Quarter</option>
                    <option>This Year</option>
                  </select>
                  <Button>Export Report</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="py-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Metric</TableHead>
                    <TableHead className="text-right">Current</TableHead>
                    <TableHead className="text-right">Target</TableHead>
                    <TableHead className="text-right">Variance</TableHead>
                    <TableHead>Trend</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {operationalMetrics.map((metric) => (
                    <TableRow key={metric.id}>
                      <TableCell className="font-medium">{metric.metric}</TableCell>
                      <TableCell className="text-right">{metric.current} {metric.unit}</TableCell>
                      <TableCell className="text-right">{metric.target} {metric.unit}</TableCell>
                      <TableCell className="text-right">
                        <span className={metric.variance > 0 ? 'text-red-600' : 'text-green-600'}>
                          {metric.variance > 0 ? '+' : ''}{metric.variance}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xl">
                          {metric.trend === 'up' ? '↗️' : metric.trend === 'down' ? '↘️' : '→'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(metric.status)}>
                          {metric.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {activeTab === 'departments' && (
          <Card className="border-2 shadow-md">
            <CardHeader className="border-b-2 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Department Performance Overview</CardTitle>
                <div className="flex gap-2">
                  <select 
                    value={dateRange} 
                    onChange={(e) => setDateRange(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  >
                    <option>This Week</option>
                    <option>This Month</option>
                    <option>This Quarter</option>
                    <option>This Year</option>
                  </select>
                  <Button>Export Report</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="py-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department</TableHead>
                    <TableHead className="text-right">Patients</TableHead>
                    <TableHead className="text-right">Wait Time (min)</TableHead>
                    <TableHead className="text-right">Satisfaction</TableHead>
                    <TableHead className="text-right">Staff Util.</TableHead>
                    <TableHead className="text-right">Rev/Patient</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departmentPerformance.map((dept) => (
                    <TableRow key={dept.id}>
                      <TableCell className="font-medium">{dept.name}</TableCell>
                      <TableCell className="text-right">{dept.patientsServed}</TableCell>
                      <TableCell className="text-right">{dept.avgWaitTime}</TableCell>
                      <TableCell className="text-right">{dept.satisfactionScore}/5</TableCell>
                      <TableCell className="text-right">{dept.staffUtilization}%</TableCell>
                      <TableCell className="text-right">${dept.revenuePerPatient}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(dept.status)}>
                          {dept.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </VStack>
    </ContentArea>
  );
}
