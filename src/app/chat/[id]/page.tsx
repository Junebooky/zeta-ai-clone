'use client'

import { use, useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Send, MoreVertical } from 'lucide-react'
import { mockCharacters } from '@/lib/mock-data'
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

  // 캐릭터 데이터 로드 (임시로 백업 데이터 사용)
  useEffect(() => {
    const loadCharacter = () => {
      try {
        const characterData = mockCharacters.find((char: Character) => char.id === id)
        if (!characterData) {
          notFound()
        }
        
        // 기본 성격 정보 추가
        const characterWithPersonality: Character = {
          ...characterData,
          personality: {
            traits: ['친근함', '대화를 좋아함'],
            speechStyle: '자연스럽고 친근한 말투',
            background: '다양한 경험을 가진 캐릭터',
            interests: ['대화', '새로운 만남'],
            relationships: '친구처럼 편안하게 대화하고 싶어함'
          }
        }
        
        setCharacter(characterWithPersonality)
      } catch (error) {
        console.error('캐릭터 로딩 실패:', error)
        notFound()
      } finally {
        setIsLoading(false)
      }
    }

    loadCharacter()
  }, [id])

  // 캐릭터가 로드되면 인사 메시지 추가
  useEffect(() => {
    if (character) {
      setMessages([{
        id: '1',
        content: `안녕하세요! 저는 ${character.name}입니다. 오늘은 어떤 이야기를 나누고 싶으신가요?`,
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
      console.log('ChatGPT API 호출 시작:', {
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

      console.log('API 응답 상태:', response.status, response.statusText)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('API 오류 응답:', errorText)
        throw new Error(`API 호출 실패: ${response.status} ${errorText}`)
      }

      const data = await response.json()
      console.log('ChatGPT 응답 데이터:', data)

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
      console.error('ChatGPT API 오류:', error)
      // ChatGPT API 실패 시 백업 응답 사용
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `[백업 응답] ${getAiResponse(userInput)}`,
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
    } finally {
      setIsAiResponding(false)
    }
  }

  // 기존 AI 응답 함수 (ChatGPT API 백업용으로 유지)
  const getAiResponse = (userInput: string): string => {
    const responses = [
      "흥미로운 이야기네요! 더 자세히 들려주세요.",
      "그렇군요. 그래서 어떻게 되었나요?",
      "정말요? 저도 그런 경험이 있어요.",
      "와, 정말 재미있는 이야기네요!",
      "그런 생각을 해본 적이 있어요. 더 이야기해주세요.",
      "좋은 질문이네요. 제 생각에는...",
      "그런 관점에서 생각해본 적이 없었어요!",
      "정말 흥미진진한 이야기입니다.",
    ]
    return responses[Math.floor(Math.random() * responses.length)]
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
                <span className="text-xs text-gray-500">입력중...</span>
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