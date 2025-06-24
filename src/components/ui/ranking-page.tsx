'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import CharacterCard from '@/components/character/character-card'
import { CharacterService } from '@/lib/character-service'
import { Character } from '@/types/character'
import Footer from './footer'

type RankingType = 'REALTIME' | 'DAILY' | 'WEEKLY' | 'MONTHLY'

const rankingOptions = [
  { id: 'REALTIME', label: '실시간', value: 'REALTIME' },
  { id: 'DAILY', label: '일간', value: 'DAILY' },
  { id: 'WEEKLY', label: '주간', value: 'WEEKLY' },
  { id: 'MONTHLY', label: '월간', value: 'MONTHLY' }
]

export default function RankingPage() {
  const searchParams = useSearchParams()
  const [activeRanking, setActiveRanking] = useState<RankingType>('REALTIME')
  const [characters, setCharacters] = useState<Character[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadCharacters = async () => {
      try {
        setIsLoading(true)
        console.log('🏆 Ranking Page: 캐릭터 데이터 로딩 시작...')
        
        // CharacterService를 통해 실제 Supabase 데이터 가져오기
        const charactersData = await CharacterService.getCharacters()
        
        // interactionCount 기준 내림차순 정렬 (사용자 요구사항)
        const sortedCharacters = charactersData.sort((a, b) => 
          b.interactionCount - a.interactionCount
        )
        
        console.log(`🏆 Ranking Page: ${sortedCharacters.length}개 캐릭터 정렬 완료`)
        console.log('🏆 Top 3 캐릭터:', sortedCharacters.slice(0, 3).map(c => `${c.name}: ${c.interactionCount}`))
        
        setCharacters(sortedCharacters)
      } catch (error) {
        console.error('🏆 Ranking Page: 데이터 로딩 실패:', error)
        setCharacters([])
      } finally {
        setIsLoading(false)
      }
    }

    loadCharacters()
  }, [activeRanking]) // activeRanking 변경 시에도 재로딩

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-6 pb-20">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">🏆 캐릭터 랭킹</h1>
          <p className="text-gray-600">인기도 기준으로 정렬된 캐릭터들을 확인해보세요</p>
        </div>

        {/* 랭킹 타입 선택 탭 */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg max-w-md">
            {rankingOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setActiveRanking(option.value as RankingType)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex-1 ${
                  activeRanking === option.value
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* 로딩 상태 */}
        {isLoading ? (
          <div className="space-y-6">
            {/* Top 3 스켈레톤 */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🏆 Top 3</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-lg border border-gray-200 h-80 animate-pulse">
                    <div className="aspect-square bg-gray-200"></div>
                    <div className="p-3 space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* 나머지 랭킹 스켈레톤 */}
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg animate-pulse">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : characters.length === 0 ? (
          // 데이터가 없는 경우
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🤔</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">아직 랭킹 데이터가 없습니다</h3>
            <p className="text-gray-600 mb-4">캐릭터를 생성하고 인기를 얻어보세요!</p>
            <Link 
              href="/?bottomTab=create" 
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              첫 캐릭터 만들기
            </Link>
          </div>
        ) : (
          // 실제 랭킹 데이터 표시
          <div className="space-y-6">
            {/* Top 3 Special Display */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🏆 Top 3</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {characters.slice(0, 3).map((character, index) => (
                  <div key={character.id} className="relative">
                    <div className="absolute -top-2 -left-2 z-10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                        index === 0 ? 'bg-yellow-500' : 
                        index === 1 ? 'bg-gray-400' : 'bg-orange-400'
                      }`}>
                        {index + 1}
                      </div>
                    </div>
                    <CharacterCard character={character} />
                  </div>
                ))}
              </div>
            </div>

            {/* Ranked List (4위 이하) */}
            {characters.length > 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">📊 전체 랭킹</h3>
                {characters.slice(3).map((character, index) => (
                  <div key={character.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                      {index + 4}
                    </div>
                    <Link href={`/character/${character.id}`} className="flex-1 flex items-center gap-4 hover:opacity-80 transition-opacity">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-200">
                        <img 
                          src={character.avatarUrl} 
                          alt={character.name}
                          className="w-full h-full object-cover"
                        />
                        {character.isVerified && (
                          <div className="absolute top-1 right-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {character.creatorName}의 {character.name}
                        </h4>
                        <p className="text-sm text-gray-600 truncate">
                          {character.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-blue-600 font-medium">
                            ❤️ {character.interactionCount.toLocaleString()}
                          </span>
                          {character.isNew && (
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">
                              NEW
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {/* 통계 정보 */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">📈 랭킹 통계</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{characters.length}</div>
                  <div className="text-sm text-gray-600">총 캐릭터</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {characters.reduce((sum, char) => sum + char.interactionCount, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">총 상호작용</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {characters.filter(char => char.isNew).length}
                  </div>
                  <div className="text-sm text-gray-600">신규 캐릭터</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {characters.filter(char => char.isVerified).length}
                  </div>
                  <div className="text-sm text-gray-600">인증 캐릭터</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 푸터 */}
      <Footer />
    </>
  )
} 