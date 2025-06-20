import { supabase } from './supabase'
import { mockCharacters } from './mock-data'
import { Character } from '@/types/character'

/**
 * Mock 데이터를 Supabase 데이터베이스로 동기화하는 함수
 */
export async function syncMockDataToSupabase() {
  console.log('Mock 데이터 Supabase 동기화 시작...')
  
  try {
    // 1. 기존 데이터 확인
    const { data: existingCharacters, error: fetchError } = await supabase
      .from('characters')
      .select('id')
    
    if (fetchError) {
      console.error('기존 데이터 조회 실패:', fetchError)
      return { success: false, error: fetchError }
    }

    const existingIds = new Set(existingCharacters?.map((char: any) => char.id) || [])
    console.log('기존 캐릭터 ID들:', Array.from(existingIds))

    // 2. 새로운 캐릭터들 필터링
    const newCharacters = mockCharacters.filter((char: Character) => !existingIds.has(char.id))
    console.log('추가할 캐릭터 수:', newCharacters.length)

    if (newCharacters.length === 0) {
      console.log('추가할 새로운 캐릭터가 없습니다.')
      return { success: true, added: 0 }
    }

    // 3. 캐릭터 기본 정보 추가
    const charactersToAdd = newCharacters.map((char: Character) => ({
      id: char.id,
      name: char.name,
      creator_name: char.creatorName,
      description: char.description,
      avatar_url: char.avatarUrl,
      interaction_count: char.interactionCount,
      is_verified: char.isVerified || false,
      is_new: char.isNew || false,
      tags: char.tags
    }))

    const { data: insertedCharacters, error: insertError } = await supabase
      .from('characters')
      .insert(charactersToAdd)
      .select()

    if (insertError) {
      console.error('캐릭터 삽입 실패:', insertError)
      return { success: false, error: insertError }
    }

    console.log('캐릭터 기본 정보 추가 완료:', insertedCharacters?.length)

    // 4. 성격 정보 추가 (있는 경우만)
    const personalitiesData = newCharacters
      .filter((char: Character) => char.personality)
      .map((char: Character) => ({
        character_id: char.id,
        traits: char.personality!.traits,
        speech_style: char.personality!.speechStyle,
        background: char.personality!.background,
        interests: char.personality!.interests,
        relationships: char.personality!.relationships
      }))

    if (personalitiesData.length > 0) {
      const { error: personalityError } = await supabase
        .from('character_personalities')
        .insert(personalitiesData)

      if (personalityError) {
        console.error('성격 정보 삽입 실패:', personalityError)
        // 캐릭터는 추가되었으므로 부분 성공으로 처리
        return { 
          success: true, 
          added: newCharacters.length, 
          warning: '성격 정보 추가 실패',
          personalityError 
        }
      }

      console.log('성격 정보 추가 완료:', personalitiesData.length)
    }

    return { 
      success: true, 
      added: newCharacters.length,
      message: `${newCharacters.length}개 캐릭터가 성공적으로 추가되었습니다.`
    }

  } catch (error) {
    console.error('동기화 중 예외 발생:', error)
    return { success: false, error }
  }
}

/**
 * 데이터베이스에서 모든 캐릭터 조회
 */
export async function getAllCharactersFromDB() {
  try {
    const { data: characters, error: charError } = await supabase
      .from('characters')
      .select('*')
      .order('created_at', { ascending: true })

    if (charError) {
      console.error('캐릭터 조회 실패:', charError)
      return { success: false, error: charError }
    }

    // 성격 정보도 함께 조회
    const { data: personalities, error: persError } = await supabase
      .from('character_personalities')
      .select('*')

    if (persError) {
      console.warn('성격 정보 조회 실패:', persError)
      // 성격 정보 없이도 캐릭터 반환
      return { 
        success: true, 
        characters: characters?.map((char: any) => ({
          ...char,
          creatorName: char.creator_name,
          avatarUrl: char.avatar_url,
          interactionCount: char.interaction_count,
          isVerified: char.is_verified,
          isNew: char.is_new
        }))
      }
    }

    // 성격 정보를 캐릭터에 매핑
    const personalityMap = new Map(
      personalities?.map((p: any) => [p.character_id, p]) || []
    )

    const charactersWithPersonality = characters?.map((char: any) => ({
      ...char,
      creatorName: char.creator_name,
      avatarUrl: char.avatar_url,
      interactionCount: char.interaction_count,
      isVerified: char.is_verified,
      isNew: char.is_new,
      personality: personalityMap.get(char.id) ? {
        traits: personalityMap.get(char.id)!.traits,
        speechStyle: personalityMap.get(char.id)!.speech_style,
        background: personalityMap.get(char.id)!.background,
        interests: personalityMap.get(char.id)!.interests,
        relationships: personalityMap.get(char.id)!.relationships
      } : undefined
    }))

    return { success: true, characters: charactersWithPersonality }

  } catch (error) {
    console.error('캐릭터 조회 중 예외 발생:', error)
    return { success: false, error }
  }
}

// 이 파일이 직접 실행되었을 때 동기화 함수를 호출
if (require.main === module) {
  (async () => {
    const result = await syncMockDataToSupabase();
    if (result.success) {
      console.log('✅ 동기화 성공:', result.message || '완료되었습니다.');
    } else {
      console.error('❌ 동기화 실패:', result.error);
    }
  })();
} 