// api/blob/get.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Replace with your store ID (see Vercel Blob dashboard)
const STORE_ID = process.env.BLOB_STORE_ID; 

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  const path = req.query.path as string | undefined;
  if (!path) {
    res.status(400).json({ ok: false, error: 'Missing ?path=...' });
    return;
  }

  if (!STORE_ID) {
    res.status(500).json({ ok: false, error: 'Missing BLOB_STORE_ID env var' });
    return;
  }

  try {
    const url = `https://${STORE_ID}.public.blob.vercel-storage.com/${path}`;
    const response = await fetch(url);

    if (!response.ok) {
      res.status(response.status).json({ ok: false, error: `Failed to fetch: ${response.statusText}` });
      return;
    }

    const data = await response.text();
    res.setHeader('Content-Type', response.headers.get('content-type') ?? 'application/json');
    res.status(200).send(data);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    res.status(500).json({ ok: false, error: message || 'Fetch failed' });
  }
}
