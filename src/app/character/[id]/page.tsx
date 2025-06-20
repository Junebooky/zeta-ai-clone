'use client'

import { useEffect, useState } from 'react'
import { notFound, useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Heart, MessageCircle, Share, User, Lock } from 'lucide-react'
import { CharacterService } from '@/lib/character-service'
import { formatInteractionCount } from '@/lib/utils'
import { Character } from '@/types/character'
import Header from '@/components/layout/header'
import BottomNavigation from '@/components/layout/bottom-navigation'

export default function CharacterProfilePage() {
  const params = useParams()
  const id = params.id as string
  const [character, setCharacter] = useState<Character | null>(null)
  const [relatedCharacters, setRelatedCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        setLoading(true)
        try {
          const char = await CharacterService.getCharacter(id)
          if (char) {
            setCharacter(char)
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
                      {tag}
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

            {/* 인트로 섹션 */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">인트로</h3>
              <div className="space-y-4">
                {/* 인트로 대화 메시지들 */}
                <div className="flex items-start gap-3">
                  <Image
                    src={character.avatarUrl}
                    alt="캐릭터 프로필 이미지"
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                  <div className="flex-1 bg-gray-100 rounded-2xl rounded-tl-lg px-4 py-3">
                    <p className="text-gray-800">
                      <em className="text-gray-500 block mb-1">
                        당신은 {character.creatorName}에게 호출을 받아 찾아왔다.
                      </em>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Image
                    src={character.avatarUrl}
                    alt="캐릭터 프로필 이미지"
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                  <div className="flex-1 bg-gray-100 rounded-2xl rounded-tl-lg px-4 py-3">
                    <p className="text-gray-800">
                      <em className="text-gray-500">
                        {character.name}이(가) 당신을 바라보며 미소를 지었다.
                      </em>{' '}
                      안녕? 기다리고 있었어.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Image
                    src={character.avatarUrl}
                    alt="캐릭터 프로필 이미지"
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                  <div className="flex-1 bg-gray-100 rounded-2xl rounded-tl-lg px-4 py-3">
                    <p className="text-gray-800">
                      <em className="text-gray-500">
                        {character.name}이(가) 당신에게 다가와서 말했다.
                      </em>{' '}
                      오늘은 뭘 해볼까?
                    </p>
                  </div>
                </div>
              </div>
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