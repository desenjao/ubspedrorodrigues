import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      patients: {
        Row: {
          id: string
          full_name: string
          cpf: string
          sus_card: string | null
          birth_date: string
          gender: string
          address: string
          phone: string
          mother_name: string
          profession: string | null
          education: string | null
          record_number: string | null
          is_pregnant: boolean
          is_hypertensive: boolean
          is_diabetic: boolean
          other_groups: string | null
          observations: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name: string
          cpf: string
          sus_card?: string | null
          birth_date: string
          gender: string
          address: string
          phone: string
          mother_name: string
          profession?: string | null
          education?: string | null
          record_number?: string | null
          is_pregnant?: boolean
          is_hypertensive?: boolean
          is_diabetic?: boolean
          other_groups?: string | null
          observations?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          cpf?: string
          sus_card?: string | null
          birth_date?: string
          gender?: string
          address?: string
          phone?: string
          mother_name?: string
          profession?: string | null
          education?: string | null
          record_number?: string | null
          is_pregnant?: boolean
          is_hypertensive?: boolean
          is_diabetic?: boolean
          other_groups?: string | null
          observations?: string | null
          updated_at?: string
        }
      }
      exams: {
        Row: {
          id: string
          patient_id: string
          exam_type: string
          scheduled_date: string
          status: string
          result_url: string | null
          result_text: string | null
          observations: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          exam_type: string
          scheduled_date: string
          status: string
          result_url?: string | null
          result_text?: string | null
          observations?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          exam_type?: string
          scheduled_date?: string
          status?: string
          result_url?: string | null
          result_text?: string | null
          observations?: string | null
          updated_at?: string
        }
      }
      pregnancy_monitoring: {
        Row: {
          id: string
          patient_id: string
          last_period_date: string
          expected_birth_date: string
          pregnancy_number: number
          risk_classification: string
          first_appointment_date: string | null
          has_pregnancy_card: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          last_period_date: string
          expected_birth_date: string
          pregnancy_number: number
          risk_classification: string
          first_appointment_date?: string | null
          has_pregnancy_card?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          last_period_date?: string
          expected_birth_date?: string
          pregnancy_number?: number
          risk_classification?: string
          first_appointment_date?: string | null
          has_pregnancy_card?: boolean
          updated_at?: string
        }
      }
      pregnancy_exams: {
        Row: {
          id: string
          pregnancy_id: string
          exam_id: string
          is_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          pregnancy_id: string
          exam_id: string
          is_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          pregnancy_id?: string
          exam_id?: string
          is_completed?: boolean
          updated_at?: string
        }
      }
      chronic_monitoring: {
        Row: {
          id: string
          patient_id: string
          condition_type: string
          medications: string | null
          treatment_adherence: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          condition_type: string
          medications?: string | null
          treatment_adherence?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          condition_type?: string
          medications?: string | null
          treatment_adherence?: string
          updated_at?: string
        }
      }
      blood_pressure_records: {
        Row: {
          id: string
          chronic_monitoring_id: string
          measurement_date: string
          systolic: number
          diastolic: number
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          chronic_monitoring_id: string
          measurement_date: string
          systolic: number
          diastolic: number
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          chronic_monitoring_id?: string
          measurement_date?: string
          systolic?: number
          diastolic?: number
          notes?: string | null
        }
      }
      glucose_records: {
        Row: {
          id: string
          chronic_monitoring_id: string
          measurement_date: string
          glucose_level: number
          measurement_type: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          chronic_monitoring_id: string
          measurement_date: string
          glucose_level: number
          measurement_type: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          chronic_monitoring_id?: string
          measurement_date?: string
          glucose_level?: number
          measurement_type?: string
          notes?: string | null
        }
      }
      appointments: {
        Row: {
          id: string
          patient_id: string
          appointment_date: string
          appointment_type: string
          professional: string
          notes: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          appointment_date: string
          appointment_type: string
          professional: string
          notes?: string | null
          status: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          appointment_date?: string
          appointment_type?: string
          professional?: string
          notes?: string | null
          status?: string
          updated_at?: string
        }
      }
    }
  }
}
