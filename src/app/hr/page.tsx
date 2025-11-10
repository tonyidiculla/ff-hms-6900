'use client';

import React from 'react';
import { ContentArea, VStack } from '@/components/layout/PageLayout';
import { Card, CardContent } from '@/components/ui/Card';
import Link from 'next/link';

export default function HRDashboardPage() {
  return (
    <ContentArea>
      <VStack size="sm">
        <div className="flex items-baseline gap-3">
          <h1 className="text-3xl font-bold text-slate-800">Human Resources</h1>
          <p className="text-sm text-slate-500">Manage your workforce and HR operations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-blue-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Total Employees</p>
                  <p className="text-2xl font-bold text-slate-800">248</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-blue-600 text-xl">👥</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-green-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Present Today</p>
                  <p className="text-2xl font-bold text-slate-800">232</p>
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
                  <p className="text-xs text-slate-500 mt-2">Attendance Rate</p>
                  <p className="text-2xl font-bold text-slate-800">93.5%</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-purple-600 text-xl">📊</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-yellow-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Pending Leave</p>
                  <p className="text-2xl font-bold text-slate-800">12</p>
                </div>
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-yellow-600 text-xl">📅</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/hr/employees">
            <Card className="border-2 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-blue-600 text-2xl">👥</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-800 mb-1">Employee Management</h3>
                    <p className="text-sm text-slate-600 mb-3">
                      Manage employee records, departments, and organizational structure
                    </p>
                    <div className="flex gap-4 text-xs text-slate-500">
                      <span>248 Active</span>
                      <span>•</span>
                      <span>12 Departments</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/hr/attendance-leave">
            <Card className="border-2 hover:border-green-300 hover:shadow-lg transition-all cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-green-600 text-2xl">📅</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-800 mb-1">Attendance & Leave</h3>
                    <p className="text-sm text-slate-600 mb-3">
                      Track attendance, manage leave requests and time-off balances
                    </p>
                    <div className="flex gap-4 text-xs text-slate-500">
                      <span>93.5% Rate</span>
                      <span>•</span>
                      <span>12 Pending</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/hr/rostering">
            <Card className="border-2 hover:border-indigo-300 hover:shadow-lg transition-all cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-indigo-600 text-2xl">📋</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-800 mb-1">Staff Rostering</h3>
                    <p className="text-sm text-slate-600 mb-3">
                      Manage staff schedules, shifts, and coverage analysis
                    </p>
                    <div className="flex gap-4 text-xs text-slate-500">
                      <span>36 Scheduled</span>
                      <span>•</span>
                      <span>5 Open Shifts</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/hr/performance">
            <Card className="border-2 hover:border-purple-300 hover:shadow-lg transition-all cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-purple-600 text-2xl">⭐</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-800 mb-1">Performance Management</h3>
                    <p className="text-sm text-slate-600 mb-3">
                      Conduct reviews, set goals, and provide continuous feedback
                    </p>
                    <div className="flex gap-4 text-xs text-slate-500">
                      <span>8 Due</span>
                      <span>•</span>
                      <span>156 Goals</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/hr/training">
            <Card className="border-2 hover:border-orange-300 hover:shadow-lg transition-all cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-orange-600 text-2xl">🎓</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-800 mb-1">Training & Development</h3>
                    <p className="text-sm text-slate-600 mb-3">
                      Manage training programs, certifications, and development
                    </p>
                    <div className="flex gap-4 text-xs text-slate-500">
                      <span>18 Programs</span>
                      <span>•</span>
                      <span>67 Enrolled</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </VStack>
    </ContentArea>
  );
}
