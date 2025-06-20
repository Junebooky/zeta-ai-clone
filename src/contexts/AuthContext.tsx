'use client'

import { createContext, useContext, useEffect, useState } from 'react'

// 임시 인터페이스 (Supabase 설치 후 실제 타입으로 교체)
interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 페이지 로드 시 인증 상태 확인
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      // 임시 구현 - 나중에 Supabase로 교체
      const savedUser = localStorage.getItem('zeta-user')
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
    } catch (error) {
      console.error('Error checking user:', error)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async () => {
    try {
      setLoading(true)
      // 임시 구현 - Google OAuth 시뮬레이션
      // 다양한 프로필 이미지 중 랜덤 선택
      const avatarOptions = [
        '/img/boy.01.jpg',
        '/img/boy.02.webp', 
        '/img/boy.03.jpg',
        '/img/boy04.webp',
        '/img/girl.01.webp',
        '/img/girl.02.webp',
        '/img/girl.03.webp',
        '/img/girl.04.webp'
      ]
      const randomAvatar = avatarOptions[Math.floor(Math.random() * avatarOptions.length)]
      
      const mockUser: User = {
        id: '1',
        email: 'user@example.com',
        name: '사용자',
        avatar_url: randomAvatar
      }
      
      localStorage.setItem('zeta-user', JSON.stringify(mockUser))
      setUser(mockUser)
    } catch (error) {
      console.error('Error signing in:', error)
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      localStorage.removeItem('zeta-user')
      setUser(null)
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 