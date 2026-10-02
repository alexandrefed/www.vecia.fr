/**
 * Comment storage on built-in node:sqlite. One file, WAL mode, created on first use.
 * Path: COMMENTS_DB_PATH (default ./data/comments.db; the Docker image sets /data/comments.db).
 */

import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

export type CommentStatus = 'published' | 'queued' | 'dropped';
export type AuthorKind = 'human' | 'agent' | 'team';

export interface CommentRow {
  id: number;
  target: string;
  parent_id: number | null;
  author_name: string;
  author_kind: AuthorKind;
  agent_name: string | null;
  team_member: string | null;
  body: string;
  link_count: number;
  ip_hash: string;
  ua_hash: string;
  created_at: string;
  status: CommentStatus;
  verdict: string | null;
  verdict_label: string | null;
  verdict_reason: string | null;
  model: string | null;
  moderated_at: string | null;
  moderated_by: 'model' | 'alexandre' | null;
}

export type NewComment = Omit<CommentRow, 'id' | 'moderated_at' | 'moderated_by'> & {
  moderated_at?: string | null;
  moderated_by?: 'model' | 'alexandre' | null;
};

let db: DatabaseSync | undefined;
let openedPath: string | undefined;

function dbPath(): string {
  return resolve(process.env.COMMENTS_DB_PATH || './data/comments.db');
}

export function getDb(): DatabaseSync {
  const path = dbPath();
  if (db && openedPath === path) return db;
  db?.close();
  mkdirSync(dirname(path), { recursive: true });
  db = new DatabaseSync(path);
  openedPath = path;
  db.exec(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY,
      target TEXT NOT NULL,
      parent_id INTEGER,
      author_name TEXT NOT NULL,
      author_kind TEXT NOT NULL,
      agent_name TEXT,
      team_member TEXT,
      body TEXT NOT NULL,
      link_count INTEGER NOT NULL DEFAULT 0,
      ip_hash TEXT NOT NULL,
      ua_hash TEXT NOT NULL,
      created_at TEXT NOT NULL,
      status TEXT NOT NULL,
      verdict TEXT,
      verdict_label TEXT,
      verdict_reason TEXT,
      model TEXT,
      moderated_at TEXT,
      moderated_by TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_comments_target_status ON comments (target, status);
    CREATE INDEX IF NOT EXISTS idx_comments_ip_created ON comments (ip_hash, created_at);
  `);
  return db;
}

export function insertComment(c: NewComment): number {
  const r = getDb()
    .prepare(
      `INSERT INTO comments (target, parent_id, author_name, author_kind, agent_name, team_member, body, link_count,
         ip_hash, ua_hash, created_at, status, verdict, verdict_label, verdict_reason, model, moderated_at, moderated_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      c.target, c.parent_id, c.author_name, c.author_kind, c.agent_name, c.team_member, c.body, c.link_count,
      c.ip_hash, c.ua_hash, c.created_at, c.status, c.verdict, c.verdict_label, c.verdict_reason, c.model,
      c.moderated_at ?? null, c.moderated_by ?? null,
    );
  return Number(r.lastInsertRowid);
}

export function getComment(id: number): CommentRow | undefined {
  return getDb().prepare('SELECT * FROM comments WHERE id = ?').get(id) as unknown as CommentRow | undefined;
}

export function setStatus(id: number, status: CommentStatus, by: 'model' | 'alexandre'): boolean {
  const r = getDb()
    .prepare('UPDATE comments SET status = ?, moderated_by = ?, moderated_at = ? WHERE id = ?')
    .run(status, by, new Date().toISOString(), id);
  return Number(r.changes) > 0;
}

export function publishedFor(target: string): CommentRow[] {
  return getDb()
    .prepare("SELECT * FROM comments WHERE target = ? AND status = 'published' ORDER BY created_at ASC, id ASC")
    .all(target) as unknown as CommentRow[];
}

/** Rows written since `sinceIso` by one ip_hash (any status: rejected-by-the-model posts still count). */
export function countByIp(ipHash: string, sinceIso: string): number {
  const r = getDb().prepare('SELECT COUNT(*) AS n FROM comments WHERE ip_hash = ? AND created_at >= ?').get(ipHash, sinceIso) as unknown as { n: number };
  return r.n;
}

export function countByAgent(agentName: string, sinceIso: string): number {
  const r = getDb().prepare('SELECT COUNT(*) AS n FROM comments WHERE agent_name = ? AND created_at >= ?').get(agentName, sinceIso) as unknown as { n: number };
  return r.n;
}

export interface PublicComment {
  id: number;
  parent_id: number | null;
  author_name: string;
  author_kind: AuthorKind;
  agent_name: string | null;
  team_member: string | null;
  body: string;
  created_at: string;
  verdict_label: string | null;
  replies: PublicComment[];
}

/** Public shape of a comment: no hashes, no moderation internals except the label chip. */
export function toPublic(c: CommentRow): Omit<PublicComment, 'replies'> {
  return {
    id: c.id,
    parent_id: c.parent_id,
    author_name: c.author_name,
    author_kind: c.author_kind,
    agent_name: c.agent_name,
    team_member: c.team_member,
    body: c.body,
    created_at: c.created_at,
    verdict_label: c.verdict_label,
  };
}

/** Flat rows (oldest first) into top-level comments with one level of replies. */
export function buildThread(rows: CommentRow[]): PublicComment[] {
  const top: PublicComment[] = [];
  const byId = new Map<number, PublicComment>();
  for (const r of rows) {
    const node: PublicComment = { ...toPublic(r), replies: [] };
    byId.set(r.id, node);
    const parent = r.parent_id ? byId.get(r.parent_id) : undefined;
    if (parent) parent.replies.push(node);
    else if (!r.parent_id) top.push(node);
    // reply whose parent is not published: hidden
  }
  return top;
}
