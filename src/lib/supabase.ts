import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cgrzhsfcfubbwschexub.supabase.co'
// 사용자 제공 anon key 사용
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNncnpoc2ZjZnViYndzY2hleHViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzMTQxMzAsImV4cCI6MjA2NTg5MDEzMH0.akEYkOjiiMtAUi2GgRxBAza7Vd9Hn4OKYLCyR-IBHS8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Supabase 연결 테스트 함수
export const testSupabaseConnection = async () => {
  try {
    console.log('Supabase 연결 테스트 시작...')
    console.log('Supabase URL:', supabaseUrl)
    console.log('Anon Key (일부):', supabaseAnonKey.substring(0, 20) + '...')
    
    const { data, error } = await supabase
      .from('characters')
      .select('count(*)', { count: 'exact' })
      .limit(1)

    if (error) {
      console.error('Supabase 연결 실패:', error)
      return false
    }

    console.log('Supabase 연결 성공! 캐릭터 테이블 존재 확인됨')
    return true
  } catch (error) {
    console.error('Supabase 연결 테스트 오류:', error)
    return false
  }
}

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