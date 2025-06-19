'use client'

import { Search, User, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import LoginModal from '@/components/auth/login-modal'

const navigationItems = [
  { label: '홈', href: '/?tab=home' },
  { label: '추천', href: '/?tab=recommend' },
  { label: '랭킹', href: '/?tab=ranking' },
]

export default function Header() {
  const [activeTab, setActiveTab] = useState('home')
  const [showLoginModal, setShowLoginModal] = useState(false)
  const { user, signOut, loading } = useAuth()

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left Navigation */}
        <div className="flex items-center space-x-8">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                activeTab === item.href.split('=')[1]
                  ? 'text-blue-600 border-b-2 border-blue-600 pb-4'
                  : 'text-gray-700'
              }`}
              onClick={() => setActiveTab(item.href.split('=')[1] || 'home')}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right Navigation */}
        <div className="flex items-center space-x-4">
          <Link
            href="/search"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Search className="w-5 h-5 text-gray-600" />
          </Link>
          
          {user ? (
            /* 로그인된 사용자 */
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                {user.avatar_url ? (
                  <img 
                    src={user.avatar_url} 
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
              </div>
              <button 
                onClick={signOut}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="로그아웃"
              >
                <LogOut className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          ) : (
            /* 로그인되지 않은 사용자 */
            <button 
              onClick={() => setShowLoginModal(true)}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? '로딩...' : '로그인'}
            </button>
          )}
        </div>
      </nav>
      
      {/* 로그인 모달 */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </header>
  )
} 


