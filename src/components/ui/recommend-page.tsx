'use client'

import React, { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import CharacterCard from '@/components/character/character-card'
import { CharacterService } from '@/lib/character-service'
import { Character } from '@/types/character'
import Footer from './footer'

const RecommendPage = () => {
  const [topRankedCharacters, setTopRankedCharacters] = useState<Character[]>([])
  const [newCharacters, setNewCharacters] = useState<Character[]>([])
  const [allCharacters, setAllCharacters] = useState<Character[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const loadRecommendationData = async () => {
      try {
        setIsLoading(true)
        console.log('✨ Recommendation Page: 데이터 로딩 시작...')
        
        // CharacterService를 통해 실제 Supabase 데이터 가져오기
        const charactersData = await CharacterService.getCharacters()
        
        console.log(`✨ 총 ${charactersData.length}개 캐릭터 로딩 완료`)
        
        // 1. 상위 랭킹 캐릭터 (interactionCount 기준 상위 10개)
        const topRanked = charactersData
          .sort((a, b) => b.interactionCount - a.interactionCount)
          .slice(0, 10)
        
        // 2. 신규 캐릭터 (created_at 기준 최신순, isNew 우선)
        const newChars = charactersData
          .filter(char => {
            // 최근 7일 내 생성된 캐릭터 또는 isNew 플래그가 있는 캐릭터
            const createdAt = new Date(char.created_at || Date.now())
            const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            return char.isNew || createdAt > sevenDaysAgo
          })
          .sort((a, b) => {
            // isNew가 있는 캐릭터 우선, 그 다음 created_at 최신순
            if (a.isNew && !b.isNew) return -1
            if (!a.isNew && b.isNew) return 1
            return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
          })
          .slice(0, 12)
        
        console.log(`✨ 상위 랭킹: ${topRanked.length}개, 신규 캐릭터: ${newChars.length}개`)
        
        setTopRankedCharacters(topRanked)
        setNewCharacters(newChars)
        setAllCharacters(charactersData)
      } catch (error) {
        console.error('✨ Recommendation Page: 데이터 로딩 실패:', error)
        setTopRankedCharacters([])
        setNewCharacters([])
        setAllCharacters([])
      } finally {
        setIsLoading(false)
      }
    }

    loadRecommendationData()
  }, [])

  // 검색 필터링
  const filteredCharacters = allCharacters.filter(char =>
    searchQuery.trim() === '' || 
    char.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    char.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    char.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const LoadingSkeleton = ({ count }: { count: number }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg border border-gray-200 h-80 animate-pulse">
          <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
          <div className="p-3 space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-6 pb-20">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">✨ 추천 캐릭터</h1>
          <p className="text-gray-600">인기 캐릭터와 새로운 캐릭터들을 만나보세요</p>
        </div>

        {/* 검색 섹션 */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="원하는 캐릭터를 찾아보세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* 검색 결과가 있을 때 */}
        {searchQuery.trim() !== '' && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                🔍 검색 결과 ({filteredCharacters.length}개)
              </h2>
            </div>
            {isLoading ? (
              <LoadingSkeleton count={12} />
            ) : filteredCharacters.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🤔</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">검색 결과가 없습니다</h3>
                <p className="text-gray-600">다른 키워드로 검색해보세요</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filteredCharacters.map((character) => (
                  <CharacterCard key={character.id} character={character} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* 검색 중이 아닐 때만 추천 섹션들 표시 */}
        {searchQuery.trim() === '' && (
          <>
            {/* 실시간 TOP 10 섹션 (상위 랭킹) */}
            <section className="mb-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">🔥 실시간 TOP 10</h2>
                <button 
                  onClick={() => window.location.href = '/?tab=ranking'}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  더보기
                </button>
              </div>
              {isLoading ? (
                <LoadingSkeleton count={10} />
              ) : topRankedCharacters.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📊</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">아직 랭킹 데이터가 없습니다</h3>
                  <p className="text-gray-600">캐릭터들이 더 많은 상호작용을 받으면 랭킹이 표시됩니다</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {topRankedCharacters.map((character, index) => (
                    <div key={character.id} className="relative">
                      {/* 순위 배지 */}
                      <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                        {index + 1}
                      </div>
                      <CharacterCard character={character} />
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* 이제 막 주목받기 시작한 캐릭터들 섹션 (신규 캐릭터) */}
            <section className="mb-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">🆕 이제 막 주목받기 시작한 캐릭터들</h2>
                <button 
                  onClick={() => window.location.href = '/?tab=character'}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  더보기
                </button>
              </div>
              {isLoading ? (
                <LoadingSkeleton count={12} />
              ) : newCharacters.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🌟</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">새로운 캐릭터가 없습니다</h3>
                  <p className="text-gray-600 mb-4">첫 번째 신규 캐릭터를 만들어보세요!</p>
                  <button 
                    onClick={() => window.location.href = '/?bottomTab=create'}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    캐릭터 만들기
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {newCharacters.map((character) => (
                    <CharacterCard key={character.id} character={character} />
                  ))}
                </div>
              )}
            </section>

            {/* 오늘만큼은 나도 암파에일 섹션 (중간 인기 캐릭터들) */}
            <section className="mb-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">🧛‍♀️ 오늘만큼은 나도 암파에일</h2>
                <button 
                  onClick={() => window.location.href = '/?tab=character'}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  더보기
                </button>
              </div>
              {isLoading ? (
                <LoadingSkeleton count={6} />
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {allCharacters
                    .filter(char => !topRankedCharacters.includes(char) && !newCharacters.includes(char))
                    .filter(char => char.interactionCount > 50000 && char.interactionCount < 500000)
                    .slice(0, 6)
                    .map((character) => (
                      <CharacterCard key={character.id} character={character} />
                    ))}
                </div>
              )}
            </section>

            {/* 인기 급상승 캐릭터들 섹션 */}
            <section className="mb-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">📈 인기 급상승 캐릭터들</h2>
                <button 
                  onClick={() => window.location.href = '/?tab=character'}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  더보기
                </button>
              </div>
              {isLoading ? (
                <LoadingSkeleton count={6} />
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {allCharacters
                    .filter(char => !topRankedCharacters.includes(char) && !newCharacters.includes(char))
                    .slice(0, 6)
                    .map((character) => (
                      <CharacterCard key={character.id} character={character} />
                    ))}
                </div>
              )}
            </section>

            {/* 통계 정보 */}
            <section className="mb-10">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 추천 통계</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{topRankedCharacters.length}</div>
                    <div className="text-sm text-gray-600">TOP 랭킹</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{newCharacters.length}</div>
                    <div className="text-sm text-gray-600">신규 캐릭터</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{allCharacters.length}</div>
                    <div className="text-sm text-gray-600">전체 캐릭터</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {allCharacters.filter(char => char.isVerified).length}
                    </div>
                    <div className="text-sm text-gray-600">인증 캐릭터</div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </div>

      {/* 푸터 */}
      <Footer />
    </>
  )
}

export default RecommendPage 