import { describe, it, expect } from 'vitest'
import {
  mkdtempSync,
  readFileSync,
  existsSync,
  writeFileSync as fsWriteFileSync,
  mkdirSync,
} from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { createStore } from '../src/db/store.js'
import { createRenderer } from '../src/rendering/generator.js'
import { uploadMedia } from '../src/media.js'
import type { Blog } from '../src/schema/index.js'

const PNG_BYTES = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])

function makeFixtures() {
  const dir = mkdtempSync(join(tmpdir(), 'slopit-media-'))
  const store = createStore({ dbPath: join(dir, 'test.db') })
  store.db
    .prepare(
      "INSERT INTO blogs (id, name, theme, created_at) VALUES (?, ?, 'minimal', datetime('now'))",
    )
    .run('blog_test', 'test')
  const blog: Blog = { id: 'blog_test', name: 'test', theme: 'minimal', createdAt: '' }
  const renderer = createRenderer({
    store,
    outputDir: join(dir, 'out'),
    baseUrl: 'https://test.example/',
  })
  return { store, renderer, blog, dir }
}

describe('uploadMedia', () => {
  it('writes a row, writes the file, and returns an absolute URL', () => {
    const { store, renderer, blog } = makeFixtures()
    const result = uploadMedia(
      store,
      renderer,
      { maxBytes: 5_000_000, maxTotalBytesPerBlog: null },
      blog,
      { filename: 'photo.png', contentType: 'image/png', bytes: new Uint8Array(PNG_BYTES) },
    )

    expect(result.id).toMatch(/^[a-z0-9]+$/i)
    expect(result.contentType).toBe('image/png')
    expect(result.bytes).toBe(PNG_BYTES.length)
    expect(result.url).toBe('https://test.example/_media/' + result.id + '.png')

    const row = store.db.prepare('SELECT * FROM media WHERE id = ?').get(result.id) as {
      blog_id: string
      filename: string
    }
    expect(row.blog_id).toBe('blog_test')
    expect(row.filename).toBe('photo.png')

    const filePath = join(renderer.mediaDir('blog_test'), result.id + '.png')
    expect(existsSync(filePath)).toBe(true)
    expect(readFileSync(filePath).equals(PNG_BYTES)).toBe(true)
  })

  it('rejects an unsupported content_type with MEDIA_TYPE_UNSUPPORTED', () => {
    const { store, renderer, blog } = makeFixtures()
    expect(() =>
      uploadMedia(store, renderer, { maxBytes: 5_000_000, maxTotalBytesPerBlog: null }, blog, {
        filename: 'doc.pdf',
        contentType: 'application/pdf',
        bytes: new Uint8Array([1, 2, 3]),
      }),
    ).toThrow(/MEDIA_TYPE_UNSUPPORTED|Unsupported content_type/)
  })

  it('rejects bytes over maxBytes with MEDIA_TOO_LARGE', () => {
    const { store, renderer, blog } = makeFixtures()
    expect(() =>
      uploadMedia(store, renderer, { maxBytes: 4, maxTotalBytesPerBlog: null }, blog, {
        filename: 'big.png',
        contentType: 'image/png',
        bytes: new Uint8Array(PNG_BYTES),
      }),
    ).toThrow(/MEDIA_TOO_LARGE|exceeds per-file cap/)
  })

  it('rejects upload past per-blog quota with MEDIA_QUOTA_EXCEEDED', () => {
    const { store, renderer, blog } = makeFixtures()
    const limits = { maxBytes: 5_000_000, maxTotalBytesPerBlog: 16 }
    uploadMedia(store, renderer, limits, blog, {
      filename: 'a.png',
      contentType: 'image/png',
      bytes: new Uint8Array(PNG_BYTES),
    })
    expect(() =>
      uploadMedia(store, renderer, limits, blog, {
        filename: 'b.png',
        contentType: 'image/png',
        bytes: new Uint8Array(PNG_BYTES),
      }),
    ).toThrow(/MEDIA_QUOTA_EXCEEDED/)
  })

  it('rolls back the DB row when post-INSERT file work fails', () => {
    const { store, renderer, blog, dir } = makeFixtures()
    // Pre-create the parent dir, then plant a regular file where the
    // blog directory would go so mkdirSync hits ENOTDIR on traversal.
    mkdirSync(join(dir, 'out'), { recursive: true })
    fsWriteFileSync(join(dir, 'out', 'blog_test'), 'i-am-a-file-not-a-dir')

    expect(() =>
      uploadMedia(store, renderer, { maxBytes: 5_000_000, maxTotalBytesPerBlog: null }, blog, {
        filename: 'a.png',
        contentType: 'image/png',
        bytes: new Uint8Array(PNG_BYTES),
      }),
    ).toThrow(/ENOTDIR|Not a directory|EEXIST/i)

    const count = store.db
      .prepare('SELECT COUNT(*) as c FROM media WHERE blog_id = ?')
      .get('blog_test') as { c: number }
    expect(count.c).toBe(0)
  })
})
