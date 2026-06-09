import { StyleSheet, Text, View } from 'react-native';
import { Background } from '@/components/Background';
import { colors, fonts, fontSize, spacing } from '@/lib/theme';

/**
 * Stub do Dashboard. Será implementado no Commit 03.
 */
export default function DashboardScreen() {
  return (
    <View style={styles.root}>
      <Background />
      <View style={styles.center}>
        <Text style={styles.label}>DASHBOARD</Text>
        <Text style={styles.sub}>Em breve — Commit 03</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.void },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.sm },
  label: {
    fontFamily: fonts.mono,
    fontSize: fontSize.large,
    color: colors.accent,
    letterSpacing: 3,
  },
  sub: {
    fontFamily: fonts.sans,
    fontSize: fontSize.small,
    color: colors.textFaint,
  },
});
