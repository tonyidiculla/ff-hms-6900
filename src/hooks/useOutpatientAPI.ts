/**
 * Custom hooks for Outpatient API
 * Routes all data operations through ff-outp-6830 microservice
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { OutpatientApi } from '@/lib/api-client';

/**
 * Fetch appointments from ff-outp API
 */
export function useAppointments(params?: {
  hospital_id?: string;
  status?: string;
  limit?: string;
}) {
  return useQuery({
    queryKey: ['appointments', params],
    queryFn: async () => {
      const response = await OutpatientApi.getAppointments(params);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch appointments');
      }
      return response.data?.data || [];
    },
  });
}

/**
 * Create new appointment
 */
export function useCreateAppointmentAPI() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentData: any) => {
      const response = await OutpatientApi.createAppointment(appointmentData);
      if (!response.success) {
        throw new Error(response.error || 'Failed to create appointment');
      }
      return response.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}

/**
 * Fetch billing records from ff-outp API
 */
export function useBillingRecords(params?: {
  hospital_id?: string;
  status?: string;
  limit?: string;
}) {
  return useQuery({
    queryKey: ['billing', params],
    queryFn: async () => {
      const response = await OutpatientApi.getBillingRecords(params);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch billing records');
      }
      return response.data?.data || [];
    },
  });
}

/**
 * Create billing record
 */
export function useCreateBillingRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (billingData: any) => {
      const response = await OutpatientApi.createBillingRecord(billingData);
      if (!response.success) {
        throw new Error(response.error || 'Failed to create billing record');
      }
      return response.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing'] });
    },
  });
}

/**
 * Fetch consultations from ff-outp API
 */
export function useConsultations(params?: {
  hospital_id?: string;
  pet_id?: string;
  limit?: string;
}) {
  return useQuery({
    queryKey: ['consultations', params],
    queryFn: async () => {
      const response = await OutpatientApi.getConsultations(params);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch consultations');
      }
      return response.data?.data || [];
    },
  });
}

/**
 * Create consultation/SOAP note
 */
export function useCreateConsultation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (consultationData: any) => {
      const response = await OutpatientApi.createConsultation(consultationData);
      if (!response.success) {
        throw new Error(response.error || 'Failed to create consultation');
      }
      return response.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultations'] });
    },
  });
}
