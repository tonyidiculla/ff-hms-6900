'use client';

import React from 'react';
import { ContentArea, VStack } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Search, AlertTriangle, AlertCircle, Info } from 'lucide-react';

export default function DrugInteractionsPage() {
  const [searchTerm, setSearchTerm] = React.useState('');

  // Mock drug interaction data
  const interactions = [
    {
      id: 'INT-001',
      patient: 'Max',
      owner: 'John Smith',
      drug1: 'Amoxicillin',
      drug2: 'Metronidazole',
      severity: 'moderate',
      description: 'May increase risk of gastrointestinal upset when used together',
      recommendation: 'Monitor for vomiting or diarrhea. Consider spacing doses.',
      prescribedBy: 'Dr. Smith',
      date: '2024-11-09',
      status: 'active'
    },
    {
      id: 'INT-002',
      patient: 'Luna',
      owner: 'Emily Davis',
      drug1: 'Prednisolone',
      drug2: 'NSAIDs',
      severity: 'high',
      description: 'Concurrent use significantly increases risk of GI ulceration and bleeding',
      recommendation: 'Avoid combination. Use alternative anti-inflammatory if needed.',
      prescribedBy: 'Dr. Johnson',
      date: '2024-11-09',
      status: 'flagged'
    },
    {
      id: 'INT-003',
      patient: 'Buddy',
      owner: 'Mike Brown',
      drug1: 'Gabapentin',
      drug2: 'Tramadol',
      severity: 'moderate',
      description: 'Combined CNS depression may cause excessive sedation',
      recommendation: 'Start with lower doses. Monitor for excessive drowsiness.',
      prescribedBy: 'Dr. Williams',
      date: '2024-11-08',
      status: 'resolved'
    },
    {
      id: 'INT-004',
      patient: 'Whiskers',
      owner: 'Sarah Johnson',
      drug1: 'Phenobarbital',
      drug2: 'Chloramphenicol',
      severity: 'high',
      description: 'Chloramphenicol inhibits metabolism of phenobarbital, increasing seizure risk',
      recommendation: 'Use alternative antibiotic. If unavoidable, monitor phenobarbital levels closely.',
      prescribedBy: 'Dr. Smith',
      date: '2024-11-07',
      status: 'active'
    },
    {
      id: 'INT-005',
      patient: 'Rocky',
      owner: 'David Lee',
      drug1: 'Insulin',
      drug2: 'Corticosteroids',
      severity: 'high',
      description: 'Corticosteroids increase blood glucose, reducing insulin effectiveness',
      recommendation: 'Increase insulin monitoring. May need dose adjustment.',
      prescribedBy: 'Dr. Johnson',
      date: '2024-11-09',
      status: 'flagged'
    },
  ];

  const filteredInteractions = interactions.filter(interaction => {
    const searchLower = searchTerm.toLowerCase();
    return interaction.patient.toLowerCase().includes(searchLower) ||
           interaction.owner.toLowerCase().includes(searchLower) ||
           interaction.drug1.toLowerCase().includes(searchLower) ||
           interaction.drug2.toLowerCase().includes(searchLower) ||
           interaction.id.toLowerCase().includes(searchLower);
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'moderate': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'low': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'moderate': return <AlertCircle className="h-5 w-5 text-orange-600" />;
      case 'low': return <Info className="h-5 w-5 text-yellow-600" />;
      default: return <Info className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-100 text-red-800';
      case 'flagged': return 'bg-orange-100 text-orange-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const highSeverityCount = interactions.filter(i => i.severity === 'high').length;
  const moderateSeverityCount = interactions.filter(i => i.severity === 'moderate').length;
  const activeCount = interactions.filter(i => i.status === 'active' || i.status === 'flagged').length;

  return (
    <ContentArea>
      <VStack size="sm">
        <div className="flex items-baseline gap-3">
          <h1 className="text-3xl font-bold text-slate-800">Drug Interactions</h1>
          <p className="text-sm text-slate-500">Monitor and manage potential drug interactions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-blue-500">
            <CardContent className="py-3 px-4">
              <div className="text-2xl font-bold text-slate-800">{interactions.length}</div>
              <p className="text-xs text-slate-500 mt-1">Total Interactions</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-red-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div>
                  <div className="text-2xl font-bold text-slate-800">{highSeverityCount}</div>
                  <p className="text-xs text-slate-500 mt-1">High Severity</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-orange-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-8 w-8 text-orange-600" />
                <div>
                  <div className="text-2xl font-bold text-slate-800">{moderateSeverityCount}</div>
                  <p className="text-xs text-slate-500 mt-1">Moderate Severity</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-purple-500">
            <CardContent className="py-3 px-4">
              <div className="text-2xl font-bold text-slate-800">{activeCount}</div>
              <p className="text-xs text-slate-500 mt-1">Requires Action</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search by patient, drug name, or interaction ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Interactions List */}
        <div className="space-y-4">
          {filteredInteractions.map((interaction) => (
            <Card key={interaction.id} className={`border-l-4 ${
              interaction.severity === 'high' ? 'border-l-red-500 bg-red-50' :
              interaction.severity === 'moderate' ? 'border-l-orange-500 bg-orange-50' :
              'border-l-yellow-500 bg-yellow-50'
            }`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getSeverityIcon(interaction.severity)}
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {interaction.patient} - {interaction.owner}
                        <Badge className={getStatusColor(interaction.status)}>
                          {interaction.status}
                        </Badge>
                      </CardTitle>
                      <p className="text-sm text-slate-500 mt-1">
                        {interaction.id} • {interaction.date} • Prescribed by {interaction.prescribedBy}
                      </p>
                    </div>
                  </div>
                  <Badge className={getSeverityColor(interaction.severity)}>
                    {interaction.severity.toUpperCase()} SEVERITY
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Drug Combination */}
                  <div className="flex items-center gap-4 p-4 bg-white rounded-lg border">
                    <div className="flex-1">
                      <p className="text-sm text-slate-500">Drug 1</p>
                      <p className="font-semibold text-slate-800">{interaction.drug1}</p>
                    </div>
                    <div className="text-red-600 font-bold text-xl">⚠️</div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-500">Drug 2</p>
                      <p className="font-semibold text-slate-800">{interaction.drug2}</p>
                    </div>
                  </div>

                  {/* Interaction Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-lg border">
                      <p className="text-sm font-medium text-slate-700 mb-2">Description</p>
                      <p className="text-sm text-slate-600">{interaction.description}</p>
                    </div>
                    <div className="p-4 bg-white rounded-lg border">
                      <p className="text-sm font-medium text-slate-700 mb-2">Recommendation</p>
                      <p className="text-sm text-slate-600">{interaction.recommendation}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 justify-end pt-3 border-t">
                    {interaction.status === 'flagged' && (
                      <Button className="bg-orange-600 hover:bg-orange-700">Contact Prescriber</Button>
                    )}
                    {interaction.status === 'active' && (
                      <Button className="bg-blue-600 hover:bg-blue-700">Review & Resolve</Button>
                    )}
                    <Button variant="outline">View Full Details</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredInteractions.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-slate-500">
              No drug interactions found matching your search criteria
            </CardContent>
          </Card>
        )}

        {/* Critical Alert */}
        {highSeverityCount > 0 && (
          <Card className="border-red-300 bg-red-50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-red-800">
                <AlertTriangle className="h-5 w-5" />
                Critical Drug Interactions Detected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-red-700">
                {highSeverityCount} high severity drug interaction{highSeverityCount !== 1 ? 's' : ''} detected.
                Immediate review and action required. Contact prescribing veterinarian before dispensing.
              </p>
            </CardContent>
          </Card>
        )}
      </VStack>
    </ContentArea>
  );
}
