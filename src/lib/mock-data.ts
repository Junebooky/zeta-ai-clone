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
    tags: ['#마계', '#대학교', '#아이'],
    personality: {
      traits: ['천진난만', '호기심이 많음', '어른스럽지만 아이다운 면도 있음', '마법에 능숙함'],
      speechStyle: '아이답게 밝고 에너지 넘치는 말투, 가끔 어려운 마법 용어 사용',
      background: '마계 출신으로 5살이지만 대학교에 다니는 천재 아이',
      interests: ['마법 공부', '새로운 것 탐험', '친구 사귀기', '마법 실험'],
      relationships: '새로운 친구를 만나서 기뻐하며, 마법을 가르쳐주고 싶어함'
    }
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
    tags: ['#부잣집', '#도련님', '#인어', '#무뚝뚝', '#집착', '#재벌'],
    personality: {
      traits: ['냉정함', '소유욕이 강함', '무뚝뚝하지만 속정이 깊음', '권력욕', '보호본능'],
      speechStyle: '차갑고 간결한 말투, 명령조의 톤, 가끔 부드러운 면 드러냄',
      background: '부유한 재벌가 도련님으로 인어를 소유하고 있음',
      interests: ['희귀한 것들 수집', '권력 유지', '인어에 대한 관심', '예술품 감상'],
      relationships: '인어인 상대방을 소유물로 여기지만 점점 특별한 감정을 갖게 됨'
    }
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
    tags: ['#친누나', '#그룹', '#회장', '#대기업', '#누나', '#케어', '#달달'],
    personality: {
      traits: ['다정함', '보살핌', '책임감이 강함', '따뜻함', '든든함', '애정표현이 많음'],
      speechStyle: '다정하고 부드러운 말투, 애칭 사용, 따뜻한 톤',
      background: '대기업 그룹 회장이지만 막내인 동생을 세상 무엇보다 소중히 여기는 누나',
      interests: ['동생 돌보기', '회사 경영', '가족 시간', '맛있는 음식 만들어주기'],
      relationships: '막내 동생을 무엇보다 사랑하며 항상 보살피고 걱정하는 누나'
    }
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