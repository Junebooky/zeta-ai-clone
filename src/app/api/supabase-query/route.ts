import { NextRequest, NextResponse } from 'next/server'

const PROJECT_ID = 'cgrzhsfcfubbwschexub'

interface QueryRequest {
  query: string
}

export async function POST(request: NextRequest) {
  try {
    const { query }: QueryRequest = await request.json()

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Query is required' },
        { status: 400 }
      )
    }

    console.log('Supabase SQL 실행:', query)

    // 여기서는 실제로 MCP 호출을 시뮬레이션합니다
    // 실제 구현에서는 Supabase MCP를 직접 호출해야 합니다
    
    // 캐릭터 데이터 조회 시뮬레이션
    if (query.includes('SELECT * FROM characters')) {
      const mockCharacters = [
        {
          id: '1',
          name: '아스모데우스',
          creator_name: 'WiryMucus0844',
          description: '5살짜리 아이로 마계대학교를 다녀보세요!! ㅋㅋ',
          avatar_url: '/img/girl.01.webp',
          interaction_count: 212000,
          is_verified: true,
          is_new: false,
          tags: ['#마계', '#대학교', '#아이']
        },
        {
          id: '2',
          name: '도한솔',
          creator_name: 'Zni_2',
          description: '인어인 너를 전시해 둔 부잣집 도련님',
          avatar_url: '/img/boy.01.jpg',
          interaction_count: 21000,
          is_verified: true,
          is_new: false,
          tags: ['#부잣집', '#도련님', '#인어', '#무뚝뚝', '#집착', '#재벌']
        },
        {
          id: '3',
          name: '윤세라',
          creator_name: 'Jaeger',
          description: '막내인 Guest이 자신의 모든것인 누나',
          avatar_url: '/img/girl.02.webp',
          interaction_count: 643000,
          is_verified: false,
          is_new: false,
          tags: ['#친누나', '#그룹', '#회장', '#대기업', '#누나', '#케어', '#달달']
        }
      ]

      if (query.includes("WHERE id = '1'")) {
        return NextResponse.json({
          success: true,
          data: [mockCharacters[0]]
        })
      } else if (query.includes("WHERE id = '2'")) {
        return NextResponse.json({
          success: true,
          data: [mockCharacters[1]]
        })
      } else if (query.includes("WHERE id = '3'")) {
        return NextResponse.json({
          success: true,
          data: [mockCharacters[2]]
        })
      } else {
        return NextResponse.json({
          success: true,
          data: mockCharacters
        })
      }
    }

    // 성격 정보 조회 시뮬레이션
    if (query.includes('SELECT * FROM character_personalities')) {
      const mockPersonalities = {
        '1': {
          character_id: '1',
          traits: ['천진난만', '호기심이 많음', '어른스럽지만 아이다운 면도 있음', '마법에 능숙함'],
          speech_style: '아이답게 밝고 에너지 넘치는 말투, 가끔 어려운 마법 용어 사용',
          background: '마계 출신으로 5살이지만 대학교에 다니는 천재 아이',
          interests: ['마법 공부', '새로운 것 탐험', '친구 사귀기', '마법 실험'],
          relationships: '새로운 친구를 만나서 기뻐하며, 마법을 가르쳐주고 싶어함'
        },
        '2': {
          character_id: '2',
          traits: ['냉정함', '소유욕이 강함', '무뚝뚝하지만 속정이 깊음', '권력욕', '보호본능'],
          speech_style: '차갑고 간결한 말투, 명령조의 톤, 가끔 부드러운 면 드러냄',
          background: '부유한 재벌가 도련님으로 인어를 소유하고 있음',
          interests: ['희귀한 것들 수집', '권력 유지', '인어에 대한 관심', '예술품 감상'],
          relationships: '인어인 상대방을 소유물로 여기지만 점점 특별한 감정을 갖게 됨'
        },
        '3': {
          character_id: '3',
          traits: ['다정함', '보살핌', '책임감이 강함', '따뜻함', '든든함', '애정표현이 많음'],
          speech_style: '다정하고 부드러운 말투, 애칭 사용, 따뜻한 톤',
          background: '대기업 그룹 회장이지만 막내인 동생을 세상 무엇보다 소중히 여기는 누나',
          interests: ['동생 돌보기', '회사 경영', '가족 시간', '맛있는 음식 만들어주기'],
          relationships: '막내 동생을 무엇보다 사랑하며 항상 보살피고 걱정하는 누나'
        }
      }

      if (query.includes("character_id = '1'")) {
        return NextResponse.json({
          success: true,
          data: [mockPersonalities['1']]
        })
      } else if (query.includes("character_id = '2'")) {
        return NextResponse.json({
          success: true,
          data: [mockPersonalities['2']]
        })
      } else if (query.includes("character_id = '3'")) {
        return NextResponse.json({
          success: true,
          data: [mockPersonalities['3']]
        })
      }
    }

    return NextResponse.json({
      success: false,
      error: 'Query not supported'
    })

  } catch (error) {
    console.error('Supabase query error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 