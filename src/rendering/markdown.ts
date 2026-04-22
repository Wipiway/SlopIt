import { marked } from 'marked'

// Markdown → HTML. Synchronous because blog posts are short and we render
// once at publish time; no reason to reach for async here.
export function renderMarkdown(md: string): string {
  return marked.parse(md, { async: false }) as string
}
