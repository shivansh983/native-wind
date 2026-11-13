import { File } from 'expo-file-system';
import { getApiUrl } from './config';

interface PickedFile {
  uri: string;
  name: string;
  mimeType?: string;
}

interface UploadResponse {
  message: string;
  file: {
    name: string;
    savedAs: string;
    size: number;
    url: string;
  };
}

export const uploadFile = async (pdf: PickedFile): Promise<UploadResponse> => {
  const form = new FormData();

  // file object, not uri
  form.append('file', new File(pdf.uri) as any);

  const url = getApiUrl();
  let res: Response;

  // wrong ip or server down
  try {
    res = await fetch(`${url}/api/upload`, {
      method: 'POST',
      body: form,
      signal: AbortSignal.timeout(20000),
    });
  } catch (err) {
    if (err instanceof Error && err.name === 'TimeoutError') {
      throw new Error(`${url} did not answer in time. Is the server running?`);
    }
    throw new Error(`Cannot reach ${url}. Check the IP under Server.`);
  }

  // server said no
  if (!res.ok) {
    const reason = await res
      .json()
      .then((d) => d?.error)
      .catch(() => null);
    throw new Error(reason ?? `Server replied ${res.status}`);
  }

  return res.json();
};
