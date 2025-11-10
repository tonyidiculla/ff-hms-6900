'use client';

import React from 'react';
import { ContentArea, VStack } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { hrApiClient } from '@/lib/api/hr-client';

export default function TrainingPage() {
  const [programs, setPrograms] = React.useState<any[]>([]);
  const [certifications, setCertifications] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<'programs' | 'certifications'>('programs');

  React.useEffect(() => {
    fetchPrograms();
    fetchCertifications();
  }, []);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const response = await hrApiClient.fetchTrainingPrograms({});
      if (response.error) {
        setError(response.error);
      } else {
        setPrograms(response.data || []);
      }
    } catch (err) {
      setError('Failed to fetch training programs');
    } finally {
      setLoading(false);
    }
  };

  const fetchCertifications = async () => {
    try {
      const response = await hrApiClient.fetchCertifications({});
      if (!response.error) {
        setCertifications(response.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch certifications');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'in progress':
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'not started':
      case 'not-started':
        return 'bg-gray-100 text-gray-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'expiring soon':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const activePrograms = programs.filter(p => p.status?.toLowerCase() === 'active').length;
  const completedPrograms = programs.filter(p => p.status?.toLowerCase() === 'completed').length;
  const activeCerts = certifications.filter(c => c.status?.toLowerCase() === 'active').length;
  const expiringCerts = certifications.filter(c => ['expired', 'expiring soon'].includes(c.status?.toLowerCase())).length;

  return (
    <ContentArea>
      <VStack size="sm">
        <div className="flex items-baseline gap-3">
          <h1 className="text-3xl font-bold text-slate-800">Training & Development</h1>
          <p className="text-sm text-slate-500">Manage training programs and certifications</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-blue-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Active Programs</p>
                  <p className="text-2xl font-bold text-slate-800">{activePrograms}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-blue-600 text-xl">📚</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-green-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Completed</p>
                  <p className="text-2xl font-bold text-slate-800">{completedPrograms}</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-green-600 text-xl">✓</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-purple-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Active Certifications</p>
                  <p className="text-2xl font-bold text-slate-800">{activeCerts}</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-purple-600 text-xl">🏆</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-yellow-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Expiring Soon</p>
                  <p className="text-2xl font-bold text-slate-800">{expiringCerts}</p>
                </div>
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-yellow-600 text-xl">⚠️</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-2 border-b-2">
          <button
            onClick={() => setActiveTab('programs')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'programs'
                ? 'text-blue-600 border-b-2 border-blue-600 -mb-0.5'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            Training Programs
          </button>
          <button
            onClick={() => setActiveTab('certifications')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'certifications'
                ? 'text-blue-600 border-b-2 border-blue-600 -mb-0.5'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            Certifications
          </button>
        </div>

        {activeTab === 'programs' ? (
          <Card className="border-2">
            <CardHeader className="border-b-2 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Training Programs</CardTitle>
                  <p className="text-sm text-slate-500 mt-1">{programs.length} total programs</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">Export</Button>
                  <Button variant="primary">New Program</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-sm text-slate-500">Loading programs...</p>
                </div>
              ) : error ? (
                <div className="p-8 text-center">
                  <p className="text-red-600 mb-4">{error}</p>
                  <Button onClick={fetchPrograms} variant="primary">Retry</Button>
                </div>
              ) : programs.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <p>No training programs found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="uppercase text-xs">Program Name</TableHead>
                      <TableHead className="uppercase text-xs">Category</TableHead>
                      <TableHead className="uppercase text-xs">Duration</TableHead>
                      <TableHead className="uppercase text-xs">Enrolled</TableHead>
                      <TableHead className="uppercase text-xs">Status</TableHead>
                      <TableHead className="uppercase text-xs">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {programs.map((program) => (
                      <TableRow key={program.id} className="hover:bg-slate-50">
                        <TableCell>
                          <div>
                            <p className="font-medium text-slate-800">{program.name}</p>
                            <p className="text-sm text-slate-500">{program.description}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {program.category || 'General'}
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {program.duration || '-'}
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {program.enrolled_count || 0} employees
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(program.status)}>
                            {program.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">View</Button>
                            <Button variant="outline" size="sm">Enroll</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="border-2">
            <CardHeader className="border-b-2 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Certifications</CardTitle>
                  <p className="text-sm text-slate-500 mt-1">{certifications.length} total certifications</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">Export</Button>
                  <Button variant="primary">Issue Certificate</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {certifications.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <p>No certifications found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="uppercase text-xs">Employee</TableHead>
                      <TableHead className="uppercase text-xs">Certification</TableHead>
                      <TableHead className="uppercase text-xs">Issue Date</TableHead>
                      <TableHead className="uppercase text-xs">Expiry Date</TableHead>
                      <TableHead className="uppercase text-xs">Status</TableHead>
                      <TableHead className="uppercase text-xs">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {certifications.map((cert) => (
                      <TableRow key={cert.id} className="hover:bg-slate-50">
                        <TableCell>
                          <div>
                            <p className="font-medium text-slate-800">{cert.employee_name}</p>
                            <p className="text-sm text-slate-500">{cert.employee_id}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-slate-800">{cert.certification_name}</p>
                            <p className="text-sm text-slate-500">{cert.issuing_authority}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {cert.issue_date ? new Date(cert.issue_date).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {cert.expiry_date ? new Date(cert.expiry_date).toLocaleDateString() : 'No Expiry'}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(cert.status)}>
                            {cert.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">View</Button>
                            {cert.status?.toLowerCase() === 'expired' && (
                              <Button variant="outline" size="sm">Renew</Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}
      </VStack>
    </ContentArea>
  );
}
