export async function upload(key: string, data: Blob | Buffer): Promise<string> {
  const url = process.env.BLOB_READ_WRITE_TOKEN
    ? `https://blob.vercel-storage.com/${key}`
    : null;
  if (!url) throw new Error('Storage not configured (BLOB_READ_WRITE_TOKEN)');
  const res = await fetch(url, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
    body: data,
  });
  if (!res.ok) throw new Error(`Storage upload failed: ${res.status}`);
  return res.url;
}

export async function getSignedUrl(key: string): Promise<string> {
  const url = process.env.BLOB_READ_WRITE_TOKEN
    ? `https://blob.vercel-storage.com/${key}?download=1`
    : null;
  if (!url) throw new Error('Storage not configured');
  return url;
}
