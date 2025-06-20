# 제타(Zeta) AI 채팅 플랫폼 클론

![Zeta AI Clone](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC)

이 프로젝트는 **zeta-ai.io** 웹사이트의 UI/UX를 클론한 Next.js 애플리케이션입니다. TypeScript와 Tailwind CSS를 사용하여 모던하고 반응형 웹 애플리케이션을 구현했습니다.

## 🚀 주요 기능

### ✨ 구현된 기능
- **상단 네비게이션**: 홈, 추천, 랭킹 탭과 검색, 로그인 버튼
- **배너 캐러셀**: 자동 슬라이드와 수동 네비게이션이 가능한 공지사항 배너
- **캐릭터 카드 그리드**: 반응형 그리드 레이아웃으로 12개의 샘플 캐릭터 표시
- **하단 네비게이션**: 홈, 대화, 제작, 마이페이지 탭
- **이용약관 모달**: 초기 접속 시 표시되는 약관 동의 팝업
- **ChatGPT 통합**: 캐릭터별 성격에 맞는 AI 대화 시스템
- **사용자 인증**: Google OAuth 시뮬레이션 및 프로필 관리
- **반응형 디자인**: 데스크톱, 태블릿, 모바일 환경 지원

### 📱 캐릭터 카드 특징
- 캐릭터 이미지와 정보 표시
- 인기도(상호작용 수) 한국어 포맷팅 (예: 21.2만)
- 인증 배지 및 NEW 배지
- 해시태그 기반 카테고리 시스템
- 채팅 버튼과 호버 효과

### 🤖 AI 채팅 시스템
- **캐릭터별 개성**: 각 캐릭터의 성격, 말투, 배경에 맞는 AI 대화
- **ChatGPT 통합**: OpenAI API를 활용한 자연스러운 대화
- **성격 시스템**: 태그와 성격 특성에 기반한 일관된 캐릭터 구현
- **백업 시스템**: API 오류 시 기본 응답으로 대체

## 🛠 기술 스택

- **Frontend**: Next.js 15 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **아이콘**: Lucide React
- **UI 컴포넌트**: Radix UI
- **개발 도구**: ESLint, PostCSS

## 📦 설치 및 실행

### 필수 요구사항
- Node.js 18.17 이상
- npm 또는 yarn

### 설치 과정

1. **저장소 클론**
   ```bash
   git clone <repository-url>
   cd zeta-ai-clone
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **환경 변수 설정**
   프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가:
   ```env
   # OpenAI API 키 (ChatGPT 기능을 위해 필요)
   OPENAI_API_KEY=your_openai_api_key_here
   
   # Supabase 설정 (나중에 설정)
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **개발 서버 실행**
   ```bash
   npm run dev
   ```

5. **브라우저에서 확인**
   ```
   http://localhost:3000
   ```

### 빌드 및 배포
```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx           # 홈페이지
│   └── globals.css        # 글로벌 스타일
├── components/            # React 컴포넌트
│   ├── character/         # 캐릭터 관련 컴포넌트
│   │   └── character-card.tsx
│   ├── layout/            # 레이아웃 컴포넌트
│   │   ├── header.tsx
│   │   └── bottom-navigation.tsx
│   └── ui/                # UI 컴포넌트
│       ├── banner-carousel.tsx
│       └── terms-modal.tsx
├── lib/                   # 유틸리티 함수
│   ├── utils.ts           # 공통 유틸리티
│   └── mock-data.ts       # 샘플 데이터
└── types/                 # TypeScript 타입 정의
    └── character.ts       # 캐릭터 관련 타입
```

## 🎨 디자인 시스템

### 색상 팔레트
- **Primary**: Blue-600 (#2563eb)
- **Background**: Gray-50 (#f9fafb)
- **Text**: Gray-700, Gray-900
- **Accent**: Green-500 (NEW 배지), Purple-600 (배너)

### 반응형 브레이크포인트
- **Mobile**: 640px 미만
- **Tablet**: 640px - 1024px
- **Desktop**: 1024px 이상

## 📝 주요 컴포넌트

### CharacterCard
- 캐릭터 정보를 카드 형태로 표시
- 호버 효과와 애니메이션
- 인기도 숫자 포맷팅
- 태그 시스템

### BannerCarousel
- 자동 슬라이드 (5초 간격)
- 수동 네비게이션 (이전/다음 버튼)
- 인디케이터 도트
- 페이지 카운터

### TermsModal
- 이용약관 동의 팝업
- 아코디언 형태의 상세 정보
- 반응형 모달 디자인

## 🔧 개발 참고사항

### 코드 스타일
- ESLint 규칙 준수
- TypeScript strict 모드
- Tailwind CSS 유틸리티 클래스 사용

### 성능 최적화
- Next.js Image 컴포넌트 사용
- 동적 임포트 활용
- CSS-in-JS 대신 Tailwind CSS 사용

## 🌟 향후 개선 계획

- [ ] 실제 이미지 추가
- [ ] 검색 기능 구현
- [ ] 무한 스크롤 추가
- [ ] 다크 모드 지원
- [ ] 애니메이션 효과 개선
- [ ] SEO 최적화
- [ ] PWA 기능 추가

## 📄 라이선스

이 프로젝트는 교육 목적으로 제작된 클론 프로젝트입니다. 원본 디자인의 저작권은 zeta-ai.io에 있습니다.

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

**개발자**: AI Assistant  
**개발 기간**: 2024년  
**문의**: 이슈 탭을 통해 문의해주세요.
