import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { loadReadAlertIds, saveReadAlertIds } from '@/lib/storage';
import type { AlertType, MissionAlert, StoredMission } from '@/lib/types';
import { useMissions } from './MissionsContext';

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface AlertsContextValue {
  alerts: MissionAlert[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const AlertsContext = createContext<AlertsContextValue | null>(null);

// ─── Derivação de alertas ─────────────────────────────────────────────────────

/** Analisa "DD/MM/AAAA" → Date, retorna null para datas inválidas. */
function parseBrDate(value: string): Date | null {
  const parts = value.split('/');
  if (parts.length !== 3) return null;
  const [d, m, y] = parts.map(Number);
  if (!d || !m || !y) return null;
  const date = new Date(y, m - 1, d);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

type AlertSeed = { type: AlertType; severity: MissionAlert['severity']; message: string };

function deriveAlerts(missions: StoredMission[]): Omit<MissionAlert, 'read'>[] {
  const now = new Date();
  const alerts: Omit<MissionAlert, 'read'>[] = [];

  for (const m of missions) {
    const seeds: AlertSeed[] = [];

    // Missão em estado crítico
    if (m.status === 'CRITICA') {
      seeds.push({
        type: 'CRITICAL_STATUS',
        severity: 'CRITICAL',
        message: 'Missão em estado crítico — intervenção imediata requerida.',
      });
    }

    // Prioridade crítica e não concluída
    if (m.priority === 'CRITICA' && m.status !== 'CONCLUIDA') {
      seeds.push({
        type: 'CRITICAL_PRIORITY',
        severity: 'CRITICAL',
        message: 'Prioridade máxima ativa — monitoramento intensivo necessário.',
      });
    }

    // Data de lançamento
    const launch = parseBrDate(m.launchDate);
    if (launch) {
      const diffDays = Math.ceil(
        (launch.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (diffDays >= 0 && diffDays <= 30 && m.status === 'PLANEJADA') {
        seeds.push({
          type: 'LAUNCH_SOON',
          severity: 'WARNING',
          message: `Lançamento em ${diffDays} dia${diffDays === 1 ? '' : 's'} — verificação de prontidão recomendada.`,
        });
      }

      if (diffDays < 0 && m.status === 'PLANEJADA') {
        seeds.push({
          type: 'LAUNCH_OVERDUE',
          severity: 'CRITICAL',
          message: `Data de lançamento ultrapassada (${m.launchDate}) sem atualização de status.`,
        });
      }
    }

    // Tripulação solo
    const crew = parseInt(m.crew, 10);
    if (crew === 1 && m.status !== 'CONCLUIDA') {
      seeds.push({
        type: 'SOLO_MISSION',
        severity: 'WARNING',
        message: 'Missão com tripulante único — risco operacional elevado.',
      });
    }

    // Altitude muito alta (órbita alta / deep space)
    const altitude = parseInt(m.altitude, 10);
    if (altitude > 35000) {
      seeds.push({
        type: 'HIGH_ALTITUDE',
        severity: 'INFO',
        message: `Altitude de ${m.altitude} km — fora da órbita baixa terrestre.`,
      });
    }

    for (const seed of seeds) {
      alerts.push({
        id: `${m.id}:${seed.type}`,
        missionId: m.id,
        missionName: m.name,
        missionCode: m.code,
        type: seed.type,
        severity: seed.severity,
        message: seed.message,
        createdAt: m.savedAt,
      });
    }
  }

  // Mais recentes primeiro
  return alerts.sort((a, b) => {
    const sev = { CRITICAL: 0, WARNING: 1, INFO: 2 };
    return sev[a.severity] - sev[b.severity];
  });
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function AlertsProvider({ children }: { children: ReactNode }) {
  const { missions } = useMissions();
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);

  // Carrega IDs lidos do AsyncStorage na montagem.
  useEffect(() => {
    loadReadAlertIds().then((ids) => {
      setReadIds(new Set(ids));
      setLoaded(true);
    });
  }, []);

  // Deriva alertas toda vez que as missões mudarem.
  const derived = useMemo(() => deriveAlerts(missions), [missions]);

  // Aplica o estado lido/não-lido.
  const alerts: MissionAlert[] = useMemo(
    () => derived.map((a) => ({ ...a, read: readIds.has(a.id) })),
    [derived, readIds],
  );

  const unreadCount = useMemo(
    () => alerts.filter((a) => !a.read).length,
    [alerts],
  );

  const markAsRead = (id: string) => {
    setReadIds((prev) => {
      const next = new Set(prev).add(id);
      saveReadAlertIds([...next]);
      return next;
    });
  };

  const markAllAsRead = () => {
    const allIds = derived.map((a) => a.id);
    setReadIds(new Set(allIds));
    saveReadAlertIds(allIds);
  };

  if (!loaded) return <>{children}</>;

  return (
    <AlertsContext.Provider value={{ alerts, unreadCount, markAsRead, markAllAsRead }}>
      {children}
    </AlertsContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useAlerts(): AlertsContextValue {
  const ctx = useContext(AlertsContext);
  if (!ctx) throw new Error('useAlerts deve ser usado dentro de <AlertsProvider>');
  return ctx;
}
