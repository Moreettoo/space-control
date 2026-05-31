import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, fontSize, radius, spacing, withAlpha } from '@/lib/theme';
import type { Option } from '@/lib/options';

interface SegmentedFieldProps<T extends string> {
  label: string;
  options: Option<T>[];
  value: T | null;
  onChange: (value: T) => void;
  error?: string | null;
}

/** A wrap of selectable pills behaving as a single-choice radio group. */
export function SegmentedField<T extends string>({
  label,
  options,
  value,
  onChange,
  error,
}: SegmentedFieldProps<T>) {
  const hasError = Boolean(error);

  return (
    <View style={styles.wrap}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.tag}>Obrig.</Text>
      </View>

      <View style={styles.options} accessibilityRole="radiogroup" accessibilityLabel={label}>
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <Pressable
              key={option.value}
              onPress={() => onChange(option.value)}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityLabel={option.label}
              hitSlop={6}
              style={({ pressed }) => [
                styles.pill,
                selected && { borderColor: option.tone, backgroundColor: withAlpha(option.tone, 0.14) },
                hasError && !value && styles.pillError,
                pressed && styles.pillPressed,
              ]}
            >
              <View
                style={[styles.dot, { backgroundColor: selected ? option.tone : colors.textFaint }]}
              />
              <Text style={[styles.pillText, selected && styles.pillTextSelected]}>{option.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.assist}>
        {hasError ? (
          <Text style={styles.error} accessibilityLiveRegion="polite" accessibilityRole="alert">
            {error}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.md,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  label: {
    fontFamily: fonts.mono,
    fontSize: fontSize.micro,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: colors.textMuted,
  },
  tag: {
    fontFamily: fonts.mono,
    fontSize: 9,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.accent,
    backgroundColor: colors.accentSoft,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 44,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceInput,
  },
  pillPressed: {
    opacity: 0.7,
  },
  pillError: {
    borderColor: colors.dangerBorder,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  pillText: {
    fontFamily: fonts.sans,
    fontSize: fontSize.body,
    color: colors.textMuted,
  },
  pillTextSelected: {
    color: colors.text,
    fontWeight: '600',
  },
  assist: {
    minHeight: 16,
    justifyContent: 'center',
  },
  error: {
    fontFamily: fonts.sans,
    fontSize: fontSize.small,
    color: colors.danger,
  },
});
