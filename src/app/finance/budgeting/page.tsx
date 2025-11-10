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

type TabType = 'budgets' | 'budget-lines' | 'forecast-scenarios' | 'variance-reports';

export default function BudgetingForecastingPage() {
  const [activeTab, setActiveTab] = React.useState<TabType>('budgets');
  const [isBudgetModalOpen, setIsBudgetModalOpen] = React.useState(false);
  const [isScenarioModalOpen, setIsScenarioModalOpen] = React.useState(false);

  // Sample data
  const budgets = [
    {
      id: 1,
      name: 'FY 2024 Annual Budget',
      fiscalYear: '2024',
      department: 'All Departments',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      totalAmount: 5000000,
      spent: 2850000,
      status: 'active',
      approvedBy: 'CFO',
      approvedDate: '2023-12-15',
    },
    {
      id: 2,
      name: 'Q2 2024 Marketing Budget',
      fiscalYear: '2024',
      department: 'Marketing',
      startDate: '2024-04-01',
      endDate: '2024-06-30',
      totalAmount: 150000,
      spent: 145000,
      status: 'active',
      approvedBy: 'CMO',
      approvedDate: '2024-03-20',
    },
    {
      id: 3,
      name: 'FY 2023 Annual Budget',
      fiscalYear: '2023',
      department: 'All Departments',
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      totalAmount: 4500000,
      spent: 4500000,
      status: 'closed',
      approvedBy: 'CFO',
      approvedDate: '2022-12-10',
    },
  ];

  const budgetLines = [
    {
      id: 1,
      budgetId: 1,
      budgetName: 'FY 2024 Annual Budget',
      account: 'Salaries & Wages',
      accountCode: '5000',
      department: 'Clinical',
      period: 'Q1 2024',
      allocated: 800000,
      spent: 750000,
      remaining: 50000,
      variance: -6.25,
    },
    {
      id: 2,
      budgetId: 1,
      budgetName: 'FY 2024 Annual Budget',
      account: 'Medical Supplies',
      accountCode: '6100',
      department: 'Operations',
      period: 'Q1 2024',
      allocated: 450000,
      spent: 520000,
      remaining: -70000,
      variance: 15.56,
    },
    {
      id: 3,
      budgetId: 1,
      budgetName: 'FY 2024 Annual Budget',
      account: 'Equipment Maintenance',
      accountCode: '6300',
      department: 'Facility',
      period: 'Q1 2024',
      allocated: 120000,
      spent: 95000,
      remaining: 25000,
      variance: -20.83,
    },
    {
      id: 4,
      budgetId: 2,
      budgetName: 'Q2 2024 Marketing Budget',
      account: 'Digital Marketing',
      accountCode: '7200',
      department: 'Marketing',
      period: 'Q2 2024',
      allocated: 80000,
      spent: 78000,
      remaining: 2000,
      variance: -2.5,
    },
  ];

  const forecastScenarios = [
    {
      id: 1,
      name: 'Conservative Growth Scenario',
      description: 'Assumes 3% revenue growth with cost controls',
      fiscalYear: '2025',
      type: 'Conservative',
      revenueGrowth: 3.0,
      projectedRevenue: 6200000,
      projectedExpenses: 5400000,
      projectedProfit: 800000,
      probability: 70,
      createdBy: 'Finance Manager',
      createdDate: '2024-01-15',
      status: 'active',
    },
    {
      id: 2,
      name: 'Optimistic Expansion Scenario',
      description: 'New facility opening, 15% revenue increase',
      fiscalYear: '2025',
      type: 'Optimistic',
      revenueGrowth: 15.0,
      projectedRevenue: 6900000,
      projectedExpenses: 5800000,
      projectedProfit: 1100000,
      probability: 40,
      createdBy: 'CFO',
      createdDate: '2024-01-20',
      status: 'active',
    },
    {
      id: 3,
      name: 'Baseline Steady State',
      description: 'Current operations maintained with modest growth',
      fiscalYear: '2025',
      type: 'Most Likely',
      revenueGrowth: 7.0,
      projectedRevenue: 6400000,
      projectedExpenses: 5500000,
      projectedProfit: 900000,
      probability: 60,
      createdBy: 'Finance Manager',
      createdDate: '2024-01-18',
      status: 'active',
    },
  ];

  const varianceReports = [
    {
      id: 1,
      reportName: 'January 2024 Variance Analysis',
      period: 'January 2024',
      budget: 'FY 2024 Annual Budget',
      budgeted: 416667,
      actual: 445000,
      variance: 28333,
      variancePercent: 6.8,
      status: 'unfavorable',
      generatedDate: '2024-02-05',
      notes: 'Higher than expected medical supply costs',
    },
    {
      id: 2,
      reportName: 'February 2024 Variance Analysis',
      period: 'February 2024',
      budget: 'FY 2024 Annual Budget',
      budgeted: 416667,
      actual: 398000,
      variance: -18667,
      variancePercent: -4.5,
      status: 'favorable',
      generatedDate: '2024-03-05',
      notes: 'Reduced overtime expenses',
    },
    {
      id: 3,
      reportName: 'Q1 2024 Comprehensive Variance',
      period: 'Q1 2024',
      budget: 'FY 2024 Annual Budget',
      budgeted: 1250000,
      actual: 1315000,
      variance: 65000,
      variancePercent: 5.2,
      status: 'unfavorable',
      generatedDate: '2024-04-10',
      notes: 'Overall Q1 spending exceeded budget primarily due to supply chain issues',
    },
  ];

  const handleBudgetSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log('Creating budget:', Object.fromEntries(formData));
    setIsBudgetModalOpen(false);
    e.currentTarget.reset();
  };

  const handleScenarioSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log('Creating forecast scenario:', Object.fromEntries(formData));
    setIsScenarioModalOpen(false);
    e.currentTarget.reset();
  };

  const totalBudgeted = budgets.filter(b => b.status === 'active').reduce((sum, b) => sum + b.totalAmount, 0);
  const totalSpent = budgets.filter(b => b.status === 'active').reduce((sum, b) => sum + b.spent, 0);
  const utilizationRate = totalBudgeted > 0 ? (totalSpent / totalBudgeted * 100).toFixed(1) : 0;

  return (
    <ContentArea>
      <VStack size="sm">
        <div className="flex items-baseline gap-3 shrink-0">
          <h1 className="text-3xl font-bold text-foreground">Budgeting & Forecasting</h1>
          <p className="text-sm text-muted-foreground">Manage budgets, forecasts, and variance analysis</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-blue-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center gap-3">
                <div className="shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-lg">
                    📊
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-2xl font-bold text-primary">
                    {budgets.filter(b => b.status === 'active').length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Active Budgets</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-green-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center gap-3">
                <div className="shrink-0">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-lg">
                    💰
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-2xl font-bold text-green-600">
                    ${totalBudgeted.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Total Budgeted</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-blue-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center gap-3">
                <div className="shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-lg">
                    💵
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-2xl font-bold text-blue-600">
                    ${totalSpent.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Total Spent</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-purple-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center gap-3">
                <div className="shrink-0">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-lg">
                    📈
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-2xl font-bold text-purple-600">{utilizationRate}%</div>
                  <p className="text-xs text-muted-foreground mt-2">Budget Utilization</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="border-b-2 border-gray-200">
          <nav className="-mb-px flex space-x-6">
            <button
              onClick={() => setActiveTab('budgets')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'budgets'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Budgets
            </button>
            <button
              onClick={() => setActiveTab('budget-lines')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'budget-lines'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Budget Lines
            </button>
            <button
              onClick={() => setActiveTab('forecast-scenarios')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'forecast-scenarios'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Forecast Scenarios
            </button>
            <button
              onClick={() => setActiveTab('variance-reports')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'variance-reports'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Variance Reports
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'budgets' && (
          <>
            <Card className="border-2">
              <CardContent className="py-3 px-4">
                <Input
                  type="text"
                  placeholder="Search budgets..."
                  className="w-full"
                />
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardHeader className="border-b-2 pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle>Budgets ({budgets.length})</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Export</Button>
                    <Button onClick={() => setIsBudgetModalOpen(true)} size="sm">+ New Budget</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Budget Name</TableHead>
                    <TableHead>Fiscal Year</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead className="text-right">Total Amount</TableHead>
                    <TableHead className="text-right">Spent</TableHead>
                    <TableHead className="text-right">Remaining</TableHead>
                    <TableHead>Utilization</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {budgets.map((budget) => {
                    const remaining = budget.totalAmount - budget.spent;
                    const utilization = (budget.spent / budget.totalAmount * 100).toFixed(1);
                    return (
                      <TableRow key={budget.id}>
                        <TableCell className="font-medium">{budget.name}</TableCell>
                        <TableCell>{budget.fiscalYear}</TableCell>
                        <TableCell>{budget.department}</TableCell>
                        <TableCell className="text-sm">
                          {budget.startDate} to {budget.endDate}
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          ${budget.totalAmount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right text-blue-600">
                          ${budget.spent.toLocaleString()}
                        </TableCell>
                        <TableCell className={`text-right font-medium ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${Math.abs(remaining).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  parseFloat(utilization) > 90 ? 'bg-red-500' : parseFloat(utilization) > 75 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${Math.min(parseFloat(utilization), 100)}%` }}
                              />
                            </div>
                            <span className="text-sm">{utilization}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={budget.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {budget.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">View</Button>
                            <Button variant="ghost" size="sm">Edit</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          </>
        )}

        {activeTab === 'budget-lines' && (
          <>
            <Card className="border-2">
              <CardContent className="py-3 px-4">
                <Input
                  type="text"
                  placeholder="Search budget lines..."
                  className="w-full"
                />
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardHeader className="border-b-2 pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle>Budget Lines ({budgetLines.length})</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Export</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Budget</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Account Code</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead className="text-right">Allocated</TableHead>
                    <TableHead className="text-right">Spent</TableHead>
                    <TableHead className="text-right">Remaining</TableHead>
                    <TableHead className="text-right">Variance %</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {budgetLines.map((line) => (
                    <TableRow key={line.id}>
                      <TableCell className="font-medium text-sm">{line.budgetName}</TableCell>
                      <TableCell>{line.account}</TableCell>
                      <TableCell className="font-mono text-sm">{line.accountCode}</TableCell>
                      <TableCell>{line.department}</TableCell>
                      <TableCell className="text-sm">{line.period}</TableCell>
                      <TableCell className="text-right">${line.allocated.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-blue-600">
                        ${line.spent.toLocaleString()}
                      </TableCell>
                      <TableCell className={`text-right font-medium ${line.remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${Math.abs(line.remaining).toLocaleString()}
                      </TableCell>
                      <TableCell className={`text-right font-bold ${line.variance < 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {line.variance > 0 ? '+' : ''}{line.variance.toFixed(2)}%
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">Details</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          </>
        )}

        {activeTab === 'forecast-scenarios' && (
          <>
            <Card className="border-2">
              <CardContent className="py-3 px-4">
                <Input
                  type="text"
                  placeholder="Search forecast scenarios..."
                  className="w-full"
                />
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardHeader className="border-b-2 pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle>Forecast Scenarios ({forecastScenarios.length})</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Export</Button>
                    <Button onClick={() => setIsScenarioModalOpen(true)} size="sm">+ New Scenario</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Scenario Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Fiscal Year</TableHead>
                    <TableHead className="text-right">Revenue Growth</TableHead>
                    <TableHead className="text-right">Projected Revenue</TableHead>
                    <TableHead className="text-right">Projected Expenses</TableHead>
                    <TableHead className="text-right">Projected Profit</TableHead>
                    <TableHead>Probability</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {forecastScenarios.map((scenario) => (
                    <TableRow key={scenario.id}>
                      <TableCell className="font-medium">{scenario.name}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            scenario.type === 'Optimistic'
                              ? 'bg-green-100 text-green-800'
                              : scenario.type === 'Conservative'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-blue-100 text-blue-800'
                          }
                        >
                          {scenario.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{scenario.fiscalYear}</TableCell>
                      <TableCell className="text-right text-green-600 font-medium">
                        +{scenario.revenueGrowth.toFixed(1)}%
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        ${scenario.projectedRevenue.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-red-600">
                        ${scenario.projectedExpenses.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-green-600 font-bold">
                        ${scenario.projectedProfit.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${scenario.probability}%` }}
                            />
                          </div>
                          <span className="text-sm">{scenario.probability}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">{scenario.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">View</Button>
                          <Button variant="ghost" size="sm">Compare</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          </>
        )}

        {activeTab === 'variance-reports' && (
          <>
            <Card className="border-2">
              <CardContent className="py-3 px-4">
                <Input
                  type="text"
                  placeholder="Search variance reports..."
                  className="w-full"
                />
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardHeader className="border-b-2 pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle>Variance Reports ({varianceReports.length})</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Export</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead className="text-right">Budgeted</TableHead>
                    <TableHead className="text-right">Actual</TableHead>
                    <TableHead className="text-right">Variance</TableHead>
                    <TableHead className="text-right">Variance %</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Generated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {varianceReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.reportName}</TableCell>
                      <TableCell>{report.period}</TableCell>
                      <TableCell className="text-sm">{report.budget}</TableCell>
                      <TableCell className="text-right">${report.budgeted.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-medium">
                        ${report.actual.toLocaleString()}
                      </TableCell>
                      <TableCell className={`text-right font-bold ${report.variance < 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {report.variance > 0 ? '+' : ''}${Math.abs(report.variance).toLocaleString()}
                      </TableCell>
                      <TableCell className={`text-right font-bold ${report.variancePercent < 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {report.variancePercent > 0 ? '+' : ''}{report.variancePercent.toFixed(1)}%
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            report.status === 'favorable'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }
                        >
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{report.generatedDate}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">Details</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          </>
        )}

        {/* Create Budget Modal */}
        <Modal isOpen={isBudgetModalOpen} onClose={() => setIsBudgetModalOpen(false)} title="Create Budget" size="lg">
          <form onSubmit={handleBudgetSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="name" label="Budget Name" placeholder="FY 2025 Annual Budget" required />
              <Input name="fiscalYear" label="Fiscal Year" placeholder="2025" required />
              <Select
                name="department"
                label="Department"
                options={[
                  { value: 'All Departments', label: 'All Departments' },
                  { value: 'Clinical', label: 'Clinical' },
                  { value: 'Operations', label: 'Operations' },
                  { value: 'Marketing', label: 'Marketing' },
                  { value: 'Facility', label: 'Facility' },
                ]}
                required
              />
              <Input name="totalAmount" type="number" step="0.01" label="Total Amount" placeholder="5000000.00" required />
              <Input name="startDate" type="date" label="Start Date" required />
              <Input name="endDate" type="date" label="End Date" required />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsBudgetModalOpen(false)} type="button">
                Cancel
              </Button>
              <Button type="submit">Create Budget</Button>
            </div>
          </form>
        </Modal>

        {/* Create Forecast Scenario Modal */}
        <Modal isOpen={isScenarioModalOpen} onClose={() => setIsScenarioModalOpen(false)} title="Create Forecast Scenario" size="lg">
          <form onSubmit={handleScenarioSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="name" label="Scenario Name" placeholder="Conservative Growth Scenario" required />
              <Select
                name="type"
                label="Scenario Type"
                options={[
                  { value: 'Optimistic', label: 'Optimistic' },
                  { value: 'Most Likely', label: 'Most Likely' },
                  { value: 'Conservative', label: 'Conservative' },
                  { value: 'Pessimistic', label: 'Pessimistic' },
                ]}
                required
              />
              <Input name="fiscalYear" label="Fiscal Year" placeholder="2025" required />
              <Input name="revenueGrowth" type="number" step="0.1" label="Revenue Growth %" placeholder="5.0" required />
              <Input name="projectedRevenue" type="number" step="0.01" label="Projected Revenue" placeholder="6000000.00" required />
              <Input name="projectedExpenses" type="number" step="0.01" label="Projected Expenses" placeholder="5200000.00" required />
              <Input name="probability" type="number" min="0" max="100" label="Probability %" placeholder="60" required />
            </div>
            <Input name="description" label="Description" placeholder="Brief description of this scenario" required />
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsScenarioModalOpen(false)} type="button">
                Cancel
              </Button>
              <Button type="submit">Create Scenario</Button>
            </div>
          </form>
        </Modal>
      </VStack>
    </ContentArea>
  );
}
