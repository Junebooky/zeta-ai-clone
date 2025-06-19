'use client'

import { use, useState } from 'react'
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
  
  // 캐릭터 데이터 찾기
  const character = mockCharacters.find(char => char.id === id)
  
  if (!character) {
    notFound()
  }

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `안녕하세요! 저는 ${character.name}입니다. 오늘은 어떤 이야기를 나누고 싶으신가요?`,
      isUser: false,
      timestamp: new Date()
    }
  ])
  
  const [inputText, setInputText] = useState('')

  const sendMessage = () => {
    if (!inputText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputText,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')

    // 간단한 AI 응답 시뮬레이션
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getAiResponse(inputText),
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
    }, 1000)
  }

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
            disabled={!inputText.trim()}
            className="w-11 h-11 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-colors"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
} 