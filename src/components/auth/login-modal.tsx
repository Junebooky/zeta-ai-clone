'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { signIn, loading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true)
      await signIn()
      onClose()
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKakaoLogin = () => {
    // 카카오 로그인 구현 예정
    console.log('카카오 로그인')
  }

  const handleAppleLogin = () => {
    // Apple 로그인 구현 예정
    console.log('Apple 로그인')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* 모달 콘텐츠 */}
      <div className="relative bg-gray-900 rounded-xl p-8 w-full max-w-md mx-4 text-white">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* 헤더 */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold mb-4">로그인/회원가입</h2>
          <div className="space-y-2">
            <p className="text-lg">로그인하고 다양한 AI 캐릭터와</p>
            <p className="text-lg">자유롭게 대화해보세요</p>
            <p className="text-sm text-purple-400 bg-purple-900 bg-opacity-30 rounded-full px-4 py-1 inline-block mt-3">
              마지막으로 이용한 로그인 수단이에요
            </p>
          </div>
        </div>

        {/* 로그인 버튼들 */}
        <div className="space-y-3">
          {/* Google 로그인 */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-white text-gray-900 py-4 px-6 rounded-lg font-medium flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">G</span>
            </div>
            {isLoading ? '로그인 중...' : 'Google 계정으로 계속하기'}
          </button>

          {/* 카카오 로그인 */}
          <button
            onClick={handleKakaoLogin}
            className="w-full bg-yellow-400 text-gray-900 py-4 px-6 rounded-lg font-medium flex items-center justify-center gap-3 hover:bg-yellow-500 transition-colors"
          >
            <div className="w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center">
              <span className="text-yellow-400 text-xs font-bold">카</span>
            </div>
            카카오 계정으로 계속하기
          </button>

          {/* Apple 로그인 */}
          <button
            onClick={handleAppleLogin}
            className="w-full bg-black text-white py-4 px-6 rounded-lg font-medium flex items-center justify-center gap-3 hover:bg-gray-800 transition-colors border border-gray-700"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            Apple로 계속하기
          </button>
        </div>
      </div>
    </div>
  )
} 