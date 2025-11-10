/**
 * Unified API Client
 * Provides consistent API calling patterns for both HMS and Organization apps
 */

// Base API configuration
const API_BASE_URL = typeof window !== 'undefined' ? window.location.origin : '';

// Microservice API endpoints
const OUTPATIENT_API_BASE = process.env.NEXT_PUBLIC_OUTPATIENT_API_URL || 'http://localhost:6830';
const INPATIENT_API_BASE = process.env.NEXT_PUBLIC_INPATIENT_API_URL || 'http://localhost:6831';
const DIAGNOSTICS_API_BASE = process.env.NEXT_PUBLIC_DIAGNOSTICS_API_URL || 'http://localhost:6832';
const OPERATION_THEATER_API_BASE = process.env.NEXT_PUBLIC_OPERATION_THEATER_API_URL || 'http://localhost:6833';
const PHARMACY_API_BASE = process.env.NEXT_PUBLIC_PHARMACY_API_URL || 'http://localhost:6834';
const HR_API_BASE = process.env.NEXT_PUBLIC_HR_API_URL || 'http://localhost:6860';
const CHAT_API_BASE = process.env.NEXT_PUBLIC_CHAT_API_URL || 'http://localhost:6880';
const FACILITY_API_BASE = process.env.NEXT_PUBLIC_FACILITY_API_URL || 'http://localhost:6840';
const PURCHASING_API_BASE = process.env.NEXT_PUBLIC_PURCHASING_API_URL || 'http://localhost:6870';
const FINANCE_API_BASE = process.env.NEXT_PUBLIC_FINANCE_API_URL || 'http://localhost:6850';
const ANALYTICS_API_BASE = process.env.NEXT_PUBLIC_ANALYTICS_API_URL || 'http://localhost:6820';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  credentials?: RequestCredentials;
  timeout?: number;
}

/**
 * Unified API Client Class
 * Handles all API communications with consistent error handling and response formatting
 */
export class ApiClient {
  private static baseUrl = API_BASE_URL;
  private static defaultHeaders = {
    'Content-Type': 'application/json',
  };

  /**
   * Make API request with consistent error handling
   */
  static async request<T = any>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      body,
      credentials = 'include',
      timeout = 10000,
    } = options;

    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;

    const requestHeaders = {
      ...this.defaultHeaders,
      ...headers,
    };

    // Remove Content-Type for FormData
    if (body instanceof FormData) {
      delete (requestHeaders as any)['Content-Type'];
    }

    const config: RequestInit = {
      method,
      headers: requestHeaders,
      credentials,
    };

    if (body) {
      config.body = body instanceof FormData ? body : JSON.stringify(body);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      let data: any = null;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        return {
          success: false,
          error: data?.error || data?.message || `HTTP ${response.status}: ${response.statusText}`,
          data: data
        };
      }

      // Handle different response formats
      if (data && typeof data === 'object' && 'success' in data) {
        return data;
      }

      return {
        success: true,
        data: data
      };

    } catch (error: any) {
      console.error(`API request failed: ${method} ${url}`, error);
      
      if (error.name === 'AbortError') {
        return {
          success: false,
          error: 'Request timeout'
        };
      }

      return {
        success: false,
        error: error.message || 'Network error'
      };
    }
  }

  /**
   * GET request
   */
  static async get<T = any>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  /**
   * POST request
   */
  static async post<T = any>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  /**
   * PUT request
   */
  static async put<T = any>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  }

  /**
   * DELETE request
   */
  static async delete<T = any>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  /**
   * PATCH request
   */
  static async patch<T = any>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body });
  }

  /**
   * Upload file
   */
  static async upload<T = any>(endpoint: string, file: File, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: formData
    });
  }

  /**
   * Upload avatar
   */
  static async uploadAvatar<T = any>(file: File, token?: string): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return this.request<T>('/auth/api/auth/avatar', {
      method: 'POST',
      body: formData,
      headers
    });
  }
}

/**
 * Authentication API Service
 */
export class AuthApi {
  /**
   * Get current user info
   */
  static async getCurrentUser() {
    return ApiClient.get('/api/auth/me');
  }

  /**
   * Upload user avatar
   */
  static async uploadAvatar(file: File, token?: string) {
    return ApiClient.uploadAvatar(file, token);
  }

  /**
   * Logout user
   */
  static async logout() {
    try {
      // Sign out from Supabase
      const { supabase } = await import('./supabase-client');
      await supabase.auth.signOut();
      console.log('[ApiClient] Supabase session cleared');
    } catch (error) {
      console.warn('[ApiClient] Could not complete Supabase logout:', error);
    }
    
    // Clear any remaining session data
    try {
      const { clearAllSessionData } = await import('@/utils/sessionUtils');
      clearAllSessionData();
    } catch (error) {
      // Ignore if sessionUtils doesn't exist
      console.log('[ApiClient] Session utils not available');
    }
    
    // Redirect to home page - Supabase will handle the login flow
    window.location.href = '/';
  }
}

/**
 * Organization API Service
 */
export class OrganizationApi {
  /**
   * Get user's organizations
   */
  static async getUserOrganizations() {
    return ApiClient.get('/api/organizations');
  }

  /**
   * Get organization by ID
   */
  static async getOrganizationById(id: string) {
    return ApiClient.get(`/api/organizations/${id}`);
  }

  /**
   * Create new organization
   */
  static async createOrganization(organizationData: any) {
    return ApiClient.post('/api/organizations', organizationData);
  }

  /**
   * Update organization
   */
  static async updateOrganization(id: string, organizationData: any) {
    return ApiClient.put(`/api/organizations/${id}`, organizationData);
  }

  /**
   * Delete organization
   */
  static async deleteOrganization(id: string) {
    return ApiClient.delete(`/api/organizations/${id}`);
  }
}

/**
 * Entity API Service
 */
export class EntityApi {
  /**
   * Get user's entities
   */
  static async getUserEntities(organizationPlatformId?: string) {
    const params = organizationPlatformId ? `?organizationPlatformId=${organizationPlatformId}` : '';
    return ApiClient.get(`/api/entities${params}`);
  }

  /**
   * Get entity by ID
   */
  static async getEntityById(id: string) {
    return ApiClient.get(`/api/entities/${id}`);
  }

  /**
   * Create new entity
   */
  static async createEntity(entityData: any) {
    return ApiClient.post('/api/entities', entityData);
  }

  /**
   * Update entity
   */
  static async updateEntity(id: string, entityData: any) {
    return ApiClient.put(`/api/entities/${id}`, entityData);
  }

  /**
   * Delete entity
   */
  static async deleteEntity(id: string) {
    return ApiClient.delete(`/api/entities/${id}`);
  }
}

/**
 * Subscription API Service (HMS specific)
 */
export class SubscriptionApi {
  /**
   * Get entity subscriptions
   */
  static async getEntitySubscriptions() {
    return ApiClient.get('/api/subscriptions');
  }

  /**
   * Update subscription
   */
  static async updateSubscription(subscriptionData: any) {
    return ApiClient.post('/api/subscriptions', subscriptionData);
  }
}

/**
 * Outpatient API Service
 * Routes all outpatient operations to ff-outp-6830 microservice
 */
export class OutpatientApi {
  private static baseUrl = OUTPATIENT_API_BASE;

  /**
   * Get appointments
   */
  static async getAppointments(params?: {
    hospital_id?: string;
    status?: string;
    limit?: string;
  }) {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return ApiClient.request(`${this.baseUrl}/api/core/appointments${query}`, {
      method: 'GET',
    });
  }

  /**
   * Create appointment
   */
  static async createAppointment(appointmentData: any) {
    return ApiClient.request(`${this.baseUrl}/api/core/appointments`, {
      method: 'POST',
      body: appointmentData,
    });
  }

  /**
   * Get billing records
   */
  static async getBillingRecords(params?: {
    hospital_id?: string;
    status?: string;
    limit?: string;
  }) {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return ApiClient.request(`${this.baseUrl}/api/core/billing${query}`, {
      method: 'GET',
    });
  }

  /**
   * Create billing record
   */
  static async createBillingRecord(billingData: any) {
    return ApiClient.request(`${this.baseUrl}/api/core/billing`, {
      method: 'POST',
      body: billingData,
    });
  }

  /**
   * Get consultations/SOAP notes
   */
  static async getConsultations(params?: {
    hospital_id?: string;
    pet_id?: string;
    limit?: string;
  }) {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return ApiClient.request(`${this.baseUrl}/api/core/consultations${query}`, {
      method: 'GET',
    });
  }

  /**
   * Create consultation/SOAP note
   */
  static async createConsultation(consultationData: any) {
    return ApiClient.request(`${this.baseUrl}/api/core/consultations`, {
      method: 'POST',
      body: consultationData,
    });
  }
}

/**
 * Inpatient API Service
 * Routes all inpatient operations to ff-inpa-6831 microservice
 */
export class InpatientApi {
  private static baseUrl = INPATIENT_API_BASE;

  /**
   * Get admissions
   */
  static async getAdmissions(params?: {
    hospital_id?: string;
    status?: string;
    limit?: string;
  }) {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return ApiClient.request(`${this.baseUrl}/api/inpatient/admissions${query}`, {
      method: 'GET',
    });
  }

  /**
   * Create admission
   */
  static async createAdmission(admissionData: any) {
    return ApiClient.request(`${this.baseUrl}/api/inpatient/admissions`, {
      method: 'POST',
      body: admissionData,
    });
  }

  /**
   * Update admission
   */
  static async updateAdmission(admissionData: any) {
    return ApiClient.request(`${this.baseUrl}/api/inpatient/admissions`, {
      method: 'PUT',
      body: admissionData,
    });
  }

  /**
   * Delete admission
   */
  static async deleteAdmission(id: string) {
    return ApiClient.request(`${this.baseUrl}/api/inpatient/admissions?id=${id}`, {
      method: 'DELETE',
    });
  }
}

/**
 * Pharmacy API Service
 * Routes all pharmacy operations to ff-phar-6834 microservice
 */
export class PharmacyApi {
  private static baseUrl = PHARMACY_API_BASE;

  /**
   * Get inventory
   */
  static async getInventory(params?: {
    hospital_id?: string;
    category?: string;
    status?: string;
    limit?: string;
  }) {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return ApiClient.request(`${this.baseUrl}/api/pharmacy/inventory${query}`, {
      method: 'GET',
    });
  }

  /**
   * Add medication
   */
  static async addMedication(medicationData: any) {
    return ApiClient.request(`${this.baseUrl}/api/pharmacy/inventory`, {
      method: 'POST',
      body: medicationData,
    });
  }

  /**
   * Update medication
   */
  static async updateMedication(medicationData: any) {
    return ApiClient.request(`${this.baseUrl}/api/pharmacy/inventory`, {
      method: 'PUT',
      body: medicationData,
    });
  }

  /**
   * Delete medication
   */
  static async deleteMedication(id: string) {
    return ApiClient.request(`${this.baseUrl}/api/pharmacy/inventory?id=${id}`, {
      method: 'DELETE',
    });
  }
}

/**
 * Diagnostics API Service
 * Routes all diagnostics operations to ff-diag-6832 microservice
 */
export class DiagnosticsApi {
  private static baseUrl = DIAGNOSTICS_API_BASE;

  /**
   * Get diagnostic tests
   */
  static async getTests(params?: {
    hospital_id?: string;
    category?: string;
    status?: string;
    limit?: string;
  }) {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return ApiClient.request(`${this.baseUrl}/api/diagnostics/tests${query}`, {
      method: 'GET',
    });
  }

  /**
   * Create diagnostic test
   */
  static async createTest(testData: any) {
    return ApiClient.request(`${this.baseUrl}/api/diagnostics/tests`, {
      method: 'POST',
      body: testData,
    });
  }

  /**
   * Update diagnostic test
   */
  static async updateTest(testData: any) {
    return ApiClient.request(`${this.baseUrl}/api/diagnostics/tests`, {
      method: 'PUT',
      body: testData,
    });
  }

  /**
   * Delete diagnostic test
   */
  static async deleteTest(id: string) {
    return ApiClient.request(`${this.baseUrl}/api/diagnostics/tests?id=${id}`, {
      method: 'DELETE',
    });
  }
}

/**
 * Operation Theater API Service
 * Routes all operation theater operations to ff-oper-6833 microservice
 */
export class OperationTheaterApi {
  private static baseUrl = OPERATION_THEATER_API_BASE;

  /**
   * Get surgeries
   */
  static async getSurgeries(params?: {
    hospital_id?: string;
    date?: string;
    status?: string;
    theater?: string;
    limit?: string;
  }) {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return ApiClient.request(`${this.baseUrl}/api/operation-theater/surgeries${query}`, {
      method: 'GET',
    });
  }

  /**
   * Schedule surgery
   */
  static async scheduleSurgery(surgeryData: any) {
    return ApiClient.request(`${this.baseUrl}/api/operation-theater/surgeries`, {
      method: 'POST',
      body: surgeryData,
    });
  }

  /**
   * Update surgery
   */
  static async updateSurgery(surgeryData: any) {
    return ApiClient.request(`${this.baseUrl}/api/operation-theater/surgeries`, {
      method: 'PUT',
      body: surgeryData,
    });
  }

  /**
   * Cancel surgery
   */
  static async cancelSurgery(id: string) {
    return ApiClient.request(`${this.baseUrl}/api/operation-theater/surgeries?id=${id}`, {
      method: 'DELETE',
    });
  }
}

/**
 * HR Management API
 */
export class HRApi {
  private static baseUrl = HR_API_BASE;

  /**
   * Get employees
   */
  static async getEmployees(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return ApiClient.request(`${this.baseUrl}/api/employees${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  }

  /**
   * Create employee
   */
  static async createEmployee(employeeData: any) {
    return ApiClient.request(`${this.baseUrl}/api/employees`, {
      method: 'POST',
      body: employeeData,
    });
  }

  /**
   * Update employee
   */
  static async updateEmployee(employeeData: any) {
    return ApiClient.request(`${this.baseUrl}/api/employees`, {
      method: 'PUT',
      body: employeeData,
    });
  }

  /**
   * Delete employee
   */
  static async deleteEmployee(id: string) {
    return ApiClient.request(`${this.baseUrl}/api/employees?id=${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Get departments
   */
  static async getDepartments(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return ApiClient.request(`${this.baseUrl}/api/departments${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  }

  /**
   * Get positions
   */
  static async getPositions(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return ApiClient.request(`${this.baseUrl}/api/positions${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  }

  /**
   * Get attendance records
   */
  static async getAttendance(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return ApiClient.request(`${this.baseUrl}/api/attendance${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  }

  /**
   * Mark attendance
   */
  static async markAttendance(attendanceData: any) {
    return ApiClient.request(`${this.baseUrl}/api/attendance`, {
      method: 'POST',
      body: attendanceData,
    });
  }

  /**
   * Get leave requests
   */
  static async getLeaveRequests(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return ApiClient.request(`${this.baseUrl}/api/leave-requests${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  }

  /**
   * Create leave request
   */
  static async createLeaveRequest(leaveData: any) {
    return ApiClient.request(`${this.baseUrl}/api/leave-requests`, {
      method: 'POST',
      body: leaveData,
    });
  }

  /**
   * Update leave request
   */
  static async updateLeaveRequest(leaveData: any) {
    return ApiClient.request(`${this.baseUrl}/api/leave-requests`, {
      method: 'PUT',
      body: leaveData,
    });
  }

  /**
   * Get training programs
   */
  static async getTrainingPrograms(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return ApiClient.request(`${this.baseUrl}/api/training${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  }

  /**
   * Create training program
   */
  static async createTrainingProgram(trainingData: any) {
    return ApiClient.request(`${this.baseUrl}/api/training`, {
      method: 'POST',
      body: trainingData,
    });
  }
}

/**
 * Chat API
 */
export class ChatApi {
  private static baseUrl = CHAT_API_BASE;

  static async getMessages(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return ApiClient.request(`${this.baseUrl}/api/chat/messages${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  }

  static async sendMessage(messageData: any) {
    return ApiClient.request(`${this.baseUrl}/api/chat/messages`, {
      method: 'POST',
      body: messageData,
    });
  }
}

/**
 * Facility Management API
 */
export class FacilityApi {
  private static baseUrl = FACILITY_API_BASE;

  static async getWorkOrders(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return ApiClient.request(`${this.baseUrl}/api/facility/work-orders${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  }

  static async createWorkOrder(workOrderData: any) {
    return ApiClient.request(`${this.baseUrl}/api/facility/work-orders`, {
      method: 'POST',
      body: workOrderData,
    });
  }

  static async getEquipment(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return ApiClient.request(`${this.baseUrl}/api/facility/equipment${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  }
}

/**
 * Purchasing API
 */
export class PurchasingApi {
  private static baseUrl = PURCHASING_API_BASE;

  static async getPurchaseOrders(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return ApiClient.request(`${this.baseUrl}/api/purchasing/purchase-orders${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  }

  static async createPurchaseOrder(poData: any) {
    return ApiClient.request(`${this.baseUrl}/api/purchasing/purchase-orders`, {
      method: 'POST',
      body: poData,
    });
  }

  static async getSuppliers(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return ApiClient.request(`${this.baseUrl}/api/purchasing/suppliers${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  }
}

/**
 * Finance API
 */
export class FinanceApi {
  private static baseUrl = FINANCE_API_BASE;

  // ============================================
  // GENERAL LEDGER (GL)
  // ============================================
  
  static async getChartOfAccounts(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return ApiClient.request(`${this.baseUrl}/api/finance/gl/chart-of-accounts${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  }

  static async createAccount(accountData: any) {
    return ApiClient.request(`${this.baseUrl}/api/finance/gl/chart-of-accounts`, {
      method: 'POST',
      body: accountData,
    });
  }

  static async getJournalEntries(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return ApiClient.request(`${this.baseUrl}/api/finance/gl/journal-entries${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  }

  static async createJournalEntry(entryData: any) {
    return ApiClient.request(`${this.baseUrl}/api/finance/gl/journal-entries`, {
      method: 'POST',
      body: entryData,
    });
  }

  static async getJournalEntry(id: string) {
    return ApiClient.request(`${this.baseUrl}/api/finance/gl/journal-entries/${id}`, {
      method: 'GET',
    });
  }

  static async updateJournalEntry(id: string, entryData: any) {
    return ApiClient.request(`${this.baseUrl}/api/finance/gl/journal-entries/${id}`, {
      method: 'PUT',
      body: entryData,
    });
  }

  static async deleteJournalEntry(id: string) {
    return ApiClient.request(`${this.baseUrl}/api/finance/gl/journal-entries/${id}`, {
      method: 'DELETE',
    });
  }

  static async postJournalEntry(id: string) {
    return ApiClient.request(`${this.baseUrl}/api/finance/gl/journal-entries/${id}/post`, {
      method: 'POST',
    });
  }

  static async unpostJournalEntry(id: string) {
    return ApiClient.request(`${this.baseUrl}/api/finance/gl/journal-entries/${id}/unpost`, {
      method: 'POST',
    });
  }

  static async getPeriods(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return ApiClient.request(`${this.baseUrl}/api/finance/gl/periods${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  }

  static async closePeriod(periodData: any) {
    return ApiClient.request(`${this.baseUrl}/api/finance/gl/periods/close`, {
      method: 'POST',
      body: periodData,
    });
  }

  static async getFinancialReports(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return ApiClient.request(`${this.baseUrl}/api/finance/gl/reports${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  }

  // ============================================
  // ACCOUNTS PAYABLE (AP)
  // ============================================
  
  static async getVendors(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return ApiClient.request(`${this.baseUrl}/api/finance/ap/vendors${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  }

  static async createVendor(vendorData: any) {
    return ApiClient.request(`${this.baseUrl}/api/finance/ap/vendors`, {
      method: 'POST',
      body: vendorData,
    });
  }

  static async getPurchaseInvoices(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return ApiClient.request(`${this.baseUrl}/api/finance/ap/invoices${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  }

  static async createPurchaseInvoice(invoiceData: any) {
    return ApiClient.request(`${this.baseUrl}/api/finance/ap/invoices`, {
      method: 'POST',
      body: invoiceData,
    });
  }

  static async getPayables(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return ApiClient.request(`${this.baseUrl}/api/finance/ap/payments${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  }

  static async createPayment(paymentData: any) {
    return ApiClient.request(`${this.baseUrl}/api/finance/ap/payments`, {
      method: 'POST',
      body: paymentData,
    });
  }

  // ============================================
  // ACCOUNTS RECEIVABLE (AR)
  // ============================================
  
  static async getCustomers(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return ApiClient.request(`${this.baseUrl}/api/finance/ar/customers${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  }

  static async createCustomer(customerData: any) {
    return ApiClient.request(`${this.baseUrl}/api/finance/ar/customers`, {
      method: 'POST',
      body: customerData,
    });
  }

  static async getSalesInvoices(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return ApiClient.request(`${this.baseUrl}/api/finance/ar/invoices${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  }

  static async createSalesInvoice(invoiceData: any) {
    return ApiClient.request(`${this.baseUrl}/api/finance/ar/invoices`, {
      method: 'POST',
      body: invoiceData,
    });
  }

  static async getReceivables(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return ApiClient.request(`${this.baseUrl}/api/finance/ar/receipts${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  }

  static async createReceipt(receiptData: any) {
    return ApiClient.request(`${this.baseUrl}/api/finance/ar/receipts`, {
      method: 'POST',
      body: receiptData,
    });
  }

  static async getAgingReport(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return ApiClient.request(`${this.baseUrl}/api/finance/ar/aging${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  }

  // ============================================
  // BANKING & CASH MANAGEMENT
  // ============================================
  
  static async getBankAccounts(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return ApiClient.request(`${this.baseUrl}/api/finance/banking/accounts${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  }

  static async createBankAccount(accountData: any) {
    return ApiClient.request(`${this.baseUrl}/api/finance/banking/accounts`, {
      method: 'POST',
      body: accountData,
    });
  }

  static async getBankTransactions(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return ApiClient.request(`${this.baseUrl}/api/finance/banking/transactions${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  }

  static async getReconciliations(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return ApiClient.request(`${this.baseUrl}/api/finance/banking/reconciliations${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  }

  static async getCashFlow(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return ApiClient.request(`${this.baseUrl}/api/finance/banking/cash-flow${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  }

  // ============================================
  // BUDGETING & FORECASTING
  // ============================================
  
  static async getBudgets(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return ApiClient.request(`${this.baseUrl}/api/finance/budgeting/budgets${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  }

  static async createBudget(budgetData: any) {
    return ApiClient.request(`${this.baseUrl}/api/finance/budgeting/budgets`, {
      method: 'POST',
      body: budgetData,
    });
  }

  static async getVarianceReports(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return ApiClient.request(`${this.baseUrl}/api/finance/budgeting/variance${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  }

  // ============================================
  // FIXED ASSETS
  // ============================================
  
  static async getAssets(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return ApiClient.request(`${this.baseUrl}/api/finance/assets${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  }

  static async createAsset(assetData: any) {
    return ApiClient.request(`${this.baseUrl}/api/finance/assets`, {
      method: 'POST',
      body: assetData,
    });
  }

  static async getDepreciation(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return ApiClient.request(`${this.baseUrl}/api/finance/assets/depreciation${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  }

  // ============================================
  // COMPLIANCE & AUDIT
  // ============================================
  
  static async getAuditLogs(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return ApiClient.request(`${this.baseUrl}/api/finance/compliance/audit-logs${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  }

  static async getTaxReturns(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return ApiClient.request(`${this.baseUrl}/api/finance/compliance/tax-returns${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  }

  // Legacy methods for backward compatibility
  static async getAccounts(params: Record<string, any> = {}) {
    return this.getChartOfAccounts(params);
  }

  static async getTransactions(params: Record<string, any> = {}) {
    return this.getBankTransactions(params);
  }

  static async createTransaction(transactionData: any) {
    return this.createJournalEntry(transactionData);
  }
}

/**
 * Analytics API
 */
export class AnalyticsApi {
  private static baseUrl = ANALYTICS_API_BASE;

  static async getReports(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return ApiClient.request(`${this.baseUrl}/api/analytics/reports${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  }

  static async getDashboardMetrics(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return ApiClient.request(`${this.baseUrl}/api/analytics/dashboard${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  }
}

// Export unified API client and services
export default {
  ApiClient,
  AuthApi,
  OrganizationApi,
  EntityApi,
  SubscriptionApi,
  OutpatientApi,
  InpatientApi,
  PharmacyApi,
  DiagnosticsApi,
  OperationTheaterApi,
  HRApi,
  ChatApi,
  FacilityApi,
  PurchasingApi,
  FinanceApi,
  AnalyticsApi,
};