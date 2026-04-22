import { describe, expect, it } from 'vitest'
import { SlopItError } from '../src/errors.js'

describe('SlopItError', () => {
  it('carries code, message, and standard Error properties', () => {
    const e = new SlopItError('BLOG_NAME_CONFLICT', 'oops')
    expect(e.code).toBe('BLOG_NAME_CONFLICT')
    expect(e.message).toBe('oops')
    expect(e.name).toBe('SlopItError')
    expect(e).toBeInstanceOf(Error)
    expect(e).toBeInstanceOf(SlopItError)
    expect(typeof e.stack).toBe('string')
  })

  it('supports both declared codes', () => {
    const a = new SlopItError('BLOG_NAME_CONFLICT', 'a')
    const b = new SlopItError('BLOG_NOT_FOUND', 'b')
    expect(a.code).toBe('BLOG_NAME_CONFLICT')
    expect(b.code).toBe('BLOG_NOT_FOUND')
  })
})
