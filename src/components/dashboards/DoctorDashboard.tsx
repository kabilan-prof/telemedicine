import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Calendar, Clock, User, FileText, Video, CheckCircle, XCircle, Users, Stethoscope, Award, TrendingUp, MessageSquare, Phone } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { mockAppointments } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import AISymptomChecker from '@/components/common/AISymptomChecker';
import AIChatbot from '@/components/common/AIChatbot';
import OfflineIndicator from '@/components/common/OfflineIndicator';
import { OfflineService } from '@/services/offlineService';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [showChatbot, setShowChatbot] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [prescriptionForm, setPrescriptionForm] = useState({
    patientId: '',
    medicines: '',
    notes: ''
  });

  const doctorAppointments = mockAppointments.filter(apt => apt.doctorId === user?.id);
  const pendingCount = doctorAppointments.filter(apt => apt.status === 'pending').length;
  const approvedCount = doctorAppointments.filter(apt => apt.status === 'approved').length;
  const offlineService = OfflineService.getInstance();

  const handleApproveAppointment = (appointmentId: string) => {
    if (!offlineService.isConnected()) {
      offlineService.queueAction({
        type: 'approve_appointment',
        appointmentId,
        doctorId: user?.id
      });
    }
    
    toast({
      title: "Appointment Approved",
      description: "Patient has been notified about the approved appointment.",
    });
  };

  const handleRejectAppointment = (appointmentId: string) => {
    toast({
      title: "Appointment Rejected",
      description: "Patient has been notified. Please suggest alternative dates if possible.",
      variant: "destructive"
    });
  };

  const handleAddPrescription = () => {
    if (!prescriptionForm.medicines.trim()) {
      toast({
        title: "Error",
        description: "Please add medicines to the prescription.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Prescription Added",
      description: "Prescription has been saved and patient has been notified.",
    });

    setPrescriptionForm({ patientId: '', medicines: '', notes: '' });
  };

  const startVideoCall = (appointmentId: string) => {
    toast({
      title: "Video Call Started",
      description: "Connecting to patient... This is a demo simulation.",
    });
  };

  const handleAutoRedirect = async (appointmentId: string) => {
    try {
      const alternativeDoctor = await offlineService.handleDoctorUnavailable(user?.id || '', appointmentId);
      if (alternativeDoctor) {
        toast({
          title: "Patient Redirected",
          description: `Patient has been redirected to an available doctor.`,
        });
      } else {
        toast({
          title: "No Alternative Found",
          description: "No alternative doctors available. Patient will be notified.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Redirect Failed",
        description: "Unable to redirect patient. Please handle manually.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <OfflineIndicator />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('doctorDashboard')}</h1>
          <p className="text-muted-foreground mt-1">{t('providingCare')}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-primary">
            <Stethoscope className="h-3 w-3 mr-1" />
            Dr. {user?.name}
          </Badge>
          <Badge variant="outline" className="text-success">
            <Award className="h-3 w-3 mr-1" />
            Verified
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowChatbot(true)}
            className="flex items-center space-x-1"
          >
            <MessageSquare className="h-3 w-3" />
            <span>AI Assistant</span>
          </Button>
        </div>
      </div>

      {/* Doctor Status Banner */}
      <Card className="shadow-medical bg-gradient-primary text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Status: Available for {t('consultation')}s</h3>
              <p className="text-white/80">Specialization: {user?.specialization}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="w-3 h-3 bg-success rounded-full mx-auto mb-1"></div>
                <div className="text-sm">Online</div>
              </div>
              <div className="text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-1" />
                <div className="text-sm">High Rating</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="appointments">{t('appointments')}</TabsTrigger>
          <TabsTrigger value="prescriptions">{t('prescription')}s</TabsTrigger>
          <TabsTrigger value="consultations">{t('consultation')}s</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="shadow-card hover:shadow-medical transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">{pendingCount}</div>
                <p className="text-xs text-muted-foreground">Awaiting approval</p>
                <div className="mt-2">
                  <div className="flex items-center text-xs text-warning">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Avg response: 15 min</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-medical transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{approvedCount}</div>
                <p className="text-xs text-muted-foreground">Scheduled for today</p>
                <div className="mt-2">
                  <div className="flex items-center text-xs text-primary">
                    <Video className="h-3 w-3 mr-1" />
                    <span>Next: 10:00 AM</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-medical transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">156</div>
                <p className="text-xs text-muted-foreground">This month</p>
                <div className="mt-2">
                  <div className="flex items-center text-xs text-success">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span>+12% growth</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-medical transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Consultations</CardTitle>
                <Video className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emergency">89</div>
                <p className="text-xs text-muted-foreground">Completed this week</p>
                <div className="mt-2">
                  <div className="flex items-center text-xs text-emergency">
                    <Award className="h-3 w-3 mr-1" />
                    <span>4.9/5 rating</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks for doctors</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-4 gap-4">
              <Button variant="medical" className="h-20 flex-col space-y-2 hover:scale-105 transition-transform">
                <CheckCircle className="h-6 w-6" />
                <span>Approve {t('appointments')}</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2 hover:scale-105 transition-transform">
                <FileText className="h-6 w-6" />
                <span>Write {t('prescription')}</span>
              </Button>
              <Button variant="success" className="h-20 flex-col space-y-2 hover:scale-105 transition-transform">
                <Video className="h-6 w-6" />
                <span>{t('startVideoCall')}</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2 hover:scale-105 transition-transform"
                onClick={() => setShowAIAssistant(true)}
              >
                <Brain className="h-6 w-6" />
                <span>AI Assistant</span>
              </Button>
              <Button variant="secondary" className="h-20 flex-col space-y-2 hover:scale-105 transition-transform">
                <Phone className="h-6 w-6" />
                <span>{t('startAudioCall')}</span>
              </Button>
            </CardContent>
          </Card>
          
          {/* Performance Metrics */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Your practice statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-success">4.9/5</div>
                  <div className="text-sm text-muted-foreground">Patient Rating</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">98%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-warning">15 min</div>
                  <div className="text-sm text-muted-foreground">Avg Response</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-emergency">245</div>
                  <div className="text-sm text-muted-foreground">Lives Helped</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>{t('appointments')} Requests</CardTitle>
              <CardDescription>Manage patient appointment requests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {doctorAppointments.map((appointment) => (
                <div key={appointment.id} className="border border-border rounded-lg p-4 space-y-3 hover:shadow-card transition-shadow duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-success" />
                      <span className="font-medium">{appointment.patientName}</span>
                      <Badge variant="outline" className="text-xs">
                        New Patient
                      </Badge>
                    </div>
                    <Badge variant={
                      appointment.status === 'pending' ? 'secondary' :
                      appointment.status === 'approved' ? 'default' : 'outline'
                    } className="animate-pulse-glow">
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
                    <div className="bg-muted/50 p-3 rounded text-sm border-l-4 border-primary">
                      <strong>{t('symptoms')}:</strong> {appointment.symptoms}
                    </div>
                  )}

                  {appointment.status === 'pending' && (
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="success"
                        className="hover:scale-105 transition-transform"
                        onClick={() => handleApproveAppointment(appointment.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        className="hover:scale-105 transition-transform"
                        onClick={() => handleRejectAppointment(appointment.id)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleAutoRedirect(appointment.id)}
                      >
                        Auto-Redirect
                      </Button>
                    </div>
                  )}

                  {appointment.status === 'approved' && (
                    <Button 
                      size="sm" 
                      variant="medical"
                      className="hover:scale-105 transition-transform"
                      onClick={() => startVideoCall(appointment.id)}
                    >
                      <Video className="h-4 w-4 mr-1" />
                      {t('startVideoCall')}
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prescriptions" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Add {t('prescription')}</CardTitle>
              <CardDescription>Create {t('prescription')} for your patients</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Patient</label>
                <Input
                  placeholder="Enter patient name or ID"
                  value={prescriptionForm.patientId}
                  onChange={(e) => setPrescriptionForm(prev => ({ ...prev, patientId: e.target.value }))}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('medicines')}</label>
                <Textarea
                  placeholder="e.g., Paracetamol 500mg - Twice daily for 5 days"
                  value={prescriptionForm.medicines}
                  onChange={(e) => setPrescriptionForm(prev => ({ ...prev, medicines: e.target.value }))}
                  rows={4}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Additional Notes</label>
                <Textarea
                  placeholder="Any additional instructions for the patient"
                  value={prescriptionForm.notes}
                  onChange={(e) => setPrescriptionForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <Button onClick={handleAddPrescription} variant="medical" className="w-full hover:scale-105 transition-transform">
                <FileText className="h-4 w-4 mr-2" />
                Add {t('prescription')}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consultations" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>{t('videoConsultation')}s</CardTitle>
              <CardDescription>Manage your remote consultations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-border rounded-lg p-4 space-y-2 hover:shadow-card transition-shadow">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                    <span className="font-medium">Available for {t('consultation')}s</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Patients can book video/audio calls with you
                  </p>
                  <Button variant="outline" size="sm" className="hover:scale-105 transition-transform">
                    Go Offline
                  </Button>
                </div>

                <div className="border border-border rounded-lg p-4 space-y-2 hover:shadow-card transition-shadow">
                  <div className="text-lg font-semibold">Next Consultation</div>
                  <div className="text-sm text-muted-foreground">
                    Krishna - 10:00 AM Today
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="medical" size="sm" className="hover:scale-105 transition-transform">
                      <Video className="h-4 w-4 mr-1" />
                      {t('joinVideoCall')}
                    </Button>
                    <Button variant="outline" size="sm" className="hover:scale-105 transition-transform">
                      <Phone className="h-4 w-4 mr-1" />
                      {t('joinAudioCall')}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-subtle p-4 rounded-lg border border-border">
                <h4 className="font-medium mb-2">Demo Video/Audio Call Features</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• High-quality video and audio</li>
                  <li>• Audio-only consultation option</li>
                  <li>• Screen sharing for medical reports</li>
                  <li>• Recording for medical records</li>
                  <li>• Secure, HIPAA-compliant platform</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* AI Symptom Assistant for Doctors */}
      {showAIAssistant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">AI Diagnostic Assistant</h3>
              <Button variant="ghost" onClick={() => setShowAIAssistant(false)}>×</Button>
            </div>
            <AISymptomChecker 
              onRecommendation={(recommendation) => {
                console.log('AI Recommendation for Doctor:', recommendation);
              }}
            />
          </div>
        </div>
      )}
      
      {/* AI Chatbot */}
      <AIChatbot 
        isOpen={showChatbot}
        onClose={() => setShowChatbot(false)}
        context={{ userId: user?.id, userType: 'doctor' }}
      />
    </div>
  );
};

export default DoctorDashboard;