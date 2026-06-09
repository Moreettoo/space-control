export type MissionStatus = 'PLANEJADA' | 'EM_ORBITA' | 'CRITICA' | 'CONCLUIDA';
export type MissionPriority = 'ROTINA' | 'ELEVADA' | 'CRITICA';

/** Free-text fields the operator types into. */
export type TextFieldKey =
  | 'name'
  | 'code'
  | 'commander'
  | 'launchDate'
  | 'crew'
  | 'altitude'
  | 'notes';

/** Every validated field (text inputs + segmented selections). */
export type FieldKey = TextFieldKey | 'status' | 'priority';

export interface MissionForm {
  name: string;
  code: string;
  commander: string;
  launchDate: string;
  crew: string;
  altitude: string;
  status: MissionStatus | null;
  priority: MissionPriority | null;
  notes: string;
}

/** A persisted mission record (form + unique id + when it was saved). */
export interface StoredMission extends MissionForm {
  id: string;      // unique identifier (generated on save)
  savedAt: string; // ISO timestamp
}

export type FieldErrors = Partial<Record<FieldKey, string>>;
export type FieldTouched = Partial<Record<FieldKey, boolean>>;

export const EMPTY_FORM: MissionForm = {
  name: '',
  code: '',
  commander: '',
  launchDate: '',
  crew: '',
  altitude: '',
  status: null,
  priority: null,
  notes: '',
};
