import { Directory, File, Paths } from 'expo-file-system';

export interface IncomingFile {
  uri: string;
  name: string;
  mimeType?: string;
}

// content:// ends in a document id, not a filename
const nameFrom = (uri: string, mimeType: string) => {
  let guess = '';

  try {
    guess = decodeURIComponent(uri).split(/[/:]/).pop() ?? '';
  } catch {
    guess = uri.split(/[/:]/).pop() ?? '';
  }

  guess = guess.split('?')[0].trim();

  // no extension -> use the mime type
  if (!/\.[a-z0-9]{1,5}$/i.test(guess)) {
    const ext = mimeType.split('/').pop();
    return ext ? `file.${ext}` : 'file';
  }

  return guess;
};

// an incoming uri dies with the task, so copy it first
export const resolveIncomingFile = async (
  uri: string,
): Promise<IncomingFile> => {
  const source = new File(uri);

  if (!source.exists) {
    throw new Error('This file is no longer available');
  }

  const mimeType = source.type || '';
  const name = nameFrom(source.name || uri, mimeType);

  // already on disk
  if (uri.startsWith('file://')) {
    return { uri, name, mimeType: mimeType || undefined };
  }

  const inbox = new Directory(Paths.cache, 'incoming');
  if (!inbox.exists) inbox.create({ intermediates: true });

  const target = new File(inbox, name);
  if (target.exists) target.delete();

  await source.copy(target);

  return { uri: target.uri, name, mimeType: mimeType || undefined };
};

// fallback for types we cannot draw
export const openElsewhere = async (file: IncomingFile) => {
  const local = new File(file.uri);
  const opts = { mimeType: file.mimeType, title: file.name };

  if (!(await local.canPreview(opts))) {
    throw new Error('No app on this device can open this file type.');
  }

  await local.preview(opts);
};
