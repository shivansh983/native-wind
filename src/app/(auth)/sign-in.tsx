import { useAuth, useSignIn } from '@clerk/expo'
import { Link } from 'expo-router'
import { useState } from 'react'
import { Button, StyleSheet, Text, TextInput, View } from 'react-native'

export default function SignInScreen() {
  const { isLoaded, isSignedIn } = useAuth()
  const { signIn } = useSignIn()

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)

  const handleSignIn = async () => {
    const { error } = await signIn.password({ identifier: emailAddress, password })
    if (error) {
      // Handle the error in your app.
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      return
    }

    // A second factor is required (e.g. new device / client trust), so send an email code
    if (signIn.status === 'needs_second_factor' || signIn.status === 'needs_client_trust') {
      const { error: sendError } = await signIn.mfa.sendEmailCode()
      if (sendError) {
        // Handle the error in your app.
        return
      }
      setIsVerifying(true)
      return
    }

    const { error: finalizeError } = await signIn.finalize()
    if (finalizeError) {
      // Handle the error in your app.
    }
  }

  const handleVerify = async () => {
    const { error } = await signIn.mfa.verifyEmailCode({ code })
    if (error) {
      // Handle the error in your app.
      return
    }

    const { error: finalizeError } = await signIn.finalize()
    if (finalizeError) {
      // Handle the error in your app.
    }
  }

  if (!isLoaded) {
    return null
  }

  if (isSignedIn) {
    return (
      <View style={styles.container}>
        <Text>You're signed in</Text>
      </View>
    )
  }

  if (isVerifying) {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          value={code}
          placeholder="Enter your verification code"
          onChangeText={setCode}
          keyboardType="numeric"
        />
        <Button title="Verify" onPress={handleVerify} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        onChangeText={setEmailAddress}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        value={password}
        placeholder="Enter password"
        secureTextEntry={true}
        onChangeText={setPassword}
      />
      <Button title="Sign in" onPress={handleSignIn} />
      <Link href="./sign-up">
        <Text>Don't have an account? Sign up</Text>
      </Link>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 12,
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
})
