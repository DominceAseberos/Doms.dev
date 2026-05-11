import type {
  LandingData,
  LandingStory,
  StrengthCard,
  FeaturedProject,
} from '../types/landing';
import baseline from '../data/landingData.json';

const baseData = baseline as LandingData;

export function mergeStory(base: LandingStory, patch?: Partial<LandingStory> | null): LandingStory {
  if (!patch) return base;
  return {
    chapters: patch.chapters ?? base.chapters,
    hero: { ...base.hero, ...patch.hero },
    origin: {
      ...base.origin,
      ...patch.origin,
      paragraphs: patch.origin?.paragraphs ?? base.origin.paragraphs,
    },
    arsenal: {
      ...base.arsenal,
      ...patch.arsenal,
      marqueeItems: patch.arsenal?.marqueeItems ?? base.arsenal.marqueeItems,
      strengths: normalizeStrengths(patch.arsenal?.strengths, base.arsenal.strengths),
    },
    work: {
      ...base.work,
      ...patch.work,
      projects: normalizeProjects(patch.work?.projects, base.work.projects),
    },
    human: {
      ...base.human,
      ...patch.human,
      facts: patch.human?.facts ?? base.human.facts,
    },
    connect: { ...base.connect, ...patch.connect },
  };
}

function normalizeStrengths(
  next?: StrengthCard[] | null,
  fallback?: [StrengthCard, StrengthCard, StrengthCard]
): [StrengthCard, StrengthCard, StrengthCard] {
  const fb = fallback ?? baseData.story.arsenal.strengths;
  if (!next || next.length < 3) return fb;
  return [next[0], next[1], next[2]];
}

function normalizeProjects(
  next?: FeaturedProject[] | null,
  fallback?: [FeaturedProject, FeaturedProject]
): [FeaturedProject, FeaturedProject] {
  const fb = fallback ?? baseData.story.work.projects;
  if (!next || next.length < 2) return fb;
  return [next[0], next[1]];
}

export function normalizeLandingData(raw: Partial<LandingData> | null | undefined): LandingData {
  if (!raw) return baseData;
  return {
    hero: { ...baseData.hero, ...raw.hero },
    tags: raw.tags ?? baseData.tags,
    metrics: raw.metrics ?? baseData.metrics,
    moreProjectsImages: raw.moreProjectsImages ?? baseData.moreProjectsImages,
    story: mergeStory(baseData.story, raw.story),
  };
}
