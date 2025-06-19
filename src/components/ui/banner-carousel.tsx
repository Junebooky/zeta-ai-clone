'use client'

import { Announcement } from '@/types/character'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

interface BannerCarouselProps {
  announcements: Announcement[]
}

export default function BannerCarousel({ announcements }: BannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === announcements.length - 1 ? 0 : prevIndex + 1
      )
    }, 5000) // 5초마다 자동 슬라이드

    return () => clearInterval(timer)
  }, [announcements.length])

  const goToPrevious = () => {
    setCurrentIndex(
      currentIndex === 0 ? announcements.length - 1 : currentIndex - 1
    )
  }

  const goToNext = () => {
    setCurrentIndex(
      currentIndex === announcements.length - 1 ? 0 : currentIndex + 1
    )
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  if (!announcements.length) return null

  return (
    <div className="relative w-full h-40 md:h-52 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg overflow-hidden">
      {/* Banner Content */}
      <div className="relative w-full h-full">
        {announcements.map((announcement, index) => (
          <div
            key={announcement.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Link href={announcement.url} className="block w-full h-full">
              <div className="relative w-full h-full bg-gradient-to-r from-blue-500/90 to-purple-600/90">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white px-6">
                    <h2 className="text-lg md:text-2xl font-bold mb-2 line-clamp-2">
                      {announcement.title}
                    </h2>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
        aria-label="이전 배너"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
        aria-label="다음 배너"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {announcements.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`${index + 1}번째 배너로 이동`}
          />
        ))}
      </div>

      {/* Page Counter */}
      <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
        {currentIndex + 1}/{announcements.length}
      </div>
    </div>
  )
} 