import { Character } from '@/types/character'
import { formatInteractionCount } from '@/lib/utils'
import { Heart, MessageCircle, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface CharacterCardProps {
  character: Character
}

export default function CharacterCard({ character }: CharacterCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 h-80 flex flex-col">
      <Link href={`/character/${character.id}`} className="block flex-1 flex flex-col">
        {/* Character Image - 1:1 aspect ratio */}
        <div className="relative aspect-square bg-gray-100 flex-shrink-0">
          <Image
            src={character.avatarUrl}
            alt={character.name}
            fill
            className="object-cover"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {character.isVerified && (
              <div className="bg-blue-600 text-white px-2 py-1 rounded-full flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" />
                <span className="text-xs font-medium">인증</span>
              </div>
            )}
            {character.isNew && (
              <div className="bg-green-500 text-white px-2 py-1 rounded-full">
                <span className="text-xs font-medium">NEW</span>
              </div>
            )}
          </div>

          {/* Interaction Count */}
          <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full flex items-center gap-1">
            <Heart className="w-3 h-3" />
            <span className="text-xs font-medium">
              {formatInteractionCount(character.interactionCount)}
            </span>
          </div>

          {/* Chat Button */}
          <div className="absolute bottom-2 right-2">
            <button className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
              <MessageCircle className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>

        {/* Character Info - Fixed height with overflow handling */}
        <div className="p-3 flex-1 flex flex-col justify-between min-h-0">
          <div className="flex-1">
            <h3 className="font-bold text-sm mb-1 line-clamp-1">
              {character.creatorName}의 {character.name}
            </h3>
            <p className="text-gray-600 text-xs mb-2 line-clamp-2 leading-tight">
              {character.description}
            </p>
          </div>

          {/* Tags - Fixed height with overflow */}
          <div className="h-8 overflow-hidden">
            <div className="flex flex-wrap gap-1">
              {character.tags.slice(0, 4).map((tag, index) => (
                <span
                  key={index}
                  className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full hover:bg-blue-100 hover:text-blue-700 cursor-pointer transition-colors whitespace-nowrap"
                >
                  #{tag}
                </span>
              ))}
              {character.tags.length > 4 && (
                <span className="inline-block bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full whitespace-nowrap">
                  +{character.tags.length - 4}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
} 