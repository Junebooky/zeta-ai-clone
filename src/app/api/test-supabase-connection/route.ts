import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// 타입 정의
interface TestResult {
  env_check: {
    supabase_url: string
    anon_key_exists: boolean
    service_role_key_exists: boolean
  }
  database_test: {
    success: boolean
    error?: string
    details?: any
    exception?: boolean
    character_count?: number
    sample_data?: any[]
  } | null
  storage_test: {
    anon_key?: {
      success: boolean
      error?: string
      details?: any
      exception?: boolean
      bucket_count?: number
      buckets?: any[]
    }
    service_role?: {
      success: boolean
      error?: string
      details?: any
      exception?: boolean
      bucket_count?: number
      buckets?: any[]
    }
  } | null
  error_details: string[]
}

export async function GET() {
  try {
    console.log('=== Supabase 연결 진단 시작 ===')
    
    // 환경 변수 확인
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cgrzhsfcfubbwschexub.supabase.co'
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNncnpoc2ZjZnViYndzY2hleHViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzMTQxMzAsImV4cCI6MjA2NTg5MDEzMH0.akEYkOjiiMtAUi2GgRxBAza7Vd9Hn4OKYLCyR-IBHS8'
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    console.log('1. 환경 변수 확인:')
    console.log('- Supabase URL:', supabaseUrl)
    console.log('- Anon Key (일부):', supabaseAnonKey.substring(0, 30) + '...')
    console.log('- Service Role Key 존재:', !!serviceRoleKey)
    
    const results: TestResult = {
      env_check: {
        supabase_url: supabaseUrl,
        anon_key_exists: !!supabaseAnonKey,
        service_role_key_exists: !!serviceRoleKey
      },
      database_test: null,
      storage_test: null,
      error_details: []
    }
    
    // 2. 데이터베이스 연결 테스트
    console.log('2. 데이터베이스 연결 테스트...')
    try {
      const { data: dbData, error: dbError } = await supabase
        .from('characters')
        .select('id, name')
        .limit(3)
      
      if (dbError) {
        console.error('데이터베이스 테스트 실패:', dbError)
        results.database_test = {
          success: false,
          error: dbError.message,
          details: dbError
        }
        results.error_details.push(`DB Error: ${dbError.message}`)
      } else {
        console.log('데이터베이스 연결 성공, 캐릭터 수:', dbData?.length || 0)
        results.database_test = {
          success: true,
          character_count: dbData?.length || 0,
          sample_data: dbData
        }
      }
    } catch (dbEx) {
      console.error('데이터베이스 연결 예외:', dbEx)
      results.database_test = {
        success: false,
        error: dbEx instanceof Error ? dbEx.message : 'Unknown error',
        exception: true
      }
      results.error_details.push(`DB Exception: ${dbEx instanceof Error ? dbEx.message : 'Unknown'}`)
    }
    
    // 3. Storage 연결 테스트 (Anon Key로)
    console.log('3. Storage 연결 테스트 (Anon Key)...')
    try {
      const { data: buckets, error: storageError } = await supabase.storage.listBuckets()
      
      if (storageError) {
        console.error('Storage 테스트 실패 (Anon):', storageError)
        results.storage_test = {
          anon_key: {
            success: false,
            error: storageError.message,
            details: storageError
          }
        }
        results.error_details.push(`Storage (Anon) Error: ${storageError.message}`)
      } else {
        console.log('Storage 연결 성공 (Anon), 버킷 수:', buckets?.length || 0)
        results.storage_test = {
          anon_key: {
            success: true,
            bucket_count: buckets?.length || 0,
            buckets: buckets?.map((b: any) => ({ id: b.id, name: b.name, public: b.public }))
          }
        }
      }
    } catch (storageEx) {
      console.error('Storage 연결 예외 (Anon):', storageEx)
      results.storage_test = {
        anon_key: {
          success: false,
          error: storageEx instanceof Error ? storageEx.message : 'Unknown error',
          exception: true
        }
      }
      results.error_details.push(`Storage (Anon) Exception: ${storageEx instanceof Error ? storageEx.message : 'Unknown'}`)
    }
    
    // 4. Service Role Key로 Storage 테스트 (있는 경우)
    if (serviceRoleKey) {
      console.log('4. Storage 연결 테스트 (Service Role Key)...')
      try {
        const { createClient } = require('@supabase/supabase-js')
        const serviceSupabase = createClient(supabaseUrl, serviceRoleKey)
        
        const { data: serviceBuckets, error: serviceStorageError } = await serviceSupabase.storage.listBuckets()
        
        if (serviceStorageError) {
          console.error('Storage 테스트 실패 (Service):', serviceStorageError)
          if (!results.storage_test) results.storage_test = {}
          results.storage_test.service_role = {
            success: false,
            error: serviceStorageError.message,
            details: serviceStorageError
          }
          results.error_details.push(`Storage (Service) Error: ${serviceStorageError.message}`)
        } else {
          console.log('Storage 연결 성공 (Service), 버킷 수:', serviceBuckets?.length || 0)
          if (!results.storage_test) results.storage_test = {}
          results.storage_test.service_role = {
            success: true,
            bucket_count: serviceBuckets?.length || 0,
            buckets: serviceBuckets?.map((b: any) => ({ id: b.id, name: b.name, public: b.public }))
          }
        }
      } catch (serviceEx) {
        console.error('Storage 연결 예외 (Service):', serviceEx)
        if (!results.storage_test) results.storage_test = {}
        results.storage_test.service_role = {
          success: false,
          error: serviceEx instanceof Error ? serviceEx.message : 'Unknown error',
          exception: true
        }
        results.error_details.push(`Storage (Service) Exception: ${serviceEx instanceof Error ? serviceEx.message : 'Unknown'}`)
      }
    }
    
    console.log('=== 진단 완료 ===')
    console.log('결과:', JSON.stringify(results, null, 2))
    
    return NextResponse.json({
      success: true,
      message: 'Supabase 연결 진단 완료',
      results,
      recommendations: generateRecommendations(results)
    })
    
  } catch (error) {
    console.error('=== 진단 중 전체 오류 ===', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Supabase 연결 진단 중 오류 발생'
    }, { status: 500 })
  }
}

function generateRecommendations(results: TestResult): string[] {
  const recommendations = []
  
  if (!results.database_test?.success) {
    recommendations.push('❌ 데이터베이스 연결 실패 - Supabase URL과 anon key를 확인해주세요')
  }
  
  if (!results.storage_test?.anon_key?.success) {
    recommendations.push('❌ Storage 연결 실패 (Anon Key) - Storage 정책 설정이 필요할 수 있습니다')
    recommendations.push('💡 Service Role Key를 환경변수에 추가해보세요: SUPABASE_SERVICE_ROLE_KEY')
  }
  
  if (!results.env_check.service_role_key_exists) {
    recommendations.push('⚠️ Service Role Key가 설정되지 않음 - Storage 작업에는 Service Role Key가 필요할 수 있습니다')
  }
  
  if (results.storage_test?.service_role?.success) {
    recommendations.push('✅ Service Role Key로 Storage 연결 성공 - 이 키를 사용하세요')
  }
  
  if (results.database_test?.success && results.storage_test?.anon_key?.success) {
    recommendations.push('✅ 모든 연결이 정상입니다')
  }
  
  return recommendations
} 