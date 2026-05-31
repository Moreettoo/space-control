import { useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, fontSize, radius, spacing } from '@/lib/theme';
import { formatTimestamp } from '@/lib/format';
import { useReducedMotion } from '@/lib/useReducedMotion';

const USE_NATIVE_DRIVER = Platform.OS !== 'web';

function PulseDot() {
  const reduced = useReducedMotion();
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (reduced) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.3, duration: 900, useNativeDriver: USE_NATIVE_DRIVER }),
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: USE_NATIVE_DRIVER }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [reduced, pulse]);

  return <Animated.View style={[styles.dot, { opacity: pulse }]} />;
}

interface HeaderProps {
  editing: boolean;
  savedAt: string | null;
}

export function Header({ editing, savedAt }: HeaderProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.topRow}>
        <View style={styles.badge}>
          <View style={styles.badgeRing} />
          <Text style={styles.badgeText}>STATION&nbsp;07</Text>
        </View>
        <View style={styles.chip}>
          <PulseDot />
          <Text style={styles.chipText}>Sinal estável</Text>
        </View>
      </View>

      <Text style={styles.kicker}>Central de Monitoramento</Text>
      <Text style={styles.title}>{editing ? 'Atualização de Missão' : 'Registro de Missão'}</Text>
      <Text style={styles.subtitle}>
        Defina os parâmetros operacionais da missão. Os campos marcados como obrigatórios precisam ser
        preenchidos antes do envio.
      </Text>

      {editing && savedAt ? (
        <View style={styles.editingRow}>
          <View style={styles.editingDot} />
          <Text style={styles.editingText}>Editando registro salvo em {formatTimestamp(savedAt)}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  badgeRing: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  badgeText: {
    fontFamily: fonts.mono,
    fontSize: fontSize.micro,
    letterSpacing: 2,
    color: colors.textMuted,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.success,
  },
  chipText: {
    fontFamily: fonts.mono,
    fontSize: fontSize.micro,
    letterSpacing: 0.6,
    color: colors.textMuted,
  },
  kicker: {
    fontFamily: fonts.mono,
    fontSize: fontSize.micro,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: colors.accent,
  },
  title: {
    fontFamily: fonts.sans,
    fontSize: fontSize.display,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: fonts.sans,
    fontSize: fontSize.body,
    lineHeight: 22,
    color: colors.textMuted,
    maxWidth: 520,
  },
  editingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.accentBorder,
    backgroundColor: colors.accentSoft,
    alignSelf: 'flex-start',
  },
  editingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
  },
  editingText: {
    fontFamily: fonts.mono,
    fontSize: fontSize.micro,
    letterSpacing: 0.4,
    color: colors.text,
  },
});
