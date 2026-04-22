import { describe, expect, it } from 'vitest'
import { escapeHtml, render, loadTheme } from '../src/rendering/templates.js'

describe('escapeHtml', () => {
  it('escapes the five canonical HTML entities', () => {
    expect(escapeHtml('&')).toBe('&amp;')
    expect(escapeHtml('<')).toBe('&lt;')
    expect(escapeHtml('>')).toBe('&gt;')
    expect(escapeHtml('"')).toBe('&quot;')
    expect(escapeHtml("'")).toBe('&#39;')
  })

  it('handles a mix', () => {
    expect(escapeHtml('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;',
    )
  })

  it('passes through benign strings unchanged', () => {
    expect(escapeHtml('hello world')).toBe('hello world')
    expect(escapeHtml('')).toBe('')
  })

  it('escapes ampersands first (order matters)', () => {
    expect(escapeHtml('<&')).toBe('&lt;&amp;')
  })
})

describe('render', () => {
  it('substitutes {{var}} with escaped value', () => {
    expect(render('<p>{{name}}</p>', { name: '<script>' })).toBe('<p>&lt;script&gt;</p>')
  })

  it('substitutes {{{var}}} with raw (unescaped) value', () => {
    expect(render('<div>{{{html}}}</div>', { html: '<b>bold</b>' })).toBe('<div><b>bold</b></div>')
  })

  it('handles both forms in the same template', () => {
    const out = render('<p>{{text}}</p><div>{{{html}}}</div>', {
      text: '<script>',
      html: '<b>ok</b>',
    })
    expect(out).toBe('<p>&lt;script&gt;</p><div><b>ok</b></div>')
  })

  it('throws when an escaped var is missing', () => {
    expect(() => render('<p>{{missing}}</p>', {})).toThrow(/missing template variable: missing/i)
  })

  it('throws when a raw var is missing', () => {
    expect(() => render('<p>{{{missing}}}</p>', {})).toThrow(/missing template variable: missing/i)
  })

  it('handles whitespace inside braces (tolerant)', () => {
    expect(render('<p>{{ name }}</p>', { name: 'Ada' })).toBe('<p>Ada</p>')
    expect(render('<p>{{{  html  }}}</p>', { html: '<b>b</b>' })).toBe('<p><b>b</b></p>')
  })

  it('supports multiple occurrences of the same var', () => {
    expect(render('{{x}}-{{x}}', { x: 'a' })).toBe('a-a')
  })

  it('does not substitute {{ three braces }}} incorrectly', () => {
    expect(render('{{{a}}}{{b}}', { a: '<x>', b: 'y' })).toBe('<x>y')
  })
})

describe('loadTheme', () => {
  it('loads the minimal theme files', () => {
    const theme = loadTheme('minimal')
    expect(theme.post.length).toBeGreaterThan(0)
    expect(theme.index.length).toBeGreaterThan(0)
    expect(theme.cssPath.endsWith('style.css')).toBe(true)
  })

  it('post template contains expected placeholders', () => {
    const theme = loadTheme('minimal')
    expect(theme.post).toContain('{{postTitle}}')
    expect(theme.post).toContain('{{{postBody}}}')
    expect(theme.post).toContain('{{themeCssHref}}')
    expect(theme.post).toContain('{{blogHomeHref}}')
  })

  it('index template contains expected placeholders', () => {
    const theme = loadTheme('minimal')
    expect(theme.index).toContain('{{blogName}}')
    expect(theme.index).toContain('{{{postList}}}')
    expect(theme.index).toContain('{{themeCssHref}}')
  })
})
