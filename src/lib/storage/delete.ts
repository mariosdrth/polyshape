import { del } from '@vercel/blob';

export async function remove(pathname: string) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error('Missing BLOB_READ_WRITE_TOKEN');
  }
  if (!pathname || typeof pathname !== 'string') {
    throw new Error('Invalid pathname');
  }

  const result = await del(pathname, { token });
  return result;
}
