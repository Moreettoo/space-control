import { useAlerts } from '@/context/AlertsContext';
import { colors } from '@/lib/theme';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  const { unreadCount } = useAlerts();

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
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? 'grid' : 'grid-outline'}
              size={size}
              color={color as string}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="missions"
        options={{
          title: 'Missões',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? 'rocket' : 'rocket-outline'}
              size={size}
              color={color as string}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Alertas',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? 'notifications' : 'notifications-outline'}
              size={size}
              color={color as string}
            />
          ),
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
          tabBarBadgeStyle: { backgroundColor: colors.danger, fontSize: 10 },
        }}
      />
    </Tabs>
  );
}
