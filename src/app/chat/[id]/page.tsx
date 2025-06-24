'use client'

import { use, useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Send, MoreVertical } from 'lucide-react'
import { CharacterService } from '@/lib/character-service'
import { Character } from '@/types/character'

interface ChatPageProps {
  params: Promise<{ id: string }>
}

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

export default function ChatPage({ params }: ChatPageProps) {
  const { id } = use(params)
  
  // 모든 state를 상단에 선언 (Hooks 순서 문제 해결)
  const [character, setCharacter] = useState<Character | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [isAiResponding, setIsAiResponding] = useState(false)
  const [inputText, setInputText] = useState('')

  // 캐릭터 데이터 로드 (실제 데이터베이스 사용)
  useEffect(() => {
    const loadCharacter = async () => {
      try {
        console.log('🔍 캐릭터 로딩 시작:', id)
        const characterData = await CharacterService.getCharacter(id)
        
        if (!characterData) {
          console.error('❌ 캐릭터를 찾을 수 없음:', id)
          notFound()
          return
        }
        
        console.log('✅ 캐릭터 로딩 성공:', characterData.name)
        
        // 기본 성격 정보 보강
        const characterWithPersonality: Character = {
          ...characterData,
          personality: characterData.personality || {
            traits: ['친근함', '대화를 좋아함'],
            speechStyle: '자연스럽고 친근한 말투',
            background: '다양한 경험을 가진 캐릭터',
            interests: ['대화', '새로운 만남'],
            relationships: '친구처럼 편안하게 대화하고 싶어함'
          }
        }
        
        setCharacter(characterWithPersonality)
      } catch (error) {
        console.error('❌ 캐릭터 로딩 실패:', error)
        notFound()
      } finally {
        setIsLoading(false)
      }
    }

    loadCharacter()
  }, [id])

  // 캐릭터가 로드되면 캐릭터 맞춤 인사 메시지 추가
  useEffect(() => {
    if (character) {
      // 캐릭터의 성격과 배경에 맞는 인사말 생성
      const generatePersonalizedGreeting = () => {
        const description = character.description.toLowerCase()
        const name = character.name
        
        // 캐릭터 특성 분석
        const isChildlike = description.includes('아이') || description.includes('어린') || description.includes('5살')
        const isCold = description.includes('차가운') || description.includes('냉정') || description.includes('무뚝뚝')
        const isWarm = description.includes('따뜻한') || description.includes('다정한') || description.includes('누나')
        const isMagical = description.includes('마법') || description.includes('마계')
        const isPopular = description.includes('인기') || description.includes('유명')
        const isStudent = description.includes('학생') || description.includes('학교') || description.includes('대학')
        
        let greeting = ''
        
        if (isMagical && isChildlike) {
          greeting = `안녕! 나는 ${name}이야! 마법을 좋아해? 우리 같이 재미있는 이야기 해볼까?`
        } else if (isPopular && isStudent) {
          greeting = `안녕하세요. ${name}입니다. 오늘은 어떤 이야기를 나누고 싶으신가요?`
        } else if (isCold) {
          greeting = `...${name}이다. 뭔가 할 말이 있나?`
        } else if (isWarm) {
          greeting = `안녕하세요~ ${name}이에요. 편하게 이야기해주세요!`
        } else if (isChildlike) {
          greeting = `안녕! ${name}이야! 우리 친구가 될래?`
        } else {
          greeting = `안녕하세요! 저는 ${name}입니다. 만나서 반가워요!`
        }
        
        return greeting
      }
      
      setMessages([{
        id: '1',
        content: generatePersonalizedGreeting(),
        isUser: false,
        timestamp: new Date()
      }])
    }
  }, [character])

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">캐릭터 정보를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  // 캐릭터가 없을 때
  if (!character) {
    notFound()
  }

  const sendMessage = async () => {
    if (!inputText.trim() || isAiResponding) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputText,
      isUser: true,
      timestamp: new Date()
    }

    const userInput = inputText
    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsAiResponding(true)

    try {
      console.log('🤖 ChatGPT API 호출 시작:', {
        characterId: character.id,
        characterName: character.name,
        hasPersonality: !!character.personality,
        userInput
      })

      // ChatGPT API 호출
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userInput,
          characterId: character.id,
          characterName: character.name,
          characterDescription: character.description,
          characterTags: character.tags,
          personality: character.personality
        }),
      })

      console.log('📡 API 응답 상태:', response.status, response.statusText)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ API 오류 응답:', errorText)
        throw new Error(`API 호출 실패: ${response.status} ${errorText}`)
      }

      const data = await response.json()
      console.log('✅ ChatGPT 응답 데이터:', data)

      if (!data.message) {
        throw new Error('응답에 메시지가 없습니다')
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message,
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])

    } catch (error) {
      console.error('❌ ChatGPT API 오류:', error)
      console.log('🔄 Fallback 시스템 사용')
      
      // ChatGPT API 실패 시 캐릭터 맞춤 백업 응답 사용
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getPersonalizedAiResponse(userInput, character),
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
    } finally {
      setIsAiResponding(false)
    }
  }

  // 캐릭터 맞춤 AI 응답 함수 (Fallback 시스템 복원 및 개선)
  const getPersonalizedAiResponse = (userInput: string, character: Character): string => {
    const description = character.description.toLowerCase()
    const name = character.name
    const input = userInput.toLowerCase()
    
    // 캐릭터 특성 분석
    const isChildlike = description.includes('아이') || description.includes('어린') || description.includes('5살')
    const isCold = description.includes('차가운') || description.includes('냉정') || description.includes('무뚝뚝')
    const isWarm = description.includes('따뜻한') || description.includes('다정한') || description.includes('누나')
    const isMagical = description.includes('마법') || description.includes('마계')
    const isPopular = description.includes('인기') || description.includes('유명')
    const isStudent = description.includes('학생') || description.includes('학교') || description.includes('대학')
    
    // 입력 키워드 분석
    const isQuestion = input.includes('?') || input.includes('뭐') || input.includes('어떻') || input.includes('왜')
    const isGreeting = input.includes('안녕') || input.includes('hi') || input.includes('hello')
    const isCompliment = input.includes('예쁘') || input.includes('멋있') || input.includes('좋')
    
    let responses: string[] = []
    
    if (isMagical && isChildlike) {
      if (isQuestion) {
        responses = [
          `응응! 그거 정말 궁금하다! 마법으로 알아볼까?`,
          `오오! 재미있는 질문이야! 나도 그거 궁금했어!`,
          `히히, 그런 거 물어보는구나! 마법책에서 본 것 같은데...`
        ]
      } else if (isGreeting) {
        responses = [
          `안녕! 오늘도 마법 연습하러 왔어?`,
          `히히, 안녕! 오늘은 뭔가 특별한 일이 있을 것 같아!`
        ]
      } else {
        responses = [
          `와! 정말 재미있는 이야기야! 더 들려줘!`,
          `오오! 마법처럼 신기한 일이네!`,
          `히히, 그런 일이 있었구나! 나도 비슷한 경험이 있어!`
        ]
      }
    } else if (isPopular && isStudent) {
      if (isCompliment) {
        responses = [
          `고마워요... 그런 말 들으니까 부끄럽네요.`,
          `아, 별로 그런 거 아닌데... 하지만 고마워요.`,
          `에이, 그런 말씀 말아요... 민망해요.`
        ]
      } else if (isQuestion) {
        responses = [
          `음... 그런 걸 물어보시다니. 사실 잘 모르겠어요.`,
          `그런 거요? 글쎄요... 별로 관심 없었는데.`,
          `왜 그런 걸 궁금해하세요? 특별한 이유가 있나요?`
        ]
      } else {
        responses = [
          `아, 그렇군요. 별로 흥미롭진 않지만...`,
          `음... 그런 일이 있었나 보네요.`,
          `뭔가 복잡한 이야기같네요.`
        ]
      }
    } else if (isCold) {
      if (isQuestion) {
        responses = [
          `...그런 걸 왜 물어보지?`,
          `별로 대답하고 싶지 않은데.`,
          `그런 거 알아서 뭐 할 건데?`
        ]
      } else {
        responses = [
          `...그래서?`,
          `별로 관심 없어.`,
          `뭔가 말하고 싶은 게 있다면 빨리 해.`
        ]
      }
    } else if (isWarm) {
      if (isQuestion) {
        responses = [
          `오~ 좋은 질문이네요! 제가 아는 걸로는요...`,
          `그런 게 궁금하셨구나! 저도 그거 생각해본 적 있어요~`,
          `와, 정말 흥미로운 질문이에요! 같이 생각해볼까요?`
        ]
      } else {
        responses = [
          `정말요? 너무 재미있는 이야기네요!`,
          `와~ 그런 일이 있으셨구나! 더 자세히 들려주세요!`,
          `그런 경험을 하셨다니! 정말 흥미진진해요~`
        ]
      }
    } else {
      // 기본 응답
      if (isQuestion) {
        responses = [
          `흥미로운 질문이네요! 제가 생각해보니...`,
          `그런 걸 궁금해하시는군요. 저도 한 번 생각해볼게요.`,
          `좋은 질문이에요! 어떻게 답변드려야 할까요?`
        ]
      } else {
        responses = [
          `정말 흥미로운 이야기네요! 더 자세히 들려주세요.`,
          `그렇군요. 그래서 어떻게 되었나요?`,
          `와, 정말 재미있는 경험이셨겠어요!`
        ]
      }
    }
    
    const selectedResponse = responses[Math.floor(Math.random() * responses.length)]
    return `[Fallback] ${selectedResponse}`
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <Link href={`/character/${character.id}`} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </Link>
            <div className="flex items-center gap-3">
              <Image
                src={character.avatarUrl}
                alt={character.name}
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900">{character.name}</span>
                <span className="text-xs text-green-600">온라인</span>
              </div>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </header>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-20">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            {!message.isUser && (
              <Image
                src={character.avatarUrl}
                alt={character.name}
                width={36}
                height={36}
                className="rounded-full object-cover flex-shrink-0"
              />
            )}
            <div
              className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                message.isUser
                  ? 'bg-blue-600 text-white rounded-br-md'
                  : 'bg-white border border-gray-200 text-gray-900 rounded-bl-md'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <span className={`text-xs block mt-1 ${
                message.isUser ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            {message.isUser && (
              <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-medium text-white">나</span>
              </div>
            )}
          </div>
        ))}
        
        {/* AI 응답 중 표시 */}
        {isAiResponding && (
          <div className="flex gap-3 justify-start">
            <Image
              src={character.avatarUrl}
              alt={character.name}
              width={36}
              height={36}
              className="rounded-full object-cover flex-shrink-0"
            />
            <div className="bg-white border border-gray-200 text-gray-900 rounded-2xl rounded-bl-md px-4 py-2">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-xs text-gray-500">{character.name}이(가) 입력중...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 입력 영역 */}
      <div className="border-t border-gray-200 bg-white p-4">
        <div className="flex items-end gap-3 max-w-7xl mx-auto">
          <div className="flex-1 relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`${character.name}에게 메시지를 보내세요...`}
              className="w-full bg-gray-50 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-2xl px-4 py-3 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={1}
              style={{ minHeight: '44px', maxHeight: '100px' }}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!inputText.trim() || isAiResponding}
            className="w-11 h-11 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-colors"
          >
            {isAiResponding ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Send className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
} 