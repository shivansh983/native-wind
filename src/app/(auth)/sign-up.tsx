import { useSignUp } from '@clerk/expo'
import { Link } from 'expo-router'
import { useState } from 'react'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'

export default function SignUpScreen() {
  const { signUp, fetchStatus } = useSignUp()

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const isBusy = fetchStatus === 'fetching'

  const handleSignUp = async () => {
    setErrorMessage('')

    const { error } = await signUp.password({ emailAddress, password })
    if (error) {
      setErrorMessage(error.longMessage ?? error.message)
      return
    }

    const { error: sendError } = await signUp.verifications.sendEmailCode()
    if (sendError) {
      setErrorMessage(sendError.longMessage ?? sendError.message)
      return
    }

    setIsVerifying(true)
  }

  const handleVerify = async () => {
    setErrorMessage('')

    const { error } = await signUp.verifications.verifyEmailCode({ code })
    if (error) {
      setErrorMessage(error.longMessage ?? error.message)
      return
    }

    const { error: finalizeError } = await signUp.finalize()
    if (finalizeError) {
      setErrorMessage(finalizeError.longMessage ?? finalizeError.message)
    }
  }

  if (isVerifying) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Check your email</Text>
        <Text style={styles.hint}>We sent a code to {emailAddress}.</Text>

        <TextInput
          style={styles.input}
          value={code}
          placeholder="Verification code"
          onChangeText={setCode}
          keyboardType="number-pad"
        />

        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

        <Pressable
          style={[styles.button, isBusy && styles.buttonDisabled]}
          onPress={handleVerify}
          disabled={isBusy}>
          <Text style={styles.buttonText}>{isBusy ? 'Verifying…' : 'Verify'}</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create account</Text>

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
        onPress={handleSignUp}
        disabled={isBusy}>
        <Text style={styles.buttonText}>{isBusy ? 'Creating…' : 'Sign up'}</Text>
      </Pressable>

      <Link href="./sign-in" style={styles.link}>
        <Text style={styles.linkText}>Already have an account? Sign in</Text>
      </Link>

      {/* Required for sign-up on Expo web if your app uses legacy bot protection.
      Clerk skips the browser CAPTCHA on iOS and Android.
      See https://clerk.com/docs/guides/secure/legacy-bot-protection */}
      <View nativeID="clerk-captcha" />
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
  hint: {
    color: '#666',
    marginBottom: 4,
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
