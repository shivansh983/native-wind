import * as SecureStore from 'expo-secure-store';

const KEY = 'api-url';

// fallback
const DEFAULT_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://192.168.29.153:5000';

let current = DEFAULT_URL;
let isSet = false;

const clean = (url: string) => url.trim().replace(/\/+$/, '');

export const getApiUrl = () => current;

export const hasApiUrl = () => isSet;

export const getDefaultApiUrl = () => DEFAULT_URL;

// run on app start
export const loadApiUrl = async () => {
  try {
    const saved = await SecureStore.getItemAsync(KEY);
    if (saved) {
      current = saved;
      isSet = true;
    }
  } catch {
  }
  return current;
};

export const setApiUrl = async (url: string) => {
  current = clean(url);
  isSet = true;
  try {
    await SecureStore.setItemAsync(KEY, current);
  } catch {
    // not saved, fine for now
  }
  return current;
};
