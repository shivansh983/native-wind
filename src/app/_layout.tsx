import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { loadApiUrl } from '../api/config';
import '../global.css';

const RootLayout = () => {
  // load saved server
  useEffect(() => {
    loadApiUrl();
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
};

export default RootLayout;