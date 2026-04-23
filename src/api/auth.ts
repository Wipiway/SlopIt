import type { MiddlewareHandler } from 'hono'
import type { Store } from '../db/store.js'
import type { Blog } from '../schema/index.js'
import { SlopItError } from '../errors.js'
import { getBlogInternal } from '../blogs.js'
import { verifyApiKey, hashApiKey } from './../auth/api-key.js'

export interface AuthMiddlewareConfig {
  store: Store
  authMode: 'api_key' | 'none'
}

const SKIP_PATHS = new Set(['/health', '/signup', '/schema', '/bridge/report_bug'])

type AuthVars = { blog: Blog; apiKeyHash: string }

/**
 * Resolves the authenticated blog and attaches it (plus the api-key hash
 * for idempotency scoping) to c.var. Skips /health, /signup, /schema,
 * /bridge/report_bug and any OPTIONS request.
 *
 * For authMode='api_key' (default): requires Bearer token, calls
 * verifyApiKey. On null → UNAUTHORIZED 401.
 *
 * For authMode='none' (self-hosted): loads blog from the :id route
 * param. No token required. apiKeyHash is the empty string (also used
 * by the idempotency middleware's signup-bootstrap case).
 *
 * Cross-blog guard: if :id doesn't match the resolved blog's id →
 * BLOG_NOT_FOUND (spec decision #18 — don't leak existence).
 */
/** Extract :id from /blogs/:id[/...] or /b/:id[/...] path segments. */
function extractIdFromPath(path: string): string | undefined {
  const m = path.match(/^\/(?:blogs|b)\/([^/?]+)/)
  return m ? m[1] : undefined
}

export function authMiddleware(config: Pick<AuthMiddlewareConfig, 'store' | 'authMode'>): MiddlewareHandler<{ Variables: AuthVars }> {
  return async (c, next) => {
    if (c.req.method === 'OPTIONS' || SKIP_PATHS.has(c.req.path)) {
      return next()
    }
    // c.req.param('id') is undefined in global middleware; extract from path.
    const idParam = c.req.param('id') ?? extractIdFromPath(c.req.path)

    if (config.authMode === 'none') {
      if (idParam === undefined) return next()
      const blog = getBlogInternal(config.store, idParam)  // throws BLOG_NOT_FOUND
      c.set('blog', blog)
      c.set('apiKeyHash', '')
      return next()
    }

    // authMode === 'api_key'
    const auth = c.req.header('Authorization')
    if (!auth || !auth.startsWith('Bearer ')) {
      throw new SlopItError('UNAUTHORIZED', 'Missing or malformed Authorization header')
    }
    const key = auth.slice('Bearer '.length).trim()
    const blog = verifyApiKey(config.store, key)
    if (!blog) {
      throw new SlopItError('UNAUTHORIZED', 'Invalid API key')
    }

    if (idParam !== undefined && idParam !== blog.id) {
      throw new SlopItError('BLOG_NOT_FOUND', `Blog "${idParam}" does not exist`, { blogId: idParam })
    }

    c.set('blog', blog)
    c.set('apiKeyHash', hashApiKey(key))
    await next()
  }
}
