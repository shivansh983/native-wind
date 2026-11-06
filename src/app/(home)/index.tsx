import { useAuth, useUser } from '@clerk/expo';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const DashScreen = () => {
  const { user } = useUser();
  // `getToken` and `signOut` exist on every branch of useAuth()'s union,
  // so they are safe to destructure without narrowing first.
  const { getToken, signOut, userId, sessionId } = useAuth();

  const [token, setToken] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const loadToken = async () => {
    // Session tokens are short-lived (~60s). Clerk refreshes them for you;
    // always call getToken() right before a request rather than caching it.
    const next = await getToken();
    setToken(next);
  };

  useEffect(() => {
    let cancelled = false;
    getToken().then((t) => {
      if (!cancelled) setToken(t);
    });
    return () => {
      cancelled = true;
    };
    // Run once on mount; getToken is not referentially stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onShare = async () => {
    try {
      await Share.share({
        message: 'React Native | A framework for building native apps using React',
      });
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.identity}>
        {user?.imageUrl ? <Image source={{ uri: user.imageUrl }} style={styles.avatar} /> : null}
        <View style={styles.identityText}>
          <Text style={styles.name}>{user?.fullName ?? user?.firstName ?? 'Signed in'}</Text>
          <Text style={styles.email}>{user?.primaryEmailAddress?.emailAddress ?? '—'}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Session</Text>
        <Field label="User ID" value={userId ?? '—'} />
        <Field label="Session ID" value={sessionId ?? '—'} />
        <Field
          label="Signed up"
          value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Session token (JWT)</Text>
        <Text style={styles.cardHint}>
          Send this to a backend in the Authorization header as a Bearer token. It expires in
          about a minute.
        </Text>
        <Text style={styles.token} numberOfLines={revealed ? undefined : 2}>
          {token ?? 'No token'}
        </Text>
        <View style={styles.row}>
          <Pressable style={styles.secondary} onPress={() => setRevealed((r) => !r)}>
            <Text style={styles.secondaryText}>{revealed ? 'Hide' : 'Reveal'}</Text>
          </Pressable>
          <Pressable style={styles.secondary} onPress={loadToken}>
            <Text style={styles.secondaryText}>Refresh</Text>
          </Pressable>
        </View>
      </View>

      <Pressable style={styles.secondary} onPress={onShare}>
        <Text style={styles.secondaryText}>Share</Text>
      </Pressable>

      <Pressable style={styles.danger} onPress={() => signOut()}>
        <Text style={styles.dangerText}>Sign out</Text>
      </Pressable>
    </ScrollView>
  );
};

const Field = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.field}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <Text style={styles.fieldValue} selectable>
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#e4e4e7',
  },
  identityText: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
  },
  email: {
    color: '#666',
    marginTop: 2,
  },
  card: {
    borderWidth: 1,
    borderColor: '#e4e4e7',
    borderRadius: 12,
    padding: 16,
    gap: 10,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  cardHint: {
    color: '#666',
    fontSize: 13,
    lineHeight: 18,
  },
  field: {
    gap: 2,
  },
  fieldLabel: {
    fontSize: 12,
    color: '#888',
    textTransform: 'uppercase',
  },
  fieldValue: {
    fontSize: 14,
    fontFamily: 'monospace',
  },
  token: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: '#333',
    backgroundColor: '#f4f4f5',
    borderRadius: 8,
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  secondary: {
    borderWidth: 1,
    borderColor: '#208AEF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  secondaryText: {
    color: '#208AEF',
    fontWeight: '600',
  },
  danger: {
    backgroundColor: '#c0392b',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  dangerText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default DashScreen;
