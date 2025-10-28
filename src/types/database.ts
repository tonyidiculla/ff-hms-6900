/**
 * Database Type Definitions - Furfield HMS
 * HMS-specific database types
 */

// ============================================
// PLATFORM INFRASTRUCTURE
// ============================================

/**
 * User Profile
 */
export interface Profile {
  id: string
  user_id: string
  user_platform_id: string
  firstName: string
  lastName: string
  email: string
  role?: string
  avatarUrl?: string
  entity_platform_id?: string
  created_at: string
  updated_at: string
}

/**
 * Profile with roles
 */
export interface ProfileWithRoles extends Profile {
  roles: PlatformRole[]
}

/**
 * User to Role Assignment (Global roles)
 */
export interface UserToRoleAssignment {
  id: string
  user_platform_id: string
  role_id: string
  assigned_by: string
  assigned_at: string
  is_active: boolean
}

/**
 * Employee to Entity Role Assignment (Entity-specific employee roles)
 * This is the key for the dual role system!
 */
export interface EmployeeToEntityRoleAssignment {
  id: string
  employee_entity_id: string // This is the key field for hospital staff references!
  entity_platform_id: string // Hospital/clinic ID
  user_platform_id: string
  role_id: string
  assigned_by: string
  assigned_at: string
  is_active: boolean
  expires_at?: string
}

/**
 * Platform ID Mapping - Platform ID category definitions
 */
export interface PlatformIdMapping {
  id: string
  type_code: string
  type_name: string
  category_code: string
  category_name: string
  is_active: boolean
  created_at: string
  updated_at: string
}

/**
 * Platform Roles - Role definitions for the platform
 */
export interface PlatformRole {
  id: string
  role_name: string
  display_name: string
  description?: string
  privilege_level: number
  permissions: Record<string, any>
  modules: string[]
  is_active: boolean
  updated_at: string
}

// ============================================
// PETS & ANIMALS
// ============================================

/**
 * Pet Master Record
 */
export interface PetMaster {
  id: string
  pet_platform_id: string
  pet_name: string
  species_id: string
  breed_id?: string
  owner_user_platform_id: string // Simple direct reference to pet owner
  date_of_birth?: string
  gender?: string
  weight?: number
  color?: string
  microchip_id?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

/**
 * Pet with owner details
 */
export interface PetWithOwner extends PetMaster {
  owner_name?: string
  owner_email?: string
  species_name?: string
  breed_name?: string
}

/**
 * Pet Species
 */
export interface PetSpecies {
  id: string
  species_name: string
  category: string
  is_active: boolean
  created_at: string
}

/**
 * Pet Breed
 */
export interface PetBreed {
  id: string
  breed_name: string
  species_id: string
  size_category?: string
  is_active: boolean
  created_at: string
}

// ============================================
// ORGANIZATIONS
// ============================================

/**
 * Organization
 */
export interface Organization {
  id: string
  entity_platform_id: string
  organization_name: string
  organization_type: string
  contact_email?: string
  contact_phone?: string
  address?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

// ============================================
// BILLING SYSTEM
// ============================================

/**
 * Billing Record
 */
export interface BillingRecord {
  id: string
  invoice_id?: string
  entity_platform_id: string // Hospital reference through hospital_master.entity_platform_id
  pet_platform_id: string
  owner_user_platform_id: string // Simple direct reference to pet owner
  service_type: string
  amount: number
  tax_amount?: number
  total_amount: number
  status: string
  bill_date: string
  created_at: string
  updated_at: string
}

/**
 * Billing Invoice
 */
export interface BillingInvoice {
  id: string
  invoice_number: string
  hospital_id: string
  total_amount: number
  status: string
  issue_date: string
  due_date?: string
  created_at: string
  updated_at: string
}

/**
 * Billing Payment
 */
export interface BillingPayment {
  id: string
  invoice_id: string
  payment_amount: number
  payment_method: string
  payment_date: string
  status: string
  created_at: string
}

// ============================================
// EMR SYSTEM
// ============================================

/**
 * EMR Records Master
 */
export interface EMRRecordsMaster {
  id: string
  pet_platform_id: string
  hospital_id: string
  record_type: string
  record_date: string
  created_by: string
  content: Record<string, any>
  is_active: boolean
  created_at: string
  updated_at: string
}

/**
 * EMR Catalog of Assets
 */
export interface EMRCatalogOfAssets {
  id: string
  asset_name: string
  asset_type: string
  category: string
  description?: string
  specifications?: Record<string, any>
  is_active: boolean
  created_at: string
}

// ============================================
// HMS SPECIFIC TYPES
// ============================================

/**
 * Hospital Appointments
 */
export interface HospitalAppointment {
  id: string
  entity_platform_id: string // Hospital reference through hospital_master.entity_platform_id
  pet_platform_id: string
  owner_user_platform_id: string // Simple direct reference to pet owner
  // CORRECTED: Doctor should reference through employee_entity_id from employee_to_entity_role_assignment
  doctor_employee_entity_id?: string // References employee_to_entity_role_assignment.employee_entity_id
  appointment_date: string
  appointment_time: string
  appointment_type: string
  status: string
  reason?: string
  notes?: string
  created_at: string
  updated_at: string
}

/**
 * Hospital Billing Records
 */
export interface HospitalBilling {
  id: string
  entity_platform_id: string // Hospital reference through hospital_master.entity_platform_id
  appointment_id?: string
  pet_platform_id: string
  owner_user_platform_id: string // Simple direct reference to pet owner
  bill_amount: number
  payment_status: string
  payment_method?: string
  bill_date: string
  created_at: string
  updated_at: string
}

/**
 * Hospital Consultations/SOAP Notes
 */
export interface HospitalConsultation {
  id: string
  entity_platform_id: string // Hospital reference through hospital_master.entity_platform_id
  appointment_id?: string
  pet_platform_id: string
  // CORRECTED: Doctor should reference through employee_entity_id from employee_to_entity_role_assignment
  doctor_employee_entity_id: string // References employee_to_entity_role_assignment.employee_entity_id
  consultation_date: string
  subjective?: string
  objective?: string
  assessment?: string
  plan?: string
  created_at: string
  updated_at: string
}

/**
 * Inpatient Admissions
 */
export interface InpatientAdmission {
  id: string
  entity_platform_id: string // Hospital reference through hospital_master.entity_platform_id
  pet_platform_id: string
  owner_user_platform_id: string // Simple direct reference to pet owner
  admission_date: string
  discharge_date?: string
  reason: string
  status: string
  ward?: string
  bed_number?: string
  created_at: string
  updated_at: string
}

// ============================================
// ENHANCED TYPES WITH RELATIONSHIPS
// ============================================

/**
 * Appointment with related details
 */
export interface AppointmentWithDetails extends HospitalAppointment {
  pet_name?: string
  owner_name?: string
  doctor_name?: string
}

/**
 * Hospital Pet EMR Access
 */
export interface HospitalPetEMRAccess {
  id: string
  hospital_id: string
  pet_platform_id: string
  access_level: string
  granted_by: string
  granted_at: string
  expires_at?: string
  is_active: boolean
}

// ============================================
// UTILITY TYPES
// ============================================

export type AppointmentStatus = 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show'
export type PaymentStatus = 'pending' | 'paid' | 'partial' | 'overdue' | 'cancelled'
export type AdmissionStatus = 'admitted' | 'discharged' | 'transferred' | 'deceased'