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

export default function JournalEntriesPage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const [selectedEntry, setSelectedEntry] = React.useState<any>(null);
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [lines, setLines] = React.useState([
    { id: 1, account: '', debit: '', credit: '', description: '' },
    { id: 2, account: '', debit: '', credit: '', description: '' },
  ]);

  // Placeholder data
  const [entries, setEntries] = React.useState([
    {
      id: 1,
      number: 'JE-001',
      date: '2024-01-15',
      description: 'Monthly rent payment',
      reference: 'INV-1234',
      total: 5000,
      status: 'posted',
      createdBy: 'John Doe',
      lines: [
        { account: '5100 - Rent Expense', debit: 5000, credit: 0 },
        { account: '1000 - Cash', debit: 0, credit: 5000 },
      ],
    },
    {
      id: 2,
      number: 'JE-002',
      date: '2024-01-16',
      description: 'Customer payment received',
      reference: 'PMT-5678',
      total: 12000,
      status: 'posted',
      createdBy: 'Jane Smith',
      lines: [
        { account: '1000 - Cash', debit: 12000, credit: 0 },
        { account: '1100 - Accounts Receivable', debit: 0, credit: 12000 },
      ],
    },
    {
      id: 3,
      number: 'JE-003',
      date: '2024-01-17',
      description: 'Equipment purchase',
      reference: 'PO-9012',
      total: 8500,
      status: 'draft',
      createdBy: 'John Doe',
      lines: [
        { account: '1500 - Equipment', debit: 8500, credit: 0 },
        { account: '2000 - Accounts Payable', debit: 0, credit: 8500 },
      ],
    },
  ]);

  const accounts = [
    { value: '1000', label: '1000 - Cash' },
    { value: '1100', label: '1100 - Accounts Receivable' },
    { value: '2000', label: '2000 - Accounts Payable' },
    { value: '4000', label: '4000 - Service Revenue' },
    { value: '5000', label: '5000 - Salaries Expense' },
    { value: '5100', label: '5100 - Rent Expense' },
  ];

  const addLine = () => {
    setLines([...lines, { id: Date.now(), account: '', debit: '', credit: '', description: '' }]);
  };

  const removeLine = (id: number) => {
    if (lines.length > 2) {
      setLines(lines.filter((line) => line.id !== id));
    }
  };

  const updateLine = (id: number, field: string, value: string) => {
    setLines(lines.map((line) => (line.id === id ? { ...line, [field]: value } : line)));
  };

  const totalDebit = lines.reduce((sum, line) => sum + (parseFloat(line.debit) || 0), 0);
  const totalCredit = lines.reduce((sum, line) => sum + (parseFloat(line.credit) || 0), 0);
  const isBalanced = totalDebit === totalCredit && totalDebit > 0;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isBalanced) {
      alert('Journal entry must be balanced (debits = credits)');
      return;
    }
    const formData = new FormData(e.currentTarget);
    
    if (editMode && selectedEntry) {
      // Update existing entry
      const updatedEntry = {
        ...selectedEntry,
        date: formData.get('date') as string,
        description: formData.get('description') as string,
        reference: formData.get('reference') as string || 'N/A',
        total: totalDebit,
        lines: lines.map(line => ({
          account: accounts.find(a => a.value === line.account)?.label || line.account,
          debit: parseFloat(line.debit) || 0,
          credit: parseFloat(line.credit) || 0,
        })),
      };
      setEntries(entries.map(entry => 
        entry.id === selectedEntry.id ? updatedEntry : entry
      ));
      alert('Journal entry updated successfully!');
    } else {
      // Create new entry
      const newEntry = {
        id: entries.length + 1,
        number: `JE-${String(entries.length + 1).padStart(3, '0')}`,
        date: formData.get('date') as string,
        description: formData.get('description') as string,
        reference: formData.get('reference') as string || 'N/A',
        total: totalDebit,
        status: 'draft',
        createdBy: 'Current User',
        lines: lines.map(line => ({
          account: accounts.find(a => a.value === line.account)?.label || line.account,
          debit: parseFloat(line.debit) || 0,
          credit: parseFloat(line.credit) || 0,
        })),
      };
      setEntries([newEntry, ...entries]);
      alert('Journal entry created successfully!');
    }
    
    setIsModalOpen(false);
    setEditMode(false);
    setSelectedEntry(null);
    e.currentTarget.reset();
    setLines([
      { id: 1, account: '', debit: '', credit: '', description: '' },
      { id: 2, account: '', debit: '', credit: '', description: '' },
    ]);
  };

  const handleEditEntry = (entry: any) => {
    setSelectedEntry(entry);
    setEditMode(true);
    // Populate form with entry data
    setLines(entry.lines.map((line: any, index: number) => ({
      id: index + 1,
      account: accounts.find(a => a.label === line.account)?.value || '',
      debit: line.debit.toString(),
      credit: line.credit.toString(),
      description: '',
    })));
    setIsModalOpen(true);
  };

  const handlePostEntry = (entryId: number) => {
    setEntries(entries.map(entry => 
      entry.id === entryId 
        ? { ...entry, status: 'posted' }
        : entry
    ));
    alert(`Journal entry ${entries.find(e => e.id === entryId)?.number} has been posted!`);
  };

  const handleUnpostEntry = (entryId: number) => {
    if (confirm('Are you sure you want to unpost this journal entry? This will allow editing.')) {
      setEntries(entries.map(entry => 
        entry.id === entryId 
          ? { ...entry, status: 'draft' }
          : entry
      ));
      alert(`Journal entry ${entries.find(e => e.id === entryId)?.number} has been unposted!`);
    }
  };

  const handleDeleteEntry = (entryId: number) => {
    if (confirm('Are you sure you want to delete this journal entry?')) {
      setEntries(entries.filter(entry => entry.id !== entryId));
      alert('Journal entry deleted successfully!');
    }
  };

  const handleExport = () => {
    // Create CSV content
    const headers = ['Entry Number', 'Date', 'Description', 'Reference', 'Amount', 'Status', 'Created By'];
    const csvData = filteredEntries.map(entry => [
      entry.number,
      entry.date,
      entry.description,
      entry.reference,
      entry.total,
      entry.status,
      entry.createdBy
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `journal-entries-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    alert('Journal entries exported successfully!');
  };

  // Filter entries
  const filteredEntries = entries.filter(entry => {
    const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;
    const matchesSearch = entry.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          entry.reference.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <ContentArea>
      <VStack size="sm">
        <div className="flex justify-between items-center shrink-0 mb-3">
          <div className="flex items-baseline gap-3">
            <h1 className="text-3xl font-bold text-foreground">Journal Entries</h1>
            <p className="text-muted-foreground text-sm">Record and manage accounting transactions</p>
          </div>
        </div>

        {/* Stats Cards - Style 1: Modern Elevated */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-200 border-l-4 border-l-blue-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Total Entries</p>
                  <div className="text-2xl font-bold text-blue-600 mt-1">{entries.length}</div>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">📝</span>
                </div>
              </div>
              <div className="mt-2 flex items-center text-xs">
                <span className="text-muted-foreground">All journal entries</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-200 border-l-4 border-l-green-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Posted</p>
                  <div className="text-2xl font-bold text-green-600 mt-1">
                    {entries.filter(e => e.status === 'posted').length}
                  </div>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">✓</span>
                </div>
              </div>
              <div className="mt-2 flex items-center text-xs">
                <span className="text-green-600 font-medium">
                  {entries.length > 0 ? Math.round((entries.filter(e => e.status === 'posted').length / entries.length) * 100) : 0}%
                </span>
                <span className="text-muted-foreground ml-2">of all entries</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-200 border-l-4 border-l-yellow-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Draft</p>
                  <div className="text-2xl font-bold text-yellow-600 mt-1">
                    {entries.filter(e => e.status === 'draft').length}
                  </div>
                </div>
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">⏳</span>
                </div>
              </div>
              <div className="mt-2 flex items-center text-xs">
                <span className="text-muted-foreground">Pending posting</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-200 border-l-4 border-l-purple-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Total Posted</p>
                  <div className="text-2xl font-bold text-purple-600 mt-1">
                    ${entries.filter(e => e.status === 'posted').reduce((sum, e) => sum + e.total, 0).toLocaleString()}
                  </div>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">💰</span>
                </div>
              </div>
              <div className="mt-2 flex items-center text-xs">
                <span className="text-muted-foreground">Posted amount</span>
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
                  placeholder="Search by entry number, description, or reference..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="w-48">
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  options={[
                    { value: 'all', label: 'All Status' },
                    { value: 'draft', label: 'Draft' },
                    { value: 'posted', label: 'Posted' },
                    { value: 'approved', label: 'Approved' },
                    { value: 'reversed', label: 'Reversed' },
                  ]}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Journal Entries Table - Style 3: Compact & Minimal */}
        <Card className="border-2">
          <CardHeader className="border-b-2 pb-4">
            <div className="flex justify-between items-center">
              <CardTitle>Journal Entries ({filteredEntries.length})</CardTitle>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleExport}>
                  Export
                </Button>
                <Button size="sm" onClick={() => setIsModalOpen(true)}>
                  + New Entry
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-b">
                  <TableHead className="text-xs uppercase tracking-wide">Entry Number</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Date</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Description</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Reference</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide text-right">Amount</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Status</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Created By</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No journal entries found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEntries.map((entry) => (
                    <TableRow key={entry.id} className="hover:bg-slate-50 border-b last:border-b-0">
                      <TableCell className="font-mono text-sm font-medium">{entry.number}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{entry.date}</TableCell>
                      <TableCell className="text-sm">{entry.description}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{entry.reference}</TableCell>
                      <TableCell className="text-right text-sm font-semibold">${entry.total.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          entry.status === 'posted' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {entry.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{entry.createdBy}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {entry.status === 'draft' && (
                            <>
                              <button 
                                onClick={() => handleEditEntry(entry)}
                                className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => handlePostEntry(entry.id)}
                                className="text-green-600 hover:text-green-800 text-sm px-2 py-1"
                              >
                                Post
                              </button>
                              <button 
                                onClick={() => handleDeleteEntry(entry.id)}
                                className="text-red-600 hover:text-red-800 text-sm px-2 py-1"
                              >
                                Delete
                              </button>
                            </>
                          )}
                          {entry.status === 'posted' && (
                            <>
                              <button 
                                onClick={() => handleEditEntry(entry)}
                                className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => handleUnpostEntry(entry.id)}
                                className="text-orange-600 hover:text-orange-800 text-sm px-2 py-1"
                              >
                                Unpost
                              </button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Create/Edit Journal Entry Modal */}
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => {
            setIsModalOpen(false);
            setEditMode(false);
            setSelectedEntry(null);
            setLines([
              { id: 1, account: '', debit: '', credit: '', description: '' },
              { id: 2, account: '', debit: '', credit: '', description: '' },
            ]);
          }} 
          title={editMode ? `Edit Journal Entry: ${selectedEntry?.number}` : "Create Journal Entry"} 
          size="xl"
        >
          {editMode && selectedEntry?.status === 'posted' && (
            <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
              <p className="text-sm text-orange-800">
                ⚠️ This entry is posted. Changes will require unposting first or will create a reversing entry.
              </p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input 
                name="date" 
                type="date" 
                label="Date" 
                defaultValue={editMode ? selectedEntry?.date : ''}
                disabled={editMode && selectedEntry?.status === 'posted'}
                required 
              />
              <Input 
                name="reference" 
                label="Reference" 
                placeholder="INV-1234"
                defaultValue={editMode ? selectedEntry?.reference : ''}
                disabled={editMode && selectedEntry?.status === 'posted'}
              />
              <Select
                name="period"
                label="Period"
                disabled={editMode && selectedEntry?.status === 'posted'}
                options={[
                  { value: '2024-01', label: 'January 2024' },
                  { value: '2024-02', label: 'February 2024' },
                  { value: '2024-03', label: 'March 2024' },
                ]}
                required
              />
            </div>
            <Input 
              name="description" 
              label="Description" 
              placeholder="Transaction description" 
              defaultValue={editMode ? selectedEntry?.description : ''}
              disabled={editMode && selectedEntry?.status === 'posted'}
              required 
            />

            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">Journal Lines</h3>
                <Button type="button" variant="outline" size="sm" onClick={addLine}>
                  + Add Line
                </Button>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Account</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-[120px] text-right">Debit</TableHead>
                      <TableHead className="w-[120px] text-right">Credit</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lines.map((line) => (
                      <TableRow key={line.id}>
                        <TableCell>
                          <Select
                            options={accounts}
                            value={line.account}
                            onChange={(e) => updateLine(line.id, 'account', e.target.value)}
                            required
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={line.description}
                            onChange={(e) => updateLine(line.id, 'description', e.target.value)}
                            placeholder="Line description"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            value={line.debit}
                            onChange={(e) => updateLine(line.id, 'debit', e.target.value)}
                            placeholder="0.00"
                            className="text-right"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            value={line.credit}
                            onChange={(e) => updateLine(line.id, 'credit', e.target.value)}
                            placeholder="0.00"
                            className="text-right"
                          />
                        </TableCell>
                        <TableCell>
                          {lines.length > 2 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeLine(line.id)}
                            >
                              ×
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/50">
                      <TableCell colSpan={2} className="font-semibold text-right">Totals:</TableCell>
                      <TableCell className={`text-right font-bold ${!isBalanced && totalDebit > 0 ? 'text-red-600' : ''}`}>
                        ${totalDebit.toFixed(2)}
                      </TableCell>
                      <TableCell className={`text-right font-bold ${!isBalanced && totalCredit > 0 ? 'text-red-600' : ''}`}>
                        ${totalCredit.toFixed(2)}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {!isBalanced && (totalDebit > 0 || totalCredit > 0) && (
                <p className="text-sm text-red-600 mt-2">
                  Entry is not balanced. Difference: ${Math.abs(totalDebit - totalCredit).toFixed(2)}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsModalOpen(false);
                  setEditMode(false);
                  setSelectedEntry(null);
                }} 
                type="button"
              >
                {editMode && selectedEntry?.status === 'posted' ? 'Close' : 'Cancel'}
              </Button>
              {editMode && selectedEntry?.status === 'posted' ? (
                <Button 
                  type="button"
                  className="bg-orange-600 hover:bg-orange-700"
                  onClick={() => {
                    handleUnpostEntry(selectedEntry.id);
                    setIsModalOpen(false);
                  }}
                >
                  Unpost Entry
                </Button>
              ) : (
                <Button type="submit" disabled={!isBalanced}>
                  {editMode ? 'Update Entry' : 'Create Entry'}
                </Button>
              )}
            </div>
          </form>
        </Modal>
      </VStack>
    </ContentArea>
  );
}
