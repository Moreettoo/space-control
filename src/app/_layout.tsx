import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MissionsProvider } from '@/context/MissionsContext';
import { colors } from '@/lib/theme';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <MissionsProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.void },
            animation: 'fade',
          }}
        >
          {/* Grupo de abas — tela principal do app */}
          <Stack.Screen name="(tabs)" />

          {/* Formulário de nova missão — aparece full-screen sem barra de tabs */}
          <Stack.Screen
            name="mission/new"
            options={{ animation: 'slide_from_bottom' }}
          />

          {/* Formulário de edição — id dinâmico via Expo Router */}
          <Stack.Screen
            name="mission/[id]"
            options={{ animation: 'slide_from_right' }}
          />
        </Stack>
      </MissionsProvider>
    </SafeAreaProvider>
  );
}
