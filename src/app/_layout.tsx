import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect } from 'react';
import { loadApiUrl } from '../api/config';
import '../global.css';

const RootLayout = () => {
  // load saved server
  useEffect(() => {
    loadApiUrl();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="reader"
          options={{ headerShown: true, title: 'File' }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
};

export default RootLayout;