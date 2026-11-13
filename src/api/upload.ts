import { File } from 'expo-file-system';
import { API_URL } from './config';

interface PickedPdf {
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

export const uploadPdf = async (pdf: PickedPdf): Promise<UploadResponse> => {
  const form = new FormData();

  // file object instead of uri
  form.append('file', new File(pdf.uri) as any);

  const res = await fetch(`${API_URL}/api/upload`, {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    throw new Error(`Server replied ${res.status}`);
  }

  return res.json();
};
