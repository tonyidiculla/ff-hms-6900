'use client';

import React from 'react';
import { ContentArea, VStack } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { hrApiClient } from '@/lib/api/hr-client';

export default function PerformancePage() {
  const [reviews, setReviews] = React.useState<any[]>([]);
  const [goals, setGoals] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<'reviews' | 'goals'>('reviews');

  React.useEffect(() => {
    fetchReviews();
    fetchGoals();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await hrApiClient.fetchPerformanceReviews({});
      if (response.error) {
        setError(response.error);
      } else {
        setReviews(response.data || []);
      }
    } catch (err) {
      setError('Failed to fetch performance reviews');
    } finally {
      setLoading(false);
    }
  };

  const fetchGoals = async () => {
    try {
      const response = await hrApiClient.fetchGoals({});
      if (!response.error) {
        setGoals(response.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch goals');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in progress':
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'not started':
      case 'not-started':
        return 'bg-gray-100 text-gray-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const completedGoals = goals.filter(g => g.status?.toLowerCase() === 'completed').length;
  const inProgressGoals = goals.filter(g => ['in progress', 'in-progress'].includes(g.status?.toLowerCase())).length;
  const overdueReviews = reviews.filter(r => r.status?.toLowerCase() === 'overdue').length;

  return (
    <ContentArea>
      <VStack size="sm">
        <div className="flex items-baseline gap-3">
          <h1 className="text-3xl font-bold text-slate-800">Performance Management</h1>
          <p className="text-sm text-slate-500">Manage reviews, goals, and feedback</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-purple-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Total Reviews</p>
                  <p className="text-2xl font-bold text-slate-800">{reviews.length}</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-purple-600 text-xl">📝</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-red-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Overdue Reviews</p>
                  <p className="text-2xl font-bold text-slate-800">{overdueReviews}</p>
                </div>
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-red-600 text-xl">⚠️</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-blue-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Active Goals</p>
                  <p className="text-2xl font-bold text-slate-800">{inProgressGoals}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-blue-600 text-xl">🎯</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-green-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Completed Goals</p>
                  <p className="text-2xl font-bold text-slate-800">{completedGoals}</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-green-600 text-xl">✓</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-2 border-b-2">
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'reviews'
                ? 'text-blue-600 border-b-2 border-blue-600 -mb-0.5'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            Performance Reviews
          </button>
          <button
            onClick={() => setActiveTab('goals')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'goals'
                ? 'text-blue-600 border-b-2 border-blue-600 -mb-0.5'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            Goals
          </button>
        </div>

        {activeTab === 'reviews' ? (
          <Card className="border-2">
            <CardHeader className="border-b-2 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Performance Reviews</CardTitle>
                  <p className="text-sm text-slate-500 mt-1">{reviews.length} total reviews</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">Export</Button>
                  <Button variant="primary">New Review</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-sm text-slate-500">Loading reviews...</p>
                </div>
              ) : error ? (
                <div className="p-8 text-center">
                  <p className="text-red-600 mb-4">{error}</p>
                  <Button onClick={fetchReviews} variant="primary">Retry</Button>
                </div>
              ) : reviews.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <p>No performance reviews found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="uppercase text-xs">Employee</TableHead>
                      <TableHead className="uppercase text-xs">Review Period</TableHead>
                      <TableHead className="uppercase text-xs">Reviewer</TableHead>
                      <TableHead className="uppercase text-xs">Rating</TableHead>
                      <TableHead className="uppercase text-xs">Status</TableHead>
                      <TableHead className="uppercase text-xs">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reviews.map((review) => (
                      <TableRow key={review.id} className="hover:bg-slate-50">
                        <TableCell>
                          <div>
                            <p className="font-medium text-slate-800">{review.employee_name}</p>
                            <p className="text-sm text-slate-500">{review.employee_id}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {review.review_period || 'Q4 2025'}
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {review.reviewer_name || '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">⭐</span>
                            <span className="text-sm font-medium">{review.rating || '-'}/5</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(review.status)}>
                            {review.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">View</Button>
                            <Button variant="outline" size="sm">Edit</Button>
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
                  <CardTitle>Goals</CardTitle>
                  <p className="text-sm text-slate-500 mt-1">{goals.length} total goals</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">Export</Button>
                  <Button variant="primary">New Goal</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {goals.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <p>No goals found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="uppercase text-xs">Goal</TableHead>
                      <TableHead className="uppercase text-xs">Employee</TableHead>
                      <TableHead className="uppercase text-xs">Target Date</TableHead>
                      <TableHead className="uppercase text-xs">Progress</TableHead>
                      <TableHead className="uppercase text-xs">Status</TableHead>
                      <TableHead className="uppercase text-xs">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {goals.map((goal) => (
                      <TableRow key={goal.id} className="hover:bg-slate-50">
                        <TableCell>
                          <p className="font-medium text-slate-800">{goal.title}</p>
                          <p className="text-sm text-slate-500">{goal.description}</p>
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {goal.employee_name}
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {goal.target_date ? new Date(goal.target_date).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${goal.progress || 0}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-slate-600">{goal.progress || 0}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(goal.status)}>
                            {goal.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">View</Button>
                            <Button variant="outline" size="sm">Update</Button>
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
