'use client'

import React from 'react'
import { Plus } from 'lucide-react'

const CreatePage = () => {
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

      {/* 하단 회사 정보 */}
      <footer className="bg-white border-t border-gray-200 mt-auto mb-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="space-y-4 text-sm text-gray-600">
            <div className="font-semibold text-gray-900">NEON101</div>
            
            <div className="space-y-2">
              <div>서울특별시 강남구 선릉로 119길 31, 3층 </div>
              <div>대표이사: 이정훈ㅣ사업자등록번호: 215-87-57315</div>
              <div>전화번호: 02-562-1101 | 이메일: neon101@neon101.ai</div>
               {/* <div>통신판매업신고번호: </div> */}
            </div>

            <div className="flex flex-wrap gap-2 pt-4">
              <a href="/privacy" className="hover:text-gray-900 transition-colors">개인정보처리방침</a>
              <span>|</span>
              <a href="/terms" className="hover:text-gray-900 transition-colors">이용약관</a>
              <span>|</span>
              <a href="/policy" className="hover:text-gray-900 transition-colors">운영정책</a>
              <span>|</span>
              <a href="/youth" className="hover:text-gray-900 transition-colors">청소년보호정책</a>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <a href="/about" className="hover:text-gray-900 transition-colors">about zeta</a>
              <span>|</span>
              <a href="/support" className="hover:text-gray-900 transition-colors">고객센터</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default CreatePage 