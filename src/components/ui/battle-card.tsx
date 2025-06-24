import { formatInteractionCount } from '@/lib/utils'
import { Heart, Zap, MessageSquare } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface BattleCardProps {
  character: {
    id: string
    name: string
    avatarUrl: string
    interactionCount: number
    creatorName: string
    description: string
    tags: string[]
  }
  side: 'A' | 'B'
  percentage: number
  voteCount: number
  onVote?: () => void
  onViewOpinions?: () => void
}

export default function BattleCard({ 
  character, 
  side, 
  percentage, 
  voteCount,
  onVote,
  onViewOpinions 
}: BattleCardProps) {
  const sideColor = side === 'A' ? 'bg-red-500' : 'bg-blue-500'
  const sideColorHover = side === 'A' ? 'hover:bg-red-600' : 'hover:bg-blue-600'
  const sideColorLight = side === 'A' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Character Image with proper aspect ratio */}
      <Link href={`/character/${character.id}`} className="block">
        <div className="relative aspect-square bg-gray-100">
          <Image
            src={character.avatarUrl}
            alt={character.name}
            fill
            className="object-cover"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
          />
          
          {/* Side Badge */}
          <div className="absolute top-2 left-2">
            <div className={`${sideColor} text-white px-3 py-1 rounded-full flex items-center gap-1`}>
              <Zap className="w-3 h-3 fill-current" />
              <span className="text-xs font-bold">{side}</span>
            </div>
          </div>

          {/* Percentage */}
          <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full">
            <span className="text-xs font-medium">{percentage}%</span>
          </div>
        </div>
      </Link>

      {/* Character Info */}
      <div className="p-4">
        <Link href={`/character/${character.id}`} className="block mb-3">
          <h3 className="font-bold text-black text-sm mb-1 line-clamp-1 hover:text-blue-600 transition-colors">
            {character.creatorName}의 {character.name}
          </h3>
          <p className="text-gray-600 text-xs mb-2 line-clamp-2 leading-tight">
            {character.description}
          </p>
        </Link>

        {/* Vote Count */}
        <div className="mb-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Heart className="w-4 h-4" />
            <span className="font-medium">{formatInteractionCount(voteCount)}건</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button 
            onClick={onVote}
            className={`flex-1 ${sideColor} ${sideColorHover} text-white py-2 px-3 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1`}
          >
            <Heart className="w-3 h-3 fill-current" />
            투표하기
          </button>
          <button 
            onClick={onViewOpinions}
            className="flex-1 border border-gray-300 text-gray-700 py-2 px-3 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-1"
          >
            <MessageSquare className="w-3 h-3" />
            의견보기
          </button>
        </div>

        {/* Tags */}
        <div className="mt-3">
          <div className="flex flex-wrap gap-1">
            <span className={`inline-block ${sideColorLight} text-xs px-2 py-0.5 rounded-full`}>
              팀 {side}
            </span>
            {character.tags.slice(0, 2).map((tag, index) => (
              <span key={index} className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 