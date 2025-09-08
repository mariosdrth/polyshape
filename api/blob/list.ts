import type { VercelRequest, VercelResponse } from '@vercel/node';
import { list } from '@vercel/blob';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      res.status(500).json({ error: 'Missing BLOB_READ_WRITE_TOKEN' });
      return;
    }
    const result = await list({ token });
    res.status(200).json(result.blobs);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    res.status(500).json({ ok: false, error: message || 'Failed to list blobs' });
  }
}
