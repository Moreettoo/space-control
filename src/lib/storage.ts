import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StoredMission } from './types';

// ─── Chaves ──────────────────────────────────────────────────────────────────
const NEW_KEY = 'central-missoes:missions';    // array atual
const OLD_KEY = 'central-missoes:last-mission'; // chave legada (migração)

// ─── Helper interno ──────────────────────────────────────────────────────────

/** Lê o array do AsyncStorage. Faz migração automática do formato antigo. */
async function read(): Promise<StoredMission[]> {
  try {
    const raw = await AsyncStorage.getItem(NEW_KEY);
    if (raw) return JSON.parse(raw) as StoredMission[];

    // Migração: existia uma missão no formato legado (chave única)?
    const oldRaw = await AsyncStorage.getItem(OLD_KEY);
    if (oldRaw) {
      const old = JSON.parse(oldRaw) as Omit<StoredMission, 'id'> & { id?: string };
      const migrated: StoredMission = { ...old, id: old.id ?? old.savedAt };
      await AsyncStorage.setItem(NEW_KEY, JSON.stringify([migrated]));
      await AsyncStorage.removeItem(OLD_KEY);
      return [migrated];
    }

    return [];
  } catch {
    return [];
  }
}

/** Persiste o array inteiro no AsyncStorage. */
async function write(missions: StoredMission[]): Promise<void> {
  await AsyncStorage.setItem(NEW_KEY, JSON.stringify(missions));
}

// ─── API pública ─────────────────────────────────────────────────────────────

/** Carrega todas as missões salvas (mais recente primeiro). */
export async function loadMissions(): Promise<StoredMission[]> {
  return read();
}

/** Persiste um array completo de missões. Usado pelo MissionsContext. */
export async function saveMissions(missions: StoredMission[]): Promise<void> {
  await write(missions);
}
