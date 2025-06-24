import { formatInteractionCount } from '@/lib/utils'
import { Star, TrendingUp } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface WebtoonCardProps {
  webtoon: {
    id: string
    title: string
    thumbnail: string
    rank: number
    author: string
    view_count: number
  }
}

export default function WebtoonCard({ webtoon }: WebtoonCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 h-80 flex flex-col">
      <Link href={`/character/${webtoon.id}`} className="block flex-1 flex flex-col">
        {/* Webtoon Image - 1:1 aspect ratio */}
        <div className="relative aspect-square bg-gray-100 flex-shrink-0">
          {webtoon.thumbnail ? (
            <Image
              src={webtoon.thumbnail}
              alt={webtoon.title}
              fill
              className="object-cover"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
              <span className="text-4xl font-bold text-gray-400">{webtoon.rank}</span>
            </div>
          )}
          
          {/* Rank Badge */}
          <div className="absolute top-2 left-2">
            <div className="bg-orange-500 text-white px-2 py-1 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" />
              <span className="text-xs font-bold">#{webtoon.rank}</span>
            </div>
          </div>

          {/* View Count */}
          <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span className="text-xs font-medium">
              {formatInteractionCount(webtoon.view_count)}
            </span>
          </div>
        </div>

        {/* Webtoon Info - Fixed height with overflow handling */}
        <div className="p-3 flex-1 flex flex-col justify-between min-h-0">
          <div className="flex-1">
            <h3 className="font-bold text-sm mb-1 line-clamp-1">
              {webtoon.title}
            </h3>
            <p className="text-gray-600 text-xs mb-2 line-clamp-2 leading-tight">
              작가: {webtoon.author}
            </p>
          </div>

          {/* Additional Info */}
          <div className="h-8 overflow-hidden">
            <div className="flex flex-wrap gap-1">
              <span className="inline-block bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full">
                #{webtoon.rank}위
              </span>
              <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                웹툰
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
} 