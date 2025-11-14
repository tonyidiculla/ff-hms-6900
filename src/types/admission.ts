/**
 * Admission Types Based on Database Schema
 * Maps to hospital_inpatients, pet_master, hospital_beds, and profiles tables
 */

// Hospital Inpatients Table Schema
export interface HospitalInpatient {
  id: string; // UUID
  pet_platform_id: string; // Foreign key to pet_master
  user_platform_id: string; // Foreign key to profiles (pet owner)
  entity_platform_id: string; // Foreign key to hospital_master
  employee_entity_id: string; // Employee ID of attending staff
  admission_date: string; // ISO timestamp
  admission_reason: string; // Reason for hospitalization
  current_condition: string; // Current medical condition
  status: 'active' | 'critical' | 'stable' | 'discharged'; // Status enum
  treatment_plan: string; // Detailed treatment plan
  primary_veterinarian_name: string; // Name of primary veterinarian
  ward_id: string; // Ward assignment identifier
  bed_id: string; // Specific bed assignment
  expected_discharge_date?: string; // Expected discharge date (nullable)
  actual_discharge_date?: string; // Actual discharge date (nullable)
  emr_record_id: string; // Foreign key to EMR records
  ip_billing_notes: string; // Inpatient billing notes
  is_active: boolean; // Whether admission record is active
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

// Pet Master Table Schema
export interface PetMaster {
  id: string; // UUID
  pet_platform_id: string; // Unique platform identifier
  name: string; // Pet's name
  species: string; // Species (Dog, Cat, Bird, etc.)
  breed?: string; // Breed information (nullable)
  age?: number; // Age in years (nullable)
  weight?: number; // Current weight (nullable)
  color?: string; // Pet's color/markings (nullable)
  microchip_id?: string; // Microchip identifier (nullable)
  date_of_birth?: string; // Pet's birth date (nullable)
  gender?: string; // Pet's gender (nullable)
  user_platform_id?: string; // Links to owner (nullable)
  avatar?: string; // Pet's photo/avatar URL (nullable)
  tmt_tag?: string; // Treatment or tracking tag (nullable)
  is_active: boolean; // Whether pet record is active
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

// Hospital Beds Table Schema
export interface HospitalBed {
  id: string; // UUID
  entity_platform_id: string; // Foreign key to hospital_master
  beds_number: string; // Bed identifier (e.g., "A-101", "ICU-001")
  description: string; // Bed description or location details
  is_occupied: boolean; // Whether bed is currently occupied
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

// Profiles Table Schema (simplified for owner information)
export interface PetOwnerProfile {
  id: string; // UUID
  user_platform_id: string; // Unique platform identifier
  first_name: string; // Owner's first name
  last_name: string; // Owner's last name
  personal_email?: string; // Personal email (nullable)
  personal_contact_number?: string; // Personal phone (nullable)
  work_email?: string; // Work email (nullable)
  work_contact_number?: string; // Work phone (nullable)
  address?: string; // Personal address (nullable)
  city?: string; // City (nullable)
  state?: string; // State/province (nullable)
  postal_code?: string; // Postal code (nullable)
  country?: string; // Country (nullable)
  is_active: boolean; // Whether profile is active
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

// Combined Admission Data (JOIN result)
export interface AdmissionWithDetails {
  // Core admission data
  admission: HospitalInpatient;
  
  // Related pet information
  pet: PetMaster;
  
  // Pet owner information
  owner: PetOwnerProfile;
  
  // Bed assignment information
  bed?: HospitalBed;
}

// API Request/Response Types
export interface CreateAdmissionRequest {
  // Required fields
  pet_platform_id: string;
  user_platform_id: string;
  entity_platform_id: string;
  employee_entity_id: string;
  admission_date: string;
  admission_reason: string;
  current_condition: string;
  treatment_plan: string;
  primary_veterinarian_name: string;
  ward_id: string;
  bed_id: string;
  
  // Optional fields
  expected_discharge_date?: string;
  emr_record_id?: string;
  ip_billing_notes?: string;
  status?: 'active' | 'critical' | 'stable' | 'ready_for_discharge' | 'discharge_hold';
}

export interface UpdateAdmissionRequest {
  id: string; // Required for updates
  
  // Optional fields that can be updated
  pet_platform_id?: string;
  user_platform_id?: string;
  entity_platform_id?: string;
  employee_entity_id?: string;
  admission_date?: string;
  admission_reason?: string;
  current_condition?: string;
  treatment_plan?: string;
  primary_veterinarian_name?: string;
  ward_id?: string;
  bed_id?: string;
  expected_discharge_date?: string;
  actual_discharge_date?: string; // Can be set during discharge
  emr_record_id?: string;
  ip_billing_notes?: string;
  status?: 'active' | 'critical' | 'stable' | 'ready_for_discharge' | 'discharge_hold' | 'discharged';
  discharge_hold_reason?: string | null; // Reason when status is discharge_hold
}

export interface AdmissionFilters {
  entity_platform_id?: string; // Filter by hospital
  status?: 'active' | 'critical' | 'stable' | 'ready_for_discharge' | 'discharge_hold' | 'discharged';
  ward_id?: string; // Filter by ward
  pet_platform_id?: string; // Filter by specific pet
  user_platform_id?: string; // Filter by pet owner
  admission_date_from?: string; // Date range start
  admission_date_to?: string; // Date range end
  limit?: number; // Pagination limit
  offset?: number; // Pagination offset
}

// Bed availability types
export interface BedAvailability {
  ward_id: string;
  ward_name: string;
  total_beds: number;
  occupied_beds: number;
  available_beds: number;
  beds: HospitalBed[];
}

// Statistics types
export interface AdmissionStatistics {
  total_admitted: number;
  critical_care: number;
  stable_patients: number;
  active_patients: number;
  discharged_today: number;
  average_stay_days: number;
  bed_occupancy_rate: number;
}