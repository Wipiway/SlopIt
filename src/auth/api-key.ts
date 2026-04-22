import { createHash, randomBytes } from 'node:crypto'

// API key lifecycle. Keys are opaque bearer tokens with a short "sk_slop_"
// prefix for visual recognition. We store only the sha256 hash.

const PREFIX = 'sk_slop_'

export function generateApiKey(): string {
  return PREFIX + randomBytes(24).toString('base64url')
}

export function hashApiKey(key: string): string {
  return createHash('sha256').update(key).digest('hex')
}

export function isApiKey(value: string): boolean {
  return value.startsWith(PREFIX)
}
