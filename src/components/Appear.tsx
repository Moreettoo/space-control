import { useEffect, useRef, type ReactNode } from 'react';
import { Animated, Platform, type ViewStyle } from 'react-native';
import { useReducedMotion } from '@/lib/useReducedMotion';

const USE_NATIVE_DRIVER = Platform.OS !== 'web';

interface AppearProps {
  children: ReactNode;
  /** Delay before the entrance starts, in ms (used to stagger sections). */
  delay?: number;
  distance?: number;
  style?: ViewStyle | ViewStyle[];
}

/** Fades and lifts its children into place on mount, honoring reduce-motion. */
export function Appear({ children, delay = 0, distance = 14, style }: AppearProps) {
  const reduced = useReducedMotion();
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduced) {
      progress.setValue(1);
      return;
    }
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: 520,
      delay,
      useNativeDriver: USE_NATIVE_DRIVER,
    });
    animation.start();
    return () => animation.stop();
  }, [reduced, delay, progress]);

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [distance, 0],
  });

  return (
    <Animated.View style={[style, { opacity: progress, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
}
