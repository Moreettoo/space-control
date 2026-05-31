import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, fontSize, radius, spacing, withAlpha } from '@/lib/theme';
import { formatTimestamp } from '@/lib/format';
import { Appear } from './Appear';

interface SuccessBannerProps {
  missionName: string;
  missionCode: string;
  savedAt: string;
  onDismiss: () => void;
}

/** Confirmation shown after a mission is persisted. Mounts when needed. */
export function SuccessBanner({ missionName, missionCode, savedAt, onDismiss }: SuccessBannerProps) {
  return (
    <Appear distance={10}>
      <View
        style={styles.card}
        accessibilityLiveRegion="polite"
        accessibilityRole="summary"
      >
        <View style={styles.badge}>
          <Text style={styles.check}>✓</Text>
        </View>
        <View style={styles.text}>
          <Text style={styles.title}>Missão registrada</Text>
          <Text style={styles.detail} numberOfLines={2}>
            {missionName} · {missionCode} — salvo em {formatTimestamp(savedAt)}
          </Text>
        </View>
        <Pressable
          onPress={onDismiss}
          accessibilityRole="button"
          accessibilityLabel="Dispensar confirmação"
          hitSlop={10}
          style={({ pressed }) => [styles.close, pressed && styles.closePressed]}
        >
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
      </View>
    </Appear>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: withAlpha(colors.success, 0.5),
    backgroundColor: colors.successSoft,
  },
  badge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: withAlpha(colors.success, 0.18),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: withAlpha(colors.success, 0.6),
  },
  check: {
    fontSize: fontSize.large,
    fontWeight: '700',
    color: colors.success,
  },
  text: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  title: {
    fontFamily: fonts.sans,
    fontSize: fontSize.body,
    fontWeight: '700',
    color: colors.text,
  },
  detail: {
    fontFamily: fonts.sans,
    fontSize: fontSize.small,
    color: colors.textMuted,
  },
  close: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closePressed: {
    backgroundColor: colors.surface,
  },
  closeText: {
    fontSize: fontSize.body,
    color: colors.textMuted,
  },
});
