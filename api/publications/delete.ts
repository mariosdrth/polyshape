import type { VercelRequest, VercelResponse } from '@vercel/node';
import { remove } from '../../src/lib/storage/delete.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'DELETE') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  try {
    const { filename } = req.body ?? {};
    if (!filename || typeof filename !== 'string') {
      res.status(400).json({ ok: false, error: 'Invalid or missing filename' });
      return;
    }

    const pathname = `publications/${filename}`;
    const result = await remove(pathname);

    res.status(200).json({ ok: true, deleted: result });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    res.status(500).json({ ok: false, error: message || 'Failed to delete publication' });
  }
}
