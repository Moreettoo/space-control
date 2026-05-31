import { forwardRef, useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors, fonts, fontSize, radius, spacing } from '@/lib/theme';

export interface TextFieldProps extends Omit<TextInputProps, 'style'> {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string | null;
  helper?: string;
  /** Trailing unit shown inside the field, e.g. "km". */
  unit?: string;
  optional?: boolean;
  /** When set, shows a live "n/max" character counter. */
  counter?: number;
}

export const TextField = forwardRef<TextInput, TextFieldProps>(function TextField(
  { label, value, onChangeText, error, helper, unit, optional, counter, multiline, onFocus, onBlur, ...rest },
  ref,
) {
  const [focused, setFocused] = useState(false);
  const hasError = Boolean(error);
  const borderColor = hasError
    ? colors.dangerBorder
    : focused
      ? colors.accentBorder
      : colors.border;

  const handleFocus: NonNullable<TextInputProps['onFocus']> = (event) => {
    setFocused(true);
    onFocus?.(event);
  };
  const handleBlur: NonNullable<TextInputProps['onBlur']> = (event) => {
    setFocused(false);
    onBlur?.(event);
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.labelRow}>
        <View style={styles.labelLeft}>
          <Text style={styles.label}>{label}</Text>
          <Text style={[styles.tag, optional ? styles.tagOptional : styles.tagRequired]}>
            {optional ? 'Opcional' : 'Obrig.'}
          </Text>
        </View>
        {typeof counter === 'number' ? (
          <Text style={[styles.counter, value.length > counter && styles.counterOver]}>
            {value.length}/{counter}
          </Text>
        ) : null}
      </View>

      <View
        style={[
          styles.inputWrap,
          { borderColor },
          focused && !hasError && styles.focusGlow,
          multiline && styles.inputWrapMultiline,
        ]}
      >
        <TextInput
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          multiline={multiline}
          placeholderTextColor={colors.textFaint}
          selectionColor={colors.accent}
          cursorColor={colors.accent}
          accessibilityLabel={label}
          accessibilityHint={error ?? helper}
          style={[styles.input, multiline && styles.inputMultiline]}
          {...rest}
        />
        {unit ? <Text style={styles.unit}>{unit}</Text> : null}
      </View>

      <View style={styles.assist}>
        {hasError ? (
          <Text style={styles.error} accessibilityLiveRegion="polite" accessibilityRole="alert">
            {error}
          </Text>
        ) : helper ? (
          <Text style={styles.helper}>{helper}</Text>
        ) : null}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  labelLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexShrink: 1,
    minWidth: 0,
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
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  tagRequired: {
    color: colors.accent,
    backgroundColor: colors.accentSoft,
  },
  tagOptional: {
    color: colors.textFaint,
    backgroundColor: colors.surfaceElevated,
  },
  counter: {
    fontFamily: fonts.mono,
    fontSize: fontSize.micro,
    color: colors.textFaint,
    fontVariant: ['tabular-nums'],
  },
  counterOver: {
    color: colors.danger,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceInput,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    minHeight: 54,
  },
  inputWrapMultiline: {
    alignItems: 'flex-start',
    paddingVertical: spacing.md,
    minHeight: 96,
  },
  focusGlow: {
    shadowColor: colors.accent,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  input: {
    flex: 1,
    fontFamily: fonts.sans,
    fontSize: fontSize.large,
    color: colors.text,
    paddingVertical: spacing.md,
  },
  inputMultiline: {
    minHeight: 72,
    textAlignVertical: 'top',
    lineHeight: 22,
  },
  unit: {
    fontFamily: fonts.mono,
    fontSize: fontSize.small,
    color: colors.textMuted,
    marginLeft: spacing.sm,
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
  helper: {
    fontFamily: fonts.sans,
    fontSize: fontSize.small,
    color: colors.textFaint,
  },
});
