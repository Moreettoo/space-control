import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Background } from '@/components/Background';
import { useMissions } from '@/context/MissionsContext';
import { formatTimestamp } from '@/lib/format';
import { priorityMeta, statusMeta } from '@/lib/options';
import { colors, fonts, fontSize, radius, spacing, withAlpha } from '@/lib/theme';
import type { StoredMission } from '@/lib/types';

// ─── Card individual de missão ───────────────────────────────────────────────

function MissionCard({
  mission,
  onDelete,
}: {
  mission: StoredMission;
  onDelete: () => void;
}) {
  const status = statusMeta(mission.status);
  const priority = priorityMeta(mission.priority);

  const handleDelete = () => {
    Alert.alert(
      'Excluir missão',
      `Deseja remover "${mission.name}" permanentemente?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: onDelete },
      ],
    );
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => router.push(`/mission/${mission.id}`)}
      accessibilityRole="button"
      accessibilityLabel={`Missão ${mission.name}, ${mission.code}. Toque para editar.`}
    >
      {/* Linha superior: nome + código */}
      <View style={styles.cardTop}>
        <Text style={styles.missionName} numberOfLines={1}>
          {mission.name}
        </Text>
        <Text style={styles.missionCode}>{mission.code}</Text>
      </View>

      {/* Badges de status e prioridade */}
      <View style={styles.badgeRow}>
        {status && (
          <View
            style={[
              styles.badge,
              {
                backgroundColor: withAlpha(status.tone, 0.14),
                borderColor: withAlpha(status.tone, 0.38),
              },
            ]}
          >
            <Text style={[styles.badgeText, { color: status.tone }]}>
              {status.label}
            </Text>
          </View>
        )}
        {priority && (
          <View
            style={[
              styles.badge,
              {
                backgroundColor: withAlpha(priority.tone, 0.14),
                borderColor: withAlpha(priority.tone, 0.38),
              },
            ]}
          >
            <Text style={[styles.badgeText, { color: priority.tone }]}>
              {priority.label}
            </Text>
          </View>
        )}
      </View>

      {/* Comandante + Data */}
      <View style={styles.metaRow}>
        <Text style={styles.metaText} numberOfLines={1}>
          {mission.commander}
        </Text>
        <Text style={styles.metaDot}>·</Text>
        <Text style={styles.metaText}>{mission.launchDate}</Text>
      </View>

      {/* Rodapé: timestamp + botão excluir */}
      <View style={styles.cardFooter}>
        <Text style={styles.timestamp}>
          Salvo {formatTimestamp(mission.savedAt)}
        </Text>
        <Pressable
          style={({ pressed }) => [styles.deleteBtn, pressed && styles.deleteBtnPressed]}
          onPress={handleDelete}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`Excluir missão ${mission.name}`}
        >
          <Text style={styles.deleteBtnText}>Excluir</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

// ─── Estado vazio ────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyIcon}>🛰</Text>
      <Text style={styles.emptyTitle}>Nenhuma missão registrada</Text>
      <Text style={styles.emptySub}>
        Crie a primeira missão para começar o monitoramento.
      </Text>
      <Pressable
        style={({ pressed }) => [styles.emptyBtn, pressed && styles.emptyBtnPressed]}
        onPress={() => router.push('/mission/new')}
        accessibilityRole="button"
      >
        <Text style={styles.emptyBtnText}>+ Nova missão</Text>
      </Pressable>
    </View>
  );
}

// ─── Tela principal ──────────────────────────────────────────────────────────

export default function MissionsScreen() {
  const insets = useSafeAreaInsets();
  const { missions, deleteMission, loading } = useMissions();

  return (
    <View style={styles.root}>
      <Background />
      <SafeAreaView style={styles.safe} edges={['top']}>
        {/* Cabeçalho da tela */}
        <View style={styles.screenHeader}>
          <View style={styles.titleBlock}>
            <Text style={styles.kicker}>CENTRAL DE MISSÕES</Text>
            <View style={styles.titleRow}>
              <Text style={styles.screenTitle}>Missões</Text>
              {missions.length > 0 && (
                <View style={styles.countBadge}>
                  <Text style={styles.countText}>{missions.length}</Text>
                </View>
              )}
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [styles.newBtn, pressed && styles.newBtnPressed]}
            onPress={() => router.push('/mission/new')}
            accessibilityRole="button"
            accessibilityLabel="Nova missão"
          >
            <Text style={styles.newBtnText}>+ Nova</Text>
          </Pressable>
        </View>

        {/* Lista ou estado vazio */}
        {!loading && missions.length === 0 ? (
          <EmptyState />
        ) : (
          <FlatList
            data={missions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <MissionCard
                mission={item}
                onDelete={() => deleteMission(item.id)}
              />
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

// ─── Estilos ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.void,
  },
  safe: {
    flex: 1,
  },

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
  titleBlock: {
    gap: spacing.xs,
  },
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
  countBadge: {
    backgroundColor: colors.accentSoft,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  countText: {
    fontFamily: fonts.mono,
    fontSize: fontSize.small,
    color: colors.accent,
  },
  newBtn: {
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.accentBorder,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  newBtnPressed: {
    opacity: 0.7,
  },
  newBtnText: {
    fontFamily: fonts.mono,
    fontSize: fontSize.small,
    color: colors.accent,
    letterSpacing: 0.5,
  },

  // Lista
  list: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  separator: {
    height: spacing.md,
  },

  // Card
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  cardPressed: {
    opacity: 0.82,
    borderColor: colors.accentBorder,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  missionName: {
    fontFamily: fonts.sans,
    fontSize: fontSize.large,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  missionCode: {
    fontFamily: fonts.mono,
    fontSize: fontSize.small,
    color: colors.accent,
    letterSpacing: 1,
    backgroundColor: colors.accentSoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  badge: {
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  badgeText: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metaText: {
    fontFamily: fonts.sans,
    fontSize: fontSize.small,
    color: colors.textMuted,
  },
  metaDot: {
    fontFamily: fonts.sans,
    fontSize: fontSize.small,
    color: colors.textFaint,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  timestamp: {
    fontFamily: fonts.mono,
    fontSize: fontSize.micro,
    color: colors.textFaint,
  },
  deleteBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  deleteBtnPressed: {
    backgroundColor: colors.dangerSoft,
  },
  deleteBtnText: {
    fontFamily: fonts.mono,
    fontSize: fontSize.micro,
    color: colors.danger,
    letterSpacing: 0.5,
  },

  // Estado vazio
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xxxl,
    gap: spacing.md,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
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
  emptyBtn: {
    marginTop: spacing.md,
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.accentBorder,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  emptyBtnPressed: {
    opacity: 0.7,
  },
  emptyBtnText: {
    fontFamily: fonts.mono,
    fontSize: fontSize.body,
    color: colors.accent,
    letterSpacing: 0.5,
  },
});
