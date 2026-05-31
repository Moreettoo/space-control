import type { ReactNode } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, fontSize, radius, spacing } from '@/lib/theme';

interface FormSectionProps {
  index: string;
  title: string;
  caption?: string;
  children: ReactNode;
}

/** A glass panel grouping related fields under a numbered, tracked header. */
export function FormSection({ index, title, caption, children }: FormSectionProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.index}>{index}</Text>
        <View style={styles.divider} />
        <View style={styles.headerText}>
          <Text style={styles.title}>{title}</Text>
          {caption ? <Text style={styles.caption}>{caption}</Text> : null}
        </View>
      </View>
      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: spacing.xl,
    gap: spacing.xl,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.35,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 12 },
      },
      android: { elevation: 6 },
      default: {},
    }),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  index: {
    fontFamily: fonts.mono,
    fontSize: fontSize.body,
    fontWeight: '600',
    color: colors.accent,
    letterSpacing: 1,
  },
  divider: {
    width: 22,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.borderStrong,
  },
  headerText: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  title: {
    fontFamily: fonts.mono,
    fontSize: fontSize.small,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.text,
  },
  caption: {
    fontFamily: fonts.sans,
    fontSize: fontSize.small,
    color: colors.textFaint,
  },
  body: {
    gap: spacing.xl,
  },
});
