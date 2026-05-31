import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, fontSize, radius, spacing } from '@/lib/theme';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  loadingLabel?: string;
}

/** Telemetry-cyan call to action. Stays enabled until a request is in flight. */
export function PrimaryButton({ label, onPress, loading = false, loadingLabel }: PrimaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      accessibilityRole="button"
      accessibilityState={{ busy: loading, disabled: loading }}
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
    >
      <LinearGradient
        colors={[colors.accent, colors.accentDeep]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {loading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={colors.accentInk} size="small" />
            {loadingLabel ? <Text style={styles.label}>{loadingLabel}</Text> : null}
          </View>
        ) : (
          <Text style={styles.label}>{label}</Text>
        )}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    borderRadius: radius.lg,
    shadowColor: colors.accent,
    shadowOpacity: 0.3,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
  gradient: {
    minHeight: 56,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  label: {
    fontFamily: fonts.sans,
    fontSize: fontSize.large,
    fontWeight: '700',
    letterSpacing: 0.3,
    color: colors.accentInk,
  },
});
