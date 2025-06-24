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
  created_at?: string; // ISO 8601 datetime string
  updated_at?: string; // ISO 8601 datetime string
  // 캐릭터 성격 및 대화 스타일 정보
  personality?: {
    traits: string[]; // 성격 특성
    speechStyle: string; // 말투
    background: string; // 배경 설정
    interests: string[]; // 관심사
    relationships: string; // 관계 설정
  };
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