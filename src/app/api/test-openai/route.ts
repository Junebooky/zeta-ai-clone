import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('=== OpenAI API 테스트 시작 ===')
    
    // API 키 확인
    const openaiApiKey = process.env.OPENAI_API_KEY
    
    console.log('API 키 존재 여부:', !!openaiApiKey)
    if (openaiApiKey) {
      console.log('API 키 길이:', openaiApiKey.length)
      console.log('API 키 시작 부분:', openaiApiKey.substring(0, 15) + '...')
      console.log('API 키 형식 확인:', openaiApiKey.startsWith('sk-'))
    }
    
    if (!openaiApiKey) {
      return NextResponse.json({
        success: false,
        error: 'OPENAI_API_KEY 환경 변수가 설정되지 않았습니다.',
        solution: '.env.local 파일에 OPENAI_API_KEY=your_api_key 를 추가하세요.'
      }, { status: 500 })
    }

    // OpenAI API 테스트 요청
    console.log('OpenAI API 테스트 요청 시작...')
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: '안녕하세요! 간단히 인사말을 해주세요.'
          }
        ],
        max_tokens: 100,
        temperature: 0.7,
      }),
    })

    console.log('API 응답 상태:', response.status, response.statusText)
    console.log('API 응답 헤더:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API 오류 응답:', errorText)
      
      let errorMessage = 'OpenAI API 오류 발생'
      let solution = '알 수 없는 오류입니다.'
      
      try {
        const errorData = JSON.parse(errorText)
        errorMessage = errorData.error?.message || errorText
        
        if (response.status === 401) {
          solution = 'API 키가 유효하지 않습니다. API 키를 확인해주세요.'
        } else if (response.status === 429) {
          solution = 'API 할당량을 초과했습니다. 잠시 후 다시 시도하거나 결제 정보를 확인해주세요.'
        } else if (response.status === 403) {
          solution = 'API 접근이 거부되었습니다. 계정 상태를 확인해주세요.'
        }
      } catch {
        // JSON 파싱 실패 시 원본 텍스트 사용
      }
      
      return NextResponse.json({
        success: false,
        error: errorMessage,
        solution,
        status: response.status,
        details: errorText
      }, { status: response.status })
    }

    const data = await response.json()
    const aiMessage = data.choices[0]?.message?.content

    console.log('✅ OpenAI API 테스트 성공!')
    console.log('AI 응답:', aiMessage)

    return NextResponse.json({
      success: true,
      message: 'OpenAI API 연결 성공!',
      response: aiMessage,
      usage: data.usage,
      model: data.model
    })

  } catch (error) {
    console.error('❌ 테스트 중 예외 발생:', error)
    
    return NextResponse.json({
      success: false,
      error: '테스트 중 예외가 발생했습니다.',
      details: error instanceof Error ? error.message : String(error),
      solution: '네트워크 연결을 확인하거나 잠시 후 다시 시도해주세요.'
    }, { status: 500 })
  }
} 