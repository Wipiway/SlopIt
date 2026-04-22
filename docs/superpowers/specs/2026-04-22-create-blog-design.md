# createBlog — Design Spec

**Status:** Design approved 2026-04-22. Spec pending user review.
**Scope:** `@slopit/core`, first real feature pass.

---

## Context

`createBlog` is the foundational primitive in `@slopit/core`. It provisions a new blog and its first API key atomically. Every signup path builds on it:

- `POST /signup` REST handler — identical flow for self-hosted and platform.
- `signup` MCP tool — same core call, different transport.
- Self-hosted Docker bootstrap — first-run script calls `createBlog` once to initialize the single blog.

Core is single-blog-scoped at request time, so this primitive is the boundary between "no blog exists" and "blog exists with a key that can publish posts."

---

## Design decisions (resolved)

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | Blog `id` doubles as URL slug for unnamed blogs. | Strategy doc's `/b/xk7f2m` example implies a single field; no need for a separate `path_slug`. |
| 2 | Pure operations live in one file per domain: `src/blogs.ts`. | YAGNI; split into a directory when a file grows past ~200 lines. |
| 3 | Errors: single `SlopItError` class with string-literal `code`. | One public class, easy switch-map to HTTP at the transport boundary. Core never carries HTTP status codes. |
| 4 | Sync function, not async. | `better-sqlite3` is sync; no disk/network happens; async adds microtask overhead for no benefit. |
| 5 | No retry on ID collision. | 32⁸ ≈ 1.1 trillion combinations; statistically impossible at any scale we'll reach. |

---

## Signature

```ts
export function createBlog(
  store: Store,
  input: CreateBlogInput,
): { blog: Blog; apiKey: string }
```

The plaintext `apiKey` is returned once. It is never stored — only its sha256 hash is persisted in `api_keys.key_hash`.

---

## Input schema

Added to `src/schema/index.ts`:

```ts
export const CreateBlogInputSchema = z.object({
  name: z
    .string()
    .min(1)
    .max(63)
    .regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/)
    .optional(),
  theme: z.enum(['minimal', 'classic', 'zine']).default('minimal'),
})
export type CreateBlogInput = z.infer<typeof CreateBlogInputSchema>
```

`name` is DNS-subdomain-safe: lowercase alphanumerics + hyphens, no leading or trailing hyphen, ≤63 chars. The same constraints apply whether the blog ends up on a subdomain or not — keeps things consistent.

---

## ID generation

Local helper in `src/blogs.ts` (not exported):

```ts
import { randomBytes } from 'node:crypto'

const ID_ALPHABET = 'abcdefghijkmnpqrstuvwxyz23456789' // 32 chars; I/l/o/0/1 excluded

function generateBlogId(): string {
  const bytes = randomBytes(8)
  return Array.from(bytes, (b) => ID_ALPHABET[b % 32]).join('')
}
```

- 32-char alphabet is a power of 2; modulo is unbiased.
- Stdlib only — no `nanoid` dependency.
- Characters `I/l/o/0/1` omitted to reduce visual ambiguity.

---

## Transactional flow

```
BEGIN
  INSERT INTO blogs    (id, name, theme, created_at) VALUES (?, ?, ?, datetime('now'))
  INSERT INTO api_keys (id, blog_id, key_hash, created_at) VALUES (?, ?, ?, datetime('now'))
COMMIT
```

Wrapped in `db.transaction(() => { ... })`. Partial writes cannot occur.

---

## Error handling

- **Invalid input** → `CreateBlogInputSchema.parse(input)` throws a `ZodError`. Not rewrapped; consumers handle and map to HTTP 400 themselves.
- **Blog name conflict** → SQLite throws with `err.code === 'SQLITE_CONSTRAINT_UNIQUE'`. Catch and throw `new SlopItError('BLOG_NAME_CONFLICT', '...')`.
- **Any other DB error** → bubbles as-is. Core does not log or re-wrap; the consumer decides how to surface it.

### `src/errors.ts` (new)

```ts
export type SlopItErrorCode = 'BLOG_NAME_CONFLICT'

export class SlopItError extends Error {
  readonly code: SlopItErrorCode
  constructor(code: SlopItErrorCode, message: string) {
    super(message)
    this.name = 'SlopItError'
    this.code = code
  }
}
```

`SlopItErrorCode` is a union with exactly one member today. Add codes only when an operation actually throws them — per CLAUDE.md, no forward-looking flags.

---

## Public surface added

In `src/index.ts`:

```ts
export { createBlog } from './blogs.js'
export type { CreateBlogInput } from './schema/index.js'
export { SlopItError } from './errors.js'
export type { SlopItErrorCode } from './errors.js'
```

---

## Testing

New file: `tests/blogs.test.ts`. Tests:

1. Creates an unnamed blog; verifies return shape and `blog.id` is exactly 8 characters, all drawn from `abcdefghijkmnpqrstuvwxyz23456789`.
2. Creates a named blog; verifies `blog.name` persisted and `blog.id` still generated.
3. Verifies `apiKey` starts with `sk_slop_`, is unique per call, and its hash matches the stored row.
4. Verifies the plaintext key is never stored — no row in `api_keys` where `key_hash === plaintext`.
5. Verifies exactly one `api_keys` row linked to the new blog.
6. Throws `SlopItError` with `code === 'BLOG_NAME_CONFLICT'` when duplicate name is inserted.
7. Zod rejects names with uppercase / invalid chars / too long / leading or trailing hyphen.
8. Atomicity: if the `api_keys` insert fails, no `blogs` row remains.

Target: 100% line + branch coverage for `src/blogs.ts` and `src/errors.ts`.

---

## Out of scope (v1 protection)

Explicitly not in this feature pass:

- API key rotation or multiple keys per blog.
- Blog rename or theme change (`updateBlog`, later).
- Soft delete or archive.
- Blog lookup by name or id (`getBlog`, next pass).
- Anything touching `posts`.
