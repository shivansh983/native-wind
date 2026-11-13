import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { loadApiUrl } from '../api/config';
import '../global.css';

const RootLayout = () => {
  // restore the saved server address
  useEffect(() => {
    loadApiUrl();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="server"
        options={{ presentation: 'modal', headerShown: true, title: 'Server' }}
      />
    </Stack>
  );
};

export default RootLayout;