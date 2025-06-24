'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/layout/header'
import BottomNavigation from '@/components/layout/bottom-navigation'
import TermsModal from '@/components/ui/terms-modal'
import HomePage from '@/components/ui/home-page'
import CharacterPage from '@/components/ui/character-page'
import RecommendPage from '@/components/ui/recommend-page'
import CreatePage from '@/components/ui/create-page'
import RankingPage from '@/components/ui/ranking-page'

export default function MainPage() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'home')
  const [activeBottomTab, setActiveBottomTab] = useState(searchParams.get('bottomTab') || 'home')
  const [showTermsModal, setShowTermsModal] = useState(false)

  useEffect(() => {
    const tab = searchParams.get('tab') || 'home'
    const bottomTab = searchParams.get('bottomTab') || 'home'
    setActiveTab(tab)
    setActiveBottomTab(bottomTab)
  }, [searchParams])

  useEffect(() => {
    // localStorage에서 약관 동의 여부 확인
    const hasAgreed = localStorage.getItem('termsAgreed')
    if (!hasAgreed) {
      setShowTermsModal(true)
    }
  }, [])

  const handleTermsAgree = () => {
    localStorage.setItem('termsAgreed', 'true')
    setShowTermsModal(false)
  }

  // 하단 네비게이션 - 제작 탭이 선택된 경우 (bottomTab=create)
  if (activeBottomTab === 'create') {
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

  // 하단 네비게이션 - 대화 탭이 선택된 경우 (bottomTab=chat)
  if (activeBottomTab === 'chat') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-16 pb-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">대화</h1>
            <p className="text-gray-600">채팅 기능이 곧 제공될 예정입니다.</p>
          </div>
        </div>
        <BottomNavigation />
        <TermsModal 
          isOpen={showTermsModal} 
          onClose={handleTermsAgree} 
        />
      </div>
    )
  }

  // 하단 네비게이션 - 마이페이지 탭이 선택된 경우 (bottomTab=profile)
  if (activeBottomTab === 'profile') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-16 pb-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">마이페이지</h1>
            <p className="text-gray-600">프로필 관리 기능이 곧 제공될 예정입니다.</p>
          </div>
        </div>
        <BottomNavigation />
        <TermsModal 
          isOpen={showTermsModal} 
          onClose={handleTermsAgree} 
        />
      </div>
    )
  }

  // 상단 탭 네비게이션 처리
  // 캐릭터 탭이 선택된 경우 캐릭터 페이지 표시
  if (activeTab === 'character') {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <CharacterPage />
        <BottomNavigation />
        <TermsModal 
          isOpen={showTermsModal} 
          onClose={handleTermsAgree} 
        />
      </div>
    )
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

  // 제작 탭이 선택된 경우 제작 페이지 표시 (상단 탭용)
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

  // 기본 홈 페이지 (새로운 UI)
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HomePage />
      <BottomNavigation />
      <TermsModal 
        isOpen={showTermsModal} 
        onClose={handleTermsAgree} 
      />
    </div>
  )
}
