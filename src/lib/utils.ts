import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatInteractionCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}만`
  }
  if (count >= 10000) {
    return `${(count / 10000).toFixed(1)}만`
  }
  if (count >= 1000) {
    return count.toLocaleString()
  }
  return count.toString()
} 