# Self-Hosted SlopIt

Run a single-tenant SlopIt instance on your own server. One blog, one SQLite file, one Caddy, done.

> **Status:** scaffold only. `server.ts`, `Dockerfile`, `docker-compose.yml`, and `Caddyfile` arrive once core factories are wired up.

## Planned layout

```
examples/self-hosted/
├── server.ts           # ~30 lines: createStore → createRenderer → createApiRouter + createMcpServer, boot Hono
├── Dockerfile
├── docker-compose.yml  # app + Caddy + Litestream (optional)
└── Caddyfile           # single-host, auto HTTPS
```

## Philosophy

The self-hosted example is a contract, not a feature. Every core change must keep `docker compose up` working and a post publishable via `POST /blogs/:id/posts`. If it doesn't, the change doesn't merge.
