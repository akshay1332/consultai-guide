export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      basic_information: {
        Row: {
          id: string;
          user_id: string;
          date_of_birth: string;
          gender: string;
          height: number;
          weight: number;
          blood_type: string;
          allergies: string[];
          medical_conditions: string[];
          emergency_contact: {
            name: string;
            phone: string;
            relationship: string;
          };
          lifestyle_habits: {
            smoking: boolean;
            alcohol: string;
            exercise: string;
            diet: string[];
          };
          family_history: Array<{
            condition: string;
            relation: string;
          }>;
          vaccination_history: Array<{
            name: string;
            date: string;
          }>;
          preferred_language: string;
          occupation: string;
          marital_status: string;
          exercise_frequency: string;
          dietary_preferences: string[];
          last_physical_exam: string;
          blood_pressure: {
            systolic: number;
            diastolic: number;
            last_checked: string;
          };
          insurance_info: {
            provider: string;
            policy_number: string;
            group_number: string;
          };
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date_of_birth: string;
          gender: string;
          height: number;
          weight: number;
          blood_type: string;
          allergies: string[];
          medical_conditions: string[];
          emergency_contact: {
            name: string;
            phone: string;
            relationship: string;
          };
          lifestyle_habits: {
            smoking: boolean;
            alcohol: string;
            exercise: string;
            diet: string[];
          };
          family_history: Array<{
            condition: string;
            relation: string;
          }>;
          vaccination_history: Array<{
            name: string;
            date: string;
          }>;
          preferred_language: string;
          occupation: string;
          marital_status: string;
          exercise_frequency: string;
          dietary_preferences: string[];
          last_physical_exam: string;
          blood_pressure: {
            systolic: number;
            diastolic: number;
            last_checked: string;
          };
          insurance_info: {
            provider: string;
            policy_number: string;
            group_number: string;
          };
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date_of_birth?: string;
          gender?: string;
          height?: number;
          weight?: number;
          blood_type?: string;
          allergies?: string[];
          medical_conditions?: string[];
          emergency_contact?: {
            name: string;
            phone: string;
            relationship: string;
          };
          lifestyle_habits?: {
            smoking: boolean;
            alcohol: string;
            exercise: string;
            diet: string[];
          };
          family_history?: Array<{
            condition: string;
            relation: string;
          }>;
          vaccination_history?: Array<{
            name: string;
            date: string;
          }>;
          preferred_language?: string;
          occupation?: string;
          marital_status?: string;
          exercise_frequency?: string;
          dietary_preferences?: string[];
          last_physical_exam?: string;
          blood_pressure?: {
            systolic: number;
            diastolic: number;
            last_checked: string;
          };
          insurance_info?: {
            provider: string;
            policy_number: string;
            group_number: string;
          };
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
} 