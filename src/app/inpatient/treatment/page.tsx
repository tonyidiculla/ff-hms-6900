'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Heart, Thermometer, Droplets, Wind, Clock, AlertCircle, Plus, Save, FileText, Calendar, User } from 'lucide-react';
import { ContentArea, VStack, ContentCard } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { 
  useAdmissions, 
  useVitals, 
  useCreateVitals, 
  useUpdateTreatmentPlan, 
  useProgressNotes, 
  useCreateProgressNote 
} from '@/hooks/useHMSMicroservices';

export default function TreatmentPlanningPage() {
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'vitals' | 'treatment' | 'notes'>('vitals');

  // Fetch active admissions
  const { data: admissions = [], isLoading } = useAdmissions({
    entity_platform_id: 'E019nC8m3',
  });

  // Fetch vitals for selected patient
  const { data: vitalsHistory = [] } = useVitals({
    admission_id: selectedPatient?.id,
    limit: 10,
  });

  // Fetch progress notes for selected patient
  const { data: progressNotes = [] } = useProgressNotes({
    admission_id: selectedPatient?.id,
    limit: 20,
  });

  // Mutations
  const createVitals = useCreateVitals();
  const updateTreatmentPlan = useUpdateTreatmentPlan();
  const createProgressNote = useCreateProgressNote();

  // Mock vitals data - In production, fetch from hospital_vitals table
  const [vitals, setVitals] = useState({
    temperature: '',
    heartRate: '',
    respiratoryRate: '',
    bloodPressure: '',
    weight: '',
    oxygenSaturation: '',
    timestamp: new Date().toISOString(),
  });

  // Mock treatment plan data
  const [treatmentPlan, setTreatmentPlan] = useState({
    medications: [] as Array<{ name: string; dosage: string; frequency: string; route: string }>,
    procedures: [] as Array<{ name: string; scheduledTime: string; notes: string }>,
    diet: '',
    restrictions: '',
    monitoringNotes: '',
  });

  const [newNote, setNewNote] = useState('');
  const [noteType, setNoteType] = useState('general');

  // Reset vitals when patient changes
  useEffect(() => {
    if (selectedPatient) {
      setVitals({
        temperature: '',
        heartRate: '',
        respiratoryRate: '',
        bloodPressure: '',
        weight: '',
        oxygenSaturation: '',
        timestamp: new Date().toISOString(),
      });
    }
  }, [selectedPatient]);

  const handleAddMedication = () => {
    setTreatmentPlan({
      ...treatmentPlan,
      medications: [...treatmentPlan.medications, { name: '', dosage: '', frequency: '', route: '' }],
    });
  };

  const handleAddProcedure = () => {
    setTreatmentPlan({
      ...treatmentPlan,
      procedures: [...treatmentPlan.procedures, { name: '', scheduledTime: '', notes: '' }],
    });
  };

  const handleSaveVitals = async () => {
    if (!selectedPatient) return;

    try {
      // Parse blood pressure
      const bpParts = vitals.bloodPressure.split('/');
      const systolic = bpParts[0] ? parseInt(bpParts[0]) : undefined;
      const diastolic = bpParts[1] ? parseInt(bpParts[1]) : undefined;

      await createVitals.mutateAsync({
        admission_id: selectedPatient.id,
        pet_platform_id: selectedPatient.pet_platform_id,
        entity_platform_id: 'E019nC8m3',
        recorded_at: new Date().toISOString(),
        temperature: vitals.temperature ? parseFloat(vitals.temperature) : undefined,
        temperature_unit: 'F',
        heart_rate: vitals.heartRate ? parseInt(vitals.heartRate) : undefined,
        respiratory_rate: vitals.respiratoryRate ? parseInt(vitals.respiratoryRate) : undefined,
        blood_pressure_systolic: systolic,
        blood_pressure_diastolic: diastolic,
        weight: vitals.weight ? parseFloat(vitals.weight) : undefined,
        weight_unit: 'kg',
        oxygen_saturation: vitals.oxygenSaturation ? parseInt(vitals.oxygenSaturation) : undefined,
      });

      alert('Vitals saved successfully!');
      
      // Reset form
      setVitals({
        temperature: '',
        heartRate: '',
        respiratoryRate: '',
        bloodPressure: '',
        weight: '',
        oxygenSaturation: '',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error saving vitals:', error);
      alert('Failed to save vitals: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleSaveTreatmentPlan = async () => {
    if (!selectedPatient) return;

    try {
      // Build treatment plan text from structured data
      const planText = `
MEDICATIONS:
${treatmentPlan.medications.map(med => `- ${med.name} ${med.dosage} ${med.frequency} (${med.route})`).join('\n')}

SCHEDULED PROCEDURES:
${treatmentPlan.procedures.map(proc => `- ${proc.name} at ${proc.scheduledTime} - ${proc.notes}`).join('\n')}

DIET INSTRUCTIONS:
${treatmentPlan.diet}

RESTRICTIONS:
${treatmentPlan.restrictions}

MONITORING INSTRUCTIONS:
${treatmentPlan.monitoringNotes}
      `.trim();

      await updateTreatmentPlan.mutateAsync({
        admissionId: selectedPatient.id,
        treatment_plan: planText,
      });

      alert('Treatment plan saved successfully!');
    } catch (error) {
      console.error('Error saving treatment plan:', error);
      alert('Failed to save treatment plan: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleAddProgressNote = async () => {
    if (!selectedPatient || !newNote.trim()) return;

    try {
      await createProgressNote.mutateAsync({
        admission_id: selectedPatient.id,
        note_text: newNote,
        note_type: noteType,
      });

      setNewNote('');
      alert('Progress note added successfully!');
    } catch (error) {
      console.error('Error adding progress note:', error);
      alert('Failed to add progress note: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  return (
    <ContentArea>
      <VStack size="sm">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-baseline gap-3">
            <h1 className="text-3xl font-bold text-gray-900">Inpatient Dashboard Monitor</h1>
            <p className="text-sm text-gray-600">Monitor vitals and manage treatment plans for hospitalized patients</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient List Sidebar */}
          <div className="lg:col-span-1">
            <ContentCard title="Active Inpatients">
              {isLoading ? (
                <div className="text-center py-8 text-gray-500">Loading patients...</div>
              ) : admissions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>No active inpatients</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {admissions.map((admission: any) => (
                    <button
                      key={admission.id}
                      onClick={() => {
                        console.log('[Treatment] Selected admission:', admission);
                        console.log('[Treatment] Admission ID:', admission.id);
                        setSelectedPatient(admission);
                      }}
                      className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                        selectedPatient?.id === admission.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {admission.pet?.name || admission.pet_platform_id}
                          </p>
                          <p className="text-sm text-gray-600">
                            {admission.pet?.species || 'Unknown species'} 
                            {admission.pet?.breed && ` • ${admission.pet.breed}`}
                          </p>
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            <User className="w-3 h-3 mr-1" />
                            {admission.owner?.first_name && admission.owner?.last_name 
                              ? `${admission.owner.first_name} ${admission.owner.last_name}`
                              : admission.user_platform_id}
                          </div>
                          {admission.attending_staff && (
                            <div className="mt-1 text-xs text-gray-600">
                              Staff: {admission.attending_staff}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge className={`text-xs ${
                            admission.status === 'critical' ? 'bg-red-600' :
                            admission.status === 'stable' ? 'bg-green-600' :
                            admission.status === 'ready_for_discharge' ? 'bg-green-500' :
                            'bg-blue-600'
                          }`}>
                            {admission.status === 'ready_for_discharge' ? 'READY' : admission.status?.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        Bed: {admission.bed?.bed_number || 'Not assigned'}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </ContentCard>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {!selectedPatient ? (
              <ContentCard title="No Patient Selected">
                <div className="text-center py-12">
                  <Activity className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Patient</h3>
                  <p className="text-gray-600">Choose an inpatient from the list to view and manage their treatment plan</p>
                </div>
              </ContentCard>
            ) : (
              <div className="space-y-6">
                {/* Patient Info Card */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900">
                          {selectedPatient.pet?.name || selectedPatient.pet_platform_id}
                        </h2>
                        <p className="text-gray-600 mt-1">
                          {selectedPatient.pet?.species || 'Unknown species'} • Bed {selectedPatient.bed?.bed_number || 'Not assigned'}
                        </p>
                        <div className="mt-2 flex items-center text-sm text-gray-600">
                          <User className="w-4 h-4 mr-2" />
                          Owner: {selectedPatient.owner?.first_name && selectedPatient.owner?.last_name 
                            ? `${selectedPatient.owner.first_name} ${selectedPatient.owner.last_name}`
                            : selectedPatient.user_platform_id}
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedPatient.status === 'critical' ? 'bg-red-100 text-red-800' :
                        selectedPatient.status === 'stable' ? 'bg-green-100 text-green-800' :
                        selectedPatient.status === 'ready_for_discharge' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {selectedPatient.status === 'ready_for_discharge' ? 'READY FOR DISCHARGE' : selectedPatient.status?.toUpperCase()}
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Admitted:</span>
                        <span className="ml-2 font-medium">
                          {new Date(selectedPatient.admission_date).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Medical Status:</span>
                        <span className="ml-2">
                          <select
                            value={selectedPatient.status}
                            onChange={async (e) => {
                              const newStatus = e.target.value;
                              console.log('[Treatment] Updating status from', selectedPatient.status, 'to', newStatus);
                              console.log('[Treatment] Admission ID:', selectedPatient.id);
                              try {
                                const result = await updateTreatmentPlan.mutateAsync({
                                  admissionId: selectedPatient.id,
                                  status: newStatus,
                                });
                                console.log('[Treatment] Status update successful:', result);
                                setSelectedPatient({ ...selectedPatient, status: newStatus });
                              } catch (error: any) {
                                console.error('[Treatment] Failed to update status:', error);
                                console.error('[Treatment] Error details:', error.response?.data || error.message);
                                alert(`Failed to update medical status: ${error.message || 'Unknown error'}`);
                              }
                            }}
                            className={`px-2 py-1 rounded text-sm font-medium border ${
                              selectedPatient.status === 'critical' ? 'bg-red-100 text-red-800 border-red-300' :
                              selectedPatient.status === 'stable' ? 'bg-green-100 text-green-800 border-green-300' :
                              selectedPatient.status === 'ready_for_discharge' ? 'bg-green-100 text-green-800 border-green-300' :
                              'bg-blue-100 text-blue-800 border-blue-300'
                            }`}
                          >
                            <option value="active">Active</option>
                            <option value="critical">Critical</option>
                            <option value="stable">Stable</option>
                            <option value="ready_for_discharge">Ready for Discharge</option>
                          </select>
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Primary Vet:</span>
                        <span className="ml-2 font-medium">{selectedPatient.primary_veterinarian_name}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Attending Staff:</span>
                        <span className="ml-2 font-medium">
                          {selectedPatient.attending_staff || 'Not assigned'}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-600">Reason:</span>
                        <span className="ml-2 font-medium">{selectedPatient.admission_reason}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-600">Current Condition:</span>
                        <span className="ml-2">{selectedPatient.current_condition || 'Not recorded'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tabs */}
                <Card>
                  <div className="border-b border-gray-200">
                    <div className="flex space-x-8 px-6">
                      <button
                        onClick={() => setActiveTab('vitals')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                          activeTab === 'vitals'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Activity className="w-4 h-4 inline-block mr-2" />
                        Vitals Monitoring
                      </button>
                      <button
                        onClick={() => setActiveTab('treatment')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                          activeTab === 'treatment'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <FileText className="w-4 h-4 inline-block mr-2" />
                        Treatment Plan
                      </button>
                      <button
                        onClick={() => setActiveTab('notes')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                          activeTab === 'notes'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <FileText className="w-4 h-4 inline-block mr-2" />
                        Progress Notes
                      </button>
                    </div>
                  </div>

                  {/* Tab Content */}
                  <div className="p-6">
                    {activeTab === 'vitals' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">Record Vitals</h3>
                          <button
                            onClick={handleSaveVitals}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Save Vitals
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Temperature */}
                          <div className="bg-gray-50 rounded-lg p-4">
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                              <Thermometer className="w-4 h-4 mr-2 text-red-500" />
                              Temperature (°F)
                            </label>
                            <input
                              type="number"
                              step="0.1"
                              value={vitals.temperature}
                              onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="101.5"
                            />
                          </div>

                          {/* Heart Rate */}
                          <div className="bg-gray-50 rounded-lg p-4">
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                              <Heart className="w-4 h-4 mr-2 text-pink-500" />
                              Heart Rate (bpm)
                            </label>
                            <input
                              type="number"
                              value={vitals.heartRate}
                              onChange={(e) => setVitals({ ...vitals, heartRate: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="120"
                            />
                          </div>

                          {/* Respiratory Rate */}
                          <div className="bg-gray-50 rounded-lg p-4">
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                              <Wind className="w-4 h-4 mr-2 text-blue-500" />
                              Respiratory Rate (rpm)
                            </label>
                            <input
                              type="number"
                              value={vitals.respiratoryRate}
                              onChange={(e) => setVitals({ ...vitals, respiratoryRate: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="30"
                            />
                          </div>

                          {/* Blood Pressure */}
                          <div className="bg-gray-50 rounded-lg p-4">
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                              <Droplets className="w-4 h-4 mr-2 text-red-600" />
                              Blood Pressure (mmHg)
                            </label>
                            <input
                              type="text"
                              value={vitals.bloodPressure}
                              onChange={(e) => setVitals({ ...vitals, bloodPressure: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="120/80"
                            />
                          </div>

                          {/* Weight */}
                          <div className="bg-gray-50 rounded-lg p-4">
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                              <Activity className="w-4 h-4 mr-2 text-green-500" />
                              Weight (kg)
                            </label>
                            <input
                              type="number"
                              step="0.1"
                              value={vitals.weight}
                              onChange={(e) => setVitals({ ...vitals, weight: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="25.5"
                            />
                          </div>

                          {/* Oxygen Saturation */}
                          <div className="bg-gray-50 rounded-lg p-4">
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                              <Activity className="w-4 h-4 mr-2 text-blue-600" />
                              Oxygen Saturation (%)
                            </label>
                            <input
                              type="number"
                              value={vitals.oxygenSaturation}
                              onChange={(e) => setVitals({ ...vitals, oxygenSaturation: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="98"
                            />
                          </div>
                        </div>

                        {/* Vitals History */}
                        <div className="mt-8">
                          <h4 className="text-md font-semibold text-gray-900 mb-4">Recent Vitals History</h4>
                          {vitalsHistory.length === 0 ? (
                            <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
                              <Clock className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                              <p>No vitals recorded yet</p>
                              <p className="text-sm mt-1">Vitals will appear here once recorded</p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {vitalsHistory.map((vital: any, index: number) => {
                                // Parse vitals data from JSON field if it exists
                                const vitalsData = vital.data ? JSON.parse(vital.data) : vital;
                                const recordedAt = vitalsData.recorded_at || vital.created_at;
                                
                                return (
                                  <div key={vital.id || index} className="bg-white border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                      <div className="text-sm font-medium text-gray-900">
                                        {new Date(recordedAt).toLocaleString()}
                                      </div>
                                      {vitalsData.recorded_by && (
                                        <div className="text-xs text-gray-500">
                                          Recorded by: {vitalsData.recorded_by}
                                        </div>
                                      )}
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                                      {vitalsData.temperature && (
                                        <div className="flex items-center">
                                          <Thermometer className="w-4 h-4 mr-2 text-red-500" />
                                          <span className="text-gray-600">Temp:</span>
                                          <span className="ml-1 font-medium">{vitalsData.temperature}°{vitalsData.temperature_unit}</span>
                                        </div>
                                      )}
                                      {vitalsData.heart_rate && (
                                        <div className="flex items-center">
                                          <Heart className="w-4 h-4 mr-2 text-pink-500" />
                                          <span className="text-gray-600">HR:</span>
                                          <span className="ml-1 font-medium">{vitalsData.heart_rate} bpm</span>
                                        </div>
                                      )}
                                      {vitalsData.respiratory_rate && (
                                        <div className="flex items-center">
                                          <Wind className="w-4 h-4 mr-2 text-blue-500" />
                                          <span className="text-gray-600">RR:</span>
                                          <span className="ml-1 font-medium">{vitalsData.respiratory_rate} rpm</span>
                                        </div>
                                      )}
                                      {(vitalsData.blood_pressure_systolic || vitalsData.blood_pressure_diastolic) && (
                                        <div className="flex items-center">
                                          <Droplets className="w-4 h-4 mr-2 text-red-600" />
                                          <span className="text-gray-600">BP:</span>
                                          <span className="ml-1 font-medium">
                                            {vitalsData.blood_pressure_systolic || '?'}/{vitalsData.blood_pressure_diastolic || '?'}
                                          </span>
                                        </div>
                                      )}
                                      {vitalsData.weight && (
                                        <div className="flex items-center">
                                          <Activity className="w-4 h-4 mr-2 text-green-500" />
                                          <span className="text-gray-600">Weight:</span>
                                          <span className="ml-1 font-medium">{vitalsData.weight} {vitalsData.weight_unit}</span>
                                        </div>
                                      )}
                                      {vitalsData.oxygen_saturation && (
                                        <div className="flex items-center">
                                          <Activity className="w-4 h-4 mr-2 text-blue-600" />
                                          <span className="text-gray-600">SpO2:</span>
                                          <span className="ml-1 font-medium">{vitalsData.oxygen_saturation}%</span>
                                        </div>
                                      )}
                                    </div>
                                    {vitalsData.notes && (
                                      <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-600">
                                        <span className="font-medium">Notes:</span> {vitalsData.notes}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {activeTab === 'treatment' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">Treatment Plan</h3>
                          <button
                            onClick={handleSaveTreatmentPlan}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Save Plan
                          </button>
                        </div>

                        {/* Current Treatment Plan Display */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="font-medium text-blue-900 mb-2">Current Treatment Plan</h4>
                          <p className="text-sm text-blue-800 whitespace-pre-wrap">
                            {selectedPatient.treatment_plan || 'No treatment plan recorded'}
                          </p>
                        </div>

                        {/* Medications */}
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-md font-semibold text-gray-900">Medications</h4>
                            <button
                              onClick={handleAddMedication}
                              className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center"
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Add Medication
                            </button>
                          </div>
                          {treatmentPlan.medications.length === 0 ? (
                            <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
                              No medications added
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {treatmentPlan.medications.map((med, index) => (
                                <div key={index} className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                                  <input
                                    type="text"
                                    placeholder="Medication name"
                                    value={med.name}
                                    onChange={(e) => {
                                      const newMeds = [...treatmentPlan.medications];
                                      newMeds[index].name = e.target.value;
                                      setTreatmentPlan({ ...treatmentPlan, medications: newMeds });
                                    }}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Dosage"
                                    value={med.dosage}
                                    onChange={(e) => {
                                      const newMeds = [...treatmentPlan.medications];
                                      newMeds[index].dosage = e.target.value;
                                      setTreatmentPlan({ ...treatmentPlan, medications: newMeds });
                                    }}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Frequency"
                                    value={med.frequency}
                                    onChange={(e) => {
                                      const newMeds = [...treatmentPlan.medications];
                                      newMeds[index].frequency = e.target.value;
                                      setTreatmentPlan({ ...treatmentPlan, medications: newMeds });
                                    }}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Route (e.g., PO, IV)"
                                    value={med.route}
                                    onChange={(e) => {
                                      const newMeds = [...treatmentPlan.medications];
                                      newMeds[index].route = e.target.value;
                                      setTreatmentPlan({ ...treatmentPlan, medications: newMeds });
                                    }}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Procedures */}
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-md font-semibold text-gray-900">Scheduled Procedures</h4>
                            <button
                              onClick={handleAddProcedure}
                              className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center"
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Add Procedure
                            </button>
                          </div>
                          {treatmentPlan.procedures.length === 0 ? (
                            <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
                              No procedures scheduled
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {treatmentPlan.procedures.map((proc, index) => (
                                <div key={index} className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                                  <input
                                    type="text"
                                    placeholder="Procedure name"
                                    value={proc.name}
                                    onChange={(e) => {
                                      const newProcs = [...treatmentPlan.procedures];
                                      newProcs[index].name = e.target.value;
                                      setTreatmentPlan({ ...treatmentPlan, procedures: newProcs });
                                    }}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                  <input
                                    type="datetime-local"
                                    value={proc.scheduledTime}
                                    onChange={(e) => {
                                      const newProcs = [...treatmentPlan.procedures];
                                      newProcs[index].scheduledTime = e.target.value;
                                      setTreatmentPlan({ ...treatmentPlan, procedures: newProcs });
                                    }}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Notes"
                                    value={proc.notes}
                                    onChange={(e) => {
                                      const newProcs = [...treatmentPlan.procedures];
                                      newProcs[index].notes = e.target.value;
                                      setTreatmentPlan({ ...treatmentPlan, procedures: newProcs });
                                    }}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Diet & Restrictions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Diet Instructions
                            </label>
                            <textarea
                              value={treatmentPlan.diet}
                              onChange={(e) => setTreatmentPlan({ ...treatmentPlan, diet: e.target.value })}
                              rows={4}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Special diet instructions..."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Restrictions
                            </label>
                            <textarea
                              value={treatmentPlan.restrictions}
                              onChange={(e) => setTreatmentPlan({ ...treatmentPlan, restrictions: e.target.value })}
                              rows={4}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Activity restrictions, food restrictions, etc..."
                            />
                          </div>
                        </div>

                        {/* Monitoring Notes */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Monitoring Instructions
                          </label>
                          <textarea
                            value={treatmentPlan.monitoringNotes}
                            onChange={(e) => setTreatmentPlan({ ...treatmentPlan, monitoringNotes: e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="What to monitor, how frequently, when to alert veterinarian..."
                          />
                        </div>
                      </div>
                    )}

                    {activeTab === 'notes' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">Progress Notes</h3>
                        </div>

                        {/* Add Note Form */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Note Type
                              </label>
                              <select
                                value={noteType}
                                onChange={(e) => setNoteType(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                <option value="general">General</option>
                                <option value="medical">Medical</option>
                                <option value="behavioral">Behavioral</option>
                                <option value="dietary">Dietary</option>
                                <option value="treatment">Treatment</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Progress Note
                              </label>
                              <textarea
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter patient progress notes, observations, or updates..."
                              />
                            </div>
                            <button
                              onClick={handleAddProgressNote}
                              disabled={!newNote.trim()}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add Note
                            </button>
                          </div>
                        </div>

                        {/* Notes List */}
                        {progressNotes.length === 0 ? (
                          <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
                            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                            <p className="font-medium">No progress notes recorded</p>
                            <p className="text-sm mt-1">Add notes to track patient progress and observations</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {progressNotes.map((note: any) => (
                              <div key={note.id} className="bg-white border border-gray-200 rounded-lg p-4">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center space-x-2">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                      note.note_type === 'medical' ? 'bg-blue-100 text-blue-800' :
                                      note.note_type === 'behavioral' ? 'bg-purple-100 text-purple-800' :
                                      note.note_type === 'dietary' ? 'bg-green-100 text-green-800' :
                                      note.note_type === 'treatment' ? 'bg-orange-100 text-orange-800' :
                                      'bg-gray-100 text-gray-800'
                                    }`}>
                                      {note.note_type || 'general'}
                                    </span>
                                    {note.is_important && (
                                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                                        Important
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {new Date(note.created_at).toLocaleString()}
                                  </div>
                                </div>
                                <p className="text-gray-800 whitespace-pre-wrap">{note.note_text}</p>
                                {note.recorded_by && (
                                  <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
                                    Recorded by: {note.recorded_by}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </VStack>
    </ContentArea>
  );
}
