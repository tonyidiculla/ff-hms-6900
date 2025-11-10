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

export default function BankAccountsPage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const accounts = [
    {
      id: 1,
      name: 'Main Operating Account',
      bank: 'First National Bank',
      accountNumber: '****1234',
      type: 'Checking',
      balance: 125000,
      currency: 'USD',
      status: 'active',
      lastReconciled: '2024-01-25',
    },
    {
      id: 2,
      name: 'Payroll Account',
      bank: 'Commerce Bank',
      accountNumber: '****5678',
      type: 'Checking',
      balance: 85000,
      currency: 'USD',
      status: 'active',
      lastReconciled: '2024-01-28',
    },
    {
      id: 3,
      name: 'Savings Reserve',
      bank: 'First National Bank',
      accountNumber: '****9012',
      type: 'Savings',
      balance: 250000,
      currency: 'USD',
      status: 'active',
      lastReconciled: '2024-01-20',
    },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log('Creating bank account:', Object.fromEntries(formData));
    setIsModalOpen(false);
    e.currentTarget.reset();
  };

  return (
    <ContentArea maxWidth="full">
      <VStack size="sm">
        <div className="flex items-baseline gap-3 shrink-0">
          <h1 className="text-3xl font-bold text-foreground">Bank Accounts</h1>
          <p className="text-muted-foreground text-sm">Manage bank accounts and cash positions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-blue-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-foreground">{accounts.length}</div>
                  <p className="text-xs text-muted-foreground mt-2">Total Accounts</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xl">
                  🏦
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-green-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    ${accounts.reduce((sum, a) => sum + a.balance, 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Total Balance</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-xl">
                  💵
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-purple-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {accounts.filter(a => a.type === 'Checking').length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Checking Accounts</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-xl">
                  ✓
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-orange-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-orange-600">
                    {accounts.filter(a => a.type === 'Savings').length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Savings Accounts</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-xl">
                  💰
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bank Accounts Table */}
        <Card className="border-2">
          <CardHeader className="border-b-2 pb-4">
            <div className="flex justify-between items-center">
              <CardTitle>Bank Accounts</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Export</Button>
                <Button onClick={() => setIsModalOpen(true)} size="sm">+ New Account</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs uppercase tracking-wide">Account Name</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Bank</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Account Number</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Type</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide text-right">Balance</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Currency</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Last Reconciled</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Status</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((account) => (
                  <TableRow key={account.id} className="hover:bg-slate-50 border-b last:border-b-0">
                    <TableCell className="text-sm font-medium">{account.name}</TableCell>
                    <TableCell className="text-sm">{account.bank}</TableCell>
                    <TableCell className="font-mono text-sm">{account.accountNumber}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${account.type === 'Checking' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                        {account.type}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-sm font-bold text-green-600">
                      ${account.balance.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-sm">{account.currency}</TableCell>
                    <TableCell className="text-sm">{account.lastReconciled}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {account.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <button className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1">View</button>
                        <button className="text-slate-600 hover:text-slate-800 text-sm px-2 py-1">Reconcile</button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead className="text-right">Debit</TableHead>
                  <TableHead className="text-right">Credit</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>2024-01-30</TableCell>
                  <TableCell>Main Operating</TableCell>
                  <TableCell>Customer Payment</TableCell>
                  <TableCell className="text-sm text-muted-foreground">CHK-1234</TableCell>
                  <TableCell className="text-right">-</TableCell>
                  <TableCell className="text-right text-green-600">$15,000</TableCell>
                  <TableCell className="text-right font-medium">$125,000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2024-01-29</TableCell>
                  <TableCell>Main Operating</TableCell>
                  <TableCell>Vendor Payment</TableCell>
                  <TableCell className="text-sm text-muted-foreground">ACH-5678</TableCell>
                  <TableCell className="text-right text-red-600">$8,500</TableCell>
                  <TableCell className="text-right">-</TableCell>
                  <TableCell className="text-right font-medium">$110,000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2024-01-28</TableCell>
                  <TableCell>Payroll Account</TableCell>
                  <TableCell>Payroll Processing</TableCell>
                  <TableCell className="text-sm text-muted-foreground">PAY-9012</TableCell>
                  <TableCell className="text-right text-red-600">$45,000</TableCell>
                  <TableCell className="text-right">-</TableCell>
                  <TableCell className="text-right font-medium">$85,000</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Create Account Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Bank Account" size="lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="name" label="Account Name" placeholder="Main Operating Account" required />
              <Input name="bank" label="Bank Name" placeholder="First National Bank" required />
              <Input name="accountNumber" label="Account Number" placeholder="123456789" required />
              <Input name="routingNumber" label="Routing Number" placeholder="021000021" />
              <Select
                name="type"
                label="Account Type"
                options={[
                  { value: 'Checking', label: 'Checking' },
                  { value: 'Savings', label: 'Savings' },
                  { value: 'Money Market', label: 'Money Market' },
                ]}
                required
              />
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
              <Input name="openingBalance" type="number" step="0.01" label="Opening Balance" placeholder="0.00" required />
              <Input name="openingDate" type="date" label="Opening Date" required />
            </div>
            <Input name="notes" label="Notes" placeholder="Additional information" />
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
