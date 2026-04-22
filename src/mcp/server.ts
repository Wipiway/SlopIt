import type { Store } from '../db/store.js'
import type { Renderer } from '../rendering/generator.js'

export interface McpServerConfig {
  store: Store
  renderer: Renderer
}

/**
 * Returns an MCP server instance exposing SlopIt's tools
 * (create_post, list_posts, get_schema, etc.). Consumers attach it to their
 * own transport (stdio, HTTP streaming, etc.).
 */
export function createMcpServer(_config: McpServerConfig): unknown {
  // TODO: wire @modelcontextprotocol/sdk Server + tools from ./tools/
  throw new Error('createMcpServer: not implemented')
}
