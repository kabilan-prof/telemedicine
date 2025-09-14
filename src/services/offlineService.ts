// Offline Service for handling poor connectivity and offline functionality
export class OfflineService {
  private static instance: OfflineService;
  private isOnline: boolean = navigator.onLine;
  private pendingActions: any[] = [];
  private retryQueue: any[] = [];

  static getInstance(): OfflineService {
    if (!OfflineService.instance) {
      OfflineService.instance = new OfflineService();
    }
    return OfflineService.instance;
  }

  constructor() {
    this.setupEventListeners();
    this.loadPendingActions();
  }

  private setupEventListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncPendingActions();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  // Cache data for offline access
  async cacheData(key: string, data: any): Promise<void> {
    try {
      localStorage.setItem(`offline_${key}`, JSON.stringify({
        data,
        timestamp: Date.now(),
        version: '1.0'
      }));
    } catch (error) {
      console.error('Cache Error:', error);
    }
  }

  // Retrieve cached data
  getCachedData(key: string): any {
    try {
      const cached = localStorage.getItem(`offline_${key}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        // Check if data is not too old (24 hours)
        if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
          return parsed.data;
        }
      }
      return null;
    } catch (error) {
      console.error('Cache Retrieval Error:', error);
      return null;
    }
  }

  // Queue action for when online
  queueAction(action: any): void {
    this.pendingActions.push({
      ...action,
      timestamp: Date.now(),
      id: Date.now().toString()
    });
    this.savePendingActions();
  }

  // Retry mechanism with exponential backoff
  async retryWithBackoff(fn: Function, maxRetries: number = 3): Promise<any> {
    let retries = 0;
    
    while (retries < maxRetries) {
      try {
        return await fn();
      } catch (error) {
        retries++;
        if (retries === maxRetries) throw error;
        
        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, retries) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // SMS fallback for notifications
  async sendSMSFallback(phoneNumber: string, message: string): Promise<boolean> {
    try {
      // In production, integrate with SMS service
      console.log(`SMS Fallback to ${phoneNumber}: ${message}`);
      
      // Simulate SMS sending
      return new Promise((resolve) => {
        setTimeout(() => resolve(true), 1000);
      });
    } catch (error) {
      console.error('SMS Fallback Error:', error);
      return false;
    }
  }

  // Voice booking fallback for illiterate users
  async initiateVoiceBooking(): Promise<void> {
    try {
      // In production, integrate with voice recognition service
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.lang = 'hi-IN'; // Hindi for rural areas
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          this.processVoiceCommand(transcript);
        };

        recognition.start();
      } else {
        throw new Error('Speech recognition not supported');
      }
    } catch (error) {
      console.error('Voice Booking Error:', error);
      // Fallback to phone call
      this.initiatePhoneBooking();
    }
  }

  // Auto-redirect for unavailable doctors
  async handleDoctorUnavailable(doctorId: string, patientId: string): Promise<string | null> {
    try {
      // Get alternative doctors
      const alternatives = await this.getAlternativeDoctors(doctorId);
      
      if (alternatives.length > 0) {
        const bestAlternative = alternatives[0];
        
        // Auto-redirect to best alternative
        await this.redirectToDoctor(patientId, bestAlternative.id);
        
        // Send notification
        await this.sendRedirectNotification(patientId, bestAlternative);
        
        return bestAlternative.id;
      }
      
      return null;
    } catch (error) {
      console.error('Doctor Redirect Error:', error);
      return null;
    }
  }

  // Alternative medicine suggestions
  async suggestAlternatives(medicineId: string): Promise<any[]> {
    try {
      const alternatives = this.getCachedData(`alternatives_${medicineId}`) || [];
      
      if (alternatives.length === 0) {
        // Fallback alternatives based on common substitutes
        return this.getCommonAlternatives(medicineId);
      }
      
      return alternatives;
    } catch (error) {
      console.error('Alternative Suggestion Error:', error);
      return [];
    }
  }

  private async syncPendingActions(): Promise<void> {
    if (!this.isOnline || this.pendingActions.length === 0) return;

    const actionsToSync = [...this.pendingActions];
    this.pendingActions = [];

    for (const action of actionsToSync) {
      try {
        await this.executeAction(action);
      } catch (error) {
        console.error('Sync Error:', error);
        // Re-queue failed actions
        this.pendingActions.push(action);
      }
    }

    this.savePendingActions();
  }

  private async executeAction(action: any): Promise<void> {
    switch (action.type) {
      case 'book_appointment':
        // Execute appointment booking
        break;
      case 'send_prescription':
        // Send prescription to pharmacy
        break;
      case 'update_inventory':
        // Update pharmacy inventory
        break;
      default:
        console.warn('Unknown action type:', action.type);
    }
  }

  private savePendingActions(): void {
    try {
      localStorage.setItem('pending_actions', JSON.stringify(this.pendingActions));
    } catch (error) {
      console.error('Save Pending Actions Error:', error);
    }
  }

  private loadPendingActions(): void {
    try {
      const saved = localStorage.getItem('pending_actions');
      if (saved) {
        this.pendingActions = JSON.parse(saved);
      }
    } catch (error) {
      console.error('Load Pending Actions Error:', error);
      this.pendingActions = [];
    }
  }

  private processVoiceCommand(transcript: string): void {
    // Process voice commands for booking
    console.log('Voice Command:', transcript);
    // In production, use NLP to understand intent
  }

  private initiatePhoneBooking(): void {
    // Fallback to phone call booking
    alert('Voice booking unavailable. Please call our helpline: 1800-XXX-XXXX');
  }

  private async getAlternativeDoctors(doctorId: string): Promise<any[]> {
    // Get doctors with similar specialization
    const cached = this.getCachedData('doctors') || [];
    return cached.filter((doc: any) => doc.id !== doctorId && doc.availability.isAvailable);
  }

  private async redirectToDoctor(patientId: string, newDoctorId: string): Promise<void> {
    // Implement redirect logic
    this.queueAction({
      type: 'redirect_patient',
      patientId,
      newDoctorId,
      timestamp: Date.now()
    });
  }

  private async sendRedirectNotification(patientId: string, doctor: any): Promise<void> {
    const message = `Your doctor is unavailable. You've been redirected to Dr. ${doctor.name}. New appointment time: ${doctor.nextAvailable}`;
    
    // Try app notification first, then SMS fallback
    try {
      // App notification logic here
    } catch (error) {
      await this.sendSMSFallback('patient_phone', message);
    }
  }

  private getCommonAlternatives(medicineId: string): any[] {
    const commonAlternatives: { [key: string]: any[] } = {
      'paracetamol': [
        { name: 'Ibuprofen', reason: 'Similar pain relief properties' },
        { name: 'Aspirin', reason: 'Alternative pain reliever' }
      ],
      'azithromycin': [
        { name: 'Amoxicillin', reason: 'Alternative antibiotic' },
        { name: 'Ciprofloxacin', reason: 'Broad spectrum antibiotic' }
      ]
    };

    return commonAlternatives[medicineId.toLowerCase()] || [];
  }

  // Check connectivity status
  isConnected(): boolean {
    return this.isOnline;
  }

  // Get network quality
  getNetworkQuality(): 'good' | 'poor' | 'offline' {
    if (!this.isOnline) return 'offline';
    
    // In production, check actual network speed
    const connection = (navigator as any).connection;
    if (connection) {
      if (connection.effectiveType === '4g') return 'good';
      if (connection.effectiveType === '3g') return 'poor';
    }
    
    return 'good'; // Default assumption
  }
}