import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
  availableLanguages: Language[];
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
];

const translations = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    appointments: 'Appointments',
    medicines: 'Medicines',
    reports: 'Reports',
    profile: 'Profile',
    logout: 'Logout',
    settings: 'Settings',
    
    // Authentication
    login: 'Login',
    register: 'Register',
    forgotPassword: 'Forgot Password',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    fullName: 'Full Name',
    phoneNumber: 'Phone Number',
    signIn: 'Sign In',
    demoAccess: 'Demo Access',
    
    // Dashboard
    welcome: 'Welcome',
    upcomingAppointments: 'Upcoming Appointments',
    recentReports: 'Recent Reports',
    bookConsultation: 'Book Consultation',
    patientDashboard: 'Patient Dashboard',
    doctorDashboard: 'Doctor Dashboard',
    pharmacyDashboard: 'Pharmacy Dashboard',
    adminDashboard: 'Admin Dashboard',
    yourHealth: 'Your health, our priority',
    providingCare: 'Providing care, saving lives',
    
    // Doctor types
    modernMedicine: 'Modern Medicine',
    countryMedicine: 'Country Medicine',
    generalMedicine: 'General Medicine',
    
    // Medical
    symptoms: 'Symptoms',
    prescription: 'Prescription',
    consultation: 'Consultation',
    videoCall: 'Video Call',
    audioCall: 'Audio Call',
    videoConsultation: 'Video Consultation',
    audioConsultation: 'Audio Consultation',
    startVideoCall: 'Start Video Call',
    startAudioCall: 'Start Audio Call',
    joinVideoCall: 'Join Video Call',
    joinAudioCall: 'Join Audio Call',
    
    // Common
    search: 'Search',
    filter: 'Filter',
    save: 'Save',
    cancel: 'Cancel',
    submit: 'Submit',
    loading: 'Loading...',
    language: 'Language',
    theme: 'Theme',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    systemMode: 'System Mode',
    
    // Telemedicine specific
    connectingRural: 'Connecting Rural Communities to Healthcare',
    teleMedRural: 'TeleMed Rural',
    bridgingHealthcare: 'Bridging Healthcare Gaps',
    emergency: 'Emergency',
    findPharmacy: 'Find Pharmacy',
    checkMedicine: 'Check Medicine',
    bookAppointment: 'Book Appointment',
    symptomChecker: 'Symptom Checker',
    healthStatus: 'Health Status',
    medicineAvailability: 'Medicine Availability',
  },
  // Add other language translations here (ta, hi, gu)
  // For brevity, I'm only including English in this conversion
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const setLanguage = async (language: string) => {
    setCurrentLanguage(language);
    await AsyncStorage.setItem('language', language);
  };

  const t = (key: string): string => {
    const translation = translations[currentLanguage as keyof typeof translations];
    return translation?.[key as keyof typeof translation] || key;
  };

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('language');
        if (savedLanguage) {
          setCurrentLanguage(savedLanguage);
        }
      } catch (error) {
        console.error('Error loading language:', error);
      }
    };
    loadLanguage();
  }, []);

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        t,
        availableLanguages: languages,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};