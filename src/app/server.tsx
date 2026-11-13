import { useState } from 'react';
import { Alert, Text, TextInput, View } from 'react-native';
import { getApiUrl, getDefaultApiUrl, setApiUrl } from '../api/config';
import CustomButton from '../component/button';
import { COLORS } from '../theme/colors';

const ServerScreen = () => {
  const [url, setUrl] = useState(getApiUrl());
  const [busy, setBusy] = useState(false);

  const save = async () => {
    const saved = await setApiUrl(url);
    setUrl(saved);
    Alert.alert('Saved', `Now using ${saved}`);
  };

  // ping the server root
  const test = async () => {
    setBusy(true);
    try {
      const res = await fetch(`${url.trim().replace(/\/+$/, '')}/`, {
        signal: AbortSignal.timeout(8000),
      });
      Alert.alert('Connected', `Server replied ${res.status}`);
    } catch {
      Alert.alert('No connection', 'Could not reach that address.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <View className="flex-1 bg-background p-4">
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
        Find it with ipconfig on Windows, or ip addr on Mac and Linux. The phone
        must be on the same Wi-Fi.
      </Text>
    </View>
  );
};

export default ServerScreen;
