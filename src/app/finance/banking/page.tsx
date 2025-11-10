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

type TabType = 'bank-accounts' | 'cash-registers' | 'transactions' | 'reconciliations';

export default function BankingCashPage() {
  const [activeTab, setActiveTab] = React.useState<TabType>('bank-accounts');
  const [isBankAccountModalOpen, setIsBankAccountModalOpen] = React.useState(false);
  const [isCashRegisterModalOpen, setIsCashRegisterModalOpen] = React.useState(false);

  // Sample data
  const bankAccounts = [
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

  const cashRegisters = [
    {
      id: 1,
      name: 'Front Desk Register 1',
      location: 'Reception',
      balance: 5000,
      openingBalance: 3000,
      status: 'open',
      lastOpened: '2024-01-30 08:00',
      assignedTo: 'Jane Smith',
    },
    {
      id: 2,
      name: 'Pharmacy Counter',
      location: 'Pharmacy',
      balance: 3500,
      openingBalance: 2000,
      status: 'open',
      lastOpened: '2024-01-30 08:30',
      assignedTo: 'Bob Johnson',
    },
    {
      id: 3,
      name: 'Emergency Register',
      location: 'ER',
      balance: 1200,
      openingBalance: 1000,
      status: 'closed',
      lastOpened: '2024-01-29 20:00',
      assignedTo: 'Mike Davis',
    },
  ];

  const transactions = [
    {
      id: 1,
      date: '2024-01-30',
      account: 'Main Operating',
      type: 'Credit',
      description: 'Customer Payment',
      reference: 'CHK-1234',
      debit: 0,
      credit: 15000,
      balance: 125000,
    },
    {
      id: 2,
      date: '2024-01-29',
      account: 'Main Operating',
      type: 'Debit',
      description: 'Vendor Payment',
      reference: 'ACH-5678',
      debit: 8500,
      credit: 0,
      balance: 110000,
    },
    {
      id: 3,
      date: '2024-01-28',
      account: 'Payroll Account',
      type: 'Debit',
      description: 'Payroll Processing',
      reference: 'PAY-9012',
      debit: 45000,
      credit: 0,
      balance: 85000,
    },
    {
      id: 4,
      date: '2024-01-30',
      account: 'Front Desk Register 1',
      type: 'Credit',
      description: 'Cash sale',
      reference: 'CASH-001',
      debit: 0,
      credit: 350,
      balance: 5000,
    },
  ];

  const reconciliations = [
    {
      id: 1,
      account: 'Main Operating Account',
      date: '2024-01-25',
      period: 'January 2024',
      statementBalance: 125000,
      bookBalance: 125000,
      difference: 0,
      status: 'completed',
      reconciledBy: 'Finance Manager',
    },
    {
      id: 2,
      account: 'Payroll Account',
      date: '2024-01-28',
      period: 'January 2024',
      statementBalance: 85000,
      bookBalance: 85200,
      difference: -200,
      status: 'in-progress',
      reconciledBy: 'Accountant',
    },
    {
      id: 3,
      account: 'Savings Reserve',
      date: '2024-01-20',
      period: 'January 2024',
      statementBalance: 250000,
      bookBalance: 250000,
      difference: 0,
      status: 'completed',
      reconciledBy: 'Finance Manager',
    },
  ];

  const handleBankAccountSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log('Creating bank account:', Object.fromEntries(formData));
    setIsBankAccountModalOpen(false);
    e.currentTarget.reset();
  };

  const handleCashRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log('Creating cash register:', Object.fromEntries(formData));
    setIsCashRegisterModalOpen(false);
    e.currentTarget.reset();
  };

  const totalBankBalance = bankAccounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalCashBalance = cashRegisters.reduce((sum, reg) => sum + reg.balance, 0);

  return (
    <ContentArea>
      <VStack size="sm">
        <div className="flex items-baseline gap-3 shrink-0">
          <h1 className="text-3xl font-bold text-foreground">Banking & Cash Management</h1>
          <p className="text-muted-foreground text-sm">Manage bank accounts, cash registers, and reconciliations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-blue-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-foreground">{bankAccounts.length}</div>
                  <p className="text-xs text-muted-foreground mt-2">Bank Accounts</p>
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
                    ${totalBankBalance.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Total Bank Balance</p>
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
                    {cashRegisters.filter(r => r.status === 'open').length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Open Registers</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-xl">
                  📂
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-orange-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-orange-600">
                    ${totalCashBalance.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Total Cash</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-xl">
                  💰
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="border-b-2 border-gray-200">
          <nav className="-mb-px flex space-x-6">
            <button
              onClick={() => setActiveTab('bank-accounts')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'bank-accounts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Bank Accounts
            </button>
            <button
              onClick={() => setActiveTab('cash-registers')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'cash-registers'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Cash Registers
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'transactions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Transactions
            </button>
            <button
              onClick={() => setActiveTab('reconciliations')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'reconciliations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Reconciliation
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'bank-accounts' && (
          <>
            <Card className="border-2">
              <CardContent className="py-3 px-4">
                <Input
                  type="text"
                  placeholder="Search bank accounts..."
                  className="w-full"
                />
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardHeader className="border-b-2 pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle>Bank Accounts ({bankAccounts.length})</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Export</Button>
                    <Button onClick={() => setIsBankAccountModalOpen(true)} size="sm">+ New Bank Account</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account Name</TableHead>
                    <TableHead>Bank</TableHead>
                    <TableHead>Account Number</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                    <TableHead>Currency</TableHead>
                    <TableHead>Last Reconciled</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bankAccounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell className="font-medium">{account.name}</TableCell>
                      <TableCell>{account.bank}</TableCell>
                      <TableCell className="font-mono text-sm">{account.accountNumber}</TableCell>
                      <TableCell>
                        <Badge className={account.type === 'Checking' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}>
                          {account.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-bold text-green-600">
                        ${account.balance.toLocaleString()}
                      </TableCell>
                      <TableCell>{account.currency}</TableCell>
                      <TableCell className="text-sm">{account.lastReconciled}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">{account.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">View</Button>
                          <Button variant="ghost" size="sm">Reconcile</Button>
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

        {activeTab === 'cash-registers' && (
          <>
            <Card className="border-2">
              <CardContent className="py-3 px-4">
                <Input
                  type="text"
                  placeholder="Search cash registers..."
                  className="w-full"
                />
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardHeader className="border-b-2 pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle>Cash Registers ({cashRegisters.length})</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Export</Button>
                    <Button onClick={() => setIsCashRegisterModalOpen(true)} size="sm">+ New Cash Register</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Register Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead className="text-right">Opening Balance</TableHead>
                    <TableHead className="text-right">Current Balance</TableHead>
                    <TableHead>Last Opened</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cashRegisters.map((register) => (
                    <TableRow key={register.id}>
                      <TableCell className="font-medium">{register.name}</TableCell>
                      <TableCell>{register.location}</TableCell>
                      <TableCell className="text-sm">{register.assignedTo}</TableCell>
                      <TableCell className="text-right">${register.openingBalance.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-bold text-green-600">
                        ${register.balance.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-sm">{register.lastOpened}</TableCell>
                      <TableCell>
                        <Badge className={register.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {register.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">View</Button>
                          <Button variant="ghost" size="sm">{register.status === 'open' ? 'Close' : 'Open'}</Button>
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

        {activeTab === 'transactions' && (
          <>
            <Card className="border-2">
              <CardContent className="py-3 px-4">
                <Input
                  type="text"
                  placeholder="Search transactions..."
                  className="w-full"
                />
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardHeader className="border-b-2 pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle>Transactions ({transactions.length})</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Export</Button>
                    <Button size="sm">+ New Transaction</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead className="text-right">Debit</TableHead>
                    <TableHead className="text-right">Credit</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((txn) => (
                    <TableRow key={txn.id}>
                      <TableCell>{txn.date}</TableCell>
                      <TableCell className="font-medium">{txn.account}</TableCell>
                      <TableCell>
                        <Badge className={txn.type === 'Credit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {txn.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{txn.description}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{txn.reference}</TableCell>
                      <TableCell className="text-right text-red-600">
                        {txn.debit > 0 ? `$${txn.debit.toLocaleString()}` : '-'}
                      </TableCell>
                      <TableCell className="text-right text-green-600">
                        {txn.credit > 0 ? `$${txn.credit.toLocaleString()}` : '-'}
                      </TableCell>
                      <TableCell className="text-right font-medium">${txn.balance.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          </>
        )}

        {activeTab === 'reconciliations' && (
          <>
            <Card className="border-2">
              <CardContent className="py-3 px-4">
                <Input
                  type="text"
                  placeholder="Search reconciliations..."
                  className="w-full"
                />
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardHeader className="border-b-2 pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle>Bank Reconciliations ({reconciliations.length})</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Export</Button>
                    <Button size="sm">+ New Reconciliation</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead className="text-right">Statement Balance</TableHead>
                    <TableHead className="text-right">Book Balance</TableHead>
                    <TableHead className="text-right">Difference</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reconciled By</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reconciliations.map((recon) => (
                    <TableRow key={recon.id}>
                      <TableCell className="font-medium">{recon.account}</TableCell>
                      <TableCell>{recon.date}</TableCell>
                      <TableCell className="text-sm">{recon.period}</TableCell>
                      <TableCell className="text-right">${recon.statementBalance.toLocaleString()}</TableCell>
                      <TableCell className="text-right">${recon.bookBalance.toLocaleString()}</TableCell>
                      <TableCell className={`text-right font-bold ${recon.difference === 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {recon.difference === 0 ? 'Balanced' : `$${Math.abs(recon.difference).toLocaleString()}`}
                      </TableCell>
                      <TableCell>
                        <Badge className={recon.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {recon.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{recon.reconciledBy}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          </>
        )}

        {/* Create Bank Account Modal */}
        <Modal isOpen={isBankAccountModalOpen} onClose={() => setIsBankAccountModalOpen(false)} title="Create Bank Account" size="lg">
          <form onSubmit={handleBankAccountSubmit} className="space-y-4">
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
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsBankAccountModalOpen(false)} type="button">
                Cancel
              </Button>
              <Button type="submit">Create Account</Button>
            </div>
          </form>
        </Modal>

        {/* Create Cash Register Modal */}
        <Modal isOpen={isCashRegisterModalOpen} onClose={() => setIsCashRegisterModalOpen(false)} title="Create Cash Register" size="lg">
          <form onSubmit={handleCashRegisterSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="name" label="Register Name" placeholder="Front Desk Register 1" required />
              <Input name="location" label="Location" placeholder="Reception" required />
              <Input name="assignedTo" label="Assigned To" placeholder="Employee Name" required />
              <Input name="openingBalance" type="number" step="0.01" label="Opening Balance" placeholder="0.00" required />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsCashRegisterModalOpen(false)} type="button">
                Cancel
              </Button>
              <Button type="submit">Create Register</Button>
            </div>
          </form>
        </Modal>
      </VStack>
    </ContentArea>
  );
}
