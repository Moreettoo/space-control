import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, fonts, fontSize, radius, spacing } from '@/lib/theme';

interface GhostButtonProps {
  label: string;
  onPress: () => void;
}

/** Low-emphasis secondary action (outline / transparent fill). */
export function GhostButton({ label, onPress }: GhostButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderStrong,
    backgroundColor: 'transparent',
  },
  pressed: {
    backgroundColor: colors.surface,
    opacity: 0.9,
  },
  label: {
    fontFamily: fonts.sans,
    fontSize: fontSize.body,
    fontWeight: '600',
    color: colors.textMuted,
  },
});
