import React, { createContext, useContext, useState, useEffect } from 'react';

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
  ta: {
    // Navigation
    dashboard: 'டாஷ்போர்டு',
    appointments: 'சந்திப்புகள்',
    medicines: 'மருந்துகள்',
    reports: 'அறிக்கைகள்',
    profile: 'சுயவிவரம்',
    logout: 'வெளியேறு',
    settings: 'அமைப்புகள்',
    
    // Authentication
    login: 'உள்நுழைய',
    register: 'பதிவு செய்ய',
    forgotPassword: 'கடவுச்சொல்லை மறந்துவிட்டீர்களா',
    email: 'மின்னஞ்சல்',
    password: 'கடவுச்சொல்',
    confirmPassword: 'கடவுச்சொல்லை உறுதிப்படுத்தவும்',
    fullName: 'முழு பெயர்',
    phoneNumber: 'தொலைபேசி எண்',
    signIn: 'உள்நுழைய',
    demoAccess: 'டெமோ அணுகல்',
    
    // Dashboard
    welcome: 'வரவேற்கிறோம்',
    upcomingAppointments: 'வரவிருக்கும் சந்திப்புகள்',
    recentReports: 'சமீபத்திய அறிக்கைகள்',
    bookConsultation: 'ஆலோசனை பதிவு செய்யுங்கள்',
    patientDashboard: 'நோயாளி டாஷ்போர்டு',
    doctorDashboard: 'மருத்துவர் டாஷ்போர்டு',
    pharmacyDashboard: 'மருந்தகம் டாஷ்போர்டு',
    adminDashboard: 'நிர்வாக டாஷ்போர்டு',
    yourHealth: 'உங்கள் ஆரோக்கியம், எங்கள் முன்னுரிமை',
    providingCare: 'கவனிப்பு வழங்குதல், உயிர்களை காப்பாற்றுதல்',
    
    // Doctor types
    modernMedicine: 'நவீன மருத்துவம்',
    countryMedicine: 'நாட்டு மருத்துவம்',
    generalMedicine: 'பொது மருத்துவம்',
    
    // Medical
    symptoms: 'அறிகுறிகள்',
    prescription: 'மருந்து பரிந்துரை',
    consultation: 'ஆலோசனை',
    videoCall: 'வீடியோ அழைப்பு',
    audioCall: 'ஆடியோ அழைப்பு',
    videoConsultation: 'வீடியோ ஆலோசனை',
    audioConsultation: 'ஆடியோ ஆலோசனை',
    startVideoCall: 'வீடியோ அழைப்பை தொடங்கு',
    startAudioCall: 'ஆடியோ அழைப்பை தொடங்கு',
    joinVideoCall: 'வீடியோ அழைப்பில் சேர்',
    joinAudioCall: 'ஆடியோ அழைப்பில் சேர்',
    
    // Common
    search: 'தேடு',
    filter: 'வடிகட்டி',
    save: 'சேமி',
    cancel: 'ரத்து செய்',
    submit: 'சமர்ப்பி',
    loading: 'ஏற்றுகிறது...',
    language: 'மொழி',
    theme: 'தீம்',
    lightMode: 'ஒளி பயன்முறை',
    darkMode: 'இருள் பயன்முறை',
    systemMode: 'கணினி பயன்முறை',
    
    // Telemedicine specific
    connectingRural: 'கிராமப்புற சமூகங்களை சுகாதாரத்துடன் இணைத்தல்',
    teleMedRural: 'டெலிமெட் கிராமப்புறம்',
    bridgingHealthcare: 'சுகாதார இடைவெளிகளை நிரப்புதல்',
    emergency: 'அவசரநிலை',
    findPharmacy: 'மருந்தகம் கண்டறி',
    checkMedicine: 'மருந்து சரிபார்',
    bookAppointment: 'சந்திப்பு பதிவு செய்',
    symptomChecker: 'அறிகுறி சரிபார்ப்பான்',
    healthStatus: 'சுகாதார நிலை',
    medicineAvailability: 'மருந்து கிடைக்கும் தன்மை',
  },
  hi: {
    // Navigation
    dashboard: 'डैशबोर्ड',
    appointments: 'अपॉइंटमेंट्स',
    medicines: 'दवाइयां',
    reports: 'रिपोर्ट्स',
    profile: 'प्रोफाइल',
    logout: 'लॉगआउट',
    settings: 'सेटिंग्स',
    
    // Authentication
    login: 'लॉगिन',
    register: 'रजिस्टर',
    forgotPassword: 'पासवर्ड भूल गए',
    email: 'ईमेल',
    password: 'पासवर्ड',
    confirmPassword: 'पासवर्ड की पुष्टि करें',
    fullName: 'पूरा नाम',
    phoneNumber: 'फोन नंबर',
    signIn: 'साइन इन',
    demoAccess: 'डेमो एक्सेस',
    
    // Dashboard
    welcome: 'स्वागत है',
    upcomingAppointments: 'आगामी अपॉइंटमेंट्स',
    recentReports: 'हाल की रिपोर्ट्स',
    bookConsultation: 'परामर्श बुक करें',
    patientDashboard: 'मरीज़ डैशबोर्ड',
    doctorDashboard: 'डॉक्टर डैशबोर्ड',
    pharmacyDashboard: 'फार्मेसी डैशबोर्ड',
    adminDashboard: 'एडमिन डैशबोर्ड',
    yourHealth: 'आपका स्वास्थ्य, हमारी प्राथमिकता',
    providingCare: 'देखभाल प्रदान करना, जीवन बचाना',
    
    // Doctor types
    modernMedicine: 'आधुनिक चिकित्सा',
    countryMedicine: 'देशी चिकित्सा',
    generalMedicine: 'सामान्य चिकित्सा',
    
    // Medical
    symptoms: 'लक्षण',
    prescription: 'नुस्खा',
    consultation: 'परामर्श',
    videoCall: 'वीडियो कॉल',
    audioCall: 'ऑडियो कॉल',
    videoConsultation: 'वीडियो परामर्श',
    audioConsultation: 'ऑडियो परामर्श',
    startVideoCall: 'वीडियो कॉल शुरू करें',
    startAudioCall: 'ऑडियो कॉल शुरू करें',
    joinVideoCall: 'वीडियो कॉल में शामिल हों',
    joinAudioCall: 'ऑडियो कॉल में शामिल हों',
    
    // Common
    search: 'खोजें',
    filter: 'फिल्टर',
    save: 'सेव करें',
    cancel: 'रद्द करें',
    submit: 'सबमिट करें',
    loading: 'लोड हो रहा है...',
    language: 'भाषा',
    theme: 'थीम',
    lightMode: 'लाइट मोड',
    darkMode: 'डार्क मोड',
    systemMode: 'सिस्टम मोड',
    
    // Telemedicine specific
    connectingRural: 'ग्रामीण समुदायों को स्वास्थ्य सेवा से जोड़ना',
    teleMedRural: 'टेलीमेड रूरल',
    bridgingHealthcare: 'स्वास्थ्य सेवा की खाई को पाटना',
    emergency: 'आपातकाल',
    findPharmacy: 'फार्मेसी खोजें',
    checkMedicine: 'दवा जांचें',
    bookAppointment: 'अपॉइंटमेंट बुक करें',
    symptomChecker: 'लक्षण जांचकर्ता',
    healthStatus: 'स्वास्थ्य स्थिति',
    medicineAvailability: 'दवा की उपलब्धता',
  },
  gu: {
    // Navigation
    dashboard: 'ડેશબોર્ડ',
    appointments: 'મુલાકાતો',
    medicines: 'દવાઓ',
    reports: 'રિપોર્ટ્સ',
    profile: 'પ્રોફાઇલ',
    logout: 'લૉગઆઉટ',
    settings: 'સેટિંગ્સ',
    
    // Authentication
    login: 'લૉગિન',
    register: 'નોંધણી',
    forgotPassword: 'પાસવર્ડ ભૂલી ગયા',
    email: 'ઇમેઇલ',
    password: 'પાસવર્ડ',
    confirmPassword: 'પાસવર્ડની પુષ્ટિ કરો',
    fullName: 'પૂરું નામ',
    phoneNumber: 'ફોન નંબર',
    signIn: 'સાઇન ઇન',
    demoAccess: 'ડેમો એક્સેસ',
    
    // Dashboard
    welcome: 'સ્વાગત છે',
    upcomingAppointments: 'આગામી મુલાકાતો',
    recentReports: 'તાજેતરની રિપોર્ટ્સ',
    bookConsultation: 'સલાહ બુક કરો',
    patientDashboard: 'દર્દી ડેશબોર્ડ',
    doctorDashboard: 'ડૉક્ટર ડેશબોર્ડ',
    pharmacyDashboard: 'ફાર્મસી ડેશબોર્ડ',
    adminDashboard: 'એડમિન ડેશબોર્ડ',
    yourHealth: 'તમારું સ્વાસ્થ્ય, અમારી પ્રાથમિકતા',
    providingCare: 'સંભાળ પૂરી પાડવી, જીવન બચાવવું',
    
    // Doctor types
    modernMedicine: 'આધુનિક દવા',
    countryMedicine: 'દેશી દવા',
    generalMedicine: 'સામાન્ય દવા',
    
    // Medical
    symptoms: 'લક્ષણો',
    prescription: 'પ્રિસ્ક્રિપ્શન',
    consultation: 'સલાહ',
    videoCall: 'વિડિયો કૉલ',
    audioCall: 'ઑડિયો કૉલ',
    videoConsultation: 'વિડિયો સલાહ',
    audioConsultation: 'ઑડિયો સલાહ',
    startVideoCall: 'વિડિયો કૉલ શરૂ કરો',
    startAudioCall: 'ઑડિયો કૉલ શરૂ કરો',
    joinVideoCall: 'વિડિયો કૉલમાં જોડાઓ',
    joinAudioCall: 'ઑડિયો કૉલમાં જોડાઓ',
    
    // Common
    search: 'શોધો',
    filter: 'ફિલ્ટર',
    save: 'સેવ કરો',
    cancel: 'રદ કરો',
    submit: 'સબમિટ કરો',
    loading: 'લોડ થઈ રહ્યું છે...',
    language: 'ભાષા',
    theme: 'થીમ',
    lightMode: 'લાઇટ મોડ',
    darkMode: 'ડાર્ક મોડ',
    systemMode: 'સિસ્ટમ મોડ',
    
    // Telemedicine specific
    connectingRural: 'ગ્રામીણ સમુદાયોને આરોગ્યસેવા સાથે જોડવું',
    teleMedRural: 'ટેલીમેડ રૂરલ',
    bridgingHealthcare: 'આરોગ્યસેવાના અંતરને પાટવું',
    emergency: 'કટોકટી',
    findPharmacy: 'ફાર્મસી શોધો',
    checkMedicine: 'દવા તપાસો',
    bookAppointment: 'મુલાકાત બુક કરો',
    symptomChecker: 'લક્ષણ તપાસનાર',
    healthStatus: 'આરોગ્ય સ્થિતિ',
    medicineAvailability: 'દવાની ઉપલબ્ધતા',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  const setLanguage = (language: string) => {
    setCurrentLanguage(language);
    localStorage.setItem('language', language);
  };

  const t = (key: string): string => {
    const translation = translations[currentLanguage as keyof typeof translations];
    return translation?.[key as keyof typeof translation] || key;
  };

  useEffect(() => {
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

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