import type { Story } from '../types/story';

const STORIES_KEY = 'story-xray:stories';
const ACTIVE_KEY  = 'story-xray:activeId';

export function loadAllStories(): Story[] {
  try {
    const raw = localStorage.getItem(STORIES_KEY);
    return raw ? (JSON.parse(raw) as Story[]) : [];
  } catch {
    return [];
  }
}

export function saveStory(story: Story): void {
  const stories = loadAllStories();
  const idx = stories.findIndex(s => s.id === story.id);
  const updated = { ...story, updatedAt: new Date().toISOString() };
  if (idx >= 0) {
    stories[idx] = updated;
  } else {
    stories.push(updated);
  }
  localStorage.setItem(STORIES_KEY, JSON.stringify(stories));
}

export function loadStory(id: string): Story | null {
  return loadAllStories().find(s => s.id === id) ?? null;
}

export function deleteStory(id: string): void {
  const stories = loadAllStories().filter(s => s.id !== id);
  localStorage.setItem(STORIES_KEY, JSON.stringify(stories));
}

export function getActiveStoryId(): string | null {
  return localStorage.getItem(ACTIVE_KEY);
}

export function setActiveStoryId(id: string): void {
  localStorage.setItem(ACTIVE_KEY, id);
}
