'use client'

import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import Footer from './footer'
import { useAuth } from '@/contexts/AuthContext'
import TermsModal from './terms-modal'

interface CreatePageProps {
  onAgree: () => void;
}

const CreatePage = ({ onAgree }: CreatePageProps) => {
  const [showTerms, setShowTerms] = useState(true)
  const { user } = useAuth()

  const handleAgree = () => {
    setShowTerms(false)
    onAgree()
  }

  if (!user) {
    return (
      <>
        {/* 메인 컨텐츠 */}
        <main className="max-w-6xl mx-auto px-4 py-16 pb-20">
          <div className="text-center space-y-8">
            {/* 메인 메시지 */}
            <div className="space-y-4">
              <h1 className="text-xl md:text-2xl text-gray-700 font-medium">
                대화하고 싶은 캐릭터가 없다면
              </h1>
              <h2 className="text-2xl md:text-3xl text-gray-900 font-bold">
                내가 원하는 캐릭터를 직접 제작해보세요
              </h2>
            </div>

            {/* 캐릭터 제작하기 버튼 */}
            <div className="pt-8">
              <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors duration-200 text-lg">
                <Plus className="w-5 h-5" />
                캐릭터 제작하기
              </button>
            </div>

            {/* 추천 기준 링크 */}
            <div className="pt-4">
              <button className="text-blue-600 hover:text-blue-700 underline transition-colors duration-200">
                캐릭터 추천 기준이 궁금해요
              </button>
            </div>
          </div>
        </main>

        {/* 푸터 */}
        <Footer />
      </>
    )
  }

  return (
    <>
      {/* 메인 컨텐츠 */}
      <main className="max-w-6xl mx-auto px-4 py-16 pb-20">
        <div className="text-center space-y-8">
          {/* 메인 메시지 */}
          <div className="space-y-4">
            <h1 className="text-xl md:text-2xl text-gray-700 font-medium">
              대화하고 싶은 캐릭터가 없다면
            </h1>
            <h2 className="text-2xl md:text-3xl text-gray-900 font-bold">
              내가 원하는 캐릭터를 직접 제작해보세요
            </h2>
          </div>

          {/* 캐릭터 제작하기 버튼 */}
          <div className="pt-8">
            <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors duration-200 text-lg">
              <Plus className="w-5 h-5" />
              캐릭터 제작하기
            </button>
          </div>

          {/* 추천 기준 링크 */}
          <div className="pt-4">
            <button className="text-blue-600 hover:text-blue-700 underline transition-colors duration-200">
              캐릭터 추천 기준이 궁금해요
            </button>
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <Footer />
    </>
  )
}

export default CreatePage 