import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Service Role Key를 사용한 Supabase 클라이언트 (서버 전용)
const getSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cgrzhsfcfubbwschexub.supabase.co'
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY가 환경변수에 설정되지 않았습니다.')
  }
  
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Fallback으로 anon key 클라이언트도 준비
const getAnonClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cgrzhsfcfubbwschexub.supabase.co'
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNncnpoc2ZjZnViYndzY2hleHViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzMTQxMzAsImV4cCI6MjA2NTg5MDEzMH0.akEYkOjiiMtAUi2GgRxBAza7Vd9Hn4OKYLCyR-IBHS8'
  
  return createClient(supabaseUrl, anonKey)
}

// 캐릭터 데이터 검증 함수
function validateCharacterData(data: any) {
  const errors = []
  
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.push('캐릭터 이름은 필수입니다.')
  }
  
  if (data.name && data.name.length > 10) {
    errors.push('캐릭터 이름은 10자 이하여야 합니다.')
  }
  
  if (!data.description || typeof data.description !== 'string' || data.description.trim().length === 0) {
    errors.push('캐릭터 설명은 필수입니다.')
  }
  

  
  return errors
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== 캐릭터 생성 API 시작 (Service Role Key 사용) ===')
    
    // Service Role Key로 Supabase 클라이언트 초기화
    let supabase
    try {
      supabase = getSupabaseClient()
      console.log('✅ Service Role Key로 Supabase 클라이언트 초기화 완료')
    } catch (serviceError) {
      console.warn('⚠️ Service Role Key 사용 실패, anon key로 대체:', serviceError)
      supabase = getAnonClient()
      console.log('✅ Anon Key로 Supabase 클라이언트 초기화 완료')
    }
    
    // 요청 데이터 파싱
    const body = await request.json()
    console.log('📝 요청 데이터:', {
      name: body.name,
      description: body.description?.substring(0, 50) + '...' || '(없음)',
      personality: body.personality?.substring(0, 30) + '...' || '(없음)',
      voice: body.voice || '(없음)',
      creatorName: body.creatorName || '(없음)',
      avatarUrl: body.avatarUrl || '(없음)',
      avatarUrlType: body.avatarUrl ? (body.avatarUrl.startsWith('/img/') ? 'default' : 'uploaded') : '(없음)'
    })
    
    // 데이터 검증
    const validationErrors = validateCharacterData(body)
    if (validationErrors.length > 0) {
      return NextResponse.json({
        success: false,
        error: '데이터 유효성 검사 실패',
        details: validationErrors
      }, { status: 400 })
    }
    
    // UUID 생성 (crypto.randomUUID 사용)
    const characterId = crypto.randomUUID()
    console.log('🆔 생성된 캐릭터 ID:', characterId)
    
    // avatarUrl 검증 및 처리
    let finalAvatarUrl = body.avatarUrl || '/img/girl.01.webp'
    console.log('🖼️ Avatar URL 검증:')
    console.log('- 입력된 avatarUrl:', body.avatarUrl || '(없음)')
    console.log('- 최종 사용할 avatarUrl:', finalAvatarUrl)
    console.log('- URL 유형:', finalAvatarUrl.startsWith('/img/') ? '기본 이미지' : '업로드된 이미지')
    
    // avatarUrl이 업로드된 이미지인 경우 유효성 검증
    if (finalAvatarUrl && !finalAvatarUrl.startsWith('/img/')) {
      try {
        const urlTest = new URL(finalAvatarUrl)
        console.log('✅ 업로드된 이미지 URL 형식 검증 통과:', urlTest.origin)
      } catch (urlError) {
        console.warn('⚠️ 잘못된 URL 형식, 기본 이미지로 대체:', urlError)
        finalAvatarUrl = '/img/girl.01.webp'
      }
    }
    
    // 캐릭터 기본 정보 준비
    const characterData = {
      id: characterId,
      name: body.name.trim(),
      description: body.description.trim(),
      creator_name: body.creatorName || 'Guest',
      avatar_url: finalAvatarUrl,
      tags: Array.isArray(body.tags) ? body.tags : [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    // 캐릭터 성격 정보 준비 (personality 필드 제거, 기존 필드 활용)
    const personalityData = {
      character_id: characterId,
      traits: body.personality ? [body.personality.trim()] : [],
      speech_style: body.voice || '설정 안 함',
      background: body.description?.trim() || '',
      interests: Array.isArray(body.tags) ? body.tags : [],
      relationships: '친근하고 대화하기 좋은 캐릭터',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    console.log('💾 데이터베이스 저장 시작...')
    console.log('- characters 테이블 데이터:', {
      id: characterData.id,
      name: characterData.name,
      avatar_url: characterData.avatar_url,
      creator_name: characterData.creator_name
    })
    console.log('- character_personalities 테이블 데이터:', {
      character_id: personalityData.character_id,
      traits: personalityData.traits,
      speech_style: personalityData.speech_style,
      background: personalityData.background.substring(0, 30) + '...'
    })
    
    // 트랜잭션으로 두 테이블에 동시 저장
    const { data: characterResult, error: characterError } = await supabase
      .from('characters')
      .insert([characterData])
      .select()
    
    if (characterError) {
      console.error('❌ characters 테이블 저장 실패:', characterError)
      return NextResponse.json({
        success: false,
        error: `캐릭터 생성 실패: ${characterError.message}`,
        details: characterError
      }, { status: 500 })
    }
    
    console.log('✅ characters 테이블 저장 성공:', characterResult?.[0]?.id)
    
    // character_personalities 테이블에 저장
    const { data: personalityResult, error: personalityError } = await supabase
      .from('character_personalities')
      .insert([personalityData])
      .select()
    
    if (personalityError) {
      console.error('❌ character_personalities 테이블 저장 실패:', personalityError)
      // 캐릭터는 생성되었지만 성격 데이터 저장 실패 - 롤백하거나 경고 표시
      console.warn('⚠️ 캐릭터는 생성되었지만 성격 정보 저장에 실패했습니다.')
    } else {
      console.log('✅ character_personalities 테이블 저장 성공')
    }
    
    // 생성된 캐릭터 정보 반환 준비
    const createdCharacter = characterResult?.[0]
    
    if (!createdCharacter) {
      return NextResponse.json({
        success: false,
        error: '캐릭터 생성 후 데이터 조회 실패'
      }, { status: 500 })
    }
    
    // 최종 생성된 캐릭터 정보 검증
    console.log('🎉 캐릭터 생성 완료!')
    console.log('- 캐릭터 ID:', createdCharacter.id)
    console.log('- 캐릭터 이름:', createdCharacter.name)
    console.log('- 저장된 Avatar URL:', createdCharacter.avatar_url)
    console.log('- 생성자:', createdCharacter.creator_name)
    console.log('- 생성 시각:', createdCharacter.created_at)
    
    // 성공 응답
    const response = {
      success: true,
      message: '캐릭터가 성공적으로 생성되었습니다.',
      character: {
        id: createdCharacter.id,
        name: createdCharacter.name,
        description: createdCharacter.description,
        avatarUrl: createdCharacter.avatar_url,
        creator_name: createdCharacter.creator_name,
        tags: createdCharacter.tags,
        created_at: createdCharacter.created_at
      },
      personality_saved: !personalityError
    }
    
    console.log('📤 응답 데이터:', {
      success: response.success,
      character_id: response.character.id,
      character_name: response.character.name,
      avatar_url: response.character.avatarUrl,
      personality_saved: response.personality_saved
    })
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('=== 캐릭터 생성 API 전체 오류 ===', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
      details: error
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('=== 캐릭터 목록 조회 API ===')
    
    // Service Role Key로 Supabase 클라이언트 초기화
    let supabase
    try {
      supabase = getSupabaseClient()
      console.log('✅ Service Role Key로 조회 클라이언트 초기화')
    } catch (serviceError) {
      supabase = getAnonClient()
      console.log('✅ Anon Key로 조회 클라이언트 초기화')
    }
    
    // URL 파라미터 확인
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    console.log('📋 조회 조건:', { limit, offset })
    
    // 캐릭터 목록 조회 (최신순)
    const { data: characters, error: queryError } = await supabase
      .from('characters')
      .select('id, name, description, avatar_url, creator_name, tags, created_at')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    
    if (queryError) {
      console.error('❌ 캐릭터 목록 조회 실패:', queryError)
      return NextResponse.json({
        success: false,
        error: `캐릭터 목록 조회 실패: ${queryError.message}`,
        details: queryError
      }, { status: 500 })
    }
    
    console.log('✅ 캐릭터 목록 조회 성공, 개수:', characters?.length || 0)
    
    // 프론트엔드 호환성을 위해 snake_case를 camelCase로 변환
    const formattedCharacters = characters?.map(char => ({
      id: char.id,
      name: char.name,
      description: char.description,
      avatarUrl: char.avatar_url,  // DB의 avatar_url을 프론트엔드용 avatarUrl로 변환
      creator_name: char.creator_name,
      tags: char.tags,
      created_at: char.created_at
    })) || []
    
    return NextResponse.json({
      success: true,
      characters: formattedCharacters,
      count: formattedCharacters.length,
      pagination: {
        limit,
        offset,
        hasMore: formattedCharacters.length === limit
      }
    })
    
  } catch (error) {
    console.error('=== 캐릭터 목록 조회 API 오류 ===', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
      details: error
    }, { status: 500 })
  }
} 