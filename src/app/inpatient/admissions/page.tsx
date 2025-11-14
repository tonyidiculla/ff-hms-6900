'use client';

/**
 * Inpatient Admissions Management Page
 * 
 * This component manages veterinary inpatient admissions using the following database schema:
 * 
 * Primary Table: hospital_inpatients
 * - Stores admission records with medical details, status, and billing information
 * - Links to pet_master via pet_platform_id for patient details
 * - Links to profiles via user_platform_id for owner information
 * - Contains bed assignments, treatment plans, and discharge dates
 * 
 * Related Tables:
 * - pet_master: Pet patient information (name, species, breed, age, weight)
 * - profiles: Pet owner contact and identification information
 * - hospital_master: Hospital/entity information via entity_platform_id
 * 
 * Key Features:
 * - Pet search with auto-population of pet and owner details
 * - Real-time admission status tracking (active, critical, stable, discharged)
 * - Direct API integration with inpatient service
 * - Comprehensive display of pet, owner, and medical information
 * - Bed assignment management
 * - Expected vs actual discharge date tracking
 * - Error handling with user-friendly messages
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { ContentArea, ContentCard, VStack, MetricsGrid } from '@/components/layout/PageLayout';
import { 
  useAdmissions, 
  useCreateAdmission, 
  useUpdateAdmission, 
  useSearchPets,
  useEmployees
} from '@/hooks/useHMSMicroservices';

export default function AdmissionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState<any>(null);
  const [holdDischarge, setHoldDischarge] = useState(false);
  const [filters, setFilters] = useState({
    entity_platform_id: 'E019nC8m3', // Default hospital entity
    status: '' as 'active' | 'critical' | 'stable' | 'discharged' | '',
    limit: 50,
    offset: 0,
  });

  // Form state for new admission
  const [formData, setFormData] = useState({
    petSearch: '',
    selectedPet: null as any,
    petName: '',
    species: '',
    ownerName: '',
    ownerPhone: '',
    admissionDate: new Date().toISOString().split('T')[0], // Today's date
    admissionTime: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }), // Current time
    bed: '',
    doctor: '',
    admissionType: '',
    reason: ''
  });

  const [showPetResults, setShowPetResults] = useState(false);

  // Fetch admissions with full database schema integration
  const { data: admissions = [], isLoading, error } = useAdmissions({
    entity_platform_id: filters.entity_platform_id,
    status: filters.status || undefined,
    limit: filters.limit,
    offset: filters.offset,
  });

  // Search pets when petSearch changes (debounced)
  const { data: petSearchResults = [], isLoading: isPetSearchLoading, error: petSearchError } = useSearchPets({
    entity_platform_id: filters.entity_platform_id,
    search: formData.petSearch,
  }, formData.petSearch.length > 2); // Only search when more than 2 characters

  // Debug pet search
  useEffect(() => {
    if (formData.petSearch.length > 2) {
      console.log('Pet search query:', formData.petSearch);
      console.log('Pet search results:', petSearchResults);
      console.log('Pet search loading:', isPetSearchLoading);
      console.log('Pet search error:', petSearchError);
    }
  }, [formData.petSearch, petSearchResults, isPetSearchLoading, petSearchError]);

  // Fetch employees for doctor selection
  const { data: employees = [] } = useEmployees({
    hospital_id: filters.entity_platform_id,
    status: 'active'
  });

  // State for available beds
  const [availableBeds, setAvailableBeds] = useState<{value: string, label: string}[]>([]);
  const [bedsLoading, setBedsLoading] = useState(false);

  // Fetch available beds function
  const fetchAvailableBeds = async () => {
    setBedsLoading(true);
    try {
      const response = await fetch(`/api/inpatient/beds/available?entity_platform_id=${filters.entity_platform_id}`);
      const result = await response.json();
      
      if (result.success && result.data) {
        // Filter: Only INP prefix beds, exclude consultation tables and procedure rooms
        const filteredBeds = result.data.filter((bed: any) => {
          const bedNumber = bed.bed_number || '';
          const desc = bed.description?.toLowerCase() || '';
          
          // Must start with "INP" and not be consultation/procedure room
          return bedNumber.startsWith('INP') && 
                 !desc.includes('consultation table') && 
                 !desc.includes('procedure room');
        });
        
        const bedOptions = filteredBeds.map((bed: any) => ({
          value: bed.id,
          label: `${bed.bed_number}${bed.description ? ` - ${bed.description}` : ''}`
        }));
        setAvailableBeds(bedOptions);
      } else {
        console.warn('No beds available or API error:', result);
        // Fallback to empty array
        setAvailableBeds([]);
      }
    } catch (error) {
      console.error('Failed to fetch beds:', error);
      setAvailableBeds([]);
    } finally {
      setBedsLoading(false);
    }
  };

  // Fetch beds when component mounts or entity changes
  useEffect(() => {
    if (filters.entity_platform_id) {
      fetchAvailableBeds();
    }
  }, [filters.entity_platform_id]);

  // Note: Statistics and bed management moved to facility service
  // These features are now handled by the ff-faci-6840 microservice

  const createAdmission = useCreateAdmission();
  const updateAdmission = useUpdateAdmission();

  // Handle pet selection and auto-populate fields
  const handlePetSelect = (pet: any) => {
    setFormData(prev => ({
      ...prev,
      selectedPet: pet,
      petName: pet.pet_name || pet.name || '',
      species: pet.species || '',
      ownerName: pet.owner ? `${pet.owner.first_name || ''} ${pet.owner.last_name || ''}`.trim() : pet.owner_name || '',
      ownerPhone: pet.owner?.personal_contact_number || pet.owner_phone || '',
      petSearch: pet.pet_name || pet.name || ''
    }));
    setShowPetResults(false);
  };

  // Reset form when modal opens
  const handleOpenModal = () => {
    setFormData({
      petSearch: '',
      selectedPet: null,
      petName: '',
      species: '',
      ownerName: '',
      ownerPhone: '',
      admissionDate: new Date().toISOString().split('T')[0],
      admissionTime: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      bed: '',
      doctor: '',
      admissionType: '',
      reason: ''
    });
    setIsModalOpen(true);
  };

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Show pet search results when typing in pet search
    if (field === 'petSearch') {
      setShowPetResults(value.length > 2);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    console.log('[Admission Form] Submit triggered');
    console.log('[Admission Form] Form data:', formData);
    
    // Validate required fields
    if (!formData.selectedPet || !formData.admissionDate || !formData.reason || !formData.doctor || !formData.bed) {
      alert('Please fill in all required fields and select a pet.');
      return;
    }
    
    const admissionData = {
      // Required fields from hospital_inpatients table
      pet_platform_id: formData.selectedPet.pet_platform_id,
      user_platform_id: formData.selectedPet.owner?.user_platform_id || formData.selectedPet.user_platform_id,
      entity_platform_id: 'E019nC8m3', // Current hospital entity
      admission_date: `${formData.admissionDate}T${formData.admissionTime || '00:00'}:00Z`,
      admission_reason: formData.reason,
      current_condition: 'To be assessed by attending veterinarian',
      status: 'active' as const,
      treatment_plan: 'To be determined by attending veterinarian',
      primary_veterinarian_name: formData.doctor,
      bed_number: formData.bed,
      ip_billing_notes: 'Standard admission charges apply',
      // Optional fields - set to null if not provided
      employee_entity_id: null, // Will be assigned by staff later
      emr_record_id: null,
      expected_discharge_date: null
    };

    console.log('[Admission Form] Admission data to submit:', admissionData);

    try {
      console.log('[Admission Form] Calling createAdmission.mutateAsync...');
      const result = await createAdmission.mutateAsync(admissionData);
      console.log('[Admission Form] Admission created successfully:', result);
      
      setIsModalOpen(false);
      // Reset form
      setFormData({
        petSearch: '',
        selectedPet: null,
        petName: '',
        species: '',
        ownerName: '',
        ownerPhone: '',
        admissionDate: new Date().toISOString().split('T')[0],
        admissionTime: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        bed: '',
        doctor: '',
        admissionType: '',
        reason: ''
      });
      
      alert('Admission created successfully!');
    } catch (error) {
      console.error('[Admission Form] Failed to create admission:', error);
      alert(`Failed to create admission: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Calculate metrics
  const activeAdmissions = admissions.filter((a: any) => 
    a.status === 'active' || a.status === 'critical' || a.status === 'stable'
  );
  const criticalCount = admissions.filter((a: any) => a.status === 'critical').length;
  
  // Calculate average stay for discharged patients
  const dischargedAdmissions = admissions.filter((a: any) => 
    a.status === 'discharged' && a.actual_discharge_date && a.admission_date
  );
  const avgStay = dischargedAdmissions.length > 0
    ? dischargedAdmissions.reduce((sum: number, a: any) => {
        const admitDate = new Date(a.admission_date);
        const dischargeDate = new Date(a.actual_discharge_date);
        const days = Math.ceil((dischargeDate.getTime() - admitDate.getTime()) / (1000 * 60 * 60 * 24));
        return sum + days;
      }, 0) / dischargedAdmissions.length
    : 0;

  // Count occupied beds
  const occupiedBeds = activeAdmissions.length;
  const totalBeds = availableBeds.length + occupiedBeds; // Rough estimate

  const statusConfig = {
    active: { variant: 'warning' as const, label: 'Active' },
    critical: { variant: 'danger' as const, label: 'Critical' },
    stable: { variant: 'success' as const, label: 'Stable' },
    ready_for_discharge: { variant: 'success' as const, label: 'Ready for Discharge' },
    discharge_hold: { variant: 'warning' as const, label: 'Discharge Hold' },
    discharged: { variant: 'default' as const, label: 'Discharged' },
  };

  // Handler for viewing/editing admission details
  const handleViewDetails = (admission: any) => {
    setSelectedAdmission(admission);
    setHoldDischarge(admission.status === 'discharge_hold');
    setIsEditModalOpen(true);
  };

  return (
    <ContentArea>
      <VStack size="sm">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-3">
              <h1 className="text-3xl font-bold text-gray-900">Inpatient Admissions</h1>
              <p className="text-sm text-gray-600">Manage pet admissions and bed assignments</p>
            </div>
            <Button onClick={handleOpenModal}>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Admission
            </Button>
          </div>
        </div>



        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Admitted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeAdmissions.length}</div>
              <p className="text-xs text-muted-foreground">Currently hospitalized</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Available Beds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{availableBeds.length}</div>
              <p className="text-xs text-muted-foreground">
                {totalBeds > 0 ? `Out of ${totalBeds} total` : 'Loading...'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Critical Care</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {criticalCount}
              </div>
              <p className="text-xs text-muted-foreground">Requires attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Stay</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {avgStay > 0 ? `${avgStay.toFixed(1)} days` : 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">
                {dischargedAdmissions.length > 0 
                  ? `Based on ${dischargedAdmissions.length} discharge${dischargedAdmissions.length > 1 ? 's' : ''}`
                  : 'No data yet'
                }
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <ContentCard title="Filter Admissions">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input placeholder="Search pet..." />
            <Select
              options={[
                { value: '', label: 'All Status' },
                { value: 'active', label: 'Active' },
                { value: 'critical', label: 'Critical' },
                { value: 'stable', label: 'Stable' },
              ]}
              onChange={(e) => setFilters({ ...filters, status: e.target.value as '' | 'active' | 'critical' | 'stable' | 'discharged' })}
            />
            <Select
              options={[
                { value: 'all', label: 'All Locations' },
                { value: 'icu', label: 'ICU' },
                { value: 'general', label: 'General Care' },
              ]}
            />
            <Button variant="outline">Filter</Button>
          </div>
        </ContentCard>

        {/* Admissions Table */}
        <ContentCard 
          title="Current Admissions"
          scrollable={true}>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading admissions...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">Error loading admissions: {error.message}</div>
          ) : admissions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No admissions found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pet Details</TableHead>
                  <TableHead>Owner Information</TableHead>
                  <TableHead>Admission Details</TableHead>
                  <TableHead>Bed Assignment</TableHead>
                  <TableHead>Veterinarian</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expected Discharge</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
                <TableBody>
                  {admissions.map((admission: any) => (
                    <TableRow key={admission.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{admission.pet?.name || admission.petName || admission.pet_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {admission.pet?.species || admission.species} • {admission.pet?.breed || admission.breed || 'Mixed'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {admission.pet?.age || admission.age}yr • {admission.pet?.weight || admission.weight}kg
                          </p>
                          <p className="text-xs text-blue-600 font-mono">
                            {admission.pet?.pet_platform_id || admission.pet_platform_id}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {admission.owner?.first_name || admission.owner_name || admission.owner} {admission.owner?.last_name || ''}
                          </p>
                          <p className="text-sm text-muted-foreground">{admission.owner?.personal_email}</p>
                          <p className="text-xs text-muted-foreground">{admission.owner?.personal_contact_number}</p>
                          <p className="text-xs text-blue-600 font-mono">
                            {admission.owner?.user_platform_id || admission.user_platform_id}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">
                            {new Date(admission.admission_date || admission.admissionDate).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(admission.admission_date || admission.admissionDate).toLocaleTimeString()}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {admission.admission_reason || admission.reason}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{admission.bed?.bed_number || 'Not assigned'}</p>
                          <p className="text-xs text-muted-foreground">{admission.bed?.description || ''}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm font-medium">
                          {(() => {
                            const vetName = admission.primary_veterinarian_name || admission.attending_doctor || admission.doctor;
                            // If it looks like an employee ID (e.g., FDT000001), show "Not assigned" instead
                            if (vetName && /^[A-Z]{2,4}\d{6,}$/.test(vetName)) {
                              return <span className="text-muted-foreground">To be assigned</span>;
                            }
                            return vetName || <span className="text-muted-foreground">Not assigned</span>;
                          })()}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusConfig[admission.status as keyof typeof statusConfig]?.variant || 'default'}>
                          {statusConfig[admission.status as keyof typeof statusConfig]?.label || admission.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">
                            {admission.expected_discharge_date ? 
                              new Date(admission.expected_discharge_date).toLocaleDateString() : 
                              'TBD'
                            }
                          </p>
                          {admission.actual_discharge_date && (
                            <p className="text-xs text-green-600">
                              Discharged: {new Date(admission.actual_discharge_date).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            title="View/Edit Details"
                            onClick={() => handleViewDetails(admission)}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
        </ContentCard>

        {/* New Admission Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Admission" size="lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Pet Search */}
            <div className="relative">
              <Input 
                label="Search Pet (Name or Owner)" 
                placeholder="Type pet name or owner name to search..." 
                value={formData.petSearch}
                onChange={(e) => handleInputChange('petSearch', e.target.value)}
                required 
              />
              {showPetResults && petSearchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {petSearchResults.map((pet: any, index: number) => (
                    <div
                      key={index}
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onClick={() => handlePetSelect(pet)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{pet.pet_name || pet.name}</p>
                          <p className="text-sm text-gray-600">{pet.species} • {pet.breed}</p>
                          <p className="text-xs text-gray-500">
                            Owner: {pet.owner ? `${pet.owner.first_name} ${pet.owner.last_name}` : pet.owner_name}
                          </p>
                        </div>
                        <span className="text-xs font-mono text-blue-600">{pet.pet_platform_id}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Auto-populated Pet Information */}
              <Input 
                label="Pet Name" 
                value={formData.petName}
                onChange={(e) => handleInputChange('petName', e.target.value)}
                placeholder="Select a pet from search" 
                disabled 
              />
              <Input 
                label="Species" 
                value={formData.species}
                onChange={(e) => handleInputChange('species', e.target.value)}
                placeholder="Species will be auto-filled" 
                disabled 
              />
              <Input 
                label="Owner Name" 
                value={formData.ownerName}
                onChange={(e) => handleInputChange('ownerName', e.target.value)}
                placeholder="Owner name will be auto-filled" 
                disabled 
              />
              <Input 
                label="Owner Phone" 
                value={formData.ownerPhone}
                onChange={(e) => handleInputChange('ownerPhone', e.target.value)}
                placeholder="Phone will be auto-filled" 
                disabled 
              />

              {/* Admission Details */}
              <Input 
                label="Admission Date" 
                type="date" 
                value={formData.admissionDate}
                onChange={(e) => handleInputChange('admissionDate', e.target.value)}
                required 
              />
              <Input 
                label="Admission Time" 
                type="time" 
                value={formData.admissionTime}
                onChange={(e) => handleInputChange('admissionTime', e.target.value)}
                required 
              />

              {/* Bed Selection (Description/Beds_number) */}
              <Select
                label="Bed (Description/Number)"
                value={formData.bed}
                onChange={(e) => handleInputChange('bed', e.target.value)}
                options={availableBeds.length > 0 ? availableBeds : [
                  { value: '', label: bedsLoading ? 'Loading beds...' : 'No beds available' }
                ]}
                required
                disabled={bedsLoading}
              />

              {/* Attending Doctor from Employee List */}
              <Select
                label="Attending Doctor"
                value={formData.doctor}
                onChange={(e) => {
                  // Find the selected employee to get their full name
                  const selectedEmp = employees.find((emp: any) => 
                    (emp.employee_entity_id || emp.id) === e.target.value
                  );
                  const doctorName = selectedEmp 
                    ? `Dr. ${selectedEmp.first_name || selectedEmp.name} ${selectedEmp.last_name || ''}`.trim()
                    : e.target.value;
                  handleInputChange('doctor', doctorName);
                }}
                options={employees.map((emp: any) => ({
                  value: emp.employee_entity_id || emp.id,
                  label: `Dr. ${emp.first_name || emp.name} ${emp.last_name || ''} (${emp.employee_job_title || emp.job_title || 'Veterinarian'})`
                }))}
                required
              />

              <Select
                label="Admission Type"
                value={formData.admissionType}
                onChange={(e) => handleInputChange('admissionType', e.target.value)}
                options={[
                  { value: 'post-surgery', label: 'Post-Surgery Recovery' },
                  { value: 'observation', label: 'Medical Observation' },
                  { value: 'critical', label: 'Critical Care' },
                  { value: 'treatment', label: 'Active Treatment' },
                  { value: 'emergency', label: 'Emergency Admission' },
                ]}
                required
              />
            </div>

            {/* Reason for Admission */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Reason for Admission <span className="text-destructive">*</span>
              </label>
              <textarea
                value={formData.reason}
                onChange={(e) => handleInputChange('reason', e.target.value)}
                className="w-full min-h-[100px] rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Enter detailed reason for admission and initial clinical notes..."
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsModalOpen(false)} type="button">
                Cancel
              </Button>
              <Button type="submit" disabled={createAdmission.isPending || !formData.selectedPet}>
                {createAdmission.isPending ? 'Admitting...' : 'Admit Pet'}
              </Button>
            </div>
          </form>
                </Modal>

        {/* View/Edit Admission Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedAdmission(null);
          }}
          title="Admission Details"
          size="lg"
        >
          {selectedAdmission && (
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const newStatus = formData.get('status') as string;
              const holdDischargeReason = formData.get('holdDischargeReason') as string;

              // Validate hold discharge reason if status is discharge_hold
              if (newStatus === 'discharge_hold' && !holdDischargeReason?.trim()) {
                alert('Please provide a reason for holding discharge');
                return;
              }

              try {
                await updateAdmission.mutateAsync({
                  id: selectedAdmission.id,
                  status: newStatus as 'active' | 'critical' | 'stable' | 'discharge_hold' | 'discharged',
                  discharge_hold_reason: newStatus === 'discharge_hold' ? holdDischargeReason : null,
                });
                setIsEditModalOpen(false);
                setSelectedAdmission(null);
                setHoldDischarge(false);
                alert('Admission updated successfully');
              } catch (error) {
                console.error('Error updating admission:', error);
                alert('Failed to update admission. Please try again.');
              }
            }}>
              <div className="space-y-6">
                {/* Pet Information - Read-only */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Pet Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Name</p>
                      <p className="font-medium">{selectedAdmission.pet?.name || selectedAdmission.pet_name}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Species/Breed</p>
                      <p className="font-medium">{selectedAdmission.pet?.species || selectedAdmission.species} • {selectedAdmission.pet?.breed || selectedAdmission.breed}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Age/Weight</p>
                      <p className="font-medium">{selectedAdmission.pet?.age || selectedAdmission.age}yr • {selectedAdmission.pet?.weight || selectedAdmission.weight}kg</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Pet ID</p>
                      <p className="font-mono text-xs">{selectedAdmission.pet?.pet_platform_id || selectedAdmission.pet_platform_id}</p>
                    </div>
                  </div>
                </div>

                {/* Owner Information - Read-only */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Owner Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Name</p>
                      <p className="font-medium">{selectedAdmission.owner?.first_name} {selectedAdmission.owner?.last_name}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Contact</p>
                      <p className="font-medium">{selectedAdmission.owner?.personal_contact}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Email</p>
                      <p className="font-medium">{selectedAdmission.owner?.personal_email}</p>
                    </div>
                  </div>
                </div>

                {/* Admission Information - Read-only */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Admission Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Admission Date/Time</p>
                      <p className="font-medium">
                        {new Date(selectedAdmission.admission_date).toLocaleDateString()} {new Date(selectedAdmission.admission_date).toLocaleTimeString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Bed Assignment</p>
                      <p className="font-medium">{selectedAdmission.bed?.bed_number || 'Not assigned'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Veterinarian</p>
                      <p className="font-medium">{selectedAdmission.primary_veterinarian_name}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Admission Reason</p>
                      <p className="font-medium">{selectedAdmission.admission_reason}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Current Status</p>
                      <p className="font-medium">
                        <Badge className={
                          selectedAdmission.status === 'critical' ? 'bg-red-600' :
                          selectedAdmission.status === 'stable' ? 'bg-green-600' :
                          selectedAdmission.status === 'active' ? 'bg-blue-600' :
                          selectedAdmission.status === 'ready_for_discharge' ? 'bg-green-500' :
                          selectedAdmission.status === 'discharge_hold' ? 'bg-yellow-600' :
                          'bg-gray-600'
                        }>
                          {selectedAdmission.status === 'discharge_hold' ? 'DISCHARGE HOLD' : 
                           selectedAdmission.status === 'ready_for_discharge' ? 'READY FOR DISCHARGE' :
                           selectedAdmission.status?.toUpperCase()}
                        </Badge>
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Treatment Plan</p>
                      <p className="text-sm">{selectedAdmission.treatment_plan || 'Not set'}</p>
                      <span className="text-xs text-muted-foreground">(Update in Dashboard Monitor)</span>
                    </div>
                  </div>
                </div>

                {/* Editable Fields - Status & Discharge Management */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Administrative Status</h3>
                  <div className="space-y-4">
                    {/* Show current medical status as read-only */}
                    {(selectedAdmission.status === 'critical' || selectedAdmission.status === 'stable') && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                        <p className="text-sm font-medium text-blue-900 mb-1">Current Medical Status</p>
                        <Badge className={
                          selectedAdmission.status === 'critical' ? 'bg-red-600' :
                          'bg-green-600'
                        }>
                          {selectedAdmission.status?.toUpperCase()}
                        </Badge>
                        <p className="text-xs text-blue-700 mt-1">Medical status can only be updated in Dashboard Monitor by clinical staff</p>
                      </div>
                    )}
                    
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">
                        Administrative Status
                      </label>
                      <select
                        name="status"
                        defaultValue={selectedAdmission.status}
                        onChange={(e) => setHoldDischarge(e.target.value === 'discharge_hold')}
                        className="w-full rounded-lg border border-gray-300 bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      >
                        <option value="active">Active - Currently Admitted</option>
                        <option value="ready_for_discharge">Ready for Discharge - Medically Cleared</option>
                        <option value="discharge_hold">Discharge Hold - Ready but Held</option>
                        <option value="discharged">Discharged - Released</option>
                      </select>
                      <p className="text-xs text-muted-foreground mt-1">
                        Administrative statuses only. Medical conditions (Critical/Stable) are managed in Dashboard Monitor.
                      </p>
                    </div>

                    {holdDischarge && (
                      <div>
                        <label className="text-sm font-medium mb-1.5 block text-red-600">
                          Reason for Discharge Hold *
                        </label>
                        <textarea
                          name="holdDischargeReason"
                          defaultValue={selectedAdmission.discharge_hold_reason || ''}
                          className="w-full min-h-[100px] rounded-lg border border-red-300 bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                          placeholder="Explain why discharge is being held (e.g., pending test results, unpaid bills, additional care required)..."
                          required
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    type="button"
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setSelectedAdmission(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={updateAdmission.isPending || selectedAdmission.status === 'discharged'}
                  >
                    {updateAdmission.isPending ? 'Updating...' : 'Update Status'}
                  </Button>
                </div>
              </div>
            </form>
          )}
        </Modal>
      </VStack>
    </ContentArea>
  );
}
