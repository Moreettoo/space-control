import type { FieldErrors, FieldKey, MissionForm } from './types';

const NAME_RE = /^[\p{L}\p{N} .,'\-/]{3,60}$/u;
const CODE_RE = /^[A-Z]{2,4}-\d{1,3}$/;
const COMMANDER_RE = /^[\p{L} .'\-]{3,60}$/u;
const DATE_RE = /^(\d{2})\/(\d{2})\/(\d{4})$/;

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function isRealDate(day: number, month: number, year: number): boolean {
  if (month < 1 || month > 12 || day < 1) return false;
  const daysInMonth = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return day <= daysInMonth[month - 1];
}

export function validateName(value: string): string | null {
  const v = value.trim();
  if (!v) return 'Informe o nome da missão.';
  if (v.length < 3) return 'Mínimo de 3 caracteres.';
  if (v.length > 60) return 'Máximo de 60 caracteres.';
  if (!NAME_RE.test(v)) return 'Use apenas letras, números e pontuação simples.';
  return null;
}

export function validateCode(value: string): string | null {
  const v = value.trim().toUpperCase();
  if (!v) return 'Informe o código de designação.';
  if (!CODE_RE.test(v)) return 'Use o formato AAA-00 (ex.: ARES-09).';
  return null;
}

export function validateCommander(value: string): string | null {
  const v = value.trim();
  if (!v) return 'Informe o comandante responsável.';
  if (v.length < 3) return 'Mínimo de 3 caracteres.';
  if (v.length > 60) return 'Máximo de 60 caracteres.';
  if (!COMMANDER_RE.test(v)) return 'Use apenas letras e espaços.';
  return null;
}

export function validateLaunchDate(value: string): string | null {
  const v = value.trim();
  if (!v) return 'Informe a data de lançamento.';
  const match = DATE_RE.exec(v);
  if (!match) return 'Use o formato DD/MM/AAAA.';
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  if (!isRealDate(day, month, year)) return 'Data inexistente no calendário.';
  if (year < 1957 || year > 2100) return 'O ano deve estar entre 1957 e 2100.';
  return null;
}

export function validateCrew(value: string): string | null {
  const v = value.trim();
  if (!v) return 'Informe o número de tripulantes.';
  if (!/^\d+$/.test(v)) return 'Use apenas números inteiros.';
  const n = Number(v);
  if (n < 1 || n > 12) return 'Deve estar entre 1 e 12 tripulantes.';
  return null;
}

export function validateAltitude(value: string): string | null {
  const v = value.trim();
  if (!v) return 'Informe a altitude orbital.';
  if (!/^\d{1,6}$/.test(v)) return 'Use apenas números, em km.';
  const n = Number(v);
  if (n < 150 || n > 40000) return 'Deve estar entre 150 e 40.000 km.';
  return null;
}

export function validateNotes(value: string): string | null {
  if (value.length > 200) return 'Máximo de 200 caracteres.';
  return null;
}

export function validateField(key: FieldKey, form: MissionForm): string | null {
  switch (key) {
    case 'name':
      return validateName(form.name);
    case 'code':
      return validateCode(form.code);
    case 'commander':
      return validateCommander(form.commander);
    case 'launchDate':
      return validateLaunchDate(form.launchDate);
    case 'crew':
      return validateCrew(form.crew);
    case 'altitude':
      return validateAltitude(form.altitude);
    case 'notes':
      return validateNotes(form.notes);
    case 'status':
      return form.status ? null : 'Selecione o status da missão.';
    case 'priority':
      return form.priority ? null : 'Selecione a prioridade.';
    default:
      return null;
  }
}

/** Field order — also used to focus the first invalid field on submit. */
export const FIELD_ORDER: FieldKey[] = [
  'name',
  'code',
  'commander',
  'launchDate',
  'crew',
  'altitude',
  'status',
  'priority',
  'notes',
];

export function validateAll(form: MissionForm): FieldErrors {
  const errors: FieldErrors = {};
  for (const key of FIELD_ORDER) {
    const error = validateField(key, form);
    if (error) errors[key] = error;
  }
  return errors;
}
