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

type TabType = 'payroll-runs' | 'pay-schedules' | 'employee-payroll' | 'deductions' | 'tax-filings' | 'reports';

export default function PayrollPage() {
  const [activeTab, setActiveTab] = React.useState<TabType>('payroll-runs');
  const [isPayrollRunModalOpen, setIsPayrollRunModalOpen] = React.useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = React.useState(false);
  const [isDeductionModalOpen, setIsDeductionModalOpen] = React.useState(false);
  const [isTaxFilingModalOpen, setIsTaxFilingModalOpen] = React.useState(false);

  // Sample data
  const payrollRuns = [
    {
      id: 1,
      runId: 'PR-2024-01',
      payPeriod: 'Jan 1-15, 2024',
      payDate: '2024-01-20',
      employeeCount: 145,
      grossPay: 287500,
      netPay: 216825,
      status: 'Completed',
      processedBy: 'Sarah Johnson'
    },
    {
      id: 2,
      runId: 'PR-2024-02',
      payPeriod: 'Jan 16-31, 2024',
      payDate: '2024-02-05',
      employeeCount: 147,
      grossPay: 291250,
      netPay: 219450,
      status: 'Completed',
      processedBy: 'Sarah Johnson'
    },
    {
      id: 3,
      runId: 'PR-2024-03',
      payPeriod: 'Feb 1-15, 2024',
      payDate: '2024-02-20',
      employeeCount: 148,
      grossPay: 293000,
      netPay: 220775,
      status: 'Processing',
      processedBy: 'Sarah Johnson'
    }
  ];

  const paySchedules = [
    {
      id: 1,
      scheduleName: 'Bi-Weekly - Admin Staff',
      frequency: 'Bi-Weekly',
      payDay: 'Friday',
      employeeCount: 85,
      nextPayDate: '2024-02-20',
      status: 'Active'
    },
    {
      id: 2,
      scheduleName: 'Monthly - Medical Staff',
      frequency: 'Monthly',
      payDay: 'Last Friday',
      employeeCount: 62,
      nextPayDate: '2024-02-29',
      status: 'Active'
    }
  ];

  const employeePayroll = [
    {
      id: 1,
      employeeId: 'EMP-001',
      employeeName: 'Dr. Emily Carter',
      department: 'Cardiology',
      position: 'Senior Cardiologist',
      baseSalary: 18500,
      allowances: 2500,
      deductions: 4200,
      netPay: 16800,
      status: 'Active'
    },
    {
      id: 2,
      employeeId: 'EMP-002',
      employeeName: 'John Smith',
      department: 'Emergency',
      position: 'Nurse Practitioner',
      baseSalary: 6500,
      allowances: 800,
      deductions: 1450,
      netPay: 5850,
      status: 'Active'
    },
    {
      id: 3,
      employeeId: 'EMP-003',
      employeeName: 'Sarah Johnson',
      department: 'Finance',
      position: 'Payroll Manager',
      baseSalary: 8500,
      allowances: 1200,
      deductions: 1950,
      netPay: 7750,
      status: 'Active'
    }
  ];

  const deductions = [
    {
      id: 1,
      deductionCode: 'TAX-FED',
      deductionName: 'Federal Income Tax',
      type: 'Statutory',
      calculationType: 'Percentage',
      rate: 22.0,
      isActive: true,
      applicableEmployees: 148
    },
    {
      id: 2,
      deductionCode: 'TAX-STATE',
      deductionName: 'State Income Tax',
      type: 'Statutory',
      calculationType: 'Percentage',
      rate: 5.5,
      isActive: true,
      applicableEmployees: 148
    },
    {
      id: 3,
      deductionCode: 'SSC',
      deductionName: 'Social Security',
      type: 'Statutory',
      calculationType: 'Percentage',
      rate: 6.2,
      isActive: true,
      applicableEmployees: 148
    },
    {
      id: 4,
      deductionCode: 'MED',
      deductionName: 'Medicare',
      type: 'Statutory',
      calculationType: 'Percentage',
      rate: 1.45,
      isActive: true,
      applicableEmployees: 148
    },
    {
      id: 5,
      deductionCode: 'HEALTH-INS',
      deductionName: 'Health Insurance Premium',
      type: 'Voluntary',
      calculationType: 'Fixed',
      rate: 250.0,
      isActive: true,
      applicableEmployees: 132
    }
  ];

  const taxFilings = [
    {
      id: 1,
      filingId: 'TAX-2024-Q1',
      filingType: 'Quarterly Tax Return',
      taxPeriod: 'Q1 2024',
      dueDate: '2024-04-30',
      totalTax: 125000,
      status: 'Pending',
      filedBy: null
    },
    {
      id: 2,
      filingId: 'TAX-2023-Q4',
      filingType: 'Quarterly Tax Return',
      taxPeriod: 'Q4 2023',
      dueDate: '2024-01-31',
      totalTax: 118500,
      status: 'Filed',
      filedBy: 'Sarah Johnson'
    }
  ];

  const handlePayrollRunSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Payroll run submitted');
    setIsPayrollRunModalOpen(false);
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Pay schedule submitted');
    setIsScheduleModalOpen(false);
  };

  const handleDeductionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Deduction submitted');
    setIsDeductionModalOpen(false);
  };

  const handleTaxFilingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Tax filing submitted');
    setIsTaxFilingModalOpen(false);
  };

  return (
    <ContentArea>
      <VStack size="sm">
        {/* Page Title */}
        <div className="flex items-baseline gap-3">
          <h1 className="text-3xl font-bold text-slate-800">Payroll Management</h1>
          <p className="text-sm text-slate-500">Manage payroll processing, schedules, and tax compliance</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-green-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Active Employees</p>
                  <p className="text-2xl font-bold text-slate-800">148</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-green-600 text-xl">👥</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-blue-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Monthly Payroll</p>
                  <p className="text-2xl font-bold text-slate-800">$584K</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-blue-600 text-xl">💰</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-purple-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Tax Withheld (MTD)</p>
                  <p className="text-2xl font-bold text-slate-800">$205K</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-purple-600 text-xl">📊</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-orange-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Pending Filings</p>
                  <p className="text-2xl font-bold text-slate-800">1</p>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-orange-600 text-xl">📋</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b-2 border-slate-200">
          <nav className="flex space-x-6">
            <button
              onClick={() => setActiveTab('payroll-runs')}
              className={`py-3 px-1 border-b-2 transition-colors ${
                activeTab === 'payroll-runs'
                  ? 'border-blue-600 text-blue-600 font-medium'
                  : 'border-transparent text-slate-600 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              Payroll Runs
            </button>
            <button
              onClick={() => setActiveTab('pay-schedules')}
              className={`py-3 px-1 border-b-2 transition-colors ${
                activeTab === 'pay-schedules'
                  ? 'border-blue-600 text-blue-600 font-medium'
                  : 'border-transparent text-slate-600 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              Pay Schedules
            </button>
            <button
              onClick={() => setActiveTab('employee-payroll')}
              className={`py-3 px-1 border-b-2 transition-colors ${
                activeTab === 'employee-payroll'
                  ? 'border-blue-600 text-blue-600 font-medium'
                  : 'border-transparent text-slate-600 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              Employee Payroll
            </button>
            <button
              onClick={() => setActiveTab('deductions')}
              className={`py-3 px-1 border-b-2 transition-colors ${
                activeTab === 'deductions'
                  ? 'border-blue-600 text-blue-600 font-medium'
                  : 'border-transparent text-slate-600 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              Deductions
            </button>
            <button
              onClick={() => setActiveTab('tax-filings')}
              className={`py-3 px-1 border-b-2 transition-colors ${
                activeTab === 'tax-filings'
                  ? 'border-blue-600 text-blue-600 font-medium'
                  : 'border-transparent text-slate-600 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              Tax Filings
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-3 px-1 border-b-2 transition-colors ${
                activeTab === 'reports'
                  ? 'border-blue-600 text-blue-600 font-medium'
                  : 'border-transparent text-slate-600 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              Reports
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'payroll-runs' && (
          <>
            <Card className="border-2">
              <CardContent className="py-3 px-4">
                <Input
                  type="text"
                  placeholder="Search payroll runs..."
                  className="w-full"
                />
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader className="border-b-2 pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle>Payroll Runs ({payrollRuns.length})</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Export</Button>
                    <Button onClick={() => setIsPayrollRunModalOpen(true)} size="sm">+ New Payroll Run</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs uppercase tracking-wide">Run ID</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Pay Period</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Pay Date</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Employees</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide text-right">Gross Pay</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide text-right">Net Pay</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Processed By</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Status</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payrollRuns.map((run) => (
                      <TableRow key={run.id} className="hover:bg-slate-50 border-b last:border-b-0">
                        <TableCell className="font-mono text-sm font-medium">{run.runId}</TableCell>
                        <TableCell>{run.payPeriod}</TableCell>
                        <TableCell>{run.payDate}</TableCell>
                        <TableCell>{run.employeeCount}</TableCell>
                        <TableCell className="text-right">${run.grossPay.toLocaleString()}</TableCell>
                        <TableCell className="text-right">${run.netPay.toLocaleString()}</TableCell>
                        <TableCell>{run.processedBy}</TableCell>
                        <TableCell>
                          <Badge className={`inline-flex px-2 py-1 rounded-full text-xs ${
                            run.status === 'Completed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {run.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <button className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1">View</button>
                          {run.status === 'Processing' && (
                            <button className="text-orange-600 hover:text-orange-800 text-sm px-2 py-1">Edit</button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === 'pay-schedules' && (
          <>
            <Card className="border-2">
              <CardContent className="py-3 px-4">
                <Input
                  type="text"
                  placeholder="Search pay schedules..."
                  className="w-full"
                />
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader className="border-b-2 pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle>Pay Schedules ({paySchedules.length})</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Export</Button>
                    <Button onClick={() => setIsScheduleModalOpen(true)} size="sm">+ New Schedule</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs uppercase tracking-wide">Schedule Name</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Frequency</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Pay Day</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Employees</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Next Pay Date</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Status</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paySchedules.map((schedule) => (
                      <TableRow key={schedule.id} className="hover:bg-slate-50 border-b last:border-b-0">
                        <TableCell className="font-medium">{schedule.scheduleName}</TableCell>
                        <TableCell>
                          <Badge className="inline-flex px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                            {schedule.frequency}
                          </Badge>
                        </TableCell>
                        <TableCell>{schedule.payDay}</TableCell>
                        <TableCell>{schedule.employeeCount}</TableCell>
                        <TableCell>{schedule.nextPayDate}</TableCell>
                        <TableCell>
                          <Badge className="inline-flex px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            {schedule.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <button className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1">View</button>
                          <button className="text-orange-600 hover:text-orange-800 text-sm px-2 py-1">Edit</button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === 'employee-payroll' && (
          <>
            <Card className="border-2">
              <CardContent className="py-3 px-4">
                <Input
                  type="text"
                  placeholder="Search employees..."
                  className="w-full"
                />
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader className="border-b-2 pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle>Employee Payroll ({employeePayroll.length})</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Export</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs uppercase tracking-wide">Employee ID</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Employee Name</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Department</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Position</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide text-right">Base Salary</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide text-right">Allowances</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide text-right">Deductions</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide text-right">Net Pay</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Status</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employeePayroll.map((emp) => (
                      <TableRow key={emp.id} className="hover:bg-slate-50 border-b last:border-b-0">
                        <TableCell className="font-mono text-sm font-medium">{emp.employeeId}</TableCell>
                        <TableCell className="font-medium">{emp.employeeName}</TableCell>
                        <TableCell>{emp.department}</TableCell>
                        <TableCell>{emp.position}</TableCell>
                        <TableCell className="text-right">${emp.baseSalary.toLocaleString()}</TableCell>
                        <TableCell className="text-right">${emp.allowances.toLocaleString()}</TableCell>
                        <TableCell className="text-right">${emp.deductions.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-bold">${emp.netPay.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className="inline-flex px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            {emp.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <button className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1">View</button>
                          <button className="text-orange-600 hover:text-orange-800 text-sm px-2 py-1">Edit</button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === 'deductions' && (
          <>
            <Card className="border-2">
              <CardContent className="py-3 px-4">
                <Input
                  type="text"
                  placeholder="Search deductions..."
                  className="w-full"
                />
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader className="border-b-2 pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle>Deductions ({deductions.length})</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Export</Button>
                    <Button onClick={() => setIsDeductionModalOpen(true)} size="sm">+ New Deduction</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs uppercase tracking-wide">Code</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Deduction Name</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Type</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Calculation</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide text-right">Rate</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Employees</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Status</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deductions.map((deduction) => (
                      <TableRow key={deduction.id} className="hover:bg-slate-50 border-b last:border-b-0">
                        <TableCell className="font-mono text-sm font-medium">{deduction.deductionCode}</TableCell>
                        <TableCell className="font-medium">{deduction.deductionName}</TableCell>
                        <TableCell>
                          <Badge className={`inline-flex px-2 py-1 rounded-full text-xs ${
                            deduction.type === 'Statutory' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {deduction.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{deduction.calculationType}</TableCell>
                        <TableCell className="text-right">
                          {deduction.calculationType === 'Percentage' 
                            ? `${deduction.rate}%` 
                            : `$${deduction.rate.toLocaleString()}`
                          }
                        </TableCell>
                        <TableCell>{deduction.applicableEmployees}</TableCell>
                        <TableCell>
                          <Badge className={`inline-flex px-2 py-1 rounded-full text-xs ${
                            deduction.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {deduction.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <button className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1">View</button>
                          <button className="text-orange-600 hover:text-orange-800 text-sm px-2 py-1">Edit</button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === 'tax-filings' && (
          <>
            <Card className="border-2">
              <CardContent className="py-3 px-4">
                <Input
                  type="text"
                  placeholder="Search tax filings..."
                  className="w-full"
                />
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader className="border-b-2 pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle>Tax Filings ({taxFilings.length})</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Export</Button>
                    <Button onClick={() => setIsTaxFilingModalOpen(true)} size="sm">+ New Filing</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs uppercase tracking-wide">Filing ID</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Filing Type</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Tax Period</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Due Date</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide text-right">Total Tax</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Filed By</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Status</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {taxFilings.map((filing) => (
                      <TableRow key={filing.id} className="hover:bg-slate-50 border-b last:border-b-0">
                        <TableCell className="font-mono text-sm font-medium">{filing.filingId}</TableCell>
                        <TableCell>{filing.filingType}</TableCell>
                        <TableCell>{filing.taxPeriod}</TableCell>
                        <TableCell>{filing.dueDate}</TableCell>
                        <TableCell className="text-right">${filing.totalTax.toLocaleString()}</TableCell>
                        <TableCell>{filing.filedBy || '-'}</TableCell>
                        <TableCell>
                          <Badge className={`inline-flex px-2 py-1 rounded-full text-xs ${
                            filing.status === 'Filed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {filing.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <button className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1">View</button>
                          {filing.status === 'Pending' && (
                            <>
                              <button className="text-green-600 hover:text-green-800 text-sm px-2 py-1">File</button>
                              <button className="text-orange-600 hover:text-orange-800 text-sm px-2 py-1">Edit</button>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === 'reports' && (
          <>
            <Card className="border-2">
              <CardHeader className="border-b-2 pb-4">
                <CardTitle>Payroll Reports</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-slate-800 mb-2">Payroll Summary Report</h3>
                      <p className="text-sm text-slate-600 mb-4">Comprehensive overview of payroll costs by period</p>
                      <Button size="sm" variant="outline">Generate Report</Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="border hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-slate-800 mb-2">Tax Summary Report</h3>
                      <p className="text-sm text-slate-600 mb-4">Tax withholdings and employer contributions</p>
                      <Button size="sm" variant="outline">Generate Report</Button>
                    </CardContent>
                  </Card>

                  <Card className="border hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-slate-800 mb-2">Employee Earnings Report</h3>
                      <p className="text-sm text-slate-600 mb-4">Individual employee earnings and deductions</p>
                      <Button size="sm" variant="outline">Generate Report</Button>
                    </CardContent>
                  </Card>

                  <Card className="border hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-slate-800 mb-2">Department Payroll Report</h3>
                      <p className="text-sm text-slate-600 mb-4">Payroll costs breakdown by department</p>
                      <Button size="sm" variant="outline">Generate Report</Button>
                    </CardContent>
                  </Card>

                  <Card className="border hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-slate-800 mb-2">Year-to-Date Report</h3>
                      <p className="text-sm text-slate-600 mb-4">YTD earnings, taxes, and deductions</p>
                      <Button size="sm" variant="outline">Generate Report</Button>
                    </CardContent>
                  </Card>

                  <Card className="border hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-slate-800 mb-2">Statutory Compliance Report</h3>
                      <p className="text-sm text-slate-600 mb-4">Compliance with labor laws and regulations</p>
                      <Button size="sm" variant="outline">Generate Report</Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Payroll Run Modal */}
        <Modal isOpen={isPayrollRunModalOpen} onClose={() => setIsPayrollRunModalOpen(false)} title="Create Payroll Run" size="lg">
          <form onSubmit={handlePayrollRunSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                name="paySchedule"
                label="Pay Schedule"
                options={[
                  { value: 'bi-weekly-admin', label: 'Bi-Weekly - Admin Staff' },
                  { value: 'monthly-medical', label: 'Monthly - Medical Staff' },
                ]}
                required
              />
              <Input name="payDate" label="Pay Date" type="date" required />
              <Input name="periodStart" label="Period Start" type="date" required />
              <Input name="periodEnd" label="Period End" type="date" required />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsPayrollRunModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Process Payroll</Button>
            </div>
          </form>
        </Modal>

        {/* Pay Schedule Modal */}
        <Modal isOpen={isScheduleModalOpen} onClose={() => setIsScheduleModalOpen(false)} title="Create Pay Schedule" size="lg">
          <form onSubmit={handleScheduleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="scheduleName" label="Schedule Name" placeholder="Bi-Weekly - Admin Staff" required />
              <Select
                name="frequency"
                label="Frequency"
                options={[
                  { value: 'weekly', label: 'Weekly' },
                  { value: 'bi-weekly', label: 'Bi-Weekly' },
                  { value: 'semi-monthly', label: 'Semi-Monthly' },
                  { value: 'monthly', label: 'Monthly' },
                ]}
                required
              />
              <Input name="payDay" label="Pay Day" placeholder="Friday" required />
              <Input name="firstPayDate" label="First Pay Date" type="date" required />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsScheduleModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Schedule</Button>
            </div>
          </form>
        </Modal>

        {/* Deduction Modal */}
        <Modal isOpen={isDeductionModalOpen} onClose={() => setIsDeductionModalOpen(false)} title="Create Deduction" size="lg">
          <form onSubmit={handleDeductionSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="deductionCode" label="Deduction Code" placeholder="TAX-FED" required />
              <Input name="deductionName" label="Deduction Name" placeholder="Federal Income Tax" required />
              <Select
                name="type"
                label="Type"
                options={[
                  { value: 'statutory', label: 'Statutory' },
                  { value: 'voluntary', label: 'Voluntary' },
                ]}
                required
              />
              <Select
                name="calculationType"
                label="Calculation Type"
                options={[
                  { value: 'percentage', label: 'Percentage' },
                  { value: 'fixed', label: 'Fixed Amount' },
                ]}
                required
              />
              <Input name="rate" label="Rate / Amount" type="number" step="0.01" required />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDeductionModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Deduction</Button>
            </div>
          </form>
        </Modal>

        {/* Tax Filing Modal */}
        <Modal isOpen={isTaxFilingModalOpen} onClose={() => setIsTaxFilingModalOpen(false)} title="Create Tax Filing" size="lg">
          <form onSubmit={handleTaxFilingSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                name="filingType"
                label="Filing Type"
                options={[
                  { value: 'quarterly', label: 'Quarterly Tax Return' },
                  { value: 'annual', label: 'Annual Tax Return' },
                  { value: 'w2', label: 'W-2 Forms' },
                  { value: '1099', label: '1099 Forms' },
                ]}
                required
              />
              <Input name="taxPeriod" label="Tax Period" placeholder="Q1 2024" required />
              <Input name="dueDate" label="Due Date" type="date" required />
              <Input name="totalTax" label="Total Tax Amount" type="number" step="0.01" required />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsTaxFilingModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Filing</Button>
            </div>
          </form>
        </Modal>
      </VStack>
    </ContentArea>
  );
}
