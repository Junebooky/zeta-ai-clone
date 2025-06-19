'use client'

import { Search } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const navigationItems = [
  { label: '홈', href: '/?tab=home' },
  { label: '추천', href: '/?tab=recommend' },
  { label: '랭킹', href: '/?tab=ranking' },
]

export default function Header() {
  const [activeTab, setActiveTab] = useState('home')

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
          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
            로그인
          </button>
        </div>
      </nav>
    </header>
  )
} 


