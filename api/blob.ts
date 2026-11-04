import { put } from '@vercel/blob';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const filename = (req.query?.filename as string) || `wox-asset-${Date.now()}`;
    const contentType = req.headers['content-type'] || 'application/octet-stream';
    const customToken = req.headers['x-blob-token'] as string | undefined;
    const token = customToken || process.env.BLOB_READ_WRITE_TOKEN;

    if (!token) {
      return res.status(400).json({
        error: 'BLOB_READ_WRITE_TOKEN ausente no ambiente Vercel. Configure a variável BLOB_READ_WRITE_TOKEN no painel da Vercel.',
      });
    }

    const blob = await put(`wox-faber/${Date.now()}-${filename}`, req, {
      access: 'public',
      contentType,
      token,
    });

    return res.status(200).json({
      url: blob.url,
      pathname: blob.pathname,
      contentType: blob.contentType,
      provider: 'vercel-blob',
    });
  } catch (error: any) {
    console.error('Vercel Blob upload error:', error);
    return res.status(500).json({
      error: error?.message || 'Falha ao enviar arquivo para o Vercel Blob.',
    });
  }
}
