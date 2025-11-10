'use client';

import React from 'react';
import { ContentArea, VStack } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';

type TabType = 'kpi-metrics' | 'reports' | 'dashboards' | 'data-views';

export default function FinancialAnalyticsPage() {
  const [activeTab, setActiveTab] = React.useState<TabType>('kpi-metrics');
  const [isKpiModalOpen, setIsKpiModalOpen] = React.useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = React.useState(false);
  const [isDashboardModalOpen, setIsDashboardModalOpen] = React.useState(false);

  // Sample data
  const kpiMetrics = [
    {
      id: 1,
      name: 'Revenue Growth Rate',
      category: 'Revenue',
      currentValue: 12.5,
      target: 15.0,
      unit: '%',
      trend: 'up',
      period: 'Q1 2024',
      variance: -2.5,
      status: 'warning',
      lastUpdated: '2024-01-30',
    },
    {
      id: 2,
      name: 'Operating Margin',
      category: 'Profitability',
      currentValue: 18.3,
      target: 20.0,
      unit: '%',
      trend: 'up',
      period: 'Q1 2024',
      variance: -1.7,
      status: 'warning',
      lastUpdated: '2024-01-30',
    },
    {
      id: 3,
      name: 'Days Sales Outstanding (DSO)',
      category: 'Cash Flow',
      currentValue: 42,
      target: 45,
      unit: 'days',
      trend: 'down',
      period: 'January 2024',
      variance: 3,
      status: 'good',
      lastUpdated: '2024-01-30',
    },
    {
      id: 4,
      name: 'Current Ratio',
      category: 'Liquidity',
      currentValue: 2.3,
      target: 2.0,
      unit: 'ratio',
      trend: 'up',
      period: 'January 2024',
      variance: 0.3,
      status: 'good',
      lastUpdated: '2024-01-30',
    },
    {
      id: 5,
      name: 'Return on Assets (ROA)',
      category: 'Profitability',
      currentValue: 8.7,
      target: 10.0,
      unit: '%',
      trend: 'up',
      period: 'Q1 2024',
      variance: -1.3,
      status: 'warning',
      lastUpdated: '2024-01-30',
    },
  ];

  const reports = [
    {
      id: 1,
      name: 'Monthly Financial Performance',
      description: 'Comprehensive P&L, Balance Sheet, and Cash Flow analysis',
      category: 'Financial Statements',
      frequency: 'Monthly',
      lastRun: '2024-02-01',
      nextScheduled: '2024-03-01',
      format: 'PDF, Excel',
      recipients: 'CFO, Finance Team',
      status: 'active',
    },
    {
      id: 2,
      name: 'Revenue Analysis by Department',
      description: 'Breakdown of revenue by clinical departments and service lines',
      category: 'Revenue Analysis',
      frequency: 'Weekly',
      lastRun: '2024-01-29',
      nextScheduled: '2024-02-05',
      format: 'Excel',
      recipients: 'Department Heads',
      status: 'active',
    },
    {
      id: 3,
      name: 'Cost Center Performance',
      description: 'Budget vs actual analysis for all cost centers',
      category: 'Budget Analysis',
      frequency: 'Monthly',
      lastRun: '2024-02-01',
      nextScheduled: '2024-03-01',
      format: 'PDF',
      recipients: 'Management Team',
      status: 'active',
    },
    {
      id: 4,
      name: 'Cash Flow Forecast',
      description: '90-day rolling cash flow projection with scenarios',
      category: 'Cash Management',
      frequency: 'Daily',
      lastRun: '2024-01-30',
      nextScheduled: '2024-01-31',
      format: 'Excel',
      recipients: 'Treasury, CFO',
      status: 'active',
    },
  ];

  const dashboards = [
    {
      id: 1,
      name: 'Executive Financial Dashboard',
      description: 'Real-time view of key financial metrics and KPIs',
      widgets: ['Revenue Trend', 'Operating Margin', 'Cash Position', 'Key Ratios'],
      lastAccessed: '2024-01-30 14:30',
      accessCount: 245,
      sharedWith: 'Executive Team',
      isPublic: false,
      status: 'active',
    },
    {
      id: 2,
      name: 'Department Performance Dashboard',
      description: 'Department-level revenue, expenses, and productivity metrics',
      widgets: ['Revenue by Dept', 'Expense Trends', 'Patient Volume', 'Staff Utilization'],
      lastAccessed: '2024-01-30 16:15',
      accessCount: 489,
      sharedWith: 'Department Heads',
      isPublic: false,
      status: 'active',
    },
    {
      id: 3,
      name: 'Cash Flow Management Dashboard',
      description: 'Daily cash position, AR aging, and payment trends',
      widgets: ['Cash Balance', 'AR Aging', 'AP Due', 'Daily Collections'],
      lastAccessed: '2024-01-30 09:00',
      accessCount: 156,
      sharedWith: 'Finance Team',
      isPublic: false,
      status: 'active',
    },
    {
      id: 4,
      name: 'Budget vs Actual Dashboard',
      description: 'Real-time budget performance across all cost centers',
      widgets: ['Budget Variance', 'Spending by Category', 'YTD Performance', 'Forecasts'],
      lastAccessed: '2024-01-29 17:45',
      accessCount: 312,
      sharedWith: 'Management',
      isPublic: true,
      status: 'active',
    },
  ];

  const dataViews = [
    {
      id: 1,
      name: 'General Ledger Detail View',
      description: 'Detailed transaction view with drill-down capability',
      source: 'General Ledger',
      recordCount: 125420,
      columns: ['Date', 'Account', 'Description', 'Debit', 'Credit', 'Balance'],
      filters: ['Date Range', 'Account', 'Department'],
      lastRefreshed: '2024-01-30 23:00',
      refreshFrequency: 'Daily',
      isPublic: false,
    },
    {
      id: 2,
      name: 'Revenue by Service Line',
      description: 'Aggregated revenue data by clinical service line',
      source: 'Billing System',
      recordCount: 8945,
      columns: ['Service Line', 'Patient Count', 'Gross Revenue', 'Net Revenue', 'Collections'],
      filters: ['Date Range', 'Service Line', 'Payer Type'],
      lastRefreshed: '2024-01-30 18:00',
      refreshFrequency: 'Hourly',
      isPublic: true,
    },
    {
      id: 3,
      name: 'Accounts Receivable Aging',
      description: 'AR aging buckets with collection metrics',
      source: 'AR Subledger',
      recordCount: 12456,
      columns: ['Customer', '0-30 Days', '31-60 Days', '61-90 Days', '90+ Days', 'Total'],
      filters: ['Customer Type', 'Department', 'Aging Bucket'],
      lastRefreshed: '2024-01-30 22:00',
      refreshFrequency: 'Daily',
      isPublic: false,
    },
    {
      id: 4,
      name: 'Expense Analysis by Department',
      description: 'Detailed expense breakdown with budget comparison',
      source: 'GL & Budget System',
      recordCount: 45230,
      columns: ['Department', 'Account', 'Budgeted', 'Actual', 'Variance', 'Variance %'],
      filters: ['Department', 'Account Type', 'Period'],
      lastRefreshed: '2024-01-30 23:30',
      refreshFrequency: 'Daily',
      isPublic: true,
    },
  ];

  const handleKpiSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log('Creating KPI:', Object.fromEntries(formData));
    setIsKpiModalOpen(false);
    e.currentTarget.reset();
  };

  const handleReportSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log('Creating report:', Object.fromEntries(formData));
    setIsReportModalOpen(false);
    e.currentTarget.reset();
  };

  const handleDashboardSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log('Creating dashboard:', Object.fromEntries(formData));
    setIsDashboardModalOpen(false);
    e.currentTarget.reset();
  };

  const totalKpis = kpiMetrics.length;
  const goodKpis = kpiMetrics.filter(k => k.status === 'good').length;
  const activeReports = reports.filter(r => r.status === 'active').length;
  const activeDashboards = dashboards.filter(d => d.status === 'active').length;

  return (
    <ContentArea>
      <VStack size="sm">
        <div className="flex justify-between items-center">
          <div className="flex items-baseline gap-3">
            <h1 className="text-3xl font-bold text-slate-800">Financial Analytics</h1>
            <p className="text-sm text-slate-500">KPIs, reports, dashboards, and data views</p>
          </div>
          {activeTab === 'kpi-metrics' && (
            <Button onClick={() => setIsKpiModalOpen(true)}>+ New KPI</Button>
          )}
          {activeTab === 'reports' && (
            <Button onClick={() => setIsReportModalOpen(true)}>+ New Report</Button>
          )}
          {activeTab === 'dashboards' && (
            <Button onClick={() => setIsDashboardModalOpen(true)}>+ New Dashboard</Button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-blue-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Total KPIs</p>
                  <p className="text-2xl font-bold text-slate-800">{totalKpis}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-blue-600 text-xl">🎯</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-green-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">KPIs on Target</p>
                  <p className="text-2xl font-bold text-slate-800">{goodKpis}/{totalKpis}</p>
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
                  <p className="text-xs text-slate-500 mt-2">Active Reports</p>
                  <p className="text-2xl font-bold text-slate-800">{activeReports}</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-purple-600 text-xl">📋</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-orange-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Active Dashboards</p>
                  <p className="text-2xl font-bold text-slate-800">{activeDashboards}</p>
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
              onClick={() => setActiveTab('kpi-metrics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'kpi-metrics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              KPI Metrics
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'reports'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Reports
            </button>
            <button
              onClick={() => setActiveTab('dashboards')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'dashboards'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Dashboards
            </button>
            <button
              onClick={() => setActiveTab('data-views')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'data-views'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Data Views
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'kpi-metrics' && (
          <Card className="border-2 shadow-md">
            <CardHeader className="border-b-2 pb-4">
              <CardTitle className="text-lg">KPI Metrics</CardTitle>
            </CardHeader>
            <CardContent className="py-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>KPI Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Current Value</TableHead>
                    <TableHead className="text-right">Target</TableHead>
                    <TableHead className="text-right">Variance</TableHead>
                    <TableHead>Trend</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {kpiMetrics.map((kpi) => (
                    <TableRow key={kpi.id}>
                      <TableCell className="font-medium">{kpi.name}</TableCell>
                      <TableCell>
                        <Badge className="bg-blue-100 text-blue-800">{kpi.category}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        {kpi.currentValue}{kpi.unit}
                      </TableCell>
                      <TableCell className="text-right">{kpi.target}{kpi.unit}</TableCell>
                      <TableCell className={`text-right font-medium ${
                        (kpi.unit === 'days' ? kpi.variance > 0 : kpi.variance < 0) ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {kpi.variance > 0 ? '+' : ''}{kpi.variance}{kpi.unit}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {kpi.trend === 'up' ? (
                            <span className="text-green-600">↑ Up</span>
                          ) : (
                            <span className="text-red-600">↓ Down</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{kpi.period}</TableCell>
                      <TableCell>
                        <Badge className={kpi.status === 'good' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {kpi.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{kpi.lastUpdated}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">View</Button>
                          <Button variant="ghost" size="sm">History</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {activeTab === 'reports' && (
          <Card className="border-2 shadow-md">
            <CardHeader className="border-b-2 pb-4">
              <CardTitle className="text-lg">Financial Reports</CardTitle>
            </CardHeader>
            <CardContent className="py-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Last Run</TableHead>
                    <TableHead>Next Scheduled</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.name}</TableCell>
                      <TableCell>
                        <Badge className="bg-purple-100 text-purple-800">{report.category}</Badge>
                      </TableCell>
                      <TableCell>{report.frequency}</TableCell>
                      <TableCell>{report.lastRun}</TableCell>
                      <TableCell>{report.nextScheduled}</TableCell>
                      <TableCell className="text-sm">{report.format}</TableCell>
                      <TableCell className="text-sm">{report.recipients}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">{report.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">Run Now</Button>
                          <Button variant="ghost" size="sm">Edit</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {activeTab === 'dashboards' && (
          <Card className="border-2 shadow-md">
            <CardHeader className="border-b-2 pb-4">
              <CardTitle className="text-lg">Analytics Dashboards</CardTitle>
            </CardHeader>
            <CardContent className="py-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dashboard Name</TableHead>
                    <TableHead>Widgets</TableHead>
                    <TableHead>Last Accessed</TableHead>
                    <TableHead>Access Count</TableHead>
                    <TableHead>Shared With</TableHead>
                    <TableHead>Visibility</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dashboards.map((dashboard) => (
                    <TableRow key={dashboard.id}>
                      <TableCell className="font-medium">{dashboard.name}</TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {dashboard.widgets.slice(0, 2).map((widget, idx) => (
                            <Badge key={idx} className="bg-blue-100 text-blue-800 text-xs">
                              {widget}
                            </Badge>
                          ))}
                          {dashboard.widgets.length > 2 && (
                            <Badge className="bg-gray-100 text-gray-800 text-xs">
                              +{dashboard.widgets.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{dashboard.lastAccessed}</TableCell>
                      <TableCell>{dashboard.accessCount}</TableCell>
                      <TableCell className="text-sm">{dashboard.sharedWith}</TableCell>
                      <TableCell>
                        <Badge className={dashboard.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {dashboard.isPublic ? 'Public' : 'Private'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">{dashboard.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">Open</Button>
                          <Button variant="ghost" size="sm">Edit</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {activeTab === 'data-views' && (
          <Card className="border-2 shadow-md">
            <CardHeader className="border-b-2 pb-4">
              <CardTitle className="text-lg">Data Views</CardTitle>
            </CardHeader>
            <CardContent className="py-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>View Name</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead className="text-right">Records</TableHead>
                    <TableHead>Available Filters</TableHead>
                    <TableHead>Last Refreshed</TableHead>
                    <TableHead>Refresh Frequency</TableHead>
                    <TableHead>Visibility</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dataViews.map((view) => (
                    <TableRow key={view.id}>
                      <TableCell className="font-medium">{view.name}</TableCell>
                      <TableCell>
                        <Badge className="bg-indigo-100 text-indigo-800">{view.source}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {view.recordCount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {view.filters.slice(0, 2).map((filter, idx) => (
                            <Badge key={idx} className="bg-gray-100 text-gray-800 text-xs">
                              {filter}
                            </Badge>
                          ))}
                          {view.filters.length > 2 && (
                            <Badge className="bg-gray-100 text-gray-800 text-xs">
                              +{view.filters.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{view.lastRefreshed}</TableCell>
                      <TableCell>{view.refreshFrequency}</TableCell>
                      <TableCell>
                        <Badge className={view.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {view.isPublic ? 'Public' : 'Private'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">Query</Button>
                          <Button variant="ghost" size="sm">Export</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Create KPI Modal */}
        <Modal isOpen={isKpiModalOpen} onClose={() => setIsKpiModalOpen(false)} title="Create KPI Metric" size="lg">
          <form onSubmit={handleKpiSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="name" label="KPI Name" placeholder="Revenue Growth Rate" required />
              <Select
                name="category"
                label="Category"
                options={[
                  { value: 'Revenue', label: 'Revenue' },
                  { value: 'Profitability', label: 'Profitability' },
                  { value: 'Cash Flow', label: 'Cash Flow' },
                  { value: 'Liquidity', label: 'Liquidity' },
                  { value: 'Efficiency', label: 'Efficiency' },
                ]}
                required
              />
              <Input name="currentValue" type="number" step="0.01" label="Current Value" placeholder="12.5" required />
              <Input name="target" type="number" step="0.01" label="Target Value" placeholder="15.0" required />
              <Select
                name="unit"
                label="Unit"
                options={[
                  { value: '%', label: 'Percentage (%)' },
                  { value: 'days', label: 'Days' },
                  { value: 'ratio', label: 'Ratio' },
                  { value: 'currency', label: 'Currency' },
                ]}
                required
              />
              <Input name="period" label="Period" placeholder="Q1 2024" required />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsKpiModalOpen(false)} type="button">
                Cancel
              </Button>
              <Button type="submit">Create KPI</Button>
            </div>
          </form>
        </Modal>

        {/* Create Report Modal */}
        <Modal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} title="Create Report" size="lg">
          <form onSubmit={handleReportSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="name" label="Report Name" placeholder="Monthly Financial Performance" required />
              <Select
                name="category"
                label="Category"
                options={[
                  { value: 'Financial Statements', label: 'Financial Statements' },
                  { value: 'Revenue Analysis', label: 'Revenue Analysis' },
                  { value: 'Budget Analysis', label: 'Budget Analysis' },
                  { value: 'Cash Management', label: 'Cash Management' },
                ]}
                required
              />
              <Select
                name="frequency"
                label="Frequency"
                options={[
                  { value: 'Daily', label: 'Daily' },
                  { value: 'Weekly', label: 'Weekly' },
                  { value: 'Monthly', label: 'Monthly' },
                  { value: 'Quarterly', label: 'Quarterly' },
                  { value: 'Annual', label: 'Annual' },
                ]}
                required
              />
              <Input name="recipients" label="Recipients" placeholder="CFO, Finance Team" required />
            </div>
            <Input name="description" label="Description" placeholder="Comprehensive financial analysis" required />
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsReportModalOpen(false)} type="button">
                Cancel
              </Button>
              <Button type="submit">Create Report</Button>
            </div>
          </form>
        </Modal>

        {/* Create Dashboard Modal */}
        <Modal isOpen={isDashboardModalOpen} onClose={() => setIsDashboardModalOpen(false)} title="Create Dashboard" size="lg">
          <form onSubmit={handleDashboardSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="name" label="Dashboard Name" placeholder="Executive Financial Dashboard" required />
              <Input name="sharedWith" label="Shared With" placeholder="Executive Team" required />
            </div>
            <Input name="description" label="Description" placeholder="Real-time view of key financial metrics" required />
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsDashboardModalOpen(false)} type="button">
                Cancel
              </Button>
              <Button type="submit">Create Dashboard</Button>
            </div>
          </form>
        </Modal>
      </VStack>
    </ContentArea>
  );
}
