import { File, Paths } from 'expo-file-system';
import { Alert, FlatList, Pressable, Text, View } from 'react-native';
import { getApiUrl } from '../../api/config';
import CustomScreen from '../../component/screen';
import { FileItem, useAppStore } from '../../store/useStore';

// open file
const openFile = async (item: FileItem) => {
  try {
    let file = new File(item.uri);

    // cache gone -> get it from server
    if (!file.exists) {
      if (!item.serverUrl) {
        Alert.alert('Not available', 'This file was never uploaded.');
        return;
      }
      file = await File.downloadFileAsync(
        `${getApiUrl()}${item.serverUrl}`,
        Paths.cache,
        { idempotent: true },
      );
    }

    const opts = { mimeType: 'application/pdf', title: item.name };

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
  const { files, triggerUpload } = useAppStore();

  return (
    <CustomScreen title="Files" onUpload={triggerUpload}>
      <Text className="mb-3 text-xs text-muted">
        {files.length} {files.length === 1 ? 'file' : 'files'} uploaded
      </Text>

      <FlatList
        data={files}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View className="items-center rounded-2xl border border-border bg-surface p-8">
            <Text className="font-semibold text-main">No files yet</Text>
            <Text className="mt-1 text-xs text-muted">
              Tap Upload to pick a file
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => openFile(item)}
            className="mb-2.5 flex-row items-center justify-between rounded-2xl border border-border bg-surface p-4 active:opacity-70"
          >
            <View className="flex-1 pr-3">
              <Text className="font-semibold text-main" numberOfLines={1}>
                {item.name}
              </Text>
              <Text className="mt-0.5 text-xs text-muted">
                {item.size} · {item.date}
              </Text>
            </View>

            <Text
              className={`text-xs font-bold ${
                item.status === 'Success'
                  ? 'text-green-600'
                  : item.status === 'Failed'
                    ? 'text-red-600'
                    : 'text-amber-600'
              }`}
            >
              {item.status}
            </Text>
          </Pressable>
        )}
      />
    </CustomScreen>
  );
};

export default Files;
