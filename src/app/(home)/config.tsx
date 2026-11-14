import { useState } from 'react';
import { Alert, Text, TextInput, View } from 'react-native';
import { getApiUrl, getDefaultApiUrl, setApiUrl } from '../../api/config';
import CustomButton from '../../component/button';
import CustomScreen from '../../component/screen';
import { useAppStore } from '../../store/useStore';
import { COLORS } from '../../theme/colors';

const clean = (value: string) => value.trim().replace(/\/+$/, '');

// http://host:port
const looksValid = (value: string) => /^https?:\/\/[^\s/]+/i.test(value);

const ConfigScreen = () => {
  const pickFile = useAppStore((state) => state.pickFile);

  const [url, setUrl] = useState(getApiUrl());
  const [busy, setBusy] = useState(false);

  // ping it
  const ping = async (value: string) => {
    try {
      const res = await fetch(`${value}/`, {
        signal: AbortSignal.timeout(8000),
      });
      return res.ok;
    } catch {
      return false;
    }
  };

  const test = async () => {
    const value = clean(url);

    if (!looksValid(value)) {
      Alert.alert('Check the address', 'Example: http://192.168.1.50:5000');
      return;
    }

    setBusy(true);
    const ok = await ping(value);
    setBusy(false);

    Alert.alert(
      ok ? 'Connected' : 'No answer',
      ok
        ? 'The server is reachable.'
        : 'Nothing replied. Check the IP, that the container is running, and that both devices are on the same Wi-Fi.',
    );
  };

  const save = async () => {
    const value = clean(url);

    if (!looksValid(value)) {
      Alert.alert('Check the address', 'Example: http://192.168.1.50:5000');
      return;
    }

    setBusy(true);
    const ok = await ping(value);
    await setApiUrl(value);
    setUrl(value);
    setBusy(false);

    if (!ok) {
      Alert.alert(
        'Saved, but no answer',
        'The address is stored but nothing replied. Uploads will fail until the server is reachable.',
      );
      return;
    }

    Alert.alert('Connected', 'Saved.');
  };

  return (
    <CustomScreen title="Config" onUpload={pickFile}>
      <View className="rounded-2xl border border-border bg-surface p-4">
        <Text className="font-semibold text-main">Server address</Text>
        <Text className="mb-3 mt-1 text-xs text-muted">
          The computer running the upload server, on your Wi-Fi.
        </Text>

        <TextInput
          value={url}
          onChangeText={setUrl}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          placeholder="http://192.168.1.50:5000"
          placeholderTextColor={COLORS.textMuted}
          className="rounded-xl border border-border px-3 py-2.5 text-main"
        />

        <View className="mt-3 flex-row gap-2">
          <CustomButton title="Save" onPress={save} />
          <CustomButton
            title={busy ? 'Checking...' : 'Test'}
            variant="outline"
            onPress={test}
          />
          <CustomButton
            title="Reset"
            variant="outline"
            onPress={() => setUrl(getDefaultApiUrl())}
          />
        </View>
      </View>

      <Text className="mt-3 text-xs text-muted">
        Running the backend in Docker: Use the device IP and the Host port,
        like http://192.168.1.50:HOST_PORT
      </Text>
    </CustomScreen>
  );
};

export default ConfigScreen;
