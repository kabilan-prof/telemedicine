export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  symptoms?: string;
  notes?: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  medicines: Medicine[];
  notes: string;
  date: string;
  status: 'active' | 'completed';
}

export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface MedicineStock {
  id: string;
  pharmacyId: string;
  name: string;
  stock: number;
  price: number;
  manufacturer: string;
  expiryDate: string;
}

export interface SymptomCheck {
  fever: boolean;
  cough: boolean;
  headache: boolean;
  bodyPain: boolean;
  nausea: boolean;
  fatigue: boolean;
  other: string;
}

export interface AnalyticsData {
  totalConsultations: number;
  weeklyConsultations: Array<{ day: string; count: number }>;
  topMedicines: Array<{ name: string; requests: number }>;
  fulfillmentRate: number;
  activePatients: number;
  activeDoctors: number;
  totalPharmacies: number;
}

export interface DoctorProfile {
  id: string;
  name: string;
  specialization: string;
  qualifications: string[];
  experience: number;
  rating: number;
  availability: {
    workingHours: { start: string; end: string };
    workingDays: string[];
    isAvailable: boolean;
    emergencyLeave: boolean;
  };
  consultationFee: number;
  languages: string[];
  location: string;
}

export interface HealthRecord {
  id: string;
  patientId: string;
  date: string;
  type: 'consultation' | 'prescription' | 'test' | 'vaccination';
  title: string;
  description: string;
  attachments?: string[];
  doctorId?: string;
  doctorName?: string;
}

export interface ConsultationSession {
  id: string;
  patientId: string;
  doctorId: string;
  type: 'video' | 'audio' | 'text';
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  scheduledTime: string;
  duration?: number;
  notes?: string;
  prescription?: Prescription;
  followUpRequired: boolean;
}

export interface AISymptomResult {
  symptoms: string[];
  possibleConditions: Array<{
    condition: string;
    probability: number;
    severity: 'low' | 'medium' | 'high' | 'emergency';
    recommendations: string[];
  }>;
  urgencyLevel: 'low' | 'medium' | 'high' | 'emergency';
  suggestedSpecialist?: string;
}

export interface PharmacyInventory extends MedicineStock {
  reorderLevel: number;
  supplier: string;
  lastRestocked: string;
  alternatives: string[];
}

export interface DeliveryOrder {
  id: string;
  prescriptionId: string;
  patientId: string;
  pharmacyId: string;
  medicines: Array<{
    medicineId: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  deliveryAddress: string;
  status: 'pending' | 'confirmed' | 'dispatched' | 'delivered' | 'cancelled';
  paymentMethod: 'online' | 'cod';
  estimatedDelivery: string;
}