import { Redirect } from 'expo-router';

/**
 * A rota raiz "/" redireciona automaticamente para as tabs.
 * O formulário foi movido para /mission/new e /mission/[id].
 */
export default function Index() {
  return <Redirect href="/(tabs)" />;
}
