'use client'

import React from 'react'
import { Search } from 'lucide-react'
import CharacterCard from '@/components/character/character-card'
import { mockCharacters } from '@/lib/mock-data'
import Footer from './footer'

const RecommendPage = () => {
  // 캐릭터들을 상호작용 수에 따라 정렬 (TOP 10용)
  const topCharacters = [...mockCharacters]
    .sort((a, b) => b.interactionCount - a.interactionCount)
    .slice(0, 10)

  // 새로운 캐릭터들 (isNew 플래그가 있는 것들)
  const newCharacters = mockCharacters.filter(char => char.isNew)

  // 추천 캐릭터들 (상호작용 수가 중간 정도인 것들)
  const recommendedCharacters = mockCharacters
    .filter(char => !char.isNew && char.interactionCount > 50000 && char.interactionCount < 500000)

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-6 pb-20">
        {/* 검색 섹션 */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="원하는 캐릭터를 찾아보세요"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* 실시간 TOP 10 섹션 */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">🔥 실시간 TOP 10</h2>
            <button className="text-sm text-gray-500 hover:text-gray-700">
              더보기
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {topCharacters.slice(0, 12).map((character, index) => (
              <div key={character.id} className="relative">
                {/* 순위 배지 */}
                <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {index + 1}
                </div>
                <CharacterCard character={character} />
              </div>
            ))}
          </div>
        </section>

        {/* 오늘만큼은 나도 암파에일 섹션 */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">🧛‍♀️ 오늘만큼은 나도 암파에일</h2>
            <button className="text-sm text-gray-500 hover:text-gray-700">
              더보기
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {recommendedCharacters.slice(0, 6).map((character) => (
              <CharacterCard key={character.id} character={character} />
            ))}
          </div>
        </section>

        {/* 이제 막 주목받기 시작한 캐릭터들 섹션 */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">✨ 이제 막 주목받기 시작한 캐릭터들</h2>
            <button className="text-sm text-gray-500 hover:text-gray-700">
              더보기
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {newCharacters.map((character) => (
              <CharacterCard key={character.id} character={character} />
            ))}
          </div>
        </section>

        {/* 인기 급상승 캐릭터들 섹션 */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">📈 인기 급상승 캐릭터들</h2>
            <button className="text-sm text-gray-500 hover:text-gray-700">
              더보기
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {mockCharacters.slice(4, 10).map((character) => (
              <CharacterCard key={character.id} character={character} />
            ))}
          </div>
        </section>
      </div>

      {/* 푸터 */}
      <Footer />
    </>
  )
}

export default RecommendPage 