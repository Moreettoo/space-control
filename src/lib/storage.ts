import AsyncStorage from '@react-native-async-storage/async-storage';
import type { MissionForm, StoredMission } from './types';

const STORAGE_KEY = 'central-missoes:last-mission';

/** Persist the mission locally, stamping it with the current time. */
export async function saveMission(form: MissionForm): Promise<StoredMission> {
  const record: StoredMission = { ...form, savedAt: new Date().toISOString() };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  return record;
}

/** Load the last saved mission, or null when nothing is stored / data is corrupt. */
export async function loadMission(): Promise<StoredMission | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredMission;
  } catch {
    return null;
  }
}

export async function clearMission(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
