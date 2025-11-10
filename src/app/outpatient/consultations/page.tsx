'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { ContentArea, ContentCard, VStack } from '@/components/layout/PageLayout';
import { useConsultations } from '@/hooks/useOutpatientAPI';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Search, FileText, Activity, Pill, Syringe, AlertCircle, FlaskConical } from 'lucide-react';

// Medical Records Component
function MedicalRecordsTab() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedPatient, setSelectedPatient] = React.useState<any>(null);

  // Mock patient data
  const recentPatients = [
    { id: 1, name: 'Max', owner: 'John Smith', species: 'Dog', lastVisit: '2024-11-08' },
    { id: 2, name: 'Whiskers', owner: 'Sarah Johnson', species: 'Cat', lastVisit: '2024-11-07' },
    { id: 3, name: 'Buddy', owner: 'Mike Brown', species: 'Dog', lastVisit: '2024-11-05' },
  ];

  const medicalHistory = [
    { date: '2024-11-08', type: 'Consultation', diagnosis: 'Ear infection', doctor: 'Dr. Smith', status: 'completed' },
    { date: '2024-10-15', type: 'Vaccination', diagnosis: 'Annual vaccines', doctor: 'Dr. Johnson', status: 'completed' },
    { date: '2024-09-20', type: 'Surgery', diagnosis: 'Dental cleaning', doctor: 'Dr. Williams', status: 'completed' },
  ];

  const prescriptions = [
    { medication: 'Amoxicillin', dosage: '250mg', frequency: 'Twice daily', duration: '10 days', prescribed: '2024-11-08', status: 'active' },
    { medication: 'Pain Relief', dosage: '100mg', frequency: 'Once daily', duration: '5 days', prescribed: '2024-11-08', status: 'active' },
  ];

  const vaccinations = [
    { vaccine: 'Rabies', date: '2024-10-15', nextDue: '2025-10-15', status: 'current' },
    { vaccine: 'DHPP', date: '2024-10-15', nextDue: '2025-10-15', status: 'current' },
    { vaccine: 'Bordetella', date: '2024-04-10', nextDue: '2024-10-10', status: 'overdue' },
  ];

  const allergies = [
    { allergen: 'Penicillin', severity: 'high', reaction: 'Severe skin rash', reported: '2023-05-12' },
    { allergen: 'Chicken', severity: 'medium', reaction: 'Digestive upset', reported: '2023-08-20' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-blue-500">
          <CardContent className="py-3 px-4">
            <div className="text-2xl font-bold text-slate-800">1,245</div>
            <p className="text-xs text-slate-500 mt-1">Total Records</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-green-500">
          <CardContent className="py-3 px-4">
            <div className="text-2xl font-bold text-slate-800">89</div>
            <p className="text-xs text-slate-500 mt-1">Updated This Week</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-orange-500">
          <CardContent className="py-3 px-4">
            <div className="text-2xl font-bold text-slate-800">15</div>
            <p className="text-xs text-slate-500 mt-1">Pending Reviews</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-red-500">
          <CardContent className="py-3 px-4">
            <div className="text-2xl font-bold text-slate-800">23</div>
            <p className="text-xs text-slate-500 mt-1">Critical Alerts</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Patient Search */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Search Patient</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search patient..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-600">Recent Patients</p>
                {recentPatients.map((patient) => (
                  <button
                    key={patient.id}
                    onClick={() => setSelectedPatient(patient)}
                    className="w-full text-left p-3 rounded-lg border hover:bg-slate-50 transition-colors"
                  >
                    <div className="font-medium">{patient.name}</div>
                    <div className="text-sm text-slate-500">{patient.owner}</div>
                    <div className="text-xs text-slate-400 mt-1">{patient.species} • Last visit: {patient.lastVisit}</div>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medical Records Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {selectedPatient ? `${selectedPatient.name}'s Medical Record` : 'Select a Patient'}
              </CardTitle>
              {selectedPatient && (
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <FileText className="h-4 w-4 mr-2" />
                  Add Entry
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {selectedPatient ? (
              <Tabs defaultValue="history" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="history">History</TabsTrigger>
                  <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
                  <TabsTrigger value="vaccinations">Vaccinations</TabsTrigger>
                  <TabsTrigger value="allergies">Allergies</TabsTrigger>
                </TabsList>
                
                <TabsContent value="history" className="space-y-4 mt-4">
                  {medicalHistory.map((record, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-blue-100 text-blue-800">{record.type}</Badge>
                            <span className="text-sm text-slate-500">{record.date}</span>
                          </div>
                          <p className="font-medium text-slate-800">{record.diagnosis}</p>
                          <p className="text-sm text-slate-600 mt-1">by {record.doctor}</p>
                        </div>
                        <Activity className="h-5 w-5 text-slate-400" />
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="prescriptions" className="space-y-4 mt-4">
                  {prescriptions.map((rx, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Pill className="h-4 w-4 text-blue-600" />
                            <p className="font-medium text-slate-800">{rx.medication}</p>
                            <Badge className="bg-green-100 text-green-800">{rx.status}</Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
                            <div>Dosage: {rx.dosage}</div>
                            <div>Frequency: {rx.frequency}</div>
                            <div>Duration: {rx.duration}</div>
                            <div>Prescribed: {rx.prescribed}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="vaccinations" className="space-y-4 mt-4">
                  {vaccinations.map((vax, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Syringe className="h-4 w-4 text-green-600" />
                            <p className="font-medium text-slate-800">{vax.vaccine}</p>
                            <Badge className={vax.status === 'overdue' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                              {vax.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
                            <div>Last: {vax.date}</div>
                            <div>Next Due: {vax.nextDue}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="allergies" className="space-y-4 mt-4">
                  {allergies.map((allergy, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-red-50 hover:bg-red-100 transition-colors">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600 mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="font-medium text-slate-800">{allergy.allergen}</p>
                            <Badge className={allergy.severity === 'high' ? 'bg-red-600 text-white' : 'bg-orange-100 text-orange-800'}>
                              {allergy.severity} severity
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-700">Reaction: {allergy.reaction}</p>
                          <p className="text-xs text-slate-500 mt-1">Reported: {allergy.reported}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <FileText className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                <p>Select a patient to view their medical records</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ConsultationsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    hospital_id: '',
    pet_id: '',
    limit: '50',
  });

  // Prescription state
  const [prescriptions, setPrescriptions] = useState<Array<{
    medication: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }>>([]);

  // Diagnostic tests state
  const [diagnosticTests, setDiagnosticTests] = useState<Array<{
    testType: string;
    testName: string;
    urgency: string;
    notes: string;
  }>>([]);

  const addPrescription = () => {
    setPrescriptions([...prescriptions, {
      medication: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: ''
    }]);
  };

  const removePrescription = (index: number) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== index));
  };

  const updatePrescription = (index: number, field: string, value: string) => {
    const updated = [...prescriptions];
    updated[index] = { ...updated[index], [field]: value };
    setPrescriptions(updated);
  };

  const addDiagnosticTest = () => {
    setDiagnosticTests([...diagnosticTests, {
      testType: '',
      testName: '',
      urgency: 'routine',
      notes: ''
    }]);
  };

  const removeDiagnosticTest = (index: number) => {
    setDiagnosticTests(diagnosticTests.filter((_, i) => i !== index));
  };

  const updateDiagnosticTest = (index: number, field: string, value: string) => {
    const updated = [...diagnosticTests];
    updated[index] = { ...updated[index], [field]: value };
    setDiagnosticTests(updated);
  };

  // Fetch consultations from ff-outp API
  const { data: consultations = [], isLoading, error } = useConsultations(filters);

  if (isLoading) {
    return (
      <ContentArea>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading consultations...</div>
        </div>
      </ContentArea>
    );
  }

  if (error) {
    return (
      <ContentArea>
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">Error loading consultations: {(error as Error).message}</div>
        </div>
      </ContentArea>
    );
  }

  return (
    <ContentArea>
      <VStack size="sm">
        <div className="flex items-baseline gap-3">
          <h1 className="text-3xl font-bold text-slate-800">Consultations</h1>
          <p className="text-sm text-slate-500">Pet consultation records and SOAP notes</p>
        </div>

        <Tabs defaultValue="consultations" className="w-full">
          <TabsList>
            <TabsTrigger value="consultations">Consultations</TabsTrigger>
            <TabsTrigger value="records">Medical Records</TabsTrigger>
          </TabsList>

          <TabsContent value="consultations" className="mt-6">
        <div className="flex justify-end">
          <Button onClick={() => setIsModalOpen(true)}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Consultation
          </Button>
        </div>

        {/* Search & Filter */}
        <ContentCard title="Search & Filter">
          <div className="flex gap-4">
            <Input placeholder="Search by pet name or owner..." className="flex-1" />
            <Input type="date" />
            <Button variant="outline">Search</Button>
          </div>
        </ContentCard>

        {/* Consultation Records */}
        <ContentCard title="Recent Consultations" scrollable={true}>
          <div className="grid gap-4">
            {consultations.map((consultation: any) => (
          <Card key={consultation.id} hover>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-lg">
                      {(consultation.petName || consultation.pet_name || 'Pet').substring(0, 2)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{consultation.petName || consultation.pet_name || 'Unknown Pet'}</h3>
                      <p className="text-sm text-muted-foreground">
                        {consultation.species || 'N/A'} • Owner: {consultation.owner || consultation.owner_name || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Date</p>
                      <p className="text-sm font-medium">{consultation.date || new Date(consultation.created_at).toISOString().split('T')[0]}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Doctor</p>
                      <p className="text-sm font-medium">{consultation.doctor || consultation.doctor_name || 'N/A'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-muted-foreground mb-1">Chief Complaint</p>
                      <p className="text-sm font-medium">{consultation.chiefComplaint || consultation.chief_complaint || consultation.subjective || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="bg-accent/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Diagnosis</p>
                    <p className="text-sm font-medium">{consultation.diagnosis || consultation.assessment || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </Button>
                  <Button variant="ghost" size="sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
          </div>
        </ContentCard>

        {/* New Consultation Modal (SOAP Format) */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Consultation - SOAP Notes" size="xl">
        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Pet Name" placeholder="Select or enter pet name" required />
            <Input label="Owner Name" placeholder="Owner name" disabled />
          </div>

          {/* Subjective */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">S - Subjective</h3>
            <div className="space-y-3 pl-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Chief Complaint</label>
                <Input placeholder="Main reason for visit" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">History</label>
                                <textarea 
                  className="w-full min-h-20 rounded-xl border-0 ring-1 ring-white/5 bg-white/25 backdrop-blur-xl px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-0 transition-all duration-300"
                  placeholder="Pet history and symptoms..."
                />
              </div>
            </div>
          </div>

          {/* Objective */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">O - Objective</h3>
            <div className="space-y-3 pl-4">
              <div className="grid grid-cols-4 gap-3">
                <Input label="Temperature (°F)" type="number" step="0.1" placeholder="98.6" />
                <Input label="Heart Rate (bpm)" type="number" placeholder="80" />
                <Input label="Resp. Rate (rpm)" type="number" placeholder="20" />
                <Input label="Weight (lbs)" type="number" step="0.1" placeholder="50" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Physical Examination</label>
                <textarea
                  className="w-full min-h-20 rounded-xl border-0 ring-1 ring-white/5 bg-white/25 backdrop-blur-xl px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                  placeholder="Examination findings..."
                />
              </div>
            </div>
          </div>

          {/* Assessment */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">A - Assessment</h3>
            <div className="space-y-3 pl-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Diagnosis</label>
                <textarea
                  className="w-full min-h-20 rounded-xl border-0 ring-1 ring-white/5 bg-white/25 backdrop-blur-xl px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                  placeholder="Diagnosis and assessment..."
                />
              </div>
            </div>
          </div>

          {/* Plan */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">P - Plan</h3>
            <div className="space-y-3 pl-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Treatment Plan</label>
                <textarea
                  className="w-full min-h-20 rounded-xl border-0 ring-1 ring-white/5 bg-white/25 backdrop-blur-xl px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                  placeholder="Treatment plan, medications, follow-up instructions..."
                />
              </div>
            </div>
          </div>

          {/* Prescriptions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">💊 Prescriptions</h3>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={addPrescription}
                className="flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Medication
              </Button>
            </div>

            {prescriptions.length === 0 ? (
              <div className="text-center py-6 text-slate-500 bg-slate-50 rounded-lg border-2 border-dashed">
                <Pill className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                <p className="text-sm">No prescriptions added yet</p>
                <p className="text-xs mt-1">Click "Add Medication" to prescribe medications</p>
              </div>
            ) : (
              <div className="space-y-3">
                {prescriptions.map((rx, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-white space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">Medication #{index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removePrescription(index)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="Medication Name"
                        placeholder="e.g., Amoxicillin"
                        value={rx.medication}
                        onChange={(e) => updatePrescription(index, 'medication', e.target.value)}
                        required
                      />
                      <Input
                        label="Dosage"
                        placeholder="e.g., 250mg"
                        value={rx.dosage}
                        onChange={(e) => updatePrescription(index, 'dosage', e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="Frequency"
                        placeholder="e.g., Twice daily"
                        value={rx.frequency}
                        onChange={(e) => updatePrescription(index, 'frequency', e.target.value)}
                        required
                      />
                      <Input
                        label="Duration"
                        placeholder="e.g., 10 days"
                        value={rx.duration}
                        onChange={(e) => updatePrescription(index, 'duration', e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1.5">Special Instructions</label>
                      <textarea
                        className="w-full min-h-16 rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        placeholder="e.g., Take with food, avoid dairy products..."
                        value={rx.instructions}
                        onChange={(e) => updatePrescription(index, 'instructions', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Diagnostic Tests */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">🔬 Order Tests & Diagnostics</h3>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={addDiagnosticTest}
                className="flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Order Test
              </Button>
            </div>

            {diagnosticTests.length === 0 ? (
              <div className="text-center py-6 text-slate-500 bg-slate-50 rounded-lg border-2 border-dashed">
                <FlaskConical className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                <p className="text-sm">No diagnostic tests ordered yet</p>
                <p className="text-xs mt-1">Click "Order Test" to request lab work or imaging</p>
              </div>
            ) : (
              <div className="space-y-3">
                {diagnosticTests.map((test, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-white space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">Test Order #{index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeDiagnosticTest(index)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Test Type</label>
                        <select
                          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          value={test.testType}
                          onChange={(e) => updateDiagnosticTest(index, 'testType', e.target.value)}
                          required
                        >
                          <option value="">Select type...</option>
                          <option value="laboratory">Laboratory Tests</option>
                          <option value="imaging">Imaging/Radiology</option>
                          <option value="pathology">Pathology</option>
                          <option value="microbiology">Microbiology</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <Input
                        label="Test Name"
                        placeholder="e.g., Complete Blood Count"
                        value={test.testName}
                        onChange={(e) => updateDiagnosticTest(index, 'testName', e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1.5">Urgency</label>
                      <div className="flex gap-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name={`urgency-${index}`}
                            value="routine"
                            checked={test.urgency === 'routine'}
                            onChange={(e) => updateDiagnosticTest(index, 'urgency', e.target.value)}
                            className="text-blue-600"
                          />
                          <span className="text-sm">Routine</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name={`urgency-${index}`}
                            value="urgent"
                            checked={test.urgency === 'urgent'}
                            onChange={(e) => updateDiagnosticTest(index, 'urgency', e.target.value)}
                            className="text-orange-600"
                          />
                          <span className="text-sm">Urgent</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name={`urgency-${index}`}
                            value="stat"
                            checked={test.urgency === 'stat'}
                            onChange={(e) => updateDiagnosticTest(index, 'urgency', e.target.value)}
                            className="text-red-600"
                          />
                          <span className="text-sm">STAT</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1.5">Clinical Notes / Indication</label>
                      <textarea
                        className="w-full min-h-16 rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        placeholder="Clinical indication for this test..."
                        value={test.notes}
                        onChange={(e) => updateDiagnosticTest(index, 'notes', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
            <Button variant="outline" onClick={() => setIsModalOpen(false)} type="button">
              Cancel
            </Button>
            <Button variant="secondary" type="button">Save as Draft</Button>
            <Button type="submit">Complete Consultation</Button>
          </div>
        </form>
      </Modal>
          </TabsContent>

          <TabsContent value="records" className="mt-6">
            <MedicalRecordsTab />
          </TabsContent>
        </Tabs>
      </VStack>
    </ContentArea>
  );
}
