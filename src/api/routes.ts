import type { Hono } from 'hono'
import { z } from 'zod'
import { PostInputSchema } from '../schema/index.js'
import type { Blog } from '../schema/index.js'
import type { ApiRouterConfig } from './index.js'
import { SlopItError } from '../errors.js'

type Vars = { blog: Blog; apiKeyHash: string }

export function mountRoutes(app: Hono<{ Variables: Vars }>, config: ApiRouterConfig): void {
  // Health
  app.get('/health', (c) => c.json({ ok: true }))

  // Schema — returns PostInput JSONSchema at top level
  app.get('/schema', (c) => {
    return c.json(z.toJSONSchema(PostInputSchema) as Record<string, unknown>)
  })

  // Bridge stub
  app.post('/bridge/report_bug', () => {
    throw new SlopItError(
      'NOT_IMPLEMENTED',
      'Bug reports are handled by the platform bridge, not core',
      config.bugReportUrl !== undefined ? { use: config.bugReportUrl } : {},
    )
  })

  // Remaining routes land in later tasks (Task 16+)
}
