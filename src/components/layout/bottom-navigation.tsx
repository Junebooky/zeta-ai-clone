'use client'

import { Home, MessageCircle, Plus, User } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

const navigationItems = [
  { label: '홈', href: '/', icon: Home, param: 'home' },
  { label: '대화', href: '/?bottomTab=chat', icon: MessageCircle, param: 'chat' },
  { label: '제작', href: '/?bottomTab=create', icon: Plus, param: 'create' },
  { label: '마이페이지', href: '/?bottomTab=profile', icon: User, param: 'profile' },
]

export default function BottomNavigation() {
  const searchParams = useSearchParams()
  const currentBottomTab = searchParams.get('bottomTab') || 'home'

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <nav className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-around h-16">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = currentBottomTab === item.param
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center space-y-1 py-2 px-3 rounded-lg transition-colors ${
                  isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'fill-current' : ''}`} />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
} 