export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      assessments: {
        Row: {
          completed_at: string | null
          created_at: string | null
          description: string | null
          id: string
          results: Json | null
          status: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          results?: Json | null
          status?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          results?: Json | null
          status?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assessments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      basic_information: {
        Row: {
          allergies: string[] | null
          blood_pressure: Json | null
          blood_type: string | null
          date_of_birth: string | null
          dietary_preferences: string[] | null
          emergency_contact: Json | null
          exercise_frequency: string | null
          family_history: Json | null
          gender: string | null
          height: number | null
          id: string
          insurance_info: Json | null
          last_physical_exam: string | null
          lifestyle_habits: Json | null
          marital_status: string | null
          medical_conditions: string[] | null
          occupation: string | null
          preferred_language: string | null
          updated_at: string | null
          user_id: string | null
          vaccination_history: Json | null
          weight: number | null
        }
        Insert: {
          allergies?: string[] | null
          blood_pressure?: Json | null
          blood_type?: string | null
          date_of_birth?: string | null
          dietary_preferences?: string[] | null
          emergency_contact?: Json | null
          exercise_frequency?: string | null
          family_history?: Json | null
          gender?: string | null
          height?: number | null
          id?: string
          insurance_info?: Json | null
          last_physical_exam?: string | null
          lifestyle_habits?: Json | null
          marital_status?: string | null
          medical_conditions?: string[] | null
          occupation?: string | null
          preferred_language?: string | null
          updated_at?: string | null
          user_id?: string | null
          vaccination_history?: Json | null
          weight?: number | null
        }
        Update: {
          allergies?: string[] | null
          blood_pressure?: Json | null
          blood_type?: string | null
          date_of_birth?: string | null
          dietary_preferences?: string[] | null
          emergency_contact?: Json | null
          exercise_frequency?: string | null
          family_history?: Json | null
          gender?: string | null
          height?: number | null
          id?: string
          insurance_info?: Json | null
          last_physical_exam?: string | null
          lifestyle_habits?: Json | null
          marital_status?: string | null
          medical_conditions?: string[] | null
          occupation?: string | null
          preferred_language?: string | null
          updated_at?: string | null
          user_id?: string | null
          vaccination_history?: Json | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "basic_information_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          created_at: string | null
          finished_at: string | null
          id: string
          latitude: number | null
          longitude: number | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          finished_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          finished_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      diet_plans: {
        Row: {
          created_at: string
          diet_data: Json
          id: string
          report_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          diet_data: Json
          id?: string
          report_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          diet_data?: Json
          id?: string
          report_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "diet_plans_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          id: string
          message: string
          message_type: string | null
          sender: string | null
          session_id: string | null
          timestamp: string | null
        }
        Insert: {
          id?: string
          message: string
          message_type?: string | null
          sender?: string | null
          session_id?: string | null
          timestamp?: string | null
        }
        Update: {
          id?: string
          message?: string
          message_type?: string | null
          sender?: string | null
          session_id?: string | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          location: Json | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          location?: Json | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          location?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          generated_at: string
          id: string
          report_data: Json
          session_id: string
        }
        Insert: {
          generated_at?: string
          id?: string
          report_data: Json
          session_id: string
        }
        Update: {
          generated_at?: string
          id?: string
          report_data?: Json
          session_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
