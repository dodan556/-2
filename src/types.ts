export type PortfolioCategory = 'DETAIL_PAGE' | 'REDESIGN' | 'BANNER' | 'THREE_D' | 'VIDEO';

export interface DetailPageItem {
  id: string;
  category: 'DETAIL_PAGE';
  title: string;
  subtitle: string;
  projectIntro: string;
  tools: string[];
  concept: string;
  overviewImage: string;
  thumbnail?: string;
  colors?: string[]; // hex codes for custom design guide palette selection
  highlights: {
    id: string;
    title: string;
    description: string;
    image: string;
  }[];
}

export interface RedesignItem {
  id: string;
  category: 'REDESIGN';
  title: string;
  subtitle: string;
  projectIntro: string;
  tools: string[];
  beforeImage: string;
  afterImage: string;
  thumbnail?: string;
  colors?: string[]; // hex codes for custom design guide palette selection
}

export interface BannerItem {
  id: string;
  category: 'BANNER';
  title: string;
  image: string;
  thumbnail?: string;
}

export interface ThreeDItem {
  id: string;
  category: 'THREE_D';
  title: string;
  description?: string;
  image: string;
  thumbnail?: string;
  videoUrl?: string;
}

export interface VideoItem {
  id: string;
  category: 'VIDEO';
  title: string;
  videoUrl: string;
  thumbnail: string;
  description?: string;
}

export type PortfolioItem = DetailPageItem | RedesignItem | BannerItem | ThreeDItem | VideoItem;

export interface SkillItem {
  id: string;
  name: string;
  iconType: string; // e.g., 'photoshop' | 'illustrator' | 'figma' | 'premiere' | 'aftereffects' | 'cinema4d' | 'blender'
  percentage?: number;
}

export interface SiteConfig {
  heroTitle: string;
  heroSubTitleLines: string[];
  introTitle: string;
  introDescription: string;
  email: string;
  blogUrl: string;
  youtubeUrl: string;
  youtubeChannelName: string;
  certificates?: {
    id: string;
    name: string;
    date: string;
    issuer: string;
  }[];
}

export interface ContactMessage {
  id: string;
  senderName: string;
  senderContact: string;
  messageText: string;
  createdAt: string;
}
