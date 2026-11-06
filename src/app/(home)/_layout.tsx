import { useAuth } from '@clerk/expo'
import { Redirect, Stack } from 'expo-router'

export default function Layout() {
  const { isSignedIn, isLoaded } = useAuth({ treatPendingAsSignedOut: false })

  if (!isLoaded) {
    return null
  }

  if (!isSignedIn) {
    return <Redirect href="/sign-in" />
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
    </Stack>
  )
}
