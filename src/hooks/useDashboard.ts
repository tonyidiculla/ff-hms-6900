import { useState, useEffect } from 'react';

export interface DashboardMetrics {
  employees: {
    total: number;
    present: number;
    attendanceRate: number;
    trend: {
      total: number;
      present: number;
      attendance: number;
    };
  };
  leaves: {
    pending: number;
    trend: number;
  };
  performance: {
    activeGoals: number;
    reviewsDue: number;
    avgPerformance: number;
    goalCompletionRate: number;
    reviewCompletion: number;
    trends: {
      goals: number;
      reviews: number;
      avgPerformance: number;
    };
  };
  training: {
    activePrograms: number;
    completedThisMonth: number;
    trend: number;
  };
}

export interface DashboardActivity {
  id: string;
  type: 'employee_onboarded' | 'leave_approved' | 'attendance_alert' | 'training_completed' | 'performance_review' | 'goal_created';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
  color: string;
}

interface DashboardData {
  metrics: DashboardMetrics;
  activities: DashboardActivity[];
}

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Call HMS proxy to HRMS dashboard API
      const response = await fetch('/api/hr/dashboard');
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}