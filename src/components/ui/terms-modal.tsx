'use client'

import { AlertTriangle, ChevronRight } from 'lucide-react'
import { useState } from 'react'

interface TermsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
  const [showDetails, setShowDetails] = useState(false)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 text-center border-b border-gray-200">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            zeta를 즐기기 전에 확인할 내용이 있어요
          </h2>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-96">
          {/* Section 1 */}
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900">
              내용은 꼭 직접 확인하고 민감한 정보는 입력하지 마세요
            </h3>
            <p className="text-sm text-gray-600">
              캐릭터의 메시지는 AI가 생성하기 때문에 부정확하거나 부적절할 수 있어요
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900">
              AI를 비윤리적으로 이용하지 말아 주세요
            </h3>
            <p className="text-sm text-gray-600">
              허점을 악용한 사례를 공유하는 등 운영정책 위반이 확인되면 이용 제한이나 법적 조치를 할 수 있어요
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">
              개인정보 수집 이용 동의가 필요해요
            </h3>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <span>개인정보 처리 방침 상세보기</span>
              <ChevronRight className={`w-4 h-4 transition-transform ${showDetails ? 'rotate-90' : ''}`} />
            </button>
            
            {showDetails && (
              <div className="bg-gray-50 p-4 rounded-lg text-xs text-gray-600 space-y-2">
                <p><strong>수집 목적:</strong> 서비스 제공, 사용자 식별, 고객 지원</p>
                <p><strong>수집 항목:</strong> 이메일, 닉네임, 프로필 정보</p>
                <p><strong>보유 기간:</strong> 회원 탈퇴 시까지</p>
                <p><strong>제3자 제공:</strong> 동의 없이 제3자에게 제공하지 않습니다</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            동의하기
          </button>
        </div>
      </div>
    </div>
  )
} 