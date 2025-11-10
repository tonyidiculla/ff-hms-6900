'use client';

import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { ContentArea, ContentCard, VStack } from '@/components/layout/PageLayout';
import { 
  useAppointmentsWithDetails, 
  useCancelAppointment, 
  useCreateAppointment,
  useStartConsultation,
  useEndConsultation,
  useSendOTPToOwner,
  useVerifyEMROTP,
  usePetSpecies,
  usePetBreeds,
  useHospitalWithLocation
} from '@/hooks/useDatabase';
import { useLocationCurrency } from '@/hooks/useLocationCurrency';
import { format } from 'date-fns';
import { supabase } from '@/lib/supabase';
import type { PetMaster, Profile } from '@/types/database';

export default function AppointmentsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewEditModalOpen, setIsViewEditModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [isAddPetModalOpen, setIsAddPetModalOpen] = useState(false);
  
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: '',
    search: '',
  });

  // State for new appointment modal
  const [unifiedSearch, setUnifiedSearch] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{
    type: 'pet';
    pet: PetMaster;
    owner: Profile | null;
  }>>([]);
  const [selectedPet, setSelectedPet] = useState<PetMaster | null>(null);
  const [selectedOwner, setSelectedOwner] = useState<Profile | null>(null);
  
  // Entity search state
  const [entitySearch, setEntitySearch] = useState('');
  const [entitySearchResults, setEntitySearchResults] = useState<any[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<any>(null);
  
  const [appointmentForm, setAppointmentForm] = useState({
    entity_platform_id: 'E019nC8m3', // Default to FURFIELD hospital
    doctor_user_platform_id: '',
    employee_assignment_id: '',
    employee_id: '',
    appointment_date: '',
    appointment_time: '',
    appointment_type: 'routine',
    reason: '',
    notes: '',
  });

  // Add Pet form state - PROPERLY DESIGNED
  const [petForm, setPetForm] = useState({
    name: '',
    species_id: '',
    breed_id: '',
    // Age handling - either DOB or years/months
    age_type: 'dob', // 'dob' or 'estimate'
    date_of_birth: '',
    age_years: '',
    age_months: '',
    weight: '',
    color: '',
    gender: 'male',
    medical_notes: ''
  });
  
  // Owner form state - separate from pet
  const [ownerForm, setOwnerForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    emergency_contact: ''
  });
  
  // Form flow state
  const [petFormStep, setPetFormStep] = useState<'owner' | 'pet'>('owner');
  const [isOwnerExisting, setIsOwnerExisting] = useState(false);
  const [breedSearch, setBreedSearch] = useState('');
  const [validationErrors, setValidationErrors] = useState<{email?: string, phone?: string}>({});
  const [contactLookupValue, setContactLookupValue] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [lookupType, setLookupType] = useState<'email' | 'phone' | null>(null);
  const [selectedCountryCode, setSelectedCountryCode] = useState('');
  
  // Phone number validation using location_currency table
  const validateE164Phone = (phone: string): boolean => {
    const validation = validatePhoneNumber(phone);
    return validation.isValid;
  };

  // Format phone number to E.164 standard using selected ISD code
  const formatToE164 = (phone: string): string => {
    // Remove all non-digit characters except +
    const cleaned = phone.replace(/[^\d+]/g, '');
    
    // If it starts with +, assume it's already formatted
    if (cleaned.startsWith('+')) {
      return cleaned;
    }
    
    // Use the selected ISD code as default
    const isdCodeToUse = selectedCountryCode || defaultISDCode || '+1';
    
    // If no ISD code prefix, add the selected one
    if (!cleaned.startsWith('+') && isdCodeToUse) {
      return `${isdCodeToUse}${cleaned}`;
    }
    
    return cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
  };

  // Check for duplicate email and phone
  const validateUniqueContact = async (email: string, phone: string) => {
    const errors: {email?: string, phone?: string} = {};
    
    try {
      // Check email uniqueness
      if (email) {
        const { data: emailExists } = await supabase
          .from('profiles')
          .select('user_platform_id')
          .eq('email', email.toLowerCase())
          .maybeSingle();
        
        if (emailExists && !isOwnerExisting) {
          errors.email = 'This email is already registered';
        }
      }
      
      // Check phone uniqueness (only if phone is provided and in E.164 format)
      if (phone && validateE164Phone(phone)) {
        const { data: phoneExists } = await supabase
          .from('profiles')
          .select('user_platform_id')
          .eq('phone', phone)
          .maybeSingle();
        
        if (phoneExists && !isOwnerExisting) {
          errors.phone = 'This phone number is already registered';
        }
      }
      
      setValidationErrors(errors);
      return Object.keys(errors).length === 0;
    } catch (error) {
      console.error('Error validating unique contact:', error);
      return false;
    }
  };

  // Unified contact lookup - handles both email and phone
  const handleContactLookup = React.useCallback(async (contactValue: string) => {
    if (!contactValue.trim()) {
      setIsOwnerExisting(false);
      setLookupType(null);
      return;
    }

    let searchType: 'email' | 'phone' | null = null;
    let searchValue = contactValue.trim();
    
    // Determine if it's email or phone
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // More robust phone detection
    const digitsCount = searchValue.replace(/[^\d]/g, '').length;
    const hasAtSymbol = searchValue.includes('@');
    const looksLikePhone = !hasAtSymbol && (
      searchValue.startsWith('+') || // International format
      digitsCount >= 10 // At least 10 digits for phone
    );
    
    console.log('Contact lookup input:', searchValue);
    console.log('Digits count:', digitsCount);
    console.log('Has @ symbol:', hasAtSymbol);
    console.log('Looks like phone:', looksLikePhone);
    console.log('Email test:', emailRegex.test(searchValue));
    
    if (emailRegex.test(searchValue)) {
      searchType = 'email';
      searchValue = searchValue.toLowerCase();
      console.log('Detected as EMAIL');
    } else if (looksLikePhone) {
      searchType = 'phone';
      console.log('Detected as PHONE');
      // Clean and prepare phone number
      const digitsOnly = searchValue.replace(/[^\d+]/g, '');
      console.log('Digits only:', digitsOnly);
      let wasCountryCodeAdded = false;
      
      // Auto-add default ISD code if phone doesn't start with + and looks like local number
      if (!searchValue.startsWith('+') && defaultISDCode) {
        // If it's just digits (local number), add ISD code
        if (/^\d+$/.test(digitsOnly)) {
          searchValue = `${defaultISDCode}${digitsOnly}`;
          wasCountryCodeAdded = true;
          console.log(`Auto-added ISD code: ${defaultISDCode} to number: ${digitsOnly} -> ${searchValue}`);
        }
      }
      
      // Try to format phone to E.164 for search
      try {
        searchValue = formatToE164(searchValue);
      } catch {
        // If formatting fails, use original value with country code if added
      }
    } else {
      setIsOwnerExisting(false);
      setLookupType(null);
      return;
    }

    setLookupType(searchType);
    
    try {
      const { data: existingOwner } = await supabase
        .from('profiles')
        .select('user_platform_id, first_name, last_name, email, phone')
        .eq(searchType, searchValue)
        .maybeSingle();
      
      if (existingOwner) {
        setIsOwnerExisting(true);
        setValidationErrors({}); // Clear errors for existing owner
        // Pre-fill owner info if found
        setOwnerForm(prev => ({
          ...prev,
          first_name: existingOwner.first_name || '',
          last_name: existingOwner.last_name || '',
          email: existingOwner.email || '',
          phone: existingOwner.phone || ''
        }));
      } else {
        setIsOwnerExisting(false);
        // Pre-fill the contact field that was searched
        if (searchType === 'email') {
          setOwnerForm(prev => ({ ...prev, email: searchValue }));
        } else if (searchType === 'phone') {
          setOwnerForm(prev => ({ ...prev, phone: searchValue }));
        }
      }
    } catch (error) {
      console.error('Error checking owner contact:', error);
      setIsOwnerExisting(false);
    }
  }, [supabase]);

  // Handle contact lookup when user presses Enter
  const handleContactLookupSubmit = () => {
    if (contactLookupValue.trim()) {
      setHasSearched(true);
      handleContactLookup(contactLookupValue);
    }
  };



  // Handle Enter key press for contact lookup
  const handleContactInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleContactLookupSubmit();
    }
  };



  // Employee rostering state
  const [availableStaff, setAvailableStaff] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Unified search function - searches pets and owners, then joins them
  const performUnifiedSearch = async (query: string) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      console.log('Unified search for:', query);
      
      // Search for pets by name, ID, species, breed
      const { data: petsByPet, error: petsError } = await supabase
        .from('pet_master')
        .select('*')
        .or(`name.ilike.%${query}%,pet_platform_id.ilike.%${query}%,species.ilike.%${query}%,breed.ilike.%${query}%`)
        .limit(10);

      if (petsError) {
        console.error('Pet search error:', petsError);
        throw petsError;
      }

      // Search for owners by name, email, ID
      const { data: ownerMatches, error: ownersError } = await supabase
        .from('profiles')
        .select('*')
        .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%,user_platform_id.ilike.%${query}%`)
        .limit(10);

      if (ownersError) {
        console.error('Owner search error:', ownersError);
        throw ownersError;
      }

      // Get pets belonging to the matched owners
      let petsByOwner: any[] = [];
      if (ownerMatches && ownerMatches.length > 0) {
        const ownerPlatformIds = ownerMatches.map(o => o.user_platform_id).filter(Boolean);
        const { data: ownerPets, error: ownerPetsError } = await supabase
          .from('pet_master')
          .select('*')
          .in('user_platform_id', ownerPlatformIds);
        
        if (!ownerPetsError) {
          petsByOwner = ownerPets || [];
        }
      }

      // Combine all pets (remove duplicates by pet_platform_id)
      const allPetsMap = new Map();
      [...(petsByPet || []), ...petsByOwner].forEach(pet => {
        if (pet.pet_platform_id) {
          allPetsMap.set(pet.pet_platform_id, pet);
        }
      });
      const allPets = Array.from(allPetsMap.values());

      if (allPets.length === 0) {
        console.log('No pets found');
        setSearchResults([]);
        return;
      }

      // Get unique owner platform IDs from all pets
      const ownerPlatformIds = [...new Set(allPets.map(pet => pet.user_platform_id).filter(Boolean))];

      // Fetch all owners in one query
      const { data: owners, error: allOwnersError } = await supabase
        .from('profiles')
        .select('*')
        .in('user_platform_id', ownerPlatformIds);

      if (allOwnersError) throw allOwnersError;

      // Create a map of owners by platform_id
      const ownersMap = new Map<string, Profile>();
      owners?.forEach(owner => {
        if (owner.user_platform_id) {
          ownersMap.set(owner.user_platform_id, owner);
        }
      });

      // Combine pets with their owners
      const results = allPets.map(pet => ({
        type: 'pet' as const,
        pet,
        owner: pet.user_platform_id ? ownersMap.get(pet.user_platform_id) || null : null,
      }));

      console.log('Search results:', results.length);
      setSearchResults(results);
    } catch (error) {
      console.error('Error performing unified search:', error);
      setSearchResults([]);
    }
  };

    // Entity search function - searches hospital_master table
  const performEntitySearch = async (query: string) => {
    if (!query || query.length < 2) {
      setEntitySearchResults([]);
      return;
    }

    try {
      console.log('Searching hospital_master for:', query);
      
      // Search by entity_name or entity_platform_id
      const { data: entities, error } = await supabase
        .from('hospital_master')
        .select('*')
        .or(`entity_name.ilike.%${query}%,entity_platform_id.ilike.%${query}%`)
        .limit(10);

      if (error) {
        console.error('Hospital search error:', error);
        throw error;
      }
      
      console.log('Hospital search results:', entities);
      setEntitySearchResults(entities || []);
    } catch (error) {
      console.error('Error searching hospitals:', error);
      setEntitySearchResults([]);
    }
  };

  // Debounced unified search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (unifiedSearch) {
        performUnifiedSearch(unifiedSearch);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [unifiedSearch]);

  // Debounced entity search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (entitySearch) {
        performEntitySearch(entitySearch);
      } else {
        setEntitySearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [entitySearch]);

  // Employee rostering functions
  const fetchAvailableStaff = async (entityPlatformId: string) => {
    if (!entityPlatformId) {
      setAvailableStaff([]);
      return;
    }

    try {
      // Use HR API to fetch employees for the entity
      const response = await fetch(`/api/proxy/hr/employees?entity_platform_id=${entityPlatformId}&status=active`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch staff');
      }

      const data = await response.json();
      console.log('Available staff:', data);
      setAvailableStaff(data?.data || []);
    } catch (error) {
      console.error('Error fetching staff:', error);
      setAvailableStaff([]);
    }
  };

  const fetchAvailableSlots = async (entityPlatformId: string, employeeAssignmentId: string, date: string) => {
    if (!entityPlatformId || !employeeAssignmentId || !date) {
      setAvailableSlots([]);
      return;
    }

    setLoadingSlots(true);
    try {
      // Call Outpatient API to get available slots
      // TODO: This endpoint needs to be implemented in ff-outp-6830 microservice
      // The microservice should handle slot generation and availability checking
      const response = await fetch(
        `/api/proxy/outpatient/slots?entity_platform_id=${entityPlatformId}&employee_id=${employeeAssignmentId}&date=${date}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        // If API endpoint doesn't exist yet, fall back to client-side slot generation
        console.warn('Slots API endpoint not available, using fallback slot generation');
        
        // Generate default slots
        const defaultSlots = [
          { slot_time: '09:00', is_available: true },
          { slot_time: '09:30', is_available: true },
          { slot_time: '10:00', is_available: true },
          { slot_time: '10:30', is_available: true },
          { slot_time: '11:00', is_available: true },
          { slot_time: '11:30', is_available: true },
          { slot_time: '14:00', is_available: true },
          { slot_time: '14:30', is_available: true },
          { slot_time: '15:00', is_available: true },
          { slot_time: '15:30', is_available: true },
          { slot_time: '16:00', is_available: true },
          { slot_time: '16:30', is_available: true },
        ];

        // Check existing appointments through API
        const appointmentsResponse = await fetch(
          `/api/proxy/outpatient/appointments?entity_platform_id=${entityPlatformId}&date=${date}&doctor_id=${employeeAssignmentId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        let bookedTimes = new Set();
        if (appointmentsResponse.ok) {
          const appointmentsData = await appointmentsResponse.json();
          const appointments = appointmentsData?.data || [];
          bookedTimes = new Set(appointments.map((apt: any) => apt.appointment_time));
        }

        const availableSlots = defaultSlots.map(slot => ({
          ...slot,
          is_available: !bookedTimes.has(slot.slot_time)
        }));

        setAvailableSlots(availableSlots);
        return;
      }

      const data = await response.json();
      console.log('Available slots:', data);
      setAvailableSlots(data?.data || []);
    } catch (error) {
      console.error('Error fetching slots:', error);
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  // Effect to fetch staff when entity is selected
  React.useEffect(() => {
    if (appointmentForm.entity_platform_id) {
      fetchAvailableStaff(appointmentForm.entity_platform_id);
    }
  }, [appointmentForm.entity_platform_id]);

  // Effect to fetch slots when employee and date are selected
  React.useEffect(() => {
    if (appointmentForm.entity_platform_id && appointmentForm.employee_assignment_id && appointmentForm.appointment_date) {
      fetchAvailableSlots(
        appointmentForm.entity_platform_id,
        appointmentForm.employee_assignment_id,
        appointmentForm.appointment_date
      );
    } else {
      setAvailableSlots([]);
    }
  }, [appointmentForm.entity_platform_id, appointmentForm.employee_assignment_id, appointmentForm.appointment_date]);

  // Effect to load default hospital (FURFIELD) data on startup
  React.useEffect(() => {
    const loadDefaultHospital = async () => {
      try {
        const { data, error } = await supabase
          .from('hospital_master')
          .select('*')
          .eq('entity_platform_id', 'E019nC8m3')
          .single();
        
        if (!error && data) {
          setSelectedEntity(data);
        }
      } catch (error) {
        console.error('Error loading default hospital:', error);
      }
    };
    loadDefaultHospital();
  }, []);

  // Fetch appointments with pet, owner, and doctor details
  const { data: appointments, isLoading, error } = useAppointmentsWithDetails({
    status: filters.status || undefined,
    startDate: filters.startDate || undefined,
    endDate: filters.endDate || undefined,
  });

  const cancelAppointment = useCancelAppointment();
  const createAppointment = useCreateAppointment();
  const startConsultation = useStartConsultation();
  const endConsultation = useEndConsultation();
  const sendOTPToOwner = useSendOTPToOwner();
  const verifyEMROTP = useVerifyEMROTP();
  
  // Pet species and breeds data
  const { data: rawPetSpecies = [] } = usePetSpecies();
  const { data: petBreeds = [] } = usePetBreeds(petForm.species_id);
  
  // Hospital location and currency data
  const { data: hospitalLocation } = useHospitalWithLocation('E019nC8m3'); // FURFIELD hospital
  const { 
    isdCodes, 
    validatePhoneNumber, 
    getCountryByISD, 
    isLoading: isLoadingCurrency 
  } = useLocationCurrency();
  
  // Default ISD code based on hospital location
  const defaultISDCode = hospitalLocation?.location_currency?.isd_code || '+1';

  // Set default ISD code when hospital data loads
  React.useEffect(() => {
    if (defaultISDCode && !selectedCountryCode) {
      setSelectedCountryCode(defaultISDCode);
    }
  }, [defaultISDCode, selectedCountryCode]);
  
  // Sort species with Dog and Cat first for better UX
  const petSpecies = React.useMemo(() => {
    const popular = rawPetSpecies.filter(s => 
      s.name.toLowerCase() === 'dog' || s.name.toLowerCase() === 'cat'
    ).sort((a, b) => a.name.localeCompare(b.name));
    
    const others = rawPetSpecies.filter(s => 
      s.name.toLowerCase() !== 'dog' && s.name.toLowerCase() !== 'cat'
    );
    
    return [...popular, ...others];
  }, [rawPetSpecies]);
  
  // Filter breeds based on search
  const filteredBreeds = React.useMemo(() => {
    if (!breedSearch) return petBreeds;
    return petBreeds.filter(breed =>
      breed.name.toLowerCase().includes(breedSearch.toLowerCase())
    );
  }, [petBreeds, breedSearch]);

  // OTP Verification Modal State
  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
  const [otpAppointmentId, setOTPAppointmentId] = useState<string>('');
  const [otpCode, setOTPCode] = useState('');

  // Handle successful actions with feedback
  const handleStartConsultation = (id: string) => {
    // Find the appointment to validate date
    const appointment = appointments?.find(apt => apt.id === id);
    
    if (appointment) {
      const appointmentDate = new Date(appointment.appointment_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      appointmentDate.setHours(0, 0, 0, 0);
      
      // Check if appointment is in the future
      if (appointmentDate > today) {
        alert('❌ Cannot start consultation: Appointment is scheduled for a future date.');
        return;
      }
    }
    
    startConsultation.mutate(id, {
      onSuccess: () => {
        alert('✅ Consultation started successfully! EMR access granted.');
      },
      onError: (error) => {
        console.error('Failed to start consultation:', error);
        alert('❌ Failed to start consultation. Please try again.');
      }
    });
  };

  const handleEndConsultation = (id: string) => {
    if (confirm('Are you sure you want to complete this consultation?')) {
      endConsultation.mutate(id, {
        onSuccess: () => {
          alert('✅ Consultation completed successfully!');
        },
        onError: (error) => {
          console.error('Failed to complete consultation:', error);
          alert('❌ Failed to complete consultation. Please try again.');
        }
      });
    }
  };

  const handleSendOTP = (id: string) => {
    sendOTPToOwner.mutate(id, {
      onSuccess: (updatedAppointment) => {
        console.log('OTP sent successfully, updated appointment:', updatedAppointment);
        alert('✅ OTP sent to owner successfully! Please verify the code.');
        // Manually invalidate queries to refresh the UI immediately
        queryClient.invalidateQueries({ queryKey: ['appointments-with-details'] });
        queryClient.invalidateQueries({ queryKey: ['appointments'] });
        queryClient.invalidateQueries({ queryKey: ['appointment', id] });
      },
      onError: (error) => {
        console.error('Failed to send OTP:', error);
        alert('❌ Failed to send OTP. Please try again.');
      }
    });
  };

  // Debug: Log appointments data
  React.useEffect(() => {
    if (appointments) {
      console.log('Appointments loaded:', appointments.length);
      console.log('Sample appointment:', appointments[0]);
      console.log('Appointment fields:', appointments[0] ? Object.keys(appointments[0]) : 'none');
      
      // Log button visibility conditions
      if (appointments[0]) {
        const apt = appointments[0];
        console.log('Button visibility check:', {
          status: apt.status,
          emr_otp_code: apt.emr_otp_code,
          emr_otp_verified: apt.emr_otp_verified,
          emr_write_access_active: apt.emr_write_access_active,
          shouldShowSendOTP: apt.status === 'scheduled' && !apt.emr_otp_code,
          shouldShowVerifyOTP: apt.emr_otp_code && !apt.emr_otp_verified,
          shouldShowStartConsultation: (apt.status === 'scheduled' || apt.status === 'confirmed') && apt.emr_otp_verified && !apt.emr_write_access_active,
          shouldShowEdit: apt.status === 'scheduled' || apt.status === 'confirmed'
        });
      }
    }
  }, [appointments]);

  // Debug: Check handlers are defined
  React.useEffect(() => {
    console.log('Handlers defined:', {
      handleStartConsultation: typeof handleStartConsultation,
      handleEndConsultation: typeof handleEndConsultation,
      handleSendOTP: typeof handleSendOTP,
      startConsultation: typeof startConsultation,
      endConsultation: typeof endConsultation,
      sendOTPToOwner: typeof sendOTPToOwner,
      verifyEMROTP: typeof verifyEMROTP
    });
  }, []);

  // Debug: Track OTP modal state changes
  React.useEffect(() => {
    console.log('OTP Modal state changed:', {
      isOpen: isOTPModalOpen,
      appointmentId: otpAppointmentId,
      code: otpCode
    });
  }, [isOTPModalOpen, otpAppointmentId, otpCode]);

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPet || !selectedOwner) {
      alert('Please select a pet and owner');
      return;
    }

    if (!appointmentForm.entity_platform_id) {
      alert('Please enter an entity platform ID');
      return;
    }

    if (!selectedEmployee || !appointmentForm.employee_assignment_id) {
      alert('Please select a staff member');
      return;
    }

    if (!appointmentForm.appointment_time) {
      alert('Please select an appointment time slot');
      return;
    }

    try {
      // For now, use the doctor_user_platform_id field to store employee platform ID
      await createAppointment.mutateAsync({
        pet_platform_id: selectedPet.pet_platform_id,
        owner_user_platform_id: selectedOwner.user_platform_id,
        entity_platform_id: appointmentForm.entity_platform_id,
        doctor_user_platform_id: selectedEmployee.user_platform_id,
        appointment_date: appointmentForm.appointment_date,
        appointment_time: appointmentForm.appointment_time,
        appointment_type: appointmentForm.appointment_type,
        status: 'scheduled',
        reason: appointmentForm.reason || undefined,
        notes: appointmentForm.notes || undefined,
        booking_source: 'hospital-online',
        emr_access_granted: false,
        emr_otp_verified: false,
        emr_otp_sent_to_owner: false,
        emr_write_access_active: false,
        emr_access_revoked: false,
      });

      // Reset form (but keep default hospital selection)
      setIsModalOpen(false);
      setSelectedPet(null);
      setSelectedOwner(null);
      // Don't reset selectedEntity - keep FURFIELD as default
      setUnifiedSearch('');
      setSearchResults([]);
      setEntitySearch('');
      setEntitySearchResults([]);
      setAppointmentForm({
        entity_platform_id: 'E019nC8m3', // Keep default hospital
        doctor_user_platform_id: '',
        employee_assignment_id: '',
        employee_id: '',
        appointment_date: '',
        appointment_time: '',
        appointment_type: 'routine',
        reason: '',
        notes: '',
      });
      setSelectedEmployee(null);
      setAvailableStaff([]);
      setAvailableSlots([]);

      alert('Appointment created successfully!');
    } catch (err: any) {
      console.error('Failed to create appointment:', err);
      console.error('Error details:', {
        message: err?.message,
        details: err?.details,
        hint: err?.hint,
        code: err?.code
      });
      const errorMessage = err?.message || err?.details || 'Unknown error occurred';
      alert(`Failed to create appointment: ${errorMessage}`);
    }
  };

  const handleCancelAppointment = async (id: string) => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await cancelAppointment.mutateAsync(id);
      } catch (err) {
        console.error('Failed to cancel appointment:', err);
        alert('Failed to cancel appointment');
      }
    }
  };

  // Helper function to calculate age from date of birth
  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    return { years, months };
  };

  const handleAddPet = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Basic field validation - phone is now mandatory for OTP verification
      if (!petForm.name || !petForm.species_id || !ownerForm.first_name || !ownerForm.email || !ownerForm.phone) {
        alert('❌ Please fill in all required fields (including phone number for OTP verification)');
        return;
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(ownerForm.email)) {
        alert('❌ Please enter a valid email address');
        return;
      }

      // Phone validation (mandatory for OTP)
      const formattedPhone = formatToE164(ownerForm.phone);
      if (!validateE164Phone(formattedPhone)) {
        alert('❌ Please enter a valid phone number in E.164 format (e.g., +1 555 123 4567). Phone is required for OTP verification.');
        return;
      }
      // Update form with formatted phone
      setOwnerForm(prev => ({ ...prev, phone: formattedPhone }));

      // Check for validation errors
      if (validationErrors.email || validationErrors.phone) {
        alert('❌ Please fix the validation errors before submitting');
        return;
      }
      
      // Age validation and calculation
      let ageInMonths: number | null = null;
      if (petForm.age_type === 'dob' && petForm.date_of_birth) {
        const age = calculateAge(petForm.date_of_birth);
        ageInMonths = age.years * 12 + age.months;
      } else if (petForm.age_type === 'estimate') {
        const years = parseInt(petForm.age_years) || 0;
        const months = parseInt(petForm.age_months) || 0;
        if (years < 0 || months < 0 || months >= 12) {
          alert('❌ Invalid age. Years must be >= 0 and months must be 0-11');
          return;
        }
        ageInMonths = years * 12 + months;
      }
      
      let ownerId: string;
      
      // Check if owner already exists by email
      const { data: existingOwner, error: searchError } = await supabase
        .from('profiles')
        .select('user_platform_id, first_name, last_name')
        .eq('email', ownerForm.email)
        .maybeSingle();
      
      if (searchError) {
        console.error('Error checking for existing owner:', searchError);
        throw searchError;
      }
      
      if (existingOwner) {
        // Owner already exists - just add pet to existing owner
        ownerId = existingOwner.user_platform_id;
        // No alert needed here - user already saw owner confirmation in the form
      } else {
        // Create new owner profile with proper platform ID (exactly 9 characters)
        const generateOwnerRandomString = (length: number) => {
          const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
          let result = '';
          for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
          }
          return result;
        };
        const ownerPlatformId = `H00${generateOwnerRandomString(6)}`;
        // Create minimal profile record (RLS-friendly) - phone is mandatory for OTP
        const profileData: any = {
          user_platform_id: ownerPlatformId,
          first_name: ownerForm.first_name,
          last_name: ownerForm.last_name,
          email: ownerForm.email,
          phone: formattedPhone, // Phone is now mandatory for OTP verification
          role: 'pet_owner',
          is_active: true
        };
        
        // Add optional fields only if they exist
        if (ownerForm.address) profileData.address = ownerForm.address;
        
        console.log('Attempting to create profile with data:', profileData);
        
        const { data: newOwner, error: ownerError } = await supabase
          .from('profiles')
          .insert(profileData)
          .select('user_platform_id')
          .single();
        
        if (ownerError) {
          console.error('Error creating owner:', ownerError);
          throw ownerError;
        }
        ownerId = newOwner.user_platform_id;
        alert(`✅ New owner created: ${ownerForm.first_name} ${ownerForm.last_name}`);
      }
      
      // Get species and breed names for storage
      const selectedSpecies = petSpecies.find(s => s.id === petForm.species_id);
      const selectedBreed = petBreeds.find(b => b.id === petForm.breed_id);
      
      // Create the pet with proper platform ID (exactly 9 characters)
      const generateRandomString = (length: number) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
      };
      const petPlatformId = `A01${generateRandomString(6)}`;
      const { error: petError } = await supabase
        .from('pet_master')
        .insert({
          pet_platform_id: petPlatformId,
          user_platform_id: ownerId,
          name: petForm.name,
          species: selectedSpecies?.name || '',
          breed: selectedBreed?.name || '',
          species_id: petForm.species_id,
          // Note: breed_id column doesn't exist in pet_master table
          age: ageInMonths,
          date_of_birth: petForm.age_type === 'dob' ? petForm.date_of_birth : null,
          weight: parseFloat(petForm.weight) || null,
          color: petForm.color,
          gender: petForm.gender,
          medical_notes: petForm.medical_notes,
          is_active: true,
          created_at: new Date().toISOString()
        });
      
      if (petError) throw petError;
      
      // Reset forms and close modal
      setPetForm({
        name: '',
        species_id: '',
        breed_id: '',
        age_type: 'dob',
        date_of_birth: '',
        age_years: '',
        age_months: '',
        weight: '',
        color: '',
        gender: 'male',
        medical_notes: ''
      });
      
      setOwnerForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        emergency_contact: ''
      });
      
      setPetFormStep('owner');
      setIsAddPetModalOpen(false);
      alert('✅ Pet and owner added successfully!');
      
    } catch (error: any) {
      console.error('Failed to add pet:', error);
      console.error('Error details:', {
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code
      });
      alert(`❌ Failed to add pet: ${error?.message || 'Unknown error'}. Check console for details.`);
    }
  };

  // Filter appointments by search text (pet name, owner name, or IDs)
  const filteredAppointments = appointments?.filter((apt) => {
    if (!filters.search) return true;
    const searchLower = filters.search.toLowerCase();
    
    // Search in pet details
    const petMatch = 
      apt.pet?.name?.toLowerCase().includes(searchLower) ||
      apt.pet?.species?.toLowerCase().includes(searchLower) ||
      apt.pet?.breed?.toLowerCase().includes(searchLower) ||
      apt.pet_platform_id.toLowerCase().includes(searchLower);
    
    // Search in owner details
    const ownerMatch = 
      apt.owner?.first_name?.toLowerCase().includes(searchLower) ||
      apt.owner?.last_name?.toLowerCase().includes(searchLower) ||
      apt.owner?.email?.toLowerCase().includes(searchLower) ||
      apt.owner_user_platform_id.toLowerCase().includes(searchLower);
    
    // Search in entity and appointment details
    const otherMatch =
      apt.entity_platform_id.toLowerCase().includes(searchLower) ||
      apt.appointment_number?.toLowerCase().includes(searchLower) ||
      apt.reason?.toLowerCase().includes(searchLower);
    
    return petMatch || ownerMatch || otherMatch;
  }) || [];

  const statusColors = {
    scheduled: 'warning',
    confirmed: 'info',
    'in-progress': 'info',
    completed: 'success',
    cancelled: 'danger',
    'no-show': 'danger',
  } as const;

  // HMS Status Badge Helper
  const getHMSStatusClass = (status: string) => {
    const statusMap = {
      'scheduled': 'status-scheduled',
      'confirmed': 'hms-badge-success',
      'in-progress': 'hms-badge-info',
      'completed': 'hms-badge-success',
      'cancelled': 'hms-badge-error',
      'no-show': 'hms-badge-error'
    };
    return statusMap[status as keyof typeof statusMap] || 'hms-badge-secondary';
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'MMM dd, yyyy');
    } catch {
      return dateStr;
    }
  };

  const formatTime = (timeStr: string) => {
    try {
      const [hours, minutes] = timeStr.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return timeStr;
    }
  };

  return (
    <ContentArea>
      <VStack size="sm">
        <div className="flex items-baseline gap-3">
          <h1 className="text-3xl font-bold text-slate-800">Appointments</h1>
          <p className="text-sm text-slate-500">Manage and schedule pet appointments</p>
        </div>

        {/* Filters */}
        <ContentCard title="Filter Appointments">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input 
              placeholder="Search by ID..." 
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
            <Select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              options={[
                { value: '', label: 'All Status' },
                { value: 'scheduled', label: 'Scheduled' },
                { value: 'confirmed', label: 'Confirmed' },
                { value: 'in-progress', label: 'In Progress' },
                { value: 'completed', label: 'Completed' },
                { value: 'cancelled', label: 'Cancelled' },
                { value: 'no-show', label: 'No Show' },
              ]}
            />
            <Input 
              type="date" 
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              placeholder="Start date"
            />
            <Input 
              type="date" 
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              placeholder="End date"
            />
          </div>
        </ContentCard>

        {/* Appointments Table */}
        <ContentCard 
          title="All Appointments"
          scrollable={true}
          headerActions={
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsAddPetModalOpen(true)}
                className="hms-btn dept-outpatient"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Pet
              </button>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="hms-btn hms-btn-primary"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Appointment
              </button>
            </div>
          }
        >
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-danger">
              <p>Failed to load appointments</p>
              <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {filters.search || filters.status || filters.startDate || filters.endDate ? (
                <>
                  <p>No appointments match your filters</p>
                  <p className="text-sm mt-2">
                    {appointments && `(${appointments.length} total appointments in database)`}
                  </p>
                  <button 
                    className="hms-btn hms-btn-outline mt-4"
                    onClick={() => setFilters({ status: '', startDate: '', endDate: '', search: '' })}
                  >
                    Clear Filters
                  </button>
                </>
              ) : (
                <>
                  <p>No appointments found</p>
                  <p className="text-sm mt-2">Create your first appointment to get started</p>
                  <button className="hms-btn hms-btn-primary mt-4" onClick={() => setIsModalOpen(true)}>
                    Schedule First Appointment
                  </button>
                </>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Appointment #</TableHead>
                  <TableHead>Pet</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>EMR</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell className="font-medium font-mono text-xs">
                      {appointment.appointment_number || appointment.id.slice(0, 8)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{appointment.pet?.name || 'Unknown'}</div>
                        <div className="text-xs text-muted-foreground">
                          {appointment.pet?.species || 'N/A'} • {appointment.pet_platform_id}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {appointment.owner 
                            ? `${appointment.owner.first_name} ${appointment.owner.last_name}`
                            : 'Unknown'}
                        </div>
                        <div className="text-xs text-muted-foreground font-mono">
                          {appointment.owner_user_platform_id}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatDate(appointment.appointment_date)}
                      <br />
                      <span className="text-xs text-muted-foreground">
                        {formatTime(appointment.appointment_time)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {appointment.doctor 
                        ? `${appointment.doctor.first_name} ${appointment.doctor.last_name}`
                        : appointment.doctor_user_platform_id || '—'}
                    </TableCell>
                    <TableCell>
                      <span className={`hms-badge ${getHMSStatusClass(appointment.status)}`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1).replace('-', ' ')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center">
                        {appointment.emr_otp_verified ? (
                          <div title="EMR Access Verified - Ready">
                            <svg 
                              className="w-6 h-6 text-success" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        ) : appointment.emr_otp_code ? (
                          <div title="OTP Sent - Awaiting Verification">
                            <svg 
                              className="w-6 h-6 text-warning" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        ) : (
                          <div title="OTP Not Sent">
                            <svg 
                              className="w-6 h-6 text-muted-foreground" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {/* View Details */}
                        <button 
                          className="hms-btn hms-btn-ghost hms-btn-sm"
                          onClick={() => {
                            console.log('View button clicked, appointment:', appointment.id);
                            setSelectedAppointment(appointment);
                            setIsEditMode(false);
                            setIsViewEditModalOpen(true);
                          }}
                          title="View Details"
                        >
                          <svg className="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        
                        {/* Complete Consultation (if in progress) */}
                        {appointment.status === 'in-progress' && appointment.emr_write_access_active && (
                          <button 
                            className="hms-btn hms-btn-ghost hms-btn-sm text-primary"
                            onClick={() => handleEndConsultation(appointment.id)}
                            title="Complete Consultation"
                            disabled={endConsultation.isPending}
                          >
                            <svg className="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                        )}
                        
                        {/* Cancel Appointment */}
                        {(appointment.status === 'scheduled' || appointment.status === 'confirmed') && (
                          <button 
                            className="hms-btn hms-btn-ghost hms-btn-sm text-danger"
                            onClick={() => handleCancelAppointment(appointment.id)}
                            title="Cancel Appointment"
                            disabled={cancelAppointment.isPending}
                          >
                            <svg className="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                        
                        {/* Send OTP (if no OTP sent yet) */}
                        {appointment.status === 'scheduled' && !appointment.emr_otp_code && (
                          <button 
                            className="hms-btn hms-btn-ghost hms-btn-sm text-info"
                            onClick={() => {
                              console.log('Send OTP clicked for appointment:', appointment.id, 
                                'Status:', appointment.status, 
                                'Has OTP:', !!appointment.emr_otp_code,
                                'OTP Verified:', appointment.emr_otp_verified);
                              handleSendOTP(appointment.id);
                            }}
                            title="Send OTP to Owner"
                            disabled={sendOTPToOwner.isPending}
                          >
                            {sendOTPToOwner.isPending ? (
                              <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"></div>
                            ) : (
                              <svg className="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            )}
                          </button>
                        )}
                        
                        {/* Verify OTP (if OTP sent but not verified) */}
                        {appointment.emr_otp_code && !appointment.emr_otp_verified && (
                          <button 
                            className="hms-btn hms-btn-ghost hms-btn-sm text-warning"
                            onClick={() => {
                              console.log('Verify OTP clicked for appointment:', appointment.id,
                                'OTP Code:', appointment.emr_otp_code,
                                'OTP Verified:', appointment.emr_otp_verified,
                                'OTP Sent to Owner:', appointment.emr_otp_sent_to_owner);
                              console.log('OTP Modal state before:', isOTPModalOpen);
                              setOTPAppointmentId(appointment.id);
                              setIsOTPModalOpen(true);
                              console.log('OTP Modal should open now');
                            }}
                            title={`Verify OTP (${appointment.emr_otp_code})`}
                          >
                            <svg className="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 712 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z" />
                            </svg>
                          </button>
                        )}

                        {/* OTP Verified (if OTP verified) */}
                        {appointment.emr_otp_code && appointment.emr_otp_verified && (
                          <div className="flex items-center text-success text-sm" title="OTP Verified Successfully">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>OTP ✓</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </ContentCard>

      {/* New Appointment Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Schedule New Appointment" size="lg">
        <form onSubmit={handleCreateAppointment} className="space-y-6">
          {/* Unified Pet & Owner Search */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Search Pet & Owner <span className="text-danger">*</span>
            </label>
            <Input 
              placeholder="Search by pet name, species, breed, or ID..." 
              value={unifiedSearch}
              onChange={(e) => setUnifiedSearch(e.target.value)}
              disabled={!!selectedPet && !!selectedOwner}
            />
            
            {/* Display selected pet and owner */}
            {selectedPet && selectedOwner ? (
              <div className="space-y-2">
                <div className="p-3 border rounded-lg bg-success/10 border-success">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="font-semibold text-foreground">🐾 {selectedPet.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {selectedPet.species} • {selectedPet.breed} • {selectedPet.pet_platform_id}
                      </div>
                    </div>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="font-medium text-foreground">👤 {selectedOwner.first_name} {selectedOwner.last_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {selectedOwner.email} • {selectedOwner.user_platform_id}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="hms-btn hms-btn-outline hms-btn-sm mt-3 w-full"
                    onClick={() => {
                      setSelectedPet(null);
                      setSelectedOwner(null);
                      setUnifiedSearch('');
                      setSearchResults([]);
                    }}
                  >
                    Change Selection
                  </button>
                </div>
              </div>
            ) : searchResults.length > 0 && (
              <div className="border rounded-lg max-h-64 overflow-y-auto">
                {searchResults.map((result, index) => (
                  <button
                    key={`${result.pet.id}-${index}`}
                    type="button"
                    onClick={() => {
                      setSelectedPet(result.pet);
                      setSelectedOwner(result.owner);
                      setSearchResults([]);
                      setUnifiedSearch('');
                    }}
                    className="w-full p-3 text-left hover:bg-accent transition-colors border-b last:border-b-0"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-foreground flex items-center gap-2">
                          🐾 {result.pet.name}
                          <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                            {result.pet.species}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {result.pet.breed} • {result.pet.pet_platform_id}
                        </div>
                        {result.owner && (
                          <div className="mt-2 pt-2 border-t">
                            <div className="text-sm font-medium text-foreground">
                              👤 {result.owner.first_name} {result.owner.last_name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {result.owner.email}
                            </div>
                          </div>
                        )}
                        {!result.owner && (
                          <div className="mt-2 pt-2 border-t">
                            <div className="text-xs text-warning">
                              ⚠️ Owner information not found
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            {unifiedSearch.length >= 2 && searchResults.length === 0 && (
              <div className="p-4 text-center text-sm text-muted-foreground border rounded-lg">
                No pets found matching "{unifiedSearch}"
              </div>
            )}
          </div>

          {/* Hospital Info - Auto-set to FURFIELD */}
          {selectedEntity && (
            <div className="p-3 border rounded-lg bg-blue/10 border-blue">
              <div className="flex items-center">
                <div className="flex-1">
                  <div className="font-semibold text-foreground">
                    🏥 {selectedEntity.entity_name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {selectedEntity.city && `${selectedEntity.city} • `}
                    {selectedEntity.entity_platform_id}
                  </div>
                </div>
                <div className="text-xs text-blue-600 font-medium">Auto-Selected</div>
              </div>
            </div>
          )}

          {/* Appointment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Employee/Staff Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Select Staff Member <span className="text-danger">*</span>
              </label>
              <select
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={appointmentForm.employee_assignment_id}
                onChange={(e) => {
                  const selectedStaff = availableStaff.find(staff => staff.employee_assignment_id === e.target.value);
                  setSelectedEmployee(selectedStaff);
                  setAppointmentForm({ 
                    ...appointmentForm, 
                    employee_assignment_id: e.target.value,
                    employee_id: selectedStaff?.employee_id || '',
                    doctor_user_platform_id: selectedStaff?.user_platform_id || '',
                    appointment_time: '' // Reset time when staff changes
                  });
                }}
                required
                disabled={!appointmentForm.entity_platform_id}
              >
                <option value="">
                  {!appointmentForm.entity_platform_id 
                    ? "Select hospital first..." 
                    : availableStaff.length === 0 
                    ? "No staff available..." 
                    : "Select staff member..."
                  }
                </option>
                {availableStaff.map((staff) => (
                  <option key={staff.employee_assignment_id} value={staff.employee_assignment_id}>
                    {staff.full_name} ({staff.employee_id}) - {staff.employee_job_title}
                    {staff.role_type && ` • ${staff.role_type}`}
                  </option>
                ))}
              </select>
              {selectedEmployee && (
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>📋 {selectedEmployee.employee_job_title}</p>
                  <p>⏱️ {selectedEmployee.slot_duration_minutes || 15} min appointments</p>
                  {selectedEmployee.professional_email && (
                    <p>📧 {selectedEmployee.professional_email}</p>
                  )}
                </div>
              )}
            </div>
            
            {/* Date Selection with Quick Buttons */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Appointment Date <span className="text-danger">*</span>
              </label>
              <div className="flex gap-2 mb-2">
                <button
                  type="button"
                  className="hms-btn hms-btn-outline hms-btn-sm"
                  onClick={() => {
                    const today = new Date();
                    setAppointmentForm({ 
                      ...appointmentForm, 
                      appointment_date: today.toISOString().split('T')[0],
                      appointment_time: '' // Reset time when date changes
                    });
                  }}
                >
                  Today
                </button>
                <button
                  type="button"
                  className="hms-btn hms-btn-outline hms-btn-sm"
                  onClick={() => {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    setAppointmentForm({ 
                      ...appointmentForm, 
                      appointment_date: tomorrow.toISOString().split('T')[0],
                      appointment_time: '' // Reset time when date changes
                    });
                  }}
                >
                  Tomorrow
                </button>
                <button
                  type="button"
                  className="hms-btn hms-btn-outline hms-btn-sm"
                  onClick={() => {
                    const nextWeek = new Date();
                    nextWeek.setDate(nextWeek.getDate() + 7);
                    setAppointmentForm({ 
                      ...appointmentForm, 
                      appointment_date: nextWeek.toISOString().split('T')[0],
                      appointment_time: '' // Reset time when date changes
                    });
                  }}
                >
                  Next Week
                </button>
              </div>
              <Input 
                type="date" 
                value={appointmentForm.appointment_date}
                onChange={(e) => setAppointmentForm({ 
                  ...appointmentForm, 
                  appointment_date: e.target.value,
                  appointment_time: '' // Reset time when date changes
                })}
                min={new Date().toISOString().split('T')[0]}
                required 
              />
            </div>
          </div>

          {/* Available Time Slots Grid */}
          {selectedEmployee && appointmentForm.appointment_date && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Available Time Slots <span className="text-danger">*</span>
              </label>
              
              {loadingSlots ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Loading available slots...
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground border rounded-lg">
                  No available slots for {selectedEmployee.full_name} on {appointmentForm.appointment_date}
                  <br />
                  <span className="text-xs">Try selecting a different date or staff member</span>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot.slot_time}
                        type="button"
                        className={`
                          ${appointmentForm.appointment_time === slot.slot_time ? "hms-btn hms-btn-primary" : "hms-btn hms-btn-outline"}
                          hms-btn-sm h-8 text-xs
                          ${!slot.is_available 
                            ? "opacity-40 cursor-not-allowed bg-muted text-muted-foreground" 
                            : slot.booking_count > 0 
                            ? "bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100"
                            : ""
                          }
                        `}
                        onClick={() => {
                          if (slot.is_available) {
                            setAppointmentForm({ 
                              ...appointmentForm, 
                              appointment_time: slot.slot_time 
                            });
                          }
                        }}
                        disabled={!slot.is_available}
                      >
                        {slot.slot_time}
                        {!slot.is_available && (
                          <span className="ml-1">✗</span>
                        )}
                      </button>
                    ))}
                  </div>
                  
                  {appointmentForm.appointment_time && (
                    <div className="p-3 bg-success/10 border border-success rounded-lg">
                      <p className="text-sm font-medium text-success">
                        ✓ Selected: {appointmentForm.appointment_time} - {appointmentForm.appointment_time.split(':').map((part, i) => {
                          if (i === 0) return part;
                          return String(parseInt(part) + (selectedEmployee?.slot_duration_minutes || 15)).padStart(2, '0');
                        }).join(':')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {selectedEmployee?.slot_duration_minutes || 15} minute appointment with {selectedEmployee?.full_name}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 border rounded border-input bg-background"></div>
                      <span>Available</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 border rounded bg-muted"></div>
                      <span>Booked</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Appointment Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Appointment Type"
              value={appointmentForm.appointment_type}
              onChange={(e) => setAppointmentForm({ ...appointmentForm, appointment_type: e.target.value })}
              options={[
                { value: 'routine', label: 'Routine Checkup' },
                { value: 'vaccination', label: 'Vaccination' },
                { value: 'follow-up', label: 'Follow-up' },
                { value: 'emergency', label: 'Emergency' },
                { value: 'surgery', label: 'Surgery' },
                { value: 'dental', label: 'Dental' },
                { value: 'grooming', label: 'Grooming' },
              ]}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Reason for Visit</label>
            <textarea
              className="w-full min-h-20 rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Enter reason for visit..."
              value={appointmentForm.reason}
              onChange={(e) => setAppointmentForm({ ...appointmentForm, reason: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Notes (Optional)</label>
            <textarea
              className="w-full min-h-[60px] rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Additional notes..."
              value={appointmentForm.notes}
              onChange={(e) => setAppointmentForm({ ...appointmentForm, notes: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button 
              className="hms-btn hms-btn-outline"
              onClick={() => {
                setIsModalOpen(false);
                // Reset search states when closing
                setUnifiedSearch('');
                setSearchResults([]);
                setEntitySearch('');
                setEntitySearchResults([]);
              }} 
              type="button"
            >
              Cancel
            </button>
            <button 
              className="hms-btn hms-btn-primary"
              type="submit"
              disabled={
                !selectedPet || 
                !selectedOwner || 
                !selectedEntity || 
                !selectedEmployee || 
                !appointmentForm.appointment_time || 
                createAppointment.isPending
              }
            >
              {createAppointment.isPending ? 'Creating...' : 'Schedule Appointment'}
            </button>
          </div>
        </form>
      </Modal>

      {/* OTP Verification Modal */}
      <Modal 
        isOpen={isOTPModalOpen} 
        onClose={() => {
          setIsOTPModalOpen(false);
          setOTPAppointmentId('');
          setOTPCode('');
        }} 
        title="Verify OTP Code" 
        size="sm"
      >
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (otpCode.trim()) {
              verifyEMROTP.mutate(
                { appointmentId: otpAppointmentId, otpCode: otpCode.trim() },
                {
                  onSuccess: async () => {
                    // Find the verified appointment to get pet_platform_id
                    const verifiedAppointment = appointments?.find(apt => apt.id === otpAppointmentId);
                    
                    if (verifiedAppointment?.pet_platform_id) {
                      // Call function to sync OTP verification for all appointments of this pet today
                      try {
                        await supabase.rpc('sync_otp_verification_for_pet', {
                          p_pet_platform_id: verifiedAppointment.pet_platform_id
                        });
                        console.log('✅ Synced OTP verification for all appointments of pet:', verifiedAppointment.pet_platform_id);
                      } catch (error) {
                        console.error('Failed to sync OTP verification:', error);
                      }
                    }
                    
                    setIsOTPModalOpen(false);
                    setOTPAppointmentId('');
                    setOTPCode('');
                    alert('✅ OTP verified successfully! EMR access is now ready for all appointments today.');
                  },
                  onError: (error) => {
                    console.error('OTP verification failed:', error);
                  }
                }
              );
            }
          }} 
          className="space-y-4"
        >
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Enter OTP Code <span className="text-danger">*</span>
            </label>
            <Input 
              type="text"
              placeholder="Enter 6-digit code" 
              value={otpCode}
              onChange={(e) => setOTPCode(e.target.value)}
              maxLength={6}
              pattern="[0-9]{6}"
              required
              autoFocus
            />
            <p className="text-xs text-muted-foreground">
              Enter the 6-digit OTP code sent to the pet owner
            </p>
            <button
              type="button"
              className="hms-btn hms-btn-ghost hms-btn-sm text-info hover:text-info/80 text-xs"
              onClick={() => {
                if (otpAppointmentId) {
                  handleSendOTP(otpAppointmentId);
                }
              }}
              disabled={sendOTPToOwner.isPending}
            >
              {sendOTPToOwner.isPending ? 'Sending...' : '📧 Resend OTP'}
            </button>
          </div>

          {verifyEMROTP.isError && (
            <div className="p-3 rounded-lg bg-danger/10 border border-danger text-danger text-sm">
              Failed to verify OTP. Please check the code and try again.
            </div>
          )}

          {sendOTPToOwner.isSuccess && (
            <div className="p-3 rounded-lg bg-success/10 border border-success text-success text-sm">
              ✅ OTP resent successfully! Please check with the owner.
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button 
              className="hms-btn hms-btn-outline"
              onClick={() => {
                setIsOTPModalOpen(false);
                setOTPAppointmentId('');
                setOTPCode('');
              }} 
              type="button"
              disabled={verifyEMROTP.isPending}
            >
              Cancel
            </button>
            <button 
              className="hms-btn hms-btn-primary"
              type="submit"
              disabled={!otpCode.trim() || otpCode.trim().length !== 6 || verifyEMROTP.isPending}
            >
              {verifyEMROTP.isPending ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>
        </form>
      </Modal>

      {/* View/Edit Appointment Modal */}
      {selectedAppointment && (
        <Modal 
          isOpen={isViewEditModalOpen} 
          onClose={() => {
            setIsViewEditModalOpen(false);
            setIsEditMode(false);
            setSelectedAppointment(null);
          }} 
          title={isEditMode ? "Edit Appointment" : "Appointment Details"} 
          size="lg"
        >
          {isEditMode ? (
            /* EDIT MODE - Form with inputs */
            <form className="space-y-6">
              {/* Header with Status */}
              <div className="flex items-center justify-between pb-4 border-b">
                <div>
                  <h3 className="text-xl font-bold">{selectedAppointment.appointment_number}</h3>
                  <p className="text-sm text-muted-foreground">Editing appointment</p>
                </div>
                <Badge variant={statusColors[selectedAppointment.status as keyof typeof statusColors] || 'default'}>
                  {selectedAppointment.status}
                </Badge>
              </div>

              {/* Pet & Owner Info (Read-only in edit mode) */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-3">🐾 Pet Information</h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Name</p>
                      <p className="font-semibold">{selectedAppointment.pet?.name || 'Unknown'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Species / Breed</p>
                      <p className="text-sm">{selectedAppointment.pet?.species} • {selectedAppointment.pet?.breed}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-3">👤 Owner Information</h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Name</p>
                      <p className="font-semibold">
                        {selectedAppointment.owner 
                          ? `${selectedAppointment.owner.first_name} ${selectedAppointment.owner.last_name}`
                          : 'Unknown'}
                      </p>
                    </div>
                    {selectedAppointment.owner?.email && (
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="text-sm">{selectedAppointment.owner.email}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Editable Appointment Details */}
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-3">📋 Appointment Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">
                      Appointment Date <span className="text-danger">*</span>
                    </label>
                    <Input 
                      type="date" 
                      defaultValue={selectedAppointment.appointment_date}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">
                      Appointment Time <span className="text-danger">*</span>
                    </label>
                    <Input 
                      type="time" 
                      defaultValue={selectedAppointment.appointment_time}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">
                      Type <span className="text-danger">*</span>
                    </label>
                    <select
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      defaultValue={selectedAppointment.appointment_type || 'routine'}
                      required
                    >
                      <option value="routine">Routine Checkup</option>
                      <option value="emergency">Emergency</option>
                      <option value="follow-up">Follow-up</option>
                      <option value="vaccination">Vaccination</option>
                      <option value="surgery">Surgery</option>
                      <option value="grooming">Grooming</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">
                      Duration (minutes)
                    </label>
                    <Input 
                      type="number" 
                      defaultValue={selectedAppointment.duration_minutes || 30}
                      min="15"
                      step="15"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-muted-foreground mb-1">
                      Doctor Platform ID
                    </label>
                    <Input 
                      type="text" 
                      placeholder="H00xxxxxx"
                      defaultValue={selectedAppointment.doctor_user_platform_id || ''}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-muted-foreground mb-1">
                      Reason for Visit
                    </label>
                    <Input 
                      type="text" 
                      placeholder="e.g., Annual checkup, vaccination..."
                      defaultValue={selectedAppointment.reason || ''}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-muted-foreground mb-1">
                      Notes (Optional)
                    </label>
                    <textarea
                      className="w-full min-h-20 rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      placeholder="Additional notes..."
                      defaultValue={selectedAppointment.notes || ''}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button 
                  className="hms-btn hms-btn-outline"
                  onClick={() => setIsEditMode(false)}
                  type="button"
                >
                  Cancel Edit
                </button>
                <button className="hms-btn hms-btn-primary" type="submit">
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            /* VIEW MODE - Read-only display */
            <div className="space-y-6">
              {/* Header with Status */}
              <div className="flex items-center justify-between pb-4 border-b">
                <div>
                  <h3 className="text-xl font-bold">{selectedAppointment.appointment_number}</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(selectedAppointment.appointment_date)} at {formatTime(selectedAppointment.appointment_time)}
                  </p>
                </div>
                <Badge variant={statusColors[selectedAppointment.status as keyof typeof statusColors] || 'default'}>
                  {selectedAppointment.status}
                </Badge>
              </div>

              {/* Pet & Owner Info */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-3">🐾 Pet Information</h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Name</p>
                      <p className="font-semibold">{selectedAppointment.pet?.name || 'Unknown'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Species / Breed</p>
                      <p className="text-sm">{selectedAppointment.pet?.species} • {selectedAppointment.pet?.breed}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Pet ID</p>
                      <p className="text-xs font-mono">{selectedAppointment.pet_platform_id}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-3">👤 Owner Information</h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Name</p>
                      <p className="font-semibold">
                        {selectedAppointment.owner 
                          ? `${selectedAppointment.owner.first_name} ${selectedAppointment.owner.last_name}`
                          : 'Unknown'}
                      </p>
                    </div>
                    {selectedAppointment.owner?.email && (
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="text-sm">{selectedAppointment.owner.email}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-muted-foreground">Owner ID</p>
                      <p className="text-xs font-mono">{selectedAppointment.owner_user_platform_id}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Appointment Details */}
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-3">📋 Appointment Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Type</p>
                    <p className="text-sm capitalize">{selectedAppointment.appointment_type || 'routine'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="text-sm">{selectedAppointment.duration_minutes || 30} minutes</p>
                  </div>
                  {selectedAppointment.doctor && (
                    <div className="col-span-2">
                      <p className="text-xs text-muted-foreground">Doctor</p>
                      <p className="text-sm">{selectedAppointment.doctor.first_name} {selectedAppointment.doctor.last_name}</p>
                    </div>
                  )}
                  {selectedAppointment.reason && (
                    <div className="col-span-2">
                      <p className="text-xs text-muted-foreground">Reason</p>
                      <p className="text-sm">{selectedAppointment.reason}</p>
                    </div>
                  )}
                  {selectedAppointment.notes && (
                    <div className="col-span-2">
                      <p className="text-xs text-muted-foreground">Notes</p>
                      <p className="text-sm text-muted-foreground">{selectedAppointment.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* EMR Status */}
              <div className="pt-4 border-t">
                <h4 className="text-sm font-semibold text-muted-foreground mb-3">🔐 EMR Access Status</h4>
                <div className="flex gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">OTP Status</p>
                    {selectedAppointment.emr_otp_verified ? (
                      <Badge variant="success">Verified</Badge>
                    ) : selectedAppointment.emr_otp_code ? (
                      <Badge variant="warning">Pending</Badge>
                    ) : (
                      <Badge variant="default">Not Sent</Badge>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Write Access</p>
                    {selectedAppointment.emr_write_access_active ? (
                      <Badge variant="success">Active</Badge>
                    ) : (
                      <Badge variant="default">Inactive</Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button 
                  className="hms-btn hms-btn-outline"
                  onClick={() => {
                    setIsViewEditModalOpen(false);
                    setSelectedAppointment(null);
                  }}
                >
                  Close
                </button>
                {(selectedAppointment.status === 'scheduled' || selectedAppointment.status === 'confirmed') && (
                  <button className="hms-btn hms-btn-primary" onClick={() => setIsEditMode(true)}>
                    Edit Appointment
                  </button>
                )}
              </div>
            </div>
          )}
        </Modal>
      )}

      {/* PROPERLY DESIGNED Add Pet Modal */}
      <Modal 
        isOpen={isAddPetModalOpen} 
        onClose={() => {
          setIsAddPetModalOpen(false);
          setPetFormStep('owner');
        }} 
        title={petFormStep === 'owner' ? '1️⃣ Owner Information' : '2️⃣ Pet Information'} 
        size="lg"
      >
        <form onSubmit={handleAddPet} className="space-y-6">
          
          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 ${petFormStep === 'owner' ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${petFormStep === 'owner' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}>1</div>
                <span>Owner</span>
              </div>
              <div className="w-8 h-0.5 bg-gray-300"></div>
              <div className={`flex items-center space-x-2 ${petFormStep === 'pet' ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${petFormStep === 'pet' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}>2</div>
                <span>Pet</span>
              </div>
            </div>
          </div>

          {petFormStep === 'owner' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-blue-800 mb-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Owner Lookup</span>
                </div>
                <p className="text-sm text-blue-700">Enter your <strong>email address</strong> or <strong>phone number</strong> to check if you're already registered.</p>
                <p className="text-sm text-blue-600 mt-2">
                  <strong>Note:</strong> Press Enter after typing to search. For phone numbers, you can enter with or without country code.
                  {hospitalLocation?.location_currency && (
                    <span className="ml-1">Local numbers will use <strong>{hospitalLocation.location_currency.country_name}</strong> ({defaultISDCode}) by default.</span>
                  )}
                </p>
              </div>

              <div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address or Phone Number *
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      required
                      value={contactLookupValue}
                      onChange={(e) => setContactLookupValue(e.target.value)}
                      onKeyPress={handleContactInputKeyPress}
                      placeholder={`Enter email (user@example.com) or phone (555 123 4567 or ${defaultISDCode} 555 123 4567)`}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={handleContactLookupSubmit}
                      disabled={!contactLookupValue.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                      Search
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Press Enter or click Search to look up your account
                  </p>
                  <div className="text-xs text-gray-600 mt-1">
                    <div><strong>Examples:</strong></div>
                    <div>• Email: john@example.com</div>
                    <div>• Phone (local): 555 123 4567</div>
                    <div>• Phone (international): {defaultISDCode} 555 123 4567</div>
                  </div>
                </div>
              </div>

              {hasSearched && isOwnerExisting && (
                <div className="p-3 border rounded-lg bg-green-50 border-green-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span className="font-medium text-green-800">✅ Welcome back, {ownerForm.first_name}!</span>
                  </div>
                  <p className="text-sm text-green-700">
                    We found your profile using your {lookupType}. Ready to add a new pet to your account.
                  </p>
                  <div className="text-xs text-gray-600 mt-1">
                    <p><strong>Email:</strong> {ownerForm.email}</p>
                    <p><strong>Phone:</strong> {ownerForm.phone}</p>
                  </div>
                  <div className="flex space-x-2 mt-2">
                    <button
                      onClick={() => setPetFormStep('pet')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      Continue to Pet Details →
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setHasSearched(false);
                        setContactLookupValue('');
                        setIsOwnerExisting(false);
                        setLookupType(null);
                        setOwnerForm({ 
                          first_name: '', last_name: '', email: '', phone: '', 
                          address: '', emergency_contact: '' 
                        });
                      }}
                      className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                    >
                      Search Different Contact
                    </button>
                  </div>
                </div>
              )}

              {hasSearched && !isOwnerExisting && (
                <div className="space-y-4">
                  <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-yellow-800"><strong>New owner</strong> - Please complete your profile information:</p>
                      <button
                        type="button"
                        onClick={() => {
                          setHasSearched(false);
                          setContactLookupValue('');
                          setIsOwnerExisting(false);
                          setLookupType(null);
                          setOwnerForm({ 
                            first_name: '', last_name: '', email: '', phone: '', 
                            address: '', emergency_contact: '' 
                          });
                        }}
                        className="text-xs px-2 py-1 bg-yellow-200 hover:bg-yellow-300 rounded text-yellow-800 transition-colors"
                      >
                        Search Different Contact
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="First Name *"
                      required
                      value={ownerForm.first_name}
                      onChange={(e) => setOwnerForm({ ...ownerForm, first_name: e.target.value })}
                      placeholder="Enter first name"
                    />
                    <Input
                      label="Last Name"
                      value={ownerForm.last_name}
                      onChange={(e) => setOwnerForm({ ...ownerForm, last_name: e.target.value })}
                      placeholder="Enter last name"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number (Required for OTP) *
                      </label>
                      <div className="flex space-x-2">
                        <select
                          value={selectedCountryCode}
                          onChange={(e) => setSelectedCountryCode(e.target.value)}
                          className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          disabled={isLoadingCurrency}
                        >
                          <option value="">Country</option>
                          {isdCodes.map((country) => (
                            <option key={country.countryCode} value={country.isdCode}>
                              {country.isdCode} ({country.name})
                            </option>
                          ))}
                        </select>
                        <input
                          type="tel"
                          required
                          value={ownerForm.phone.replace(/^\+?[\d\s-]*/, '').replace(/[^\d]/g, '')}
                          onChange={(e) => {
                            const phoneDigits = e.target.value.replace(/[^\d]/g, '');
                            const fullPhone = selectedCountryCode ? `${selectedCountryCode}${phoneDigits}` : phoneDigits;
                            setOwnerForm({ ...ownerForm, phone: fullPhone });
                          }}
                          placeholder="555 123 4567"
                          className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            validationErrors.phone ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                      </div>
                      {validationErrors.phone && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>
                      )}
                      {!validationErrors.phone && ownerForm.phone && validateE164Phone(formatToE164(ownerForm.phone)) && (
                        <p className="text-green-600 text-sm mt-1">✅ Valid E.164 format: {formatToE164(ownerForm.phone)}</p>
                      )}
                      <p className="text-gray-500 text-xs mt-1">
                        Required for OTP verification & record sharing. 
                        {hospitalLocation?.location_currency && (
                          <span className="text-blue-600"> Default: {hospitalLocation.location_currency.country_name}</span>
                        )}
                      </p>
                    </div>
                    <Input
                      label="Emergency Contact"
                      value={ownerForm.emergency_contact}
                      onChange={(e) => setOwnerForm({ ...ownerForm, emergency_contact: e.target.value })}
                      placeholder="Emergency contact name and phone"
                    />
                  </div>

                  <Input
                    label="Address"
                    value={ownerForm.address}
                    onChange={(e) => setOwnerForm({ ...ownerForm, address: e.target.value })}
                    placeholder="Street address, city, state, zip"
                  />
                  
                  <button
                    onClick={() => setPetFormStep('pet')}
                    disabled={
                      !ownerForm.first_name || 
                      !ownerForm.email || 
                      !ownerForm.phone ||
                      !validateE164Phone(formatToE164(ownerForm.phone || ''))
                    }
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    Continue to Pet Details →
                  </button>
                </div>
              )}
            </div>
          )}

          {petFormStep === 'pet' && (
            <div className="space-y-4">
              <Input
                label="Pet Name *"
                required
                value={petForm.name}
                onChange={(e) => setPetForm({ ...petForm, name: e.target.value })}
                placeholder="Enter pet's name"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Species *"
                  required
                  value={petForm.species_id}
                  onChange={(e) => setPetForm({ ...petForm, species_id: e.target.value, breed_id: '' })}
                  options={[
                    { value: '', label: 'Select Species' },
                    ...petSpecies.map(species => ({ 
                      value: species.id, 
                      label: species.name 
                    }))
                  ]}
                />
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Breed {petBreeds.length > 10 && <span className="text-xs text-gray-500">({petBreeds.length} breeds - search to filter)</span>}
                  </label>
                  {!petForm.species_id ? (
                    <input
                      disabled
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-500"
                      placeholder="Select species first"
                    />
                  ) : (
                    <div className="relative">
                      <input
                        type="text"
                        value={breedSearch}
                        onChange={(e) => setBreedSearch(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        placeholder={`Search ${petBreeds.length} breeds...`}
                      />
                      {breedSearch && filteredBreeds.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                          {filteredBreeds.slice(0, 20).map(breed => (
                            <button
                              key={breed.id}
                              type="button"
                              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                              onClick={() => {
                                setPetForm({ ...petForm, breed_id: breed.id });
                                setBreedSearch(breed.name);
                              }}
                            >
                              {breed.name}
                            </button>
                          ))}
                          {filteredBreeds.length > 20 && (
                            <div className="px-3 py-2 text-xs text-gray-500 border-t">
                              ...and {filteredBreeds.length - 20} more. Keep typing to narrow down.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Smart Age Input */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Age Information</label>
                <div className="flex items-center space-x-4 mb-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="age_type"
                      value="dob"
                      checked={petForm.age_type === 'dob'}
                      onChange={(e) => setPetForm({ ...petForm, age_type: e.target.value })}
                      className="mr-2"
                    />
                    <span className="text-sm">I know the date of birth</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="age_type"
                      value="estimate"
                      checked={petForm.age_type === 'estimate'}
                      onChange={(e) => setPetForm({ ...petForm, age_type: e.target.value })}
                      className="mr-2"
                    />
                    <span className="text-sm">I want to estimate the age</span>
                  </label>
                </div>

                {petForm.age_type === 'dob' ? (
                  <Input
                    label="Date of Birth"
                    type="date"
                    value={petForm.date_of_birth}
                    onChange={(e) => setPetForm({ ...petForm, date_of_birth: e.target.value })}
                    max={new Date().toISOString().split('T')[0]}
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Years"
                      type="number"
                      min="0"
                      max="30"
                      value={petForm.age_years}
                      onChange={(e) => setPetForm({ ...petForm, age_years: e.target.value })}
                      placeholder="0"
                    />
                    <Input
                      label="Months"
                      type="number"
                      min="0"
                      max="11"
                      value={petForm.age_months}
                      onChange={(e) => setPetForm({ ...petForm, age_months: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input
                  label="Weight (kg)"
                  type="number"
                  step="0.1"
                  min="0"
                  value={petForm.weight}
                  onChange={(e) => setPetForm({ ...petForm, weight: e.target.value })}
                  placeholder="Weight"
                />
                
                <Select
                  label="Gender"
                  value={petForm.gender}
                  onChange={(e) => setPetForm({ ...petForm, gender: e.target.value })}
                  options={[
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' }
                  ]}
                />

                <Input
                  label="Color/Markings"
                  value={petForm.color}
                  onChange={(e) => setPetForm({ ...petForm, color: e.target.value })}
                  placeholder="e.g., Brown, White spots"
                />
              </div>
              
              {/* Medical Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medical Notes (Optional)
                </label>
                <textarea
                  value={petForm.medical_notes}
                  onChange={(e) => setPetForm({ ...petForm, medical_notes: e.target.value })}
                  rows={3}
                  className="w-full min-h-20 rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Any medical conditions, allergies, or special notes..."
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t">
            <button 
              type="button"
              className="hms-btn hms-btn-outline"
              onClick={() => {
                if (petFormStep === 'pet') {
                  setPetFormStep('owner');
                } else {
                  setIsAddPetModalOpen(false);
                  setPetFormStep('owner');
                }
              }}
            >
              {petFormStep === 'pet' ? '← Back' : 'Cancel'}
            </button>
            
            {petFormStep === 'owner' ? (
              <button 
                type="button"
                className="hms-btn hms-btn-primary"
                onClick={() => {
                  if (!ownerForm.email) {
                    alert('❌ Please enter your email address');
                    return;
                  }
                  if (!isOwnerExisting && !ownerForm.first_name) {
                    alert('❌ Please fill in your first name');
                    return;
                  }
                  setPetFormStep('pet');
                }}
              >
                Next: Pet Info →
              </button>
            ) : (
              <button className="hms-btn hms-btn-primary" type="submit">
                ✅ Add Pet & Owner
              </button>
            )}
          </div>
        </form>
      </Modal>
      </VStack>
    </ContentArea>
  );
}
