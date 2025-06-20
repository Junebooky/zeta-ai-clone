import { Character } from '@/types/character'

// 백업용 로컬 데이터
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
 * Supabase MCP를 직접 사용하는 캐릭터 서비스
 */
export class CharacterServiceMCP {
  private static readonly PROJECT_ID = 'cgrzhsfcfubbwschexub'

  /**
   * Supabase MCP를 통해 캐릭터 목록 가져오기
   */
  static async getCharacters(): Promise<Character[]> {
    try {
      console.log('Supabase MCP로 캐릭터 데이터 로딩 시작...')
      
      // Supabase MCP를 사용한 SQL 실행
      const response = await fetch('/api/supabase-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: 'SELECT * FROM characters ORDER BY interaction_count DESC'
        })
      })

      if (!response.ok) {
        console.error('Supabase MCP 요청 실패:', response.status)
        return fallbackCharacterData as Character[]
      }

      const data = await response.json()
      console.log('Supabase MCP 응답:', data)

      if (!data.success || !data.data) {
        console.warn('Supabase MCP 응답에 데이터가 없음')
        return fallbackCharacterData as Character[]
      }

      console.log(`Supabase MCP로 ${data.data.length}개 캐릭터 로딩 성공`)
      
      return data.data.map((char: any) => ({
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
      console.error('Supabase MCP 캐릭터 데이터 로딩 실패:', error)
      return fallbackCharacterData as Character[]
    }
  }

  /**
   * Supabase MCP를 통해 특정 캐릭터 상세 정보 가져오기
   */
  static async getCharacter(id: string): Promise<Character | null> {
    try {
      console.log(`Supabase MCP로 캐릭터 ID ${id} 상세 정보 로딩 시작...`)
      
      // 캐릭터 기본 정보 조회
      const characterResponse = await fetch('/api/supabase-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: `SELECT * FROM characters WHERE id = '${id}'`
        })
      })

      if (!characterResponse.ok) {
        console.error('캐릭터 조회 실패:', characterResponse.status)
        return this.getFallbackCharacter(id)
      }

      const characterData = await characterResponse.json()
      
      if (!characterData.success || !characterData.data || characterData.data.length === 0) {
        console.warn(`캐릭터 ID ${id} 없음, 백업 데이터 사용`)
        return this.getFallbackCharacter(id)
      }

      const char = characterData.data[0]
      console.log(`Supabase MCP에서 캐릭터 발견: ${char.name}`)

      // 성격 정보 조회
      const personalityResponse = await fetch('/api/supabase-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: `SELECT * FROM character_personalities WHERE character_id = '${id}'`
        })
      })

      let personality = this.getDefaultPersonality(id)
      
      if (personalityResponse.ok) {
        const personalityData = await personalityResponse.json()
        if (personalityData.success && personalityData.data && personalityData.data.length > 0) {
          const pers = personalityData.data[0]
          console.log('Supabase MCP에서 성격 정보 로딩 성공')
          personality = {
            traits: pers.traits || [],
            speechStyle: pers.speech_style || '',
            background: pers.background || '',
            interests: pers.interests || [],
            relationships: pers.relationships || ''
          }
        }
      }

      const character: Character = {
        id: char.id,
        name: char.name,
        creatorName: char.creator_name,
        description: char.description,
        avatarUrl: char.avatar_url,
        interactionCount: char.interaction_count,
        isVerified: char.is_verified,
        isNew: char.is_new,
        tags: char.tags || [],
        personality
      }

      return character
      
    } catch (error) {
      console.error('Supabase MCP 캐릭터 상세 정보 로딩 실패:', error)
      return this.getFallbackCharacter(id)
    }
  }

  /**
   * 백업 데이터에서 캐릭터 찾기
   */
  private static getFallbackCharacter(id: string): Character | null {
    const fallbackChar = fallbackCharacterData.find((char: any) => char.id === id)
    if (fallbackChar) {
      return {
        ...fallbackChar,
        personality: this.getDefaultPersonality(id)
      } as Character
    }
    return null
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
}

// 하위 호환성을 위한 export
export const mockCharacters = fallbackCharacterData as Character[] 