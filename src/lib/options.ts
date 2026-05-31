import { colors } from './theme';
import type { MissionPriority, MissionStatus } from './types';

export interface Option<T extends string> {
  value: T;
  label: string;
  /** Accent color used when the option is selected. */
  tone: string;
}

export const STATUS_OPTIONS: Option<MissionStatus>[] = [
  { value: 'PLANEJADA', label: 'Planejada', tone: '#5B9DFF' },
  { value: 'EM_ORBITA', label: 'Em órbita', tone: colors.success },
  { value: 'CRITICA', label: 'Crítica', tone: colors.danger },
  { value: 'CONCLUIDA', label: 'Concluída', tone: '#9B8CFF' },
];

export const PRIORITY_OPTIONS: Option<MissionPriority>[] = [
  { value: 'ROTINA', label: 'Rotina', tone: colors.textMuted },
  { value: 'ELEVADA', label: 'Elevada', tone: colors.warning },
  { value: 'CRITICA', label: 'Crítica', tone: colors.danger },
];

export function statusMeta(value: MissionStatus | null): Option<MissionStatus> | null {
  return STATUS_OPTIONS.find((o) => o.value === value) ?? null;
}

export function priorityMeta(value: MissionPriority | null): Option<MissionPriority> | null {
  return PRIORITY_OPTIONS.find((o) => o.value === value) ?? null;
}
