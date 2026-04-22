import { Hono } from 'hono'
import type { Store } from '../db/store.js'

export interface DashboardConfig {
  store: Store
}

/**
 * Minimal read-only dashboard — plain server-rendered HTML, one blog scope.
 * No JS framework, no build step. Consumer auth must inject the resolved
 * blog before mounting this router.
 */
export function createDashboard(_config: DashboardConfig): Hono {
  const app = new Hono()
  app.get('/', (c) => c.html('<h1>SlopIt dashboard (stub)</h1>'))
  return app
}
