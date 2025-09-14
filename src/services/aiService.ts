// AI Service for symptom checking and prescription explanation
export class AIService {
  private static instance: AIService;
  
  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  // AI Symptom Checker
  async analyzeSymptoms(symptoms: string[], patientAge: number, gender: string): Promise<any> {
    try {
      // Simulate AI analysis - in production, this would call actual AI service
      const conditions = this.getConditionsFromSymptoms(symptoms);
      const urgency = this.calculateUrgency(symptoms);
      
      return {
        symptoms,
        possibleConditions: conditions,
        urgencyLevel: urgency,
        suggestedSpecialist: this.getSuggestedSpecialist(conditions),
        recommendations: this.getRecommendations(urgency, conditions)
      };
    } catch (error) {
      console.error('AI Symptom Analysis Error:', error);
      return this.getFallbackAnalysis(symptoms);
    }
  }

  // AI Prescription Explainer
  async explainPrescription(prescription: any): Promise<string> {
    try {
      let explanation = "Here's what your prescription means:\n\n";
      
      prescription.medicines.forEach((medicine: any, index: number) => {
        explanation += `${index + 1}. **${medicine.name}** (${medicine.dosage})\n`;
        explanation += `   - Take ${medicine.frequency}\n`;
        explanation += `   - Duration: ${medicine.duration}\n`;
        explanation += `   - Purpose: ${this.getMedicinePurpose(medicine.name)}\n`;
        if (medicine.instructions) {
          explanation += `   - Instructions: ${medicine.instructions}\n`;
        }
        explanation += "\n";
      });

      if (prescription.notes) {
        explanation += `**Doctor's Notes:** ${prescription.notes}\n\n`;
      }

      explanation += "**Important Reminders:**\n";
      explanation += "- Take medicines as prescribed\n";
      explanation += "- Complete the full course even if you feel better\n";
      explanation += "- Contact your doctor if you experience side effects\n";

      return explanation;
    } catch (error) {
      console.error('Prescription Explanation Error:', error);
      return "Unable to explain prescription at the moment. Please consult your doctor for clarification.";
    }
  }

  // AI Chatbot Response
  async getChatbotResponse(message: string, context: any): Promise<string> {
    try {
      const lowerMessage = message.toLowerCase();
      
      // Health-related queries
      if (lowerMessage.includes('symptom') || lowerMessage.includes('pain') || lowerMessage.includes('fever')) {
        return "I understand you're experiencing symptoms. For proper medical advice, I recommend booking a consultation with one of our doctors. Would you like me to help you schedule an appointment?";
      }
      
      // Prescription queries
      if (lowerMessage.includes('medicine') || lowerMessage.includes('prescription') || lowerMessage.includes('dosage')) {
        return "For medication-related questions, please consult your prescribing doctor or pharmacist. I can help you find nearby pharmacies or explain your prescription if you'd like.";
      }
      
      // Appointment queries
      if (lowerMessage.includes('appointment') || lowerMessage.includes('book') || lowerMessage.includes('doctor')) {
        return "I can help you book an appointment! Please let me know your preferred date and time, or if you need an urgent consultation.";
      }
      
      // Emergency
      if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent') || lowerMessage.includes('serious')) {
        return "For medical emergencies, please call 108 immediately or visit the nearest hospital. If this is not an emergency, I can help you book an urgent consultation.";
      }
      
      return "I'm here to help with your healthcare needs. You can ask me about booking appointments, finding doctors, checking medicine availability, or general health information.";
    } catch (error) {
      console.error('Chatbot Response Error:', error);
      return "I'm having trouble processing your request right now. Please try again or contact our support team.";
    }
  }

  private getConditionsFromSymptoms(symptoms: string[]): any[] {
    // Simplified condition mapping - in production, use ML model
    const conditionMap: { [key: string]: any } = {
      'fever': { condition: 'Viral Infection', probability: 0.7, severity: 'medium' },
      'cough': { condition: 'Respiratory Infection', probability: 0.6, severity: 'medium' },
      'headache': { condition: 'Tension Headache', probability: 0.8, severity: 'low' },
      'bodyPain': { condition: 'Viral Fever', probability: 0.6, severity: 'medium' },
      'nausea': { condition: 'Gastroenteritis', probability: 0.5, severity: 'medium' },
      'fatigue': { condition: 'General Weakness', probability: 0.4, severity: 'low' }
    };

    return symptoms.map(symptom => 
      conditionMap[symptom] || { condition: 'Unknown', probability: 0.3, severity: 'low' }
    );
  }

  private calculateUrgency(symptoms: string[]): string {
    const emergencySymptoms = ['chest pain', 'difficulty breathing', 'severe headache'];
    const highSymptoms = ['high fever', 'severe pain', 'vomiting'];
    
    if (symptoms.some(s => emergencySymptoms.includes(s.toLowerCase()))) return 'emergency';
    if (symptoms.some(s => highSymptoms.includes(s.toLowerCase()))) return 'high';
    if (symptoms.length > 3) return 'medium';
    return 'low';
  }

  private getSuggestedSpecialist(conditions: any[]): string {
    // Simple specialist mapping
    const specialistMap: { [key: string]: string } = {
      'Respiratory Infection': 'Pulmonologist',
      'Gastroenteritis': 'Gastroenterologist',
      'Tension Headache': 'Neurologist'
    };

    const condition = conditions[0]?.condition;
    return specialistMap[condition] || 'General Physician';
  }

  private getRecommendations(urgency: string, conditions: any[]): string[] {
    const baseRecommendations = [
      'Stay hydrated',
      'Get adequate rest',
      'Monitor symptoms'
    ];

    if (urgency === 'emergency') {
      return ['Seek immediate medical attention', 'Call emergency services'];
    }

    if (urgency === 'high') {
      return ['Consult a doctor within 24 hours', ...baseRecommendations];
    }

    return [...baseRecommendations, 'Schedule a consultation if symptoms persist'];
  }

  private getFallbackAnalysis(symptoms: string[]): any {
    return {
      symptoms,
      possibleConditions: [{ condition: 'General Illness', probability: 0.5, severity: 'medium' }],
      urgencyLevel: 'medium',
      suggestedSpecialist: 'General Physician',
      recommendations: ['Consult a doctor for proper diagnosis']
    };
  }

  private getMedicinePurpose(medicineName: string): string {
    const purposeMap: { [key: string]: string } = {
      'Paracetamol': 'Pain relief and fever reduction',
      'Azithromycin': 'Antibiotic for bacterial infections',
      'Cetirizine': 'Antihistamine for allergies',
      'Amoxicillin': 'Antibiotic for bacterial infections',
      'Ibuprofen': 'Anti-inflammatory and pain relief'
    };

    return purposeMap[medicineName] || 'Consult your doctor for specific purpose';
  }
}