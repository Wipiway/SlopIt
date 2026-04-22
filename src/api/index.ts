import { Hono } from 'hono'
import type { Store } from '../db/store.js'
import type { Renderer } from '../rendering/generator.js'

export interface ApiRouterConfig {
  store: Store
  renderer: Renderer
}

/**
 * Returns a Hono router exposing the core REST API. Consumers mount this
 * under their own app — core never boots a server.
 */
export function createApiRouter(_config: ApiRouterConfig): Hono {
  const app = new Hono()

  app.get('/health', (c) => c.json({ ok: true }))

  // TODO: /blogs, /blogs/:id, /blogs/:id/posts, /posts/:slug ...

  return app
}
