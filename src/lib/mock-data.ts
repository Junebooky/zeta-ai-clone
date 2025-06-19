import { Character, Announcement } from '@/types/character'

// Function to automatically assign images to characters
const getCharacterImage = (index: number, gender: 'boy' | 'girl' = 'girl'): string => {
  const boyImages = [
    '/img/boy.01.jpg',
    '/img/boy.02.webp', 
    '/img/boy.03.jpg',
    '/img/boy04.webp'
  ]
  
  const girlImages = [
    '/img/girl.01.webp',
    '/img/girl.02.webp',
    '/img/girl.03.webp',
    '/img/girl.04.webp',
    '/img/girl.05.webp',
    '/img/girl.06.webp',
    '/img/girl.07.webp',
    '/img/girl.08.webp',
    '/img/girl.09.webp',
    '/img/girl.10.webp',
    '/img/girl.11.webp',
    '/img/girl12.webp'
  ]
  
  if (gender === 'boy') {
    return boyImages[index % boyImages.length]
  } else {
    return girlImages[index % girlImages.length]
  }
}

export const mockCharacters: Character[] = [
  {
    id: '1',
    name: '아스모데우스',
    creatorName: 'WiryMucus0844',
    description: '5살짜리 아이로 마계대학교를 다녀보세요!! ㅋㅋ',
    avatarUrl: getCharacterImage(0, 'girl'),
    interactionCount: 212000,
    isVerified: true,
    isNew: false,
    tags: ['#마계', '#대학교', '#아이']
  },
  {
    id: '2',
    name: '도한솔',
    creatorName: 'Zni_2',
    description: '인어인 너를 전시해 둔 부잣집 도련님',
    avatarUrl: getCharacterImage(0, 'boy'),
    interactionCount: 21000,
    isVerified: true,
    isNew: false,
    tags: ['#부잣집', '#도련님', '#인어', '#무뚝뚝', '#집착', '#재벌']
  },
  {
    id: '3',
    name: '윤세라',
    creatorName: 'Jaeger',
    description: '막내인 Guest이 자신의 모든것인 누나',
    avatarUrl: getCharacterImage(1, 'girl'),
    interactionCount: 643000,
    isVerified: false,
    isNew: false,
    tags: ['#친누나', '#그룹', '#회장', '#대기업', '#누나', '#케어', '#달달']
  },
  {
    id: '4',
    name: '바쿠고 카츠키',
    creatorName: 'bakugoislove',
    description: '" 이렇게해서라도 너랑 있고싶어. "',
    avatarUrl: getCharacterImage(1, 'boy'),
    interactionCount: 357,
    isVerified: false,
    isNew: true,
    tags: ['#나히아', '#나의히어로아카데미아', '#히로아카', '#바쿠고카츠키', '#tsundere', '#폭발', '#애니메이션', '#히어로', '#강함']
  },
  {
    id: '5',
    name: '최진혁',
    creatorName: 'M_u',
    description: '살인마한테 친구와 같이 납치당했다..!?',
    avatarUrl: getCharacterImage(2, 'girl'),
    interactionCount: 61000,
    isVerified: false,
    isNew: false,
    tags: ['#집착광공', '#폭력적', '#감금', '#집착남', '#스릴러', '#위험', '#미친놈']
  },
  {
    id: '6',
    name: '범태영',
    creatorName: '1OOOO24',
    description: '집착광공 남편에게 반항하기.',
    avatarUrl: getCharacterImage(2, 'boy'),
    interactionCount: 127000,
    isVerified: false,
    isNew: false,
    tags: ['#집착', '#집착광공', '#남편', '#조직보스', '#마피아', '#반항']
  },
  {
    id: '7',
    name: '윤시헌',
    creatorName: 'GrainyGate3148',
    description: '나만 보던 그는 이제 내가 필요없어진 것 같다.',
    avatarUrl: getCharacterImage(3, 'girl'),
    interactionCount: 375,
    isVerified: false,
    isNew: true,
    tags: ['#사극', '#왕', '#무뚝뚝', '#다정', '#역사']
  },
  {
    id: '8',
    name: '블리츠',
    creatorName: 'FolksySpit3326',
    description: '헬루바 보스',
    avatarUrl: getCharacterImage(4, 'girl'),
    interactionCount: 681000,
    isVerified: false,
    isNew: false,
    tags: ['#헬루바보스', '#블리츠']
  },
  {
    id: '9',
    name: '윈브레 세계관',
    creatorName: 'CrispySeed4617',
    description: '캐붕주의',
    avatarUrl: getCharacterImage(5, 'girl'),
    interactionCount: 127000,
    isVerified: false,
    isNew: false,
    tags: ['#윈브레', '#보후우린', '#사자두련']
  },
  {
    id: '10',
    name: '남도원',
    creatorName: 'IvoryBat0788',
    description: '나를 유독 싫어하는 팀장님',
    avatarUrl: getCharacterImage(3, 'boy'),
    interactionCount: 155000,
    isVerified: false,
    isNew: false,
    tags: ['#회사', '#직장', '#팀장', '#연상', '#오피스']
  },
  {
    id: '11',
    name: '이도준',
    creatorName: 'dixe0',
    description: '이장님이 어리고 나이가 맛있어요.',
    avatarUrl: getCharacterImage(6, 'girl'),
    interactionCount: 352000,
    isVerified: false,
    isNew: false,
    tags: ['#까칠', '#연상', '#시골', '#이장님', '#나이차', '#어른', '#성숙', '#시골남자']
  },
  {
    id: '12',
    name: '코즈메 켄마',
    creatorName: 'kenlover',
    description: '고양이 수인 켄마랑 동거하기',
    avatarUrl: getCharacterImage(7, 'girl'),
    interactionCount: 118,
    isVerified: false,
    isNew: true,
    tags: ['#hl', '#bl', '#켄마', '#수인', '#고양이', '#동거']
  },
  // Additional characters for ranking
  {
    id: '13',
    name: '김민준',
    creatorName: 'MinJun123',
    description: '차가운 CEO와의 계약결혼',
    avatarUrl: getCharacterImage(8, 'girl'),
    interactionCount: 892000,
    isVerified: true,
    isNew: false,
    tags: ['#CEO', '#계약결혼', '#차가운', '#재벌', '#로맨스']
  },
  {
    id: '14',
    name: '박서윤',
    creatorName: 'SeoYoon_Park',
    description: '천재 해커 소녀의 일상',
    avatarUrl: getCharacterImage(9, 'girl'),
    interactionCount: 445000,
    isVerified: false,
    isNew: true,
    tags: ['#해커', '#천재', '#컴퓨터', '#사이버', '#IT']
  },
  {
    id: '15',
    name: '강태현',
    creatorName: 'TaeHyun_K',
    description: '학교 최고의 일진과 첫사랑',
    avatarUrl: getCharacterImage(10, 'girl'),
    interactionCount: 578000,
    isVerified: false,
    isNew: false,
    tags: ['#일진', '#학교', '#첫사랑', '#학원물', '#로맨스']
  },
  {
    id: '16',
    name: '이하늘',
    creatorName: 'SkyLee',
    description: '카페 사장님과의 달콤한 만남',
    avatarUrl: getCharacterImage(11, 'girl'),
    interactionCount: 223000,
    isVerified: false,
    isNew: false,
    tags: ['#카페', '#사장님', '#일상', '#달콤', '#힐링']
  }
]

// Ranking data for different time periods
export const rankingData = {
  REALTIME: mockCharacters.sort((a, b) => b.interactionCount - a.interactionCount).slice(0, 20),
  DAILY: [...mockCharacters].sort(() => Math.random() - 0.5).slice(0, 20),
  WEEKLY: [...mockCharacters].sort(() => Math.random() - 0.5).slice(0, 20),
  MONTHLY: [...mockCharacters].sort(() => Math.random() - 0.5).slice(0, 20)
}

export const mockAnnouncements: Announcement[] = [
  {
    id: '2608',
    title: 'NEON101의 채팅 웹툰 드디어 전격 출시!! ⭐',
    url: '/announcements/2608'
  },
  {
    id: '2542',
    title: '드디어 내 캐릭터도 스냅샷 찰칵! 📸 ✨',
    url: '/announcements/2542'
  },
  {
    id: '2146',
    title: '와 이건 못 참지… 캐릭터 제작 기능 완전 업그레이드🔥',
    url: '/announcements/2146'
  },
  {
    id: '1057',
    title: '[공지] 하이브 소속 아티스트 무단 도용 캐릭터 삭제 및 제작 금지 안내',
    url: '/announcements/1057'
  },
  {
    id: '52',
    title: '타인 권리 침해 캐릭터 제작 금지 안내',
    url: '/announcements/52'
  },
  {
    id: '232',
    title: '[공지] 샌드박스 크리에이터 무단 도용 금지 안내',
    url: '/announcements/232'
  }
] 