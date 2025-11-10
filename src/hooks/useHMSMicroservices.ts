/**
 * Custom hooks for HMS Microservices API
 * Routes all data operations through respective microservices
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { InpatientApi, PharmacyApi, DiagnosticsApi, OperationTheaterApi, HRApi } from '@/lib/api-client';

// ============================================
// INPATIENT HOOKS (ff-inpa-6831)
// ============================================

/**
 * Fetch admissions from inpatient API
 */
export function useAdmissions(params?: {
  hospital_id?: string;
  status?: string;
  limit?: string;
}) {
  return useQuery({
    queryKey: ['admissions', params],
    queryFn: async () => {
      const response = await InpatientApi.getAdmissions(params);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch admissions');
      }
      return response.data?.data || [];
    },
  });
}

/**
 * Create new admission
 */
export function useCreateAdmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (admissionData: any) => {
      const response = await InpatientApi.createAdmission(admissionData);
      if (!response.success) {
        throw new Error(response.error || 'Failed to create admission');
      }
      return response.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admissions'] });
    },
  });
}

/**
 * Update admission
 */
export function useUpdateAdmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (admissionData: any) => {
      const response = await InpatientApi.updateAdmission(admissionData);
      if (!response.success) {
        throw new Error(response.error || 'Failed to update admission');
      }
      return response.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admissions'] });
    },
  });
}

/**
 * Delete admission
 */
export function useDeleteAdmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await InpatientApi.deleteAdmission(id);
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete admission');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admissions'] });
    },
  });
}

// ============================================
// PHARMACY HOOKS (ff-phar-6834)
// ============================================

/**
 * Fetch pharmacy inventory
 */
export function usePharmacyInventory(params?: {
  hospital_id?: string;
  category?: string;
  status?: string;
  limit?: string;
}) {
  return useQuery({
    queryKey: ['pharmacy-inventory', params],
    queryFn: async () => {
      const response = await PharmacyApi.getInventory(params);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch inventory');
      }
      return response.data?.data || [];
    },
  });
}

/**
 * Add medication to inventory
 */
export function useAddMedication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (medicationData: any) => {
      const response = await PharmacyApi.addMedication(medicationData);
      if (!response.success) {
        throw new Error(response.error || 'Failed to add medication');
      }
      return response.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pharmacy-inventory'] });
    },
  });
}

/**
 * Update medication in inventory
 */
export function useUpdateMedication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (medicationData: any) => {
      const response = await PharmacyApi.updateMedication(medicationData);
      if (!response.success) {
        throw new Error(response.error || 'Failed to update medication');
      }
      return response.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pharmacy-inventory'] });
    },
  });
}

/**
 * Delete medication from inventory
 */
export function useDeleteMedication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await PharmacyApi.deleteMedication(id);
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete medication');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pharmacy-inventory'] });
    },
  });
}

// ============================================
// DIAGNOSTICS HOOKS (ff-diag-6832)
// ============================================

/**
 * Fetch diagnostic tests
 */
export function useDiagnosticTests(params?: {
  hospital_id?: string;
  category?: string;
  status?: string;
  limit?: string;
}) {
  return useQuery({
    queryKey: ['diagnostic-tests', params],
    queryFn: async () => {
      const response = await DiagnosticsApi.getTests(params);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch tests');
      }
      return response.data?.data || [];
    },
  });
}

/**
 * Create diagnostic test
 */
export function useCreateDiagnosticTest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (testData: any) => {
      const response = await DiagnosticsApi.createTest(testData);
      if (!response.success) {
        throw new Error(response.error || 'Failed to create test');
      }
      return response.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diagnostic-tests'] });
    },
  });
}

/**
 * Update diagnostic test
 */
export function useUpdateDiagnosticTest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (testData: any) => {
      const response = await DiagnosticsApi.updateTest(testData);
      if (!response.success) {
        throw new Error(response.error || 'Failed to update test');
      }
      return response.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diagnostic-tests'] });
    },
  });
}

/**
 * Delete diagnostic test
 */
export function useDeleteDiagnosticTest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await DiagnosticsApi.deleteTest(id);
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete test');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diagnostic-tests'] });
    },
  });
}

// ============================================
// OPERATION THEATER HOOKS (ff-oper-6833)
// ============================================

/**
 * Fetch surgeries
 */
export function useSurgeries(params?: {
  hospital_id?: string;
  date?: string;
  status?: string;
  theater?: string;
  limit?: string;
}) {
  return useQuery({
    queryKey: ['surgeries', params],
    queryFn: async () => {
      const response = await OperationTheaterApi.getSurgeries(params);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch surgeries');
      }
      return response.data?.data || [];
    },
  });
}

/**
 * Schedule surgery
 */
export function useScheduleSurgery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (surgeryData: any) => {
      const response = await OperationTheaterApi.scheduleSurgery(surgeryData);
      if (!response.success) {
        throw new Error(response.error || 'Failed to schedule surgery');
      }
      return response.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surgeries'] });
    },
  });
}

/**
 * Update surgery
 */
export function useUpdateSurgery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (surgeryData: any) => {
      const response = await OperationTheaterApi.updateSurgery(surgeryData);
      if (!response.success) {
        throw new Error(response.error || 'Failed to update surgery');
      }
      return response.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surgeries'] });
    },
  });
}

/**
 * Cancel surgery
 */
export function useCancelSurgery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await OperationTheaterApi.cancelSurgery(id);
      if (!response.success) {
        throw new Error(response.error || 'Failed to cancel surgery');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surgeries'] });
    },
  });
}

// ============================================
// HR HOOKS (ff-hrms-6860)
// ============================================

/**
 * Fetch employees
 */
export function useEmployees(params?: {
  hospital_id?: string;
  department?: string;
  status?: string;
  limit?: string;
}) {
  return useQuery({
    queryKey: ['employees', params],
    queryFn: async () => {
      const response = await HRApi.getEmployees(params);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch employees');
      }
      return response.data?.data || [];
    },
  });
}

/**
 * Create employee
 */
export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (employeeData: any) => {
      const response = await HRApi.createEmployee(employeeData);
      if (!response.success) {
        throw new Error(response.error || 'Failed to create employee');
      }
      return response.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}

/**
 * Update employee
 */
export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (employeeData: any) => {
      const response = await HRApi.updateEmployee(employeeData);
      if (!response.success) {
        throw new Error(response.error || 'Failed to update employee');
      }
      return response.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}

/**
 * Delete employee
 */
export function useDeleteEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await HRApi.deleteEmployee(id);
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete employee');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}

/**
 * Fetch departments
 */
export function useDepartments(params?: { hospital_id?: string }) {
  return useQuery({
    queryKey: ['departments', params],
    queryFn: async () => {
      const response = await HRApi.getDepartments(params);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch departments');
      }
      return response.data?.data || [];
    },
  });
}

/**
 * Fetch positions
 */
export function usePositions(params?: { hospital_id?: string; department?: string }) {
  return useQuery({
    queryKey: ['positions', params],
    queryFn: async () => {
      const response = await HRApi.getPositions(params);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch positions');
      }
      return response.data?.data || [];
    },
  });
}

/**
 * Fetch attendance records
 */
export function useAttendance(params?: {
  employee_id?: string;
  date?: string;
  limit?: string;
}) {
  return useQuery({
    queryKey: ['attendance', params],
    queryFn: async () => {
      const response = await HRApi.getAttendance(params);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch attendance');
      }
      return response.data?.data || [];
    },
  });
}

/**
 * Mark attendance
 */
export function useMarkAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (attendanceData: any) => {
      const response = await HRApi.markAttendance(attendanceData);
      if (!response.success) {
        throw new Error(response.error || 'Failed to mark attendance');
      }
      return response.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
  });
}

/**
 * Fetch leave requests
 */
export function useLeaveRequests(params?: {
  employee_id?: string;
  status?: string;
  limit?: string;
}) {
  return useQuery({
    queryKey: ['leave-requests', params],
    queryFn: async () => {
      const response = await HRApi.getLeaveRequests(params);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch leave requests');
      }
      return response.data?.data || [];
    },
  });
}

/**
 * Create leave request
 */
export function useCreateLeaveRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (leaveData: any) => {
      const response = await HRApi.createLeaveRequest(leaveData);
      if (!response.success) {
        throw new Error(response.error || 'Failed to create leave request');
      }
      return response.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] });
    },
  });
}

/**
 * Update leave request
 */
export function useUpdateLeaveRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (leaveData: any) => {
      const response = await HRApi.updateLeaveRequest(leaveData);
      if (!response.success) {
        throw new Error(response.error || 'Failed to update leave request');
      }
      return response.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] });
    },
  });
}

/**
 * Fetch training programs
 */
export function useTrainingPrograms(params?: {
  status?: string;
  limit?: string;
}) {
  return useQuery({
    queryKey: ['training-programs', params],
    queryFn: async () => {
      const response = await HRApi.getTrainingPrograms(params);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch training programs');
      }
      return response.data?.data || [];
    },
  });
}

/**
 * Create training program
 */
export function useCreateTrainingProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (trainingData: any) => {
      const response = await HRApi.createTrainingProgram(trainingData);
      if (!response.success) {
        throw new Error(response.error || 'Failed to create training program');
      }
      return response.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-programs'] });
    },
  });
}
