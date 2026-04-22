-- Core schema: blogs, posts, api_keys.
-- Core owns migrations 001-099. Platform starts at 100. See ARCHITECTURE.md.

CREATE TABLE IF NOT EXISTS blogs (
  id          TEXT PRIMARY KEY,
  name        TEXT UNIQUE,
  theme       TEXT NOT NULL DEFAULT 'minimal',
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS posts (
  id              TEXT PRIMARY KEY,
  blog_id         TEXT NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
  slug            TEXT NOT NULL,
  title           TEXT NOT NULL,
  body            TEXT NOT NULL,
  excerpt         TEXT,
  tags            TEXT NOT NULL DEFAULT '[]',
  status          TEXT NOT NULL DEFAULT 'draft',
  seo_title       TEXT,
  seo_description TEXT,
  author          TEXT,
  cover_image     TEXT,
  published_at    TEXT,
  created_at      TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (blog_id, slug)
);

CREATE TABLE IF NOT EXISTS api_keys (
  id            TEXT PRIMARY KEY,
  blog_id       TEXT NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
  key_hash      TEXT NOT NULL UNIQUE,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  last_used_at  TEXT
);

CREATE INDEX IF NOT EXISTS idx_posts_blog_status ON posts(blog_id, status);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at);
