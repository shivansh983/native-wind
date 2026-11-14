import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect } from 'react';
import { loadApiUrl } from '../api/config';
import { UploadNameModal } from '../component/nameModal';
import { useAppStore } from '../store/useStore';
import '../global.css';

const RootLayout = () => {
  const loadFiles = useAppStore((state) => state.loadFiles);

  // saved server, then the files table
  useEffect(() => {
    loadApiUrl().then(() => loadFiles());
  }, [loadFiles]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="reader"
          options={{ headerShown: true, title: 'File' }}
        />
      </Stack>

      <UploadNameModal />
    </GestureHandlerRootView>
  );
};

export default RootLayout;
