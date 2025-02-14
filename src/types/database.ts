export interface Profile {
  id: string;
  email: string;
  full_name: string;
  location: string;
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
  allergies: string;
  medical_conditions: string;
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

export interface Report {
  id: string;
  session_id: string;
  report_data: any;
  generated_at: string;
} 