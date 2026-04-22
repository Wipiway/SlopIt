import type { Blog, Post } from '../schema/index.js'

// RSS + sitemap generators. Kept separate from the page renderer because
// they're pure string functions — no theme, no disk.

export function renderRss(_blog: Blog, _posts: Post[], _baseUrl: string): string {
  throw new Error('renderRss: not implemented')
}

export function renderSitemap(_blog: Blog, _posts: Post[], _baseUrl: string): string {
  throw new Error('renderSitemap: not implemented')
}
