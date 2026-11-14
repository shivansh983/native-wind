import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import CustomButton from '../component/button';
import Reader from '../component/reader';
import { canRender, isImage, isOffice } from '../store/useStore';
import { COLORS } from '../theme/colors';
import { convertToPdf } from '../viewer/convert';
import {
  type IncomingFile,
  openElsewhere,
  resolveIncomingFile,
} from '../viewer/incoming';

// where a file lands when someone picks Canny Viewer from the Open with
// chooser. it belongs to another app, so it never touches the files table.
const ViewScreen = () => {
  const { uri } = useLocalSearchParams<{ uri: string }>();

  const [file, setFile] = useState<IncomingFile | null>(null);
  const [path, setPath] = useState<string | null>(null);
  const [status, setStatus] = useState('Opening...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!uri) {
        setError('No file was passed in');
        return;
      }

      try {
        const incoming = await resolveIncomingFile(uri);
        if (cancelled) return;
        setFile(incoming);

        // pdf and images draw from the copy
        if (!isOffice(incoming)) {
          if (canRender(incoming)) setPath(incoming.uri);
          return;
        }

        setStatus('Converting on the server...');
        const pdf = await convertToPdf(incoming);
        if (cancelled) return;
        setPath(pdf);
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : 'Could not open this file',
        );
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [uri]);

  const header = <Stack.Screen options={{ title: file?.name ?? 'File' }} />;

  if (error) {
    return (
      <View style={styles.center}>
        {header}
        <Text style={styles.text}>{error}</Text>
      </View>
    );
  }

  // cannot draw it, so hand it back to the chooser
  if (file && !canRender(file)) {
    return (
      <View style={styles.center}>
        {header}
        <Text style={styles.heading}>Cannot preview this file</Text>
        <Text style={styles.text}>
          Canny Viewer reads PDFs, images, Word, Excel and PowerPoint.
        </Text>
        <View style={styles.action}>
          <CustomButton
            title="Open with another app"
            onPress={() =>
              openElsewhere(file).catch((err) =>
                Alert.alert(
                  'Could not open',
                  err instanceof Error ? err.message : 'Something went wrong',
                ),
              )
            }
          />
        </View>
      </View>
    );
  }

  if (!path) {
    return (
      <View style={styles.center}>
        {header}
        <ActivityIndicator color={COLORS.primary} />
        <Text style={styles.status}>{status}</Text>
      </View>
    );
  }

  return (
    <>
      {header}
      <Reader path={path} image={file ? isImage(file) : false} />
    </>
  );
};

export default ViewScreen;

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    backgroundColor: COLORS.background,
  },
  heading: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textMain,
    marginBottom: 6,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    color: COLORS.textMuted,
  },
  status: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 10,
  },
  action: {
    marginTop: 20,
    alignSelf: 'stretch',
  },
});
