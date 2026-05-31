import { useEffect, useRef, useState, type RefObject } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  LayoutChangeEvent,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Appear } from '@/components/Appear';
import { Background } from '@/components/Background';
import { FormSection } from '@/components/FormSection';
import { GhostButton } from '@/components/GhostButton';
import { Header } from '@/components/Header';
import { PrimaryButton } from '@/components/PrimaryButton';
import { SegmentedField } from '@/components/SegmentedField';
import { SuccessBanner } from '@/components/SuccessBanner';
import { TextField } from '@/components/TextField';
import { maskCode, maskDate, onlyDigits } from '@/lib/format';
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from '@/lib/options';
import { loadMission, saveMission } from '@/lib/storage';
import { colors, spacing } from '@/lib/theme';
import {
  EMPTY_FORM,
  type FieldErrors,
  type FieldKey,
  type FieldTouched,
  type MissionForm,
  type TextFieldKey,
} from '@/lib/types';
import { FIELD_ORDER, validateAll, validateField } from '@/lib/validation';

type SectionId = 'identification' | 'orbital' | 'classification';

const TEXT_MASK: Partial<Record<TextFieldKey, (value: string) => string>> = {
  code: maskCode,
  launchDate: maskDate,
  crew: (value) => onlyDigits(value, 2),
  altitude: (value) => onlyDigits(value, 5),
};

const FIELD_SECTION: Record<FieldKey, SectionId> = {
  name: 'identification',
  code: 'identification',
  commander: 'identification',
  launchDate: 'orbital',
  crew: 'orbital',
  altitude: 'orbital',
  status: 'classification',
  priority: 'classification',
  notes: 'classification',
};

/** Order used for "return key → next field" on text keyboards. */
const NEXT_FOCUS: Partial<Record<TextFieldKey, TextFieldKey>> = {
  name: 'code',
  code: 'commander',
  commander: 'launchDate',
};

const ALL_TOUCHED: FieldTouched = Object.fromEntries(
  FIELD_ORDER.map((key) => [key, true]),
) as FieldTouched;

export default function MissionFormScreen() {
  const insets = useSafeAreaInsets();

  const [form, setForm] = useState<MissionForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<FieldTouched>({});
  const [editing, setEditing] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [banner, setBanner] = useState<{ name: string; code: string; savedAt: string } | null>(null);

  const scrollRef = useRef<ScrollView>(null);
  const sectionY = useRef<Record<SectionId, number>>({
    identification: 0,
    orbital: 0,
    classification: 0,
  });

  const nameRef = useRef<TextInput | null>(null);
  const codeRef = useRef<TextInput | null>(null);
  const commanderRef = useRef<TextInput | null>(null);
  const launchDateRef = useRef<TextInput | null>(null);
  const crewRef = useRef<TextInput | null>(null);
  const altitudeRef = useRef<TextInput | null>(null);
  const notesRef = useRef<TextInput | null>(null);
  const textRefs: Record<TextFieldKey, RefObject<TextInput | null>> = {
    name: nameRef,
    code: codeRef,
    commander: commanderRef,
    launchDate: launchDateRef,
    crew: crewRef,
    altitude: altitudeRef,
    notes: notesRef,
  };

  // Prefill from the last saved mission to demonstrate the update flow.
  useEffect(() => {
    let mounted = true;
    loadMission().then((record) => {
      if (!mounted || !record) return;
      const { savedAt: storedAt, ...fields } = record;
      setForm(fields);
      setEditing(true);
      setSavedAt(storedAt);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const setSectionLayout = (id: SectionId) => (event: LayoutChangeEvent) => {
    sectionY.current[id] = event.nativeEvent.layout.y;
  };

  const changeText = (key: TextFieldKey, raw: string) => {
    const mask = TEXT_MASK[key];
    const value = mask ? mask(raw) : raw;
    const next = { ...form, [key]: value };
    setForm(next);
    if (touched[key] || errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: validateField(key, next) ?? undefined }));
    }
  };

  const blurField = (key: FieldKey) => () => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    setErrors((prev) => ({ ...prev, [key]: validateField(key, form) ?? undefined }));
  };

  const selectField = <K extends 'status' | 'priority'>(key: K, value: MissionForm[K]) => {
    const next = { ...form, [key]: value };
    setForm(next);
    setTouched((prev) => ({ ...prev, [key]: true }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const focusFirstError = (key: FieldKey) => {
    const y = sectionY.current[FIELD_SECTION[key]];
    scrollRef.current?.scrollTo({ y: Math.max(y - spacing.md, 0), animated: true });
    const ref = textRefs[key as TextFieldKey];
    if (ref?.current) {
      requestAnimationFrame(() => ref.current?.focus());
    }
  };

  const handleSubmit = async () => {
    const nextErrors = validateAll(form);
    setErrors(nextErrors);
    setTouched(ALL_TOUCHED);

    const firstError = FIELD_ORDER.find((key) => nextErrors[key]);
    if (firstError) {
      focusFirstError(firstError);
      return;
    }

    setSaving(true);
    try {
      const record = await saveMission(form);
      setEditing(true);
      setSavedAt(record.savedAt);
      setBanner({ name: form.name.trim(), code: form.code.trim(), savedAt: record.savedAt });
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    } catch {
      Alert.alert('Falha ao salvar', 'Não foi possível registrar a missão. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleClear = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setTouched({});
    setEditing(false);
    setSavedAt(null);
    setBanner(null);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <View style={styles.root}>
      <Background />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xxxl }]}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.column}>
              <Appear>
                <Header editing={editing} savedAt={savedAt} />
              </Appear>

              {banner ? (
                <SuccessBanner
                  missionName={banner.name}
                  missionCode={banner.code}
                  savedAt={banner.savedAt}
                  onDismiss={() => setBanner(null)}
                />
              ) : null}

              <View style={styles.sections}>
                <View onLayout={setSectionLayout('identification')}>
                  <Appear delay={60}>
                    <FormSection index="01" title="Identificação" caption="Quem é a missão e quem a comanda.">
                      <TextField
                        ref={nameRef}
                        label="Nome da missão"
                        value={form.name}
                        onChangeText={(text) => changeText('name', text)}
                        onBlur={blurField('name')}
                        onSubmitEditing={() => textRefs[NEXT_FOCUS.name!]?.current?.focus()}
                        error={touched.name ? errors.name : undefined}
                        helper="De 3 a 60 caracteres."
                        placeholder="Ex.: Ares IX…"
                        autoCapitalize="words"
                        autoCorrect={false}
                        returnKeyType="next"
                        maxLength={60}
                      />
                      <TextField
                        ref={codeRef}
                        label="Código de designação"
                        value={form.code}
                        onChangeText={(text) => changeText('code', text)}
                        onBlur={blurField('code')}
                        onSubmitEditing={() => textRefs[NEXT_FOCUS.code!]?.current?.focus()}
                        error={touched.code ? errors.code : undefined}
                        helper="Formato AAA-00 (ex.: ARES-09)."
                        placeholder="ARES-09…"
                        autoCapitalize="characters"
                        autoCorrect={false}
                        autoComplete="off"
                        spellCheck={false}
                        returnKeyType="next"
                        maxLength={8}
                      />
                      <TextField
                        ref={commanderRef}
                        label="Comandante"
                        value={form.commander}
                        onChangeText={(text) => changeText('commander', text)}
                        onBlur={blurField('commander')}
                        onSubmitEditing={() => textRefs[NEXT_FOCUS.commander!]?.current?.focus()}
                        error={touched.commander ? errors.commander : undefined}
                        helper="Responsável pela operação."
                        placeholder="Ex.: Helena Duarte…"
                        autoCapitalize="words"
                        autoCorrect={false}
                        returnKeyType="next"
                        maxLength={60}
                      />
                    </FormSection>
                  </Appear>
                </View>

                <View onLayout={setSectionLayout('orbital')}>
                  <Appear delay={120}>
                    <FormSection index="02" title="Parâmetros orbitais" caption="Lançamento, tripulação e altitude.">
                      <TextField
                        ref={launchDateRef}
                        label="Data de lançamento"
                        value={form.launchDate}
                        onChangeText={(text) => changeText('launchDate', text)}
                        onBlur={blurField('launchDate')}
                        error={touched.launchDate ? errors.launchDate : undefined}
                        helper="Formato DD/MM/AAAA."
                        placeholder="DD/MM/AAAA…"
                        keyboardType="number-pad"
                        autoComplete="off"
                        maxLength={10}
                      />
                      <View style={styles.row}>
                        <View style={styles.rowItem}>
                          <TextField
                            ref={crewRef}
                            label="Tripulantes"
                            value={form.crew}
                            onChangeText={(text) => changeText('crew', text)}
                            onBlur={blurField('crew')}
                            error={touched.crew ? errors.crew : undefined}
                            helper="De 1 a 12."
                            placeholder="Ex.: 4…"
                            keyboardType="number-pad"
                            maxLength={2}
                          />
                        </View>
                        <View style={styles.rowItem}>
                          <TextField
                            ref={altitudeRef}
                            label="Altitude orbital"
                            value={form.altitude}
                            onChangeText={(text) => changeText('altitude', text)}
                            onBlur={blurField('altitude')}
                            error={touched.altitude ? errors.altitude : undefined}
                            helper="150 a 40.000 km."
                            placeholder="Ex.: 420…"
                            keyboardType="number-pad"
                            unit="km"
                            maxLength={5}
                          />
                        </View>
                      </View>
                    </FormSection>
                  </Appear>
                </View>

                <View onLayout={setSectionLayout('classification')}>
                  <Appear delay={180}>
                    <FormSection index="03" title="Classificação" caption="Estado, prioridade e observações.">
                      <SegmentedField
                        label="Status"
                        options={STATUS_OPTIONS}
                        value={form.status}
                        onChange={(value) => selectField('status', value)}
                        error={touched.status ? errors.status : undefined}
                      />
                      <SegmentedField
                        label="Prioridade"
                        options={PRIORITY_OPTIONS}
                        value={form.priority}
                        onChange={(value) => selectField('priority', value)}
                        error={touched.priority ? errors.priority : undefined}
                      />
                      <TextField
                        ref={notesRef}
                        label="Observações"
                        value={form.notes}
                        onChangeText={(text) => changeText('notes', text)}
                        onBlur={blurField('notes')}
                        error={touched.notes ? errors.notes : undefined}
                        placeholder="Janelas de comunicação, riscos, notas operacionais…"
                        optional
                        multiline
                        counter={200}
                        maxLength={200}
                      />
                    </FormSection>
                  </Appear>
                </View>
              </View>

              <Appear delay={240}>
                <View style={styles.actions}>
                  <PrimaryButton
                    label={editing ? 'Atualizar missão' : 'Registrar missão'}
                    loadingLabel="Salvando…"
                    loading={saving}
                    onPress={handleSubmit}
                  />
                  <GhostButton label="Limpar formulário" onPress={handleClear} />
                </View>
              </Appear>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.void,
  },
  flex: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  column: {
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
  },
  sections: {
    gap: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
  },
  rowItem: {
    flexGrow: 1,
    flexBasis: 150,
    minWidth: 0,
  },
  actions: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },
});
