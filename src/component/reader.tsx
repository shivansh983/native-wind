import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Pdf from 'react-native-pdf';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { COLORS } from '../theme/colors';

// pinch to zoom, drag to move, double tap to reset
const ZoomImage = ({ path }: { path: string }) => {
  const scale = useSharedValue(1);
  const lastScale = useSharedValue(1);
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const lastX = useSharedValue(0);
  const lastY = useSharedValue(0);

  const pinch = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = Math.min(Math.max(lastScale.value * e.scale, 1), 6);
    })
    .onEnd(() => {
      lastScale.value = scale.value;
    });

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      x.value = lastX.value + e.translationX;
      y.value = lastY.value + e.translationY;
    })
    .onEnd(() => {
      lastX.value = x.value;
      lastY.value = y.value;
    });

  const reset = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      scale.value = withTiming(1);
      x.value = withTiming(0);
      y.value = withTiming(0);
      lastScale.value = 1;
      lastX.value = 0;
      lastY.value = 0;
    });

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value },
      { translateY: y.value },
      { scale: scale.value },
    ],
  }));

  return (
    <GestureDetector gesture={Gesture.Race(reset, Gesture.Simultaneous(pinch, pan))}>
      <Animated.View style={[styles.fill, style]}>
        <Image source={{ uri: path }} style={styles.fill} contentFit="contain" />
      </Animated.View>
    </GestureDetector>
  );
};

// shows a local pdf or image
const Reader = ({ path, image }: { path: string; image?: boolean }) => {
  return (
    <View style={styles.box}>
      {image ? (
        <ZoomImage path={path} />
      ) : (
        <Pdf source={{ uri: path }} style={styles.fill} maxScale={6} />
      )}
    </View>
  );
};

export default Reader;

const styles = StyleSheet.create({
  box: {
    flex: 1,
    backgroundColor: COLORS.background,
    overflow: 'hidden',
  },
  fill: {
    flex: 1,
    width: '100%',
  },
});
