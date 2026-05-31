/** Mask digits into a DD/MM/AAAA date as the operator types. */
export function maskDate(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

/** Uppercase and restrict a designation code to A–Z, 0–9 and a dash. */
export function maskCode(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 8);
}

/** Keep digits only, capped at `max` characters. */
export function onlyDigits(value: string, max = 6): string {
  return value.replace(/\D/g, '').slice(0, max);
}

/** Format an ISO timestamp as DD/MM/AAAA HH:MM (pt-BR), best-effort. */
export function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
