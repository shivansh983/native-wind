import { uploadFile } from '@/api/upload';
import * as DocumentPicker from 'expo-document-picker';
import { Alert } from 'react-native';
import { create } from 'zustand';

export interface FileItem {
  id: string;
  name: string;
  size: string;
  uri: string;
  date: string;
  status: 'Success' | 'Failed' | 'Shared';
  mimeType?: string;
  serverUrl?: string; // backend path
}

interface AppState {
  isUploading: boolean;
  stats: {
    uploaded: number;
    success: number;
    failed: number;
    shared: number;
  };
  files: FileItem[];
  triggerUpload: () => Promise<void>;
}

export const isImage = (file: FileItem) =>
  file.mimeType?.startsWith('image/') === true ||
  /\.(jpe?g|png|webp|gif)$/i.test(file.name);

// only pdf renders without converting
export const isPdf = (file: FileItem) =>
  file.mimeType === 'application/pdf' || /\.pdf$/i.test(file.name);

// bytes -> "1.25 MB"
const formatSize = (bytes?: number) => {
  if (!bytes) return 'File';
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

export const useAppStore = create<AppState>((set) => ({
  isUploading: false,
  stats: { uploaded: 0, success: 0, failed: 0, shared: 0 },
  files: [],

  triggerUpload: async () => {
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
    set({ isUploading: true });

    let status: FileItem['status'] = 'Success';
    let serverUrl: string | undefined;

    try {
      const saved = await uploadFile({
        uri: picked.uri,
        name: picked.name,
        mimeType: picked.mimeType,
      });
      serverUrl = saved.file.url;
    } catch (err) {
      status = 'Failed';
      // why it failed
      Alert.alert(
        'Upload failed',
        err instanceof Error ? err.message : 'Could not reach the server',
      );
    }

    const newFile: FileItem = {
      id: String(Date.now()),
      name: picked.name,
      size: formatSize(picked.size),
      uri: picked.uri,
      date: 'Just now',
      mimeType: picked.mimeType,
      status,
      serverUrl,
    };

    set((state) => ({
      isUploading: false,
      files: [newFile, ...state.files],
      stats: {
        ...state.stats,
        uploaded: state.stats.uploaded + 1,
        success: state.stats.success + (status === 'Success' ? 1 : 0),
        failed: state.stats.failed + (status === 'Failed' ? 1 : 0),
      },
    }));
  },
}));
