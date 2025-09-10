import type { VercelRequest, VercelResponse } from '@vercel/node';
import { upload } from '../../src/lib/storage/upload.js';
import { randomUUID } from 'crypto';
import { applyCORS } from '../../src/lib/storage/cors.js';

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function isValidDate(dateStr: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const date = new Date(dateStr);
  return !isNaN(date.getTime()) && date.toISOString().startsWith(dateStr);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (applyCORS(req, res)) return;
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  try {
    const { title, content, date, publicationUrl, authors, venue } = req.body ?? {};

    // Validation
    if (!title || typeof title !== 'string') {
      res.status(400).json({ ok: false, error: 'Invalid or missing title' });
      return;
    }
    if (!Array.isArray(content) || content.some(p => typeof p !== 'string' || !p.trim())) {
      res.status(400).json({ ok: false, error: 'Invalid content array' });
      return;
    }
    if (!date || typeof date !== 'string' || !isValidDate(date)) {
      res.status(400).json({ ok: false, error: 'Invalid or missing date (YYYY-MM-DD)' });
      return;
    }
    try {
      new URL(publicationUrl);
    } catch {
      res.status(400).json({ ok: false, error: 'Invalid publicationUrl' });
      return;
    }
    if (!Array.isArray(authors) || authors.some(a => typeof a !== 'string' || !a.trim())) {
      res.status(400).json({ ok: false, error: 'Invalid authors list' });
      return;
    }
    if (!venue || typeof venue !== 'string') {
      res.status(400).json({ ok: false, error: 'Invalid or missing venue' });
      return;
    }

    // Filename
    const slug = slugify(title).slice(0, 10);
    const id = randomUUID();
    const filename = `${date}_${slug}_${id}.json`;

    // Upload
    const jsonData = JSON.stringify({ title, content, date, publicationUrl, authors, venue }, null, 2);
    const result = await upload('publications', filename, jsonData);

    res.status(201).json({ ok: true, blob: result });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    res.status(500).json({ ok: false, error: message || 'Failed to upload publication' });
  }
}
