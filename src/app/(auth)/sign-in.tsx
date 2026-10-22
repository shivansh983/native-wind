import { AuthView } from '@clerk/expo/native-components'
import { useAuth, useUser } from '@clerk/expo'
import { useState } from 'react'
import { Button, Modal, StyleSheet, Text, View } from 'react-native'

export default function AuthButton() {
  const { isSignedIn } = useAuth({ treatPendingAsSignedOut: false })
  const { user } = useUser()
  const [isAuthOpen, setIsAuthOpen] = useState(false)

  return (
    <View style={styles.container}>
      {isSignedIn ? (
        <Text>User ID: {user?.id}</Text>
      ) : (
        <Button title="Sign in" onPress={() => setIsAuthOpen(true)} />
      )}
      <Modal
        animationType="slide"
        visible={isAuthOpen}
        presentationStyle="pageSheet"
        onRequestClose={() => setIsAuthOpen(false)}
      >
        <AuthView onDismiss={() => setIsAuthOpen(false)} />
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})