export type SlopItErrorCode = 'BLOG_NAME_CONFLICT' | 'BLOG_NOT_FOUND'

export class SlopItError extends Error {
  readonly code: SlopItErrorCode

  constructor(code: SlopItErrorCode, message: string) {
    super(message)
    this.name = 'SlopItError'
    this.code = code
  }
}
