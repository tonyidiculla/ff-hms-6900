'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface MetricCard {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  module: string;
}

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const [metrics, setMetrics] = useState<MetricCard[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Login form state - must be at top level (Rules of Hooks)
  const [showSignup, setShowSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Simulate fetching metrics from various microservices
    // In production, these would be actual API calls
    const fetchMetrics = async () => {
      const allMetrics: MetricCard[] = [
        // Chat Module
        {
          title: 'Active Conversations',
          value: '24',
          subtitle: '+12% from last week',
          module: 'Chat',
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8l-4 1 1-4A8.96 8.96 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          ),
        },
        // Outpatient Module
        {
          title: 'Today\'s Appointments',
          value: '48',
          subtitle: '12 pending, 36 completed',
          module: 'Outpatient',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          ),
        },
        {
          title: 'Consultations',
          value: '32',
          subtitle: '8 in progress',
          module: 'Outpatient',
          color: 'text-cyan-600',
          bgColor: 'bg-cyan-50',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          ),
        },
        // Inpatient Module
        {
          title: 'Occupied Beds',
          value: '45/60',
          subtitle: '15 beds available',
          module: 'Inpatient',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          ),
        },
        {
          title: 'ICU Patients',
          value: '8',
          subtitle: '2 critical, 6 stable',
          module: 'Inpatient',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ),
        },
        // Operation Theater
        {
          title: 'Scheduled Surgeries',
          value: '6',
          subtitle: '3 completed today',
          module: 'Operation Theater',
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          ),
        },
        // Pharmacy
        {
          title: 'Pharmacy Orders',
          value: '89',
          subtitle: '12 pending fulfillment',
          module: 'Pharmacy',
          color: 'text-teal-600',
          bgColor: 'bg-teal-50',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          ),
        },
        {
          title: 'Low Stock Items',
          value: '14',
          subtitle: 'Requires reordering',
          module: 'Pharmacy',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ),
        },
        // Diagnostics
        {
          title: 'Lab Tests',
          value: '156',
          subtitle: '42 pending results',
          module: 'Diagnostics',
          color: 'text-indigo-600',
          bgColor: 'bg-indigo-50',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          ),
        },
        // Facility
        {
          title: 'Room Occupancy',
          value: '78%',
          subtitle: '18 rooms available',
          module: 'Facility',
          color: 'text-pink-600',
          bgColor: 'bg-pink-50',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          ),
        },
        // Purchasing
        {
          title: 'Purchase Orders',
          value: '23',
          subtitle: '8 pending approval',
          module: 'Purchasing',
          color: 'text-lime-600',
          bgColor: 'bg-lime-50',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          ),
        },
        // Finance
        {
          title: 'Revenue Today',
          value: '$12,450',
          subtitle: '+8% vs yesterday',
          module: 'Finance',
          color: 'text-emerald-600',
          bgColor: 'bg-emerald-50',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        },
        {
          title: 'Pending Payments',
          value: '$8,920',
          subtitle: '34 invoices',
          module: 'Finance',
          color: 'text-rose-600',
          bgColor: 'bg-rose-50',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          ),
        },
        // HRMS
        {
          title: 'Total Staff',
          value: '284',
          subtitle: '12 on leave today',
          module: 'HRMS',
          color: 'text-violet-600',
          bgColor: 'bg-violet-50',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          ),
        },
        {
          title: 'Shift Coverage',
          value: '96%',
          subtitle: '2 shifts understaffed',
          module: 'HRMS',
          color: 'text-amber-600',
          bgColor: 'bg-amber-50',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        },
      ];

      setMetrics(allMetrics);
      setLoading(false);
    };

    fetchMetrics();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoginLoading(true);

    try {
      const { supabase } = await import('@/lib/supabase-client');
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
      } else if (data.session) {
        // Reload page to refresh auth context
        window.location.reload();
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Login error:', err);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password strength
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoginLoading(true);

    try {
      const { supabase } = await import('@/lib/supabase-client');
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
      } else if (data.user) {
        setError('');
        // Show success message
        alert('Account created successfully! Please check your email to verify your account.');
        // Switch to login form
        setShowSignup(false);
        setPassword('');
        setConfirmPassword('');
        setFullName('');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Signup error:', err);
    } finally {
      setLoginLoading(false);
    }
  };

  // Show login prompt if not authenticated
  if (!authLoading && !user) {

    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-indigo-50 to-cyan-50 p-4">
        <div className="max-w-md w-full bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/30">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-linear-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">FURFIELD HMS</h1>
            <p className="text-gray-600">Hospital Management System</p>
          </div>

          {showSignup ? (
            // Signup Form
            <form onSubmit={handleSignup} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="At least 6 characters"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Confirm your password"
                />
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full bg-linear-to-r from-cyan-500 to-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loginLoading ? 'Creating account...' : 'Sign Up'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setShowSignup(false);
                    setError('');
                    setPassword('');
                    setConfirmPassword('');
                    setFullName('');
                  }}
                  className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
                >
                  Already have an account? Sign In
                </button>
              </div>
            </form>
          ) : (
            // Login Form
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full bg-linear-to-r from-cyan-500 to-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loginLoading ? 'Signing in...' : 'Sign In'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setShowSignup(true);
                    setError('');
                    setPassword('');
                  }}
                  className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
                >
                  Don't have an account? Sign Up
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Contact your system administrator if you need access
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-indigo-50 to-cyan-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-t-2 border-cyan-500 mx-auto mb-4"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-2 border-blue-400 opacity-20 mx-auto"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-cyan-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-1200 mx-auto">
        {/* Header with Glassmorphic Background */}
        <div className="mb-6 md:mb-8 bg-white/40 backdrop-blur-lg rounded-2xl p-6 md:p-8 shadow-xl border border-white/20">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-linear-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              FURFIELD Hospital Management System
            </h1>
          </div>
          <p className="text-base md:text-lg text-gray-600 ml-16">
            Real-time overview of all hospital operations
          </p>
        </div>

        {/* Metrics Grid with Enhanced Glassmorphism */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="group relative bg-white/60 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-5 md:p-6 border border-white/30 hover:border-cyan-300/50 overflow-hidden"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-linear-to-br from-cyan-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${metric.bgColor} backdrop-blur-sm shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <div className={metric.color}>{metric.icon}</div>
                  </div>
                  <span className="text-xs font-semibold text-gray-600 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-200/50 shadow-sm">
                    {metric.module}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2 group-hover:text-gray-900 transition-colors">
                  {metric.title}
                </h3>
                <p className="text-3xl md:text-4xl font-bold bg-linear-to-r from-cyan-600 to-blue-700 bg-clip-text text-transparent mb-2 group-hover:from-cyan-500 group-hover:to-blue-600 transition-all">
                  {metric.value}
                </p>
                <p className="text-xs text-gray-500 font-medium">{metric.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* System Status with Enhanced Design */}
        <div className="mt-6 md:mt-8 bg-white/60 backdrop-blur-xl rounded-2xl shadow-lg p-5 md:p-6 border border-white/30">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-linear-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">System Status</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="flex items-center space-x-4 bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:border-green-300/50 transition-all duration-300 hover:shadow-md">
              <div className="relative">
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-lg"></div>
                <div className="absolute inset-0 w-4 h-4 bg-green-400 rounded-full animate-ping opacity-30"></div>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">All Systems Operational</p>
                <p className="text-xs text-gray-500">Last checked: Just now</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:border-cyan-300/50 transition-all duration-300 hover:shadow-md">
              <div className="w-4 h-4 bg-linear-to-r from-cyan-500 to-blue-600 rounded-full shadow-lg"></div>
              <div>
                <p className="text-sm font-semibold text-gray-900">12 Microservices Active</p>
                <p className="text-xs text-gray-500">All responding normally</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:border-purple-300/50 transition-all duration-300 hover:shadow-md">
              <div className="w-4 h-4 bg-purple-500 rounded-full shadow-lg"></div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Database: Healthy</p>
                <p className="text-xs text-gray-500">Response time: 12ms</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Badge */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/40 backdrop-blur-lg rounded-full px-6 py-3 shadow-lg border border-white/30">
            <div className="w-2 h-2 bg-linear-to-r from-cyan-500 to-blue-600 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold bg-linear-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Powered by FURFIELD
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
