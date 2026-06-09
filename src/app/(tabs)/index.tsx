import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Background } from '@/components/Background';
import { useAlerts } from '@/context/AlertsContext';
import { useMissions } from '@/context/MissionsContext';
import { formatTimestamp } from '@/lib/format';
import { PRIORITY_OPTIONS, STATUS_OPTIONS, statusMeta } from '@/lib/options';
import { colors, fonts, fontSize, radius, spacing, withAlpha } from '@/lib/theme';
import type { StoredMission } from '@/lib/types';

// ─── Componentes internos ─────────────────────────────────────────────────────

function StatCard({
  value,
  label,
  color = colors.text,
}: {
  value: number;
  label: string;
  color?: string;
}) {
  return (
    <View style={[styles.statCard, { borderColor: withAlpha(color, 0.25) }]}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function StatusBar({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? count / total : 0;
  return (
    <View style={styles.statusBarRow}>
      <Text style={styles.statusBarLabel}>{label}</Text>
      <View style={styles.statusBarTrack}>
        <View
          style={[
            styles.statusBarFill,
            { width: `${pct * 100}%`, backgroundColor: color },
          ]}
        />
      </View>
      <Text style={[styles.statusBarCount, { color }]}>{count}</Text>
    </View>
  );
}

function MiniCard({ mission }: { mission: StoredMission }) {
  const status = statusMeta(mission.status);
  return (
    <Pressable
      style={({ pressed }) => [styles.miniCard, pressed && { opacity: 0.75 }]}
      onPress={() => router.push(`/mission/${mission.id}`)}
    >
      <View style={styles.miniCardTop}>
        <Text style={styles.miniCardName} numberOfLines={1}>
          {mission.name}
        </Text>
        <Text style={styles.miniCardCode}>{mission.code}</Text>
      </View>
      {status && (
        <View
          style={[
            styles.miniBadge,
            {
              backgroundColor: withAlpha(status.tone, 0.14),
              borderColor: withAlpha(status.tone, 0.38),
            },
          ]}
        >
          <Text style={[styles.miniBadgeText, { color: status.tone }]}>
            {status.label}
          </Text>
        </View>
      )}
      <Text style={styles.miniTimestamp}>{formatTimestamp(mission.savedAt)}</Text>
    </Pressable>
  );
}

// ─── Tela ─────────────────────────────────────────────────────────────────────

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const { missions, loading } = useMissions();
  const { unreadCount } = useAlerts();

  const total = missions.length;

  const byStatus = {
    PLANEJADA: missions.filter((m) => m.status === 'PLANEJADA').length,
    EM_ORBITA: missions.filter((m) => m.status === 'EM_ORBITA').length,
    CRITICA: missions.filter((m) => m.status === 'CRITICA').length,
    CONCLUIDA: missions.filter((m) => m.status === 'CONCLUIDA').length,
  };

  const byPriority = {
    ROTINA: missions.filter((m) => m.priority === 'ROTINA').length,
    ELEVADA: missions.filter((m) => m.priority === 'ELEVADA').length,
    CRITICA: missions.filter((m) => m.priority === 'CRITICA').length,
  };

  const recent = missions.slice(0, 3);
  const active = byStatus.EM_ORBITA + byStatus.CRITICA;

  return (
    <View style={styles.root}>
      <Background />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingBottom: insets.bottom + spacing.xxxl },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Cabeçalho ── */}
          <View style={styles.header}>
            <Text style={styles.kicker}>CENTRAL DE MISSÕES</Text>
            <Text style={styles.title}>Dashboard</Text>
            <View style={styles.systemRow}>
              <View
                style={[
                  styles.systemDot,
                  { backgroundColor: active > 0 ? colors.success : colors.textFaint },
                ]}
              />
              <Text style={styles.systemLabel}>
                {loading
                  ? 'Carregando…'
                  : active > 0
                    ? `${active} missão${active > 1 ? 'ões' : ''} ativa${active > 1 ? 's' : ''}`
                    : 'Nenhuma missão ativa'}
              </Text>
              {unreadCount > 0 && (
                <Pressable
                  onPress={() => router.push('/(tabs)/alerts')}
                  style={styles.alertChip}
                >
                  <Text style={styles.alertChipText}>
                    {unreadCount} alerta{unreadCount > 1 ? 's' : ''}
                  </Text>
                </Pressable>
              )}
            </View>
          </View>

          {total === 0 && !loading ? (
            /* ── Estado vazio ── */
            <View style={styles.emptyBlock}>
              <Text style={styles.emptyIcon}>🛰</Text>
              <Text style={styles.emptyText}>Nenhuma missão registrada.</Text>
              <Pressable
                style={({ pressed }) => [styles.emptyBtn, pressed && { opacity: 0.7 }]}
                onPress={() => router.push('/mission/new')}
              >
                <Text style={styles.emptyBtnText}>+ Registrar primeira missão</Text>
              </Pressable>
            </View>
          ) : (
            <>
              {/* ── Cards de métricas ── */}
              <View style={styles.statsGrid}>
                <StatCard value={total} label="Total" color={colors.accent} />
                <StatCard value={byStatus.EM_ORBITA} label="Em órbita" color={colors.success} />
                <StatCard value={byStatus.CRITICA} label="Críticas" color={colors.danger} />
                <StatCard value={byStatus.CONCLUIDA} label="Concluídas" color="#9B8CFF" />
              </View>

              {/* ── Distribuição por status ── */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>STATUS DAS MISSÕES</Text>
                <View style={styles.sectionCard}>
                  {STATUS_OPTIONS.map((opt) => (
                    <StatusBar
                      key={opt.value}
                      label={opt.label}
                      count={byStatus[opt.value]}
                      total={total}
                      color={opt.tone}
                    />
                  ))}
                </View>
              </View>

              {/* ── Distribuição por prioridade ── */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>PRIORIDADE</Text>
                <View style={styles.priorityRow}>
                  {PRIORITY_OPTIONS.map((opt) => {
                    const count = byPriority[opt.value];
                    return (
                      <View
                        key={opt.value}
                        style={[
                          styles.priorityCard,
                          {
                            borderColor: withAlpha(opt.tone, 0.35),
                            backgroundColor: withAlpha(opt.tone, 0.08),
                          },
                        ]}
                      >
                        <Text style={[styles.priorityValue, { color: opt.tone }]}>
                          {count}
                        </Text>
                        <Text style={styles.priorityLabel}>{opt.label}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>

              {/* ── Missões recentes ── */}
              {recent.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionTitleRow}>
                    <Text style={styles.sectionTitle}>MISSÕES RECENTES</Text>
                    <Pressable onPress={() => router.push('/(tabs)/missions')}>
                      <Text style={styles.seeAll}>Ver todas</Text>
                    </Pressable>
                  </View>
                  {recent.map((m) => (
                    <MiniCard key={m.id} mission={m} />
                  ))}
                </View>
              )}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.void },
  safe: { flex: 1 },
  content: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg },

  // Cabeçalho
  header: { marginBottom: spacing.xl, gap: spacing.xs },
  kicker: {
    fontFamily: fonts.mono,
    fontSize: fontSize.micro,
    color: colors.accent,
    letterSpacing: 2,
  },
  title: {
    fontFamily: fonts.sans,
    fontSize: fontSize.display,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.5,
  },
  systemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  systemDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  systemLabel: {
    fontFamily: fonts.mono,
    fontSize: fontSize.small,
    color: colors.textMuted,
  },
  alertChip: {
    backgroundColor: withAlpha(colors.danger, 0.15),
    borderWidth: 1,
    borderColor: withAlpha(colors.danger, 0.4),
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  alertChipText: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.danger,
  },

  // Grid de stats
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    minWidth: 130,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  statValue: {
    fontFamily: fonts.mono,
    fontSize: 36,
    fontWeight: '700',
    lineHeight: 40,
  },
  statLabel: {
    fontFamily: fonts.mono,
    fontSize: fontSize.micro,
    color: colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  // Seções
  section: { marginBottom: spacing.xl, gap: spacing.md },
  sectionTitle: {
    fontFamily: fonts.mono,
    fontSize: fontSize.micro,
    color: colors.textFaint,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seeAll: {
    fontFamily: fonts.mono,
    fontSize: fontSize.micro,
    color: colors.accent,
    letterSpacing: 0.5,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.md,
  },

  // Status bar
  statusBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  statusBarLabel: {
    fontFamily: fonts.sans,
    fontSize: fontSize.small,
    color: colors.textMuted,
    width: 76,
  },
  statusBarTrack: {
    flex: 1,
    height: 6,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  statusBarFill: {
    height: '100%',
    borderRadius: radius.pill,
    minWidth: 4,
  },
  statusBarCount: {
    fontFamily: fonts.mono,
    fontSize: fontSize.small,
    width: 20,
    textAlign: 'right',
  },

  // Prioridade
  priorityRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  priorityCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
  },
  priorityValue: {
    fontFamily: fonts.mono,
    fontSize: 28,
    fontWeight: '700',
  },
  priorityLabel: {
    fontFamily: fonts.mono,
    fontSize: fontSize.micro,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  // Mini card de missão recente
  miniCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.xs,
  },
  miniCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  miniCardName: {
    fontFamily: fonts.sans,
    fontSize: fontSize.body,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  miniCardCode: {
    fontFamily: fonts.mono,
    fontSize: fontSize.micro,
    color: colors.accent,
    letterSpacing: 1,
  },
  miniBadge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  miniBadgeText: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  miniTimestamp: {
    fontFamily: fonts.mono,
    fontSize: fontSize.micro,
    color: colors.textFaint,
  },

  // Estado vazio
  emptyBlock: {
    paddingTop: spacing.xxxl,
    alignItems: 'center',
    gap: spacing.md,
  },
  emptyIcon: { fontSize: 48 },
  emptyText: {
    fontFamily: fonts.sans,
    fontSize: fontSize.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
  emptyBtn: {
    marginTop: spacing.sm,
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.accentBorder,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  emptyBtnText: {
    fontFamily: fonts.mono,
    fontSize: fontSize.small,
    color: colors.accent,
  },
});
