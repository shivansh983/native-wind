import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../theme/colors';

// no native pdf view on web
const Reader = ({ path, image }: { path: string; image?: boolean }) => {
  return (
    <View style={styles.box}>
      <Text style={styles.text}>Open this file in the mobile app.</Text>
    </View>
  );
};

export default Reader;

const styles = StyleSheet.create({
  box: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  text: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
});
