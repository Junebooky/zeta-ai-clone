'use client'

import { useState, useEffect } from 'react'
import CharacterCard from '@/components/character/character-card'
import BannerCarousel from '@/components/ui/banner-carousel'
import { CharacterService } from '@/lib/character-service'
import { Character } from '@/types/character'
import { mockAnnouncements } from '@/lib/mock-data'

export default function CharacterPage() {
  const [characters, setCharacters] = useState<Character[]>([])

  useEffect(() => {
    // CharacterService를 사용하여 Supabase에서 캐릭터 데이터 가져오기
    CharacterService.getCharacters().then(data => {
      setCharacters(data)
    })
  }, [])

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 pb-20">
      {/* 배너 캐러셀 */}
      <BannerCarousel announcements={mockAnnouncements} />
      
      {/* 캐릭터 카드 그리드 */}
      <section className="mt-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">캐릭터</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {characters.map((character) => (
            <CharacterCard key={character.id} character={character} />
          ))}
        </div>
      </section>
    </main>
  )
} 