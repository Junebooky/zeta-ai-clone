'use client'

import { useState, useEffect } from 'react'
import { ChevronRight } from 'lucide-react'
import { CharacterService } from '@/lib/character-service'
import WebtoonCard from './webtoon-card'
import BattleCard from './battle-card'
import CharacterCard from '@/components/character/character-card'
import { Character } from '@/types/character'

export default function HomePage() {
  const [webtoons, setWebtoons] = useState<any[]>([])
  const [battleCharacters, setBattleCharacters] = useState<Character[]>([])
  const [marketCharacters, setMarketCharacters] = useState<Character[]>([])
  const [contestCharacters, setContestCharacters] = useState<Character[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const [webtoonsData, charactersData] = await Promise.all([
          CharacterService.getWebtoonRanking(),
          CharacterService.getCharacters(),
        ])

        setWebtoons(webtoonsData)
        // 데이터 소스를 분리하여 각 섹션에 할당
        setBattleCharacters(charactersData.slice(0, 2))
        setMarketCharacters(charactersData.slice(2, 8)) // 6개 아이템
        setContestCharacters(charactersData.slice(8, 13)) // 5개 아이템
      } catch (error) {
        console.error('데이터 로딩 실패:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-24 space-y-8">
      {/* Section 1: 웹툰 랭킹 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">#1. 웹툰 (게시)순위</h2>
          <button className="text-sm text-gray-600 hover:text-blue-600 flex items-center gap-1">
            더보기
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {isLoading ? (
            // 로딩 스켈레톤
            Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 h-80 animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))
          ) : (
            webtoons.map((webtoon) => (
              <WebtoonCard key={webtoon.id} webtoon={webtoon} />
            ))
          )}
        </div>
      </section>

      {/* Section 2: 투표 배틀 */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">#2. 금주의 배틀</h2>
        </div>
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isLoading || battleCharacters.length < 2 ? (
              // 로딩 스켈레톤
              Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg border border-gray-200 animate-pulse">
                  <div className="aspect-square bg-gray-200"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="flex gap-2">
                      <div className="flex-1 h-8 bg-gray-200 rounded"></div>
                      <div className="flex-1 h-8 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              battleCharacters.map((character, index) => {
                const side = index === 0 ? 'A' : 'B'
                const totalVotes = battleCharacters.reduce((sum, char) => sum + char.interactionCount, 0)
                const percentage = totalVotes > 0 ? Math.round((character.interactionCount / totalVotes) * 100) : 50
                
                return (
                  <BattleCard
                    key={character.id}
                    character={character}
                    side={side}
                    percentage={percentage}
                    voteCount={character.interactionCount}
                    onVote={() => console.log(`Voted for ${side}: ${character.name}`)}
                    onViewOpinions={() => console.log(`View opinions for ${character.name}`)}
                  />
                )
              })
            )}
          
            {/* VS 중앙 표시 (데스크톱에서만) */}
            {battleCharacters.length >= 2 && (
              <div className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-4 border-4 border-gray-200 shadow-lg z-10">
                <span className="text-2xl font-bold text-gray-400">VS</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section 3: 도구 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">#3. 도구</h2>
          <button className="text-sm text-gray-600 hover:text-blue-600 flex items-center gap-1">
            더보기
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 템플릿 */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">템플릿</h3>
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="aspect-square bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
          
          {/* 도구 */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">도구</h3>
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="aspect-square bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: 마켓 - CharacterCard 스타일 사용 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">#4. 마켓</h2>
          <button className="text-sm text-gray-600 hover:text-blue-600 flex items-center gap-1">
            더보기
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 aspect-square animate-pulse">
                <div className="w-full h-full bg-gray-200 rounded-lg"></div>
              </div>
            ))
          ) : (
            marketCharacters.map((character) => (
              <CharacterCard key={character.id} character={character} />
            ))
          )}
        </div>
      </section>

      {/* Section 5: 이달의 공모 - CharacterCard 스타일 사용 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">#5. 이달의 공모</h2>
            <p className="text-sm text-gray-600 mt-1">2025 아이디어 디자인 공모전</p>
          </div>
          <button className="text-sm text-gray-600 hover:text-blue-600 flex items-center gap-1">
            더보기
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 aspect-square animate-pulse">
                <div className="w-full h-full bg-gray-200 rounded-lg"></div>
              </div>
            ))
          ) : (
            contestCharacters.map((character) => (
              <CharacterCard key={character.id} character={character} />
            ))
          )}
        </div>
      </section>
    </div>
  )
}