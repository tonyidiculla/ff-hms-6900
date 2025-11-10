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

export default function ChartOfAccountsPage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [accountType, setAccountType] = React.useState('');

  // Placeholder data
  const accounts = [
    { id: 1, code: '1000', name: 'Cash', type: 'Asset', category: 'Current Asset', balance: 50000, status: 'active' },
    { id: 2, code: '1100', name: 'Accounts Receivable', type: 'Asset', category: 'Current Asset', balance: 25000, status: 'active' },
    { id: 3, code: '2000', name: 'Accounts Payable', type: 'Liability', category: 'Current Liability', balance: 15000, status: 'active' },
    { id: 4, code: '3000', name: 'Capital', type: 'Equity', category: 'Owner Equity', balance: 100000, status: 'active' },
    { id: 5, code: '4000', name: 'Service Revenue', type: 'Revenue', category: 'Operating Revenue', balance: 75000, status: 'active' },
    { id: 6, code: '5000', name: 'Salaries Expense', type: 'Expense', category: 'Operating Expense', balance: 30000, status: 'active' },
  ];

  const filteredAccounts = accounts.filter((acc) =>
    (searchTerm === '' ||
      acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.code.includes(searchTerm)) &&
    (accountType === '' || acc.type === accountType)
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Asset': return 'bg-blue-100 text-blue-800';
      case 'Liability': return 'bg-red-100 text-red-800';
      case 'Equity': return 'bg-purple-100 text-purple-800';
      case 'Revenue': return 'bg-green-100 text-green-800';
      case 'Expense': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log('Creating account:', Object.fromEntries(formData));
    setIsModalOpen(false);
    e.currentTarget.reset();
  };

  return (
    <ContentArea>
      <VStack size="sm">
        <div className="flex justify-between items-center shrink-0 mb-3">
          <div className="flex items-baseline gap-3">
            <h1 className="text-3xl font-bold text-foreground">Chart of Accounts</h1>
            <p className="text-muted-foreground text-sm">Manage your general ledger account structure</p>
          </div>
        </div>

        {/* Stats Cards - Style 1: Modern Elevated */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-200 border-l-4 border-l-blue-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Total Accounts</p>
                  <div className="text-2xl font-bold text-blue-600 mt-1">{accounts.length}</div>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">📊</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-200 border-l-4 border-l-blue-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Assets</p>
                  <div className="text-2xl font-bold text-blue-600 mt-1">
                    {accounts.filter(a => a.type === 'Asset').length}
                  </div>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">💼</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-200 border-l-4 border-l-red-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Liabilities</p>
                  <div className="text-2xl font-bold text-red-600 mt-1">
                    {accounts.filter(a => a.type === 'Liability').length}
                  </div>
                </div>
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">📉</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-200 border-l-4 border-l-green-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Revenue</p>
                  <div className="text-2xl font-bold text-green-600 mt-1">
                    {accounts.filter(a => a.type === 'Revenue').length}
                  </div>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">💰</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-200 border-l-4 border-l-orange-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Expenses</p>
                  <div className="text-2xl font-bold text-orange-600 mt-1">
                    {accounts.filter(a => a.type === 'Expense').length}
                  </div>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">💸</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-2">
          <CardContent className="py-3 px-4">
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search by account name or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="w-48">
                <Select
                  options={[
                    { value: '', label: 'All Types' },
                    { value: 'Asset', label: 'Asset' },
                    { value: 'Liability', label: 'Liability' },
                    { value: 'Equity', label: 'Equity' },
                    { value: 'Revenue', label: 'Revenue' },
                    { value: 'Expense', label: 'Expense' },
                  ]}
                  onChange={(e) => setAccountType(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Accounts Table - Style 3: Compact & Minimal */}
        <Card className="border-2">
          <CardHeader className="border-b-2 pb-4">
            <div className="flex justify-between items-center">
              <CardTitle>Accounts ({filteredAccounts.length})</CardTitle>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">Export</Button>
                <Button size="sm" onClick={() => setIsModalOpen(true)}>+ New Account</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-b">
                  <TableHead className="text-xs uppercase tracking-wide">Account Code</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Account Name</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Type</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Category</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide text-right">Balance</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Status</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAccounts.map((account) => (
                  <TableRow key={account.id} className="hover:bg-slate-50 border-b last:border-b-0">
                    <TableCell className="font-mono text-sm font-medium">{account.code}</TableCell>
                    <TableCell className="text-sm">{account.name}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(account.type)}`}>
                        {account.type}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{account.category}</TableCell>
                    <TableCell className="text-right text-sm font-semibold">${account.balance.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {account.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <button className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1">View</button>
                        <button className="text-slate-600 hover:text-slate-800 text-sm px-2 py-1">Edit</button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Create Account Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Account" size="lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="code" label="Account Code" placeholder="1000" required />
              <Input name="name" label="Account Name" placeholder="Cash in Bank" required />
              <Select
                name="type"
                label="Account Type"
                options={[
                  { value: 'Asset', label: 'Asset' },
                  { value: 'Liability', label: 'Liability' },
                  { value: 'Equity', label: 'Equity' },
                  { value: 'Revenue', label: 'Revenue' },
                  { value: 'Expense', label: 'Expense' },
                ]}
                required
              />
              <Input name="category" label="Category" placeholder="Current Asset" required />
              <Input name="description" label="Description" placeholder="Optional description" />
              <Select
                name="currency"
                label="Currency"
                options={[
                  { value: 'USD', label: 'USD' },
                  { value: 'EUR', label: 'EUR' },
                  { value: 'GBP', label: 'GBP' },
                ]}
                required
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsModalOpen(false)} type="button">
                Cancel
              </Button>
              <Button type="submit">Create Account</Button>
            </div>
          </form>
        </Modal>
      </VStack>
    </ContentArea>
  );
}
