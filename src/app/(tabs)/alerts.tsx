import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Background } from '@/components/Background';
import { useAlerts } from '@/context/AlertsContext';
import { formatTimestamp } from '@/lib/format';
import { colors, fonts, fontSize, radius, spacing, withAlpha } from '@/lib/theme';
import type { MissionAlert } from '@/lib/types';

// ─── Helpers de severidade ────────────────────────────────────────────────────

const SEV_COLOR = {
  CRITICAL: colors.danger,
  WARNING: colors.warning,
  INFO: colors.accent,
} as const;

const SEV_LABEL = {
  CRITICAL: 'CRÍTICO',
  WARNING: 'AVISO',
  INFO: 'INFO',
} as const;

const SEV_ICON = {
  CRITICAL: '🔴',
  WARNING: '🟡',
  INFO: '🔵',
} as const;

// ─── Card de alerta ───────────────────────────────────────────────────────────

function AlertCard({
  alert,
  onRead,
}: {
  alert: MissionAlert;
  onRead: () => void;
}) {
  const color = SEV_COLOR[alert.severity];

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        alert.read && styles.cardRead,
        pressed && { opacity: 0.82 },
        { borderLeftColor: color },
      ]}
      onPress={() => {
        if (!alert.read) onRead();
        router.push(`/mission/${alert.missionId}`);
      }}
      accessibilityRole="button"
      accessibilityLabel={`Alerta ${SEV_LABEL[alert.severity]}: ${alert.message}`}
    >
      {/* Linha superior: ícone + badge de severidade + código */}
      <View style={styles.cardTop}>
        <Text style={styles.sevIcon}>{SEV_ICON[alert.severity]}</Text>
        <View
          style={[
            styles.sevBadge,
            {
              backgroundColor: withAlpha(color, 0.14),
              borderColor: withAlpha(color, 0.4),
            },
          ]}
        >
          <Text style={[styles.sevText, { color }]}>{SEV_LABEL[alert.severity]}</Text>
        </View>
        <Text style={styles.missionCode}>{alert.missionCode}</Text>
        {!alert.read && <View style={[styles.unreadDot, { backgroundColor: color }]} />}
      </View>

      {/* Mensagem */}
      <Text style={[styles.message, alert.read && styles.messageRead]}>
        {alert.message}
      </Text>

      {/* Rodapé: missão + timestamp */}
      <View style={styles.cardFooter}>
        <Text style={styles.missionName} numberOfLines={1}>
          {alert.missionName}
        </Text>
        <Text style={styles.timestamp}>{formatTimestamp(alert.createdAt)}</Text>
      </View>
    </Pressable>
  );
}

// ─── Estado vazio ─────────────────────────────────────────────────────────────

function EmptyAlerts() {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyIcon}>✅</Text>
      <Text style={styles.emptyTitle}>Sem alertas ativos</Text>
      <Text style={styles.emptySub}>
        Todas as missões estão operando dentro dos parâmetros normais.
      </Text>
    </View>
  );
}

// ─── Tela principal ───────────────────────────────────────────────────────────

export default function AlertsScreen() {
  const insets = useSafeAreaInsets();
  const { alerts, unreadCount, markAsRead, markAllAsRead } = useAlerts();

  return (
    <View style={styles.root}>
      <Background />
      <SafeAreaView style={styles.safe} edges={['top']}>
        {/* Cabeçalho */}
        <View style={styles.screenHeader}>
          <View style={styles.titleBlock}>
            <Text style={styles.kicker}>SISTEMA DE MONITORAMENTO</Text>
            <View style={styles.titleRow}>
              <Text style={styles.screenTitle}>Alertas</Text>
              {unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
                </View>
              )}
            </View>
          </View>

          {unreadCount > 0 && (
            <Pressable
              style={({ pressed }) => [styles.markAllBtn, pressed && { opacity: 0.7 }]}
              onPress={markAllAsRead}
              accessibilityRole="button"
            >
              <Text style={styles.markAllText}>Ler todos</Text>
            </Pressable>
          )}
        </View>

        {alerts.length === 0 ? (
          <EmptyAlerts />
        ) : (
          <FlatList
            data={alerts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <AlertCard alert={item} onRead={() => markAsRead(item.id)} />
            )}
            contentContainerStyle={[
              styles.list,
              { paddingBottom: insets.bottom + spacing.xxxl },
            ]}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.void },
  safe: { flex: 1 },

  // Cabeçalho
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  titleBlock: { gap: spacing.xs },
  kicker: {
    fontFamily: fonts.mono,
    fontSize: fontSize.micro,
    color: colors.accent,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  screenTitle: {
    fontFamily: fonts.sans,
    fontSize: fontSize.display,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.5,
  },
  unreadBadge: {
    backgroundColor: withAlpha(colors.danger, 0.18),
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: withAlpha(colors.danger, 0.4),
  },
  unreadBadgeText: {
    fontFamily: fonts.mono,
    fontSize: fontSize.small,
    color: colors.danger,
  },
  markAllBtn: {
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  markAllText: {
    fontFamily: fonts.mono,
    fontSize: fontSize.small,
    color: colors.textMuted,
  },

  // Lista
  list: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  separator: { height: spacing.md },

  // Card
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    borderLeftWidth: 3,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  cardRead: {
    opacity: 0.55,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sevIcon: { fontSize: 16 },
  sevBadge: {
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  sevText: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 0.8,
    fontWeight: '700',
  },
  missionCode: {
    fontFamily: fonts.mono,
    fontSize: fontSize.micro,
    color: colors.accent,
    flex: 1,
    letterSpacing: 1,
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },

  message: {
    fontFamily: fonts.sans,
    fontSize: fontSize.body,
    color: colors.text,
    lineHeight: 21,
  },
  messageRead: {
    color: colors.textMuted,
  },

  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  missionName: {
    fontFamily: fonts.sans,
    fontSize: fontSize.small,
    color: colors.textMuted,
    flex: 1,
  },
  timestamp: {
    fontFamily: fonts.mono,
    fontSize: fontSize.micro,
    color: colors.textFaint,
  },

  // Estado vazio
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xxxl,
    gap: spacing.md,
  },
  emptyIcon: { fontSize: 48, marginBottom: spacing.sm },
  emptyTitle: {
    fontFamily: fonts.sans,
    fontSize: fontSize.large,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  emptySub: {
    fontFamily: fonts.sans,
    fontSize: fontSize.body,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
});
