import { File, Paths } from 'expo-file-system';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, FlatList, Pressable, Text, View } from 'react-native';
import { getApiUrl } from '../../api/config';
import ActionMenu from '../../component/actionMenu';
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
  const { files, isLoading, loadFiles, pickFile, renameExisting, removeFile } =
    useAppStore();

  // the row whose 3-dots menu is open
  const [menuFor, setMenuFor] = useState<FileItem | null>(null);
  // the row being renamed
  const [editing, setEditing] = useState<FileItem | null>(null);

  // this wipes the server copy too, so ask first
  const confirmDelete = (item: FileItem) => {
    Alert.alert(
      'Delete this file?',
      `"${item.name}" is removed from the database and the server disk. This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => removeFile(item.serverId),
        },
      ],
    );
  };

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
          <View className="mb-2.5 flex-row items-center rounded-2xl border border-border bg-surface">
            <Pressable
              onPress={() => router.push(`/reader?id=${item.id}`)}
              className="flex-1 p-4 active:opacity-70"
            >
              <Text className="font-semibold text-main" numberOfLines={1}>
                {item.name}
              </Text>

              <Text className="mt-1 text-xs text-muted">
                {item.size} · {item.date}
              </Text>
            </Pressable>

            <Pressable
              hitSlop={8}
              onPress={() => setMenuFor(item)}
              className="px-4 py-5 active:opacity-50"
            >
              <Text className="text-lg leading-5 text-muted">⋮</Text>
            </Pressable>
          </View>
        )}
      />

      <ActionMenu
        visible={menuFor !== null}
        title={menuFor?.name}
        onClose={() => setMenuFor(null)}
        actions={[
          {
            label: 'Rename',
            onPress: () => {
              const row = menuFor;
              setMenuFor(null);
              setEditing(row);
            },
          },
          {
            label: 'Open in another app',
            onPress: () => {
              const row = menuFor;
              setMenuFor(null);
              if (row) openFile(row);
            },
          },
          {
            label: 'Delete',
            destructive: true,
            onPress: () => {
              const row = menuFor;
              setMenuFor(null);
              if (row) confirmDelete(row);
            },
          },
        ]}
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
