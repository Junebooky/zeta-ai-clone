import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'



const OPENAI_API_KEY = "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"

// OpenAI 클라이언트 초기화
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    // 요청 데이터 파싱
    const { message, characterId, characterName } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: '메시지가 필요합니다.' },
        { status: 400 }
      )
    }

    // 캐릭터별 시스템 메시지 생성
    const systemMessage = `당신은 ${characterName || '가상의 캐릭터'}입니다. 
이 캐릭터의 성격과 말투를 유지하면서 대화해주세요. 
자연스럽고 친근하게 대화하되, 캐릭터의 개성을 살려서 답변해주세요.`

    // OpenAI API 호출
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: systemMessage
        },
        {
          role: 'user',
          content: message
        }
      ],
      max_tokens: 500,
      temperature: 0.8,
    })

    const aiMessage = completion.choices[0]?.message?.content

    if (!aiMessage) {
      throw new Error('AI 응답을 받지 못했습니다.')
    }

    return NextResponse.json({
      success: true,
      message: aiMessage,
      characterId,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Chat API 에러:', error)

    // OpenAI SDK의 향상된 에러 핸들링
    if (error instanceof OpenAI.APIError) {
      console.error('OpenAI API 에러:', {
        status: error.status,
        message: error.message,
        code: error.code,
      })

      // API 키 문제 확인
      if (error.status === 401) {
        return NextResponse.json(
          { error: 'OpenAI API 키가 유효하지 않습니다.' },
          { status: 401 }
        )
      }

      // 할당량 초과 확인
      if (error.status === 429) {
        return NextResponse.json(
          { error: 'API 사용량 한도를 초과했습니다.' },
          { status: 429 }
        )
      }
    }

    // 백업 응답 (API 실패 시)
    const backupMessages = [
      "죄송해요, 지금 응답하기 어려운 상황이에요. 잠시 후 다시 시도해 주세요!",
      "시스템에 일시적인 문제가 있는 것 같아요. 다시 말씀해 주시겠어요?",
      "연결에 문제가 있네요. 잠깐만 기다려 주세요!",
    ]

    const randomMessage = backupMessages[Math.floor(Math.random() * backupMessages.length)]

    return NextResponse.json({
      success: false,
      message: randomMessage,
      error: '일시적인 서버 오류',
      fallback: true
    }, { status: 200 }) // 사용자에게는 정상 응답으로 처리
  }
}