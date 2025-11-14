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
 * Fetch admissions with full details (hospital_inpatients + pet_master + profiles + hospital_beds)
 */
export function useAdmissions(params?: {
  entity_platform_id?: string; // Hospital filter
  status?: 'active' | 'critical' | 'stable' | 'ready_for_discharge' | 'discharge_hold' | 'discharged';
  pet_platform_id?: string; // Specific pet
  user_platform_id?: string; // Pet owner filter
  admission_date_from?: string; // Date range start
  admission_date_to?: string; // Date range end
  limit?: number;
  offset?: number;
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
 * Fetch single admission by ID
 */
export function useAdmissionById(id: string) {
  return useQuery({
    queryKey: ['admission', id],
    queryFn: async () => {
      const response = await InpatientApi.getAdmissionById(id);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch admission');
      }
      return response.data?.data;
    },
    enabled: !!id,
  });
}

/**
 * Create new admission
 */
export function useCreateAdmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (admissionData: {
      pet_platform_id: string;
      user_platform_id: string;
      entity_platform_id: string;
      employee_entity_id?: string | null;
      admission_date: string;
      admission_reason: string;
      current_condition: string;
      treatment_plan: string;
      primary_veterinarian_name: string;
      bed_number: string;
      expected_discharge_date?: string | null;
      emr_record_id?: string | null;
      ip_billing_notes?: string;
      status?: 'active' | 'critical' | 'stable';
    }) => {
      const response = await InpatientApi.createAdmission(admissionData);
      if (!response.success) {
        throw new Error(response.error || 'Failed to create admission');
      }
      return response.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admissions'] });
      queryClient.invalidateQueries({ queryKey: ['admission-statistics'] });
      queryClient.invalidateQueries({ queryKey: ['bed-occupancy'] });
    },
  });
}

/**
 * Update existing admission
 */
export function useUpdateAdmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...admissionData }: {
      id: string;
      pet_platform_id?: string;
      user_platform_id?: string;
      entity_platform_id?: string;
      employee_entity_id?: string;
      admission_date?: string;
      admission_reason?: string;
      current_condition?: string;
      treatment_plan?: string;
      primary_veterinarian_name?: string;
      bed_number?: string;
      expected_discharge_date?: string;
      actual_discharge_date?: string;
      emr_record_id?: string;
      ip_billing_notes?: string;
      status?: 'active' | 'critical' | 'stable' | 'ready_for_discharge' | 'discharge_hold' | 'discharged';
      discharge_hold_reason?: string | null;
    }) => {
      const response = await InpatientApi.updateAdmission(id, admissionData);
      if (!response.success) {
        throw new Error(response.error || 'Failed to update admission');
      }
      return response.data?.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admissions'] });
      queryClient.invalidateQueries({ queryKey: ['admission', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['admission-statistics'] });
    },
  });
}

/**
 * Discharge patient
 */
export function useDischargePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...dischargeData }: {
      id: string;
      actual_discharge_date: string;
      discharge_notes?: string;
      final_condition?: string;
    }) => {
      const response = await InpatientApi.dischargePatient(id, dischargeData);
      if (!response.success) {
        throw new Error(response.error || 'Failed to discharge patient');
      }
      return response.data?.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admissions'] });
      queryClient.invalidateQueries({ queryKey: ['admission', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['admission-statistics'] });
      queryClient.invalidateQueries({ queryKey: ['bed-occupancy'] });
    },
  });
}

/**
 * Get vitals for an admission or pet
 */
export function useVitals(params: {
  admission_id?: string;
  pet_platform_id?: string;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['vitals', params],
    queryFn: async () => {
      const response = await InpatientApi.getVitals(params);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch vitals');
      }
      return response.data || [];
    },
    enabled: !!(params.admission_id || params.pet_platform_id),
    staleTime: 30000, // 30 seconds
  });
}

/**
 * Create vitals record
 */
export function useCreateVitals() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vitalsData: {
      admission_id: string;
      pet_platform_id: string;
      entity_platform_id: string;
      recorded_by?: string;
      recorded_at?: string;
      temperature?: number;
      temperature_unit?: string;
      heart_rate?: number;
      respiratory_rate?: number;
      blood_pressure_systolic?: number;
      blood_pressure_diastolic?: number;
      weight?: number;
      weight_unit?: string;
      oxygen_saturation?: number;
      pain_score?: number;
      mental_status?: string;
      notes?: string;
    }) => {
      const response = await InpatientApi.createVitals(vitalsData);
      if (!response.success) {
        throw new Error(response.error || 'Failed to create vitals');
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vitals', { admission_id: variables.admission_id }] });
      queryClient.invalidateQueries({ queryKey: ['vitals', { pet_platform_id: variables.pet_platform_id }] });
    },
  });
}

/**
 * Get treatment plan for an admission
 */
export function useTreatmentPlan(admissionId?: string) {
  return useQuery({
    queryKey: ['treatment-plan', admissionId],
    queryFn: async () => {
      const response = await InpatientApi.getTreatmentPlan(admissionId!);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch treatment plan');
      }
      return response.data;
    },
    enabled: !!admissionId,
  });
}

/**
 * Update treatment plan
 */
export function useUpdateTreatmentPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ admissionId, ...treatmentData }: {
      admissionId: string;
      treatment_plan?: string;
      current_condition?: string;
      status?: string;
    }) => {
      const response = await InpatientApi.updateTreatmentPlan(admissionId, treatmentData);
      if (!response.success) {
        throw new Error(response.error || 'Failed to update treatment plan');
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['treatment-plan', variables.admissionId] });
      queryClient.invalidateQueries({ queryKey: ['admissions'] });
      queryClient.invalidateQueries({ queryKey: ['admission', variables.admissionId] });
    },
  });
}

/**
 * Get progress notes for an admission
 */
export function useProgressNotes(params: {
  admission_id?: string;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['progress-notes', params],
    queryFn: async () => {
      const response = await InpatientApi.getProgressNotes({ admission_id: params.admission_id!, limit: params.limit });
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch progress notes');
      }
      return response.data || [];
    },
    enabled: !!params.admission_id,
  });
}

/**
 * Create progress note
 */
export function useCreateProgressNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (noteData: {
      admission_id: string;
      note_text: string;
      note_type?: string;
      recorded_by?: string;
      is_important?: boolean;
    }) => {
      const response = await InpatientApi.createProgressNote(noteData);
      if (!response.success) {
        throw new Error(response.error || 'Failed to create progress note');
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['progress-notes', { admission_id: variables.admission_id }] });
    },
  });
}

/**
 * Search pets for admission
 */
export function useSearchPets(params: {
  entity_platform_id: string;
  search?: string;
  user_platform_id?: string;
  species?: string;
  limit?: number;
}, enabled: boolean = true) {
  return useQuery({
    queryKey: ['search-pets', params],
    queryFn: async () => {
      console.log('[useSearchPets] Calling InpatientApi.searchPets with:', params);
      const response = await InpatientApi.searchPets(params);
      console.log('[useSearchPets] Raw response:', response);
      console.log('[useSearchPets] response.success:', response.success);
      console.log('[useSearchPets] response.data:', response.data);
      console.log('[useSearchPets] response.data?.data:', response.data?.data);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to search pets');
      }
      
      const result = response.data?.data || [];
      console.log('[useSearchPets] Returning result:', result);
      return result;
    },
    enabled: enabled && !!params.entity_platform_id,
    staleTime: 0, // Don't cache - always fetch fresh
    gcTime: 0, // Don't keep in cache
  });
}

/**
 * Search pet owners
 */
export function useSearchOwners(params: {
  entity_platform_id: string;
  search?: string;
  limit?: number;
}, enabled: boolean = true) {
  return useQuery({
    queryKey: ['search-owners', params],
    queryFn: async () => {
      const response = await InpatientApi.searchOwners(params);
      if (!response.success) {
        throw new Error(response.error || 'Failed to search owners');
      }
      return response.data?.data || [];
    },
    enabled: enabled && !!params.entity_platform_id,
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
