import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto mb-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-4 text-sm text-gray-600">
          <div className="font-semibold text-gray-900">NEON101</div>
          
          <div className="space-y-2">
            <div>서울특별시 강남구 선릉로 119길 31, 3층 </div>
            <div>대표이사: 이정훈ㅣ사업자등록번호: 129-81-75572</div>
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
            <a href="/about" className="hover:text-gray-900 transition-colors">about neta</a>
            <span>|</span>
            <a href="/support" className="hover:text-gray-900 transition-colors">고객센터</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 