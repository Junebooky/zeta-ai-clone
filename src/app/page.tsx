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
import { mockCharacters, mockAnnouncements } from '@/lib/mock-data'

export default function HomePage() {
  const [showTermsModal, setShowTermsModal] = useState(false)
  const searchParams = useSearchParams()
  const currentTab = searchParams.get('tab') || 'home'
  const currentBottomTab = searchParams.get('bottomTab') || 'home'

  // 페이지 로드 시 약관 동의 여부 확인
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasAgreed = localStorage.getItem('zeta-terms-agreed')
      if (!hasAgreed) {
        setShowTermsModal(true)
      }
    }
  }, [])

  const handleTermsAgree = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('zeta-terms-agreed', 'true')
    }
    setShowTermsModal(false)
  }

  // 추천 탭이 선택된 경우 추천 페이지 표시
  if (currentTab === 'recommend') {
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
  if (currentTab === 'ranking') {
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

  // 하단 네비게이션의 제작 탭이 선택된 경우 제작 페이지 표시
  if (currentBottomTab === 'create') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <CreatePage />
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-6 pb-20">
        {/* 배너 캐러셀 */}
        <BannerCarousel announcements={mockAnnouncements} />
        
        {/* 캐릭터 카드 그리드 */}
        <div className="mt-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {mockCharacters.map((character) => (
              <CharacterCard key={character.id} character={character} />
            ))}
          </div>
        </div>
      </main>

      <BottomNavigation />

      <TermsModal 
        isOpen={showTermsModal} 
        onClose={handleTermsAgree} 
      />
    </div>
  )
}
