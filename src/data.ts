/**
 * =========================================================================
 * 💡 박성미 님의 포트폴리오 데이터 마스터 소스 파일 (src/data.ts)
 * =========================================================================
 * 
 * 안녕하세요, 성미님! 
 * 모바일, 아이패드, PC 등 모든 기기에서 데이터가 절대 날아가지 않고 항상 
 * 똑같이 보이게 하려면 이 파일 내부의 데이터를 직접 수정하시면 됩니다.
 * 
 * [수정 방법 3가지]
 * 1. 기본 정보 수정: DEFAULT_SITE_CONFIG 안의 텍스트나 이메일 주소를 수정하세요.
 * 2. 스킬 지수 수정: DEFAULT_SKILLS 안의 스킬 명칭이나 퍼센트 수치(percentage)를 변경하세요.
 * 3. 작품 내용 및 이미지 추가/수정:
 *    - DEFAULT_PORTFOLIO_ITEMS 배열 안에 작품들을 추가하거나 수정하실 수 있습니다.
 *    - 작품 이미지 경로는 프로젝트 내 public 폴더나 assets 폴더에 이미지를 저장하신 후,
 *      예를 들어 "/assets/my-work-1.jpg" 와 같이 경로로 타이핑하여 직접 입력하시면 됩니다.
 *    - 만약 이미지를 직접 텍스트로 바꾸어 올리는 백업 파일을 사용하셨다면,
 *      관리자 페이지의 백업 탭에서 다운로드한 .json 파일을 열어 그 안의 Base64 데이터 스트링을 
 *      이곳의 image 또는 overviewImage 항목에 똑같이 복사-붙여넣기 하셔도 무방합니다.
 * 
 * 수정이 끝나면 깃허브에 push(올리기) 해 주시면 Netlify나 실제 서버로 자동 배포되어
 * 전 세계 어디서든 수정한 소중한 작품들이 즉각 똑같이 보여집니다!
 * =========================================================================
 */

import { SiteConfig, SkillItem, PortfolioItem } from './types';

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  heroTitle: "WEB & VISUAL DESIGNER",
  heroSubTitleLines: [
    "브랜드의 가치를",
    "디자인으로 전달하는",
    "박성미입니다."
  ],
  introTitle: "상세페이지 · 배너 · 리디자인 · 3D 연출 · 영상 제작, 편집",
  introDescription: "상세페이지 디자인부터 모바일/웹 리디자인, 브랜딩 배너, 감각적인 3D 그래픽 렌더링 및 모션 그래픽 비디오 콘텐츠까지, 다양한 매체를 넘나들며 브랜드에 생명력을 불어넣는 비주얼 크리에이션을 제공합니다. 사용자의 시선을 사로잡는 레이아웃과 탄탄한 스토리텔링으로 가치를 증명합니다.",
  email: "seongmi.park.design@gmail.com",
  blogUrl: "https://blog.naver.com/seongmi_design",
  youtubeUrl: "https://youtube.com/@choonsung_studio",
  youtubeChannelName: "춘성스튜디오",
  certificates: [
    { id: 'cert-1', name: '컴퓨터그래픽스운용기능사', date: '2020.12', issuer: '한국산업인력공단 (Q-Net)' },
    { id: 'cert-2', name: '웹디자인기능사', date: '2021.06', issuer: '한국산업인력공단 (Q-Net)' },
    { id: 'cert-3', name: 'GTQ 그래픽기술자격 1급', date: '2019.05', issuer: '한국생산성본부 (KPC)' },
    { id: 'cert-4', name: '컬러리스트산업기사', date: '2022.09', issuer: '한국산업인력공단 (Q-Net)' }
  ]
};

export const DEFAULT_SKILLS: SkillItem[] = [
  { id: '1', name: 'Photoshop', iconType: 'photoshop', percentage: 95 },
  { id: '2', name: 'Illustrator', iconType: 'illustrator', percentage: 90 },
  { id: '3', name: 'Figma', iconType: 'figma', percentage: 95 },
  { id: '4', name: 'Premiere Pro', iconType: 'premiere', percentage: 85 },
  { id: '5', name: 'After Effects', iconType: 'aftereffects', percentage: 80 },
  { id: '6', name: 'Cinema 4D', iconType: 'cinema4d', percentage: 75 },
  { id: '7', name: 'Blender', iconType: 'blender', percentage: 70 }
];

// Elegant SVG Generator Helpers for Beautiful Placeholder Assets
const createDetailOverviewSVG = (title: string, color1: string, color2: string) => {
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1600" viewBox="0 0 800 1600">
    <rect width="800" height="1600" fill="${color1}"/>
    
    <!-- Header -->
    <text x="400" y="120" font-family="Pretendard, system-ui, sans-serif" font-weight="800" font-size="28" fill="${color2}" text-anchor="middle" letter-spacing="4">EDITORIAL BRAND VALUE</text>
    <line x1="100" y1="160" x2="700" y2="160" stroke="${color2}" stroke-width="1.5" stroke-dasharray="4,4"/>
    
    <!-- Title Section -->
    <text x="400" y="240" font-family="Pretendard, system-ui, sans-serif" font-weight="900" font-size="44" fill="${color2}" text-anchor="middle" letter-spacing="2">${title}</text>
    <text x="400" y="300" font-family="Pretendard, system-ui, sans-serif" font-weight="400" font-size="18" fill="${color2}" fill-opacity="0.7" text-anchor="middle">PREMIUM LUXURY COLLECTION</text>
    
    <!-- Graphic Element (Aesthetic Ring) -->
    <circle cx="400" cy="540" r="140" fill="none" stroke="${color2}" stroke-width="1" stroke-opacity="0.3"/>
    <circle cx="400" cy="540" r="110" fill="none" stroke="${color2}" stroke-width="3"/>
    <path d="M 320 540 A 80 80 0 0 1 480 540" fill="none" stroke="${color2}" stroke-width="8" stroke-linecap="round"/>
    <circle cx="400" cy="540" r="20" fill="${color2}"/>
    
    <!-- Details 1 -->
    <rect x="100" y="740" width="600" height="220" fill="white" fill-opacity="0.03" rx="12" stroke="${color2}" stroke-width="1" stroke-opacity="0.1"/>
    <text x="140" y="800" font-family="Pretendard, system-ui, sans-serif" font-weight="700" font-size="22" fill="${color2}">01. GRID &amp; HARMONY</text>
    <text x="140" y="840" font-family="Pretendard, system-ui, sans-serif" font-weight="400" font-size="15" fill="${color2}" fill-opacity="0.8">황금비율 레이아웃을 사용하여 브랜드가 가진 고급스러운 이미지의 깊이를 극대화합니다.</text>
    <text x="140" y="870" font-family="Pretendard, system-ui, sans-serif" font-weight="400" font-size="15" fill="${color2}" fill-opacity="0.8">정밀한 서체 조절과 자간 설정을 통해 한글 타이포그래피의 진수를 선보입니다.</text>

    <!-- Details 2 -->
    <rect x="100" y="1000" width="600" height="220" fill="white" fill-opacity="0.03" rx="12" stroke="${color2}" stroke-width="1" stroke-opacity="0.1"/>
    <text x="140" y="1060" font-family="Pretendard, system-ui, sans-serif" font-weight="700" font-size="22" fill="${color2}">02. ORGANIC COLORS</text>
    <text x="140" y="1100" font-family="Pretendard, system-ui, sans-serif" font-weight="400" font-size="15" fill="${color2}" fill-opacity="0.8">피부와 자연에서 영감을 얻은 톤온톤 배색으로, 감성적이고 안정적인 분위기를 제공합니다.</text>
    <text x="140" y="1130" font-family="Pretendard, system-ui, sans-serif" font-weight="400" font-size="15" fill="${color2}" fill-opacity="0.8">자연스러운 하이라이팅 기법과 섀도우를 연출하여 생생한 입체감을 보여줍니다.</text>

    <!-- Detailed visual placeholder -->
    <rect x="100" y="1260" width="280" height="200" fill="${color2}" fill-opacity="0.15" rx="8"/>
    <text x="240" y="1370" font-family="Pretendard, system-ui, sans-serif" font-weight="800" font-size="16" fill="${color2}" text-anchor="middle">CLOSE-UP VIEW</text>
    
    <rect x="420" y="1260" width="280" height="200" fill="${color2}" fill-opacity="0.15" rx="8"/>
    <text x="560" y="1370" font-family="Pretendard, system-ui, sans-serif" font-weight="800" font-size="16" fill="${color2}" text-anchor="middle">TEXTURE DETAILS</text>

    <!-- Footer -->
    <text x="400" y="1540" font-family="Pretendard, system-ui, sans-serif" font-weight="500" font-size="14" fill="${color2}" fill-opacity="0.5" text-anchor="middle">© 2026 SEONGMI PARK. ALL RIGHTS RESERVED.</text>
  </svg>`.replace(/#/g, '%23');
};

const createDetailHighlightSVG = (title: string, desc: string, bg: string, accent: string) => {
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
    <rect width="600" height="400" fill="${bg}"/>
    <circle cx="300" cy="150" r="80" fill="none" stroke="${accent}" stroke-width="2" stroke-opacity="0.4"/>
    <circle cx="300" cy="150" r="50" fill="${accent}" fill-opacity="0.2"/>
    <path d="M 280 150 L 320 150 M 300 130 L 300 170" stroke="${accent}" stroke-width="3" stroke-linecap="round"/>
    <text x="300" y="270" font-family="Pretendard, system-ui, sans-serif" font-weight="800" font-size="22" fill="${accent}" text-anchor="middle">${title}</text>
    <text x="300" y="310" font-family="Pretendard, system-ui, sans-serif" font-weight="400" font-size="14" fill="${accent}" fill-opacity="0.8" text-anchor="middle">${desc}</text>
    <line x1="250" y1="340" x2="350" y2="340" stroke="${accent}" stroke-width="1"/>
  </svg>`.replace(/#/g, '%23');
};

const createRedesignSVG = (title: string, isBefore: boolean, mainColor: string, accentColor: string) => {
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
    <rect width="800" height="500" fill="${mainColor}"/>
    
    <!-- Watermark grid -->
    <path d="M 0 50 L 800 50 M 0 100 L 800 100 M 0 150 L 800 150 M 0 200 L 800 200 M 0 250 L 800 250 M 0 300 L 800 300 M 0 350 L 800 350 M 0 400 L 800 400 M 0 450 L 800 450" stroke="${accentColor}" stroke-width="0.5" stroke-opacity="0.1"/>
    <path d="M 100 0 L 100 500 M 200 0 L 200 500 M 300 0 L 300 500 M 400 0 L 400 500 M 500 0 L 500 500 M 600 0 L 600 500 M 700 0 L 700 500" stroke="${accentColor}" stroke-width="0.5" stroke-opacity="0.1"/>

    <!-- Status badge -->
    <rect x="40" y="40" width="120" height="34" rx="17" fill="${isBefore ? '%23EF4444' : '%2310B981'}" fill-opacity="0.2" stroke="${isBefore ? '%23EF4444' : '%2310B981'}" stroke-width="1.5"/>
    <text x="100" y="62" font-family="Pretendard, system-ui, sans-serif" font-weight="800" font-size="14" fill="${isBefore ? '%23EF4444' : '%2310B981'}" text-anchor="middle">${isBefore ? 'BEFORE' : 'AFTER REDESIGN'}</text>

    <!-- Content -->
    <text x="400" y="200" font-family="Pretendard, system-ui, sans-serif" font-weight="900" font-size="38" fill="${accentColor}" text-anchor="middle" letter-spacing="1">${title}</text>
    
    <!-- Visual Representation -->
    <g transform="translate(400, 330)">
      ${isBefore ? `
        <!-- Messy legacy UI components -->
        <rect x="-180" y="-50" width="360" height="100" fill="gray" fill-opacity="0.2" stroke="${accentColor}" stroke-width="1" stroke-dasharray="5,5"/>
        <text x="0" y="0" font-family="Pretendard, system-ui, sans-serif" font-weight="400" font-size="14" fill="${accentColor}" fill-opacity="0.6" text-anchor="middle">복잡하고 일관성 없는 기존 그리드 구조</text>
        <circle cx="-140" cy="0" r="15" fill="red" fill-opacity="0.5"/>
        <circle cx="140" cy="0" r="15" fill="yellow" fill-opacity="0.5"/>
      ` : `
        <!-- High polish redesign UI components -->
        <rect x="-200" y="-60" width="400" height="120" fill="white" fill-opacity="0.05" rx="16" stroke="${accentColor}" stroke-width="2"/>
        <circle cx="-150" cy="0" r="22" fill="${accentColor}" fill-opacity="0.3"/>
        <rect x="-110" y="-12" width="180" height="8" rx="4" fill="${accentColor}"/>
        <rect x="-110" y="4" width="120" height="6" rx="3" fill="${accentColor}" fill-opacity="0.5"/>
        <rect x="110" y="-15" width="60" height="30" rx="15" fill="${accentColor}"/>
        <text x="140" y="4" font-family="Pretendard, system-ui, sans-serif" font-weight="700" font-size="11" fill="${mainColor}" text-anchor="middle">CLICK</text>
      `}
    </g>

    <text x="400" y="450" font-family="Pretendard, system-ui, sans-serif" font-weight="400" font-size="14" fill="${accentColor}" fill-opacity="0.5" text-anchor="middle">
      ${isBefore ? '복잡한 텍스트 배치 및 낮은 가독성' : '미니멀리즘 인터페이스와 고대비 비주얼 가독성'}
    </text>
  </svg>`.replace(/#/g, '%23');
};

const createBannerSVG = (title: string, subtitle: string, bg: string, text: string) => {
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="450" viewBox="0 0 1000 450">
    <rect width="1000" height="450" fill="${bg}"/>
    
    <!-- Abstract premium decorations -->
    <path d="M -100 450 C 300 450, 200 0, 1000 0 L 1000 450 Z" fill="white" fill-opacity="0.03"/>
    <circle cx="850" cy="225" r="120" fill="none" stroke="${text}" stroke-width="1" stroke-opacity="0.2"/>
    <circle cx="850" cy="225" r="90" fill="none" stroke="${text}" stroke-width="3" stroke-opacity="0.4"/>
    
    <!-- Typography -->
    <text x="100" y="160" font-family="Pretendard, system-ui, sans-serif" font-weight="400" font-size="18" fill="${text}" fill-opacity="0.6" letter-spacing="6">2026 SPRING COLLECTION</text>
    <text x="100" y="250" font-family="Pretendard, system-ui, sans-serif" font-weight="900" font-size="56" fill="${text}" letter-spacing="1">${title}</text>
    <text x="100" y="310" font-family="Pretendard, system-ui, sans-serif" font-weight="500" font-size="22" fill="${text}" fill-opacity="0.8">${subtitle}</text>
    
    <!-- Minimalist Button Mockup -->
    <rect x="100" y="350" width="160" height="46" rx="23" fill="${text}"/>
    <text x="180" y="378" font-family="Pretendard, system-ui, sans-serif" font-weight="700" font-size="14" fill="${bg}" text-anchor="middle">자세히 보기 →</text>
  </svg>`.replace(/#/g, '%23');
};

const create3DSVG = (title: string, bg: string, color: string) => {
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
    <rect width="800" height="600" fill="${bg}"/>
    
    <!-- Ambient backlighting -->
    <circle cx="400" cy="300" r="280" fill="${color}" fill-opacity="0.1" filter="blur(40px)"/>

    <!-- Simulated 3D objects with neat shadows & lighting -->
    <g transform="translate(400, 260)">
      <!-- Ground reflection -->
      <ellipse cx="0" cy="180" rx="220" ry="25" fill="black" fill-opacity="0.2"/>
      
      <!-- Center Cylinder -->
      <path d="M -100 -50 L -100 120 A 100 25 0 0 0 100 120 L 100 -50 Z" fill="q" fill-opacity="0.1" stroke="${color}" stroke-width="4"/>
      <ellipse cx="0" cy="-50" rx="100" ry="25" fill="${bg}" stroke="${color}" stroke-width="4"/>
      
      <!-- Floating Glass Sphere -->
      <circle cx="-120" cy="-30" r="60" fill="none" stroke="${color}" stroke-width="2" stroke-dasharray="6,3"/>
      <circle cx="-120" cy="-30" r="58" fill="white" fill-opacity="0.1"/>
      <path d="M -160 -30 A 40 40 0 0 1 -120 -70" fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round"/>

      <!-- Floating Metallic Torus -->
      <ellipse cx="140" cy="60" rx="80" ry="40" fill="none" stroke="${color}" stroke-width="12" stroke-opacity="0.8"/>
      <ellipse cx="140" cy="60" rx="50" ry="25" fill="none" stroke="${bg}" stroke-width="8"/>
    </g>

    <!-- Text overlay -->
    <text x="400" y="520" font-family="Pretendard, system-ui, sans-serif" font-weight="800" font-size="24" fill="${color}" text-anchor="middle" letter-spacing="2">${title}</text>
    <text x="400" y="555" font-family="Pretendard, system-ui, sans-serif" font-weight="400" font-size="14" fill="${color}" fill-opacity="0.6" text-anchor="middle">OCTANE RENDER &amp; CINEMA 4D CREATION</text>
  </svg>`.replace(/#/g, '%23');
};

const createVideoSVG = (title: string, bg: string, color: string) => {
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540">
    <rect width="960" height="540" fill="${bg}"/>
    
    <!-- Dark glass border overlay -->
    <rect x="20" y="20" width="920" height="500" rx="16" fill="none" stroke="${color}" stroke-width="2" stroke-opacity="0.2"/>

    <!-- Waveforms representing sound in video -->
    <g transform="translate(480, 270)" stroke="${color}" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.6">
      <path d="M -300 0 Q -225 -120, -150 0 T 0 0 T 150 0 T 300 0" stroke-width="1.5" stroke-dasharray="4,4"/>
      <path d="M -300 0 Q -225 150, -150 0 T 0 0 T 150 0 T 300 0" stroke-width="3"/>
    </g>

    <!-- Cinematic letterbox -->
    <rect x="0" y="0" width="960" height="60" fill="black" fill-opacity="0.4"/>
    <rect x="0" y="480" width="960" height="60" fill="black" fill-opacity="0.4"/>

    <!-- Top cinematic text -->
    <text x="50" y="38" font-family="Pretendard, system-ui, sans-serif" font-weight="700" font-size="14" fill="${color}" letter-spacing="4">CHOONSUNG STUDIO MOTION FILM</text>
    <text x="910" y="38" font-family="Pretendard, system-ui, sans-serif" font-weight="500" font-size="12" fill="${color}" fill-opacity="0.5" text-anchor="end">24 FPS | ULTRA HD</text>

    <!-- Center Play Button Overlay -->
    <circle cx="480" cy="270" r="55" fill="white" fill-opacity="0.1" stroke="${color}" stroke-width="2"/>
    <circle cx="480" cy="270" r="45" fill="${color}"/>
    <polygon points="472,255 496,270 472,285" fill="${bg}"/>

    <!-- Info -->
    <text x="480" y="440" font-family="Pretendard, system-ui, sans-serif" font-weight="800" font-size="24" fill="${color}" text-anchor="middle" letter-spacing="1">${title}</text>
    <text x="480" y="465" font-family="Pretendard, system-ui, sans-serif" font-weight="400" font-size="13" fill="${color}" fill-opacity="0.6" text-anchor="middle">클릭하여 시네마틱 모션 포트폴리오 재생</text>
  </svg>`.replace(/#/g, '%23');
};

// Initial gorgeous pre-seeded high-fidelity design portfolio items
export const DEFAULT_PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 'detail-hera',
    category: 'DETAIL_PAGE',
    title: '헤라(HERA) 시그니처 뷰티 립스틱 상세페이지',
    subtitle: '감성적 톤앤매너로 재탄생한 하이엔드 코스메틱 상세 비주얼 디자인',
    projectIntro: '헤라의 플래그십 라인인 시그니처 립스틱의 가치를 현대적이고 우아한 감성으로 시각화한 모바일 최적화 상세페이지입니다.',
    tools: ['Figma', 'Photoshop', 'Illustrator'],
    concept: 'MINIMAL LUXURY & ORGANIC FLOW (절제된 화려함과 자연스러운 비주얼 흐름)',
    overviewImage: createDetailOverviewSVG('HERA SIGNATURE LIPSTICK', '#151513', '#E6C9A8'),
    highlights: [
      {
        id: 'hl-1',
        title: '정교한 에디토리얼 그리드 레이아웃',
        description: '획일적인 간격의 기존 커머스 틀을 깨고, 매거진을 읽는 듯한 대담한 비대칭 황금 분할 그리드 시스템을 적용하여 가치를 드높였습니다.',
        image: createDetailHighlightSVG('EDITORIAL GRID', '매거진의 감성을 담은 정교한 에디토리얼 레이아웃 설계', '#151513', '#E6C9A8')
      },
      {
        id: 'hl-2',
        title: '톤온톤 누드베이지 컬러 시스템',
        description: '제품의 텍스처와 피부 톤이 물 흐르듯 연결되는 정교한 뉴트럴 샌드 컬러 배색을 통해 감성적이고 깊이 있는 분위기를 고조시켰습니다.',
        image: createDetailHighlightSVG('ORGANIC TONE ON TONE', '피부톤과 호흡하는 정밀한 뉴트럴 샌드 배색 설정', '#E6C9A8', '#151513')
      },
      {
        id: 'hl-3',
        title: '클로즈업 텍스처 하이라이팅',
        description: '고해상도 제품 질감을 그대로 살리기 위해 반사광을 미세 조정하고, 촉촉함과 매트함을 넘나드는 텍스처 셰이딩을 독창적으로 표현했습니다.',
        image: createDetailHighlightSVG('TEXTURE DETAIL', '하이엔드 가치를 살리는 초고해상도 질감 셰이딩 연출', '#1F201C', '#E6C9A8')
      }
    ]
  },
  {
    id: 'detail-apple',
    category: 'DETAIL_PAGE',
    title: '애플(Apple) iPad Air 에디토리얼 상세페이지',
    subtitle: '가벼움과 강력한 M-시리즈 칩의 폭발적 성능을 시각적 레이어로 극대화한 상세페이지',
    projectIntro: '아이패드 에어의 극강의 가벼움과 세련된 컬러를 감각적인 3D 뎁스 드로잉 레이아웃으로 기획 및 제작하였습니다.',
    tools: ['Figma', 'Photoshop', 'Blender'],
    concept: 'WEIGHTLESS POWER (중력을 거스르는 듯한 우아한 역동성)',
    overviewImage: createDetailOverviewSVG('IPAD AIR PROMOTION', '#0B111E', '#60A5FA'),
    highlights: [
      {
        id: 'hl-4',
        title: '입체적인 3D 레이어링 기법',
        description: '기기를 공중에 띄우는 이메징 기법과 우아한 낙하 음영을 통해 극강의 가벼운 두께감을 직관적으로 인지하도록 설계했습니다.',
        image: createDetailHighlightSVG('3D LAYERING', '공중 부양 기법과 그림자 정밀 렌더링으로 두께감 시각화', '#0B111E', '#60A5FA')
      },
      {
        id: 'hl-5',
        title: '기능 중심의 하이라이트 인포그래픽',
        description: '복잡한 반도체 스펙을 미려한 유기적 라인 그래픽과 네온 블루 아우라로 연출하여 기술력을 한눈에 각인시킵니다.',
        image: createDetailHighlightSVG('TECH INFOGRAPHICS', 'M-시리즈의 압도적 스펙을 유기적 인포그래픽으로 직관화', '#080E1A', '#38BDF8')
      }
    ]
  },
  {
    id: 'redesign-spotify',
    category: 'REDESIGN',
    title: '스포티파이(Spotify) 모바일 플레이어 UI/UX 리디자인',
    subtitle: '사용자 친화적인 원터치 컨트롤 중심의 미니멀리즘 인터페이스 개선',
    projectIntro: '클러터가 심해진 기존 오디오 제어 화면을 타이포그래피 대조 기법과 직관적 제스처 플로우로 혁신한 UX/UI 고도화 디자인 프로젝트입니다.',
    tools: ['Figma', 'Illustrator'],
    beforeImage: createRedesignSVG('LEGACY DECORATED COMPONENT', true, '#1A1C19', '#A8A29E'),
    afterImage: createRedesignSVG('SPOTIFY NEW UI CONTEXT', false, '#121212', '#1DB954')
  },
  {
    id: 'redesign-bmw',
    category: 'REDESIGN',
    title: 'BMW 디지털 커머스 웹 메인 페이지 리디자인',
    subtitle: '웅장하고 대담한 레이아웃과 풀화면 고화질 차량 디스플레이 구축',
    projectIntro: '기존의 좁고 번잡한 정보 위주의 그리드에서 벗어나, 차량의 역동성을 담은 대담한 타이포그래피와 와이드 무비 백그라운드 레이아웃으로 전면 개편했습니다.',
    tools: ['Figma', 'Photoshop', 'Cinema 4D'],
    beforeImage: createRedesignSVG('BMW CLUTTERED GRID PAGE', true, '#2B2B2B', '#E5E7EB'),
    afterImage: createRedesignSVG('BMW ULTRA-WIDE ELEGANCE', false, '#0A0A0A', '#3B82F6')
  },
  {
    id: 'banner-hyundaicard',
    category: 'BANNER',
    title: '현대카드 2026 현대무용 페스티벌 메인 프로모션 배너',
    image: createBannerSVG('HYUNDAI CARD', '현대무용 페스티벌 2026 - 대담한 타이포그래피', '#1C1917', '#E7E5E4')
  },
  {
    id: 'banner-nike',
    category: 'BANNER',
    title: '나이키(Nike) Air Max Day 디지털 익스클루시브 배너',
    image: createBannerSVG('NIKE AIR MAX', '가장 짜릿한 혁신의 공기 - 단 3일간의 한정 발매', '#EA580C', '#FFFFFF')
  },
  {
    id: 'banner-chanel',
    category: 'BANNER',
    title: '샤넬(Chanel) No.5 오 드 빠르펭 헤리티지 컬렉션 배너',
    image: createBannerSVG('CHANEL NO.5', '시대를 초월한 우아함, 전설적인 클래식 센트 컬렉션', '#09090B', '#FCD34D')
  },
  {
    id: '3d-futuristic',
    category: 'THREE_D',
    title: '아우디 e-tron 일렉트릭 콘셉트카 점토식 오브젝트 렌더',
    description: 'Blender를 활용해 점토 재질과 거친 석조 빌딩 구조를 매칭하고, 미래형 일렉트릭 세단의 사이버펑크 쉐입을 묵직한 조명과 안개 효과로 조명한 3D 렌더링입니다.',
    image: create3DSVG('AUDI e-tron 3D CONCEPTS', '#1E1B18', '#FF6B6B')
  },
  {
    id: '3d-glassmorphism',
    category: 'THREE_D',
    title: '글래스모피즘 기반 추상 모바일 아이콘셋 개발',
    description: 'Cinema 4D 굴절 피지컬 렌더러를 이용하여 두껍고 투명한 유리 고리, 크롬 도금 구체, 파스텔 도자기 원기둥의 광학 굴절 및 빛 퍼짐을 정교하게 담아냈습니다.',
    image: create3DSVG('GLASSMORPHIC SHAPES', '#0F172A', '#38BDF8')
  },
  {
    id: 'video-branding',
    category: 'VIDEO',
    title: '춘성스튜디오 - 브랜드 헤리티지 오프닝 모션 타이틀',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Playable simulation available locally if empty
    thumbnail: createVideoSVG('BRAND HERITAGE OPENING', '#111827', '#F59E0B'),
    description: '웅장한 타이포그래피의 조각들이 빛과 안개를 헤치고 날아가 하나의 견고한 로고 마크로 병합되는 고감도 모션그래픽 브랜드 오프너 필름입니다.'
  },
  {
    id: 'video-commercial',
    category: 'VIDEO',
    title: '미니멀 오가닉 에센스 - 감성 시네마틱 3D 광고 필름',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: createVideoSVG('ORGANIC COSMETIC Commercial', '#1A2E1A', '#A3E635'),
    description: '자연의 이슬 방울이 떨어지며 에센스 화장품 병에 파동을 일으키는 슬로우 모션 3D 렌더링 기반 영상물로, 오디오 사운드 디자인과 모션 트래킹을 결합했습니다.'
  }
];
