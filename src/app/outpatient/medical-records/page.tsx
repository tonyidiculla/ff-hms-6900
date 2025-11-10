'use client';

import React from 'react';
import { ContentArea, VStack } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Search, FileText, Activity, Pill, Syringe, AlertCircle } from 'lucide-react';

export default function MedicalRecordsPage() {
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
    <ContentArea>
      <VStack size="sm">
        <div className="flex items-baseline gap-3">
          <h1 className="text-3xl font-bold text-slate-800">Medical Records</h1>
          <p className="text-sm text-slate-500">Comprehensive patient health records</p>
        </div>

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
      </VStack>
    </ContentArea>
  );
}
