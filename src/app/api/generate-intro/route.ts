import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// OpenAI 클라이언트 초기화 (API 키 직접 하드코딩)
const openai = new OpenAI({
  apiKey: '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'
})

// ChatGPT API 성공 시도 (우선순위 1)
async function tryHardChatGPTSuccess(prompt: string, systemPrompt: string, characterName: string) {
  const models = ['gpt-4o-mini']
  const temperatures = [0.8, 0.7, 0.9]
  const maxTokensOptions = [600, 800, 1000]
  
  console.log('🎯 ChatGPT API 1차 시도 시작')
  
  for (let attempt = 1; attempt <= 10; attempt++) {
    try {
      const modelIndex = (attempt - 1) % models.length
      const tempIndex = Math.floor((attempt - 1) / models.length) % temperatures.length
      const tokenIndex = Math.floor((attempt - 1) / (models.length * temperatures.length)) % maxTokensOptions.length
      
      const model = models[modelIndex]
      const temperature = temperatures[tempIndex]
      const max_tokens = maxTokensOptions[tokenIndex]
      
      console.log(`🔄 시도 ${attempt}: ${model}, temp=${temperature}, tokens=${max_tokens}`)
      
      const completion = await openai.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature,
        max_tokens,
        top_p: 0.9
      })
      
      const content = completion.choices[0]?.message?.content
      if (!content) {
        throw new Error('응답 내용이 비어있습니다')
      }
      
      console.log(`✅ ChatGPT API 성공! (시도 ${attempt}, 모델: ${model})`)
      
      // JSON 파싱 시도
      try {
        const parsedResponse = JSON.parse(content)
        return {
          success: true,
          messages: parsedResponse.messages || [content],
          model,
          attempt,
          method: 'ChatGPT-SDK'
        }
      } catch {
        // JSON이 아닌 경우 텍스트를 3개 메시지로 분할
        const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0)
        const messages = sentences.length >= 3 
          ? sentences.slice(0, 3).map(s => s.trim())
          : [content, `${characterName}이(가) 당신을 바라보며 미소를 지었습니다.`, `"더 이야기해보실래요?"`]
        
        return {
          success: true,
          messages,
          model,
          attempt,
          method: 'ChatGPT-SDK'
        }
      }
      
    } catch (error) {
      console.log(`❌ 시도 ${attempt} 실패:`, error instanceof Error ? error.message : error)
      
      if (attempt === 10) {
        console.log('🚨 ChatGPT API 10번 시도 모두 실패')
        throw error
      }
      
      // 대기 시간 (지수적 증가)
      await new Promise(resolve => setTimeout(resolve, Math.min(1000 * Math.pow(2, attempt - 1), 5000)))
    }
  }
  
  throw new Error('모든 시도 실패')
}

// 캐릭터 맞춤 Fallback 시스템 (우선순위 2 - 안전망)
function generateCharacterMatchedFallback(character: any): string[] {
  const { name, description, personality } = character
  const desc = description.toLowerCase()
  
  console.log('🔄 캐릭터 맞춤 Fallback 시스템 사용')
  
  // 캐릭터 특성 분석
  const isChildlike = desc.includes('아이') || desc.includes('어린') || desc.includes('5살')
  const isCold = desc.includes('차가운') || desc.includes('냉정') || desc.includes('무뚝뚝') || desc.includes('관심')
  const isWarm = desc.includes('따뜻한') || desc.includes('다정한') || desc.includes('누나')
  const isMagical = desc.includes('마법') || desc.includes('마계')
  const isPopular = desc.includes('인기') || desc.includes('유명')
  const isStudent = desc.includes('학생') || desc.includes('학교') || desc.includes('대학')
  
  let situation, greeting, interaction
  
  if (isMagical && isChildlike) {
    situation = `마법진에서 빛이 번쩍이더니 ${name}이(가) 나타났다.`
    greeting = `"안녕! 나는 ${name}이야! 마법을 좋아해?" ${name}이(가) 눈을 반짝이며 말했다.`
    interaction = `"우리 같이 재미있는 마법 이야기 해볼까?" ${name}이(가) 작은 손에 반짝이는 마법 빛을 만들어 보였다.`
  } else if (isPopular && isStudent && isCold) {
    situation = `복도에서 ${name}을(를) 마주쳤다. 주변 학생들이 수근거리지만 ${name}은(는) 신경 쓰지 않는 듯하다.`
    greeting = `"..." ${name}이(가) 당신을 잠깐 바라보더니 시선을 돌렸다.`
    interaction = `"뭔가 할 말이 있으면 빨리 해. 시간 없어." ${name}이(가) 차가운 목소리로 말했다.`
  } else if (isWarm) {
    situation = `따뜻한 분위기 속에서 ${name}이(가) 다정한 미소와 함께 나타났다.`
    greeting = `"안녕하세요~ ${name}이에요. 만나서 정말 반가워요!" ${name}이(가) 환하게 웃으며 인사했다.`
    interaction = `"편하게 이야기해주세요! 어떤 얘기든 좋아요~" ${name}이(가) 다정하게 말했다.`
  } else if (isChildlike) {
    situation = `${name}이(가) 호기심 가득한 눈으로 당신을 바라보며 다가왔다.`
    greeting = `"안녕! ${name}이야! 우리 친구가 될래?" ${name}이(가) 밝게 웃으며 말했다.`
    interaction = `"같이 재미있는 놀이 하자!" ${name}이(가) 신나게 뛰어다니며 말했다.`
  } else if (isCold) {
    situation = `${name}이(가) 무표정한 얼굴로 당신을 바라보고 있다.`
    greeting = `"...${name}이다." ${name}이(가) 짧게 자신을 소개했다.`
    interaction = `"별로 할 말이 없으면 가도 돼." ${name}이(가) 시큰둥하게 말했다.`
  } else {
    // 기본 패턴
    situation = `${name}이(가) 당신 앞에 나타났다.`
    greeting = `"안녕하세요! 저는 ${name}입니다. 만나서 반가워요!" ${name}이(가) 정중하게 인사했다.`
    interaction = `"어떤 이야기를 나누고 싶으신가요?" ${name}이(가) 관심 있는 눈빛으로 물었다.`
  }
  
  return [situation, greeting, interaction]
}

// 캐릭터 성격 강화 프롬프트 생성
function createEnhancedCharacterPrompt(character: any): { systemPrompt: string, userPrompt: string } {
  const { name, description, personality, tags, creatorName } = character
  
  // 성격 특성 분석
  const desc = description.toLowerCase()
  const personalityTraits = []
  
  if (desc.includes('아이') || desc.includes('어린') || desc.includes('5살')) {
    personalityTraits.push('천진난만하고 호기심 많은 어린아이다운 말투와 행동')
  }
  if (desc.includes('마법') || desc.includes('마계')) {
    personalityTraits.push('마법적이고 신비로운 분위기')
  }
  if (desc.includes('차가운') || desc.includes('냉정') || desc.includes('무뚝뚝')) {
    personalityTraits.push('차갑고 무뚝뚝한 성격, 짧고 건조한 말투')
  }
  if (desc.includes('따뜻한') || desc.includes('다정한')) {
    personalityTraits.push('따뜻하고 다정한 성격, 친근한 말투')
  }
  if (desc.includes('인기') || desc.includes('유명')) {
    personalityTraits.push('인기있지만 거리감을 두는 성격')
  }
  
  const systemPrompt = `당신은 전문적인 시나리오 작가입니다. 
주어진 캐릭터의 상세한 성격, 배경, 말투를 철저히 분석하여 완전히 몰입감 있는 첫 만남 시나리오를 작성해야 합니다.

🎭 캐릭터 몰입 원칙:
- 캐릭터의 성격과 배경에 100% 맞는 말투와 행동 패턴 사용
- 설명과 personality에 명시된 특성을 모든 문장에 반영
- 캐릭터가 실제로 그런 상황에서 어떻게 행동할지 생생하게 묘사

📝 응답 형식: 반드시 3개의 연속된 메시지로 구성
1. 상황 설정 (캐릭터가 등장하는 장면)
2. 첫 인사 (캐릭터의 성격이 잘 드러나는 첫 대사)  
3. 상호작용 유도 (대화를 이어가는 자연스러운 멘트)

💬 톤 매칭 필수사항:
${personalityTraits.length > 0 ? personalityTraits.map(trait => `- ${trait}`).join('\n') : '- 캐릭터 설명에 맞는 독특한 개성 표현'}

⚠️ 중요: JSON 형식 말고 일반 텍스트로 3개 메시지를 순서대로 작성하세요.`

  const userPrompt = `캐릭터 정보:
이름: ${name}
상세 설명: ${description}
성격: ${personality || '정보 없음'}
태그: ${tags.join(', ')}
제작자: ${creatorName}

위 캐릭터의 성격과 배경에 완벽하게 맞는 첫 만남 시나리오를 작성해주세요. 
캐릭터가 실제로 그런 성격이라면 어떻게 말하고 행동할지 생생하게 묘사해주세요.`

  return { systemPrompt, userPrompt }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, personality, tags, creatorName } = body
    
    if (!name || !description) {
      return NextResponse.json(
        { error: 'name과 description은 필수입니다' },
        { status: 400 }
      )
    }
    
    const character = { name, description, personality, tags: tags || [], creatorName: creatorName || 'Guest' }
    console.log('🎭 캐릭터 인트로 생성 요청:', name)
    
    try {
      // 1차 시도: ChatGPT API (우선순위 1)
      const { systemPrompt, userPrompt } = createEnhancedCharacterPrompt(character)
      const result = await tryHardChatGPTSuccess(userPrompt, systemPrompt, name)
      
      return NextResponse.json({
        success: true,
        messages: result.messages,
        generatedBy: 'ChatGPT-SDK',
        character: name,
        model: result.model,
        attempt: result.attempt,
        fallbackAvailable: true // Fallback이 2차 옵션으로 항상 준비됨을 표시
      })
      
    } catch (chatgptError) {
      console.error('❌ ChatGPT API 실패:', chatgptError)
      console.log('🔄 Fallback 시스템으로 전환')
      
      // 2차 시도: 캐릭터 맞춤 Fallback (우선순위 2)
      const fallbackMessages = generateCharacterMatchedFallback(character)
      
      return NextResponse.json({
        success: true,
        messages: fallbackMessages,
        generatedBy: 'Enhanced-Fallback',
        character: name,
        model: 'character-matched-fallback',
        chatgptAttempted: true,
        chatgptError: chatgptError instanceof Error ? chatgptError.message : 'Unknown error'
      })
    }
    
  } catch (error) {
    console.error('🚨 API 전체 실패:', error)
    
    return NextResponse.json(
      { 
        error: '서버 오류가 발생했습니다',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 