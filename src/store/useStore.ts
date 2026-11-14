import {
  PickedFile,
  ServerFile,
  fetchFiles,
  renameFile,
  uploadFile,
} from '@/api/upload';
import * as DocumentPicker from 'expo-document-picker';
import { Alert } from 'react-native';
import { create } from 'zustand';

export interface FileItem {
  id: string;
  serverId: number;
  name: string;
  size: string;
  bytes: number;
  date: string;
  status: 'Success' | 'Failed';
  mimeType?: string;
  uri: string;
  serverUrl: string;
}

// a FileItem fits, and so does a file handed to us by another app
export interface FileLike {
  name: string;
  mimeType?: string;
}

export const isImage = (file: FileLike) =>
  file.mimeType?.startsWith('image/') === true ||
  /\.(jpe?g|png|webp|gif)$/i.test(file.name);

// only pdf renders without converting
export const isPdf = (file: FileLike) =>
  file.mimeType === 'application/pdf' || /\.pdf$/i.test(file.name);

// server turns these into a pdf
export const isOffice = (file: FileLike) =>
  /\.(docx?|xlsx?|pptx?)$/i.test(file.name) ||
  file.mimeType === 'application/msword' ||
  file.mimeType === 'application/vnd.ms-excel' ||
  file.mimeType === 'application/vnd.ms-powerpoint' ||
  file.mimeType?.startsWith('application/vnd.openxmlformats-officedocument.') ===
    true;

// anything else goes out to another app
export const canRender = (file: FileLike) =>
  isPdf(file) || isImage(file) || isOffice(file);

// bytes -> "1.25 MB"
const formatSize = (bytes?: number) => {
  if (!bytes) return 'File';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// -> "14 Nov 2026, 4:52 pm"
const formatDate = (iso?: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';

  const hour = d.getHours();
  const minute = String(d.getMinutes()).padStart(2, '0');
  const suffix = hour < 12 ? 'am' : 'pm';
  const shown = hour % 12 === 0 ? 12 : hour % 12;

  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}, ${shown}:${minute} ${suffix}`;
};

// server row -> list row
const toItem = (row: ServerFile, localUri = ''): FileItem => ({
  id: String(row.id),
  serverId: row.id,
  name: row.name,
  size: formatSize(row.size),
  bytes: row.size,
  date: formatDate(row.uploadedAt),
  status: 'Success',
  mimeType: row.mimeType,
  uri: localUri,
  serverUrl: row.url,
});

interface AppState {
  files: FileItem[];
  isUploading: boolean;
  isLoading: boolean;
  failed: number;
  // picked, waiting for a name
  pending: PickedFile | null;
  loadFiles: () => Promise<void>;
  pickFile: () => Promise<void>;
  confirmUpload: (name: string) => Promise<void>;
  cancelUpload: () => void;
  renameExisting: (id: number, name: string) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  files: [],
  isUploading: false,
  isLoading: false,
  failed: 0,
  pending: null,

  // read the files table
  loadFiles: async () => {
    set({ isLoading: true });
    try {
      const rows = await fetchFiles();
      const known = get().files;

      set({
        // keep the local copy, the reader is quicker with it
        files: rows.map((row) =>
          toItem(row, known.find((f) => f.serverId === row.id)?.uri ?? ''),
        ),
      });
    } catch (err) {
      Alert.alert(
        'Could not load files',
        err instanceof Error ? err.message : 'Something went wrong',
      );
    } finally {
      set({ isLoading: false });
    }
  },

  pickFile: async () => {
    const result = await DocumentPicker.getDocumentAsync({
      // same list as the backend
      type: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
        'text/plain',
      ],
      copyToCacheDirectory: true,
    });

    if (result.canceled) return;

    const picked = result.assets[0];

    // name it first
    set({
      pending: {
        uri: picked.uri,
        name: picked.name,
        size: picked.size,
        mimeType: picked.mimeType,
      },
    });
  },

  cancelUpload: () => set({ pending: null }),

  confirmUpload: async (name) => {
    const picked = get().pending;
    if (!picked) return;

    set({ pending: null, isUploading: true });

    try {
      const saved = await uploadFile(picked, name.trim() || picked.name);

      set((state) => ({
        files: [toItem(saved, picked.uri), ...state.files],
      }));
    } catch (err) {
      // why it failed
      Alert.alert(
        'Upload failed',
        err instanceof Error ? err.message : 'Could not reach the server',
      );
      set((state) => ({ failed: state.failed + 1 }));
    } finally {
      set({ isUploading: false });
    }
  },

  renameExisting: async (id, name) => {
    try {
      const saved = await renameFile(id, name);

      set((state) => ({
        files: state.files.map((f) =>
          f.serverId === id ? toItem(saved, f.uri) : f,
        ),
      }));
    } catch (err) {
      Alert.alert(
        'Rename failed',
        err instanceof Error ? err.message : 'Something went wrong',
      );
    }
  },
}));
