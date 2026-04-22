// Public surface of @slopit/core. Keep this file small and deliberate —
// every export here is a promise to consumers. See ARCHITECTURE.md.

export { createStore } from './db/store.js'
export type { Store, StoreConfig } from './db/store.js'

export * from './schema/index.js'

export { createBlog, createApiKey } from './blogs.js'
export { createPost } from './posts.js'

export { SlopItError } from './errors.js'
export type { SlopItErrorCode } from './errors.js'

// Factories below are stubs for now; wire them up one at a time.
export { createApiRouter } from './api/index.js'
export type { ApiRouterConfig } from './api/index.js'

export { createRenderer } from './rendering/generator.js'
export type { Renderer, RendererConfig } from './rendering/generator.js'

export { createMcpServer } from './mcp/server.js'
export type { McpServerConfig } from './mcp/server.js'
