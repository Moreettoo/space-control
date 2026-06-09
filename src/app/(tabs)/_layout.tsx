import { Tabs } from 'expo-router';
import { colors } from '@/lib/theme';

/**
 * Layout das tabs. Cada Tabs.Screen mapeia para um arquivo dentro de (tabs)/.
 * Ícones serão adicionados no Commit 05 (polish).
 */
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Dashboard' }} />
      <Tabs.Screen name="missions" options={{ title: 'Missões' }} />
      <Tabs.Screen name="alerts" options={{ title: 'Alertas' }} />
    </Tabs>
  );
}
