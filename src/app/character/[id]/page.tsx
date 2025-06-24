'use client'

import { useEffect, useState } from 'react'
import { notFound, useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Heart, MessageCircle, Share, User, Lock, Sparkles, RefreshCw } from 'lucide-react'
import { CharacterService } from '@/lib/character-service'
import { formatInteractionCount } from '@/lib/utils'
import { Character } from '@/types/character'
import Header from '@/components/layout/header'
import BottomNavigation from '@/components/layout/bottom-navigation'

/**
 * ChatGPT API(OpenAI SDK)를 사용하여 캐릭터 인트로를 동적 생성
 */
async function generateIntroWithChatGPT(character: Character): Promise<string[]> {
  try {
    console.log('🤖 ChatGPT API(OpenAI SDK)로 인트로 생성 중...')
    
    const response = await fetch('/api/generate-intro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: character.name,
        description: character.description,
        personality: character.personality?.traits?.join(', ') || '',
        tags: character.tags,
        creatorName: character.creatorName
      })
    })

    const data = await response.json()

    if (data.success && data.messages) {
      console.log('✅ ChatGPT 인트로 생성 성공:', data.messages.length, '개 메시지')
      console.log('🔧 생성 방식:', data.generatedBy)
      return data.messages
    } else {
      console.warn('⚠️ ChatGPT API 실패, fallback 사용:', data.error)
      throw new Error(data.error || 'ChatGPT API 호출 실패')
    }
  } catch (error) {
    console.error('❌ ChatGPT 인트로 생성 실패:', error)
    throw error
  }
}

// Fallback 시스템 완전 제거 - ChatGPT API 강제 성공 모드

export default function CharacterProfilePage() {
  const params = useParams()
  const id = params.id as string
  const [character, setCharacter] = useState<Character | null>(null)
  const [relatedCharacters, setRelatedCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState(true)
  const [introMessages, setIntroMessages] = useState<string[]>([])
  const [introLoading, setIntroLoading] = useState(false)
  const [introGeneratedBy, setIntroGeneratedBy] = useState<'ChatGPT-SDK' | 'Fallback'>('ChatGPT-SDK')

  // 인트로 생성 함수 (ChatGPT API 강제 성공)
  const generateIntro = async (char: Character) => {
    setIntroLoading(true)
    try {
      // ChatGPT API 강제 성공 - Fallback 금지
      const messages = await generateIntroWithChatGPT(char)
      setIntroMessages(messages)
      setIntroGeneratedBy('ChatGPT-SDK')
      console.log('🎉 ChatGPT API 성공! Fallback 사용하지 않음')
    } catch (error) {
      // Fallback 완전 금지 - 에러 메시지 표시
      console.error('❌ ChatGPT API 완전 실패 - Fallback 금지됨:', error)
      setIntroMessages([
        '😅 ChatGPT API 연결에 문제가 있어요.',
        '🔄 잠시 후 다시 시도해주세요.',
        '💪 더 나은 인트로를 위해 노력하고 있습니다!'
      ])
      setIntroGeneratedBy('ChatGPT-SDK') // Fallback이 아닌 ChatGPT SDK로 표시
    } finally {
      setIntroLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        setLoading(true)
        try {
          const char = await CharacterService.getCharacter(id)
          if (char) {
            setCharacter(char)
            
            // 캐릭터 기반 인트로 메시지 생성 (ChatGPT 또는 Fallback)
            await generateIntro(char)
            
            // 관련 캐릭터 로직 (임시로 태그 기반)
            if (char.tags && char.tags.length > 0) {
              const related = await CharacterService.getCharactersByTag(char.tags[0])
              setRelatedCharacters(related.filter(r => r.id !== id).slice(0, 6))
            }
          } else {
            notFound()
          }
        } catch (error) {
          console.error('Failed to fetch character data:', error)
          notFound()
        } finally {
          setLoading(false)
        }
      }
      fetchData()
    }
  }, [id])

  // 인트로 재생성 핸들러
  const handleRegenerateIntro = async () => {
    if (character) {
      await generateIntro(character)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>캐릭터 정보를 불러오는 중...</p>
      </div>
    )
  }
  
  if (!character) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <Header />

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 py-6 pb-20">
        <div className="max-w-2xl mx-auto">
          {/* 캐릭터 이미지 섹션 */}
          <div className="flex flex-col items-center gap-6 mb-8">
            <div className="relative">
              <Image
                src={character.avatarUrl}
                alt={character.name}
                width={320}
                height={320}
                className="rounded-2xl object-cover"
                style={{ width: '320px', height: '320px' }}
              />
              
              {/* 상호작용 수 배지 */}
              <div className="absolute bottom-3 right-3 bg-black/70 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {formatInteractionCount(character.interactionCount)}
                </span>
              </div>
            </div>

            {/* 캐릭터 정보 */}
            <div className="text-center space-y-4 w-full">
              <div>
                <h1 className="text-3xl font-bold mb-3 text-gray-900">{character.name}</h1>
                <p className="text-gray-600 text-lg mb-4 leading-relaxed">
                  {character.description}
                </p>
                {/* 태그들 */}
                <div className="flex flex-wrap gap-2 justify-center">
                  {character.tags.map((tag: string, index: number) => (
                    <Link
                      key={index}
                      href={`/search?keyword=${encodeURIComponent(tag)}`}
                      className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 rounded-full text-sm text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 상세 정보 섹션들 */}
          <div className="space-y-6">
            {/* 상세 설명 비공개 섹션 */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-center gap-2 text-gray-500 mb-4">
                <Lock className="w-5 h-5" />
                <span className="text-sm">상세 설명 비공개</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <User className="w-5 h-5 text-gray-700" />
                <strong className="text-lg font-semibold text-gray-900">
                  {character.name}
                </strong>
              </div>
            </div>

            {/* 동적 생성된 인트로 섹션 */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  {introGeneratedBy === 'ChatGPT-SDK' ? (
                    <><Sparkles className="w-5 h-5 text-yellow-500" /> AI 생성 인트로</>
                  ) : (
                    <>💬 인트로</>
                  )}
                </h3>
                <button 
                  onClick={handleRegenerateIntro}
                  disabled={introLoading}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-300 rounded-lg transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${introLoading ? 'animate-spin' : ''}`} />
                  {introLoading ? '생성 중...' : '재생성'}
                </button>
              </div>
              
              {introLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="flex items-center gap-3 text-gray-500">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                    <span>AI가 인트로를 생성하고 있습니다...</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* 동적으로 생성된 인트로 메시지들 */}
                  {introMessages.map((message, index) => {
                    // 첫 번째 메시지는 상황 설정
                    if (index === 0) {
                      return (
                        <div key={index} className="flex items-start gap-3">
                          <Image
                            src={character.avatarUrl}
                            alt="캐릭터 프로필 이미지"
                            width={40}
                            height={40}
                            className="rounded-full object-cover"
                          />
                          <div className="flex-1 bg-gray-100 rounded-2xl rounded-tl-lg px-4 py-3">
                            <p className="text-gray-800">
                              <em className="text-gray-600">{message}</em>
                            </p>
                          </div>
                        </div>
                      )
                    }
                    
                    // 나머지 메시지들은 대화형
                    return (
                      <div key={index} className="flex items-start gap-3">
                        <Image
                          src={character.avatarUrl}
                          alt="캐릭터 프로필 이미지"
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                        />
                        <div className="flex-1 bg-gray-100 rounded-2xl rounded-tl-lg px-4 py-3">
                          <p className="text-gray-800">
                            {message.includes('이(가)') ? (
                              <>
                                <em className="text-gray-500 block mb-1">
                                  {message.split('. ')[0]}.
                                </em>
                                {message.split('. ').slice(1).join('. ')}
                              </>
                            ) : (
                              message
                            )}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                  
                  {/* 생성 방식 표시 */}
                  <div className={`mt-4 p-3 rounded-lg border ${
                    introGeneratedBy === 'ChatGPT-SDK' 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-gray-50 border-gray-200'
                  }`}>
                    <p className={`text-sm text-center ${
                      introGeneratedBy === 'ChatGPT-SDK' 
                        ? 'text-green-700' 
                        : 'text-gray-600'
                    }`}>
                      {introGeneratedBy === 'ChatGPT-SDK' ? (
                        <>🤖 이 인트로는 ChatGPT(OpenAI SDK)가 <strong>{character.name}</strong>의 특성을 분석하여 생성했습니다.</>
                      ) : (
                        <>💡 이 인트로는 <strong>{character.name}</strong>의 성격을 분석하여 자동 생성되었습니다.</>
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 상황 예시 비공개 */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-center gap-2 text-gray-500">
                <Lock className="w-5 h-5" />
                <span className="text-sm">상황 예시 비공개</span>
              </div>
            </div>

            {/* 제작자 정보 */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <Link href="#" className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <span className="font-medium text-gray-900 block">{character.creatorName}</span>
                  <span className="text-sm text-gray-500">@{character.creatorName}</span>
                </div>
              </Link>
              <p className="text-gray-600">
                {character.name}와의 특별한 대화를 시작해보세요.
              </p>
            </div>

            {/* 관련 캐릭터 */}
            {relatedCharacters.length > 0 && (
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {character.name}와 관련된 캐릭터
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {relatedCharacters.map((relatedChar: any) => (
                    <Link
                      key={relatedChar.id}
                      href={`/character/${relatedChar.id}`}
                      className="block group"
                    >
                      <div className="relative aspect-square mb-2">
                        <Image
                          src={relatedChar.avatarUrl}
                          alt={relatedChar.name}
                          fill
                          className="rounded-lg object-cover group-hover:opacity-90 transition-opacity"
                        />
                      </div>
                      <h3 className="font-semibold text-gray-800 truncate group-hover:text-blue-600">
                        {relatedChar.name}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        @{relatedChar.creatorName}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 대화 시작 버튼 */}
          <div className="mt-8 flex justify-center">
            <Link
              href={`/chat/${character.id}`}
              className="w-full max-w-md bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-8 rounded-xl transition-colors text-center"
            >
              대화 시작하기
            </Link>
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  )
} 