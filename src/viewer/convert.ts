import { File, Paths } from 'expo-file-system';
import { previewUrl, uploadFile } from '../api/upload';
import type { IncomingFile } from './incoming';

// office needs the server, so send it up first
export const convertToPdf = async (file: IncomingFile) => {
  const saved = await uploadFile(
    { uri: file.uri, name: file.name, mimeType: file.mimeType },
    file.name,
  );

  const pdf = await File.downloadFileAsync(previewUrl(saved.url), Paths.cache, {
    idempotent: true,
  });

  return pdf.uri;
};
