import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { loadMissions, saveMissions } from '@/lib/storage';
import type { MissionForm, StoredMission } from '@/lib/types';

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface MissionsContextValue {
  /** Lista de missões em memória, mais recente primeiro. */
  missions: StoredMission[];
  /** true enquanto o carregamento inicial do AsyncStorage não terminou. */
  loading: boolean;
  /** Cria uma missão nova, persiste e retorna o registro salvo. */
  addMission: (form: MissionForm) => Promise<StoredMission>;
  /** Atualiza uma missão existente pelo id, persiste e retorna o registro. */
  updateMission: (id: string, form: MissionForm) => Promise<StoredMission>;
  /** Remove a missão com o id informado e persiste. */
  deleteMission: (id: string) => Promise<void>;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const MissionsContext = createContext<MissionsContextValue | null>(null);

// ─── Helper ──────────────────────────────────────────────────────────────────

/**
 * Gera um id único curto sem dependência externa.
 * Combina timestamp em base-36 + 5 chars aleatórios → ex.: "m0k3zx9q1"
 */
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function MissionsProvider({ children }: { children: ReactNode }) {
  const [missions, setMissions] = useState<StoredMission[]>([]);
  const [loading, setLoading] = useState(true);

  // Carrega as missões do AsyncStorage uma única vez na montagem.
  useEffect(() => {
    let active = true;
    loadMissions().then((data) => {
      if (active) {
        setMissions(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  // ── CRUD ───────────────────────────────────────────────────────────────────

  const addMission = async (form: MissionForm): Promise<StoredMission> => {
    const record: StoredMission = {
      ...form,
      id: generateId(),
      savedAt: new Date().toISOString(),
    };
    // Insere no início da lista (mais recente primeiro).
    const next = [record, ...missions];
    setMissions(next);
    await saveMissions(next);
    return record;
  };

  const updateMission = async (
    id: string,
    form: MissionForm,
  ): Promise<StoredMission> => {
    const record: StoredMission = {
      ...form,
      id,
      savedAt: new Date().toISOString(), // atualiza o timestamp de edição
    };
    const next = missions.map((m) => (m.id === id ? record : m));
    setMissions(next);
    await saveMissions(next);
    return record;
  };

  const deleteMission = async (id: string): Promise<void> => {
    const next = missions.filter((m) => m.id !== id);
    setMissions(next);
    await saveMissions(next);
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <MissionsContext.Provider
      value={{ missions, loading, addMission, updateMission, deleteMission }}
    >
      {children}
    </MissionsContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * Hook para consumir o contexto de missões em qualquer componente filho.
 * Lança erro se usado fora do MissionsProvider — falha rápida e clara.
 */
export function useMissions(): MissionsContextValue {
  const ctx = useContext(MissionsContext);
  if (!ctx) {
    throw new Error('useMissions deve ser usado dentro de <MissionsProvider>');
  }
  return ctx;
}
