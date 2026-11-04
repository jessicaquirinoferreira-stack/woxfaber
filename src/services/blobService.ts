const BLOB_TOKEN_KEY = 'wox_vercel_blob_token';

export interface BlobUploadResult {
  url: string;
  pathname: string;
  provider: string;
}

export function getStoredBlobToken(): string {
  try {
    return localStorage.getItem(BLOB_TOKEN_KEY) || '';
  } catch {
    return '';
  }
}

export function setStoredBlobToken(token: string): void {
  try {
    if (token.trim()) {
      localStorage.setItem(BLOB_TOKEN_KEY, token.trim());
    } else {
      localStorage.removeItem(BLOB_TOKEN_KEY);
    }
  } catch {
    // ignore
  }
}

/**
 * Uploads any attachment (Image, Video .mp4/.webm/.mov, or PDF Manual) via /api/blob
 * using @vercel/blob in production or when token is configured.
 */
export async function uploadAttachmentToVercelBlob(file: File): Promise<BlobUploadResult> {
  const token = getStoredBlobToken();
  const headers: Record<string, string> = {
    'content-type': file.type || 'application/octet-stream',
  };
  if (token) {
    headers['x-blob-token'] = token;
  }

  const response = await fetch(`/api/blob?filename=${encodeURIComponent(file.name)}`, {
    method: 'POST',
    headers,
    body: file,
  });

  if (!response.ok) {
    let errText = 'Falha no upload do arquivo para o Vercel Blob.';
    try {
      const errJson = await response.json();
      if (errJson.error) errText = errJson.error;
    } catch {
      // ignore
    }
    throw new Error(errText);
  }

  return response.json();
}
