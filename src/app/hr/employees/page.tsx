'use client';

import React from 'react';
import Image from 'next/image';
import { ContentArea, VStack } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { SearchableSelect } from '@/components/ui/SearchableSelect';
import { hrApiClient } from '@/lib/api/hr-client';
import { useLocationCurrency } from '@/hooks/useLocationCurrency';
import { User, Mail, Phone, Building2, Edit2, Trash2, X, Users, CheckCircle, Calendar, Building } from 'lucide-react';

export default function EmployeesPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [positionsSearchQuery, setPositionsSearchQuery] = React.useState('');
  const [departmentsSearchQuery, setDepartmentsSearchQuery] = React.useState('');
  const [positionsStatusFilter, setPositionsStatusFilter] = React.useState('all');
  const [departmentsStatusFilter, setDepartmentsStatusFilter] = React.useState('all');
  const [employees, setEmployees] = React.useState<any[]>([]);
  const [directoryData, setDirectoryData] = React.useState<any[]>([]);
  const [departments, setDepartments] = React.useState<any[]>([]);
  const [positions, setPositions] = React.useState<any[]>([]);
  const [roles, setRoles] = React.useState<any[]>([]);
  const [jobGrades, setJobGrades] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [directoryLoading, setDirectoryLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  
  // Location currency hook for ISD codes
  const { countries, getCountryByCode } = useLocationCurrency();
  const [departmentFilter, setDepartmentFilter] = React.useState('all');
  const [statusFilter, setStatusFilter] = React.useState('all');
  // Start with 'directory' for both server and client to avoid hydration mismatch
  const [activeTab, setActiveTab] = React.useState<'directory' | 'records' | 'positions' | 'departments'>('directory');
  const [isHydrated, setIsHydrated] = React.useState(false);

  // Load saved tab from localStorage after hydration
  React.useEffect(() => {
    setIsHydrated(true);
    const savedTab = localStorage.getItem('hr-employees-active-tab');
    if (savedTab && ['directory', 'records', 'positions', 'departments'].includes(savedTab)) {
      setActiveTab(savedTab as 'directory' | 'records' | 'positions' | 'departments');
    }
  }, []);

  // Save active tab to localStorage whenever it changes (only after hydration)
  React.useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('hr-employees-active-tab', activeTab);
    }
  }, [activeTab, isHydrated]);
  
  // Modal states
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = React.useState(false);
  const [editingEmployee, setEditingEmployee] = React.useState<any | null>(null);
  const [formData, setFormData] = React.useState({
    position_id: '',
    unique_seat_id: '',
    user_platform_id: '',
    employee_entity_id: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    job_title: '',
    department: '',
    employment_type: 'full_time',
    hire_date: '',
    status: 'active',
    // Work contact (from employee_seat_assignment - per entity)
    work_contact_number: '',
    // Work address (from employee_seat_assignment)
    entity_address: '',
    entity_city: '',
    entity_state: '',
    entity_postal_code: '',
    entity_country: '',
    // Personal details (from profiles)
    personal_email: '',
    personal_contact_number: '',
    personal_address: '',
    personal_city: '',
    personal_state: '',
    personal_postal_code: '',
    personal_country: '',
    // Emergency contact (from profiles)
    emergency_contact_name: '',
    emergency_contact: '',
  });

  const [emailPostfix, setEmailPostfix] = React.useState('');
  const [profileSearchResult, setProfileSearchResult] = React.useState<{
    found: boolean;
    user_platform_id?: string;
    message?: string;
  } | null>(null);

  const [isDepartmentModalOpen, setIsDepartmentModalOpen] = React.useState(false);
  const [editingDepartment, setEditingDepartment] = React.useState<any | null>(null);
  const [departmentFormData, setDepartmentFormData] = React.useState({
    department_name: '',
    department_code: '',
    description: '',
    manager_entity_employee_id: '',
    budget_code: '',
    cost_center: '',
    is_active: true,
  });

  const [isPositionModalOpen, setIsPositionModalOpen] = React.useState(false);
  const [editingPosition, setEditingPosition] = React.useState<any | null>(null);
  const [positionFormData, setPositionFormData] = React.useState({
    employee_job_title: '',
    department: '',
    platform_role_name: '',
    job_grade: '',
    address: '',
    is_manager: false,
    is_active: true,
  });

  React.useEffect(() => {
    fetchEmployees();
    fetchDepartments();
    fetchPositions();
    fetchRoles();
    fetchJobGrades();
    fetchDirectory();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await hrApiClient.fetchEmployees({
        search: searchQuery || undefined,
        department: departmentFilter !== 'all' ? departmentFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      });
      if (response.error) {
        setError(response.error);
      } else {
        const employeeData = response.data?.employees || [];
        setEmployees(employeeData);
      }
    } catch (err) {
      setError('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await hrApiClient.fetchDepartments();
      if (!response.error) {
        setDepartments(response.data?.departments || []);
      }
    } catch (err) {
      console.error('Failed to fetch departments');
    }
  };

  const fetchPositions = async () => {
    try {
      const response = await hrApiClient.fetchPositions();
      if (!response.error) {
        const positionsData = response.data?.positions || [];
        setPositions(Array.isArray(positionsData) ? positionsData : []);
      } else {
        setPositions([]);
      }
    } catch (err) {
      console.error('Failed to fetch positions');
      setPositions([]);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await hrApiClient.fetchRoles();
      if (!response.error) {
        setRoles(response.data?.roles || []);
      }
    } catch (err) {
      console.error('Failed to fetch roles');
    }
  };

  const fetchJobGrades = async () => {
    try {
      const response = await fetch('/api/hr/compensation/guide');
      if (response.ok) {
        const data = await response.json();
        setJobGrades(data || []);
      }
    } catch (err) {
      console.error('Failed to fetch job grades');
    }
  };

  const fetchDirectory = async () => {
    try {
      setDirectoryLoading(true);
      const response = await hrApiClient.fetchEmployeeSeatAssignments({
        search: searchQuery || undefined,
      });
      if (response.error) {
        console.error('Failed to fetch directory:', response.error);
        setDirectoryData([]);
      } else {
        setDirectoryData(response.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch directory');
      setDirectoryData([]);
    } finally {
      setDirectoryLoading(false);
    }
  };

  const handleOpenEmployeeModal = async (employee?: any) => {
    // Clear previous search result
    setProfileSearchResult(null);
    
    if (employee) {
      // Editing existing employee
      console.log('Opening edit modal for employee:', employee);
      console.log('Employee data:', {
        first_name: employee.first_name,
        last_name: employee.last_name,
        email: employee.email,
        personal_email: employee.personal_email,
      });
      
      setEditingEmployee(employee);
      setFormData({
        position_id: employee.position_id || '',
        unique_seat_id: employee.unique_seat_id || '',
        user_platform_id: employee.user_platform_id || '',
        employee_entity_id: employee.employee_entity_id || '',
        first_name: employee.first_name || '',
        last_name: employee.last_name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        job_title: employee.job_title || '',
        department: employee.department || '',
        employment_type: employee.employment_type || 'full_time',
        hire_date: employee.hire_date ? new Date(employee.hire_date).toISOString().split('T')[0] : '',
        status: employee.status || 'active',
        work_contact_number: employee.work_contact_number || '',
        entity_address: employee.entity_address || '',
        entity_city: employee.entity_city || '',
        entity_state: employee.entity_state || '',
        entity_postal_code: employee.entity_postal_code || '',
        entity_country: employee.entity_country || '',
        personal_email: employee.personal_email || '',
        personal_contact_number: employee.personal_contact_number || '',
        personal_address: employee.personal_address || '',
        personal_city: employee.personal_city || '',
        personal_state: employee.personal_state || '',
        personal_postal_code: employee.personal_postal_code || '',
        personal_country: employee.personal_country || '',
        emergency_contact_name: employee.emergency_contact_name || '',
        emergency_contact: employee.emergency_contact || '',
      });
    } else {
      // Creating new employee - fetch hospital email postfix and country
      setEditingEmployee(null);
      
      // Initialize form with empty values
      const initialFormData = {
        position_id: '',
        unique_seat_id: '',
        user_platform_id: '',
        employee_entity_id: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        job_title: '',
        department: '',
        employment_type: 'full_time',
        hire_date: '',
        status: 'active',
        work_contact_number: '',
        entity_address: '',
        entity_city: '',
        entity_state: '',
        entity_postal_code: '',
        entity_country: '', // Will be set from hospital data
        personal_email: '',
        personal_contact_number: '',
        personal_address: '',
        personal_city: '',
        personal_state: '',
        personal_postal_code: '',
        personal_country: '',
        emergency_contact_name: '',
        emergency_contact: '',
      };
      
      setFormData(initialFormData);
      
      // Fetch hospital data for auto-generating work email and setting entity country
      try {
        const hospitalResponse = await hrApiClient.fetchHospitalAddress('E019nC8m3');
        if (!hospitalResponse.error && hospitalResponse.data) {
          setFormData(prev => ({
            ...prev,
            entity_country: (hospitalResponse.data.country || '').trim(), // Auto-populate from hospital and trim whitespace
          }));
          
          if (hospitalResponse.data.email_postfix) {
            setEmailPostfix(hospitalResponse.data.email_postfix);
          }
        }
      } catch (error) {
        console.error('Failed to fetch hospital data:', error);
      }
    }
    setIsEmployeeModalOpen(true);
  };

  const handleCloseEmployeeModal = () => {
    setIsEmployeeModalOpen(false);
    setEditingEmployee(null);
    setProfileSearchResult(null); // Clear search result on modal close
  };

  const handleFormChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Capitalize first character for first_name and last_name
    let processedValue = value;
    if (name === 'first_name' || name === 'last_name') {
      processedValue = value.charAt(0).toUpperCase() + value.slice(1);
    }
    
    // Update the form data
    const updatedData = { ...formData, [name]: processedValue };
    
    // Auto-generate work email when first_name or last_name changes (for new employees only)
    if (!editingEmployee && (name === 'first_name' || name === 'last_name') && emailPostfix) {
      const firstName = name === 'first_name' ? processedValue : formData.first_name;
      const lastName = name === 'last_name' ? processedValue : formData.last_name;
      
      if (firstName && lastName) {
        // Generate email: firstname.lastname@emailpostfix
        const generatedEmail = `${firstName.toLowerCase().trim()}.${lastName.toLowerCase().trim()}${emailPostfix}`;
        updatedData.email = generatedEmail;
      }
    }
    
    setFormData(updatedData);
    
    // Auto-search for existing profile when personal_contact_number reaches 12 digits (ISD + 10 digits for India)
    // The phone fields now automatically include ISD code, so we check total length
    if (name === 'personal_contact_number' && !editingEmployee) {
      const digitsOnly = processedValue.replace(/\D/g, '');
      // Check for 12 digits total (e.g., 91 + 10 digits for India)
      if (digitsOnly.length === 12) {
        // Automatically trigger search with the full number including ISD
        handleSearchExistingProfile(processedValue);
      } else {
        // Clear search result if less than 12 digits
        setProfileSearchResult(null);
      }
    }
  };

  const handleSearchExistingProfile = async (contactNumber?: string) => {
    const numberToSearch = contactNumber || formData.personal_contact_number;
    
    if (!numberToSearch) {
      alert('Please enter Personal Contact Number to search for existing profiles.');
      return;
    }

    try {
      const response = await hrApiClient.searchExistingProfile(
        formData.personal_email || undefined,
        numberToSearch || undefined
      );

      if (response.error) {
        console.error('Failed to search profile:', response.error);
        alert('Failed to search for existing profile. Please try again.');
        return;
      }

      setProfileSearchResult(response.data);

      if (response.data.found && response.data.user_platform_id) {
        // Use existing user_platform_id and generate only employee_entity_id
        const idsResponse = await hrApiClient.generateEmployeeIds('E019nC8m3');
        
        if (idsResponse.error) {
          console.error('Failed to generate employee IDs:', idsResponse.error);
          alert('Failed to generate employee IDs. Please try again.');
          return;
        }

        // Auto-populate fields including address
        setFormData(prev => ({
          ...prev,
          user_platform_id: response.data.user_platform_id || '',
          employee_entity_id: idsResponse.data.employee_entity_id || '',
          personal_address: response.data.address || prev.personal_address,
          personal_city: response.data.city || prev.personal_city,
          personal_state: response.data.state || prev.personal_state,
          personal_postal_code: response.data.postal_code || prev.personal_postal_code,
          personal_country: response.data.country || prev.personal_country,
          emergency_contact_name: response.data.emergency_contact_name || prev.emergency_contact_name,
          emergency_contact: response.data.emergency_contact || prev.emergency_contact,
        }));
      } else {
        // Generate new IDs
        const idsResponse = await hrApiClient.generateEmployeeIds('E019nC8m3');
        
        if (idsResponse.error) {
          console.error('Failed to generate employee IDs:', idsResponse.error);
          alert('Failed to generate employee IDs. Please try again.');
          return;
        }

        setFormData(prev => ({
          ...prev,
          user_platform_id: idsResponse.data.user_platform_id || '',
          employee_entity_id: idsResponse.data.employee_entity_id || '',
        }));
      }
    } catch (error) {
      console.error('Error searching for existing profile:', error);
      alert('An error occurred while searching for existing profile.');
    }
  };

  const handlePositionSelect = (positionId: string) => {
    const selectedPosition = positions.find(p => p.id === positionId);
    if (selectedPosition) {
      setFormData(prev => ({
        ...prev,
        position_id: positionId,
        unique_seat_id: selectedPosition.unique_seat_id, // Set unique_seat_id for backend update
        job_title: selectedPosition.employee_job_title,
        department: selectedPosition.department,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        position_id: positionId,
      }));
    }
  };

  const handlePopulateHospitalAddress = async () => {
    try {
      const response = await hrApiClient.fetchHospitalAddress('E019nC8m3');
      
      if (response.error) {
        console.error('Failed to fetch hospital address:', response.error);
        alert('Failed to fetch hospital address. Please try again.');
        return;
      }

      if (response.data) {
        setFormData(prev => ({
          ...prev,
          entity_address: response.data.address || '',
          entity_city: response.data.city || '',
          entity_state: response.data.state || '',
          entity_postal_code: response.data.postal_code || '',
          entity_country: response.data.country || '',
        }));
      }
    } catch (error) {
      console.error('Error populating hospital address:', error);
      alert('An error occurred while fetching hospital address.');
    }
  };

  const handleSubmitEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('[handleSubmitEmployee] Form data being submitted:', formData);
    console.log('[handleSubmitEmployee] entity_country value:', formData.entity_country);
    console.log('[handleSubmitEmployee] Available countries:', countries.length);
    
    // Trim country values to handle whitespace
    const trimmedPersonalCountry = formData.personal_country.trim();
    const trimmedWorkCountry = formData.entity_country.trim();
    
    // Determine country codes
    // If countries array is available, do lookup. Otherwise, assume values are already codes
    let personalCountryCode = trimmedPersonalCountry;
    let workCountryCode = trimmedWorkCountry;
    
    if (countries.length > 0) {
      // Get country codes from country names
      const personalCountryData = countries.find(c => 
        c.country_name.toLowerCase() === trimmedPersonalCountry.toLowerCase()
      );
      const workCountryData = countries.find(c => 
        c.country_name.toLowerCase() === trimmedWorkCountry.toLowerCase()
      );
      
      console.log('[handleSubmitEmployee] Personal country lookup:', {
        input: trimmedPersonalCountry,
        found: personalCountryData,
        code: personalCountryData?.country_code
      });
      console.log('[handleSubmitEmployee] Work country lookup:', {
        input: trimmedWorkCountry,
        found: workCountryData,
        code: workCountryData?.country_code
      });
      
      // Use found codes or check if input is already a code
      personalCountryCode = personalCountryData?.country_code || 
        (countries.find(c => c.country_code === trimmedPersonalCountry)?.country_code) || 
        trimmedPersonalCountry;
      
      workCountryCode = workCountryData?.country_code || 
        (countries.find(c => c.country_code === trimmedWorkCountry)?.country_code) || 
        trimmedWorkCountry;
    } else {
      console.log('[handleSubmitEmployee] Countries array empty, using values as-is (assuming codes)');
    }
    
    // Map frontend field names to backend field names
    const mappedData = {
      ...formData,
      phone: formData.personal_contact_number, // Backend expects 'phone' for personal contact
      work_contact_number: formData.work_contact_number, // Work phone (stored per entity in employee_seat_assignment)
      personal_country: personalCountryCode, // Use determined country code
      work_address: formData.entity_address,
      work_city: formData.entity_city,
      work_state: formData.entity_state,
      work_postal_code: formData.entity_postal_code,
      work_country: workCountryCode, // Use determined country code
      entity_platform_id: 'E019nC8m3', // Hospital/Entity ID
      // Only include personal_email if it's provided and valid
      personal_email: formData.personal_email || undefined,
    };
    
    console.log('[handleSubmitEmployee] Mapped data for backend:', mappedData);
    console.log('[handleSubmitEmployee] unique_seat_id being sent:', mappedData.unique_seat_id);
    
    try {
      if (editingEmployee) {
        // Update existing employee
        const response = await hrApiClient.updateEmployee(editingEmployee.employee_entity_id || editingEmployee.employee_id, mappedData);
        if (response.error) {
          console.error('Failed to update employee:', response.error);
          alert(`Failed to update employee: ${response.error}`);
          return;
        }
        alert('Employee updated successfully!');
      } else {
        // Create new employee
        const response = await hrApiClient.createEmployee(mappedData);
        console.log('[handleSubmitEmployee] Create response:', response);
        if (response.error) {
          console.error('Failed to create employee:', response.error);
          console.error('Full response:', JSON.stringify(response, null, 2));
          
          // Show detailed validation errors if available
          if (response.details) {
            console.error('Validation details:', response.details);
          }
          
          const errorMsg = response.message || response.error;
          alert(`Failed to create employee: ${errorMsg}\n\nCheck console for details.`);
          return;
        }
        alert('Employee created successfully!');
      }
      
      // Refresh employees list
      await fetchEmployees();
      handleCloseEmployeeModal();
    } catch (error) {
      console.error('Failed to save employee:', error);
      alert('An error occurred while saving the employee.');
    }
  };

  const handleDeleteEmployee = async (employee: any) => {
    if (!confirm(`Are you sure you want to delete ${employee.first_name} ${employee.last_name}?`)) {
      return;
    }
    
    try {
      const response = await hrApiClient.deleteEmployee(employee.employee_entity_id || employee.employee_id);
      if (response.error) {
        console.error('Failed to delete employee:', response.error);
        alert(`Failed to delete employee: ${response.error}`);
        return;
      }
      
      alert('Employee deleted successfully!');
      // Refresh employees list
      await fetchEmployees();
    } catch (error) {
      console.error('Failed to delete employee:', error);
      alert('An error occurred while deleting the employee.');
    }
  };

  const handleOpenDepartmentModal = (department?: any) => {
    if (department) {
      setEditingDepartment(department);
      setDepartmentFormData({
        department_name: department.name || '',
        department_code: department.code || '',
        description: department.description || '',
        manager_entity_employee_id: department.manager_id || '',
        budget_code: department.budget_code || '',
        cost_center: department.cost_center || '',
        is_active: department.is_active !== false,
      });
    } else {
      setEditingDepartment(null);
      setDepartmentFormData({
        department_name: '',
        department_code: '',
        description: '',
        manager_entity_employee_id: '',
        budget_code: '',
        cost_center: '',
        is_active: true,
      });
    }
    setIsDepartmentModalOpen(true);
  };

  const handleCloseDepartmentModal = () => {
    setIsDepartmentModalOpen(false);
    setEditingDepartment(null);
  };

  const handleDepartmentFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setDepartmentFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setDepartmentFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmitDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingDepartment) {
        const response = await hrApiClient.updateDepartment(editingDepartment.id, departmentFormData);
        if (response.error) {
          console.error('Failed to update department:', response.error);
          alert('Failed to update department: ' + response.error);
          return;
        }
      } else {
        const response = await hrApiClient.createDepartment(departmentFormData);
        if (response.error) {
          console.error('Failed to create department:', response.error);
          alert('Failed to create department: ' + response.error);
          return;
        }
      }
      
      await fetchDepartments();
      handleCloseDepartmentModal();
    } catch (error) {
      console.error('Failed to save department:', error);
      alert('Failed to save department');
    }
  };

  const handleDeleteDepartment = async (department: any) => {
    if (!confirm(`Are you sure you want to delete the ${department.name} department?`)) {
      return;
    }
    
    try {
      const response = await hrApiClient.deleteDepartment(department.id);
      if (response.error) {
        console.error('Failed to delete department:', response.error);
        alert('Failed to delete department: ' + response.error);
        return;
      }
      
      await fetchDepartments();
    } catch (error) {
      console.error('Failed to delete department:', error);
      alert('Failed to delete department');
    }
  };

  const handleOpenPositionModal = (position?: any) => {
    if (position) {
      setEditingPosition(position);
      setPositionFormData({
        employee_job_title: position.employee_job_title || '',
        department: position.department || '',
        platform_role_name: position.platform_role_name || '',
        job_grade: position.job_grade || '',
        address: position.entity_address || '',
        is_manager: position.is_manager ?? false,
        is_active: position.is_active ?? true,
      });
    } else {
      setEditingPosition(null);
      setPositionFormData({
        employee_job_title: '',
        department: '',
        platform_role_name: '',
        job_grade: '',
        address: '',
        is_manager: false,
        is_active: true,
      });
    }
    setIsPositionModalOpen(true);
  };

  const handleClosePositionModal = () => {
    setIsPositionModalOpen(false);
    setEditingPosition(null);
  };

  const handlePositionFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setPositionFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setPositionFormData(prev => {
        const newData = { ...prev, [name]: value };
        
        // If job_grade changes, check if the new grade allows managers
        if (name === 'job_grade') {
          const selectedGrade = jobGrades.find(g => g.job_grade === value);
          // Auto-uncheck is_manager if the selected grade doesn't allow managers
          if (selectedGrade?.is_manager !== true && prev.is_manager) {
            newData.is_manager = false;
          }
        }
        
        return newData;
      });
    }
  };

  const handleSubmitPosition = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPosition) {
        const response = await hrApiClient.updatePosition(editingPosition.id, positionFormData);
        if (response.error) {
          console.error('Failed to update position:', response.error);
          const errorMsg = response.data?.details ? `${response.error}: ${response.data.details}` : response.error;
          alert('Failed to update position: ' + errorMsg);
          return;
        }
      } else {
        console.log('Creating position with data:', positionFormData);
        const response = await hrApiClient.createPosition(positionFormData);
        if (response.error) {
          console.error('Failed to create position:', response.error, response.data);
          const errorMsg = response.data?.details ? `${response.error}: ${response.data.details}` : response.error;
          alert('Failed to create position: ' + errorMsg);
          return;
        }
      }
      
      await fetchPositions();
      handleClosePositionModal();
    } catch (error) {
      console.error('Failed to save position:', error);
      alert('Failed to save position: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleDeletePosition = async (position: any) => {
    if (!confirm(`Are you sure you want to delete the position "${position.employee_job_title}"?`)) {
      return;
    }
    
    try {
      const response = await hrApiClient.deletePosition(position.id);
      if (response.error) {
        console.error('Failed to delete position:', response.error);
        alert('Failed to delete position: ' + response.error);
        return;
      }
      await fetchPositions();
    } catch (error) {
      console.error('Failed to delete position:', error);
      alert('Failed to delete position');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'on-leave':
      case 'on leave':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'terminated':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const activeCount = employees.filter(e => e.status?.toLowerCase() === 'active').length;
  const unfilledPositionsCount = positions.filter(p => !p.is_filled && p.is_active).length;
  const uniqueDepartments = [...new Set(employees.map(e => e.department).filter(Boolean))];

  // Calculate fulfilled and unfulfilled positions per department
  const getDepartmentPositionCounts = (departmentName: string) => {
    const deptPositions = positions.filter(p => p.department === departmentName);
    const fulfilled = deptPositions.filter(p => p.is_filled).length;
    const unfulfilled = deptPositions.filter(p => !p.is_filled && p.is_active).length;
    return { fulfilled, unfulfilled };
  };

  return (
    <ContentArea>
      <VStack size="sm">
        <div className="flex items-baseline gap-3">
          <h1 className="text-3xl font-bold text-slate-800">Employee Management</h1>
          <p className="text-sm text-slate-500">Manage employee records and information</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-blue-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Total Employees</p>
                  <p className="text-2xl font-bold text-slate-800">{employees.length}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-green-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Active</p>
                  <p className="text-2xl font-bold text-slate-800">{activeCount}</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-orange-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Open Positions</p>
                  <p className="text-2xl font-bold text-slate-800">{unfilledPositionsCount}</p>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                  <Building className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-purple-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mt-2">Departments</p>
                  <p className="text-2xl font-bold text-slate-800">{departments.length || uniqueDepartments.length}</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                  <Building className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-2 border-b-2">
          <button
            onClick={() => setActiveTab('directory')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'directory'
                ? 'text-blue-600 border-b-2 border-blue-600 -mb-0.5'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            Directory
          </button>
          <button
            onClick={() => setActiveTab('records')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'records'
                ? 'text-blue-600 border-b-2 border-blue-600 -mb-0.5'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            Employee Records
          </button>
          <button
            onClick={() => setActiveTab('positions')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'positions'
                ? 'text-blue-600 border-b-2 border-blue-600 -mb-0.5'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            Positions
          </button>
          <button
            onClick={() => setActiveTab('departments')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'departments'
                ? 'text-blue-600 border-b-2 border-blue-600 -mb-0.5'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            Departments
          </button>
        </div>

        {activeTab === 'directory' && (
          <>
            <Card className="border-2">
              <CardContent className="py-3 px-4">
                <div className="flex gap-3 items-center">
                  <Input
                    type="text"
                    placeholder="Search directory..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={fetchDirectory} variant="primary">Search</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader className="border-b-2 pb-4">
                <CardTitle>Employee Directory</CardTitle>
                <p className="text-sm text-slate-500 mt-1">Quick access to all staff members</p>
              </CardHeader>
              <CardContent className="p-0">
              {directoryLoading ? (
                <div className="p-8 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-sm text-slate-500">Loading directory...</p>
                </div>
              ) : directoryData.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="text-slate-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <p className="text-lg font-medium text-slate-700 mb-2">No employees found in directory</p>
                  <p className="text-sm text-slate-500">The employee directory is empty or has no filled positions.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="uppercase text-xs">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>Name</span>
                        </div>
                      </TableHead>
                      <TableHead className="uppercase text-xs">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          <span>Department</span>
                        </div>
                      </TableHead>
                      <TableHead className="uppercase text-xs">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span>Email</span>
                        </div>
                      </TableHead>
                      <TableHead className="uppercase text-xs">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>Contact</span>
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {directoryData.map((employee, index) => (
                      <TableRow key={employee.id || index}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {employee.avatar_url ? (
                              <Image
                                src={employee.avatar_url}
                                alt={`${employee.first_name} ${employee.last_name}`}
                                width={32}
                                height={32}
                                className="w-8 h-8 rounded-full object-cover shrink-0"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                                {getInitials(employee.first_name || '', employee.last_name || '')}
                              </div>
                            )}
                            <span className="font-medium">
                              {employee.first_name} {employee.last_name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{employee.department || 'N/A'}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{employee.employee_email || 'N/A'}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{employee.employee_contact || 'N/A'}</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
          </>
        )}

        {activeTab === 'records' && (
          <>
            <Card className="border-2">
              <CardContent className="py-3 px-4">
                <div className="flex gap-3 items-center">
                  <Input
                    type="text"
                    placeholder="Search employees by name, email, or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={fetchEmployees} variant="primary">
                    Search
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader className="border-b-2 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Employees</CardTitle>
                    <p className="text-sm text-slate-500 mt-1">{employees.length} total employees</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">Export</Button>
                    <Button variant="primary" onClick={() => handleOpenEmployeeModal()}>Add Employee</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <div className="p-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-2 text-sm text-slate-500">Loading employees...</p>
                  </div>
                ) : error ? (
                  <div className="p-8 text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <Button onClick={fetchEmployees} variant="primary">Retry</Button>
                  </div>
                ) : employees.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">
                    <p>No employees found</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="uppercase text-xs">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>Employee</span>
                          </div>
                        </TableHead>
                        <TableHead className="uppercase text-xs">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <span>Contact</span>
                          </div>
                        </TableHead>
                        <TableHead className="uppercase text-xs">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            <span>Role</span>
                          </div>
                        </TableHead>
                        <TableHead className="uppercase text-xs">Status</TableHead>
                        <TableHead className="uppercase text-xs">Hire Date</TableHead>
                        <TableHead className="uppercase text-xs">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employees.map((employee) => (
                        <TableRow key={employee.id || employee.employee_id} className="hover:bg-slate-50">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {employee.avatar_url ? (
                                <Image
                                  src={employee.avatar_url}
                                  alt={`${employee.first_name} ${employee.last_name}`}
                                  width={40}
                                  height={40}
                                  className="w-10 h-10 rounded-full object-cover shrink-0"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold shrink-0">
                                  {getInitials(employee.first_name, employee.last_name)}
                                </div>
                              )}
                              <div>
                                <p className="font-medium text-slate-800">
                                  {employee.first_name} {employee.last_name}
                                </p>
                                <p className="text-sm text-slate-500">{employee.employee_id}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm text-slate-800">{employee.email}</p>
                              <p className="text-sm text-slate-500">{employee.phone}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm font-medium text-slate-800">{employee.job_title}</p>
                              <p className="text-sm text-slate-500">{employee.department}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(employee.status)}>
                              {employee.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-slate-600">
                            {employee.hire_date ? new Date(employee.hire_date).toLocaleDateString() : '-'}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                                title="Edit"
                                onClick={() => handleOpenEmployeeModal(employee)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                                title="Delete"
                                onClick={() => handleDeleteEmployee(employee)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === 'positions' && (
          <>
            <Card className="border-2">
              <CardContent className="py-3 px-4">
                <div className="flex gap-3 items-center">
                  <Input
                    type="text"
                    placeholder="Search positions by title or department..."
                    value={positionsSearchQuery}
                    onChange={(e) => setPositionsSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <select
                    value={positionsStatusFilter}
                    onChange={(e) => setPositionsStatusFilter(e.target.value)}
                    className="w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Positions</option>
                    <option value="filled">Filled</option>
                    <option value="open">Open</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <Button onClick={fetchPositions} variant="primary">
                    Search
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
            <CardHeader className="border-b-2 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Positions</CardTitle>
                  <p className="text-sm text-slate-500 mt-1">
                    {Array.isArray(positions) ? positions.filter(pos => {
                      const matchesSearch = !positionsSearchQuery || 
                        pos.employee_job_title?.toLowerCase().includes(positionsSearchQuery.toLowerCase()) ||
                        pos.department?.toLowerCase().includes(positionsSearchQuery.toLowerCase());
                      
                      let matchesStatus = true;
                      if (positionsStatusFilter === 'filled') matchesStatus = pos.is_filled === true;
                      else if (positionsStatusFilter === 'open') matchesStatus = pos.is_filled === false;
                      else if (positionsStatusFilter === 'active') matchesStatus = pos.is_active === true;
                      else if (positionsStatusFilter === 'inactive') matchesStatus = pos.is_active === false;
                      
                      return matchesSearch && matchesStatus;
                    }).length : 0} {positionsSearchQuery || positionsStatusFilter !== 'all' ? 'matching' : 'total'} positions
                  </p>
                </div>
                <Button variant="primary" onClick={() => handleOpenPositionModal()}>Add Position</Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {!Array.isArray(positions) || positions.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <p>No positions found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="uppercase text-xs">Position Title</TableHead>
                      <TableHead className="uppercase text-xs">Department</TableHead>
                      <TableHead className="uppercase text-xs">Job Grade</TableHead>
                      <TableHead className="uppercase text-xs">Level</TableHead>
                      <TableHead className="uppercase text-xs">Position Status</TableHead>
                      <TableHead className="uppercase text-xs">Active</TableHead>
                      <TableHead className="uppercase text-xs">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {positions
                      .filter(pos => {
                        // Search filter
                        const matchesSearch = !positionsSearchQuery || 
                          pos.employee_job_title?.toLowerCase().includes(positionsSearchQuery.toLowerCase()) ||
                          pos.department?.toLowerCase().includes(positionsSearchQuery.toLowerCase());
                        
                        // Status filter
                        let matchesStatus = true;
                        if (positionsStatusFilter === 'filled') {
                          matchesStatus = pos.is_filled === true;
                        } else if (positionsStatusFilter === 'open') {
                          matchesStatus = pos.is_filled === false;
                        } else if (positionsStatusFilter === 'active') {
                          matchesStatus = pos.is_active === true;
                        } else if (positionsStatusFilter === 'inactive') {
                          matchesStatus = pos.is_active === false;
                        }
                        
                        return matchesSearch && matchesStatus;
                      })
                      .map((position) => (
                      <TableRow key={position.id} className="hover:bg-slate-50">
                        <TableCell className="font-medium text-slate-800">
                          <div className="flex items-center gap-2">
                            {position.employee_job_title}
                            {position.is_manager && (
                              <Badge className="bg-purple-100 text-purple-800 text-xs">Manager</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">{position.department}</TableCell>
                        <TableCell className="font-semibold text-slate-900">{position.job_grade || '-'}</TableCell>
                        <TableCell className="text-sm text-slate-600">{position.platform_role_name || 'Standard'}</TableCell>
                        <TableCell>
                          <Badge className={position.is_filled ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}>
                            {position.is_filled ? 'Filled' : 'Open'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={position.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {position.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                              title="Edit"
                              onClick={() => handleOpenPositionModal(position)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                              title="Delete"
                              onClick={() => handleDeletePosition(position)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
          </>
        )}

        {activeTab === 'departments' && (
          <>
            <Card className="border-2">
              <CardContent className="py-3 px-4">
                <div className="flex gap-3 items-center">
                  <Input
                    type="text"
                    placeholder="Search departments by name or code..."
                    value={departmentsSearchQuery}
                    onChange={(e) => setDepartmentsSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <select
                    value={departmentsStatusFilter}
                    onChange={(e) => setDepartmentsStatusFilter(e.target.value)}
                    className="w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Departments</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <Button onClick={fetchDepartments} variant="primary">
                    Search
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
            <CardHeader className="border-b-2 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Departments</CardTitle>
                  <p className="text-sm text-slate-500 mt-1">
                    {departments.filter(dept => {
                      const matchesSearch = !departmentsSearchQuery || 
                        dept.name?.toLowerCase().includes(departmentsSearchQuery.toLowerCase()) ||
                        dept.code?.toLowerCase().includes(departmentsSearchQuery.toLowerCase());
                      
                      let matchesStatus = true;
                      if (departmentsStatusFilter === 'active') matchesStatus = dept.is_active === true;
                      else if (departmentsStatusFilter === 'inactive') matchesStatus = dept.is_active === false;
                      
                      return matchesSearch && matchesStatus;
                    }).length} {departmentsSearchQuery || departmentsStatusFilter !== 'all' ? 'matching' : 'total'} departments
                  </p>
                </div>
                <Button variant="primary" onClick={() => handleOpenDepartmentModal()}>Add Department</Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {departments.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <p>No departments found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="uppercase text-xs">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          <span>Department Name</span>
                        </div>
                      </TableHead>
                      <TableHead className="uppercase text-xs">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>Manager</span>
                        </div>
                      </TableHead>
                      <TableHead className="uppercase text-xs">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>Total Positions</span>
                        </div>
                      </TableHead>
                      <TableHead className="uppercase text-xs">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          <span>Fulfilled</span>
                        </div>
                      </TableHead>
                      <TableHead className="uppercase text-xs">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          <span>Unfulfilled</span>
                        </div>
                      </TableHead>
                      <TableHead className="uppercase text-xs">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          <span>Status</span>
                        </div>
                      </TableHead>
                      <TableHead className="uppercase text-xs">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {departments
                      .filter(dept => {
                        const matchesSearch = !departmentsSearchQuery || 
                          dept.name?.toLowerCase().includes(departmentsSearchQuery.toLowerCase()) ||
                          dept.code?.toLowerCase().includes(departmentsSearchQuery.toLowerCase());
                        
                        let matchesStatus = true;
                        if (departmentsStatusFilter === 'active') matchesStatus = dept.is_active === true;
                        else if (departmentsStatusFilter === 'inactive') matchesStatus = dept.is_active === false;
                        
                        return matchesSearch && matchesStatus;
                      })
                      .map((dept) => {
                        const { fulfilled, unfulfilled } = getDepartmentPositionCounts(dept.name);
                        return (
                      <TableRow key={dept.id} className="hover:bg-slate-50">
                        <TableCell>
                          <div>
                            <p className="font-medium text-slate-800">{dept.name}</p>
                            <p className="text-sm text-slate-500">{dept.code || '-'}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">{dept.manager_name || 'Not Assigned'}</TableCell>
                        <TableCell className="text-sm text-slate-600 font-semibold">{fulfilled + unfulfilled}</TableCell>
                        <TableCell className="text-sm text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-700 font-semibold">
                            {fulfilled}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-700 font-semibold">
                            {unfulfilled}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center" title={dept.is_active ? "Active" : "Inactive"}>
                            {dept.is_active ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <X className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                              title="Edit"
                              onClick={() => handleOpenDepartmentModal(dept)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                              title="Delete"
                              onClick={() => handleDeleteDepartment(dept)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                      })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
          </>
        )}
      </VStack>

      {/* Employee Create/Edit Modal */}
      <Modal
        isOpen={isEmployeeModalOpen}
        onClose={handleCloseEmployeeModal}
        title={editingEmployee ? 'Edit Employee' : 'Add New Employee'}
        size="lg"
      >
        <form onSubmit={handleSubmitEmployee} className="space-y-6" autoComplete="off">
          {/* Employee Information Section */}
          <div className="space-y-6">
            {/* Name */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  First Name <span className="text-red-600">*</span>
                </label>
                <Input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleFormChange}
                  required
                  placeholder="Enter first name"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Last Name <span className="text-red-600">*</span>
                </label>
                <Input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleFormChange}
                  required
                  placeholder="Enter last name"
                  className="w-full"
                />
              </div>
            </div>

            {/* Work Contact Details */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Work Email <span className="text-red-600">*</span>
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                  placeholder="employee@company.com"
                  className="w-full"
                />
                {!editingEmployee && emailPostfix && (
                  <p className="text-xs text-slate-500 mt-1">Auto-generated as firstname.lastname{emailPostfix} (editable)</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Work Contact Number
                </label>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-2 bg-slate-100 text-slate-700 font-medium rounded-md border border-slate-300 whitespace-nowrap">
                    {formData.entity_country && countries.length > 0 
                      ? (getCountryByCode(formData.entity_country)?.isd_code || '+91')
                      : '+91'}
                  </div>
                  <div className="relative flex-1">
                    <Input
                      type="tel"
                      name="work_contact_number"
                      value={formData.work_contact_number.replace(/^\+\d+\s*/, '')} 
                      onChange={(e) => {
                        const digitsOnly = e.target.value.replace(/\D/g, '');
                        const maxDigits = formData.entity_country && countries.length > 0 
                          ? (getCountryByCode(formData.entity_country)?.tel_digits || 10)
                          : 10;
                        
                        // Limit to max digits
                        const limitedDigits = digitsOnly.slice(0, maxDigits);
                        
                        const isdCode = formData.entity_country && countries.length > 0 
                          ? (getCountryByCode(formData.entity_country)?.isd_code || '+91')
                          : '+91';
                        handleFormChange({
                          ...e,
                          target: {
                            ...e.target,
                            name: 'work_contact_number',
                            value: `${isdCode} ${limitedDigits}`
                          }
                        } as any);
                      }}
                      placeholder="9987654210"
                      maxLength={formData.entity_country && countries.length > 0 
                        ? (getCountryByCode(formData.entity_country)?.tel_digits || 10)
                        : 10}
                      className="w-full pr-10"
                    />
                    {(() => {
                      const digitsOnly = formData.work_contact_number.replace(/\D/g, '');
                      const expectedDigits = formData.entity_country && countries.length > 0 
                        ? (getCountryByCode(formData.entity_country)?.tel_digits || 10)
                        : 10;
                      const actualDigits = digitsOnly.length - String(formData.entity_country && countries.length > 0 
                        ? (getCountryByCode(formData.entity_country)?.isd_code || '+91')
                        : '+91').replace(/\D/g, '').length;
                      
                      if (actualDigits === 0) return null;
                      
                      return (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {actualDigits === expectedDigits ? (
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Enter {formData.entity_country && countries.length > 0 
                    ? (getCountryByCode(formData.entity_country)?.tel_digits || '10')
                    : '10'} digits only
                </p>
              </div>
            </div>

            {/* Personal Contact Details */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Personal Email
                </label>
                <Input
                  type="email"
                  name="personal_email"
                  value={formData.personal_email}
                  onChange={handleFormChange}
                  placeholder="personal@example.com"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Personal Contact Number
                </label>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-2 bg-slate-100 text-slate-700 font-medium rounded-md border border-slate-300 whitespace-nowrap">
                    {formData.personal_country && countries.length > 0 
                      ? (getCountryByCode(formData.personal_country)?.isd_code || '+91')
                      : '+91'}
                  </div>
                  <div className="relative flex-1">
                    <Input
                      type="tel"
                      name="personal_contact_number"
                      value={formData.personal_contact_number.replace(/^\+\d+\s*/, '')}
                      onChange={(e) => {
                        const digitsOnly = e.target.value.replace(/\D/g, '');
                        const maxDigits = formData.personal_country && countries.length > 0 
                          ? (getCountryByCode(formData.personal_country)?.tel_digits || 10)
                          : 10;
                        
                        // Limit to max digits
                        const limitedDigits = digitsOnly.slice(0, maxDigits);
                        
                        const isdCode = formData.personal_country && countries.length > 0 
                          ? (getCountryByCode(formData.personal_country)?.isd_code || '+91')
                          : '+91';
                        handleFormChange({
                          ...e,
                          target: {
                            ...e.target,
                            name: 'personal_contact_number',
                            value: `${isdCode} ${limitedDigits}`
                          }
                        } as any);
                      }}
                      placeholder="9987654210"
                      maxLength={formData.personal_country && countries.length > 0 
                        ? (getCountryByCode(formData.personal_country)?.tel_digits || 10)
                        : 10}
                      className="w-full pr-10"
                    />
                    {(() => {
                      const digitsOnly = formData.personal_contact_number.replace(/\D/g, '');
                      const expectedDigits = formData.personal_country && countries.length > 0 
                        ? (getCountryByCode(formData.personal_country)?.tel_digits || 10)
                        : 10;
                      const isdDigits = String(formData.personal_country && countries.length > 0 
                        ? (getCountryByCode(formData.personal_country)?.isd_code || '+91')
                        : '+91').replace(/\D/g, '').length;
                      const actualDigits = digitsOnly.length - isdDigits;
                      
                      if (actualDigits === 0) return null;
                      
                      return (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {actualDigits === expectedDigits ? (
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Enter {formData.personal_country && countries.length > 0 
                    ? (getCountryByCode(formData.personal_country)?.tel_digits || '10')
                    : '10'} digits only
                </p>
              </div>
            </div>

            {/* Auto-search Result Display - Only for new employees */}
            {!editingEmployee && profileSearchResult && (
              <div className="pt-4 border-t border-slate-200">
                <div className={`p-3 rounded-md ${
                  profileSearchResult.found 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-blue-50 border border-blue-200'
                }`}>
                  <p className={`text-sm font-medium ${
                    profileSearchResult.found ? 'text-green-800' : 'text-blue-800'
                  }`}>
                    {profileSearchResult.message}
                  </p>
                  {profileSearchResult.found && profileSearchResult.user_platform_id && (
                    <p className="text-xs text-slate-600 mt-1">
                      User Platform ID: <span className="font-mono">{profileSearchResult.user_platform_id}</span>
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* IDs Section - Show for both new and editing employees */}
          <div className="grid grid-cols-2 gap-6 pt-2 pb-2 bg-slate-50 px-4 py-3 rounded-lg border border-slate-200">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                User Platform ID
              </label>
              <Input
                type="text"
                value={formData.user_platform_id}
                disabled
                className="w-full bg-slate-100 text-slate-600 cursor-not-allowed"
                placeholder={!editingEmployee ? "Auto-populated after entering 12-digit contact" : "N/A"}
              />
              <p className="text-xs text-slate-500 mt-1">
                {!editingEmployee ? "Generated automatically when profile is found" : "System-assigned ID"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Employee ID
              </label>
              <Input
                type="text"
                value={formData.employee_entity_id}
                disabled
                className="w-full bg-slate-100 text-slate-600 cursor-not-allowed"
                placeholder={!editingEmployee ? "Auto-generated" : "N/A"}
              />
              <p className="text-xs text-slate-500 mt-1">
                {!editingEmployee ? "9-character unique ID" : "Cannot be changed"}
              </p>
            </div>
          </div>

          {/* Position Selector - Moved below IDs */}
          <div>
            {editingEmployee ? (
              // Non-editable position display for existing employees
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Position
                </label>
                <div className="w-full px-3 py-2 border-2 border-slate-300 rounded-md bg-slate-50 text-slate-600 cursor-not-allowed">
                  {formData.job_title && formData.department 
                    ? `${formData.job_title} - ${formData.department}${formData.unique_seat_id ? ` (${formData.unique_seat_id.slice(-6)})` : ''}`
                    : 'No position assigned'
                  }
                </div>
                <p className="text-xs text-slate-500 mt-1">Position cannot be changed after assignment</p>
              </div>
            ) : (
              // Editable position selector for new employees
              <>
                <SearchableSelect
                  label="Position"
                  placeholder="Select a position (optional)"
                  value={formData.position_id}
                  onChange={handlePositionSelect}
                  options={positions
                    .filter(p => p.is_active && !p.is_filled)
                    .map(p => ({
                      value: p.id,
                      label: `${p.employee_job_title} - ${p.department} (${p.id.slice(-6)})`
                    }))}
                />
                {formData.position_id && (
                  <p className="text-xs text-slate-600 mt-1">
                    💡 Job title and department are auto-populated from the selected position
                  </p>
                )}
              </>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Job Title <span className="text-red-600">*</span>
              </label>
              <Input
                type="text"
                name="job_title"
                value={formData.job_title}
                onChange={handleFormChange}
                required
                placeholder="e.g. Senior Developer"
                className="w-full"
                disabled={!!formData.position_id}
              />
              {formData.position_id && (
                <p className="text-xs text-slate-500 mt-1">Auto-populated from position</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Department
              </label>
              <Input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleFormChange}
                placeholder="e.g. Engineering"
                className="w-full"
                disabled={!!formData.position_id}
              />
              {formData.position_id && (
                <p className="text-xs text-slate-500 mt-1">Auto-populated from position</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Employment Type <span className="text-red-600">*</span>
              </label>
              <select
                name="employment_type"
                value={formData.employment_type}
                onChange={handleFormChange}
                required
                className="w-full px-3 py-2 border-2 border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800"
              >
                <option value="full_time">Full Time</option>
                <option value="part_time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="intern">Intern</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Status <span className="text-red-600">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleFormChange}
                required
                className="w-full px-3 py-2 border-2 border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on-leave">On Leave</option>
                <option value="terminated">Terminated</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              Hire Date <span className="text-red-600">*</span>
            </label>
            <Input
              type="date"
              name="hire_date"
              value={formData.hire_date}
              onChange={handleFormChange}
              required
              className="w-full"
            />
          </div>

          {/* Personal Details Section */}
          <div className="pt-4 border-t-2 border-slate-200">
            <h3 className="text-base font-semibold text-slate-800 mb-4">Personal Address</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Street Address
                </label>
                <Input
                  type="text"
                  name="personal_address"
                  value={formData.personal_address}
                  onChange={handleFormChange}
                  placeholder="e.g. 123 Main Street"
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    City
                  </label>
                  <Input
                    type="text"
                    name="personal_city"
                    value={formData.personal_city}
                    onChange={handleFormChange}
                    placeholder="e.g. Bengaluru"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    State/Province
                  </label>
                  <Input
                    type="text"
                    name="personal_state"
                    value={formData.personal_state}
                    onChange={handleFormChange}
                    placeholder="e.g. Karnataka"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    Postal Code
                  </label>
                  <Input
                    type="text"
                    name="personal_postal_code"
                    value={formData.personal_postal_code}
                    onChange={handleFormChange}
                    placeholder="e.g. 560077"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    Country
                  </label>
                  <Input
                    type="text"
                    name="personal_country"
                    value={formData.personal_country}
                    onChange={handleFormChange}
                    placeholder="e.g. India"
                    className="w-full"
                  />
                </div>
              </div>

              {/* Emergency Contact Fields */}
              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-200">
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    Emergency Contact Name
                  </label>
                  <Input
                    type="text"
                    name="emergency_contact_name"
                    value={formData.emergency_contact_name}
                    onChange={handleFormChange}
                    placeholder="e.g. John Doe"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    Emergency Contact Phone
                  </label>
                  <Input
                    type="tel"
                    name="emergency_contact"
                    value={formData.emergency_contact}
                    onChange={handleFormChange}
                    placeholder="e.g. +91 9876543210"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Work Address Section */}
          <div className="pt-4 border-t-2 border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-slate-800">Work Address</h3>
              <button
                type="button"
                onClick={handlePopulateHospitalAddress}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Use Hospital Address
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Street Address
                </label>
                <Input
                  type="text"
                  name="entity_address"
                  value={formData.entity_address}
                  onChange={handleFormChange}
                  placeholder="e.g. 123 Main Street"
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    City
                  </label>
                  <Input
                    type="text"
                    name="entity_city"
                    value={formData.entity_city}
                    onChange={handleFormChange}
                    placeholder="e.g. San Francisco"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    State/Province
                  </label>
                  <Input
                    type="text"
                    name="entity_state"
                    value={formData.entity_state}
                    onChange={handleFormChange}
                    placeholder="e.g. CA"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    Postal Code
                  </label>
                  <Input
                    type="text"
                    name="entity_postal_code"
                    value={formData.entity_postal_code}
                    onChange={handleFormChange}
                    placeholder="e.g. 94103"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    Country <span className="text-slate-500 text-xs font-normal">(from Hospital)</span>
                  </label>
                  <Input
                    type="text"
                    name="entity_country"
                    value={formData.entity_country}
                    disabled
                    className="w-full bg-slate-100 text-slate-600 cursor-not-allowed"
                    placeholder="Auto-populated from hospital"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Work country is always the same as hospital country
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t-2 border-slate-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseEmployeeModal}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingEmployee ? 'Update Employee' : 'Create Employee'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Department Create/Edit Modal */}
      <Modal
        isOpen={isDepartmentModalOpen}
        onClose={handleCloseDepartmentModal}
        title={editingDepartment ? 'Edit Department' : 'Add New Department'}
        size="lg"
      >
        <form onSubmit={handleSubmitDepartment} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Department Name <span className="text-red-600">*</span>
              </label>
              <Input
                type="text"
                name="department_name"
                value={departmentFormData.department_name}
                onChange={handleDepartmentFormChange}
                required
                placeholder="e.g. Engineering"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Department Code <span className="text-red-600">*</span>
              </label>
              <Input
                type="text"
                name="department_code"
                value={departmentFormData.department_code}
                onChange={handleDepartmentFormChange}
                required
                placeholder="e.g. ENG"
                className="w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={departmentFormData.description}
              onChange={handleDepartmentFormChange}
              placeholder="Brief description of the department"
              rows={3}
              className="w-full px-3 py-2 border-2 border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Manager Name
              </label>
              <select
                name="manager_entity_employee_id"
                value={departmentFormData.manager_entity_employee_id}
                onChange={handleDepartmentFormChange}
                className="w-full px-3 py-2 border-2 border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800"
              >
                <option value="">Select Manager</option>
                {loading ? (
                  <option disabled>Loading employees...</option>
                ) : employees.length === 0 ? (
                  <option disabled>No employees found</option>
                ) : (
                  employees
                    .filter(emp => 
                      emp.employee_entity_id && 
                      emp.status === 'active' && 
                      emp.is_manager === true
                    )
                    .map(emp => (
                      <option key={emp.employee_entity_id} value={emp.employee_entity_id}>
                        {emp.first_name} {emp.last_name}
                      </option>
                    ))
                )}
              </select>
              <p className="text-xs text-slate-500 mt-1">
                {loading 
                  ? 'Loading...'
                  : employees.length === 0 
                    ? 'No employees loaded'
                    : departmentFormData.manager_entity_employee_id 
                      ? `ID: ${departmentFormData.manager_entity_employee_id}` 
                      : `${employees.filter(emp => emp.employee_entity_id && emp.status === 'active' && emp.is_manager === true).length} active managers available`}
              </p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Status
              </label>
              <div className="flex items-center h-10">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={departmentFormData.is_active}
                    onChange={handleDepartmentFormChange}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm font-medium text-slate-800">Active</span>
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Budget Code
              </label>
              <Input
                type="text"
                name="budget_code"
                value={departmentFormData.budget_code}
                onChange={handleDepartmentFormChange}
                placeholder="e.g. BUD-ENG-2025"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Cost Center
              </label>
              <Input
                type="text"
                name="cost_center"
                value={departmentFormData.cost_center}
                onChange={handleDepartmentFormChange}
                placeholder="e.g. CC-1000"
                className="w-full"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t-2 border-slate-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseDepartmentModal}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingDepartment ? 'Update Department' : 'Create Department'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Position Create/Edit Modal */}
      <Modal
        isOpen={isPositionModalOpen}
        onClose={handleClosePositionModal}
        title={editingPosition ? 'Edit Position' : 'Create New Position'}
      >
        <form onSubmit={handleSubmitPosition} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Position Title <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                name="employee_job_title"
                value={positionFormData.employee_job_title}
                onChange={handlePositionFormChange}
                placeholder="e.g. Senior Developer"
                required
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Department <span className="text-red-500">*</span>
              </label>
              <select
                name="department"
                value={positionFormData.department}
                onChange={handlePositionFormChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <SearchableSelect
              label="Skill/Role"
              name="platform_role_name"
              value={positionFormData.platform_role_name}
              onChange={(value) => {
                setPositionFormData(prev => ({ ...prev, platform_role_name: value }));
              }}
              options={roles.map((role) => ({
                value: role.display_name,
                label: role.display_name,
              }))}
              placeholder="Select Role"
              required
            />

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Job Grade <span className="text-red-500">*</span>
              </label>
              <select
                name="job_grade"
                value={positionFormData.job_grade}
                onChange={handlePositionFormChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Job Grade</option>
                {jobGrades.map((grade) => (
                  <option key={grade.id} value={grade.job_grade}>
                    {grade.job_grade}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Work Address
              </label>
              <Input
                type="text"
                name="address"
                value={positionFormData.address}
                onChange={handlePositionFormChange}
                placeholder="Enter work location address"
                className="w-full"
              />
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  name="is_manager"
                  checked={positionFormData.is_manager}
                  onChange={handlePositionFormChange}
                  disabled={
                    !positionFormData.job_grade || 
                    jobGrades.find(g => g.job_grade === positionFormData.job_grade)?.is_manager !== true
                  }
                  className={`w-4 h-4 text-blue-600 rounded focus:ring-blue-500 ${
                    !positionFormData.job_grade || 
                    jobGrades.find(g => g.job_grade === positionFormData.job_grade)?.is_manager !== true
                      ? 'opacity-50 cursor-not-allowed' 
                      : ''
                  }`}
                />
                Manager Position
              </label>
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={positionFormData.is_active}
                  onChange={handlePositionFormChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                Active Position
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t-2 border-slate-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleClosePositionModal}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingPosition ? 'Update Position' : 'Create Position'}
            </Button>
          </div>
        </form>
      </Modal>
    </ContentArea>
  );
}
