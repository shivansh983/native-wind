import { File, Paths } from 'expo-file-system';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, FlatList, Pressable, Text, View } from 'react-native';
import { getApiUrl } from '../../api/config';
import NameModal from '../../component/nameModal';
import CustomScreen from '../../component/screen';
import { FileItem, useAppStore } from '../../store/useStore';

// open in another app
const openFile = async (item: FileItem) => {
  try {
    let file = item.uri ? new File(item.uri) : null;

    // not on this device -> fetch it back
    if (!file?.exists) {
      file = await File.downloadFileAsync(
        `${getApiUrl()}${item.serverUrl}`,
        Paths.cache,
        { idempotent: true },
      );
    }

    const opts = { mimeType: item.mimeType, title: item.name };

    if (!(await File.canPreview(file, opts))) {
      Alert.alert('Cannot open', 'No app installed for this file type.');
      return;
    }

    await File.preview(file, opts);
  } catch (err) {
    Alert.alert(
      'Could not open',
      err instanceof Error ? err.message : 'Something went wrong',
    );
  }
};

const Files = () => {
  const router = useRouter();
  const { files, isLoading, loadFiles, pickFile, renameExisting } =
    useAppStore();

  // the row being renamed
  const [editing, setEditing] = useState<FileItem | null>(null);

  return (
    <CustomScreen title="Files" onUpload={pickFile}>
      <Text className="mb-3 text-xs text-muted">
        {files.length} {files.length === 1 ? 'file' : 'files'} in the database
      </Text>

      <FlatList
        data={files}
        keyExtractor={(item) => item.id}
        refreshing={isLoading}
        onRefresh={loadFiles}
        ListEmptyComponent={
          <View className="items-center rounded-2xl border border-border bg-surface p-8">
            <Text className="font-semibold text-main">No files yet</Text>
            <Text className="mt-1 text-xs text-muted">
              Tap Upload to pick a file, or pull down to refresh
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/reader?id=${item.id}`)}
            onLongPress={() => openFile(item)}
            className="mb-2.5 rounded-2xl border border-border bg-surface p-4 active:opacity-70"
          >
            <Text className="font-semibold text-main" numberOfLines={1}>
              {item.name}
            </Text>

            <View className="mt-1 flex-row items-center justify-between">
              <Text className="text-xs text-muted">
                {item.size} · {item.date}
              </Text>

              <Pressable
                hitSlop={8}
                onPress={() => setEditing(item)}
                className="active:opacity-60"
              >
                <Text className="text-xs font-bold text-primary">Rename</Text>
              </Pressable>
            </View>
          </Pressable>
        )}
      />

      <NameModal
        visible={editing !== null}
        title="Rename file"
        hint="Renames it in the database and on the server."
        initial={editing?.name ?? ''}
        confirmLabel="Save"
        onCancel={() => setEditing(null)}
        onConfirm={(name) => {
          const row = editing;
          setEditing(null);
          if (row) renameExisting(row.serverId, name);
        }}
      />
    </CustomScreen>
  );
};

export default Files;
