import { useMemo } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/lib/theme';

interface Star {
  left: number;
  top: number;
  size: number;
  opacity: number;
}

/** Deterministic pseudo-random starfield so it stays stable across renders. */
function makeStars(count: number, width: number, height: number): Star[] {
  let seed = 1987;
  const random = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  return Array.from({ length: count }, () => ({
    left: random() * width,
    top: random() * height * 0.7,
    size: random() < 0.82 ? 1.5 : 2.5,
    opacity: 0.12 + random() * 0.45,
  }));
}

/** Deep-space backdrop: vertical gradient, ambient telemetry glow, faint stars. */
export function Background() {
  const { width, height } = useWindowDimensions();
  const stars = useMemo(() => makeStars(52, width, height), [width, height]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient
        colors={['#0A1330', '#070B18', '#05070F']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={[colors.accentSoft, 'transparent']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.glow}
      />
      {stars.map((star, index) => (
        <View
          key={index}
          style={{
            position: 'absolute',
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            borderRadius: star.size / 2,
            backgroundColor: colors.star,
            opacity: star.opacity,
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  glow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 360,
  },
});
