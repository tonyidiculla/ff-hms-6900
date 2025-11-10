/**
 * HR API Client
 * Communicates with ff-hrms-6860 backend service through HMS proxy
 * All HR business logic remains in the ff-hrms-6860 microservice
 */

// Use HMS proxy path instead of direct HRMS URL
const HR_API_BASE_URL = '/api/hr';

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  details?: any;
  status: number;
}

/**
 * Generic fetch wrapper for HR API calls
 */
async function hrFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${HR_API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies for authentication
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      console.error('[HR API Client] Error response:', data);
      return {
        error: data?.error || data?.message || `HTTP ${response.status}`,
        message: data?.message,
        details: data?.details,
        status: response.status,
      };
    }

    return {
      data,
      status: response.status,
    };
  } catch (error) {
    console.error('[HR API Client] Error:', error);
    return {
      error: error instanceof Error ? error.message : 'Network error',
      status: 0,
    };
  }
}

// ============================================================================
// Dashboard & Metrics
// ============================================================================

export async function fetchHRDashboard() {
  return hrFetch('/hr/dashboard');
}

export async function fetchHRMetrics() {
  return hrFetch('/hr/metrics');
}

// ============================================================================
// Employees
// ============================================================================

export async function fetchEmployees(params?: {
  search?: string;
  department?: string;
  status?: string;
}) {
  const queryParams = new URLSearchParams();
  if (params?.search) queryParams.append('search', params.search);
  if (params?.department) queryParams.append('department', params.department);
  if (params?.status) queryParams.append('status', params.status);

  const query = queryParams.toString();
  return hrFetch(`/employees${query ? `?${query}` : ''}`);
}

export async function fetchEmployee(employeeId: string) {
  return hrFetch(`/employees/${employeeId}`);
}

export async function createEmployee(employeeData: any) {
  return hrFetch('/employees', {
    method: 'POST',
    body: JSON.stringify(employeeData),
  });
}

export async function updateEmployee(employeeId: string, employeeData: any) {
  return hrFetch(`/employees/${employeeId}`, {
    method: 'PUT',
    body: JSON.stringify(employeeData),
  });
}

export async function deleteEmployee(employeeId: string) {
  return hrFetch(`/employees/${employeeId}`, {
    method: 'DELETE',
  });
}

export async function generateEmployeeIds(entityPlatformId: string) {
  return hrFetch('/employees/generate-ids', {
    method: 'POST',
    body: JSON.stringify({ entity_platform_id: entityPlatformId }),
  });
}

export async function searchExistingProfile(personal_email?: string, personal_contact_number?: string) {
  console.log('[searchExistingProfile] Calling with:', { personal_email, personal_contact_number });
  const result = await hrFetch('/search-profile', {
    method: 'POST',
    body: JSON.stringify({ personal_email, personal_contact_number }),
  });
  console.log('[searchExistingProfile] Result:', result);
  return result;
}

export async function fetchDepartments() {
  return hrFetch('/departments');
}

export async function fetchRoles() {
  return hrFetch('/roles');
}

export async function createDepartment(departmentData: any) {
  return hrFetch('/departments', {
    method: 'POST',
    body: JSON.stringify(departmentData),
  });
}

export async function updateDepartment(departmentId: string, departmentData: any) {
  return hrFetch(`/departments?department_id=${departmentId}`, {
    method: 'PUT',
    body: JSON.stringify(departmentData),
  });
}

export async function deleteDepartment(departmentId: string) {
  return hrFetch(`/departments?department_id=${departmentId}`, {
    method: 'DELETE',
  });
}

export async function fetchPositions() {
  return hrFetch('/positions');
}

export async function createPosition(positionData: any) {
  return hrFetch('/positions', {
    method: 'POST',
    body: JSON.stringify(positionData),
  });
}

export async function updatePosition(positionId: string, positionData: any) {
  return hrFetch(`/positions?position_id=${positionId}`, {
    method: 'PUT',
    body: JSON.stringify(positionData),
  });
}

export async function deletePosition(positionId: string) {
  return hrFetch(`/positions?position_id=${positionId}`, {
    method: 'DELETE',
  });
}

export async function fetchEmployeeSeatAssignments(params?: {
  search?: string;
  department?: string;
}) {
  const queryParams = new URLSearchParams();
  if (params?.search) queryParams.append('search', params.search);
  if (params?.department) queryParams.append('department', params.department);

  const query = queryParams.toString();
  return hrFetch(`/employee-seat-assignments${query ? `?${query}` : ''}`);
}

// ============================================================================
// Attendance & Leave
// ============================================================================

export async function fetchAttendance(params?: {
  employeeId?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}) {
  const queryParams = new URLSearchParams();
  if (params?.employeeId) queryParams.append('employeeId', params.employeeId);
  if (params?.startDate) queryParams.append('startDate', params.startDate);
  if (params?.endDate) queryParams.append('endDate', params.endDate);
  if (params?.status) queryParams.append('status', params.status);

  const query = queryParams.toString();
  return hrFetch(`/attendance${query ? `?${query}` : ''}`);
}

export async function clockIn(employeeId: string, data?: any) {
  return hrFetch('/attendance/clock-in', {
    method: 'POST',
    body: JSON.stringify({ employeeId, ...data }),
  });
}

export async function clockOut(employeeId: string, data?: any) {
  return hrFetch('/attendance/clock-out', {
    method: 'POST',
    body: JSON.stringify({ employeeId, ...data }),
  });
}

export async function fetchLeaveRequests(params?: {
  employeeId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}) {
  const queryParams = new URLSearchParams();
  if (params?.employeeId) queryParams.append('employeeId', params.employeeId);
  if (params?.status) queryParams.append('status', params.status);
  if (params?.startDate) queryParams.append('startDate', params.startDate);
  if (params?.endDate) queryParams.append('endDate', params.endDate);

  const query = queryParams.toString();
  return hrFetch(`/leave${query ? `?${query}` : ''}`);
}

export async function createLeaveRequest(leaveData: any) {
  return hrFetch('/leave', {
    method: 'POST',
    body: JSON.stringify(leaveData),
  });
}

export async function approveLeaveRequest(leaveId: string, data?: any) {
  return hrFetch(`/leave/${leaveId}/approve`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function rejectLeaveRequest(leaveId: string, data?: any) {
  return hrFetch(`/leave/${leaveId}/reject`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ============================================================================
// Performance
// ============================================================================

export async function fetchPerformanceReviews(params?: {
  employeeId?: string;
  reviewCycle?: string;
  status?: string;
}) {
  const queryParams = new URLSearchParams();
  if (params?.employeeId) queryParams.append('employeeId', params.employeeId);
  if (params?.reviewCycle) queryParams.append('reviewCycle', params.reviewCycle);
  if (params?.status) queryParams.append('status', params.status);

  const query = queryParams.toString();
  return hrFetch(`/performance/reviews${query ? `?${query}` : ''}`);
}

export async function createPerformanceReview(reviewData: any) {
  return hrFetch('/performance/reviews', {
    method: 'POST',
    body: JSON.stringify(reviewData),
  });
}

export async function fetchGoals(params?: {
  employeeId?: string;
  status?: string;
}) {
  const queryParams = new URLSearchParams();
  if (params?.employeeId) queryParams.append('employeeId', params.employeeId);
  if (params?.status) queryParams.append('status', params.status);

  const query = queryParams.toString();
  return hrFetch(`/performance/goals${query ? `?${query}` : ''}`);
}

export async function createGoal(goalData: any) {
  return hrFetch('/performance/goals', {
    method: 'POST',
    body: JSON.stringify(goalData),
  });
}

export async function updateGoal(goalId: string, goalData: any) {
  return hrFetch(`/performance/goals/${goalId}`, {
    method: 'PUT',
    body: JSON.stringify(goalData),
  });
}

export async function fetchFeedback(params?: {
  employeeId?: string;
  type?: string;
}) {
  const queryParams = new URLSearchParams();
  if (params?.employeeId) queryParams.append('employeeId', params.employeeId);
  if (params?.type) queryParams.append('type', params.type);

  const query = queryParams.toString();
  return hrFetch(`/performance/feedback${query ? `?${query}` : ''}`);
}

export async function submitFeedback(feedbackData: any) {
  return hrFetch('/performance/feedback', {
    method: 'POST',
    body: JSON.stringify(feedbackData),
  });
}

// ============================================================================
// Training
// ============================================================================

export async function fetchTrainingPrograms(params?: {
  category?: string;
  status?: string;
}) {
  const queryParams = new URLSearchParams();
  if (params?.category) queryParams.append('category', params.category);
  if (params?.status) queryParams.append('status', params.status);

  const query = queryParams.toString();
  return hrFetch(`/training/programs${query ? `?${query}` : ''}`);
}

export async function fetchTrainingSessions(params?: {
  programId?: string;
  startDate?: string;
  endDate?: string;
}) {
  const queryParams = new URLSearchParams();
  if (params?.programId) queryParams.append('programId', params.programId);
  if (params?.startDate) queryParams.append('startDate', params.startDate);
  if (params?.endDate) queryParams.append('endDate', params.endDate);

  const query = queryParams.toString();
  return hrFetch(`/training/sessions${query ? `?${query}` : ''}`);
}

export async function enrollInTraining(enrollmentData: any) {
  return hrFetch('/training/enroll', {
    method: 'POST',
    body: JSON.stringify(enrollmentData),
  });
}

export async function fetchCertifications(params?: {
  employeeId?: string;
  status?: string;
}) {
  const queryParams = new URLSearchParams();
  if (params?.employeeId) queryParams.append('employeeId', params.employeeId);
  if (params?.status) queryParams.append('status', params.status);

  const query = queryParams.toString();
  return hrFetch(`/training/certifications${query ? `?${query}` : ''}`);
}

export async function issueCertificate(certData: any) {
  return hrFetch('/training/certifications', {
    method: 'POST',
    body: JSON.stringify(certData),
  });
}

// ============================================================================
// Hospital/Entity
// ============================================================================

export async function fetchHospitalAddress(entityId: string) {
  return hrFetch(`/hospital?entity_id=${entityId}`);
}

// ============================================================================
// Export all functions
// ============================================================================

export const hrApiClient = {
  // Dashboard
  fetchDashboard: fetchHRDashboard,
  fetchMetrics: fetchHRMetrics,
  
  // Employees
  fetchEmployees,
  fetchEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  generateEmployeeIds,
  searchExistingProfile,
  fetchDepartments,
  fetchRoles,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  fetchPositions,
  createPosition,
  updatePosition,
  deletePosition,
  fetchEmployeeSeatAssignments,
  fetchHospitalAddress,
  
  // Attendance & Leave
  fetchAttendance,
  clockIn,
  clockOut,
  fetchLeaveRequests,
  createLeaveRequest,
  approveLeaveRequest,
  rejectLeaveRequest,
  
  // Performance
  fetchPerformanceReviews,
  createPerformanceReview,
  fetchGoals,
  createGoal,
  updateGoal,
  fetchFeedback,
  submitFeedback,
  
  // Training
  fetchTrainingPrograms,
  fetchTrainingSessions,
  enrollInTraining,
  fetchCertifications,
  issueCertificate,
};

export default hrApiClient;
