export interface Character {
  id: string;
  name: string;
  creatorName: string;
  description: string;
  avatarUrl: string;
  interactionCount: number;
  tags: string[];
  isVerified?: boolean;
  isNew?: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  imageUrl?: string;
  url: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
}

export interface TabItem {
  id: string;
  label: string;
  value: string;
} 