'use client';

import React from 'react';
import { ContentArea, VStack } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';

type TabType = 'demographics' | 'outcomes' | 'visits' | 'satisfaction';

export default function PatientAnalyticsPage() {
  const [activeTab, setActiveTab] = React.useState<TabType>('demographics');
  const [dateRange, setDateRange] = React.useState('This Month');

  // Sample data
  const demographicsData = [
    {
      id: 1,
      ageGroup: '0-18',
      totalPatients: 1248,
      maleCount: 645,
      femaleCount: 603,
      avgVisits: 2.3,
      topCondition: 'Respiratory Infections',
      percentage: 18.5,
    },
    {
      id: 2,
      ageGroup: '19-35',
      totalPatients: 2134,
      maleCount: 987,
      femaleCount: 1147,
      avgVisits: 1.8,
      topCondition: 'Preventive Care',
      percentage: 31.6,
    },
    {
      id: 3,
      ageGroup: '36-50',
      totalPatients: 1876,
      maleCount: 924,
      femaleCount: 952,
      avgVisits: 2.5,
      topCondition: 'Hypertension',
      percentage: 27.8,
    },
    {
      id: 4,
      ageGroup: '51-65',
      totalPatients: 982,
      maleCount: 456,
      femaleCount: 526,
      avgVisits: 3.2,
      topCondition: 'Diabetes Management',
      percentage: 14.5,
    },
    {
      id: 5,
      ageGroup: '65+',
      totalPatients: 512,
      maleCount: 223,
      femaleCount: 289,
      avgVisits: 4.1,
      topCondition: 'Cardiac Care',
      percentage: 7.6,
    },
  ];

  const outcomesData = [
    {
      id: 1,
      condition: 'Post-Surgical Recovery',
      totalCases: 342,
      successRate: 96.5,
      avgRecoveryDays: 8,
      readmissionRate: 2.3,
      complications: 12,
      rating: 'excellent',
    },
    {
      id: 2,
      condition: 'Cardiac Treatment',
      totalCases: 189,
      successRate: 94.2,
      avgRecoveryDays: 12,
      readmissionRate: 4.2,
      complications: 8,
      rating: 'excellent',
    },
    {
      id: 3,
      condition: 'Emergency Care',
      totalCases: 1247,
      successRate: 98.3,
      avgRecoveryDays: 2,
      readmissionRate: 1.8,
      complications: 23,
      rating: 'excellent',
    },
    {
      id: 4,
      condition: 'Orthopedic Surgery',
      totalCases: 156,
      successRate: 92.3,
      avgRecoveryDays: 18,
      readmissionRate: 5.8,
      complications: 12,
      rating: 'good',
    },
    {
      id: 5,
      condition: 'Maternity Care',
      totalCases: 487,
      successRate: 99.2,
      avgRecoveryDays: 3,
      readmissionRate: 0.6,
      complications: 3,
      rating: 'excellent',
    },
  ];

  const visitPatternsData = [
    {
      id: 1,
      month: 'January 2025',
      totalVisits: 6752,
      newPatients: 1234,
      returnVisits: 5518,
      emergencyVisits: 892,
      scheduledVisits: 5860,
      avgDailyVisits: 218,
    },
    {
      id: 2,
      month: 'December 2024',
      totalVisits: 7123,
      newPatients: 1456,
      returnVisits: 5667,
      emergencyVisits: 945,
      scheduledVisits: 6178,
      avgDailyVisits: 230,
    },
    {
      id: 3,
      month: 'November 2024',
      totalVisits: 6543,
      newPatients: 1189,
      returnVisits: 5354,
      emergencyVisits: 823,
      scheduledVisits: 5720,
      avgDailyVisits: 218,
    },
    {
      id: 4,
      month: 'October 2024',
      totalVisits: 6891,
      newPatients: 1345,
      returnVisits: 5546,
      emergencyVisits: 878,
      scheduledVisits: 6013,
      avgDailyVisits: 222,
    },
  ];

  const satisfactionData = [
    {
      id: 1,
      department: 'Emergency Department',
      responseCount: 892,
      overallRating: 4.3,
      waitTimeRating: 3.8,
      careQualityRating: 4.6,
      communicationRating: 4.4,
      facilityRating: 4.5,
      recommendationRate: 87,
    },
    {
      id: 2,
      department: 'Cardiology',
      responseCount: 189,
      overallRating: 4.8,
      waitTimeRating: 4.5,
      careQualityRating: 4.9,
      communicationRating: 4.7,
      facilityRating: 4.6,
      recommendationRate: 96,
    },
    {
      id: 3,
      department: 'Pediatrics',
      responseCount: 678,
      overallRating: 4.7,
      waitTimeRating: 4.3,
      careQualityRating: 4.8,
      communicationRating: 4.9,
      facilityRating: 4.6,
      recommendationRate: 94,
    },
    {
      id: 4,
      department: 'Orthopedics',
      responseCount: 156,
      overallRating: 4.5,
      waitTimeRating: 4.0,
      careQualityRating: 4.7,
      communicationRating: 4.6,
      facilityRating: 4.4,
      recommendationRate: 91,
    },
  ];

  const getRatingBadge = (rating: string) => {
    const colors: Record<string, string> = {
      excellent: 'bg-green-100 text-green-800',
      good: 'bg-blue-100 text-blue-800',
      fair: 'bg-yellow-100 text-yellow-800',
    };
    return colors[rating] || colors.good;
  };

  return (
    <ContentArea>
      <VStack size="sm">
        <div className="flex justify-between items-center">
          <div className="flex items-baseline gap-3">
            <h1 className="text-3xl font-bold text-slate-800">Patient Analytics</h1>
            <p className="text-sm text-slate-500">Demographics, outcomes, visit patterns & satisfaction</p>
          </div>
          <div className="flex gap-2">
            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
            >
              <option>This Week</option>
              <option>This Month</option>
              <option>This Quarter</option>
              <option>This Year</option>
            </select>
            <Button>Export Report</Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-blue-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Total Patients</p>
                  <p className="text-2xl font-bold text-slate-800">6,752</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-blue-600 text-xl">👤</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-green-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Success Rate</p>
                  <p className="text-2xl font-bold text-slate-800">96.1%</p>
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
                  <p className="text-xs text-slate-500 mt-2">Satisfaction Score</p>
                  <p className="text-2xl font-bold text-slate-800">4.6/5</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-purple-600 text-xl">⭐</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-orange-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Readmission Rate</p>
                  <p className="text-2xl font-bold text-slate-800">2.9%</p>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-orange-600 text-xl">🔄</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('demographics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'demographics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Demographics
            </button>
            <button
              onClick={() => setActiveTab('outcomes')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'outcomes'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Treatment Outcomes
            </button>
            <button
              onClick={() => setActiveTab('visits')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'visits'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Visit Patterns
            </button>
            <button
              onClick={() => setActiveTab('satisfaction')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'satisfaction'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Patient Satisfaction
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'demographics' && (
          <Card className="border-2 shadow-md">
            <CardHeader className="border-b-2 pb-4">
              <CardTitle className="text-lg">Patient Demographics Analysis</CardTitle>
            </CardHeader>
            <CardContent className="py-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Age Group</TableHead>
                    <TableHead className="text-right">Total Patients</TableHead>
                    <TableHead className="text-right">Male</TableHead>
                    <TableHead className="text-right">Female</TableHead>
                    <TableHead className="text-right">Avg Visits</TableHead>
                    <TableHead>Top Condition</TableHead>
                    <TableHead className="text-right">% of Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {demographicsData.map((demo) => (
                    <TableRow key={demo.id}>
                      <TableCell className="font-medium">{demo.ageGroup}</TableCell>
                      <TableCell className="text-right">{demo.totalPatients.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{demo.maleCount}</TableCell>
                      <TableCell className="text-right">{demo.femaleCount}</TableCell>
                      <TableCell className="text-right">{demo.avgVisits}</TableCell>
                      <TableCell>{demo.topCondition}</TableCell>
                      <TableCell className="text-right">{demo.percentage}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {activeTab === 'outcomes' && (
          <Card className="border-2 shadow-md">
            <CardHeader className="border-b-2 pb-4">
              <CardTitle className="text-lg">Treatment Outcomes & Success Rates</CardTitle>
            </CardHeader>
            <CardContent className="py-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Condition/Treatment</TableHead>
                    <TableHead className="text-right">Total Cases</TableHead>
                    <TableHead className="text-right">Success Rate</TableHead>
                    <TableHead className="text-right">Avg Recovery (days)</TableHead>
                    <TableHead className="text-right">Readmission %</TableHead>
                    <TableHead className="text-right">Complications</TableHead>
                    <TableHead>Rating</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {outcomesData.map((outcome) => (
                    <TableRow key={outcome.id}>
                      <TableCell className="font-medium">{outcome.condition}</TableCell>
                      <TableCell className="text-right">{outcome.totalCases}</TableCell>
                      <TableCell className="text-right text-green-600 font-semibold">
                        {outcome.successRate}%
                      </TableCell>
                      <TableCell className="text-right">{outcome.avgRecoveryDays}</TableCell>
                      <TableCell className="text-right">{outcome.readmissionRate}%</TableCell>
                      <TableCell className="text-right">{outcome.complications}</TableCell>
                      <TableCell>
                        <Badge className={getRatingBadge(outcome.rating)}>
                          {outcome.rating}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {activeTab === 'visits' && (
          <Card className="border-2 shadow-md">
            <CardHeader className="border-b-2 pb-4">
              <CardTitle className="text-lg">Visit Patterns & Trends</CardTitle>
            </CardHeader>
            <CardContent className="py-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead className="text-right">Total Visits</TableHead>
                    <TableHead className="text-right">New Patients</TableHead>
                    <TableHead className="text-right">Return Visits</TableHead>
                    <TableHead className="text-right">Emergency</TableHead>
                    <TableHead className="text-right">Scheduled</TableHead>
                    <TableHead className="text-right">Avg Daily</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visitPatternsData.map((visit) => (
                    <TableRow key={visit.id}>
                      <TableCell className="font-medium">{visit.month}</TableCell>
                      <TableCell className="text-right">{visit.totalVisits.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{visit.newPatients.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{visit.returnVisits.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{visit.emergencyVisits}</TableCell>
                      <TableCell className="text-right">{visit.scheduledVisits.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{visit.avgDailyVisits}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {activeTab === 'satisfaction' && (
          <Card className="border-2 shadow-md">
            <CardHeader className="border-b-2 pb-4">
              <CardTitle className="text-lg">Patient Satisfaction Scores</CardTitle>
            </CardHeader>
            <CardContent className="py-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department</TableHead>
                    <TableHead className="text-right">Responses</TableHead>
                    <TableHead className="text-right">Overall</TableHead>
                    <TableHead className="text-right">Wait Time</TableHead>
                    <TableHead className="text-right">Care Quality</TableHead>
                    <TableHead className="text-right">Communication</TableHead>
                    <TableHead className="text-right">Facility</TableHead>
                    <TableHead className="text-right">Would Recommend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {satisfactionData.map((sat) => (
                    <TableRow key={sat.id}>
                      <TableCell className="font-medium">{sat.department}</TableCell>
                      <TableCell className="text-right">{sat.responseCount}</TableCell>
                      <TableCell className="text-right font-semibold">{sat.overallRating}/5</TableCell>
                      <TableCell className="text-right">{sat.waitTimeRating}/5</TableCell>
                      <TableCell className="text-right">{sat.careQualityRating}/5</TableCell>
                      <TableCell className="text-right">{sat.communicationRating}/5</TableCell>
                      <TableCell className="text-right">{sat.facilityRating}/5</TableCell>
                      <TableCell className="text-right text-green-600 font-semibold">
                        {sat.recommendationRate}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </VStack>
    </ContentArea>
  );
}
