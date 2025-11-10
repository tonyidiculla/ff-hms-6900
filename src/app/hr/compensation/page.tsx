'use client';

import React, { useState, useEffect } from 'react';
import { ContentArea, VStack } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { hrApiClient } from '@/lib/api/hr-client';
import { useLocationCurrency } from '@/hooks/useLocationCurrency';
import { DollarSign, Edit2, Trash2, Plus, History, Clock, TrendingUp } from 'lucide-react';

interface CompGuide {
  id: number;
  job_grade: string;
  sal_min: string;
  sal_100: string;
  sal_max: string;
  over_time: string;
  is_manager?: boolean;
  created_at: string;
}

interface CompHistory {
  id: number;
  created_at: string;
  revision_date: string;
  job_grade: string;
  revision_reason: string;
  new_sal: string;
  exception_reason: string;
  user_platform_id: string;
  employee_entity_id: string;
}

export default function CompensationPage() {
  const [activeTab, setActiveTab] = useState('guide');
  const [compGuides, setCompGuides] = useState<CompGuide[]>([]);
  const [compHistory, setCompHistory] = useState<CompHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGuide, setEditingGuide] = useState<CompGuide | null>(null);
  const { countries } = useLocationCurrency();
  
  // Get currency symbol from first active country (can be enhanced later)
  const currencySymbol = countries[0]?.currency_symbol || '$';
  const currencyCode = countries[0]?.currency_code || 'USD';

  const [formData, setFormData] = useState({
    job_grade: '',
    sal_min: '',
    sal_100: '',
    sal_max: '',
    over_time: 'yes',
    is_manager: false,
  });

  useEffect(() => {
    fetchCompGuides();
    fetchCompHistory();
  }, []);

  const fetchCompGuides = async () => {
    try {
      setLoading(true);
      console.log('Fetching compensation guides from API...');
      const response = await fetch('/api/hr/compensation/guide');
      console.log('API response status:', response.status, response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        try {
          const errorData = JSON.parse(errorText);
          console.error('Parsed error:', errorData);
        } catch (e) {
          console.error('Could not parse error as JSON');
        }
        throw new Error('Failed to fetch compensation guides');
      }
      
      const data = await response.json();
      console.log('Fetched compensation guides:', data);
      setCompGuides(data);
    } catch (error) {
      console.error('Error fetching compensation guides:', error);
      setCompGuides([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompHistory = async () => {
    try {
      // TODO: Replace with actual API endpoint
      const response = await fetch('/api/hr/compensation/history');
      if (!response.ok) throw new Error('Failed to fetch compensation history');
      const data = await response.json();
      setCompHistory(data);
    } catch (error) {
      console.error('Error fetching compensation history:', error);
      // Mock data for development
      setCompHistory([
        {
          id: 1,
          created_at: new Date().toISOString(),
          revision_date: '2025-01-15',
          job_grade: 'E1',
          revision_reason: 'Annual increment',
          new_sal: '42000',
          exception_reason: '',
          user_platform_id: 'H00000001',
          employee_entity_id: 'FDT000001',
        },
      ]);
    }
  };

  const handleOpenModal = (guide?: CompGuide) => {
    if (guide) {
      setEditingGuide(guide);
      setFormData({
        job_grade: guide.job_grade,
        sal_min: guide.sal_min,
        sal_100: guide.sal_100,
        sal_max: guide.sal_max,
        over_time: guide.over_time,
        is_manager: guide.is_manager || false,
      });
    } else {
      setEditingGuide(null);
      setFormData({
        job_grade: '',
        sal_min: '',
        sal_100: '',
        sal_max: '',
        over_time: 'yes',
        is_manager: false,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingGuide(null);
    setFormData({
      job_grade: '',
      sal_min: '',
      sal_100: '',
      sal_max: '',
      over_time: 'yes',
      is_manager: false,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingGuide 
        ? `/api/hr/compensation/guide/${editingGuide.id}`
        : '/api/hr/compensation/guide';
      
      const method = editingGuide ? 'PUT' : 'POST';
      
      console.log('Submitting compensation guide:', { url, method, formData });
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error response (text):', errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { error: 'Server error', details: errorText };
        }
        
        console.error('Server error (parsed):', errorData);
        throw new Error(errorData.error || errorData.details || 'Failed to save compensation guide');
      }

      await fetchCompGuides();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving compensation guide:', error);
      alert(error instanceof Error ? error.message : 'Failed to save compensation guide');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this compensation guide?')) return;

    try {
      const response = await fetch(`/api/hr/compensation/guide/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete compensation guide');

      await fetchCompGuides();
    } catch (error) {
      console.error('Error deleting compensation guide:', error);
      alert('Failed to delete compensation guide');
    }
  };

  const formatCurrency = (amount: string) => {
    if (!amount) return '-';
    return `${currencySymbol}${parseFloat(amount).toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <ContentArea>
      <VStack size="sm">
        <div className="flex items-baseline gap-3">
          <h1 className="text-3xl font-bold text-slate-800">Compensation & Benefits</h1>
          <p className="text-sm text-slate-500">Manage salary structures and track compensation changes</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-blue-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Total Grades</p>
                  <p className="text-2xl font-bold text-slate-800">{compGuides.length}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-green-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Revisions</p>
                  <p className="text-2xl font-bold text-slate-800">{compHistory.length}</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                  <History className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-purple-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">OT Eligible</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {compGuides.filter(g => g.over_time === 'yes').length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-orange-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Avg Growth</p>
                  <p className="text-2xl font-bold text-slate-800">-</p>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="guide">
          <TabsList className="mb-6">
            <TabsTrigger value="guide" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Compensation Guide
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              Compensation History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="guide" className="mt-0">
            <Card className="shadow-lg">
              <CardHeader className="border-b bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold text-slate-800">Salary Grade Structure</CardTitle>
                  <Button onClick={() => handleOpenModal()} size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Grade
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <div className="text-center py-12 text-slate-500">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mb-2"></div>
                    <p>Loading...</p>
                  </div>
                ) : compGuides.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <DollarSign className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600 font-medium mb-1">No compensation guides found</p>
                    <p className="text-sm text-slate-500">Click "Add Grade" to create your first salary grade</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50/50">
                        <TableHead className="font-semibold">Job Grade</TableHead>
                        <TableHead className="font-semibold">Minimum Salary</TableHead>
                        <TableHead className="font-semibold">Target (100%)</TableHead>
                        <TableHead className="font-semibold">Maximum Salary</TableHead>
                        <TableHead className="font-semibold">Overtime</TableHead>
                        <TableHead className="font-semibold">Manager Grade</TableHead>
                        <TableHead className="text-right font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {compGuides.map((guide) => (
                        <TableRow key={guide.id} className="hover:bg-slate-50/50 transition-colors">
                          <TableCell className="font-semibold text-slate-900">{guide.job_grade}</TableCell>
                          <TableCell className="text-slate-700">{formatCurrency(guide.sal_min)}</TableCell>
                          <TableCell className="text-slate-700 font-medium">{formatCurrency(guide.sal_100)}</TableCell>
                          <TableCell className="text-slate-700">{formatCurrency(guide.sal_max)}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              guide.over_time === 'yes' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-slate-100 text-slate-800'
                            }`}>
                              {guide.over_time === 'yes' ? 'Eligible' : 'Not Eligible'}
                            </span>
                          </TableCell>
                          <TableCell>
                            {guide.is_manager && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                Manager
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenModal(guide)}
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(guide.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-0">
            <Card className="shadow-lg">
              <CardHeader className="border-b bg-slate-50/50">
                <CardTitle className="text-xl font-semibold text-slate-800">Compensation Revision History</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {compHistory.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <History className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600 font-medium mb-1">No compensation history records found</p>
                    <p className="text-sm text-slate-500">Salary revisions will appear here once recorded</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-50/50">
                          <TableHead className="font-semibold">Employee ID</TableHead>
                          <TableHead className="font-semibold">Revision Date</TableHead>
                          <TableHead className="font-semibold">Job Grade</TableHead>
                          <TableHead className="font-semibold">New Salary</TableHead>
                          <TableHead className="font-semibold">Reason</TableHead>
                          <TableHead className="font-semibold">Exception Reason</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {compHistory.map((record) => (
                          <TableRow key={record.id} className="hover:bg-slate-50/50 transition-colors">
                            <TableCell className="font-semibold text-slate-900">
                              {record.employee_entity_id}
                            </TableCell>
                            <TableCell className="text-slate-700">{formatDate(record.revision_date)}</TableCell>
                            <TableCell className="font-medium text-slate-900">{record.job_grade}</TableCell>
                            <TableCell className="text-slate-700 font-medium">{formatCurrency(record.new_sal)}</TableCell>
                            <TableCell className="text-slate-700">{record.revision_reason}</TableCell>
                            <TableCell className="text-slate-500">
                              {record.exception_reason || '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add/Edit Compensation Guide Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingGuide ? 'Edit Compensation Guide' : 'Add Compensation Guide'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Grade *
              </label>
              <Input
                type="text"
                value={formData.job_grade}
                onChange={(e) => setFormData({ ...formData, job_grade: e.target.value })}
                placeholder="e.g., E1, M1, S1"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Salary *
                </label>
                <Input
                  type="text"
                  value={formData.sal_min}
                  onChange={(e) => setFormData({ ...formData, sal_min: e.target.value })}
                  placeholder="30000"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target (100%) *
                </label>
                <Input
                  type="text"
                  value={formData.sal_100}
                  onChange={(e) => setFormData({ ...formData, sal_100: e.target.value })}
                  placeholder="40000"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Salary *
                </label>
                <Input
                  type="text"
                  value={formData.sal_max}
                  onChange={(e) => setFormData({ ...formData, sal_max: e.target.value })}
                  placeholder="50000"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Overtime Eligibility *
              </label>
              <Select
                value={formData.over_time}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                  setFormData({ ...formData, over_time: e.target.value })
                }
                options={[
                  { value: 'yes', label: 'Yes - Eligible' },
                  { value: 'no', label: 'No - Not Eligible' },
                ]}
                required
              />
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={formData.is_manager}
                  onChange={(e) => setFormData({ ...formData, is_manager: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                Manager Grade (Can be assigned to manager positions)
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button type="submit">
                {editingGuide ? 'Update' : 'Create'} Guide
              </Button>
            </div>
          </form>
        </Modal>
      </VStack>
    </ContentArea>
  );
}
