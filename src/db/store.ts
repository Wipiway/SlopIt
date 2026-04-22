import Database from 'better-sqlite3'
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export interface StoreConfig {
  dbPath: string
}

export interface Store {
  readonly db: Database.Database
  close(): void
}

export function createStore(config: StoreConfig): Store {
  const db = new Database(config.dbPath)
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')
  runMigrations(db)
  return {
    db,
    close: () => db.close(),
  }
}

function runMigrations(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      filename    TEXT PRIMARY KEY,
      applied_at  TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `)

  const here = dirname(fileURLToPath(import.meta.url))
  const migrationsDir = join(here, 'migrations')
  const files = readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort()

  const applied = new Set(
    db
      .prepare('SELECT filename FROM schema_migrations')
      .all()
      .map((row) => (row as { filename: string }).filename),
  )
  const record = db.prepare('INSERT INTO schema_migrations (filename) VALUES (?)')

  for (const file of files) {
    if (applied.has(file)) continue
    const sql = readFileSync(join(migrationsDir, file), 'utf8')
    const tx = db.transaction(() => {
      db.exec(sql)
      record.run(file)
    })
    tx()
  }
}
