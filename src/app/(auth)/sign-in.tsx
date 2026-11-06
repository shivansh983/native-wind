import { useSignIn } from '@clerk/expo'
import { Link } from 'expo-router'
import { useState } from 'react'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'

export default function SignInScreen() {

  const { signIn, fetchStatus } = useSignIn()

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const isBusy = fetchStatus === 'fetching'

  const handleSignIn = async () => {
    setErrorMessage('')

    const { error } = await signIn.password({ identifier: emailAddress, password })
    if (error) {
      setErrorMessage(error.longMessage ?? error.message)
      return
    }

    const { error: finalizeError } = await signIn.finalize()
    if (finalizeError) {
      setErrorMessage(finalizeError.longMessage ?? finalizeError.message)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign in</Text>

      <TextInput
        style={styles.input}
        autoCapitalize="none"
        autoComplete="email"
        value={emailAddress}
        placeholder="Email"
        onChangeText={setEmailAddress}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        value={password}
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
      />

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      <Pressable
        style={[styles.button, isBusy && styles.buttonDisabled]}
        onPress={handleSignIn}
        disabled={isBusy}>
        <Text style={styles.buttonText}>{isBusy ? 'Signing in…' : 'Sign in'}</Text>
      </Pressable>

      <Link href="./sign-up" style={styles.link}>
        <Text style={styles.linkText}>No account? Sign up</Text>
      </Link>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#208AEF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    marginTop: 12,
    alignSelf: 'center',
  },
  linkText: {
    color: '#208AEF',
    fontSize: 15,
  },
  error: {
    color: '#c0392b',
  },
})
