import { File } from 'expo-file-system';
import { getApiUrl } from './config';

export interface PickedFile {
  uri: string;
  name: string;
  size?: number;
  mimeType?: string;
}

// one row of the files table
export interface ServerFile {
  id: number;
  name: string;
  originalName: string;
  savedAs: string;
  mimeType?: string;
  size: number;
  uploadedAt: string;
  renamedAt: string;
  url: string;
}

// wrong ip, server down, or an api error
const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const base = getApiUrl();
  let res: Response;

  try {
    res = await fetch(`${base}${path}`, {
      signal: AbortSignal.timeout(20000),
      ...init,
    });
  } catch {
    throw new Error('Server not reachable. Check your network or IP.');
  }

  if (!res.ok) {
    const reason = await res
      .json()
      .then((d) => d?.error)
      .catch(() => null);
    throw new Error(reason ?? `Server replied ${res.status}`);
  }

  return res.json();
};

// POST /api/upload
export const uploadFile = async (picked: PickedFile, name: string) => {
  const form = new FormData();

  form.append('name', name);
  // file object, not uri
  form.append('file', new File(picked.uri) as any);

  const data = await request<{ message: string; file: ServerFile }>(
    '/api/upload',
    { method: 'POST', body: form },
  );

  return data.file;
};

// GET /api/upload
export const fetchFiles = async () => {
  const data = await request<{ files: ServerFile[] }>('/api/upload');
  return data.files;
};

// PATCH /api/upload/:id
export const renameFile = async (id: number, name: string) => {
  const data = await request<{ message: string; file: ServerFile }>(
    `/api/upload/${id}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    },
  );

  return data.file;
};

// DELETE /api/upload/:id
export const deleteFile = async (id: number) => {
  const data = await request<{ message: string; id: number }>(
    `/api/upload/${id}`,
    { method: 'DELETE' },
  );

  return data.id;
};

// server hands back a pdf for office files
export const previewUrl = (serverUrl: string) =>
  `${getApiUrl()}/api/upload/preview/${serverUrl.split('/').pop()}`;
