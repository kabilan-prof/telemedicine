import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, User, Pill, Search, CheckCircle, AlertCircle, FileText, Heart, Activity, Video, MapPin, Star, Phone } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { mockAppointments, mockPrescriptions, mockMedicineStock } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import AISymptomChecker from '@/components/common/AISymptomChecker';
import AIChatbot from '@/components/common/AIChatbot';
import OfflineIndicator from '@/components/common/OfflineIndicator';
import { OfflineService } from '@/services/offlineService';
import { AIService } from '@/services/aiService';

const PatientDashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [showChatbot, setShowChatbot] = useState(false);
  const [voiceBooking, setVoiceBooking] = useState(false);
  const [medicineSearch, setMedicineSearch] = useState('');
  const [symptoms, setSymptoms] = useState({
    fever: false,
    cough: false,
    headache: false,
    bodyPain: false,
    nausea: false,
    fatigue: false,
    other: ''
  });

  const patientAppointments = mockAppointments.filter(apt => apt.patientId === user?.id);
  const patientPrescriptions = mockPrescriptions.filter(presc => presc.patientId === user?.id);
  const offlineService = OfflineService.getInstance();
  const aiService = AIService.getInstance();

  const handleSymptomCheck = () => {
    const selectedSymptoms = Object.entries(symptoms)
      .filter(([key, value]) => key !== 'other' && value)
      .map(([key]) => key);
    
    if (selectedSymptoms.length > 0 || symptoms.other) {
      toast({
        title: "Symptoms Recorded",
        description: "Based on your symptoms, we recommend consulting a doctor. Would you like to book an appointment?",
      });
    }
  };

  const searchMedicine = () => {
    if (!medicineSearch.trim()) return;
    
    const medicine = mockMedicineStock.find(med => 
      med.name.toLowerCase().includes(medicineSearch.toLowerCase())
    );

    if (medicine) {
      toast({
        title: medicine.stock > 0 ? "Medicine Available!" : "Out of Stock",
        description: medicine.stock > 0 
          ? `${medicine.name} is available. Stock: ${medicine.stock} units, Price: ₹${medicine.price}`
          : `${medicine.name} is currently out of stock. We'll notify you when available.`,
        variant: medicine.stock > 0 ? "default" : "destructive"
      });
    } else {
      toast({
        title: "Medicine Not Found",
        description: "The requested medicine is not available in our database.",
        variant: "destructive"
      });
    }
  };

  const handleVoiceBooking = async () => {
    setVoiceBooking(true);
    try {
      await offlineService.initiateVoiceBooking();
      toast({
        title: "Voice Booking Started",
        description: "Please speak your appointment request clearly.",
      });
    } catch (error) {
      toast({
        title: "Voice Booking Failed",
        description: "Voice booking is not available. Please use manual booking or call our helpline.",
        variant: "destructive"
      });
    } finally {
      setVoiceBooking(false);
    }
  };

  const handleEmergencyCall = () => {
    if (confirm("This will call emergency services (108). Continue?")) {
      window.location.href = "tel:108";
    }
  };

  const handlePrescriptionExplanation = async (prescription: any) => {
    try {
      const explanation = await aiService.explainPrescription(prescription);
      toast({
        title: "Prescription Explained",
        description: "Check the detailed explanation below.",
      });
      
      // Show explanation in a modal or expand the prescription card
      console.log(explanation);
    } catch (error) {
      toast({
        title: "Explanation Failed",
        description: "Unable to explain prescription. Please consult your doctor.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <OfflineIndicator />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('patientDashboard')}</h1>
          <p className="text-muted-foreground mt-1">{t('yourHealth')}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-success">
            <Heart className="h-3 w-3 mr-1" />
            {t('welcome')}, {user?.name}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowChatbot(true)}
              className="flex items-center space-x-1"
            >
              <MessageSquare className="h-3 w-3" />
              <span>AI Assistant</span>
            </Button>
          </Badge>
        </div>
      </div>

      {/* Health Status Banner */}
      <Card className="shadow-medical bg-gradient-health text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">{t('healthStatus')}: Good</h3>
              <p className="text-white/80">Last checkup: 2 weeks ago</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <Activity className="h-8 w-8 mx-auto mb-1" />
                <div className="text-sm">Active</div>
              </div>
              <div className="text-center">
                <Heart className="h-8 w-8 mx-auto mb-1" />
                <div className="text-sm">Healthy</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="symptoms">{t('symptomChecker')}</TabsTrigger>
          <TabsTrigger value="appointments">{t('appointments')}</TabsTrigger>
          <TabsTrigger value="medicines">{t('medicines')}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="shadow-card hover:shadow-medical transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('upcomingAppointments')}</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{patientAppointments.length}</div>
                <p className="text-xs text-muted-foreground">Next: Today 10:00 AM</p>
                <div className="mt-2">
                  <div className="flex items-center text-xs text-success">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    <span>Dr. Rachit confirmed</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-medical transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active {t('prescription')}s</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">{patientPrescriptions.length}</div>
                <p className="text-xs text-muted-foreground">2 medicines to take today</p>
                <div className="mt-2">
                  <div className="flex items-center text-xs text-warning">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Next dose: 2:00 PM</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-medical transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('healthStatus')} Score</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">Good</div>
                <p className="text-xs text-muted-foreground">Based on recent checkups</p>
                <div className="mt-2 flex items-center">
                  {[1, 2, 3, 4].map((star) => (
                    <Star key={star} className="h-3 w-3 text-warning fill-current" />
                  ))}
                  <Star className="h-3 w-3 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks for patients</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-4 gap-4">
              <Button variant="medical" className="h-20 flex-col space-y-2 hover:scale-105 transition-transform">
                <Calendar className="h-6 w-6" />
                <span>{t('bookAppointment')}</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2 hover:scale-105 transition-transform"
                onClick={handleVoiceBooking}
                disabled={voiceBooking}
              >
                {voiceBooking ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current"></div>
                ) : (
                  <Mic className="h-6 w-6" />
                )}
                <span>Voice Booking</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2 hover:scale-105 transition-transform">
                <Search className="h-6 w-6" />
                <span>{t('checkMedicine')}</span>
              </Button>
              <Button variant="success" className="h-20 flex-col space-y-2 hover:scale-105 transition-transform">
                <Video className="h-6 w-6" />
                <span>{t('videoCall')}</span>
              </Button>
              <Button variant="secondary" className="h-20 flex-col space-y-2 hover:scale-105 transition-transform">
                <Phone className="h-6 w-6" />
                <span>{t('audioCall')}</span>
              </Button>
              <Button 
                variant="emergency" 
                className="h-20 flex-col space-y-2 hover:scale-105 transition-transform"
                onClick={handleEmergencyCall}
              >
                <AlertCircle className="h-6 w-6" />
                <span>Emergency (108)</span>
              </Button>
            </CardContent>
          </Card>
          
          {/* Recent Activity */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest health interactions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Prescription filled</p>
                  <p className="text-xs text-muted-foreground">Paracetamol - 2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Appointment confirmed</p>
                  <p className="text-xs text-muted-foreground">Dr. Rachit - Today 10:00 AM</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-warning rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Health checkup reminder</p>
                  <p className="text-xs text-muted-foreground">Due in 3 days</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="symptoms" className="space-y-4">
          <AISymptomChecker 
            onRecommendation={(recommendation) => {
              if (recommendation.urgencyLevel === 'emergency') {
                if (confirm("Emergency condition detected! Call 108 now?")) {
                  window.location.href = "tel:108";
                }
              }
            }}
          />
          
          {/* Traditional Symptom Checker */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Manual {t('symptomChecker')}</CardTitle>
              <CardDescription>Select your symptoms for basic guidance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(symptoms).filter(([key]) => key !== 'other').map(([symptom, checked]) => (
                  <label key={symptom} className="flex items-center space-x-2 cursor-pointer p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={checked as boolean}
                      onChange={(e) => setSymptoms(prev => ({ ...prev, [symptom]: e.target.checked }))}
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                    <span className="capitalize">{symptom.replace(/([A-Z])/g, ' $1').trim()}</span>
                  </label>
                ))}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Other {t('symptoms')}:</label>
                <Textarea
                  placeholder={`Describe any other ${t('symptoms')}...`}
                  value={symptoms.other}
                  onChange={(e) => setSymptoms(prev => ({ ...prev, other: e.target.value }))}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <Button onClick={handleSymptomCheck} variant="medical" className="w-full hover:scale-105 transition-transform">
                Check {t('symptoms')}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Your {t('appointments')}</CardTitle>
              <CardDescription>Manage your doctor consultations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {patientAppointments.map((appointment) => (
                <div key={appointment.id} className="border border-border rounded-lg p-4 space-y-2 hover:shadow-card transition-shadow duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-primary" />
                      <span className="font-medium">{appointment.doctorName}</span>
                      <Badge variant="outline" className="text-xs">
                        {appointment.specialty}
                      </Badge>
                    </div>
                    <Badge variant={appointment.status === 'approved' ? 'default' : 'secondary'} className="animate-pulse-glow">
                      {appointment.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{appointment.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{appointment.time}</span>
                    </div>
                  </div>
                  {appointment.symptoms && (
                    <div className="bg-muted/50 p-2 rounded text-sm">
                      <strong>{t('symptoms')}:</strong> {appointment.symptoms}
                    </div>
                  )}
                  {appointment.status === 'approved' && (
                    <Button size="sm" variant="success" className="mt-2">
                      <Video className="h-3 w-3 mr-1" />
                      {t('joinVideoCall')}
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medicines" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>{t('medicineAvailability')}</CardTitle>
              <CardDescription>Check if medicines are available at nearby pharmacies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder={t('search') + " medicine name..."}
                  value={medicineSearch}
                  onChange={(e) => setMedicineSearch(e.target.value)}
                  className="flex-1 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
                <Button onClick={searchMedicine} variant="medical" className="hover:scale-105 transition-transform">
                  <Search className="h-4 w-4" />
                  {t('search')}
                </Button>
              </div>
              
              {/* Popular medicines */}
              <div>
                <h4 className="font-medium mb-2">Popular {t('medicines')}</h4>
                <div className="flex flex-wrap gap-2">
                  {['Paracetamol', 'Azithromycin', 'Cetirizine', 'Amoxicillin'].map((medicine) => (
                    <Button
                      key={medicine}
                      variant="outline"
                      size="sm"
                      onClick={() => setMedicineSearch(medicine)}
                      className="hover:scale-105 transition-transform"
                    >
                      {medicine}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Your {t('prescription')}s</CardTitle>
              <CardDescription>Active {t('prescription')}s from doctors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {patientPrescriptions.map((prescription) => (
                <div key={prescription.id} className="border border-border rounded-lg p-4 space-y-3 hover:shadow-card transition-shadow duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-primary" />
                      <span className="font-medium">{prescription.doctorName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={prescription.status === 'active' ? 'default' : 'secondary'}>
                        {prescription.status}
                      </Badge>
                      <Badge variant="outline">{prescription.date}</Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {prescription.medicines.map((medicine) => (
                      <div key={medicine.id} className="flex items-center space-x-2 text-sm p-2 bg-muted/30 rounded">
                        <Pill className="h-3 w-3 text-success" />
                        <span className="font-medium">{medicine.name}</span>
                        <span className="text-muted-foreground">
                          {medicine.dosage} - {medicine.frequency} for {medicine.duration}
                        </span>
                      </div>
                    ))}
                  </div>

                  {prescription.notes && (
                    <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                      Notes: {prescription.notes}
                    </p>
                  )}
                  
                  <div className="flex space-x-2 pt-2">
                    <Button size="sm" variant="outline">
                      <MapPin className="h-3 w-3 mr-1" />
                     {t('findPharmacy')}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="secondary"
                      onClick={() => handlePrescriptionExplanation(prescription)}
                    >
                      <FileText className="h-3 w-3 mr-1" />
                      Explain
                    </Button>
                    <Button size="sm" variant="success">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Mark as Taken
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* AI Chatbot */}
      <AIChatbot 
        isOpen={showChatbot}
        onClose={() => setShowChatbot(false)}
        context={{ userId: user?.id, userType: 'patient' }}
      />
    </div>
  );
};

export default PatientDashboard;