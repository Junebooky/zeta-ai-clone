import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// 데이터베이스 타입 정의
export interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface ChatHistory {
  id: string
  user_id: string
  character_id: string
  message: string
  is_user: boolean
  created_at: string
}

export interface UserPreference {
  id: string
  user_id: string
  character_id: string
  interaction_count: number
  last_interaction: string
  is_favorite: boolean
} 