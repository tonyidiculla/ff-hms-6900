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

export default function BudgetsPage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const budgets = [
    {
      id: 1,
      name: '2024 Operating Budget',
      period: 'FY 2024',
      department: 'Operations',
      budgetAmount: 500000,
      actualAmount: 125000,
      variance: -375000,
      variancePercent: -75,
      status: 'active',
    },
    {
      id: 2,
      name: 'Q1 2024 Marketing',
      period: 'Q1 2024',
      department: 'Marketing',
      budgetAmount: 75000,
      actualAmount: 45000,
      variance: -30000,
      variancePercent: -40,
      status: 'active',
    },
    {
      id: 3,
      name: '2024 Capital Expenditure',
      period: 'FY 2024',
      department: 'Facilities',
      budgetAmount: 250000,
      actualAmount: 85000,
      variance: -165000,
      variancePercent: -66,
      status: 'active',
    },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log('Creating budget:', Object.fromEntries(formData));
    setIsModalOpen(false);
    e.currentTarget.reset();
  };

  const getVarianceColor = (variance: number) => {
    if (variance >= 0) return 'text-green-600';
    if (variance > -10000) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <ContentArea>
      <VStack size="sm">
        <div className="flex justify-between items-start shrink-0">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Budgets</h1>
            <p className="text-muted-foreground mt-1">Plan and track organizational budgets</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>+ New Budget</Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-primary">{budgets.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Active Budgets</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">
                ${budgets.reduce((sum, b) => sum + b.budgetAmount, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Total Budgeted</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">
                ${budgets.reduce((sum, b) => sum + b.actualAmount, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Total Actual</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-600">
                {Math.round((budgets.reduce((sum, b) => sum + b.actualAmount, 0) / budgets.reduce((sum, b) => sum + b.budgetAmount, 0)) * 100)}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">Utilization</p>
            </CardContent>
          </Card>
        </div>

        {/* Budget Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {budgets.map((budget) => {
                const utilizationPercent = (budget.actualAmount / budget.budgetAmount) * 100;
                return (
                  <div key={budget.id} className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{budget.name}</h4>
                        <p className="text-sm text-muted-foreground">{budget.department} • {budget.period}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">{budget.status}</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Budgeted</p>
                        <p className="font-semibold">${budget.budgetAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Actual</p>
                        <p className="font-semibold">${budget.actualAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Variance</p>
                        <p className={`font-semibold ${getVarianceColor(budget.variance)}`}>
                          ${Math.abs(budget.variance).toLocaleString()} ({budget.variancePercent}%)
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Utilization</span>
                        <span className="font-medium">{utilizationPercent.toFixed(1)}%</span>
                      </div>
                      <div className="h-4 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            utilizationPercent > 90 ? 'bg-red-500' : utilizationPercent > 75 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(utilizationPercent, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Variance Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Variance Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Budget Name</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="text-right">Budgeted</TableHead>
                  <TableHead className="text-right">Actual</TableHead>
                  <TableHead className="text-right">Variance</TableHead>
                  <TableHead className="text-right">Variance %</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {budgets.map((budget) => (
                  <TableRow key={budget.id}>
                    <TableCell className="font-medium">{budget.name}</TableCell>
                    <TableCell>{budget.period}</TableCell>
                    <TableCell>{budget.department}</TableCell>
                    <TableCell className="text-right">${budget.budgetAmount.toLocaleString()}</TableCell>
                    <TableCell className="text-right">${budget.actualAmount.toLocaleString()}</TableCell>
                    <TableCell className={`text-right font-semibold ${getVarianceColor(budget.variance)}`}>
                      ${Math.abs(budget.variance).toLocaleString()}
                    </TableCell>
                    <TableCell className={`text-right font-semibold ${getVarianceColor(budget.variance)}`}>
                      {budget.variancePercent}%
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">View</Button>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Create Budget Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Budget" size="lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="name" label="Budget Name" placeholder="2024 Operating Budget" required />
              <Select
                name="period"
                label="Period"
                options={[
                  { value: 'FY 2024', label: 'FY 2024' },
                  { value: 'Q1 2024', label: 'Q1 2024' },
                  { value: 'Q2 2024', label: 'Q2 2024' },
                  { value: 'Q3 2024', label: 'Q3 2024' },
                  { value: 'Q4 2024', label: 'Q4 2024' },
                ]}
                required
              />
              <Select
                name="department"
                label="Department"
                options={[
                  { value: 'Operations', label: 'Operations' },
                  { value: 'Marketing', label: 'Marketing' },
                  { value: 'Finance', label: 'Finance' },
                  { value: 'HR', label: 'Human Resources' },
                  { value: 'IT', label: 'IT' },
                  { value: 'Facilities', label: 'Facilities' },
                ]}
                required
              />
              <Select
                name="type"
                label="Budget Type"
                options={[
                  { value: 'Operating', label: 'Operating' },
                  { value: 'Capital', label: 'Capital Expenditure' },
                  { value: 'Project', label: 'Project' },
                  { value: 'Department', label: 'Department' },
                ]}
                required
              />
              <Input name="amount" type="number" step="0.01" label="Budget Amount" placeholder="100000" required />
              <Input name="startDate" type="date" label="Start Date" required />
              <Input name="endDate" type="date" label="End Date" required />
            </div>
            <Input name="description" label="Description" placeholder="Budget description and objectives" />
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsModalOpen(false)} type="button">
                Cancel
              </Button>
              <Button type="submit">Create Budget</Button>
            </div>
          </form>
        </Modal>
      </VStack>
    </ContentArea>
  );
}
