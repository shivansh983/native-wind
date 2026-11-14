import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';

// our own deep links land here too. only a file uri came from the chooser.
const isFileUri = (url: string) =>
  url.startsWith('content://') || url.startsWith('file://');

export const useIncomingFile = () => {
  const router = useRouter();
  const url = Linking.useURL();

  // singleTask replays the url, so guard against a double push
  const handled = useRef<string | null>(null);

  useEffect(() => {
    if (!url || !isFileUri(url) || handled.current === url) return;

    handled.current = url;
    router.push({ pathname: '/view', params: { uri: url } });
  }, [url, router]);
};
