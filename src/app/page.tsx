'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/layout/header'
import BottomNavigation from '@/components/layout/bottom-navigation'
import BannerCarousel from '@/components/ui/banner-carousel'
import CharacterCard from '@/components/character/character-card'
import TermsModal from '@/components/ui/terms-modal'
import RecommendPage from '@/components/ui/recommend-page'
import CreatePage from '@/components/ui/create-page'
import RankingPage from '@/components/ui/ranking-page'
import { CharacterService } from '@/lib/character-service'
import { Character } from '@/types/character'
import { mockAnnouncements } from '@/lib/mock-data'

export default function HomePage() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'recommend')
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [characters, setCharacters] = useState<Character[]>([])

  useEffect(() => {
    const tab = searchParams.get('tab') || 'recommend'
    setActiveTab(tab)
  }, [searchParams])

  useEffect(() => {
    // CharacterService를 사용하여 Supabase에서 캐릭터 데이터 가져오기
    CharacterService.getCharacters().then(data => {
      setCharacters(data)
    })
  }, [])

  const handleTermsAgree = () => {
    setShowTermsModal(false)
  }

  // 추천 탭이 선택된 경우 추천 페이지 표시
  if (activeTab === 'recommend') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <RecommendPage />
        <BottomNavigation />
        <TermsModal 
          isOpen={showTermsModal} 
          onClose={handleTermsAgree} 
        />
      </div>
    )
  }

  // 랭킹 탭이 선택된 경우 랭킹 페이지 표시
  if (activeTab === 'ranking') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <RankingPage />
        <BottomNavigation />
        <TermsModal 
          isOpen={showTermsModal} 
          onClose={handleTermsAgree} 
        />
      </div>
    )
  }

  // 제작 탭이 선택된 경우 제작 페이지 표시
  if (activeTab === 'create') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <CreatePage onAgree={() => setShowTermsModal(false)} />
        <BottomNavigation />
        <TermsModal 
          isOpen={showTermsModal} 
          onClose={handleTermsAgree} 
        />
      </div>
    )
  }

  // 기본 홈 페이지
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-6 pb-20">
        {/* 배너 캐러셀 */}
        <BannerCarousel announcements={mockAnnouncements} />
        
        {/* 캐릭터 카드 그리드 */}
        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">캐릭터</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {characters.map((character) => (
              <CharacterCard key={character.id} character={character} />
            ))}
          </div>
        </section>
      </main>

      <BottomNavigation />

      <TermsModal 
        isOpen={showTermsModal} 
        onClose={handleTermsAgree} 
      />
    </div>
  )
}
