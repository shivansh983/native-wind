import { uploadPdf } from '@/api/upload';
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

// bytes -> "1.25 MB"
const formatSize = (bytes?: number) => {
  if (!bytes) return 'PDF';
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

export const useAppStore = create<AppState>((set) => ({
  isUploading: false,
  stats: { uploaded: 0, success: 0, failed: 0, shared: 0 },
  files: [],

  triggerUpload: async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      copyToCacheDirectory: true,
    });

    if (result.canceled) return;

    const pdf = result.assets[0];
    set({ isUploading: true });

    let status: FileItem['status'] = 'Success';
    let serverUrl: string | undefined;

    try {
      const saved = await uploadPdf({
        uri: pdf.uri,
        name: pdf.name,
        mimeType: pdf.mimeType,
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
      name: pdf.name,
      size: formatSize(pdf.size),
      uri: pdf.uri,
      date: 'Just now',
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
