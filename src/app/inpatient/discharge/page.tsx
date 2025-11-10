'use client';

import React from 'react';
import { ContentArea, VStack } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Search, Home, FileText, Calendar, DollarSign, AlertCircle } from 'lucide-react';

export default function DischargePlanningPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');

  // Mock discharge planning data
  const dischargePlans = [
    {
      id: 'DP-001',
      patient: 'Buddy',
      owner: 'Mike Brown',
      species: 'Dog',
      admissionDate: '2024-11-06',
      expectedDischarge: '2024-11-10',
      actualDischarge: null,
      condition: 'stable',
      status: 'planned',
      ward: 'General',
      bed: 'B202',
      diagnosis: 'Post-operative recovery',
      followUp: true,
      medications: ['Pain Relief', 'Antibiotics'],
      specialInstructions: 'Limited activity for 2 weeks',
      estimatedCost: 1250.00,
      paidAmount: 800.00
    },
    {
      id: 'DP-002',
      patient: 'Max',
      owner: 'John Smith',
      species: 'Dog',
      admissionDate: '2024-11-07',
      expectedDischarge: '2024-11-09',
      actualDischarge: null,
      condition: 'improving',
      status: 'ready',
      ward: 'ICU',
      bed: 'B101',
      diagnosis: 'Severe dehydration',
      followUp: true,
      medications: ['Electrolytes'],
      specialInstructions: 'Monitor hydration levels',
      estimatedCost: 2100.00,
      paidAmount: 2100.00
    },
    {
      id: 'DP-003',
      patient: 'Whiskers',
      owner: 'Sarah Johnson',
      species: 'Cat',
      admissionDate: '2024-11-05',
      expectedDischarge: '2024-11-08',
      actualDischarge: '2024-11-08',
      condition: 'recovered',
      status: 'completed',
      ward: 'General',
      bed: 'B201',
      diagnosis: 'Upper respiratory infection',
      followUp: true,
      medications: ['Antibiotics', 'Anti-inflammatory'],
      specialInstructions: 'Keep isolated from other cats for 1 week',
      estimatedCost: 850.00,
      paidAmount: 850.00
    },
  ];

  const filteredPlans = dischargePlans.filter(plan => {
    const matchesSearch = plan.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || plan.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-slate-100 text-slate-800';
      case 'delayed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'recovered': return 'bg-green-100 text-green-800';
      case 'stable': return 'bg-blue-100 text-blue-800';
      case 'improving': return 'bg-teal-100 text-teal-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const plannedCount = dischargePlans.filter(p => p.status === 'planned').length;
  const readyCount = dischargePlans.filter(p => p.status === 'ready').length;
  const completedToday = dischargePlans.filter(p => p.status === 'completed').length;
  const pendingPayments = dischargePlans.filter(p => p.estimatedCost > p.paidAmount).length;

  return (
    <ContentArea>
      <VStack size="sm">
        <div className="flex items-baseline gap-3">
          <h1 className="text-3xl font-bold text-slate-800">Discharge Planning</h1>
          <p className="text-sm text-slate-500">Manage patient discharge procedures and follow-up care</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-blue-500">
            <CardContent className="py-3 px-4">
              <div className="text-2xl font-bold text-slate-800">{plannedCount}</div>
              <p className="text-xs text-slate-500 mt-1">Planned Discharges</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-green-500">
            <CardContent className="py-3 px-4">
              <div className="text-2xl font-bold text-slate-800">{readyCount}</div>
              <p className="text-xs text-slate-500 mt-1">Ready for Discharge</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-slate-500">
            <CardContent className="py-3 px-4">
              <div className="text-2xl font-bold text-slate-800">{completedToday}</div>
              <p className="text-xs text-slate-500 mt-1">Discharged Today</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-orange-500">
            <CardContent className="py-3 px-4">
              <div className="text-2xl font-bold text-slate-800">{pendingPayments}</div>
              <p className="text-xs text-slate-500 mt-1">Pending Payments</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4 flex-wrap items-center justify-between">
              <div className="flex gap-4 flex-1">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Search by patient or plan ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  options={[
                    { value: 'all', label: 'All Status' },
                    { value: 'planned', label: 'Planned' },
                    { value: 'ready', label: 'Ready' },
                    { value: 'in-progress', label: 'In Progress' },
                    { value: 'completed', label: 'Completed' },
                    { value: 'delayed', label: 'Delayed' },
                  ]}
                  className="w-48"
                />
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <FileText className="h-4 w-4 mr-2" />
                Create Discharge Plan
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Discharge Plans */}
        <div className="space-y-4">
          {filteredPlans.map((plan) => (
            <Card key={plan.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Home className="h-5 w-5 text-blue-600" />
                    <div>
                      <CardTitle className="text-lg">{plan.patient} - {plan.owner}</CardTitle>
                      <p className="text-sm text-slate-500 mt-1">{plan.id} • {plan.species}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getConditionColor(plan.condition)}>
                      {plan.condition}
                    </Badge>
                    <Badge className={getStatusColor(plan.status)}>
                      {plan.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="details" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="medications">Medications</TabsTrigger>
                    <TabsTrigger value="followup">Follow-up</TabsTrigger>
                    <TabsTrigger value="billing">Billing</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-slate-500">Ward/Bed</p>
                        <p className="font-medium">{plan.ward} - {plan.bed}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Admission Date</p>
                        <p className="font-medium">{plan.admissionDate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Expected Discharge</p>
                        <p className="font-medium">{plan.expectedDischarge}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Actual Discharge</p>
                        <p className="font-medium">{plan.actualDischarge || 'Pending'}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-2">Diagnosis</p>
                      <p className="font-medium">{plan.diagnosis}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-2">Special Instructions</p>
                      <p className="text-sm">{plan.specialInstructions}</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="medications" className="mt-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-slate-700">Prescribed Medications</p>
                      <div className="space-y-2">
                        {plan.medications.map((med, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                            <span className="text-sm">{med}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="followup" className="mt-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">Follow-up Required: </span>
                        <Badge className={plan.followUp ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}>
                          {plan.followUp ? 'Yes' : 'No'}
                        </Badge>
                      </div>
                      {plan.followUp && (
                        <div className="mt-3 p-4 bg-blue-50 rounded-lg">
                          <p className="text-sm text-slate-700">
                            Schedule follow-up appointment for 1 week after discharge to monitor recovery progress.
                          </p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="billing" className="mt-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 rounded-lg">
                          <p className="text-xs text-slate-500 mb-1">Estimated Cost</p>
                          <p className="text-xl font-bold text-slate-800">
                            ${plan.estimatedCost.toFixed(2)}
                          </p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-lg">
                          <p className="text-xs text-slate-500 mb-1">Paid Amount</p>
                          <p className="text-xl font-bold text-green-600">
                            ${plan.paidAmount.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      {plan.estimatedCost > plan.paidAmount && (
                        <div className="flex items-start gap-2 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                          <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-orange-900">Pending Payment</p>
                            <p className="text-sm text-orange-700 mt-1">
                              Outstanding balance: ${(plan.estimatedCost - plan.paidAmount).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex gap-2 justify-end mt-4 pt-4 border-t">
                  {plan.status === 'ready' && (
                    <Button className="bg-green-600 hover:bg-green-700">
                      Process Discharge
                    </Button>
                  )}
                  {plan.status === 'planned' && (
                    <Button variant="outline">Update Plan</Button>
                  )}
                  <Button variant="ghost">View Full Details</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPlans.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-slate-500">
              No discharge plans found matching your search criteria
            </CardContent>
          </Card>
        )}
      </VStack>
    </ContentArea>
  );
}
