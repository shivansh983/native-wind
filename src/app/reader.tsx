import { File, Paths } from 'expo-file-system';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { getApiUrl } from '../api/config';
import Reader from '../component/reader';
import { isImage, isPdf, useAppStore } from '../store/useStore';
import { COLORS } from '../theme/colors';

const ReaderScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = useAppStore((state) => state.files.find((f) => f.id === id));

  const [path, setPath] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState('Opening...');

  useEffect(() => {
    const load = async () => {
      if (!item) {
        setError('File not found');
        return;
      }

      try {
        // pdf and images open as they are
        const asIs = isPdf(item) || isImage(item);

        // already on the phone
        if (asIs && item.uri) {
          const local = new File(item.uri);
          if (local.exists) {
            setPath(local.uri);
            return;
          }
        }

        // office files take a moment on the server
        setStatus(asIs ? 'Downloading...' : 'Converting on the server...');

        // office files come back as pdf from /preview
        const saved = item.serverUrl.split('/').pop();
        const url = asIs
          ? `${getApiUrl()}${item.serverUrl}`
          : `${getApiUrl()}/api/upload/preview/${saved}`;

        const file = await File.downloadFileAsync(url, Paths.cache, {
          idempotent: true,
        });

        setPath(file.uri);
      } catch {
        setError('Could not open this file');
      }
    };

    load();
  }, [item]);

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>{error}</Text>
      </View>
    );
  }

  if (!path) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: item?.name ?? 'File' }} />
        <ActivityIndicator color={COLORS.primary} />
        <Text style={styles.status}>{status}</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: item?.name ?? 'File' }} />
      <Reader path={path} image={item ? isImage(item) : false} />
    </>
  );
};

export default ReaderScreen;

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  text: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  status: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 10,
  },
});
