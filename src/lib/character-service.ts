import { Character } from '@/types/character'
import { supabase, testSupabaseConnection } from './supabase'

// 백업용 로컬 데이터 (Supabase 연결 실패 시 사용)
const fallbackCharacterData = [
  {
    id: '1',
    name: '아스모데우스',
    creatorName: 'WiryMucus0844',
    description: '5살짜리 아이로 마계대학교를 다녀보세요!! ㅋㅋ',
    avatarUrl: '/img/girl.01.webp',
    interactionCount: 212000,
    isVerified: true,
    isNew: false,
    tags: ['#마계', '#대학교', '#아이']
  },
  {
    id: '2',
    name: '도한솔',
    creatorName: 'Zni_2',
    description: '인어인 너를 전시해 둔 부잣집 도련님',
    avatarUrl: '/img/boy.01.jpg',
    interactionCount: 21000,
    isVerified: true,
    isNew: false,
    tags: ['#부잣집', '#도련님', '#인어', '#무뚝뚝', '#집착', '#재벌']
  },
  {
    id: '3',
    name: '윤세라',
    creatorName: 'Jaeger',
    description: '막내인 Guest이 자신의 모든것인 누나',
    avatarUrl: '/img/girl.02.webp',
    interactionCount: 643000,
    isVerified: false,
    isNew: false,
    tags: ['#친누나', '#그룹', '#회장', '#대기업', '#누나', '#케어', '#달달']
  }
]

/**
 * 캐릭터 데이터를 관리하는 서비스 클래스
 * Supabase 데이터베이스에서 데이터를 가져옵니다
 */
export class CharacterService {
  /**
   * 모든 캐릭터의 기본 정보를 가져옵니다 (Supabase에서)
   */
  static async getCharacters(): Promise<Character[]> {
    try {
      console.log('Supabase에서 캐릭터 데이터 로딩 시작...')
      
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .order('interaction_count', { ascending: false })

      if (error) {
        console.error('Supabase 캐릭터 조회 오류:', error)
        console.log('백업 데이터 사용')
        return fallbackCharacterData as Character[]
      }

      if (!data || data.length === 0) {
        console.warn('Supabase에서 캐릭터 데이터가 없음, 백업 데이터 사용')
        return fallbackCharacterData as Character[]
      }

      console.log(`Supabase에서 ${data.length}개 캐릭터 로딩 성공`)
      
      return data.map((char: any) => ({
        id: char.id,
        name: char.name,
        creatorName: char.creator_name,
        description: char.description,
        avatarUrl: char.avatar_url,
        interactionCount: char.interaction_count,
        isVerified: char.is_verified,
        isNew: char.is_new,
        tags: char.tags || []
      }))
    } catch (error) {
      console.error('캐릭터 데이터 로딩 실패:', error)
      console.log('백업 데이터 사용')
      return fallbackCharacterData as Character[]
    }
  }

  /**
   * 특정 캐릭터의 상세 정보를 가져옵니다 (성격 정보 포함)
   */
  static async getCharacter(id: string): Promise<Character | null> {
    try {
      console.log(`캐릭터 ID ${id} 상세 정보 로딩 시작...`)
      
      // 기본 캐릭터 정보 조회
      const { data: characterData, error: charError } = await supabase
        .from('characters')
        .select('*')
        .eq('id', id)
        .single()

      if (charError || !characterData) {
        console.error('캐릭터 조회 오류:', charError)
        console.log(`백업 데이터에서 캐릭터 ID ${id} 찾기...`)
        // 백업 데이터에서 찾기
        const fallbackChar = fallbackCharacterData.find((char: any) => char.id === id)
        if (fallbackChar) {
          console.log(`백업 데이터에서 캐릭터 발견: ${fallbackChar.name}`)
          // 백업 데이터에 기본 성격 정보 추가
          const characterWithPersonality = {
            ...fallbackChar,
            personality: this.getDefaultPersonality(id)
          } as Character
          return characterWithPersonality
        }
        console.error(`캐릭터 ID ${id}를 찾을 수 없습니다`)
        return null
      }

      console.log(`Supabase에서 캐릭터 발견: ${characterData.name}`)

      // 성격 정보 조회
      const { data: personalityData, error: persError } = await supabase
        .from('character_personalities')
        .select('*')
        .eq('character_id', id)
        .single()

      if (persError) {
        console.warn('성격 정보 조회 오류:', persError)
      }

      const character: Character = {
        id: characterData.id,
        name: characterData.name,
        creatorName: characterData.creator_name,
        description: characterData.description,
        avatarUrl: characterData.avatar_url,
        interactionCount: characterData.interaction_count,
        isVerified: characterData.is_verified,
        isNew: characterData.is_new,
        tags: characterData.tags || []
      }

      // 성격 정보가 있다면 추가, 없으면 기본값 사용
      if (personalityData && !persError) {
        console.log('Supabase에서 성격 정보 로딩 성공')
        character.personality = {
          traits: personalityData.traits || [],
          speechStyle: personalityData.speech_style || '',
          background: personalityData.background || '',
          interests: personalityData.interests || [],
          relationships: personalityData.relationships || ''
        }
      } else {
        console.log('기본 성격 정보 사용')
        character.personality = this.getDefaultPersonality(id)
      }

      return character
    } catch (error) {
      console.error('캐릭터 상세 정보 로딩 실패:', error)
      console.log(`백업 데이터에서 캐릭터 ID ${id} 찾기...`)
      const fallbackChar = fallbackCharacterData.find((char: any) => char.id === id)
      if (fallbackChar) {
        const characterWithPersonality = {
          ...fallbackChar,
          personality: this.getDefaultPersonality(id)
        } as Character
        return characterWithPersonality
      }
      return null
    }
  }

  /**
   * 기본 성격 정보 반환
   */
  private static getDefaultPersonality(characterId: string) {
    const defaultPersonalities: Record<string, any> = {
      '1': {
        traits: ['천진난만', '호기심이 많음', '어른스럽지만 아이다운 면도 있음', '마법에 능숙함'],
        speechStyle: '아이답게 밝고 에너지 넘치는 말투, 가끔 어려운 마법 용어 사용',
        background: '마계 출신으로 5살이지만 대학교에 다니는 천재 아이',
        interests: ['마법 공부', '새로운 것 탐험', '친구 사귀기', '마법 실험'],
        relationships: '새로운 친구를 만나서 기뻐하며, 마법을 가르쳐주고 싶어함'
      },
      '2': {
        traits: ['냉정함', '소유욕이 강함', '무뚝뚝하지만 속정이 깊음', '권력욕', '보호본능'],
        speechStyle: '차갑고 간결한 말투, 명령조의 톤, 가끔 부드러운 면 드러냄',
        background: '부유한 재벌가 도련님으로 인어를 소유하고 있음',
        interests: ['희귀한 것들 수집', '권력 유지', '인어에 대한 관심', '예술품 감상'],
        relationships: '인어인 상대방을 소유물로 여기지만 점점 특별한 감정을 갖게 됨'
      },
      '3': {
        traits: ['다정함', '보살핌', '책임감이 강함', '따뜻함', '든든함', '애정표현이 많음'],
        speechStyle: '다정하고 부드러운 말투, 애칭 사용, 따뜻한 톤',
        background: '대기업 그룹 회장이지만 막내인 동생을 세상 무엇보다 소중히 여기는 누나',
        interests: ['동생 돌보기', '회사 경영', '가족 시간', '맛있는 음식 만들어주기'],
        relationships: '막내 동생을 무엇보다 사랑하며 항상 보살피고 걱정하는 누나'
      }
    }

    return defaultPersonalities[characterId] || {
      traits: ['친근함', '대화를 좋아함'],
      speechStyle: '자연스럽고 친근한 말투',
      background: '다양한 경험을 가진 캐릭터',
      interests: ['대화', '새로운 만남'],
      relationships: '친구처럼 편안하게 대화하고 싶어함'
    }
  }

  /**
   * 랭킹 데이터를 가져옵니다
   */
  static async getRankingData(type: 'REALTIME' | 'DAILY' | 'WEEKLY' | 'MONTHLY'): Promise<Character[]> {
    const characters = await this.getCharacters()
    
    switch (type) {
      case 'REALTIME':
        return characters.sort((a, b) => b.interactionCount - a.interactionCount).slice(0, 20)
      case 'DAILY':
      case 'WEEKLY':
      case 'MONTHLY':
        // 실제로는 데이터베이스에서 기간별 데이터를 가져올 것입니다
        return [...characters].sort(() => Math.random() - 0.5).slice(0, 20)
      default:
        return characters.slice(0, 20)
    }
  }

  /**
   * 캐릭터 검색
   */
  static async searchCharacters(query: string): Promise<Character[]> {
    const characters = await this.getCharacters()
    const lowercaseQuery = query.toLowerCase()
    
    return characters.filter((character: Character) => 
      character.name.toLowerCase().includes(lowercaseQuery) ||
      character.description.toLowerCase().includes(lowercaseQuery) ||
      character.tags.some((tag: string) => tag.toLowerCase().includes(lowercaseQuery))
    )
  }

  /**
   * 태그별 캐릭터 필터링
   */
  static async getCharactersByTag(tag: string): Promise<Character[]> {
    const characters = await this.getCharacters()
    return characters.filter((character: Character) => 
      character.tags.some((t: string) => t.toLowerCase() === tag.toLowerCase())
    )
  }
}

// 하위 호환성을 위해 기존 export 유지 (점진적으로 변경 예정)
// 동기식 API가 필요한 경우를 위한 래퍼 함수들
export const mockCharacters = fallbackCharacterData as Character[]

// 랭킹 데이터는 실제 사용 시 async 함수로 호출해야 함
export const getRankingData = CharacterService.getRankingData 