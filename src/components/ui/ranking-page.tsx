'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import CharacterCard from '@/components/character/character-card'
import { rankingData } from '@/lib/mock-data'
import { Character } from '@/types/character'
import Footer from './footer'

type RankingType = 'REALTIME' | 'DAILY' | 'WEEKLY' | 'MONTHLY'

const rankingTabs = [
  { key: 'REALTIME', label: '실시간', updateInfo: '4분전 업데이트 됨' },
  { key: 'DAILY', label: '일간', updateInfo: '매일 오전 6시에 업데이트 됨' },
  { key: 'WEEKLY', label: '주간', updateInfo: '매주 월요일 오전 6시에 업데이트 됨' },
  { key: 'MONTHLY', label: '월간', updateInfo: '매월 1일 오전 6시에 업데이트 됨' }
] as const

export default function RankingPage() {
  const searchParams = useSearchParams()
  const currentType = (searchParams.get('type') as RankingType) || 'REALTIME'
  
  const getCurrentRankingData = (): Character[] => {
    return rankingData[currentType] || rankingData.REALTIME
  }

  const getCurrentTabInfo = () => {
    return rankingTabs.find(tab => tab.key === currentType) || rankingTabs[0]
  }

  const tabInfo = getCurrentTabInfo()
  const characters = getCurrentRankingData()

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-6 pb-20">
        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {rankingTabs.map((tab) => (
              <Link
                key={tab.key}
                href={`/?tab=ranking&type=${tab.key}`}
                className={`flex-1 text-center py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  currentType === tab.key
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Current Section Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-gray-900">
              {currentType === 'REALTIME' && '🔥 지금 뜨는 랭킹 캐릭터'}
              {currentType === 'DAILY' && '📈 오늘의 랭킹 캐릭터'}
              {currentType === 'WEEKLY' && '⭐ 이번주의 랭킹 캐릭터'}
              {currentType === 'MONTHLY' && '🏆 이달의 랭킹 캐릭터'}
            </h2>
            <Link 
              href={`/?tab=ranking&type=${currentType}`}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              전체보기
            </Link>
          </div>
          <p className="text-sm text-gray-500">{tabInfo.updateInfo}</p>
        </div>

        {/* Ranking List */}
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

          {/* Ranked List */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="space-y-4">
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
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">{character.name}</h3>
                        {character.isNew && (
                          <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded">NEW</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate mb-1">{character.description}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">@{character.creatorName}</span>
                        <span className="text-xs text-blue-600 font-medium">
                          {character.interactionCount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 text-center border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              대화하고 싶은 캐릭터가 없다면
            </h3>
            <p className="text-gray-600 mb-4">
              내가 원하는 캐릭터를 직접 제작해보세요
            </p>
            <Link
              href="/?bottomTab=create"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              캐릭터 제작하기
            </Link>
          </div>
        </div>
      </div>

      {/* 푸터 */}
      <Footer />
    </>
  )
} 