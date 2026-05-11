export interface StoryChapterMeta {
  id: string;
  stickyLabel: string;
}

export interface StoryHero {
  fullName: string;
  role: string;
  tagline: string;
  scrollHint: string;
}

export interface StoryOrigin {
  headline: string;
  paragraphs: string[];
}

export interface StrengthCard {
  title: string;
  description: string;
  symbol: string;
}

export interface StoryArsenal {
  headline: string;
  marqueeItems: string[];
  strengths: [StrengthCard, StrengthCard, StrengthCard];
}

export interface FeaturedProject {
  title: string;
  description: string;
  tags: string[];
  href: string;
  gradient: 'alpha' | 'beta';
}

export interface StoryWork {
  headline: string;
  projects: [FeaturedProject, FeaturedProject];
}

export interface StoryHuman {
  quote: string;
  facts: string[];
}

export interface StoryConnect {
  headline: string;
  subtext: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
  portfolioLinkLabel: string;
  footerCopyright: string;
}

export interface LandingStory {
  chapters: StoryChapterMeta[];
  hero: StoryHero;
  origin: StoryOrigin;
  arsenal: StoryArsenal;
  work: StoryWork;
  human: StoryHuman;
  connect: StoryConnect;
}

export interface LandingHeroLegacy {
  marquee: string[];
  kicker: string;
  displayKicker: string;
  bio: string;
  buttons: Array<{ label: string; link: string; variant?: string }>;
}

export interface LandingMetric {
  value: string;
  unit: string;
  label: string;
}

export interface LandingData {
  hero: LandingHeroLegacy;
  tags: string[];
  metrics: LandingMetric[];
  moreProjectsImages: string[];
  story: LandingStory;
}
