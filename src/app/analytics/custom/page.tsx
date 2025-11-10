'use client';

import React from 'react';
import { ContentArea, VStack } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

type TabType = 'library' | 'scheduled' | 'custom';

export default function CustomReportsPage() {
  const [activeTab, setActiveTab] = React.useState<TabType>('library');
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = React.useState(false);

  const reportLibrary = [
    {
      id: 1,
      name: 'Monthly Financial Summary',
      category: 'Financial',
      description: 'Comprehensive P&L, Balance Sheet, and Cash Flow',
      dataSource: 'Finance Module',
      lastGenerated: '2025-01-30',
      generatedBy: 'System',
      format: 'PDF, Excel',
      isPublic: true,
    },
    {
      id: 2,
      name: 'Patient Demographics Report',
      category: 'Clinical',
      description: 'Age, gender, insurance breakdown by department',
      dataSource: 'Patient Registry',
      lastGenerated: '2025-01-29',
      generatedBy: 'Dr. Johnson',
      format: 'Excel',
      isPublic: false,
    },
    {
      id: 3,
      name: 'Staff Performance Metrics',
      category: 'HR',
      description: 'Productivity, satisfaction, and utilization',
      dataSource: 'HR System',
      lastGenerated: '2025-01-28',
      generatedBy: 'HR Manager',
      format: 'PDF',
      isPublic: false,
    },
    {
      id: 4,
      name: 'Equipment Utilization Analysis',
      category: 'Operations',
      description: 'Usage patterns, maintenance schedules',
      dataSource: 'Asset Management',
      lastGenerated: '2025-01-27',
      generatedBy: 'Operations',
      format: 'Excel, PDF',
      isPublic: true,
    },
    {
      id: 5,
      name: 'Revenue by Service Line',
      category: 'Financial',
      description: 'Department revenue breakdown with trends',
      dataSource: 'Billing System',
      lastGenerated: '2025-01-30',
      generatedBy: 'Finance Team',
      format: 'Excel',
      isPublic: true,
    },
  ];

  const scheduledReports = [
    {
      id: 1,
      name: 'Daily Census Report',
      frequency: 'Daily',
      nextRun: '2025-01-31 06:00',
      recipients: 'admin@hospital.com, operations@hospital.com',
      format: 'Email + PDF',
      isActive: true,
      lastRun: '2025-01-30 06:00',
      status: 'success',
    },
    {
      id: 2,
      name: 'Weekly Revenue Summary',
      frequency: 'Weekly',
      nextRun: '2025-02-03 08:00',
      recipients: 'finance-team@hospital.com',
      format: 'Email + Excel',
      isActive: true,
      lastRun: '2025-01-27 08:00',
      status: 'success',
    },
    {
      id: 3,
      name: 'Monthly Staff Performance',
      frequency: 'Monthly',
      nextRun: '2025-02-01 09:00',
      recipients: 'hr@hospital.com, managers@hospital.com',
      format: 'Email + PDF',
      isActive: true,
      lastRun: '2025-01-01 09:00',
      status: 'success',
    },
    {
      id: 4,
      name: 'Quarterly Financial Analysis',
      frequency: 'Quarterly',
      nextRun: '2025-04-01 10:00',
      recipients: 'cfo@hospital.com, board@hospital.com',
      format: 'Email + PDF + Excel',
      isActive: true,
      lastRun: '2025-01-01 10:00',
      status: 'success',
    },
  ];

  const customReportTemplates = [
    {
      id: 1,
      name: 'Custom Financial Analysis',
      description: 'Build your own financial report with selected metrics',
      availableMetrics: ['Revenue', 'Expenses', 'Profit', 'Cash Flow', 'Budget vs Actual'],
      filters: ['Date Range', 'Department', 'Account Type', 'Cost Center'],
      visualizations: ['Charts', 'Tables', 'Graphs'],
    },
    {
      id: 2,
      name: 'Patient Analytics Builder',
      description: 'Create custom patient analysis reports',
      availableMetrics: ['Demographics', 'Diagnoses', 'Treatments', 'Outcomes', 'Satisfaction'],
      filters: ['Date Range', 'Age Group', 'Department', 'Insurance Type'],
      visualizations: ['Pie Charts', 'Bar Graphs', 'Heat Maps'],
    },
    {
      id: 3,
      name: 'Operational Dashboard',
      description: 'Build custom operational metrics dashboard',
      availableMetrics: ['Wait Times', 'Bed Occupancy', 'Equipment Usage', 'Staff Utilization'],
      filters: ['Date Range', 'Department', 'Shift', 'Location'],
      visualizations: ['Real-time Gauges', 'Trend Lines', 'Tables'],
    },
  ];

  const handleCreateReport = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log('Creating report:', Object.fromEntries(formData));
    setIsCreateModalOpen(false);
    e.currentTarget.reset();
  };

  const handleScheduleReport = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log('Scheduling report:', Object.fromEntries(formData));
    setIsScheduleModalOpen(false);
    e.currentTarget.reset();
  };

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      Financial: 'bg-emerald-100 text-emerald-800',
      Clinical: 'bg-blue-100 text-blue-800',
      HR: 'bg-purple-100 text-purple-800',
      Operations: 'bg-orange-100 text-orange-800',
    };
    return colors[category] || 'bg-slate-100 text-slate-800';
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      success: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
    };
    return colors[status] || colors.success;
  };

  return (
    <ContentArea>
      <VStack size="sm">
        <div className="flex items-baseline gap-3">
          <h1 className="text-3xl font-bold text-slate-800">Custom Reports</h1>
          <p className="text-sm text-slate-500">Build, schedule, and manage custom analytics reports</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-blue-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Report Library</p>
                  <p className="text-2xl font-bold text-slate-800">{reportLibrary.length}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-blue-600 text-xl">📚</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-green-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Scheduled Reports</p>
                  <p className="text-2xl font-bold text-slate-800">{scheduledReports.length}</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-green-600 text-xl">📅</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-purple-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Templates</p>
                  <p className="text-2xl font-bold text-slate-800">{customReportTemplates.length}</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-purple-600 text-xl">🎨</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-orange-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Reports This Month</p>
                  <p className="text-2xl font-bold text-slate-800">142</p>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-orange-600 text-xl">📊</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('library')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'library'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Report Library
            </button>
            <button
              onClick={() => setActiveTab('scheduled')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'scheduled'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Scheduled Reports
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'custom'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Custom Report Builder
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'library' && (
          <Card className="border-2 shadow-md">
            <CardHeader className="border-b-2 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Available Reports</CardTitle>
                <Button onClick={() => setIsCreateModalOpen(true)}>+ Generate Report</Button>
              </div>
            </CardHeader>
            <CardContent className="py-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Data Source</TableHead>
                    <TableHead>Last Generated</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>Visibility</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportLibrary.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.name}</TableCell>
                      <TableCell>
                        <Badge className={getCategoryBadge(report.category)}>
                          {report.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">{report.description}</TableCell>
                      <TableCell className="text-sm">{report.dataSource}</TableCell>
                      <TableCell>{report.lastGenerated}</TableCell>
                      <TableCell className="text-sm">{report.format}</TableCell>
                      <TableCell>
                        <Badge className={report.isPublic ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'}>
                          {report.isPublic ? 'Public' : 'Private'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Run</Button>
                          <Button variant="outline" size="sm">Export</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {activeTab === 'scheduled' && (
          <Card className="border-2 shadow-md">
            <CardHeader className="border-b-2 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Scheduled Reports</CardTitle>
                <Button onClick={() => setIsScheduleModalOpen(true)}>+ Schedule Report</Button>
              </div>
            </CardHeader>
            <CardContent className="py-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Next Run</TableHead>
                    <TableHead>Last Run</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scheduledReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.name}</TableCell>
                      <TableCell>
                        <Badge className="bg-purple-100 text-purple-800">{report.frequency}</Badge>
                      </TableCell>
                      <TableCell>{report.nextRun}</TableCell>
                      <TableCell className="text-sm text-slate-600">{report.lastRun}</TableCell>
                      <TableCell className="text-sm max-w-xs truncate">{report.recipients}</TableCell>
                      <TableCell className="text-sm">{report.format}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(report.status)}>
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="outline" size="sm">Pause</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {activeTab === 'custom' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customReportTemplates.map((template) => (
              <Card key={template.id} className="border-2 shadow-md hover:shadow-xl transition-shadow">
                <CardHeader className="border-b-2 pb-4">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <p className="text-sm text-slate-500 mt-2">{template.description}</p>
                </CardHeader>
                <CardContent className="py-4 space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-2">Available Metrics:</p>
                    <div className="flex flex-wrap gap-2">
                      {template.availableMetrics.map((metric) => (
                        <Badge key={metric} className="bg-blue-100 text-blue-800">
                          {metric}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-2">Filters:</p>
                    <div className="flex flex-wrap gap-2">
                      {template.filters.map((filter) => (
                        <Badge key={filter} className="bg-purple-100 text-purple-800">
                          {filter}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-2">Visualizations:</p>
                    <div className="flex flex-wrap gap-2">
                      {template.visualizations.map((viz) => (
                        <Badge key={viz} className="bg-green-100 text-green-800">
                          {viz}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button className="w-full mt-4">Build Report</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Create Report Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Generate Report"
        >
          <form onSubmit={handleCreateReport} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Report Name</label>
              <Input name="reportName" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <Select name="category" required>
                <option value="Financial">Financial</option>
                <option value="Clinical">Clinical</option>
                <option value="HR">HR</option>
                <option value="Operations">Operations</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date Range</label>
              <Select name="dateRange" required>
                <option value="This Week">This Week</option>
                <option value="This Month">This Month</option>
                <option value="This Quarter">This Quarter</option>
                <option value="This Year">This Year</option>
                <option value="Custom">Custom Range</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Export Format</label>
              <Select name="format" required>
                <option value="PDF">PDF</option>
                <option value="Excel">Excel</option>
                <option value="Both">PDF + Excel</option>
              </Select>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Generate Report</Button>
            </div>
          </form>
        </Modal>

        {/* Schedule Report Modal */}
        <Modal
          isOpen={isScheduleModalOpen}
          onClose={() => setIsScheduleModalOpen(false)}
          title="Schedule Report"
        >
          <form onSubmit={handleScheduleReport} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Report Template</label>
              <Select name="template" required>
                {reportLibrary.map((report) => (
                  <option key={report.id} value={report.id}>{report.name}</option>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Frequency</label>
              <Select name="frequency" required>
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Recipients (comma-separated emails)</label>
              <Input name="recipients" type="email" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Format</label>
              <Select name="format" required>
                <option value="Email">Email Only</option>
                <option value="Email + PDF">Email + PDF Attachment</option>
                <option value="Email + Excel">Email + Excel Attachment</option>
              </Select>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsScheduleModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Schedule Report</Button>
            </div>
          </form>
        </Modal>
      </VStack>
    </ContentArea>
  );
}
