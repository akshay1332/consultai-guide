
export interface Profile {
  id: string;
  email: string;
  full_name: string;
  location: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface BasicInformation {
  id: string;
  user_id: string;
  date_of_birth: string;
  gender: string;
  height: number;
  weight: number;
  blood_type: string;
  allergies: string[];
  medical_conditions: string[];
  exercise_frequency?: string;
  dietary_preferences?: string[];
  emergency_contact: {
    name: string;
    phone: string;
    relationship: string;
  };
  updated_at: string;
}

export interface Assessment {
  id: string;
  user_id: string;
  title: string;
  description: string;
  results: any;
  status: string;
  created_at: string;
  completed_at: string | null;
}

export interface ChatSession {
  id: string;
  user_id: string;
  latitude: number;
  longitude: number;
  status: string;
  created_at: string;
  finished_at: string | null;
}

export interface Message {
  id: string;
  session_id: string;
  sender: string;
  message: string;
  timestamp: string;
  message_type: string;
}

export interface StoredReport {
  id: string;
  session_id: string;
  report_data: {
    estimatedCondition: string;
    symptomsAnalysis: string;
    diagnosis: string;
    treatment: string[];
    medications: Array<{
      name: string;
      dosage: string;
      duration: string;
      instructions: string;
    }>;
    recommendations: string[];
    precautions: string;
    followUp: string;
    dietPlan?: {
      meals: Array<{
        type: string;
        suggestions: string[];
        timing: string;
        portions: string;
        notes: string;
      }>;
      guidelines: string[];
      restrictions: string[];
      hydration: string;
      supplements: Array<{
        name: string;
        dosage: string;
        timing: string;
      }>;
      duration: string;
      specialInstructions: string;
    };
  };
  generated_at: string;
}
