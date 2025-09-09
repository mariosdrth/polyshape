import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAll } from '../../src/lib/storage/list.js';
import { applyCORS } from '../../src/lib/storage/cors.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (applyCORS(req, res)) return;
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  try {
    const blobs = await getAll('publications');
    res.status(200).json(blobs);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    res.status(500).json({ ok: false, error: message || 'Failed to list publications' });
  }
}
