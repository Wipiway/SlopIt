import { describe, expect, it } from 'vitest'
import { PostInputSchema } from '../src/schema/index.js'

describe('PostInputSchema', () => {
  it('accepts the minimum well-formed input', () => {
    const parsed = PostInputSchema.parse({
      title: 'Hello',
      body: 'Hello world',
    })
    expect(parsed.title).toBe('Hello')
    expect(parsed.body).toBe('Hello world')
    expect(parsed.status).toBe('published')
    expect(parsed.tags).toEqual([])
  })

  it('trims leading/trailing whitespace from title and body', () => {
    const parsed = PostInputSchema.parse({ title: '  Hello  ', body: '  body content  ' })
    expect(parsed.title).toBe('Hello')
    expect(parsed.body).toBe('body content')
  })

  it('accepts all optional fields', () => {
    const parsed = PostInputSchema.parse({
      title: 'A post',
      slug: 'a-post',
      body: 'hello',
      excerpt: 'summary',
      tags: ['ai', 'content'],
      status: 'draft',
      seoTitle: 'SEO title',
      seoDescription: 'SEO description',
      author: 'Agent 47',
      coverImage: 'https://example.com/img.png',
    })
    expect(parsed.slug).toBe('a-post')
    expect(parsed.status).toBe('draft')
    expect(parsed.tags).toEqual(['ai', 'content'])
  })

  it.each([
    ['empty title', { title: '', body: 'x' }],
    ['whitespace-only title', { title: '   ', body: 'x' }],
    ['title over 200 chars', { title: 'a'.repeat(201), body: 'x' }],
    ['empty body', { title: 'T', body: '' }],
    ['whitespace-only body', { title: 'T', body: '   ' }],
    ['slug too short (1 char)', { title: 'T', body: 'x', slug: 'a' }],
    ['slug over 100 chars', { title: 'T', body: 'x', slug: 'a'.repeat(101) }],
    ['slug with uppercase', { title: 'T', body: 'x', slug: 'Not-Valid' }],
    ['slug with underscore', { title: 'T', body: 'x', slug: 'bad_slug' }],
    ['slug with leading hyphen', { title: 'T', body: 'x', slug: '-leading' }],
    ['slug with trailing hyphen', { title: 'T', body: 'x', slug: 'trailing-' }],
    ['invalid status', { title: 'T', body: 'x', status: 'archived' }],
    ['coverImage not a URL', { title: 'T', body: 'x', coverImage: 'not-a-url' }],
    ['seoTitle over 200 chars', { title: 'T', body: 'x', seoTitle: 'a'.repeat(201) }],
    ['seoDescription over 300 chars', { title: 'T', body: 'x', seoDescription: 'a'.repeat(301) }],
    ['author over 100 chars', { title: 'T', body: 'x', author: 'a'.repeat(101) }],
    ['excerpt over 300 chars', { title: 'T', body: 'x', excerpt: 'a'.repeat(301) }],
  ])('rejects %s', (_, input) => {
    expect(() => PostInputSchema.parse(input)).toThrow()
  })

  describe('auto-slug validation (superRefine)', () => {
    it('rejects titles that would produce empty auto-slug when slug is omitted', () => {
      expect(() => PostInputSchema.parse({ title: '!!!', body: 'x' })).toThrow()
      expect(() => PostInputSchema.parse({ title: '日本語のタイトル', body: 'x' })).toThrow()
    })

    it('accepts titles with no slug-compatible chars when caller supplies an explicit slug', () => {
      expect(() => PostInputSchema.parse({
        title: '日本語のタイトル',
        body: 'x',
        slug: 'ja-title',
      })).not.toThrow()
    })

    it('accepts a valid title without explicit slug', () => {
      expect(() => PostInputSchema.parse({
        title: 'Valid Title',
        body: 'x',
      })).not.toThrow()
    })
  })
})
