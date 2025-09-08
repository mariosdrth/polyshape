import type { VercelRequest, VercelResponse } from '@vercel/node';
import { put } from '@vercel/blob';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    res.status(500).json({ ok: false, error: 'Missing BLOB_READ_WRITE_TOKEN' });
    return;
  }

  try {
    let path = 'json/' + Date.now() + '.json';
    let bytes: Buffer = Buffer.from('{}');

    if (req.headers['content-type']?.includes('application/json') && typeof req.body === 'object') {
      const { path: p, data } = req.body as { path?: string; data?: unknown };
      if (p) path = p;
      bytes = Buffer.from(JSON.stringify(data ?? {}), 'utf-8');
    } else {
      const urlPath = req.query.path as string | undefined;
      if (!urlPath) {
        res.status(400).json({ ok: false, error: 'Provide JSON body or ?path= query param' });
        return;
      }
      path = urlPath;
      bytes = Buffer.isBuffer(req.body)
        ? req.body
        : Buffer.from(String(req.body ?? ''), 'utf-8');
    }

    const { url, pathname } = await put(path, bytes, {
      token,
      access: 'public',
      contentType: 'application/json',
    });

    res.status(200).json({ ok: true, url, pathname });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    res.status(500).json({ ok: false, error: message || 'Upload failed' });
  }
}
