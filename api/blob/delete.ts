import type { VercelRequest, VercelResponse } from '@vercel/node';
import { del } from '@vercel/blob';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'DELETE') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  const storeId = process.env.BLOB_STORE_ID;

  if (!token) {
    res.status(500).json({ ok: false, error: 'Missing BLOB_READ_WRITE_TOKEN' });
    return;
  }
  if (!storeId) {
    res.status(500).json({ ok: false, error: 'Missing BLOB_STORE_ID' });
    return;
  }

  const path = (req.query.path as string) || (req.body as { path?: string })?.path;
  if (!path) {
    res.status(400).json({ ok: false, error: 'Missing ?path=... or body.path' });
    return;
  }

  try {
    const url = `https://${storeId}.public.blob.vercel-storage.com/${path}`;
    await del(url, { token });

    res.status(200).json({ ok: true, deleted: path });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    res.status(500).json({ ok: false, error: message || 'Delete failed' });
  }
}
